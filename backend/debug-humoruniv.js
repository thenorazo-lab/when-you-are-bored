const axios = require('axios');
const cheerio = require('cheerio');

async function debugHumoruniv() {
  try {
    console.log('웃긴대학 HTML 구조 확인 중...\n');
    
    const response = await axios.get('http://web.humoruniv.com/board/humor/list.html?table=pds&pg=1', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });
    
    // EUC-KR 인코딩 처리
    const iconv = require('iconv-lite');
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);
    
    // 다양한 선택자 시도
    console.log('=== 테스트 1: tr.list1, tr.list0 ===');
    console.log('개수:', $('tr.list1, tr.list0').length);
    
    console.log('\n=== 테스트 2: tr[class*="list"] ===');
    console.log('개수:', $('tr[class*="list"]').length);
    
    console.log('\n=== 테스트 3: .list 포함된 모든 tr ===');
    $('tr').each((i, el) => {
      const className = $(el).attr('class');
      if (className && className.includes('list')) {
        console.log(`클래스: ${className}`);
        if (i < 3) {
          console.log('HTML:', $(el).html().substring(0, 200));
        }
      }
    });
    
    console.log('\n=== 테스트 4: table 내 모든 a 태그 (처음 10개) ===');
    $('table a').slice(0, 10).each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text) {
        console.log(`${i+1}. 제목: ${text}`);
        console.log(`   링크: ${href}\n`);
      }
    });
    
    console.log('\n=== 테스트 6: 게시글 링크 있는 tr 태그 분석 ===');
    $('table tr').each((i, el) => {
      const $tr = $(el);
      const $link = $tr.find('a[href*="read.html"]');
      if ($link.length > 0 && i < 5) {
        console.log(`\n--- TR #${i} ---`);
        console.log('클래스:', $tr.attr('class'));
        console.log('제목:', $link.first().text().trim());
        console.log('링크:', $link.first().attr('href'));
        
        // td들 확인
        $tr.find('td').each((tdIdx, td) => {
          const $td = $(td);
          const className = $td.attr('class') || 'no-class';
          const text = $td.text().trim().substring(0, 50);
          if (text) {
            console.log(`  TD[${tdIdx}] (${className}): ${text}`);
          }
        });
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

debugHumoruniv();
