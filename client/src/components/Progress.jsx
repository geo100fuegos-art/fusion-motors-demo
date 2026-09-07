export default function Progress({ step, total = 4 }) {
  return (
    <div className="progress-wrap">
      <div className="progress-meta"><span>Paso {step} de {total}</span><span>{Math.round((step / total) * 100)}%</span></div>
      <div className="progress"><div style={{ width: `${(step / total) * 100}%` }} /></div>
    </div>
  )
}
