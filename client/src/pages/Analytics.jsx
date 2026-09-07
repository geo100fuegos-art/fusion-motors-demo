import { useEffect, useState } from 'react'

export default function Analytics() {
  const [key, setKey] = useState(localStorage.getItem('analytics_key') || '')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const res = await fetch('/api/analytics', { headers: { 'x-admin-key': key } })
      if (!res.ok) throw new Error('Acceso denegado o analytics no disponible')
      const json = await res.json(); setData(json); localStorage.setItem('analytics_key', key)
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { if (key) load() }, [])

  return (
    <main className="analytics-page">
      <div className="analytics-head"><div><div className="kicker">NORYNET</div><h1>Demo Analytics</h1><p>Fusión Motors 503</p></div><div className="keybox"><input type="password" placeholder="Admin key" value={key} onChange={e=>setKey(e.target.value)}/><button onClick={load}>Ver métricas</button></div></div>
      {error && <div className="error-box">{error}</div>}
      {data && <>
        <section className="metric-grid"><div><span>🔁</span><strong>{data.summary.visits}</strong><small>Visitas / sesiones</small></div><div><span>👁</span><strong>{data.summary.pageViews}</strong><small>Páginas vistas</small></div><div><span>👤</span><strong>{data.summary.visitors}</strong><small>Visitantes aprox.</small></div><div><span>🏍️</span><strong>{data.summary.quizStarts}</strong><small>Iniciaron búsqueda</small></div><div><span>✅</span><strong>{data.summary.resultsViews}</strong><small>Vieron resultados</small></div><div><span>📲</span><strong>{data.summary.whatsappClicks}</strong><small>Clics WhatsApp</small></div><div><span>🔥</span><strong>{data.summary.leads}</strong><small>Leads enviados</small></div></section><section className="analytics-table"><h2>Visitas por fuente</h2><div className="source-list">{data.sources.map(s=><div key={s.source}><strong>{s.source}</strong><span>{s.visits} visita{s.visits===1?'':'s'}</span></div>)}</div></section>
        <section className="analytics-table"><h2>Actividad reciente</h2><div className="table-scroll"><table><thead><tr><th>Fecha</th><th>Evento</th><th>Fuente</th><th>Ruta</th><th>Visitante</th></tr></thead><tbody>{data.recent.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString()}</td><td>{r.event}</td><td>{r.source}</td><td>{r.path}</td><td>{String(r.visitor_id).slice(-8)}</td></tr>)}</tbody></table></div></section>
      </>}
    </main>
  )
}
