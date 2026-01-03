const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeDcinsideBest() {
  try {
    console.log('🔍 디시인사이드 베스트 갤러리 분석...\n');
    
    const url = 'https://gall.dcinside.com/board/lists/?id=dcbest';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== 게시글 행 분석 ===');
    const posts = $('tr.ub-content');
    console.log('전체 게시글 수:', posts.length, '\n');

    // 실제 게시글만 필터링 (설문, 공지 제외)
    const realPosts = [];
    
    posts.each((i, elem) => {
      const $elem = $(elem);
      
      // gall_num에서 번호 확인 (설문, 공지 제외)
      const num = $elem.find('.gall_num').text().trim();
      
      // 숫자인 경우만 (설문, 공지, 추천 등 제외)
      if (/^\d+$/.test(num)) {
        const title = $elem.find('.gall_tit a').text().trim();
        const link = $elem.find('.gall_tit a').attr('href');
        const writer = $elem.find('.gall_writer').text().trim();
        const date = $elem.find('.gall_date').attr('title') || $elem.find('.gall_date').text().trim();
        const views = $elem.find('.gall_count').text().trim();
        const recommend = $elem.find('.gall_recommend').text().trim();
        
        // 댓글 수 추출
        const replyMatch = title.match(/\[(\d+)\]/);
        const replies = replyMatch ? replyMatch[1] : '0';
        
        // 제목에서 댓글 수 제거
        const cleanTitle = title.replace(/\[\d+\]/, '').trim();
        
        realPosts.push({
          num,
          title: cleanTitle,
          link: link ? `https://gall.dcinside.com${link}` : '',
          writer,
          date,
          views,
          recommend,
          replies
        });
        
        if (i < 3) {
          console.log(`\n게시글 ${i + 1}:`);
          console.log('번호:', num);
          console.log('제목:', cleanTitle);
          console.log('링크:', link);
          console.log('작성자:', writer);
          console.log('날짜:', date);
          console.log('조회:', views);
          console.log('추천:', recommend);
          console.log('댓글:', replies);
        }
      }
    });
    
    console.log('\n\n=== 최종 결과 ===');
    console.log('실제 게시글 수:', realPosts.length);
    console.log('추출 성공!');
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

analyzeDcinsideBest();
