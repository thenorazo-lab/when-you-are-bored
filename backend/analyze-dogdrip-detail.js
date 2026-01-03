const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeDogdripDetail() {
  try {
    console.log('🔍 개드립 상세 분석...\n');
    
    const url = 'https://www.dogdrip.net/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== .title 분석 ===');
    const titles = $('.title');
    console.log('title 개수:', titles.length);
    
    titles.slice(0, 5).each((i, elem) => {
      const $elem = $(elem);
      console.log(`\n제목 ${i + 1}:`);
      
      const link = $elem.find('a');
      const href = link.attr('href');
      const text = link.text().trim();
      
      console.log('텍스트:', text);
      console.log('링크:', href);
      
      // 부모 요소에서 메타데이터 찾기
      const parent = $elem.parent();
      const grandParent = parent.parent();
      
      console.log('부모 클래스:', parent.attr('class'));
      console.log('조부모 클래스:', grandParent.attr('class'));
      
      // 형제 요소 찾기
      const siblings = $elem.siblings();
      console.log('형제 요소 개수:', siblings.length);
      
      siblings.each((j, sib) => {
        const $sib = $(sib);
        const sibClass = $sib.attr('class');
        const sibText = $sib.text().trim();
        if (sibText && sibText.length < 50) {
          console.log(`  형제 ${j + 1} (${sibClass}): ${sibText}`);
        }
      });
      
      // 조회수, 댓글 등 찾기
      const metadata = grandParent.find('.metadata, .meta, .info, .ed-metadata');
      console.log('메타데이터:', metadata.text().trim());
    });
    
    // 링크 구조 확인
    console.log('\n\n=== 링크 구조 확인 ===');
    const postLinks = $('a[href*="/dogdrip/"]').filter((i, elem) => {
      const href = $(elem).attr('href');
      return href && href.match(/\/dogdrip\/\d+/);
    });
    
    console.log('게시글 링크 개수:', postLinks.length);
    
    postLinks.slice(0, 5).each((i, elem) => {
      const $elem = $(elem);
      const href = $elem.attr('href');
      const text = $elem.text().trim();
      
      if (text.length > 0) {
        console.log(`\n게시글 ${i + 1}:`);
        console.log('제목:', text);
        console.log('URL:', href);
        
        // 댓글 수 찾기
        const parent = $elem.closest('.title, .item, .post');
        const replyElem = parent.find('.reply-count, .comment-count, [class*="comment"], [class*="reply"]');
        console.log('댓글 요소:', replyElem.text().trim());
      }
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

analyzeDogdripDetail();
