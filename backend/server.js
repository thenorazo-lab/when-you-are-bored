const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 미들웨어
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// 핫이슈 API 엔드포인트 (사이트별)
app.get('/api/hot-issues/:siteId', async (req, res) => {
  const { siteId } = req.params;
  
  try {
    let hotIssues = [];

    // 사이트별 실제 크롤링
    if (siteId === 'humoruniv') {
      // 웃긴대학 크롤링
      console.log('🔍 웃긴대학 크롤링 시작...');
      try {
        const iconv = require('iconv-lite');
        const response = await axios.get('http://web.humoruniv.com/board/humor/list.html?table=pds&pg=1', {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'http://web.humoruniv.com/board/humor/list.html?table=pds&pg=1',
            'Cache-Control': 'no-cache'
          },
          responseType: 'arraybuffer',
          validateStatus: function (status) {
            return status < 500;
          }
        });
        
        // EUC-KR 인코딩 처리
        const html = iconv.decode(response.data, 'euc-kr');
        console.log('📥 HTML 다운로드 완료, 파싱 시작...');
        const $ = cheerio.load(html);
        
        // 게시글 파싱
        let count = 0;
        $('table tr').each((index, element) => {
          if (count >= 10) return false;
          
          const $tr = $(element);
          const $link = $tr.find('td.li_sbj a[href*="read.html"]');
          
          if ($link.length > 0) {
            // 제목 추출 (댓글 수 등 제거)
            let title = $link.text().trim().replace(/\s+/g, ' ').replace(/\[\d+\]/g, '').trim();
            const href = $link.attr('href');
            const $tds = $tr.find('td');
            const date = $tds.filter('.li_date').text().trim().replace(/\s+/g, ' ');
            const views = $tds.eq(5).text().trim();
            
            // 썸네일 이미지 찾기
            let thumbnail = 'https://via.placeholder.com/300x200?text=웃긴대학';
            const $img = $tr.find('img[src*="thumb"]').first();
            if ($img.length > 0) {
              let imgSrc = $img.attr('src');
              // // 로 시작하면 https: 추가
              if (imgSrc && imgSrc.startsWith('//')) {
                imgSrc = 'https:' + imgSrc;
              } else if (imgSrc && imgSrc.startsWith('http')) {
                // 그대로 사용
              }
              // 프록시를 통해 이미지 제공 (CORS 우회)
              if (imgSrc && imgSrc.startsWith('http')) {
                const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://when-you-are-bored.onrender.com';
                thumbnail = `${baseUrl}/api/image-proxy?url=${encodeURIComponent(imgSrc)}`;
              }
            }
            
            if (title && href) {
              // 모바일 도메인으로 HTTPS 전환 (HTTP 차단 회피)
              const fullUrl = href.startsWith('http')
                ? href.replace('http://web.humoruniv.com/board/humor/', 'https://m.humoruniv.com/board/')
                : `https://m.humoruniv.com/board/${href}`;
              hotIssues.push({
                id: count + 1,
                title: title.substring(0, 100), // 제목 길이 제한
                source: '웃긴대학',
                views: views || '0',
                comments: '0',
                thumbnail: thumbnail,
                url: fullUrl,
                date: date
              });
              count++;
              console.log(`  ✅ [${count}] ${title.substring(0, 50)}...`);
            }
          }
        });
        
        console.log(`🎉 웃긴대학 크롤링 성공: ${hotIssues.length}개 게시글`);
        
        // 크롤링 실패 시 빈 배열 (샘플 데이터 제거)
        if (hotIssues.length === 0) {
          console.error('⚠️ 웃긴대학: 파싱된 게시글이 0개입니다');
        }
      } catch (error) {
        console.error('❌ 웃긴대학 크롤링 실패:', error.message);
        console.error('   상세:', error.response?.status, error.response?.statusText, error.code);
        console.error('   Stack:', error.stack);
        // 실패 시 빈 배열 반환 (샘플 데이터 제거)
        hotIssues = [];
      }
    } else if (siteId === 'todayhumor') {
      // 오늘의유머 크롤링
      console.log('🔍 오늘의유머 크롤링 시작...');
      try {
        const response = await axios.get('https://www.todayhumor.co.kr/board/list.php?table=bestofbest', {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        console.log('📥 HTML 다운로드 완료, 파싱 시작...');
        const $ = cheerio.load(response.data);
        
        // 게시글 파싱
        let count = 0;
        $('.table_list tr').each((index, element) => {
          if (count >= 3) return false;
          
          const $tr = $(element);
          const $subject = $tr.find('.subject');
          
          if ($subject.length > 0) {
            const title = $subject.text().trim().replace(/\s+/g, ' ');
            const $link = $subject.find('a').first();
            const href = $link.attr('href');
            
            // td에서 조회수, 추천수 추출
            const views = $tr.find('td.hits').text().trim();
            const recommends = $tr.find('td.oknok').text().trim();
            const date = $tr.find('td.date').text().trim();
            
            // 썸네일 이미지 찾기
            let thumbnail = 'https://via.placeholder.com/300x200?text=오늘의유머';
            const $img = $tr.find('img').first();
            if ($img.length > 0) {
              let imgSrc = $img.attr('src');
              if (imgSrc && imgSrc.startsWith('//')) {
                imgSrc = 'https:' + imgSrc;
              }
              // 오늘의유머는 목록에서 실제 썸네일을 제공하지 않으므로
              // 기본 placeholder 또는 사이트 로고 사용
              // list_icon_photo.gif 등의 아이콘은 무시
            }
            
            if (title && href) {
              const fullUrl = href.startsWith('http') ? href : `https://www.todayhumor.co.kr${href}`;
              hotIssues.push({
                id: count + 1,
                title: title.substring(0, 100),
                source: '오늘의유머',
                views: views || '0',
                comments: recommends || '0',
                thumbnail: thumbnail,
                url: fullUrl,
                date: date
              });
              count++;
              console.log(`  ✅ [${count}] ${title.substring(0, 50)}...`);
            }
          }
        });
        
        console.log(`🎉 오늘의유머 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌ 오늘의유머 크롤링 실패:', error.message);
        hotIssues = getSampleData('오늘의유머');
      }
    } else if (siteId === 'mlbpark') {
      // MLBPARK 크롤링
      console.log('🔍 MLBPARK 크롤링 시작...');
      try {
        const response = await axios.get('https://mlbpark.donga.com/mp/b.php?m=list&b=bullpen', {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        console.log('📥 HTML 다운로드 완료, 파싱 시작...');
        const $ = cheerio.load(response.data);
        
        // 게시글 파싱
        let count = 0;
        $('tbody tr').each((index, element) => {
          if (count >= 3) return false;
          
          const $tr = $(element);
          const $noTd = $tr.find('td').first();
          const no = $noTd.text().trim();
          
          // 공지 제외 (숫자인 경우만)
          if (!isNaN(no) && no.length > 3) {
            const $titleTd = $tr.find('td.t_left').first();
            const title = $titleTd.text().trim().replace(/\s+/g, ' ');
            const $link = $titleTd.find('a').first();
            const href = $link.attr('href');
            
            // 날짜/시간
            const date = $tr.find('td').eq(3).text().trim();
            
            // 조회수/추천
            const views = $tr.find('td.t_right').text().trim();
            
            // 썸네일 (프로필 이미지는 사용하지 않음)
            let thumbnail = 'https://via.placeholder.com/300x200?text=MLBPARK';
            
            if (title && href) {
              const fullUrl = href.startsWith('http') ? href : `https://mlbpark.donga.com${href}`;
              hotIssues.push({
                id: count + 1,
                title: title.substring(0, 100),
                source: 'MLBPARK',
                views: views || '0',
                comments: '0',
                thumbnail: thumbnail,
                url: fullUrl,
                date: date
              });
              count++;
              console.log(`  ✅ [${count}] ${title.substring(0, 50)}...`);
            }
          }
        });
        
        console.log(`🎉 MLBPARK 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌ MLBPARK 크롤링 실패:', error.message);
        hotIssues = getSampleData('MLBPARK');
      }
    } else if (siteId === 'ppomppu') {
      // 뽐뿌 크롤링
      console.log('🔍 뽐뿌 크롤링 시작...');
      try {
        const iconv = require('iconv-lite');
        const response = await axios.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          responseType: 'arraybuffer'
        });
        
        // EUC-KR 인코딩 처리
        const html = iconv.decode(response.data, 'euc-kr');
        console.log('📥 HTML 다운로드 완료, 파싱 시작...');
        const $ = cheerio.load(html);
        
        // 게시글 파싱
        let count = 0;
        $('a').each((index, element) => {
          if (count >= 3) return false;
          
          const $link = $(element);
          const href = $link.attr('href');
          const title = $link.text().trim();
          
          // humor 게시판 링크만 선택
          if (href && href.includes('view.php?id=humor') && title.length > 5 && !title.includes('이벤트')) {
            // 부모 td에서 다른 정보 추출
            const $parent = $link.parent();
            if ($parent.prop('tagName') === 'TD') {
              const $tr = $parent.parent();
              const $tds = $tr.find('td');
              
              const no = $tds.eq(0).text().trim();
              const author = $tds.eq(2).text().trim();
              const date = $tds.eq(3).text().trim();
              const views = $tds.eq(5).text().trim();
              
              // 숫자 글번호만 선택 (공지 제외)
              if (!isNaN(no) && no.length > 3) {
                const fullUrl = href.startsWith('http') ? href : `https://www.ppomppu.co.kr/zboard/${href}`;
                hotIssues.push({
                  id: count + 1,
                  title: title.substring(0, 100),
                  source: '뽐뿌',
                  views: views || '0',
                  comments: '0',
                  thumbnail: 'https://via.placeholder.com/300x200?text=뽐뿌',
                  url: fullUrl,
                  date: date
                });
                count++;
                console.log(`  ✅ [${count}] ${title.substring(0, 50)}...`);
              }
            }
          }
        });
        
        console.log(`🎉 뽐뿌 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌ 뽐뿌 크롤링 실패:', error.message);
        hotIssues = getSampleData('뽐뿌');
      }
    } else if (siteId === 'dcinside') {
      // 디시인사이드 크롤링
      try {
        console.log('🔍 디시인사이드 베스트 갤러리 크롤링 시작...');
        const response = await axios.get('https://gall.dcinside.com/board/lists/?id=dcbest', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          }
        });

        const $ = cheerio.load(response.data);
        const posts = $('tr.ub-content');

        posts.each((i, elem) => {
          const $elem = $(elem);
          const num = $elem.find('.gall_num').text().trim();

          // 숫자인 경우만 (설문, 공지, 추천 등 제외)
          if (/^\d+$/.test(num)) {
            const titleElem = $elem.find('.gall_tit a');
            const title = titleElem.text().trim();
            const link = titleElem.attr('href');
            const writer = $elem.find('.gall_writer').text().trim();
            const dateTitle = $elem.find('.gall_date').attr('title');
            const dateText = $elem.find('.gall_date').text().trim();
            const views = $elem.find('.gall_count').text().trim();
            const recommend = $elem.find('.gall_recommend').text().trim();

            // 댓글 수 추출
            const replyMatch = title.match(/\[(\d+)\]/);
            const replies = replyMatch ? replyMatch[1] : '0';

            // 제목에서 댓글 수 제거
            const cleanTitle = title.replace(/\[\d+\]/, '').trim();

            // 갤러리명 추출 (앞에 [갤러리명] 형태로 되어 있음)
            const gallMatch = cleanTitle.match(/^\[(.*?)\]/);
            const displayTitle = gallMatch ? cleanTitle : `[DC] ${cleanTitle}`;

            hotIssues.push({
              title: displayTitle,
              url: link ? `https://gall.dcinside.com${link}` : '',
              views: views || '0',
              date: dateTitle || dateText,
              author: writer,
              replies: replies,
              recommend: recommend || '0'
            });

            // 상위 10개만
            if (hotIssues.length >= 10) return false;
          }
        });

        console.log(`🎉 디시인사이드 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌ 디시인사이드 크롤링 실패:', error.message);
        hotIssues = getSampleData('디시인사이드');
      }
    } else if (siteId === 'instiz') {
      // 인스티즈 크롤링
      try {
        console.log('🔍 인스티즈 크롤링 시작...');
        const response = await axios.get('https://www.instiz.net/pt/0', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          }
        });

        const $ = cheerio.load(response.data);
        
        // 게시글 링크 수집 (숫자 ID가 있는 /pt/ 링크만)
        const postLinks = $('a[href*="/pt/"]').filter((i, elem) => {
          const href = $(elem).attr('href');
          return href && href.match(/\/pt\/\d+/);
        });

        postLinks.each((i, elem) => {
          const $elem = $(elem);
          const title = $elem.text().trim();
          const href = $elem.attr('href');

          // 댓글 수 추출 (끝에 숫자)
          const replyMatch = title.match(/(\d+)$/);
          const replies = replyMatch ? replyMatch[1] : '0';
          const cleanTitle = replyMatch ? title.replace(/\d+$/, '').trim() : title;

          // URL에서 파라미터 제거 및 절대 경로로 변환
          const cleanUrl = href.split('?')[0];
          const fullUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://www.instiz.net${cleanUrl}`;

          hotIssues.push({
            title: cleanTitle,
            url: fullUrl,
            views: '0',
            date: new Date().toISOString().split('T')[0],
            author: '인스티즈',
            replies: replies
          });

          // 상위 10개만
          if (hotIssues.length >= 10) return false;
        });

        console.log(`🎉 인스티즈 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌ 인스티즈 크롤링 실패:', error.message);
        hotIssues = getSampleData('인스티즈');
      }
    } else if (siteId === 'dogdrip') {
      // 개드립 크롤링 (인기 정렬 페이지)
      try {
        console.log('🔍 개드립 크롤링 시작 (popular)...');
        const response = await axios.get('https://www.dogdrip.net/?mid=dogdrip&sort_index=popular', {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.dogdrip.net/',
            'Cache-Control': 'no-cache'
          },
          validateStatus: function (status) { return status < 500; }
        });

        const $ = cheerio.load(response.data);

        // 인기 리스트에서 제목/링크 추출: 링크는 /dogdrip/숫자 형태
        const links = new Set();
        let count = 0;
        $('a[href^="/dogdrip/"]').each((i, elem) => {
          if (count >= 10) return false;

          const $a = $(elem);
          const href = $a.attr('href');
          const title = $a.text().trim().replace(/\s+/g, ' ');

          const idMatch = href && href.match(/^\/dogdrip\/(\d+)/);
          if (idMatch && title && title.length > 3 && !links.has(idMatch[1])) {
            links.add(idMatch[1]);
            const full = `https://www.dogdrip.net${idMatch[0]}`;
            hotIssues.push({
              id: count + 1,
              title: title.substring(0, 100),
              source: '개드립',
              views: '인기',
              comments: '-',
              thumbnail: 'https://via.placeholder.com/300x200?text=개드립',
              url: full,
              date: new Date().toISOString().split('T')[0]
            });
            count++;
          }
        });

        console.log(`🎉 개드립 크롤링 성공: ${hotIssues.length}개 게시글`);
        if (hotIssues.length === 0) {
          console.error('⚠️ 개드립: 파싱된 게시글이 0개입니다');
        }
      } catch (error) {
        console.error('❌ 개드립 크롤링 실패:', error.message);
        console.error('   상세:', error.response?.status, error.response?.statusText, error.code);
        console.error('   Stack:', error.stack);
        hotIssues = [];
      }
    } else if (siteId === 'natepann') {
      // 네이트판 크롤링
      try {
        console.log('🔍 네이트판 크롤링 시작...');
        const response = await axios.get('https://pann.nate.com/', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          }
        });

        const $ = cheerio.load(response.data);
        
        // 썸네일이 있는 게시글 수집 (메인 페이지 중간의 큰 이미지 3개)
        const thumbContainers = $('.thumb');

        thumbContainers.each((i, elem) => {
          const $container = $(elem).parent();

          // 썸네일 이미지
          const thumbImg = $(elem).find('img');
          const thumbUrl = thumbImg.attr('src');
          const thumbLink = $(elem).find('a');
          const thumbHref = thumbLink.attr('href');

          // m-info에서 제목 찾기
          const mInfo = $container.find('.m-info');
          const titleElem = mInfo.find('h2 a');
          const title = titleElem.text().trim();
          const titleHref = titleElem.attr('href');

          // URL 결정
          const url = titleHref || thumbHref;

          if (title && url) {
            const absoluteUrl = url.startsWith('http') ? url : `https://pann.nate.com${url}`;

            hotIssues.push({
              title: title,
              url: absoluteUrl,
              views: '0',
              date: new Date().toISOString().split('T')[0],
              author: '네이트판',
              replies: '0',
              thumbnail: thumbUrl
            });
          }
        });

        console.log(`🎉 네이트판 크롤링 성공: ${hotIssues.length}개 게시글`);
      } catch (error) {
        console.error('❌네이트판 크롤링 실패:', error.message);
        hotIssues = getSampleData('네이트판');
      }    } else if (siteId === 'shortform') {
      // 숏폼 - 틱톡 또는 유튜브 쇼츠 랜덤 선택
      console.log('🎵 숏폼 콘텐츠 생성...');
      const shortformOptions = [
        {
          type: 'tiktok',
          categories: [
            { title: '🔥 지금 핫한 틱톡', url: 'https://www.tiktok.com/ko-KR/', icon: '🔥' },
            { title: '😂 웃긴 영상', url: 'https://www.tiktok.com/tag/funny', icon: '😂' },
            { title: '💃 댄스 챌린지', url: 'https://www.tiktok.com/tag/dance', icon: '💃' },
            { title: '🎵 인기 음악', url: 'https://www.tiktok.com/music', icon: '🎵' },
          ]
        },
        {
          type: 'youtube',
          categories: [
            { title: '🔥 지금 인기 쇼츠', url: 'https://www.youtube.com/shorts', icon: '🔥' },
            { title: '😂 웃긴 쇼츠', url: 'https://www.youtube.com/hashtag/funny', icon: '😂' },
            { title: '🎮 게임 쇼츠', url: 'https://www.youtube.com/hashtag/gaming', icon: '🎮' },
            { title: '🎵 음악 쇼츠', url: 'https://www.youtube.com/hashtag/music', icon: '🎵' },
          ]
        }
      ];
      
      // 랜덤으로 하나 선택
      const selected = shortformOptions[Math.floor(Math.random() * shortformOptions.length)];
      const sourceName = selected.type === 'tiktok' ? '틱톡' : '유튜브 쇼츠';
      
      hotIssues = selected.categories.map((cat, index) => ({
        id: `${selected.type}-${index}`,
        title: cat.title,
        source: sourceName,
        url: cat.url,
        views: '인기',
        comments: '-',
        thumbnail: `https://via.placeholder.com/300x200?text=${encodeURIComponent(sourceName)}`,
        date: new Date().toISOString().split('T')[0]
      }));
      
      console.log(`🎉 숏폼(${sourceName}) 생성 완료: ${hotIssues.length}개 항목`);    } else if (siteId === 'tiktok') {
      // 틱톡 숏폼 - 인기 콘텐츠 카테고리 제공
      console.log('🎵 틱톡 숏폼 콘텐츠 생성...');
      const tiktokCategories = [
        { title: '🔥 지금 뜨는 틱톡', url: 'https://www.tiktok.com/explore', icon: '🔥' },
        { title: '😂 웃긴 영상 모음', url: 'https://www.tiktok.com/tag/funny', icon: '😂' },
        { title: '🎵 음악 & 댄스', url: 'https://www.tiktok.com/music', icon: '🎵' },
        { title: '🍳 요리 & 레시피', url: 'https://www.tiktok.com/tag/cooking', icon: '🍳' },
        { title: '💄 뷰티 & 패션', url: 'https://www.tiktok.com/tag/beauty', icon: '💄' },
        { title: '🐱 귀여운 동물', url: 'https://www.tiktok.com/tag/pets', icon: '🐱' },
        { title: '🎮 게임 하이라이트', url: 'https://www.tiktok.com/tag/gaming', icon: '🎮' },
        { title: '✈️ 여행 & 일상', url: 'https://www.tiktok.com/tag/travel', icon: '✈️' },
      ];
      
      hotIssues = tiktokCategories.map((cat, index) => ({
        id: `tiktok-${index}`,
        title: cat.title,
        url: cat.url,
        views: '인기',
        date: new Date().toISOString().split('T')[0],
        author: '틱톡',
        replies: '0',
        type: 'shortform',
        platform: 'tiktok',
        icon: cat.icon
      }));
      
      console.log(`🎉 틱톡 숏폼 생성 완료: ${hotIssues.length}개 카테고리`);
    } else if (siteId === 'youtube-shorts') {
      // 유튜브 쇼츠 - 인기 콘텐츠 카테고리 제공
      console.log('▶️ 유튜브 쇼츠 콘텐츠 생성...');
      const youtubeCategories = [
        { title: '🔥 지금 인기 쇼츠', url: 'https://www.youtube.com/shorts', icon: '🔥' },
        { title: '😂 웃긴 쇼츠', url: 'https://www.youtube.com/hashtag/funny', icon: '😂' },
        { title: '🎮 게임 쇼츠', url: 'https://www.youtube.com/hashtag/gaming', icon: '🎮' },
        { title: '🎵 음악 쇼츠', url: 'https://www.youtube.com/hashtag/music', icon: '🎵' },
        { title: '🍳 요리 레시피', url: 'https://www.youtube.com/hashtag/cooking', icon: '🍳' },
        { title: '🐶 반려동물', url: 'https://www.youtube.com/hashtag/pets', icon: '🐶' },
        { title: '⚽ 스포츠 하이라이트', url: 'https://www.youtube.com/hashtag/sports', icon: '⚽' },
        { title: '🎬 영화 & 드라마', url: 'https://www.youtube.com/hashtag/movies', icon: '🎬' },
      ];
      
      hotIssues = youtubeCategories.map((cat, index) => ({
        id: `youtube-shorts-${index}`,
        title: cat.title,
        url: cat.url,
        views: '인기',
        date: new Date().toISOString().split('T')[0],
        author: '유튜브',
        replies: '0',
        type: 'shortform',
        platform: 'youtube',
        icon: cat.icon
      }));
      
      console.log(`🎉 유튜브 쇼츠 생성 완료: ${hotIssues.length}개 카테고리`);
    } else if (siteId === 'yosimdae') {
      // 여성시대 - 회원가입 필요 커뮤니티
      console.log('👩 여성시대 정보 생성...');
      hotIssues = [{
        id: 'yosimdae-main',
        title: '✨ 여성시대 메인 게시판',
        url: 'https://cafe.daum.net/subdued20club',
        views: '회원전용',
        date: new Date().toISOString().split('T')[0],
        author: '여성시대',
        replies: '0',
        type: 'membership',
        favicon: 'https://t1.daumcdn.net/cafe_image/favicon/v3/cafe_daum_favicon_152x152.png'
      }];
      console.log('✅ 여성시대 정보 생성 완료');
    } else if (siteId === 'jjukbbang') {
      // 쭉빵 - 회원가입 필요 커뮤니티
      console.log('🍞 쭉빵 정보 생성...');
      hotIssues = [{
        id: 'jjukbbang-main',
        title: '🍞 쭉빵 메인 게시판',
        url: 'https://cafe.daum.net/ok1221',
        views: '회원전용',
        date: new Date().toISOString().split('T')[0],
        author: '쭉빵',
        replies: '0',
        type: 'membership',
        favicon: 'https://t1.daumcdn.net/cafe_image/favicon/v3/cafe_daum_favicon_152x152.png'
      }];
      console.log('✅ 쭉빵 정보 생성 완료');
    } else if (siteId === 'everytime') {
      // 에브리타임 - 회원가입 필요 커뮤니티
      console.log('🎓 에브리타임 정보 생성...');
      hotIssues = [{
        id: 'everytime-main',
        title: '🎓 에브리타임 메인 게시판',
        url: 'https://everytime.kr/',
        views: '회원전용',
        date: new Date().toISOString().split('T')[0],
        author: '에브리타임',
        replies: '0',
        type: 'membership',
        favicon: 'https://everytime.kr/images/favicon.png'
      }];
      console.log('✅ 에브리타임 정보 생성 완료');
    } else if (siteId === 'blind') {
      // 블라인드 - 회원가입 필요 커뮤니티
      console.log('🕶️ 블라인드 정보 생성...');
      hotIssues = [{
        id: 'blind-main',
        title: '🕶️ 블라인드 메인 게시판',
        url: 'https://www.teamblind.com/kr/',
        views: '회원전용',
        date: new Date().toISOString().split('T')[0],
        author: '블라인드',
        replies: '0',
        type: 'membership',
        favicon: 'https://www.teamblind.com/favicon.ico'
      }];
      console.log('✅ 블라인드 정보 생성 완료');
    } else {
      // 다른 사이트는 샘플 데이터
      const siteNames = {
        'fmkorea': '에펨코리아',
      };
      const siteName = siteNames[siteId] || '커뮤니티';
      hotIssues = getSampleData(siteName);
    }

    // 데이터가 없으면 샘플 데이터
    if (hotIssues.length === 0) {
      const siteNames = {
        'humoruniv': '웃긴대학',
        'todayhumor': '오늘의유머',
        'mlbpark': 'MLBPARK',
        'ppomppu': '뽐뿌',
        'fmkorea': '에펨코리아',
        'dcinside': '디시인사이드',
        'instiz': '인스티즈',
        'dogdrip': '개드립',
        'natepann': '네이트판',
        'yosimdae': '여성시대',
        'jjukbbang': '쭉빵',
        'everytime': '에브리타임',
        'blind': '블라인드',
        'tiktok': '틱톡',
        'youtube-shorts': '유튜브 쇼츠',
      };
      const siteName = siteNames[siteId] || '커뮤니티';
      hotIssues = getSampleData(siteName);
    }

    res.json(hotIssues);
  } catch (error) {
    console.error('핫이슈 가져오기 오류:', error);
    res.status(500).json({ error: '핫이슈를 가져올 수 없습니다' });
  }
});

