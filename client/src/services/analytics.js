import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const VISITOR_KEY = 'norynet_visitor_id'
const SESSION_KEY = 'norynet_session_id'
const LOCAL_EVENTS_KEY = 'fusion_motors_demo_events'
const LOCAL_LEADS_KEY = 'fusion_motors_demo_leads'

function randomId(prefix) {
  return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`
}

function readLocal(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) { id = randomId('v'); localStorage.setItem(VISITOR_KEY, id) }
  return id
}

export function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) { id = randomId('s'); sessionStorage.setItem(SESSION_KEY, id) }
  return id
}

function getRefSource() {
  const params = new URLSearchParams(window.location.search)
  const queryRef = params.get('ref') || params.get('utm_source')
  if (queryRef) localStorage.setItem('norynet_ref', queryRef)
  return queryRef || localStorage.getItem('norynet_ref') || 'direct'
}

function saveLocalEvent(payload) {
  const events = readLocal(LOCAL_EVENTS_KEY)
  events.push({ id: randomId('event'), event: payload.event, path: payload.path, visitor_id: payload.visitorId, session_id: payload.sessionId, source: payload.source, referrer: payload.referrer, metadata: payload.metadata, created_at: new Date().toISOString() })
  writeLocal(LOCAL_EVENTS_KEY, events.slice(-500))
}

export function saveLocalLead(lead) {
  const leads = readLocal(LOCAL_LEADS_KEY)
  leads.push({ id: randomId('lead'), ...lead, created_at: new Date().toISOString() })
  writeLocal(LOCAL_LEADS_KEY, leads.slice(-100))
}

export function getLocalAnalytics() {
  const events = readLocal(LOCAL_EVENTS_KEY)
  const leads = readLocal(LOCAL_LEADS_KEY)
  const count = (name) => events.filter((item) => item.event === name).length
  const distinct = (values) => new Set(values.filter(Boolean)).size
  const sources = new Map()
  for (const item of events.filter((entry) => entry.event === 'page_view')) {
    const source = item.source || 'direct'
    if (!sources.has(source)) sources.set(source, new Set())
    if (item.session_id) sources.get(source).add(item.session_id)
  }
  return {
    summary: { visits: distinct(events.filter((item) => item.event === 'page_view').map((item) => item.session_id)), pageViews: count('page_view'), visitors: distinct(events.map((item) => item.visitor_id)), quizStarts: count('start_quiz'), resultsViews: count('view_results'), whatsappClicks: count('click_whatsapp'), leads: leads.length },
    sources: [...sources.entries()].map(([source, sessions]) => ({ source, visits: sessions.size })).sort((a, b) => b.visits - a.visits),
    recent: [...events].reverse().slice(0, 100),
  }
}

export async function trackEvent(event, metadata = {}) {
  const payload = { event, path: window.location.pathname + window.location.hash, visitorId: getVisitorId(), sessionId: getSessionId(), source: getRefSource(), referrer: document.referrer || null, metadata }
  try {
    const response = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (response.ok) return
  } catch {}
  saveLocalEvent(payload)
}

export function usePageTracking() {
  const location = useLocation()
  useEffect(() => { trackEvent('page_view') }, [location.pathname, location.hash])
}
