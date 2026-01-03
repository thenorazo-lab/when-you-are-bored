const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeInstizDetail() {
  try {
    console.log('🔍 인스티즈 /pt 페이지 상세 분석...\n');
    
    const url = 'https://www.instiz.net/pt/0';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== table.kscon 분석 ===');
    const tables = $('table.kscon');
    console.log('table.kscon 개수:', tables.length);
    
    // 각 테이블 확인
    tables.each((i, table) => {
      const $table = $(table);
      const rows = $table.find('tr');
      
      if (rows.length > 0 && i < 3) {
        console.log(`\n--- 테이블 ${i + 1} ---`);
        console.log('행 개수:', rows.length);
        
        rows.slice(0, 2).each((j, row) => {
          const $row = $(row);
          console.log(`\n행 ${j + 1}:`);
          console.log('HTML (앞부분):', $row.html()?.substring(0, 300));
          
          const link = $row.find('a[href*="/pt/"]');
          if (link.length > 0) {
            console.log('링크 href:', link.attr('href'));
            console.log('링크 text:', link.text().trim());
          }
          
          const tds = $row.find('td');
          console.log('td 개수:', tds.length);
          
          tds.each((k, td) => {
            const $td = $(td);
            console.log(`  TD ${k + 1}: ${$td.text().trim().substring(0, 50)} (class: ${$td.attr('class') || 'none'})`);
          });
        });
      }
    });
    
    // 게시글 링크 수집
    console.log('\n\n=== 게시글 링크 수집 ===');
    const postLinks = $('a[href*="/pt/"]').filter((i, elem) => {
      const href = $(elem).attr('href');
      // 숫자로만 된 게시글 링크만 (green 파라미터 있는 것)
      return href && href.match(/\/pt\/\d+/);
    });
    
    console.log('게시글 링크 개수:', postLinks.length);
    
    const posts = [];
    postLinks.slice(0, 5).each((i, elem) => {
      const $elem = $(elem);
      const title = $elem.text().trim();
      const href = $elem.attr('href');
      
      // 댓글 수 추출
      const replyMatch = title.match(/(\d+)$/);
      const replies = replyMatch ? replyMatch[1] : '0';
      
      console.log(`\n게시글 ${i + 1}:`);
      console.log('제목:', title);
      console.log('링크:', href);
      console.log('댓글:', replies);
      
      posts.push({ title, href, replies });
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

analyzeInstizDetail();
