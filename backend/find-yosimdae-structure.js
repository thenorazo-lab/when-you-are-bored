const axios = require('axios');
const cheerio = require('cheerio');

async function findYosimdaeStructure() {
  try {
    console.log('🔍 여성시대 모바일 페이지 분석...\n');
    
    const url = 'https://m.cafe.daum.net/subdued20club';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== 모든 텍스트 링크 분석 ===\n');
    
    const links = $('a');
    const posts = [];
    
    links.each((i, elem) => {
      const $elem = $(elem);
      const text = $elem.text().trim();
      const href = $elem.attr('href');
      
      // 게시글처럼 보이는 링크만 (WWFJ 등의 게시판 ID가 있는 경우)
      if (href && href.includes('/subdued20club/') && text.length > 5 && text.length < 100) {
        // 숫자로만 시작하지 않는 것 (공지, 댓글수 등 제외)
        if (!/^\d+$/.test(text) && !text.includes('댓글수') && !text.includes('공지')) {
          posts.push({
            title: text,
            url: href.startsWith('http') ? href : `https://m.cafe.daum.net${href}`
          });
        }
      }
    });
    
    console.log('수집된 게시글 수:', posts.length);
    console.log('\n상위 10개:');
    posts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
      console.log(`   ${post.url}`);
    });
    
    // "인기" 또는 "베스트" 텍스트 찾기
    console.log('\n\n=== "인기" 관련 요소 찾기 ===');
    const popularElems = $('*:contains("인기")');
    console.log('인기 포함 요소:', popularElems.length);
    
    popularElems.slice(0, 5).each((i, elem) => {
      const $elem = $(elem);
      const text = $elem.text().trim();
      if (text.length < 200) {
        console.log(`${i + 1}. ${text.substring(0, 100)}`);
      }
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

findYosimdaeStructure();
