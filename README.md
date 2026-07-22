# 经纬度漫游 — AI旅行规划师

输入目的地，AI 自动生成详细旅行计划。每日行程、美食夜市、住宿推荐、预算估算一应俱全。

## 在线使用

访问 https://你的用户名.github.io/travel-planner

> 首次使用需要在页面中配置 API Key（存储在浏览器本地，不会上传）。

## 本地运行

```bash
# 1. 启动后端
cd server && npm install && node index.js

# 2. 启动前端
cd client && npm install && npm run dev

# 3. 打开 http://localhost:5173
```

## 技术栈

- React + Vite（前端）
- Express + Claude API（后端）
- GitHub Pages + Vercel（部署）
