import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Finder from './pages/Finder.jsx'
import Results from './pages/Results.jsx'
import Lead from './pages/Lead.jsx'
import Analytics from './pages/Analytics.jsx'
import { usePageTracking } from './services/analytics.js'

export default function App() {
  usePageTracking()
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/finder" element={<Finder />} />
      <Route path="/results" element={<Results />} />
      <Route path="/lead" element={<Lead />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  )
}
