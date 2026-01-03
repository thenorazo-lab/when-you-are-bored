const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

async function findImages() {
  try {
    const response = await axios.get('http://web.humoruniv.com/board/humor/list.html?table=pds&pg=1', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });
    
    const html = iconv.decode(response.data, 'euc-kr');
    const $ = cheerio.load(html);
    
    console.log('=== 게시글별 이미지 찾기 (처음 3개) ===\n');
    
    let count = 0;
    $('table tr').each((index, element) => {
      if (count >= 3) return false;
      
      const $tr = $(element);
      const $link = $tr.find('td.li_sbj a[href*="read.html"]');
      
      if ($link.length > 0) {
        count++;
        const title = $link.text().trim().replace(/\s+/g, ' ').substring(0, 50);
        
        console.log(`\n[게시글 ${count}] ${title}...`);
        
        // 이미지 찾기 - 여러 방법 시도
        const $imgs = $tr.find('img');
        console.log(`  TR 내 img 개수: ${$imgs.length}`);
        
        $imgs.each((i, img) => {
          const src = $(img).attr('src');
          const alt = $(img).attr('alt');
          console.log(`    img[${i}] src="${src}" alt="${alt}"`);
        });
        
        // 썸네일 클래스 찾기
        const $thumb = $tr.find('.thumb, .thumbnail, img[src*="thumb"]');
        if ($thumb.length > 0) {
          console.log(`  ✅ 썸네일 발견: ${$thumb.attr('src')}`);
        }
      }
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

findImages();
