const axios = require('axios');
const cheerio = require('cheerio');

async function checkMlbparkThumbnails() {
  try {
    console.log('MLBPARK 썸네일 확인 중...\n');
    
    const response = await axios.get('https://mlbpark.donga.com/mp/b.php?m=list&b=bullpen', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    console.log('=== 게시글별 이미지 분석 (처음 5개) ===\n');
    
    let count = 0;
    $('tbody tr').each((i, el) => {
      if (count >= 5) return false;
      
      const $tr = $(el);
      const $noTd = $tr.find('td').first();
      const no = $noTd.text().trim();
      
      // 공지 제외
      if (!isNaN(no) && no.length > 3) {
        count++;
        
        const title = $tr.find('td.t_left').first().text().trim().substring(0, 40);
        console.log(`\n[게시글 ${count}] ${title}...`);
        
        // 모든 이미지 찾기
        const $images = $tr.find('img');
        console.log(`  이미지 개수: ${$images.length}`);
        
        $images.each((imgIdx, img) => {
          const src = $(img).attr('src');
          const alt = $(img).attr('alt');
          const className = $(img).attr('class');
          console.log(`    [${imgIdx}] src: ${src}`);
          console.log(`        alt: ${alt}, class: ${className}`);
        });
        
        // td 내 특별한 클래스 확인
        $tr.find('td').each((tdIdx, td) => {
          const $td = $(td);
          const className = $td.attr('class');
          if (className && (className.includes('thumb') || className.includes('img') || className.includes('photo'))) {
            console.log(`  ⭐ 특별한 TD 발견: ${className}`);
            console.log(`     내용: ${$td.html().substring(0, 100)}`);
          }
        });
      }
    });
    
    console.log('\n\n=== 게시글 상세 페이지 확인 ===');
    
    // 첫 번째 게시글 링크 가져오기
    let firstLink = null;
    $('tbody tr').each((i, el) => {
      const $tr = $(el);
      const $noTd = $tr.find('td').first();
      const no = $noTd.text().trim();
      
      if (!isNaN(no) && no.length > 3) {
        const $link = $tr.find('td.t_left a').first();
        firstLink = $link.attr('href');
        return false;
      }
    });
    
    if (firstLink) {
      const fullUrl = firstLink.startsWith('http') ? firstLink : `https://mlbpark.donga.com${firstLink}`;
      console.log(`\n첫 번째 게시글: ${fullUrl}\n`);
      
      const viewResponse = await axios.get(fullUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $view = cheerio.load(viewResponse.data);
      const $contentImages = $view('.ar_txt img, .article img, .content img');
      
      console.log(`게시글 본문 내 이미지 개수: ${$contentImages.length}\n`);
      
      $contentImages.slice(0, 3).each((i, img) => {
        const src = $view(img).attr('src');
        console.log(`  ${i+1}. ${src}`);
      });
    }
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

checkMlbparkThumbnails();
