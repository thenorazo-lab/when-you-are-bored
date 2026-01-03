const axios = require('axios');
const cheerio = require('cheerio');

async function findBestPage() {
  try {
    console.log('🔍 디시인사이드 베스트 페이지 찾기...\n');
    
    // 실시간 베스트 페이지
    const urls = [
      'https://www.dcinside.com/',
      'https://gall.dcinside.com/board/lists/?id=dcbest',
      'https://www.dcinside.com/board/lists/?id=dcbest',
    ];
    
    for (const url of urls) {
      console.log(`\n=== 시도: ${url} ===`);
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
          },
          timeout: 10000
        });

        console.log('✅ 연결 성공! HTML 길이:', response.data.length);
        
        const $ = cheerio.load(response.data);
        
        // 다양한 셀렉터 시도
        console.log('\n클래스 찾기:');
        console.log('- .gall_list:', $('.gall_list').length);
        console.log('- .list_best:', $('.list_best').length);
        console.log('- .ub-content:', $('.ub-content').length);
        console.log('- tr.ub-content:', $('tr.ub-content').length);
        console.log('- .us-post:', $('.us-post').length);
        console.log('- .gall_tit:', $('.gall_tit').length);
        
        // 테이블 구조 확인
        const rows = $('tbody tr');
        console.log('- tbody tr:', rows.length);
        
        if (rows.length > 0) {
          console.log('\n첫 번째 행:');
          const first = rows.first();
          console.log(first.html()?.substring(0, 600));
        }
        
        // a 태그 찾기
        const links = $('a[href*="/board/view/"]');
        console.log('\n- a[href*="/board/view/"]:', links.length);
        
        if (links.length > 0) {
          console.log('\n첫 번째 링크:');
          const firstLink = links.first();
          console.log('- href:', firstLink.attr('href'));
          console.log('- text:', firstLink.text().trim());
        }
        
      } catch (err) {
        console.log('❌ 실패:', err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 전체 에러:', error.message);
  }
}

findBestPage();
