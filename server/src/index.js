import express from 'express'
import helmet from 'helmet'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { databaseMode, getAnalytics, initDb, saveEvent, saveLead } from './db.js'

const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.resolve(__dirname, '../../client/dist')

app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: '100kb' }))

function hashIp(ip='') {
  const salt = process.env.IP_HASH_SALT || 'demo-local-salt'
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 24)
}

app.get('/api/health', (_req, res) => res.json({ ok: true, database: databaseMode }))

app.post('/api/track', async (req, res) => {
  const { event, path: urlPath, visitorId, sessionId, source, referrer, metadata } = req.body || {}
  if (!event || typeof event !== 'string') return res.status(400).json({ error: 'event_required' })
  try {
    await saveEvent({
      event,
      path: urlPath || null,
      visitorId: visitorId || null,
      sessionId: sessionId || null,
      source: source || 'direct',
      referrer: referrer || null,
      metadata: metadata || {},
      userAgent: req.get('user-agent') || null,
      ipHash: hashIp(req.ip),
    })
    res.status(204).end()
  } catch (e) {
    console.error('track error', e.message)
    res.status(500).json({ error: 'tracking_failed' })
  }
})

app.post('/api/leads', async (req, res) => {
  const { name, phone, location, purchaseMode, motorcycle, answers } = req.body || {}
  if (!name || !phone) return res.status(400).json({ error: 'name_phone_required' })
  try {
    const lead = await saveLead({
      name: name.trim().slice(0,120),
      phone: phone.trim().slice(0,40),
      location: (location||'').trim().slice(0,120),
      purchaseMode: purchaseMode || null,
      motorcycle: motorcycle || {},
      answers: answers || {},
    })
    res.status(201).json(lead)
  } catch (e) {
    console.error('lead error', e.message)
    res.status(500).json({ error: 'lead_failed' })
  }
})

app.get('/api/analytics', async (req, res) => {
  if (!process.env.ANALYTICS_ADMIN_KEY || req.get('x-admin-key') !== process.env.ANALYTICS_ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })
  try {
    res.json(await getAnalytics())
  } catch (e) {
    console.error('analytics error', e.message)
    res.status(500).json({ error: 'analytics_failed' })
  }
})

app.use(express.static(clientDist))
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))

initDb().then(() => app.listen(PORT, () => console.log(`Server ready on ${PORT} using ${databaseMode} storage`))).catch((e) => {
  console.error('Database initialization failed:', e.message)
  process.exit(1)
})