// 샘플 데이터 생성 함수
function getSampleData(siteName) {
  const siteUrlMap = {
    '웃긴대학': 'https://m.humoruniv.com/board/list.html?table=pds',
    '오늘의유머': 'https://www.todayhumor.co.kr/board/list.php?table=bestofbest',
    'MLBPARK': 'https://mlbpark.donga.com/mp/b.php?m=list&b=bullpen',
    '뽐뿌': 'https://www.ppomppu.co.kr/zboard/zboard.php?id=humor',
    '에펨코리아': 'https://www.fmkorea.com/humor',
    '디시인사이드': 'https://gall.dcinside.com/board/lists/?id=dcbest',
    '인스티즈': 'https://www.instiz.net/pt/0',
    '개드립': 'https://www.dogdrip.net/',
    '네이트판': 'https://pann.nate.com/',
  };

  const fallbackUrl = siteUrlMap[siteName] || 'https://www.google.com';

  const samples = [];
  for (let i = 1; i <= 3; i++) {
    samples.push({
      id: i,
      title: `${siteName} 인기글 ${i} - 실제 크롤링 구현 예정`,
      source: siteName,
      views: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}k`,
      comments: Math.floor(Math.random() * 100) + 10,
      thumbnail: `https://via.placeholder.com/300x200?text=${encodeURIComponent(siteName)}`,
      url: fallbackUrl
    });
  }
  return samples;
}

