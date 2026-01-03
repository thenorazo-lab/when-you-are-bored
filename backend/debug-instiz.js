const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeInstiz() {
  try {
    console.log('🔍 인스티즈 분석 시작...\n');
    
    // 메인 페이지 확인
    const urls = [
      'https://www.instiz.net/',
      'https://www.instiz.net/pt',
      'https://www.instiz.net/pt/0',
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
        
        // 다양한 셀렉터 시도
        console.log('\n클래스 찾기:');
        console.log('- .list_subject:', $('.list_subject').length);
        console.log('- .board_list:', $('.board_list').length);
        console.log('- .realtime_popular:', $('.realtime_popular').length);
        console.log('- .tb-list:', $('.tb-list').length);
        console.log('- .memo_list:', $('.memo_list').length);
        console.log('- ul li:', $('ul li').length);
        console.log('- .list-item:', $('.list-item').length);
        
        // 테이블 구조 확인
        const tables = $('table');
        console.log('- table:', tables.length);
        
        if (tables.length > 0) {
          console.log('\n첫 번째 테이블 클래스:', tables.first().attr('class'));
        }
        
        // a 태그 찾기
        const links = $('a[href*="/pt/"]');
        console.log('\n- a[href*="/pt/"]:', links.length);
        
        if (links.length > 0) {
          console.log('\n첫 3개 링크:');
          links.slice(0, 3).each((i, elem) => {
            const $elem = $(elem);
            console.log(`${i + 1}. href:`, $elem.attr('href'));
            console.log(`   text:`, $elem.text().trim().substring(0, 50));
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

analyzeInstiz();
