const axios = require('axios');
const cheerio = require('cheerio');

async function debugTodayhumor() {
  try {
    console.log('오늘의유머 HTML 구조 확인 중...\n');
    
    // 베스트 게시판 URL
    const response = await axios.get('https://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log(`📄 HTML 길이: ${response.data.length} 바이트\n`);
    
    const $ = cheerio.load(response.data);
    
    // 다양한 선택자 시도
    console.log('=== 테스트 1: .table_list 클래스 ===');
    console.log('개수:', $('.table_list').length);
    
    console.log('\n=== 테스트 2: table 내 tr 개수 ===');
    console.log('개수:', $('table tr').length);
    
    console.log('\n=== 테스트 3: 게시글 링크 찾기 (처음 5개) ===');
    $('a[href*="view.php"]').slice(0, 5).each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text) {
        console.log(`${i+1}. 제목: ${text.substring(0, 50)}`);
        console.log(`   링크: ${href}\n`);
      }
    });
    
    console.log('\n=== 테스트 4: subject 클래스 ===');
    console.log('개수:', $('.subject').length);
    $('.subject').slice(0, 3).each((i, el) => {
      const text = $(el).text().trim();
      console.log(`${i+1}. ${text.substring(0, 50)}`);
    });
    
    console.log('\n=== 테스트 5: 조회수, 추천수 찾기 ===');
    $('table tr').slice(1, 4).each((i, el) => {
      const $tr = $(el);
      console.log(`\n--- TR #${i} ---`);
      $tr.find('td').each((tdIdx, td) => {
        const $td = $(td);
        const className = $td.attr('class') || 'no-class';
        const text = $td.text().trim().substring(0, 50);
        if (text) {
          console.log(`  TD[${tdIdx}] (${className}): ${text}`);
        }
      });
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

debugTodayhumor();
