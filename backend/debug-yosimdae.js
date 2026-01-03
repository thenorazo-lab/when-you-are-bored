const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeYosimdae() {
  try {
    console.log('🔍 여성시대 분석 시작...\n');
    
    const url = 'https://cafe.daum.net/subdued20club';
    
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
    console.log('- .list_best:', $('.list_best').length);
    console.log('- .popular_list:', $('.popular_list').length);
    console.log('- .rank_list:', $('.rank_list').length);
    console.log('- .week_best:', $('.week_best').length);
    console.log('- .article_popular:', $('.article_popular').length);
    console.log('- li:', $('li').length);
    
    // 텍스트로 "지난주 인기글" 찾기
    console.log('\n=== "지난주 인기글" 텍스트 검색 ===');
    const weekText = $('*:contains("지난주 인기글")');
    console.log('포함된 요소 수:', weekText.length);
    
    if (weekText.length > 0) {
      console.log('\n첫 번째 요소:');
      const first = weekText.first();
      console.log('태그:', first.prop('tagName'));
      console.log('클래스:', first.attr('class'));
      console.log('HTML:', first.html()?.substring(0, 300));
    }
    
    // 링크 찾기
    const links = $('a[href*="/subdued20club/"]');
    console.log('\n- a[href*="/subdued20club/"]:', links.length);
    
    if (links.length > 0) {
      console.log('\n첫 5개 링크:');
      links.slice(0, 5).each((i, elem) => {
        const $elem = $(elem);
        const href = $elem.attr('href');
        const text = $elem.text().trim();
        if (text.length > 0 && text.length < 100) {
          console.log(`${i + 1}. text: ${text}`);
          console.log(`   href: ${href}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

analyzeYosimdae();
