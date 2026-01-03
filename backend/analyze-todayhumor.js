const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeTodayhumor() {
  try {
    const response = await axios.get('https://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    console.log('=== 상위 3개 게시글 상세 분석 ===\n');
    
    let count = 0;
    $('.table_list tr').each((i, el) => {
      if (count >= 3) return false;
      
      const $tr = $(el);
      const $subject = $tr.find('.subject');
      
      if ($subject.length > 0) {
        count++;
        const title = $subject.text().trim();
        const $link = $subject.find('a').first();
        const href = $link.attr('href');
        
        console.log(`\n[게시글 ${count}]`);
        console.log(`제목: ${title}`);
        console.log(`링크: ${href}`);
        
        // td 분석
        $tr.find('td').each((tdIdx, td) => {
          const $td = $(td);
          const className = $td.attr('class') || 'no-class';
          const text = $td.text().trim();
          if (text && text.length < 50) {
            console.log(`  TD[${tdIdx}] (${className}): ${text}`);
          }
        });
        
        // 썸네일 찾기
        const $img = $tr.find('img');
        if ($img.length > 0) {
          console.log(`  썸네일: ${$img.attr('src')}`);
        }
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

analyzeTodayhumor();
