import { useState } from 'react'
import TravelForm from './components/TravelForm'
import ItineraryView from './components/ItineraryView'
import './App.css'

function App() {
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleGenerate = async (formData) => {
    setLoading(true)
    setError('')
    setItinerary(null)
    setHasSearched(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || ''
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '请求失败')
      }

      setItinerary(data)
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('无法连接到服务器，请确保后端已启动')
      } else {
        setError(err.message || '生成失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setHasSearched(false)
    setItinerary(null)
    setError('')
  }

  return (
    <div className="app">
      {!hasSearched ? (
        <TravelForm onSubmit={handleGenerate} loading={loading} />
      ) : loading ? (
        <div className="loading-screen">
          <div className="loading-orb" />
          <p className="loading-title">正在为你绘制路线...</p>
          <p className="loading-sub">AI 正在匹配目的地、编排日程、挖掘当地美食</p>
        </div>
      ) : error ? (
        <div className="error-screen">
          <div className="error-card">
            <span className="error-icon">✕</span>
            <h3>规划中断</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={handleBack}>返回重试</button>
          </div>
        </div>
      ) : itinerary ? (
        <ItineraryView
          markdown={itinerary.markdown}
          travelData={itinerary.travelData}
          onBack={handleBack}
        />
      ) : null}
    </div>
  )
}

export default App