// 기존 핫이슈 API (호환성 유지)
app.get('/api/hot-issues', async (req, res) => {
  try {
    const hotIssues = [];

    // 웃긴대학 크롤링 (샘플)
    try {
      const response = await axios.get('https://www.humoruniv.com/', {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const $ = cheerio.load(response.data);
      
      // 실제 크롤링 로직은 사이트 구조에 따라 수정 필요
      hotIssues.push({
        id: 1,
        title: '웃긴대학 인기글 (크롤링 로직 필요)',
        source: '웃긴대학',
        views: '1.2k',
        comments: '45',
        thumbnail: 'https://via.placeholder.com/300x200',
        url: 'https://www.humoruniv.com/'
      });
    } catch (error) {
      console.error('웃긴대학 크롤링 실패:', error.message);
    }

    // 에프엠코리아 크롤링 (샘플)
    try {
      hotIssues.push({
        id: 2,
        title: '에프엠코리아 인기글 (크롤링 로직 필요)',
        source: '에프엠코리아',
        views: '2.5k',
        comments: '89',
        thumbnail: 'https://via.placeholder.com/300x200',
        url: 'https://www.fmkorea.com/'
      });
    } catch (error) {
      console.error('에프엠코리아 크롤링 실패:', error.message);
    }

    // 샘플 데이터 추가
    if (hotIssues.length === 0) {
      hotIssues.push(
        {
          id: 1,
          title: '샘플 핫이슈 1 - 실제 크롤링 로직을 추가해주세요',
          source: '웃긴대학',
          views: '1.2k',
          comments: '45',
          thumbnail: 'https://via.placeholder.com/300x200'
        },
        {
          id: 2,
          title: '샘플 핫이슈 2 - 백엔드 서버가 정상 작동중입니다',
          source: '에프엠코리아',
          views: '2.5k',
          comments: '89',
          thumbnail: 'https://via.placeholder.com/300x200'
        }
      );
    }

    res.json(hotIssues);
  } catch (error) {
    console.error('핫이슈 가져오기 오류:', error);
    res.status(500).json({ error: '핫이슈를 가져올 수 없습니다' });
  }
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '백엔드 서버 정상 작동중' });
});

// 이미지 프록시 (CORS 우회)
app.get('/api/image-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL이 필요합니다' });
    }
    
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.humoruniv.com/'
      }
    });
    
    // Content-Type 헤더 설정
    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // 1일 캐시
    res.send(response.data);
  } catch (error) {
    console.error('이미지 프록시 에러:', error.message);
    res.status(500).json({ error: '이미지를 불러올 수 없습니다' });
  }
});

// Health check 엔드포인트 (Render 슬립 모드 방지용)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.json({ 
    message: '심심할때 여기어때 백엔드 API',
    version: '1.0.0',
    endpoints: {
      hotIssues: '/api/hot-issues/:siteId',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 포트 ${PORT}에서 실행중입니다`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
