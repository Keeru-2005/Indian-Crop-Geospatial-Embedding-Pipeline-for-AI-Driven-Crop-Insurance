import { useState } from 'react'
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
  const [activeTab, setActiveTab] = useState('auditor')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Header & Tab Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ paddingBottom: '60px' }}>
        {activeTab === 'auditor' && (
          <div>
            <Hero onTryDemo={() => setActiveTab('auditor')} />
            <ClaimValidator />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div style={{ paddingTop: '20px' }}>
            <MetricsSection />
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div style={{ paddingTop: '20px' }}>
            <PipelineSection />
            <SolutionSection />
          </div>
        )}

        {activeTab === 'framework' && (
          <div style={{ paddingTop: '20px' }}>
            <ProblemSection />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
