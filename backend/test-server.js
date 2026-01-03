const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Server is working!' });
});

app.get('/api/hot-issues/:siteId', (req, res) => {
  console.log('API endpoint hit:', req.params.siteId);
  res.json([
    {
      id: 1,
      title: "테스트 데이터",
      source: "테스트",
      views: "100",
      comments: "10",
      url: "#"
    }
  ]);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 테스트 서버가 http://localhost:${PORT} 에서 실행중`);
  console.log(`✅ 한글 경로 테스트: ${__dirname}`);
});

server.on('error', (error) => {
  console.error('❌ 서버 에러:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});
