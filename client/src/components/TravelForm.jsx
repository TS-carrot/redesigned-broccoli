import { useState } from 'react'
import '../styles/TravelForm.css'

const PREFERENCE_OPTIONS = [
  { key: 'food', label: '美食探店' },
  { key: 'nature', label: '自然风光' },
  { key: 'culture', label: '人文历史' },
  { key: 'relax', label: '休闲度假' },
  { key: 'photo', label: '拍照打卡' },
]

const FOCUS_OPTIONS = [
  { key: 'routes', label: '游玩路线', icon: '🗺️' },
  { key: 'food', label: '美食夜市', icon: '🍜' },
  { key: 'hotels', label: '住宿酒店', icon: '🏨' },
  { key: 'transport', label: '交通出行', icon: '🚄' },
]

export default function TravelForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    destination: '',
    days: 5,
    startDate: '',
    travelers: 1,
    budget: '',
    preferences: [],
    focusAreas: ['routes', 'food', 'hotels']
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handlePreferenceToggle = (key) => {
    setForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(key)
        ? prev.preferences.filter(p => p !== key)
        : [...prev.preferences, key]
    }))
  }

  const handleFocusToggle = (key) => {
    setForm(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(key)
        ? prev.focusAreas.filter(f => f !== key)
        : [...prev.focusAreas, key]
    }))
  }

  const validate = () => {
    const errs = {}
    if (!form.destination.trim()) errs.destination = '请输入目的地'
    if (!form.days || form.days < 1) errs.days = '天数至少1天'
    if (form.days > 30) errs.days = '天数不超过30天'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="form-page">
      {/* ═════════ Page 1: Hero ═════════ */}
      <section className="hero-section">
        <div className="aurora-layer aurora-deep" />
        <div className="aurora-layer aurora-mid" />
        <div className="aurora-layer aurora-light" />
        <div className="aurora-layer aurora-accent" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />

        <div className="landscape-scene">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className="landscape-svg">
            <defs>
              <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8A4D0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D4C8E8" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B7EC4" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#C4AEE0" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="mountainNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5BAE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#A88DCB" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B6BB8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#B8A0D4" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path d="M0 400 L0 270 Q100 200 240 245 Q360 195 480 235 Q580 185 700 225 Q820 175 940 215 Q1060 165 1200 210 Q1340 160 1440 200 L1440 400 Z" fill="url(#mountainFar)" />
            <path d="M0 400 L0 295 Q80 255 200 280 Q300 240 420 270 Q530 235 650 265 Q760 230 880 260 Q980 225 1100 250 Q1220 220 1340 245 Q1400 230 1440 245 L1440 400 Z" fill="url(#mountainMid)" />
            <path d="M0 400 L0 320 Q100 290 220 310 Q320 280 430 305 Q530 275 640 295 Q730 265 840 290 Q940 260 1050 280 Q1150 255 1260 270 Q1360 250 1440 265 L1440 400 Z" fill="url(#mountainNear)" />
            <path d="M0 400 L0 350 Q70 335 170 345 Q280 328 390 340 Q500 322 610 335 Q720 318 830 330 Q940 315 1050 325 Q1160 312 1280 320 Q1380 310 1440 318 L1440 400 Z" fill="url(#hillFront)" />
            <path d="M740 400 Q760 378 720 365 Q680 352 700 335 Q720 318 690 305 Q660 292 680 278" stroke="rgba(124, 58, 237, 0.18)" strokeWidth="1.8" fill="none" strokeDasharray="5 8" strokeLinecap="round" />
            <g transform="translate(180, 70) scale(0.7)" opacity="0.55">
              <ellipse cx="50" cy="48" rx="30" ry="35" fill="#E8D5F5" stroke="#C4A7FF" strokeWidth="2" />
              <path d="M25 48 Q25 75 35 78 L65 78 Q75 75 75 48" fill="none" stroke="#C4A7FF" strokeWidth="1.5" />
              <rect x="33" y="78" width="34" height="10" rx="3" fill="#D4B8E8" stroke="#C4A7FF" strokeWidth="1" />
              <line x1="36" y1="88" x2="36" y2="98" stroke="#C4A7FF" strokeWidth="1" />
              <line x1="64" y1="88" x2="64" y2="98" stroke="#C4A7FF" strokeWidth="1" />
              <line x1="50" y1="88" x2="50" y2="96" stroke="#C4A7FF" strokeWidth="0.8" />
            </g>
            <g transform="translate(1020, 50) scale(0.48)" opacity="0.4">
              <ellipse cx="50" cy="48" rx="30" ry="35" fill="#F0E4FA" stroke="#D4C4F0" strokeWidth="2" />
              <path d="M25 48 Q25 75 35 78 L65 78 Q75 75 75 48" fill="none" stroke="#D4C4F0" strokeWidth="1.5" />
              <rect x="33" y="78" width="34" height="10" rx="3" fill="#E8D8F5" stroke="#D4C4F0" strokeWidth="1" />
              <line x1="36" y1="88" x2="36" y2="98" stroke="#D4C4F0" strokeWidth="1" />
              <line x1="64" y1="88" x2="64" y2="98" stroke="#D4C4F0" strokeWidth="1" />
            </g>
            <g stroke="#8B6BB8" strokeWidth="1.3" fill="none" opacity="0.4" strokeLinecap="round">
              <path d="M310 140 Q316 135 322 140" /><path d="M335 132 Q340 127 345 132" />
              <path d="M320 148 Q328 142 336 148" /><path d="M880 110 Q885 105 890 110" />
              <path d="M895 104 Q902 98 909 104" /><path d="M870 118 Q878 112 886 118" />
              <path d="M600 175 Q608 168 616 175" /><path d="M1120 155 Q1126 150 1132 155" />
            </g>
            <circle cx="1100" cy="220" r="120" fill="rgba(255, 220, 180, 0.08)" />
            <circle cx="1100" cy="220" r="60" fill="rgba(255, 200, 150, 0.06)" />
          </svg>
        </div>

        <div className="hero-content">
          <p className="hero-badge">AI · 旅行规划</p>
          <h1 className="hero-title">经纬度漫游</h1>
          <p className="hero-desc">输入目的地，剩下的交给我们</p>
          <button className="hero-scroll-btn" onClick={scrollToForm}>
            <span className="scroll-arrow">↓</span>
            <span>开始规划</span>
          </button>
        </div>
      </section>

      {/* ═════════ Page 2: Form ═════════ */}
      <section id="form-section" className="form-section">
        <form className="travel-form" onSubmit={handleSubmit}>
          <div className="field-group field-destination">
            <label htmlFor="destination" className="field-label">你想去哪里</label>
            <div className="destination-wrap">
              <input id="destination" type="text" placeholder="南宁、北海、柳州"
                value={form.destination} onChange={(e) => handleChange('destination', e.target.value)}
                disabled={loading} autoComplete="off" />
            </div>
            {errors.destination && <span className="field-error">{errors.destination}</span>}
            <span className="field-hint">多个城市用逗号或空格分隔，例如：大理 丽江 香格里拉</span>
          </div>

          <div className="field-row-four">
            <div className="field-group">
              <label htmlFor="days" className="field-label">出行天数</label>
              <div className="days-control">
                <button type="button" className="days-btn" onClick={() => handleChange('days', Math.max(1, form.days - 1))} aria-label="减少天数">−</button>
                <div className="days-display"><span className="days-number">{form.days}</span><span className="days-unit">天</span></div>
                <button type="button" className="days-btn" onClick={() => handleChange('days', Math.min(30, form.days + 1))} aria-label="增加天数">+</button>
              </div>
              {errors.days && <span className="field-error">{errors.days}</span>}
            </div>
            <div className="field-group">
              <label htmlFor="startDate" className="field-label">出发日期</label>
              <input id="startDate" type="text" className="date-input"
                placeholder="2026/07/06"
                value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} disabled={loading} />
              <span className="field-hint">AI 会根据季节优化行程建议</span>
            </div>
            <div className="field-group">
              <label htmlFor="travelers" className="field-label">出行人数</label>
              <div className="days-control">
                <button type="button" className="days-btn" onClick={() => handleChange('travelers', Math.max(1, (form.travelers || 1) - 1))} aria-label="减少人数">−</button>
                <div className="days-display"><span className="days-number">{(form.travelers || 1)}</span><span className="days-unit">人</span></div>
                <button type="button" className="days-btn" onClick={() => handleChange('travelers', Math.min(50, (form.travelers || 1) + 1))} aria-label="增加人数">+</button>
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="budget" className="field-label">人均预算</label>
              <div className="budget-wrap">
                <span className="budget-symbol">¥</span>
                <input id="budget" type="number" min="0" step="500" placeholder="2000"
                  value={form.budget} onChange={(e) => handleChange('budget', e.target.value)} disabled={loading} />
                <span className="budget-per">/人</span>
              </div>
              <span className="field-hint">不填则由 AI 自动估算</span>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">旅行偏好</label>
            <div className="pref-grid">
              {PREFERENCE_OPTIONS.map(opt => (
                <button key={opt.key} type="button"
                  className={`pref-chip ${form.preferences.includes(opt.key) ? 'active' : ''}`}
                  onClick={() => handlePreferenceToggle(opt.key)} disabled={loading}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">重点推荐内容</label>
            <div className="focus-grid">
              {FOCUS_OPTIONS.map(opt => (
                <button key={opt.key} type="button"
                  className={`focus-chip ${form.focusAreas.includes(opt.key) ? 'active' : ''}`}
                  onClick={() => handleFocusToggle(opt.key)} disabled={loading}>
                  <span className="focus-icon">{opt.icon}</span>
                  <span className="focus-label">{opt.label}</span>
                </button>
              ))}
            </div>
            <span className="field-hint">可多选，AI 将在对应方面提供更详细的推荐</span>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (<><span className="submit-spinner" />正在生成...</>) : (<><span className="submit-icon">✦</span>生成旅行计划</>)}
          </button>
        </form>

        <footer className="form-footer"><p>由 Claude AI 驱动 · 行程仅供出行参考</p></footer>
      </section>
    </div>
  )
}
