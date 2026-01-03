const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeMlbpark() {
  try {
    const response = await axios.get('https://mlbpark.donga.com/mp/b.php?m=list&b=bullpen', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    console.log('=== 실제 게시글 분석 (공지 제외) ===\n');
    
    let count = 0;
    $('tbody tr').each((i, el) => {
      if (count >= 3) return false;
      
      const $tr = $(el);
      const $noTd = $tr.find('td').first();
      const no = $noTd.text().trim();
      
      // 공지 제외 (숫자인 경우만)
      if (!isNaN(no) && no.length > 3) {
        count++;
        
        console.log(`\n[게시글 ${count}] 글번호: ${no}`);
        
        // 제목 찾기
        const $titleTd = $tr.find('td.t_left').first();
        const title = $titleTd.text().trim();
        const $link = $titleTd.find('a').first();
        const href = $link.attr('href');
        
        console.log(`제목: ${title}`);
        console.log(`링크: ${href}`);
        
        // 작성자
        const author = $tr.find('td.t_left').eq(1).text().trim();
        console.log(`작성자: ${author}`);
        
        // 날짜/시간
        const date = $tr.find('td').eq(3).text().trim();
        console.log(`날짜: ${date}`);
        
        // 조회수 (있으면)
        const views = $tr.find('td.t_right').text().trim();
        console.log(`조회수/추천: ${views}`);
        
        // 이미지 찾기
        const $img = $tr.find('img');
        if ($img.length > 0) {
          console.log(`썸네일: ${$img.attr('src')}`);
        }
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

analyzeMlbpark();
