<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rec877 認証システム</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo h1 {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .logo p {
            color: #6c757d;
            font-size: 14px;
        }

        .status {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .status-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .status-item:last-child {
            margin-bottom: 0;
        }

        .status-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-weight: bold;
        }

        .status-icon.pending {
            background: #ffc107;
            color: white;
        }

        .status-icon.success {
            background: #28a745;
            color: white;
        }

        .status-icon.error {
            background: #dc3545;
            color: white;
        }

        .cf-turnstile {
            margin: 30px 0;
            display: flex;
            justify-content: center;
        }

        .verify-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .verify-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .verify-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            display: none;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .loading {
            display: none;
            text-align: center;
            margin-top: 20px;
        }

        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🔐 Rec877 認証</h1>
            <p>安全な認証システム</p>
        </div>

        <div class="status">
            <div class="status-item">
                <div class="status-icon pending" id="vpn-status">⏳</div>
                <span>VPN検出チェック</span>
            </div>
            <div class="status-item">
                <div class="status-icon pending" id="cf-status">⏳</div>
                <span>CloudFlare認証</span>
            </div>
        </div>

        <div class="cf-turnstile" 
             data-sitekey="0x4AAAAAACKQpWLUnna9mo5_"
             data-callback="onCFSuccess"></div>

        <button class="verify-btn" id="verify-btn" disabled>認証を完了する</button>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p style="margin-top: 10px; color: #6c757d;">認証処理中...</p>
        </div>

        <div class="message" id="message"></div>
    </div>

    <script>
        let cfToken = null;
        let vpnChecked = false;
        const sessionId = window.location.pathname.split('/').pop();

        // VPNチェック
        async function checkVPN() {
            try {
                // サーバー側でVPNチェックを行うため、ここでは単にフラグを立てる
                await new Promise(resolve => setTimeout(resolve, 500));
                
                vpnChecked = true;
                document.getElementById('vpn-status').classList.remove('pending');
                document.getElementById('vpn-status').classList.add('success');
                document.getElementById('vpn-status').textContent = '✓';
                
                updateVerifyButton();
            } catch (error) {
                document.getElementById('vpn-status').classList.remove('pending');
                document.getElementById('vpn-status').classList.add('error');
                document.getElementById('vpn-status').textContent = '✗';
                showMessage('初期化エラーが発生しました。', 'error');
            }
        }

        // CloudFlare Turnstile成功コールバック
        function onCFSuccess(token) {
            cfToken = token;
            document.getElementById('cf-status').classList.remove('pending');
            document.getElementById('cf-status').classList.add('success');
            document.getElementById('cf-status').textContent = '✓';
            updateVerifyButton();
        }

        function updateVerifyButton() {
            const btn = document.getElementById('verify-btn');
            if (vpnChecked && cfToken) {
                btn.disabled = false;
            }
        }

        function showMessage(text, type) {
            const message = document.getElementById('message');
            message.textContent = text;
            message.className = `message ${type}`;
            message.style.display = 'block';
        }

        document.getElementById('verify-btn').addEventListener('click', async () => {
            const btn = document.getElementById('verify-btn');
            const loading = document.getElementById('loading');
            
            btn.disabled = true;
            loading.style.display = 'block';

            try {
                const response = await fetch('/api/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        cfToken: cfToken
                    })
                });

                const data = await response.json();
                loading.style.display = 'none';

                if (data.success) {
                    showMessage('✅ 認証が完了しました! このページを閉じてDiscordに戻ってください。', 'success');
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                } else {
                    showMessage('❌ ' + data.message, 'error');
                    btn.disabled = false;
                }
            } catch (error) {
                loading.style.display = 'none';
                showMessage('❌ 認証中にエラーが発生しました。もう一度お試しください。', 'error');
                btn.disabled = false;
            }
        });

        // ページ読み込み時にVPNチェック開始
        checkVPN();
    </script>
</body>
</html>
