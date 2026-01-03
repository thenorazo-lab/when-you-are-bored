const axios = require('axios');
const cheerio = require('cheerio');

async function findInstizStructure() {
  try {
    console.log('🔍 인스티즈 게시글 메타데이터 찾기...\n');
    
    const url = 'https://www.instiz.net/pt/0';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const $ = cheerio.load(response.data);
    
    // 모든 a[href*="/pt/"] 찾기
    const postLinks = $('a[href*="/pt/"]').filter((i, elem) => {
      const href = $(elem).attr('href');
      return href && href.match(/\/pt\/\d+/);
    });
    
    console.log('=== 게시글 정보 추출 ===');
    console.log('총 게시글 수:', postLinks.length);
    
    const posts = [];
    
    postLinks.each((i, elem) => {
      const $elem = $(elem);
      const title = $elem.text().trim();
      const href = $elem.attr('href');
      
      // 댓글 수 추출 (끝에 숫자)
      const replyMatch = title.match(/(\d+)$/);
      const replies = replyMatch ? replyMatch[1] : '0';
      const cleanTitle = replyMatch ? title.replace(/\d+$/, '').trim() : title;
      
      // 부모 요소에서 추가 정보 찾기
      const parent = $elem.parent();
      const grandParent = parent.parent();
      
      // 조회수, 날짜 등 찾기
      let views = '0';
      let date = '';
      let category = '';
      
      // 형제 요소들 확인
      const siblings = parent.siblings();
      siblings.each((j, sib) => {
        const $sib = $(sib);
        const text = $sib.text().trim();
        
        // 숫자만 있는 경우 조회수일 가능성
        if (/^\d+$/.test(text) && text.length < 6) {
          views = text;
        }
        
        // 날짜 패턴 (MM.DD, YYYY.MM.DD 등)
        if (/\d{2}\.\d{2}/.test(text)) {
          date = text;
        }
      });
      
      // green 파라미터가 있으면 추천글
      const isRecommended = href.includes('green=1');
      
      posts.push({
        title: cleanTitle,
        url: href.split('?')[0], // 파라미터 제거
        replies,
        views,
        date,
        isRecommended
      });
      
      if (i < 5) {
        console.log(`\n게시글 ${i + 1}:`);
        console.log('제목:', cleanTitle);
        console.log('URL:', href);
        console.log('댓글:', replies);
        console.log('추천글:', isRecommended);
        console.log('부모 HTML:', parent.html()?.substring(0, 200));
      }
    });
    
    console.log('\n\n=== 최종 결과 ===');
    console.log('추출된 게시글 수:', posts.length);
    console.log('상위 10개 게시글:');
    posts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title} (댓글: ${post.replies})`);
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

findInstizStructure();
