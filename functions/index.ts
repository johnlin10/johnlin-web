const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs').promises
const { onRequest } = require('firebase-functions/v2/https')
const { PageInfoService } = require('./utils/pageMetadata')
// const OpenAI = require('openai')

//* Initialize
// Firebase
admin.initializeApp()
// Express
const app = express()
app.use(cors({ origin: true }))
// OpenAI
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })
app.use(express.static(path.resolve(__dirname, './build')))

//* 初始化頁面資訊服務
const pageInfoService = new PageInfoService()

// Interfaces
// 分析圖片或文字的請求
// interface AnalyzeScheduleImageRequest {
//   imageUrl: string
//   text: string
// }

// 檢測到的日程
// interface DetectedSchedule {
//   id: string
//   title: string
//   startTime: string
//   endTime: string
//   description?: string
//   location?: string
//   isAllDay: boolean
//   colorName: string
// }

//* APIs
// 重定向
exports.redirect = onRequest(async (request: any, response: any) => {
  try {
    const shortCode = request.path.split('/')[2]

    // 沒有短碼
    if (!shortCode) {
      response.status(404).send('Short code not found')
      return
    }

    const docRef = admin.firestore().collection('shortUrls').doc(shortCode)
    const doc = await docRef.get()

    // 短網址不存在
    if (!doc.exists) {
      response.status(404).send('Short code not found')
      return
    }

    const { originalUrl } = doc.data()
    response.set('Access-Control-Allow-Origin', '*')
    response.redirect(301, originalUrl) // 重定向到原網址
  } catch (error) {
    console.error('Redirect error', error)
    response.status(500).send('Internal server error')
  }
})

app.get('*', async (req: any, res: any) => {
  const filePath = path.resolve(__dirname, './build', 'index.html')
  try {
    let data = await fs.readFile(filePath, 'utf-8')
    let pageInfo = await pageInfoService.getPageInfo(req.path)

    if (!pageInfo) {
      data = data
        .replace(/__TITLE__/g, 'John Lin')
        .replace(/__THUMB__/g, '')
        .replace(/__DESCRIPTION__/g, 'Web designer and developer.')
        .replace(/__URL__/g, `https://johnlin.me${req.path}`)
        .replace(/__SITE_NAME__/g, 'John Lin')
        .replace(/__LOCALE__/g, 'zh_TW')
    } else {
      data = data
        .replace(/__TITLE__/g, pageInfo.title)
        .replace(/__THUMB__/g, pageInfo.imageUrl)
        .replace(/__DESCRIPTION__/g, pageInfo.description)
        .replace(/__URL__/g, pageInfo.url)
        .replace(/__SITE_NAME__/g, pageInfo.siteName)
        .replace(/__LOCALE__/g, pageInfo.locale)
    }

    res.send(data)
  } catch (error) {
    res.sendStatus(500)
  }
})

/**
 * 生成含有 OG 標籤的 HTML
 * @param pageInfo 頁面資訊
 * @returns HTML
 */
// function generateMetaHtml(pageInfo: any): string {
//   return `
// <!DOCTYPE html>
// <html lang="zh-TW">
// <head>
//   <meta charset="utf-8">
//   <title>${pageInfo.title}</title>
//   <meta name="description" content="${pageInfo.description}">

//   <!-- Open Graph -->
//   <meta property="og:type" content="${pageInfo.type || 'website'}">
//   <meta property="og:url" content="${pageInfo.url}">
//   <meta property="og:title" content="${pageInfo.title}">
//   <meta property="og:description" content="${pageInfo.description}">
//   <meta property="og:image" content="${pageInfo.imageUrl}">
//   <meta property="og:site_name" content="${pageInfo.siteName || ''}">
//   <meta property="og:locale" content="${pageInfo.locale || 'zh_TW'}">

//   <!-- Twitter -->
//   <meta property="twitter:card" content="summary_large_image">
//   <meta property="twitter:url" content="${pageInfo.url}">
//   <meta property="twitter:title" content="${pageInfo.title}">
//   <meta property="twitter:description" content="${pageInfo.description}">
//   <meta property="twitter:image" content="${pageInfo.imageUrl}">
// </head>
// <body>
// </body>
// </html>
//   `.trim()
// }

/**
 * 檢查是否為真實瀏覽器用戶
 */
