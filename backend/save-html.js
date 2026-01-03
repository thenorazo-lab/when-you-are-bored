const axios = require('axios');
const fs = require('fs');

async function saveHtml() {
  try {
    const response = await axios.get('http://web.humoruniv.com/board/humor/list.html?table=pds&pg=1', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });
    
    fs.writeFileSync('humoruniv-response.html', response.data, 'utf-8');
    console.log('✅ HTML 저장 완료: humoruniv-response.html');
    console.log(`📄 HTML 길이: ${response.data.length} 바이트`);
    console.log('\n첫 1000자:');
    console.log(response.data.substring(0, 1000));
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

saveHtml();
