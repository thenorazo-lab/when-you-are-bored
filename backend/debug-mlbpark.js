const axios = require('axios');
const cheerio = require('cheerio');

async function debugMlbpark() {
  try {
    console.log('MLBPARK HTML 구조 확인 중...\n');
    
    // 불펜 게시판 URL
    const response = await axios.get('https://mlbpark.donga.com/mp/b.php?m=list&b=bullpen', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log(`📄 HTML 길이: ${response.data.length} 바이트\n`);
    
    const $ = cheerio.load(response.data);
    
    console.log('=== 테스트 1: .tbl-list 클래스 ===');
    console.log('개수:', $('.tbl-list').length);
    
    console.log('\n=== 테스트 2: list-article 클래스 ===');
    console.log('개수:', $('.list-article').length);
    
    console.log('\n=== 테스트 3: 게시글 링크 찾기 (처음 5개) ===');
    $('a[href*="view.php"]').slice(0, 5).each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && text.length > 5) {
        console.log(`${i+1}. 제목: ${text.substring(0, 50)}`);
        console.log(`   링크: ${href}\n`);
      }
    });
    
    console.log('\n=== 테스트 4: tr 태그 분석 (처음 5개) ===');
    $('tbody tr').slice(0, 5).each((i, el) => {
      const $tr = $(el);
      const className = $tr.attr('class');
      console.log(`\nTR #${i} (class: ${className})`);
      
      $tr.find('td').each((tdIdx, td) => {
        const $td = $(td);
        const tdClass = $td.attr('class') || 'no-class';
        const text = $td.text().trim().substring(0, 50);
        if (text) {
          console.log(`  TD[${tdIdx}] (${tdClass}): ${text}`);
        }
      });
    });
    
    console.log('\n=== 테스트 5: 이미지 찾기 ===');
    $('tbody tr').slice(0, 3).each((i, el) => {
      const $img = $(el).find('img');
      if ($img.length > 0) {
        console.log(`TR #${i} 이미지:`, $img.attr('src'));
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

debugMlbpark();
