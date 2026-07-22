import Anthropic from '@anthropic-ai/sdk'

function buildSystemPrompt() {
  return `你是一位资深的中国旅行规划专家，拥有10年以上国内自由行策划经验。
你的任务是根据用户提供的信息，生成一份详尽、专业、可执行的旅行计划。

请用 Markdown 格式输出完整旅行计划，严格包含以下结构：
# 目的地游出行计划
## 总体概览（表格：日期|行程|住宿城市|住宿区域）
## 城际交通（表格：路段|方式|耗时|参考票价）
## Day 1 — 每日详细行程（含住宿推荐、上午/下午/晚上活动、美食与夜市）
## Day N — ...
## 美食精华总表（每个城市：美食|推荐店铺|人均|类型）
## 住宿速查总表
## 预算估算（表格：项目|费用）
## 出行贴士
## 每日路线快速参考

风格要求：
1. 具体到每天每个时段做什么、吃什么、店铺名、价格
2. 住宿推荐2-3个区域，每个区域2-3家不同档次酒店
3. 美食分城市、分类型，给出具体店名和招牌菜
4. 夜市单独列出路线，标注摊位位置和价格
5. 预算细化到单项
6. 语言生动接地气，用emoji点缀
7. 所有价格标注¥符号`
}

function buildUserPrompt({ destination, days, startDate, budget, preferences = [], focusAreas = ['routes', 'food', 'hotels'] }) {
  let prompt = `请为我规划一趟旅行：

【目的地】${destination}
【出行天数】${days}天
`

  if (startDate) prompt += `【出发日期】${startDate}\n`
  if (budget) prompt += `【人均预算】${budget}元\n`
  if (preferences.length > 0) {
    const prefMap = { food: '美食探店', nature: '自然风光', culture: '人文历史', relax: '休闲度假', photo: '拍照打卡' }
    prompt += `【旅行偏好】${preferences.map(p => prefMap[p] || p).join('、')}\n`
  }
  if (focusAreas.length > 0) {
    const focusMap = {
      routes: '请重点规划每日游玩路线、景点安排和时间分配',
      food: '请重点推荐当地特色餐馆、夜市摊位、小吃路线和必吃清单',
      hotels: '请重点推荐各城市住宿区域、不同档次的酒店和民宿选择',
      transport: '请重点提供城际和市内交通方案、车次票价参考和出行建议'
    }
    prompt += `【重点推荐】\n`
    focusAreas.forEach(key => { if (focusMap[key]) prompt += `- ${focusMap[key]}\n` })
  }

  prompt += `\n请生成完整的旅行计划。`
  return prompt
}

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
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt({
      destination: destination.trim(),
      days: days || 3,
      startDate,
      budget,
      preferences: preferences || [],
      focusAreas: focusAreas || ['routes', 'food', 'hotels']
    })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250805',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return res.json({ success: true, markdown: text })

  } catch (error) {
    return res.status(500).json({ error: `生成失败: ${error.message}` })
  }
}
