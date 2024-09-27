const express = require('express');
const hanspell = require('hanspell');
const bodyParser = require('body-parser');
const cors = require('cors');  // cors 모듈을 가져옵니다.

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 요청을 허용할 출처
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 요청 헤더
}));

// 모든 경로에 대해 OPTIONS 메서드를 처리하도록 설정
app.options('*', cors());

app.use(bodyParser.json());

app.post('/check-spelling', (req, res) => {
  const sentence = req.body.sentence;

  hanspell.spellCheckByDAUM(sentence, 6000, (result) => {
    res.json(result);
  }, 
  (err) => {
    res.status(500).send('Spelling check error');
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
