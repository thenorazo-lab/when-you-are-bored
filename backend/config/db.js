const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB 연결 (Render에서 슬립 모드 방지용)
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/when-bored');

    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);

    // 연결 유지를 위한 핑
    setInterval(async () => {
      try {
        await mongoose.connection.db.admin().ping();
        console.log('🏓 MongoDB 핑 성공');
      } catch (error) {
        console.error('❌ MongoDB 핑 실패:', error.message);
      }
    }, 5 * 60 * 1000); // 5분마다 핑

  } catch (error) {
    console.error(`❌ MongoDB 연결 실패: ${error.message}`);
    // MongoDB 없이도 앱이 실행되도록 (샘플 데이터 사용)
    console.log('⚠️ MongoDB 없이 계속 실행됩니다 (샘플 데이터 모드)');
  }
};

module.exports = connectDB;
