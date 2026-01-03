const axios = require('axios');
const cheerio = require('cheerio');

async function findNatepannStructure() {
  try {
    console.log('🔍 네이트판 개별 게시글 추출...\n');
    
    const url = 'https://pann.nate.com/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const $ = cheerio.load(response.data);
    
    console.log('=== 개별 썸네일 항목 찾기 ===\n');
    
    // 각 .thumb가 있는 개별 항목 찾기
    const thumbContainers = $('.thumb');
    console.log('썸네일 개수:', thumbContainers.length);
    
    const posts = [];
    
    thumbContainers.each((i, elem) => {
      const $container = $(elem).parent();
      
      // 썸네일 이미지
      const thumbImg = $(elem).find('img');
      const thumbUrl = thumbImg.attr('src');
      const thumbLink = $(elem).find('a');
      const thumbHref = thumbLink.attr('href');
      
      // 같은 레벨의 m-info에서 제목 찾기
      const mInfo = $container.find('.m-info');
      const title = mInfo.find('h2 a').text().trim();
      const titleHref = mInfo.find('h2 a').attr('href');
      
      // URL은 썸네일 링크나 제목 링크 중 하나 사용
      const url = titleHref || thumbHref;
      
      if (title && url) {
        // 절대 URL로 변환
        const absoluteUrl = url.startsWith('http') ? url : `https://pann.nate.com${url}`;
        
        posts.push({
          title,
          url: absoluteUrl,
          thumbnail: thumbUrl
        });
        
        if (i < 10) {
          console.log(`게시글 ${i + 1}:`);
          console.log('제목:', title);
          console.log('URL:', absoluteUrl);
          console.log('썸네일:', thumbUrl);
          console.log('');
        }
      }
    });
    
    console.log('\n=== 최종 결과 ===');
    console.log('총 게시글 수:', posts.length);
    console.log('\n상위 10개:');
    posts.slice(0, 10).forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

findNatepannStructure();
