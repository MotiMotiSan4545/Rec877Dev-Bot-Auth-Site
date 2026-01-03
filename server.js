const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 設定
const PORT = process.env.PORT || 3000;
const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL || 'http://122.222.227.203:5000';
const CLOUDFLARE_SECRET = process.env.CLOUDFLARE_SECRET || 'YOUR_CLOUDFLARE_SECRET';
const VPN_API_KEY = process.env.VPN_API_KEY || ''; // 任意: proxycheck.io等のAPIキー

// 認証ページの表示
app.get('/rec877dev/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    // Botサーバーにセッションの有効性を確認
    const response = await axios.get(`${BOT_WEBHOOK_URL}/api/verify-session/${sessionId}`);
    
    if (response.data.valid) {
      res.sendFile(path.join(__dirname, 'public', 'verify.html'));
    } else {
      res.status(400).send(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>エラー - Rec877 認証</title>
          <style>
            body {
              font-family: sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
            }
            .error-box {
              background: white;
              padding: 40px;
              border-radius: 16px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 { color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h1>❌ エラー</h1>
            <p>無効なセッションまたは有効期限が切れています。</p>
            <p>Discordに戻って再度認証を開始してください。</p>
          </div>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('セッション確認エラー:', error);
    res.status(500).send('サーバーエラーが発生しました。');
  }
});

// VPNチェック
async function checkVPN(ip) {
  if (!VPN_API_KEY) {
    // APIキーが設定されていない場合はスキップ
    return { isVPN: false, message: 'VPNチェックをスキップしました' };
  }

  try {
    // proxycheck.io を使用する例
    const response = await axios.get(`https://proxycheck.io/v2/${ip}`, {
      params: {
        key: VPN_API_KEY,
        vpn: 1,
        asn: 1
      }
    });

    const data = response.data[ip];
    if (data && data.proxy === 'yes') {
      return { isVPN: true, message: 'VPN/プロキシが検出されました' };
    }

    return { isVPN: false, message: 'VPNは検出されませんでした' };
  } catch (error) {
    console.error('VPNチェックエラー:', error);
    // エラー時は通過させる(厳密にする場合はfalseに変更)
    return { isVPN: false, message: 'VPNチェック中にエラーが発生しました' };
  }
}

// CloudFlare Turnstile検証
async function verifyCFToken(token, ip) {
  try {
    const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: CLOUDFLARE_SECRET,
      response: token,
      remoteip: ip
    });

    return response.data.success;
  } catch (error) {
    console.error('CloudFlare検証エラー:', error);
    return false;
  }
}

// 認証API
app.post('/api/verify', async (req, res) => {
  const { sessionId, cfToken } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // 1. Botサーバーにセッション情報を取得
    const sessionResponse = await axios.get(`${BOT_WEBHOOK_URL}/api/verify-session/${sessionId}`);
    
    if (!sessionResponse.data.valid) {
      return res.status(400).json({ success: false, message: '無効なセッションです。' });
    }

    const { userId, guildId } = sessionResponse.data;

    // 2. VPNチェック
    const vpnCheck = await checkVPN(clientIP);
    if (vpnCheck.isVPN) {
      return res.status(403).json({ success: false, message: 'VPN接続が検出されました。VPNを無効にして再度お試しください。' });
    }

    // 3. CloudFlare Turnstile検証
    const cfValid = await verifyCFToken(cfToken, clientIP);
    if (!cfValid) {
      return res.status(403).json({ success: false, message: 'CloudFlare認証に失敗しました。' });
    }

    // 4. Botサーバーにロール付与を依頼
    const callbackResponse = await axios.post(`${BOT_WEBHOOK_URL}/api/verify-callback`, {
      sessionId,
      userId,
      guildId
    });

    if (callbackResponse.data.success) {
      res.json({ success: true, message: '認証が完了しました!' });
    } else {
      res.status(500).json({ success: false, message: 'ロール付与に失敗しました。' });
    }
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).json({ success: false, message: '認証中にエラーが発生しました。' });
  }
});

// ヘルスチェック用
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ 認証サーバー起動: ポート ${PORT}`);
  console.log(`📡 Bot Webhook URL: ${BOT_WEBHOOK_URL}`);
});
