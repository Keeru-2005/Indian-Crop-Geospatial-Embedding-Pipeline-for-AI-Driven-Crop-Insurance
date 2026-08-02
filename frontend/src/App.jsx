import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import PipelineSection from './components/PipelineSection'
import MetricsSection from './components/MetricsSection'
import ClaimValidator from './components/ClaimValidator'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <PipelineSection />
        <MetricsSection />
        <ClaimValidator />
      </main>
      <Footer />
    </div>
  )
}
