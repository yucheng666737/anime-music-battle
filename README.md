# 動漫神曲二選一

純前端靜態網頁版「動漫神曲二選一」淘汰賽，支援單人模式與 Firebase 即時多人黑箱投票房。

---

## 檔案結構與金鑰安全設計

| 檔案 | 說明 | 是否提交至 Git |
|---|---|---|
| `index.html` | 主程式（**不含任何真實金鑰**） | ✅ 是 |
| `config.example.js` | Firebase 設定範本 | ✅ 是 |
| `config.js` | 本機 Firebase 設定檔（已列入 `.gitignore`） | ❌ **絕對不要** |
| `database.rules.json` | Firebase Realtime Database 安全規則 | ✅ 是 |
| `build-config.mjs` | 部署時從環境變數產生 `config.js` 的腳本 | ✅ 是 |
| `_headers` | Netlify / Cloudflare Pages 的 `Referrer-Policy` 設定 | ✅ 是 |

- **Firebase 設定**：多人房連線用，由 `config.js` 提供，並靠 **匿名登入 + `database.rules.json`** 保護房間與黑箱投票。
- **YouTube Data API 金鑰**：**完全不放進公開網站**。只有需要「匯入 YouTube 播放清單」的人，點網頁右上角 **「🔑 設定 YT 金鑰」** 填在自己的瀏覽器（`localStorage`）即可；加入別人房間的朋友完全不用設定。

---

## 一、本機測試（單人模式免金鑰）

直接雙擊開啟 `index.html`（`file://`）時，YouTube 嵌入播放器常因缺少 HTTP Referer 而報錯（Error 153）。建議用任一簡易本機伺服器啟動：

```bash
# 擇一執行
python -m http.server 8080
# 或
npx serve .
```

用瀏覽器開啟 `http://localhost:8080`，選「單人淘汰賽」→「載入 8 首範例」即可測試。

---

## 二、設定 Firebase（多人投票房，免費免綁卡）

1. 到 <https://console.firebase.google.com> 建立專案（維持預設 Spark 免費方案）→ 新增 **`</>` (Web)** App，取得 `firebaseConfig`。
2. 左側選 **建構 → Authentication → 開始使用 → 登入方式 → 啟用「匿名 (Anonymous)」**。
3. 左側選 **建構 → Realtime Database → 建立資料庫**（建議選 `asia-southeast1`）。
4. 到 **Realtime Database → 規則**，貼上本專案 [database.rules.json](./database.rules.json) 的內容並發布。
5. 本機開發：複製 `config.example.js` 為 `config.js`，填入 5 個 `firebase` 欄位（`databaseURL` 必填）。

---

## 三、設定 YouTube Data API v3（僅匯入播放清單者需要，免費免綁卡）

1. 到 <https://console.cloud.google.com> → **API 和服務 → 程式庫** → 啟用 **YouTube Data API v3**。
2. 到 **API 和服務 → 憑證 → 建立憑證 → API 金鑰**。
3. 建議點進去設定限制：
   - **應用程式限制 → 網站（HTTP 參照網址）**：只允許你的網站網址與 `http://localhost:*/*`
   - **API 限制 → 限制金鑰**：只勾選 **YouTube Data API v3**
4. 打開本網站 → 點右上角 **「🔑 設定 YT 金鑰」** 貼上並儲存（只會保存在你自己的瀏覽器，下次自動記住）。

> 沒填 YouTube 金鑰也能當主持人或玩單人模式，只需改用 `標題 | 網址` 一行一首貼上即可。

---

## 四、從 Git 自動部署上線（免費）

### 方式 1：GitHub Pages（已內建 `.github/workflows/deploy.yml`）

1. 到你的 GitHub Repo → **Settings → Pages** → **Build and deployment → Source** 選 **GitHub Actions**。
2. 到 **Settings → Secrets and variables → Actions → New repository secret**，依序新增這 5 個 Firebase Secrets：
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_APP_ID`
3. 到 **Actions → Deploy to GitHub Pages → Run workflow**（或之後每次 `git push` 到 `main`）就會自動建置並上線至：
   `https://<你的GitHub帳號>.github.io/<專案名稱>/`

### 方式 2：Cloudflare Pages / Netlify / Vercel

把專案推上 GitHub（確認 `git status` **沒有** `config.js`）後，連結到 **Cloudflare Pages / Netlify / Vercel**：

1. 在平台的 **Environment Variables（環境變數）** 填入上述 5 個 Firebase 變數。
2. **Build command（建置指令）** 填：
   ```bash
   node build-config.mjs
   ```
3. **Output / Publish directory** 填 `.`（根目錄）。
