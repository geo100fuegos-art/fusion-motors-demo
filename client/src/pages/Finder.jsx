import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandBar from '../components/BrandBar.jsx'
import Progress from '../components/Progress.jsx'
import { trackEvent } from '../services/analytics.js'

const questions = [
  { key: 'use', title: '¿Para qué vas a usar principalmente tu moto?', options: [['trabajo','💼','Trabajo'],['delivery','📦','Delivery'],['diario','🏙️','Transporte diario'],['recreacion','🏍️','Recreación'],['potencia','⚡','Quiero más potencia']] },
  { key: 'style', title: '¿Qué estilo te llama más la atención?', options: [['scooter','🛵','Scooter'],['urbana','🏙️','Urbana'],['deportiva','🏁','Deportiva'],['doble','⛰️','Doble propósito'],['no-se','✨','No estoy seguro']] },
  { key: 'down', title: '¿Qué prima podrías considerar?', options: [['zero','$0','Busco opción $0'],['0-100','$','Hasta $100'],['100-300','$$','$100–$300'],['300plus','$$$','Más de $300']] },
  { key: 'monthly', title: '¿Cuánto podrías destinar aproximadamente al mes?', options: [['lt75','$','Menos de $75'],['75-100','$$','$75–$100'],['100-150','$$$','$100–$150'],['150plus','$$$$','Más de $150']] }
]

export default function Finder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const q = questions[step]

  const choose = (value) => {
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    trackEvent('quiz_answer', { question: q.key, answer: value })
    if (step === questions.length - 1) {
      sessionStorage.setItem('finder_answers', JSON.stringify(next))
      trackEvent('complete_quiz', next)
      navigate('/results')
    } else setStep(step + 1)
  }

  return (
    <div className="finder-page">
      <BrandBar />
      <main className="finder-shell">
        <Progress step={step + 1} />
        <div className="finder-card">
          <div className="kicker">ENCONTRÁ TU MOTO</div>
          <h2>{q.title}</h2>
          <div className="options-grid">
            {q.options.map(([value, icon, label]) => (
              <button key={value} onClick={() => choose(value)} className="option-card">
                <span>{icon}</span><strong>{label}</strong>
              </button>
            ))}
          </div>
          {step > 0 && <button className="back" onClick={() => setStep(step - 1)}>← Volver</button>}
        </div>
      </main>
    </div>
  )
}
