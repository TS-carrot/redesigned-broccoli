import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt, parseResponse } from './prompt.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6-20250805'

app.post('/api/generate', async (req, res) => {
  const { destination, days, startDate, budget, preferences, focusAreas } = req.body

  if (!destination || !destination.trim()) {
    return res.status(400).json({ error: '请输入目的地' })
  }
  if (!days || days < 1 || days > 30) {
    return res.status(400).json({ error: '出行天数需在1-30天之间' })
  }

  try {
    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt({
      destination: destination.trim(),
      days,
      startDate,
      budget,
      preferences: preferences || [],
      focusAreas: focusAreas || ['routes', 'food', 'hotels']
    })

    console.log(`📝 生成行程: ${destination}, ${days}天`)

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    const { markdown, travelData } = parseResponse(text)

    console.log(`✅ 行程生成完成 (${text.length} 字符)`)

    res.json({ success: true, markdown, travelData, rawLength: text.length })

  } catch (error) {
    console.error('❌ API调用失败:', error.message)
    if (error.status === 401) {
      return res.status(500).json({ error: 'API Key无效，请检查 .env 文件中的 ANTHROPIC_API_KEY' })
    }
    if (error.status === 429) {
      return res.status(500).json({ error: 'API请求过于频繁，请稍后再试' })
    }
    res.status(500).json({ error: `生成失败: ${error.message}` })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: MODEL })
})

app.listen(PORT, () => {
  console.log(`🚀 旅行规划师 API 已启动: http://localhost:${PORT}`)
  console.log(`📋 API Key 状态: ${process.env.ANTHROPIC_API_KEY ? '✅ 已配置' : '❌ 未配置'}`)
})
