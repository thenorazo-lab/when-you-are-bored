const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

async function analyzePpomppu() {
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
    
    console.log('=== 상위 3개 게시글 상세 분석 ===\n');
    
    let count = 0;
    $('.list_vspace').each((i, el) => {
      if (count >= 3) return false;
      
      const $table = $(el);
      const $link = $table.find('a[href*="view.php?id=humor"]').first();
      
      if ($link.length > 0) {
        count++;
        const title = $link.text().trim();
        const href = $link.attr('href');
        
        console.log(`\n[게시글 ${count}]`);
        console.log(`제목: ${title}`);
        console.log(`링크: ${href}`);
        
        // 주변 정보 찾기
        const $font = $table.find('font');
        $font.each((fontIdx, font) => {
          const text = $(font).text().trim();
          const color = $(font).attr('color');
          if (text && text.length < 50) {
            console.log(`  font[${fontIdx}] (color: ${color}): ${text}`);
          }
        });
        
        // 이미지 찾기
        const $img = $table.find('img');
        if ($img.length > 0) {
          console.log(`  이미지 개수: ${$img.length}`);
          $img.each((imgIdx, img) => {
            const src = $(img).attr('src');
            if (src && !src.includes('icon') && !src.includes('spacer')) {
              console.log(`    썸네일 후보: ${src}`);
            }
          });
        }
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

analyzePpomppu();
