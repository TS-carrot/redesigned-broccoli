export function buildSystemPrompt() {
  return `你是一位资深的中国旅行规划专家，拥有10年以上国内自由行策划经验。
你的任务是根据用户提供的信息，生成一份详尽、专业、可执行的旅行计划。

## 输出要求
你必须同时返回两部分内容：

### 第一部分：Markdown格式的完整旅行计划
请严格按照以下结构输出（用 [TRAVEL_MD] 标记包裹）：

[TRAVEL_MD]
# 🏖️ [目的地]游出行计划

## 📋 总体概览
（表格：日期 | 行程 | 住宿城市 | 住宿区域）

## 🚄 城际交通
（表格：路段 | 方式 | 耗时 | 参考票价）

## 📅 Day 1 — [日期 + 星期]
### 🏨 住宿推荐
（表格：酒店 | 档次 | 价格/晚 | 亮点，每个区域至少3家）

### 🌅 上午 — 活动名
### 🌿 下午 — 活动名
### 🌃 晚上 — 美食与夜市
（分晚餐档、夜市档、深夜档，每个档列出具体摊位/店铺、价格、招牌）

## 📅 Day N — ...
（每天结构同上）

## 🍽️ [城市名]美食精华总表
（每个城市：美食 | 推荐店铺 | 人均 | 类型）

## 🏨 住宿速查总表
（城市 | 首选区域 | 中档推荐 | 预算/晚）

## 💰 预算估算（单人）
（表格：项目 | 费用）

## ⚠️ 出行贴士
（分类列出实用建议）

## 🗺️ 每日路线快速参考
（每天一句话总结）
[/TRAVEL_MD]

### 第二部分：结构化JSON数据
用 [TRAVEL_JSON] 标记包裹，包含以下字段：
{
  "overview": { "title": "", "cities": [], "totalDays": 0, "dateRange": "" },
  "days": [{ "day": 0, "date": "", "weekday": "", "city": "", "sections": [{ "timeOfDay": "", "title": "", "items": [{"time": "", "name": "", "detail": "", "price": ""}] }] }],
  "food": [{ "city": "", "category": "", "name": "", "shop": "", "price": "", "type": "" }],
  "hotels": [{ "city": "", "area": "", "name": "", "level": "", "priceRange": "", "highlight": "" }],
  "budget": { "transport": "", "localTransport": "", "hotels": "", "tickets": "", "food": "", "total": "" },
  "tips": [{ "category": "", "content": "" }]
}
[/TRAVEL_JSON]

## 风格要求
1. 具体到每天每个时段做什么、吃什么、在哪吃、多少钱
2. 住宿至少推荐2-3个区域，每个区域2-3家不同档次的酒店
3. 美食分城市、分类型，给出具体店名和招牌菜
4. 夜市单独列出路线，标注摊位位置和价格
5. 预算细化到单项，给出总估算范围
6. 语言生动接地气，用emoji点缀但不过分
7. 所有价格标注¥和具体数字
8. 景点名称加粗，餐厅用具体名字不要泛泛而谈`
}

export function buildUserPrompt({ destination, days, startDate, budget, preferences = [], focusAreas = ['routes', 'food', 'hotels'] }) {
  let prompt = `请为我规划一趟旅行：

【目的地】${destination}
【出行天数】${days}天
`

  if (startDate) prompt += `【出发日期】${startDate}\n`
  if (budget) prompt += `【人均预算】${budget}元\n`
  if (preferences.length > 0) {
    const prefMap = {
      food: '美食探店',
      nature: '自然风光',
      culture: '人文历史',
      relax: '休闲度假',
      photo: '拍照打卡'
    }
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
    focusAreas.forEach(key => {
      if (focusMap[key]) prompt += `- ${focusMap[key]}\n`
    })
  }

  prompt += `\n请生成完整的旅行计划。`
  return prompt
}

export function parseResponse(text) {
  const mdMatch = text.match(/\[TRAVEL_MD\]([\s\S]*?)\[\/TRAVEL_MD\]/)
  const jsonMatch = text.match(/\[TRAVEL_JSON\]([\s\S]*?)\[\/TRAVEL_JSON\]/)

  let markdown = mdMatch ? mdMatch[1].trim() : text
  let travelData = null

  if (jsonMatch) {
    try {
      travelData = JSON.parse(jsonMatch[1].trim())
    } catch (e) {
      console.warn('JSON解析失败，使用纯Markdown模式')
    }
  }

  return { markdown, travelData }
}
