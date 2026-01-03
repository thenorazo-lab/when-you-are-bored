const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeDcinside() {
  try {
    console.log('🔍 디시인사이드 분석 시작...\n');
    
    // 실시간 베스트 페이지
    const url = 'https://www.dcinside.com/';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('📄 HTML 길이:', response.data.length, '바이트\n');

    const $ = cheerio.load(response.data);

    // 메인 페이지 구조 분석
    console.log('=== 주요 클래스 찾기 ===');
    console.log('hot-article-list:', $('.hot-article-list').length);
    console.log('issue-contentbox:', $('.issue-contentbox').length);
    console.log('box_best:', $('.box_best').length);
    console.log('listbox:', $('.listbox').length);
    
    // 실시간 베스트 찾기
    console.log('\n=== 베스트 게시글 찾기 ===');
    const bestList = $('.hot-article-list .sch-result-list li');
    console.log('베스트 게시글 개수:', bestList.length);
    
    if (bestList.length > 0) {
      console.log('\n=== 첫 번째 게시글 구조 ===');
      const first = bestList.first();
      console.log('HTML:', first.html()?.substring(0, 500));
      
      const title = first.find('.subject').text().trim();
      const link = first.find('a').attr('href');
      const gallName = first.find('.name').text().trim();
      const reply = first.find('.reply_num').text().trim();
      
      console.log('\n제목:', title);
      console.log('링크:', link);
      console.log('갤러리:', gallName);
      console.log('댓글:', reply);
    }

    // 다른 구조도 확인
    console.log('\n=== 다른 구조 확인 ===');
    const schList = $('.sch-result-list li');
    console.log('sch-result-list li:', schList.length);
    
    const hotBox = $('.hot-box');
    console.log('hot-box:', hotBox.length);
    
  } catch (error) {
    console.error('❌ 에러:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

analyzeDcinside();
