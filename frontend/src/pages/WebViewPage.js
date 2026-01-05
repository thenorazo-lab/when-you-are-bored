import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { visitHistoryManager } from '../utils/visitHistory';

const WebViewPage = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  
  // localStorage에서 저장된 게시글 URL 확인 (초기화 시 한 번만 실행)
  const [currentUrl, setCurrentUrl] = useState(() => {
    const savedArticleUrl = localStorage.getItem('currentArticleUrl');
    if (savedArticleUrl) {
      console.log('✅ localStorage에서 URL 가져옴:', savedArticleUrl);
      localStorage.removeItem('currentArticleUrl');
      return savedArticleUrl;
    }
    return '';
  });
  
  const [currentName, setCurrentName] = useState('');

  const siteUrls = {
    // 커뮤니티
    'humoruniv': 'https://m.humoruniv.com/board/list.html?table=pds',
    'todayhumor': 'https://www.todayhumor.co.kr/',
    'mlbpark': 'https://mlbpark.donga.com/mp/b.php?b=bullpen',
    'ppomppu': 'https://www.ppomppu.co.kr/zboard/zboard.php?id=humor',
    'fmkorea': 'https://www.fmkorea.com/humor',
    'dcinside': 'https://www.dcinside.com/',
    'instiz': 'https://www.instiz.net/',
    'dogdrip': 'https://www.dogdrip.net/',
    'natepann': 'https://pann.nate.com/',
    'yosimdae': 'https://cafe.daum.net/subdued20club',
    'jjukbbang': 'https://cafe.daum.net/ok1221',
    'everytime': 'https://everytime.kr/',
    'blind': 'https://www.teamblind.com/kr/',
    // 숏폼
    'tiktok': 'https://www.tiktok.com/ko-KR/',
    'youtube-shorts': 'https://www.youtube.com/shorts/tV5XZE38xvU',
    // 웹툰
    'naver-webtoon': 'https://comic.naver.com/index',
    'kakao-webtoon': 'https://webtoon.kakao.com/',
    'lezhin': 'https://www.lezhin.com/ko',
    'ridi-webtoon': 'https://ridibooks.com/webtoon/recommendation',
    'toomics': 'https://www.toomics.com/',
    'comico': 'https://www.comico.jp/',
    // 웹소설
    'munpia': 'https://www.munpia.com/',
    'kakaopage': 'https://page.kakao.com/',
    'naver-series': 'https://series.naver.com/novel/home.series',
    'ridibooks': 'https://ridibooks.com/romance/webnovel',
    'novelpia': 'https://novelpia.com/',
    'blice': 'https://www.blice.co.kr/web/homescreen/main.kt?service=WEBNOVEL&genre=romance',
    'bookpal': 'https://www.bookpal.co.kr/',
    // 웹게임
    'poki': 'https://poki.com/kr',
    'y8': 'https://ko.y8.com/',
    'crazygames': 'https://www.crazygames.com/',
    'miniclip': 'https://miniclip.com/',
  };

  const siteNames = {
    // 커뮤니티
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
    // 숏폼
    'tiktok': '틱톡',
    'youtube-shorts': '유튜브 쇼츠',
    // 웹툰
    'naver-webtoon': '네이버웹툰',
    'kakao-webtoon': '카카오웹툰',
    'lezhin': '레진코믹스',
    'ridi-webtoon': '리디웹툰',
    'toomics': '투믹스',
    'comico': '코미코',
    // 웹소설
    'munpia': '문피아',
    'kakaopage': '카카오페이지',
    'naver-series': '네이버시리즈',
    'ridibooks': '리디북스',
    'novelpia': '노벨피아',
    'blice': '블라이스',
    'bookpal': '북팔',
    // 웹게임
    'poki': 'Poki',
    'y8': 'Y8게임',
    'crazygames': 'Crazy Games',
    'miniclip': 'Miniclip',
  };

  useEffect(() => {
    // currentUrl이 이미 설정되어 있으면 (localStorage에서 가져온 경우) 그대로 사용
    const url = currentUrl || siteUrls[siteId] || '';
    const name = siteNames[siteId] || siteId;
    
    console.log('🔍 WebViewPage useEffect');
    console.log('  currentUrl (state):', currentUrl);
    console.log('  siteId:', siteId);
    console.log('  siteUrls[siteId]:', siteUrls[siteId]);
    console.log('  final url:', url);
    
    // state 업데이트
    if (url && url !== currentUrl) {
      setCurrentUrl(url);
    }
    if (name !== currentName) {
      setCurrentName(name);
    }
    
    // 방문 기록 저장
    if (url && name) {
      visitHistoryManager.recordVisit(siteId, name);
    }
    
    // 모바일 앱에서는 항상 InAppBrowser 사용
    if (url && Capacitor.isNativePlatform()) {
      Browser.open({ 
        url,
        presentationStyle: 'popover',
        toolbarColor: '#667eea',
        windowName: '_blank'
      });
      Browser.addListener('browserFinished', () => {
        navigate('/');
      });
    } else if (url && !Capacitor.isNativePlatform()) {
      // 웹에서는 iframe 차단되는 사이트 자동 감지 후 외부 브라우저로 전환
      const blockedSites = ['tiktok', 'instagram', 'youtube-shorts', 'everytime'];
      if (blockedSites.some(site => siteId.includes(site))) {
        window.open(url, '_blank');
        setTimeout(() => navigate('/'), 100);
      }
    }
  }, [siteId, currentUrl, currentName, navigate]);

  return (
    <div className="min-h-screen p-4">
      {/* 헤더 */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
        >
          ← 뒤로가기
        </button>
        <h1 className="text-white font-bold text-xl">{currentName}</h1>
        <div className="w-20"></div>
      </div>

      {/* iframe 웹뷰 */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {!error ? (
          <iframe
            src={currentUrl}
            className="w-full h-full"
            title={currentName}
            onError={() => setError(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation"
            allow="payment; geolocation; microphone; camera"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              이 사이트는 웹에서 열 수 없습니다
            </h2>
            <p className="text-gray-600 mb-2 text-center">
              보안 정책상 iframe에서 차단되었습니다.
            </p>
            <p className="text-purple-600 font-bold mb-6 text-center">
              💡 모바일 앱으로 빌드하면 앱 내에서 열립니다!
            </p>
            <button
              onClick={() => {
                window.open(currentUrl, '_blank');
                navigate('/');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              외부 브라우저로 열기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebViewPage;
