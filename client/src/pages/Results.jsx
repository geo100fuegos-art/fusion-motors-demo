import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBar from '../components/BrandBar.jsx'
import MotorcycleCard from '../components/MotorcycleCard.jsx'
import { recommendMotorcycles } from '../utils/recommendationEngine.js'
import { trackEvent } from '../services/analytics.js'

export default function Results() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const answers = useMemo(() => JSON.parse(sessionStorage.getItem('finder_answers') || '{}'), [])
  const recommendations = useMemo(() => recommendMotorcycles(answers), [answers])

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      trackEvent('view_results', { ids: recommendations.map(r => r.id) })
    }, 950)
    return () => clearTimeout(t)
  }, [recommendations])

  const select = (moto) => {
    sessionStorage.setItem('selected_motorcycle', JSON.stringify(moto))
    trackEvent('select_motorcycle', { motorcycleId: moto.id })
    navigate('/lead')
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div><h2>Analizando tus preferencias…</h2>
      <p>Uso · estilo · prima · presupuesto</p>
    </div>
  )

  return (
    <div>
      <BrandBar />
      <main className="results-shell">
        <div className="results-heading"><div className="kicker">COINCIDENCIAS ENCONTRADAS</div><h1>Estas opciones podrían<br/><span>encajar con vos.</span></h1><p>Resultados demostrativos basados en las respuestas seleccionadas.</p></div>
        <div className="moto-grid">{recommendations.map(m => <MotorcycleCard key={m.id} moto={m} onSelect={select} />)}</div>
      </main>
    </div>
  )
}
