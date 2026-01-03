const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeNatepann() {
  try {
    console.log('🔍 네이트판 분석 시작...\n');
    
    const url = 'https://pann.nate.com/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      timeout: 10000
    });

    console.log('✅ 연결 성공! HTML 길이:', response.data.length);
    
    const $ = cheerio.load(response.data);
    
    console.log('\n=== 클래스 찾기 ===');
    console.log('- .main_best:', $('.main_best').length);
    console.log('- .best_list:', $('.best_list').length);
    console.log('- .list_title:', $('.list_title').length);
    console.log('- .rank_list:', $('.rank_list').length);
    console.log('- .hot_list:', $('.hot_list').length);
    console.log('- .issue:', $('.issue').length);
    console.log('- .thumb:', $('.thumb').length);
    console.log('- img:', $('img').length);
    
    // 링크 찾기
    const links = $('a[href*="/talk/"]');
    console.log('\n- a[href*="/talk/"]:', links.length);
    
    if (links.length > 0) {
      console.log('\n첫 5개 링크:');
      links.slice(0, 5).each((i, elem) => {
        const $elem = $(elem);
        const href = $elem.attr('href');
        const text = $elem.text().trim();
        console.log(`${i + 1}. href: ${href}`);
        console.log(`   text: ${text.substring(0, 60)}`);
        
        // 이미지 확인
        const img = $elem.find('img');
        if (img.length > 0) {
          console.log(`   이미지: ${img.attr('src')}`);
        }
      });
    }
    
    // 썸네일이 있는 항목 찾기
    console.log('\n\n=== 썸네일 항목 찾기 ===');
    const thumbItems = $('.thumb').parent();
    console.log('썸네일 부모 개수:', thumbItems.length);
    
    thumbItems.slice(0, 3).each((i, elem) => {
      const $elem = $(elem);
      console.log(`\n썸네일 항목 ${i + 1}:`);
      console.log('HTML:', $elem.html()?.substring(0, 400));
    });
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

analyzeNatepann();
