import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import '../styles/ItineraryView.css'

export default function ItineraryView({ markdown, travelData, onBack }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = markdown
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `经纬度漫游_${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="result-page">
      <nav className="result-nav">
        <button className="nav-back" onClick={onBack}>← 重新规划</button>
        <span className="nav-brand">经纬度漫游</span>
        <div className="nav-actions">
          <button className="nav-btn" onClick={handleCopy}>{copied ? '已复制' : '复制'}</button>
          <button className="nav-btn primary" onClick={handleDownload}>下载 .md</button>
        </div>
      </nav>

      <article className="result-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
            h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
            table: ({ node, ...props }) => <div className="md-table-wrap"><table {...props} /></div>,
            blockquote: ({ node, ...props }) => <blockquote className="md-quote" {...props} />,
            strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>

      <div className="result-bottom">
        <button className="nav-back" onClick={onBack}>← 重新规划</button>
        <button className="nav-btn primary" onClick={handleCopy}>{copied ? '已复制' : '复制全文'}</button>
      </div>
    </div>
  )
}
