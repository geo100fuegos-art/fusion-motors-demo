import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const VISITOR_KEY = 'norynet_visitor_id'
const SESSION_KEY = 'norynet_session_id'

function randomId(prefix) {
  return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`
}

export function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = randomId('v')
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = randomId('s')
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function getRefSource() {
  const params = new URLSearchParams(window.location.search)
  const queryRef = params.get('ref') || params.get('utm_source')
  if (queryRef) localStorage.setItem('norynet_ref', queryRef)
  return queryRef || localStorage.getItem('norynet_ref') || 'direct'
}

export async function trackEvent(event, metadata = {}) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        path: window.location.pathname,
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        source: getRefSource(),
        referrer: document.referrer || null,
        metadata,
      }),
    })
  } catch {
    // La demo no debe fallar si analytics está temporalmente fuera de línea.
  }
}

export function usePageTracking() {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname !== '/analytics') {
      trackEvent('page_view', { search: location.search })
    }
  }, [location.pathname, location.search])
}