// function checkIsRealBrowser(userAgent: string, headers: any): boolean {
//   // 如果完全沒有 User-Agent，大概率是程式化請求
//   if (!userAgent) {
//     return false
//   }

//   // 檢查 User-Agent
//   const browserPatterns = [
//     /Chrome/i,
//     /Firefox/i,
//     /Safari/i,
//     /Edge/i,
//     /Opera/i,
//     /MSIE/i,
//     /Trident/i,
//     /Mobile/i,
//     /Android/i,
//     /iPhone/i,
//     /iPad/i,
//     /Windows/i,
//     /Macintosh/i,
//     /Linux/i,
//   ]

//   // 檢查是否含有瀏覽器特徵
//   const hasBrowserSignature = browserPatterns.some((pattern) =>
//     pattern.test(userAgent)
//   )

//   // 檢查常見爬蟲標誌
//   const botPatterns = [
//     /bot/i,
//     /crawl/i,
//     /spider/i,
//     /slurp/i,
//     /facebook/i,
//     /twitter/i,
//     /linkedin/i,
//     /telegram/i,
//     /whatsapp/i,
//     /line/i,
//     /wechat/i,
//     /pinterest/i,
//     /facebookexternalhit/i,
//     /twitterbot/i,
//     /telegrambot/i,
//     /whatsappbot/i,
//     /slack/i,
//     /discord/i,
//     /snapchat/i,
//     /pinterest/i,
//     /googlebot/i,
//     /bingbot/i,
//     /yandex/i,
//     /baiduspider/i,
//     /sogou/i,
//     /exabot/i,
//     /semrush/i,
//     /ahref/i,
//     /preview/i,
//     /fetch/i,
//     /prerender/i,
//   ]
//   const isBot = botPatterns.some((pattern) => pattern.test(userAgent))

//   // 檢查常見瀏覽器標頭
//   // const hasAcceptHeader = !!headers['accept']
//   // const hasAcceptLanguage = !!headers['accept-language']
//   // const hasConnection = !!headers['connection']
//   // const hasCookie = !!headers['cookie']
//   // const hasReferer = !!headers['referer']

//   // 檢查瀏覽器指紋特徵
//   // const browserFingerprints = [
//   //   headers['sec-ch-ua'], // 用戶代理客戶端提示
//   //   headers['sec-fetch-dest'], // 請求目標
//   //   headers['sec-fetch-mode'], // 請求模式
//   //   headers['sec-fetch-site'], // 請求來源
//   //   headers['upgrade-insecure-requests'], // 升級安全請求
//   //   headers['dnt'], // 不追蹤
//   // ]

//   // const hasBrowserFingerprints = browserFingerprints.some((item) => !!item)

//   // 真實瀏覽器通常具有以下特徵：
//   // 1. 有瀏覽器標誌
//   // 2. 不是爬蟲
//   // 3. 有標準請求標頭
//   // 4. 可能有cookie或referer或現代瀏覽器指紋

//   // const hasStandardHeaders =
//   //   hasAcceptHeader && hasAcceptLanguage && hasConnection
//   // const hasExtraHeaders = hasCookie || hasReferer || hasBrowserFingerprints

//   return hasBrowserSignature && !isBot // && hasStandardHeaders && hasExtraHeaders
// }

// 分析日程圖片
// app.post('/analyzeScheduleImage', async (request, response) => {
//   const data = request.body as AnalyzeScheduleImageRequest

//   // 檢查使用者是否已登入
//   if (!request.auth) {
//     response.status(401).json({ error: '請先登入' })
//     return
//   }

//   try {
//     const openaiResponse = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         {
//           role: 'system',
//           content: `你是一位專業的日程表分析師，能夠從圖片或文字中提取出所有活動的資訊，並返回純JSON數據。
//           請分析提供的內容（可能是圖片或文字），並提取所有活動相關的資訊。返回純JSON數據，不包含任何Markdown格式或代碼塊標記。

//           重要：
//           1. 不要在輸出中包含\`\`\`json和\`\`\`這樣的標記！只輸出純JSON文本
//           2. JSON必須使用頂層物件結構，而非頂層陣列
//           3. 如果提供的是圖片，分析圖片中的活動日程
//           4. 如果提供的是文字或沒有圖片/圖片無法識別，則從文字中提取活動資訊

