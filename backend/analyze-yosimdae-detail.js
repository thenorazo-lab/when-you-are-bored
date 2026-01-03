const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeYosimdaeDetail() {
  try {
    console.log('🔍 여성시대 상세 분석...\n');
    
    // 다양한 URL 시도
    const urls = [
      'https://cafe.daum.net/subdued20club',
      'https://m.cafe.daum.net/subdued20club',
      'https://cafe.daum.net/subdued20club/_rec',
    ];
    
    for (const url of urls) {
      console.log(`\n=== 시도: ${url} ===`);
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9',
            'Referer': 'https://cafe.daum.net/',
          },
          timeout: 10000,
          maxRedirects: 5,
        });

        console.log('✅ 연결 성공! HTML 길이:', response.data.length);
        
        const $ = cheerio.load(response.data);
        
        // 모든 링크 출력
        const allLinks = $('a');
        console.log('총 링크 수:', allLinks.length);
        
        // 텍스트가 있는 링크만
        const textLinks = allLinks.filter((i, elem) => {
          const text = $(elem).text().trim();
          return text.length > 0 && text.length < 100;
        });
        
        console.log('텍스트가 있는 링크:', textLinks.length);
        
        textLinks.slice(0, 10).each((i, elem) => {
          const $elem = $(elem);
          console.log(`${i + 1}. ${$elem.text().trim()}`);
          console.log(`   ${$elem.attr('href')}`);
        });
        
        // iframe 확인
        const iframes = $('iframe');
        console.log('\niframe 수:', iframes.length);
        iframes.each((i, elem) => {
          console.log(`iframe ${i + 1}: ${$(elem).attr('src')}`);
        });
        
      } catch (err) {
        console.log('❌ 실패:', err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 전체 에러:', error.message);
  }
}

analyzeYosimdaeDetail();
