const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

async function findPpomppuStructure() {
  try {
    const response = await axios.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });
    
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);
    
    console.log('=== 모든 게시글 링크 분석 ===\n');
    
    let count = 0;
    $('a').each((i, el) => {
      if (count >= 5) return false;
      
      const href = $(el).attr('href');
      if (href && href.includes('view.php?id=humor')) {
        const title = $(el).text().trim();
        
        if (title.length > 5 && !title.includes('이벤트')) {
          count++;
        
          console.log(`\n[게시글 ${count}]`);
          console.log(`제목: ${title}`);
          console.log(`링크: ${href}`);
        
        // 부모 요소 찾기
        const $parent = $(el).parent();
        const parentTag = $parent.prop('tagName');
        const parentClass = $parent.attr('class');
        console.log(`부모: <${parentTag}> class="${parentClass}"`);
        
        // 조부모 요소
        const $grandParent = $parent.parent();
        const gpTag = $grandParent.prop('tagName');
        const gpClass = $grandParent.attr('class');
        console.log(`조부모: <${gpTag}> class="${gpClass}"`);
        
        // 같은 행의 다른 td 찾기
        if (parentTag === 'TD') {
          const $tr = $parent.parent();
          const $tds = $tr.find('td');
          console.log(`같은 행의 TD 개수: ${$tds.length}`);
          $tds.each((tdIdx, td) => {
            const text = $(td).text().trim().substring(0, 30);
            if (text && text !== title.substring(0, 30)) {
              console.log(`  TD[${tdIdx}]: ${text}`);
            }
          });
        }
        }
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

findPpomppuStructure();
