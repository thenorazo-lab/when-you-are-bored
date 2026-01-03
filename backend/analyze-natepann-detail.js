const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeNatepannDetail() {
  try {
    console.log('🔍 네이트판 상세 분석...\n');
    
    const url = 'https://pann.nate.com/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== 썸네일 게시글 수집 ===\n');
    
    // .thumb를 포함한 컨테이너 찾기
    const items = $('.thumb').parent().parent();
    console.log('게시글 컨테이너 개수:', items.length);
    
    const posts = [];
    
    items.each((i, elem) => {
      const $elem = $(elem);
      
      // 썸네일 이미지
      const thumb = $elem.find('.thumb img');
      const thumbUrl = thumb.attr('src');
      
      // 제목 (m-info 안의 h2 > a)
      const titleLink = $elem.find('.m-info h2 a, h2 a');
      const title = titleLink.text().trim();
      const href = titleLink.attr('href');
      
      // 댓글, 조회수 등 메타 정보
      const metaInfo = $elem.find('.m-info .tit, .tit');
      const replyElem = metaInfo.find('em').first();
      const viewElem = metaInfo.find('em').last();
      
      const replies = replyElem.text().trim() || '0';
      const views = viewElem.text().trim() || '0';
      
      if (title && href) {
        posts.push({
          title,
          url: href,
          thumbnail: thumbUrl,
          replies,
          views
        });
        
        if (i < 5) {
          console.log(`게시글 ${i + 1}:`);
          console.log('제목:', title);
          console.log('URL:', href);
          console.log('썸네일:', thumbUrl);
          console.log('댓글:', replies);
          console.log('조회:', views);
          console.log('');
        }
      }
    });
    
    console.log('\n=== 최종 결과 ===');
    console.log('총 게시글 수:', posts.length);
    console.log('\n상위 10개:');
    posts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title} (썸네일: ${post.thumbnail ? 'O' : 'X'})`);
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

analyzeNatepannDetail();
