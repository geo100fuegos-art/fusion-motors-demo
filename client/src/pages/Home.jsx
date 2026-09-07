import { useNavigate } from 'react-router-dom'
import BrandBar from '../components/BrandBar.jsx'
import Footer from '../components/Footer.jsx'
import { trackEvent } from '../services/analytics.js'

export default function Home() {
  const navigate = useNavigate()
  const start = () => { trackEvent('start_quiz'); navigate('/finder') }
  return (
    <div>
      <BrandBar />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker">TU PRÓXIMA MOTO PODRÍA ESTAR MÁS CERCA</div>
            <h1>ENCONTRÁ TU<br/><span>MOTO IDEAL</span></h1>
            <p>Respondé 4 preguntas y descubrí opciones que podrían ajustarse a tu uso, estilo y presupuesto.</p>
            <button className="primary" onClick={start}>ENCONTRAR MI MOTO →</button>
            <div className="micro">Orientación demostrativa · sin compromiso</div>
          </div>
          <div className="hero-visual" aria-label="Motocicleta deportiva">
            <div className="glow"></div>
            <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=85" alt="Motocicleta" />
          </div>
        </section>
        <section className="trust-grid">
          <div><strong>200+</strong><span>modelos anunciados</span></div>
          <div><strong>21</strong><span>marcas anunciadas</span></div>
          <div><strong>7</strong><span>alternativas financieras anunciadas</span></div>
        </section>
        <section className="how">
          <div className="section-title"><span>ASÍ FUNCIONA</span><h2>Menos búsqueda.<br/>Más claridad.</h2></div>
          <div className="steps-grid">
            <div><b>01</b><h3>Contanos qué necesitás</h3><p>Uso, estilo y presupuesto en cuatro pasos simples.</p></div>
            <div><b>02</b><h3>Revisamos coincidencias</h3><p>La demo ordena opciones según tus respuestas.</p></div>
            <div><b>03</b><h3>Elegí y pedí asesoría</h3><p>El asesor recibe un prospecto con contexto comercial.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
