const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeDogdrip() {
  try {
    console.log('🔍 개드립 분석 시작...\n');
    
    const urls = [
      'https://www.dogdrip.net/',
      'https://www.dogdrip.net/dogdrip',
      'https://www.dogdrip.net/dogdrip/new',
    ];
    
    for (const url of urls) {
      console.log(`\n=== 시도: ${url} ===`);
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9',
          },
          timeout: 10000
        });

        console.log('✅ 연결 성공! HTML 길이:', response.data.length);
        
        const $ = cheerio.load(response.data);
        
        console.log('\n클래스 찾기:');
        console.log('- .ed:', $('.ed').length);
        console.log('- .card:', $('.card').length);
        console.log('- .list-table:', $('.list-table').length);
        console.log('- table:', $('table').length);
        console.log('- .title:', $('.title').length);
        console.log('- .link-reset:', $('.link-reset').length);
        console.log('- article:', $('article').length);
        
        // 게시글 링크 찾기
        const links = $('a[href*="/dogdrip/"]');
        console.log('\n- a[href*="/dogdrip/"]:', links.length);
        
        if (links.length > 0) {
          console.log('\n첫 3개 링크:');
          links.slice(0, 3).each((i, elem) => {
            const $elem = $(elem);
            const href = $elem.attr('href');
            const text = $elem.text().trim();
            console.log(`${i + 1}. href: ${href}`);
            console.log(`   text: ${text.substring(0, 60)}`);
          });
        }
        
        // 클래스 ed 확인
        const edItems = $('.ed');
        if (edItems.length > 0) {
          console.log('\n=== .ed 항목 분석 ===');
          edItems.slice(0, 2).each((i, elem) => {
            const $elem = $(elem);
            console.log(`\n.ed ${i + 1}:`);
            console.log('HTML:', $elem.html()?.substring(0, 300));
          });
        }
        
      } catch (err) {
        console.log('❌ 실패:', err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 전체 에러:', error.message);
  }
}

analyzeDogdrip();
