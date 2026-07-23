// Vercel Serverless Function — 支持 DeepSeek API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: '仅支持 POST' })

  const { destination, days, startDate, travelers, budget, preferences, focusAreas } = req.body || {}

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
      (travelers ? `，${travelers}人出行` : '') +
      (budget ? `，人均预算${budget}元` : '') +
      '\n' + extra + '\n请生成完整的旅行计划。'

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位资深的中国旅行规划专家。请用 Markdown 格式生成一份详细的旅行计划，包含每日行程、美食推荐、住宿建议、预算估算和出行贴士。用emoji点缀，语言生动。' },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 8192
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || '请求失败')
    const text = data.choices[0].message.content

    return res.json({ success: true, markdown: text })

  } catch (error) {
    return res.status(500).json({ error: '生成失败: ' + error.message })
  }
}
