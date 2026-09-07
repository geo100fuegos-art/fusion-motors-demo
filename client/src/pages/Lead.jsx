import { useState } from 'react'
import BrandBar from '../components/BrandBar.jsx'
import { trackEvent } from '../services/analytics.js'

export default function Lead() {
  const moto = JSON.parse(sessionStorage.getItem('selected_motorcycle') || '{}')
  const answers = JSON.parse(sessionStorage.getItem('finder_answers') || '{}')
  const [form, setForm] = useState({ name: '', phone: '', location: '', purchaseMode: 'financiamiento', consent: false })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); if (!form.consent) return
    setSending(true)
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, motorcycle: moto, answers }) })
      if (!res.ok) throw new Error('No se pudo guardar')
      trackEvent('submit_lead', { motorcycleId: moto.id, purchaseMode: form.purchaseMode })
      setSubmitted(true)
    } catch { alert('No pudimos guardar el prospecto. Intentá de nuevo.') }
    finally { setSending(false) }
  }

  const whatsapp = () => {
    trackEvent('click_whatsapp', { motorcycleId: moto.id })
    window.open('https://wa.me/50378810811?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20una%20moto.', '_blank')
  }

  if (submitted) return (
    <div><BrandBar/><main className="lead-shell"><section className="crm-card"><div className="crm-top"><span>NUEVO PROSPECTO</span><b>🔥 INTERÉS ALTO</b></div><h1>{form.name}</h1><div className="crm-grid"><div><small>Interés</small><strong>{moto.model}</strong></div><div><small>Uso</small><strong>{answers.use}</strong></div><div><small>Prima</small><strong>{answers.down}</strong></div><div><small>Presupuesto</small><strong>{answers.monthly}</strong></div><div><small>Ubicación</small><strong>{form.location}</strong></div><div><small>Compra</small><strong>{form.purchaseMode}</strong></div></div><p className="crm-note">Así recibiría el asesor contexto comercial antes de iniciar la conversación.</p><button className="primary full" onClick={whatsapp}>CONTACTAR POR WHATSAPP</button></section></main></div>
  )

  return (
    <div><BrandBar/><main className="lead-shell"><section className="lead-card"><div className="selected"><img src={moto.image} alt={moto.model}/><div><small>TE INTERESA</small><h2>{moto.model}</h2><p>{moto.cc} cc · {moto.type}</p></div></div><h1>Dejá tus datos para recibir asesoría</h1><form onSubmit={submit}><label>Nombre completo<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Teléfono<input required inputMode="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Municipio / departamento<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><label>¿Cómo te interesa comprar?<select value={form.purchaseMode} onChange={e=>setForm({...form,purchaseMode:e.target.value})}><option value="financiamiento">Financiamiento</option><option value="contado">Contado</option><option value="no-se">Quiero asesoría</option></select></label><label className="consent"><input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/><span>Acepto ser contactado para recibir información. Esta es una demo conceptual.</span></label><button className="primary full" disabled={sending || !form.consent}>{sending ? 'ENVIANDO…' : 'SOLICITAR ASESORÍA'}</button></form></section></main></div>
  )
}
