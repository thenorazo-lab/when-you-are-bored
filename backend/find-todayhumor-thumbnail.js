const axios = require('axios');
const cheerio = require('cheerio');

async function findThumbnail() {
  try {
    // 목록 페이지에서 첫 번째 게시글 링크 가져오기
    const listResponse = await axios.get('https://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $list = cheerio.load(listResponse.data);
    const firstLink = $list('.subject a').first().attr('href');
    
    if (!firstLink) {
      console.log('게시글 링크를 찾을 수 없습니다.');
      return;
    }
    
    const fullUrl = firstLink.startsWith('http') ? firstLink : `https://www.todayhumor.co.kr${firstLink}`;
    console.log('첫 번째 게시글:', fullUrl);
    
    // 게시글 페이지에서 이미지 찾기
    const viewResponse = await axios.get(fullUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $view = cheerio.load(viewResponse.data);
    
    console.log('\n=== 게시글 내 이미지 찾기 ===');
    const $images = $view('img');
    console.log(`총 이미지 개수: ${$images.length}\n`);
    
    $images.slice(0, 5).each((i, img) => {
      const src = $view(img).attr('src');
      const alt = $view(img).attr('alt');
      const width = $view(img).attr('width');
      const height = $view(img).attr('height');
      
      console.log(`[이미지 ${i+1}]`);
      console.log(`  src: ${src}`);
      console.log(`  alt: ${alt}`);
      console.log(`  size: ${width}x${height}\n`);
    });
    
    // 본문 영역 내 이미지 찾기
    console.log('\n=== 본문 영역(.viewContent) 내 이미지 ===');
    const $contentImages = $view('.viewContent img, #viewContent img, .content img');
    console.log(`개수: ${$contentImages.length}`);
    
    $contentImages.slice(0, 3).each((i, img) => {
      const src = $view(img).attr('src');
      console.log(`  ${i+1}. ${src}`);
    });
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

findThumbnail();
