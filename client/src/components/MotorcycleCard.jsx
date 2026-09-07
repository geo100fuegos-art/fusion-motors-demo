import { trackEvent } from '../services/analytics.js'

export default function MotorcycleCard({ moto, onSelect }) {
  const choose = () => {
    trackEvent('select_motorcycle', { motorcycleId: moto.id, model: moto.model })
    onSelect(moto)
  }
  return (
    <article className="moto-card">
      <img src={moto.image} alt={`${moto.brand} ${moto.model}`} />
      <div className="moto-body">
        <div className="eyebrow">{moto.cc} cc · {moto.type}</div>
        <h3>{moto.model}</h3>
        <p>{moto.description}</p>
        <div className="price">Desde ${moto.price.toLocaleString()} <small>referencia*</small></div>
        <ul>
          <li>✓ Coincide con tus preferencias</li>
          <li>✓ Dentro de un rango orientativo</li>
          <li>✓ Consultable con opciones de financiamiento</li>
        </ul>
        <button className="primary full" onClick={choose}>ME INTERESA</button>
      </div>
    </article>
  )
}
