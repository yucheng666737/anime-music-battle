# 動漫神曲二選一（Anime Music Battle）

純前端靜態網頁版的「動漫神曲二選一」淘汰賽——把喜歡的 OP / ED / 插曲兩兩對決，一路淘汰選出冠軍！支援**單人模式**與 **Firebase 即時多人黑箱投票房**。

👉 **線上遊玩（Live Demo）**：<https://yucheng666737.github.io/anime-music-battle/>

---

## 功能特色

- **🎧 單人淘汰賽**
  - 內建 8 首範例歌單，或自由匯入自己的 YouTube 歌單。
  - **進度自動暫存**（`localStorage`）：中途關掉頁面，下次打開可直接續打。
- **👥 多人即時黑箱投票房**
  - **免註冊帳號**：背景自動使用 Firebase 匿名登入，朋友不需要準備歌單、不需要設定任何金鑰。
  - **一鍵分享邀請連結**（`?room=XXXX`）：點擊連結自動帶入房號，輸入暱稱即可進房。
  - **黑箱投票機制**：全員投完自動開票（主持人也可隨時提前開票）、支援過半票數重抽換歌、平手隨機抽籤提示、右側／下方即時積分排行榜與賽果紀錄。
  - **離線自動清理**：玩家或主持人關閉分頁會自動移出名單／關閉房間，不卡開票。
  - **原房再戰**：冠軍出爐後主持人點「再玩一次」，所有朋友留在原房間直接開下一局。
- **🎵 歌單匯入與試聽體驗**
  - 支援 YouTube 播放清單網址（`/playlist?list=...` 與 `/watch?v=...&list=PL...`）、單支影片網址、`/shorts/`、`/live/` 或 `標題 | 網址`。
  - 匯入時自動去重並過濾失效、私人及**禁止外部嵌入**的影片。
  - **參賽曲數抽樣上限**：大歌單可選擇全部上場，或隨機抽 `16 / 32 / 64 / 128` 首開賽（未抽中歌曲自動保留為候補庫）。
  - **試聽控制**：桌機支援滑鼠移入播放或點「▶ 試聽」，手機支援點「▶ 試聽」切換，一次只播一邊並自動沿用音量。
  - **⏩ 跳到副歌**：依曲長自動估算副歌時間點一鍵跳轉試聽。
  - **⚠️ 單獨換歌**：遇地區封鎖等無法播放的影片，主持人／單人模式可單獨替換該首歌曲。
- **✨ 舞台視覺效果**
  - 頂部導覽列中央放大顯示當前強數與場次（決賽自動標示 `🔥 總決賽`）。
  - 卡片進場微動畫、開票勝方聚焦轉場、冠軍雙砲彩帶特效（點擊獎盃可再放一次彩帶）。

---

## 快速遊玩說明

- **加入朋友的房間**：點開朋友傳的邀請連結（或點「多人投票房 → 加入房間」輸入房號與暱稱）即可開始，**不用任何金鑰**。
- **開房當主持人 / 單人模式**：
  - 使用範例歌單、或貼 `標題 | 網址`（一行一首）→ **不用金鑰**。
  - 想直接貼 **YouTube 播放清單網址**自動抓歌名 → 點網頁右上角 **「🔑 設定 YT 金鑰」** 填入自己的 YouTube Data API v3 金鑰（僅存在你自己的瀏覽器，不會上傳或分享給其他人）。

---

## 專案結構與金鑰安全設計

| 檔案 | 說明 | 是否提交至 Git |
|---|---|---|
| `index.html` | 主程式（**不含任何真實金鑰**） | ✅ 是 |
| `config.example.js` | 本機開發用 Firebase 設定範本 | ✅ 是 |
| `config.js` | 本機 Firebase 設定檔（已列入 `.gitignore`） | ❌ **絕對不要** |
| `database.rules.json` | Firebase Realtime Database 安全規則 | ✅ 是 |
| `build-config.mjs` | 部署時從環境變數產生 `config.js` 的腳本 | ✅ 是 |
| `.github/workflows/deploy.yml` | GitHub Pages 自動建置與部署工作流程 | ✅ 是 |
| `_headers` | Netlify / Cloudflare Pages 的 `Referrer-Policy` 設定 | ✅ 是 |

- **Firebase 設定**：由建置階段的環境變數／Secrets 產生 `config.js`，並搭配 **匿名登入 + `database.rules.json`** 保護房間、積分與黑箱投票。
- **YouTube Data API 金鑰**：**完全不放進公開網站與 Git**，改由需要使用播放清單展開功能的使用者在各自瀏覽器填寫（免費額度每天 10,000 單位，免綁信用卡）。

---

## 自行架設與部署指南

### 一、本機測試（單人模式免金鑰）

直接雙擊開啟 `index.html`（`file://`）時，YouTube 嵌入播放器常因缺少 HTTP Referer 而報錯（Error 153）。建議用任一簡易本機伺服器啟動：

```bash
# 擇一執行
python -m http.server 8080
# 或
npx serve .
```

開啟 `http://localhost:8080`，選「單人淘汰賽」→「載入 8 首範例」即可測試。

---

### 二、設定 Firebase（多人投票房，免費免綁卡）

1. 到 <https://console.firebase.google.com> 建立專案（維持預設 **Spark 免費方案**）→ 新增 **`</>` (Web)** App，取得 `firebaseConfig`。
2. 左側選 **建構 → Authentication → 登入方式 → 啟用「匿名 (Anonymous)」** 並儲存。
3. 左側選 **建構 → Realtime Database → 建立資料庫**（建議選 `asia-southeast1`）。
4. 到 **Realtime Database → 規則**，貼上本專案 [database.rules.json](./database.rules.json) 的內容並按 **發布**。
5. 本機開發：複製 `config.example.js` 為 `config.js`，填入 5 個 `firebase` 欄位（`databaseURL` 必填）。

---

### 三、申請 YouTube Data API v3（僅匯入播放清單者需要，免費免綁卡）

1. 到 <https://console.cloud.google.com> → **API 和服務 → 程式庫** → 啟用 **YouTube Data API v3**。
2. 到 **API 和服務 → 憑證 → 建立憑證 → API 金鑰**。
3. 建議點擊該金鑰設定限制：
   - **應用程式限制 → 網站（HTTP 參照網址）**：只允許你的網站網域（例如 `https://<你的帳號>.github.io/*`）與 `http://localhost:*/*`。
   - **API 限制 → 限制金鑰**：只勾選 **YouTube Data API v3**。
4. 打開網站 → 點右上角 **「🔑 設定 YT 金鑰」** 貼上儲存即可。

---

### 四、從 Git 自動部署上線（免費）

#### 方式 1：GitHub Pages（已內建 `.github/workflows/deploy.yml`）

1. 到你的 GitHub Repo → **Settings → Pages** → **Build and deployment → Source** 選 **GitHub Actions**。
2. 到 **Settings → Secrets and variables → Actions → New repository secret**，新增這 5 個 Firebase Secrets：
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_APP_ID`
3. 到 **Actions → Deploy to GitHub Pages → Run workflow**（或之後每次 `git push` 到 `main`）即會自動上線。

#### 方式 2：Cloudflare Pages / Netlify / Vercel

1. 連結 GitHub Repo，在平台的 **Environment Variables** 填入上述 5 個 Firebase 變數。
2. **Build command** 填 `node build-config.mjs`，**Publish / Output directory** 填 `.`。
