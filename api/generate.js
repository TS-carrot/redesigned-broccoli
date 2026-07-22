// Vercel Serverless Function — 替代 Express 后端
// 部署到 Vercel 后，前端直接调用 /api/generate

import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt, parseResponse } from '../server/prompt.js'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST' })
  }

  const { destination, days, startDate, budget, preferences, focusAreas } = req.body

  if (!destination || !destination.trim()) {
    return res.status(400).json({ error: '请输入目的地' })
  }
  if (!days || days < 1 || days > 30) {
    return res.status(400).json({ error: '出行天数需在1-30天之间' })
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt({
      destination: destination.trim(),
      days,
      startDate,
      budget,
      preferences: preferences || [],
      focusAreas: focusAreas || ['routes', 'food', 'hotels']
    })

    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6-20250805',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    const { markdown, travelData } = parseResponse(text)

    return res.json({ success: true, markdown, travelData })

  } catch (error) {
    console.error('API Error:', error.message)
    return res.status(500).json({ error: `生成失败: ${error.message}` })
  }
}
