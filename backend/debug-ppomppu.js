const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

async function debugPpomppu() {
  try {
    console.log('뽐뿌 HTML 구조 확인 중...\n');
    
    const response = await axios.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });
    
    // EUC-KR 인코딩 처리 시도
    let html;
    try {
      html = iconv.decode(response.data, 'euc-kr');
    } catch (e) {
      html = response.data.toString();
    }
    
    console.log(`📄 HTML 길이: ${html.length} 바이트\n`);
    
    const $ = cheerio.load(html);
    
    console.log('=== 테스트 1: .list_vspace 클래스 ===');
    console.log('개수:', $('.list_vspace').length);
    
    console.log('\n=== 테스트 2: table 클래스 찾기 ===');
    console.log('list_table:', $('.list_table').length);
    console.log('list_content:', $('.list_content').length);
    
    console.log('\n=== 테스트 3: 게시글 링크 찾기 (처음 5개) ===');
    $('a[href*="view.php"]').slice(0, 5).each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && text.length > 5) {
        console.log(`${i+1}. 제목: ${text.substring(0, 50)}`);
        console.log(`   링크: ${href}\n`);
      }
    });
    
    console.log('\n=== 테스트 4: list_vspace tr 분석 (처음 5개) ===');
    $('.list_vspace tr').slice(0, 5).each((i, el) => {
      const $tr = $(el);
      const className = $tr.attr('class');
      
      if (i > 0) { // 헤더 제외
        console.log(`\nTR #${i} (class: ${className})`);
        
        $tr.find('td').each((tdIdx, td) => {
          const $td = $(td);
          const tdClass = $td.attr('class') || 'no-class';
          const text = $td.text().trim().substring(0, 50);
          if (text) {
            console.log(`  TD[${tdIdx}] (${tdClass}): ${text}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

debugPpomppu();
