// Vercel Serverless Function — 旅行规划 API
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `你是一位资深的中国旅行规划专家。请用 Markdown 格式生成一份详细的旅行计划，包含：
## 总体概览（日期-行程-住宿表格）
## 城际交通（路段-方式-耗时-票价表格）
## 每日详细行程（住宿推荐、上午/下午/晚上活动、具体餐馆名称和价格）
## 美食精华总表（城市-美食-推荐店铺-人均-类型表格）
## 住宿速查总表
## 预算估算表格
## 出行贴士
## 每日路线快速参考
要求：具体到店铺名和价格，用emoji点缀，语言生动接地气。`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: '仅支持 POST' })

  const { destination, days, startDate, budget, preferences, focusAreas } = req.body || {}

  if (!destination || !destination.trim()) {
    return res.status(400).json({ error: '请输入目的地' })
  }

  try {
    const prefMap = { food: '美食探店', nature: '自然风光', culture: '人文历史', relax: '休闲度假', photo: '拍照打卡' }
    const focusMap = {
      routes: '重点规划每日游玩路线、景点安排和时间分配',
      food: '重点推荐当地特色餐馆、夜市摊位、小吃路线和必吃清单',
      hotels: '重点推荐各城市住宿区域、不同档次的酒店和民宿',
      transport: '重点提供城际和市内交通方案、车次票价和出行建议'
    }

    let extra = ''
    if (preferences && preferences.length > 0) {
      extra += `【旅行偏好】${preferences.map(p => prefMap[p] || p).join('、')}\n`
    }
    if (focusAreas && focusAreas.length > 0) {
      extra += '【重点推荐】\n' + focusAreas.filter(k => focusMap[k]).map(k => `- ${focusMap[k]}`).join('\n') + '\n'
    }

    const userPrompt = `目的地：${destination.trim()}，${days || 3}天` +
      (startDate ? `，${startDate}出发` : '') +
      (budget ? `，人均预算${budget}元` : '') +
      '\n' + extra + '\n请生成完整的旅行计划。'

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250805',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const text = message.content.filter(b => b.type === 'text').map(b => b.text).join('')
    return res.json({ success: true, markdown: text })

  } catch (error) {
    return res.status(500).json({ error: '生成失败: ' + error.message })
  }
}