//           標題處理特別規則：
//           1. 標題必須具體且描述性，確保包含活動/賽事的完整名稱
//           2. 對於多階段活動（如初賽、決賽），標題格式應為「主活動名稱 - 階段名稱」
//           3. 例如：不要僅使用「初賽」作為標題，而應使用「資訊安全知識大挑戰競賽 - 初賽」
//           4. 從圖片或文字中提取主活動名稱，並與各階段/場次名稱組合
//           5. 若有多個不同的活動，確保每個活動標題都能清楚區分不同活動

//           按照以下方式提取資訊：
//           1. 識別每個獨立的活動項目
//           2. 將所有活動放入名為"schedules"的陣列中，並包裹在頂層物件內
//           3. 時間格式使用ISO 8601標準 (YYYY-MM-DDThh:mm:ss+時區)
//           4. 若內容中時間沒有日期，請在輸出時補充當天日期

//           處理開始和結束時間的特別規則：
//           今天日期：Date
//           1. 若只有一個時間點，將其設為開始時間，並自動將結束時間設為開始時間後1小時
//           2. 若有時間範圍（如"10:00-12:00"），正常提取開始和結束時間
//           3. 若完全沒有時間信息，設置為全天事件 (allDay=true)，將開始時間設為當天00:00:00，結束時間設為當天23:59:59
//           4. 若是多天事件，確保結束時間是最後一天的23:59:59

//           判斷allDay的規則：
//           1. 明確提到"全天"、"整天"、"All day"等字樣時，設為true
//           2. 沒有指定具體開始和結束時間時，設為true
//           3. 時間描述僅有日期而沒有時間部分時，設為true
//           4. 有明確的開始時間和結束時間時，設為false
//           5. 時間跨度為24小時或接近24小時時（例如00:00-23:59），設為true

//           JSON格式要求（以下只是示範格式）：

//           {
//             "schedules": [
//               {
//                 "title": "資訊安全知識大挑戰競賽 - 線上初賽",
//                 "description": "使用TronClass平台進行線上答題，90分以上方可進入決賽(取前40位)",
//                 "startTime": "2025-03-14T09:00:00+08:00",
//                 "endTime": "2025-03-14T10:00:00+08:00",
//                 "location": "線上",
//                 "note": "初賽前皆可至TronClass進行練習",
//                 "allDay": false
//               },
//               {
//                 "title": "資訊安全知識大挑戰競賽 - 現場決賽",
//                 "description": "12位晉級者，倆倆PK",
//                 "startTime": "2025-03-15T00:00:00+08:00",
//                 "endTime": "2025-03-15T23:59:59+08:00",
//                 "location": "天機5樓哈佛教室",
//                 "note": "複賽:使用Quizizz進行積分賽(取12位)",
//                 "allDay": true
//               }
//             ]
//           }

//           處理文字輸入的特別說明：
//           1. 從文字中尋找日期、時間、地點和活動描述的模式
//           2. 使用上下文和格式線索（如換行、標點符號）來區分不同活動
//           3. 將非結構化文字轉換為結構化的JSON格式
//           4. 若文字中某個活動缺少某些資訊，相應欄位設為空字串

//           特別注意：
//           1. 必須只輸出純JSON文本，不要包含任何代碼塊標記、註釋或說明
//           2. 必須使用頂層物件結構（使用大括號{}開始），而非陣列結構
//           3. 將活動放在名為"schedules"的陣列中，作為頂層物件的一個屬性
//           4. 使用標準ISO時間格式確保Shortcuts可以直接轉換為日期物件
//           5. 若任何欄位資訊不存在，使用空字串("")
//           6. allDay必須為布林值(true/false)，不要加引號
//           7. 若無法提取任何活動資訊，則返回空的schedules陣列: {"schedules":[]}
//           8. 永不省略endTime欄位，即使原始資料中沒有結束時間也要智慧生成
//           9. 標題必須包含完整的活動名稱，而非僅階段名稱，確保日曆事件一目了然`,
//         },
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'text',
//               text: data.text,
//             },
//             {
//               type: 'image_url',
//               image_url: {
//                 url: data.imageUrl,
//               },
//             },
//           ],
//         },
//       ],
//       max_tokens: 1000,
//     })

//     const result = JSON.parse(openaiResponse.choices[0].message.content || '{}')
//     response.json(result.schedules || [])
//   } catch (error) {
//     console.error('圖片分析失敗：', error)
//     response.status(500).json({ error: '圖片分析失敗' })
//   }
// })

exports.meta = onRequest(app)
