import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
dotenv.config({ path: path.join(projectRoot, '.env') })
const placeholderDatabaseUrl = 'postgresql://user:password@host:5432/database'
const databaseUrl = process.env.DATABASE_URL?.trim()

// A copied .env.example must be safe to run locally without a database.
const usePostgres = Boolean(databaseUrl && databaseUrl !== placeholderDatabaseUrl)
const pool = usePostgres
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  : null

const localStore = { nextEventId: 1, nextLeadId: 1, events: [], leads: [] }

export const databaseMode = usePostgres ? 'postgres' : 'memory'

export async function initDb() {
  if (!pool) return

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGSERIAL PRIMARY KEY,
      event TEXT NOT NULL,
      path TEXT,
      visitor_id TEXT,
      session_id TEXT,
      source TEXT,
      referrer TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS analytics_created_idx ON analytics_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS analytics_visitor_idx ON analytics_events(visitor_id);
    CREATE TABLE IF NOT EXISTS leads (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT,
      purchase_mode TEXT,
      motorcycle JSONB DEFAULT '{}'::jsonb,
      answers JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
}

export async function saveEvent(event) {
  if (pool) {
    await pool.query(
      `INSERT INTO analytics_events(event,path,visitor_id,session_id,source,referrer,metadata,user_agent,ip_hash)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [event.event, event.path, event.visitorId, event.sessionId, event.source, event.referrer, event.metadata, event.userAgent, event.ipHash]
    )
    return
  }

  localStore.events.push({
    id: localStore.nextEventId++, event: event.event, path: event.path,
    visitor_id: event.visitorId, session_id: event.sessionId, source: event.source,
    referrer: event.referrer, metadata: event.metadata, user_agent: event.userAgent,
    ip_hash: event.ipHash, created_at: new Date().toISOString(),
  })
}

export async function saveLead(lead) {
  if (pool) {
    const result = await pool.query(
      `INSERT INTO leads(name,phone,location,purchase_mode,motorcycle,answers) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, created_at`,
      [lead.name, lead.phone, lead.location, lead.purchaseMode, lead.motorcycle, lead.answers]
    )
    return result.rows[0]
  }

  const savedLead = { id: localStore.nextLeadId++, ...lead, created_at: new Date().toISOString() }
  localStore.leads.push(savedLead)
  return { id: savedLead.id, created_at: savedLead.created_at }
}

function memoryAnalytics() {
  const events = localStore.events
  const count = (eventName) => events.filter((entry) => entry.event === eventName).length
  const distinct = (values) => new Set(values.filter(Boolean)).size
  const sources = new Map()

  for (const entry of events.filter((item) => item.event === 'page_view')) {
    const source = entry.source || 'direct'
    if (!sources.has(source)) sources.set(source, new Set())
    if (entry.session_id) sources.get(source).add(entry.session_id)
  }

  return {
    summary: {
      visits: distinct(events.filter((entry) => entry.event === 'page_view').map((entry) => entry.session_id)),
      pageViews: count('page_view'),
      visitors: distinct(events.map((entry) => entry.visitor_id)),
      quizStarts: count('start_quiz'), resultsViews: count('view_results'),
      whatsappClicks: count('click_whatsapp'), leads: localStore.leads.length,
    },
    sources: [...sources.entries()].map(([source, sessions]) => ({ source, visits: sessions.size })).sort((a, b) => b.visits - a.visits),
    recent: [...events].reverse().slice(0, 100).map(({ id, event, path, visitor_id, session_id, source, created_at }) => ({ id, event, path, visitor_id, session_id, source, created_at })),
  }
}

export async function getAnalytics() {
  if (!pool) return memoryAnalytics()

  const summaryResult = await pool.query(`
    SELECT
      COUNT(DISTINCT session_id) FILTER (WHERE event='page_view' AND session_id IS NOT NULL)::int AS visits,
      COUNT(*) FILTER (WHERE event='page_view')::int AS page_views,
      COUNT(DISTINCT visitor_id) FILTER (WHERE visitor_id IS NOT NULL)::int AS visitors,
      COUNT(*) FILTER (WHERE event='start_quiz')::int AS quiz_starts,
      COUNT(*) FILTER (WHERE event='view_results')::int AS results_views,
      COUNT(*) FILTER (WHERE event='click_whatsapp')::int AS whatsapp_clicks
    FROM analytics_events
  `)
  const leadCountResult = await pool.query(`SELECT COUNT(*)::int AS leads FROM leads`)
  const sourceResult = await pool.query(`
    SELECT COALESCE(source,'direct') AS source, COUNT(DISTINCT session_id)::int AS visits
    FROM analytics_events WHERE event='page_view'
    GROUP BY COALESCE(source,'direct') ORDER BY visits DESC
  `)
  const recentResult = await pool.query(`SELECT id,event,path,visitor_id,session_id,source,created_at FROM analytics_events ORDER BY created_at DESC LIMIT 100`)
  const summary = summaryResult.rows[0]

  return {
    summary: { visits: summary.visits, pageViews: summary.page_views, visitors: summary.visitors, quizStarts: summary.quiz_starts, resultsViews: summary.results_views, whatsappClicks: summary.whatsapp_clicks, leads: leadCountResult.rows[0].leads },
    sources: sourceResult.rows,
    recent: recentResult.rows,
  }
}
