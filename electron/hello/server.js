// Node.js �� http ���W���[����ǂݍ���
const http = require('http');

// �T�[�o�[�𐶐�
const myServer = http.createServer(requestListener = (req, res) => {
    // �A�N�Z�X�����^�[�~�i���ɏo��
    console.log(`url:${req.url}`);
    console.log(`method:${req.method}`);
    // http �w�b�_�[���o��
    res.writeHead(statusCode = 200, headers = {
        'Content-Type': 'text/html'
    });
    // ���X�|���X�{�̂��o��
    res.end(data = '<h1>Hello, Node.js!</h1>\n')
});

// �|�[�g�ԍ�:8081�Ŏ󂯕t���J�n
myServer.listen(port = 8081);
console.log("To view your app, open this link in your browser: http://localhost:" + 8081);
