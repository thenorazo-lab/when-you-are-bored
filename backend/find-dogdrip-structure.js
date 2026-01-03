const axios = require('axios');
const cheerio = require('cheerio');

async function findDogdripStructure() {
  try {
    console.log('🔍 개드립 전체 구조 찾기...\n');
    
    const url = 'https://www.dogdrip.net/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== 게시글 수집 ===');
    
    // 게시글 링크만 필터링
    const postLinks = $('a[href*="/dogdrip/"]').filter((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      // 숫자 ID가 있고, 텍스트가 있는 링크만
      return href && href.match(/\/dogdrip\/\d+/) && text.length > 0;
    });
    
    console.log('수집된 게시글 링크:', postLinks.length);
    
    const posts = [];
    
    postLinks.each((i, elem) => {
      const $elem = $(elem);
      const title = $elem.text().trim();
      const href = $elem.attr('href');
      
      // URL에서 파라미터 제거하고 숫자 ID만 추출
      const idMatch = href.match(/\/dogdrip\/(\d+)/);
      const postId = idMatch ? idMatch[1] : '';
      const cleanUrl = `https://www.dogdrip.net/dogdrip/${postId}`;
      
      // 부모 요소들 탐색
      let views = '0';
      let replies = '0';
      let date = '';
      
      // 가장 가까운 li 또는 div 찾기
      const container = $elem.closest('li, div.item, div.post');
      
      // 조회수, 댓글 등 찾기
      container.find('[class*="view"], [class*="count"]').each((j, metaElem) => {
        const text = $(metaElem).text().trim();
        const match = text.match(/(\d+)/);
        if (match && !views || views === '0') {
          views = match[1];
        }
      });
      
      // 댓글 수 찾기
      container.find('[class*="comment"], [class*="reply"]').each((j, replyElem) => {
        const text = $(replyElem).text().trim();
        const match = text.match(/(\d+)/);
        if (match) {
          replies = match[1];
        }
      });
      
      posts.push({
        title,
        url: cleanUrl,
        views,
        replies,
        postId
      });
      
      if (i < 5) {
        console.log(`\n게시글 ${i + 1}:`);
        console.log('제목:', title);
        console.log('URL:', cleanUrl);
        console.log('ID:', postId);
        console.log('조회:', views);
        console.log('댓글:', replies);
      }
    });
    
    console.log('\n\n=== 최종 결과 ===');
    console.log('총 게시글 수:', posts.length);
    console.log('\n상위 10개:');
    posts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

findDogdripStructure();
