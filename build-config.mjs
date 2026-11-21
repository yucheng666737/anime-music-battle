// 部署建置用腳本：從環境變數產生 config.js（本地開發請複製 config.example.js 為 config.js）
// 支援 Cloudflare Pages / Netlify / Vercel / GitHub Actions：建置指令填 `node build-config.mjs`
// 註：刻意不將 YT_API_KEY 打包進公開網站，YouTube 金鑰由需要匯入播放清單的使用者在各自瀏覽器輸入。
import { writeFileSync } from 'node:fs';

const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    appId: process.env.FIREBASE_APP_ID || ''
  }
};

const content = `// Auto-generated at build time. Do not commit this file.\nwindow.APP_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
writeFileSync('config.js', content, 'utf8');
console.log('Generated config.js');
