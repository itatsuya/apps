// Node.js の http モジュールを読み込む
const http = require('http');

// サーバーを生成
const myServer = http.createServer(requestListener = (req, res) => {
    // アクセス情報をターミナルに出力
    console.log(`url:${req.url}`);
    console.log(`method:${req.method}`);
    // http ヘッダーを出力
    res.writeHead(statusCode = 200, headers = {
        'Content-Type': 'text/html'
    });
    // レスポンス本体を出力
    res.end(data = '<h1>Hello, Node.js!</h1>\n')
});

// ポート番号:8081で受け付け開始
myServer.listen(port = 8081);
console.log("To view your app, open this link in your browser: http://localhost:" + 8081);
