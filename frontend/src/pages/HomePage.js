import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HotIssueCard from '../components/HotIssueCard';
import SiteGrid from '../components/SiteGrid';
import AdBanner from '../components/AdBanner';

const HomePage = () => {
  const [hotIssues, setHotIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    // 랜덤으로 사이트 선택
    selectRandomSiteAndFetchIssues();
  }, []);

  const selectRandomSiteAndFetchIssues = async () => {
    // 크롤링 구현된 사이트만 표시 (앱 내에서 볼 수 있는 사이트만)
    const crawlableSites = [
      { id: 'humoruniv', name: '웃긴대학', category: '커뮤니티' },
      { id: 'todayhumor', name: '오늘의유머', category: '커뮤니티' },
      { id: 'ppomppu', name: '뽐뿌', category: '커뮤니티' },
      { id: 'dcinside', name: '디시인사이드', category: '커뮤니티' },
      { id: 'instiz', name: '인스티즈', category: '커뮤니티' },
      { id: 'dogdrip', name: '개드립', category: '커뮤니티' },
      { id: 'natepann', name: '네이트판', category: '커뮤니티' },
      { id: 'shortform', name: '숏폼', category: '숏폼' },
    ];
    
    // 랜덤 선택
    const randomSite = crawlableSites[Math.floor(Math.random() * crawlableSites.length)];
    setSelectedSite(randomSite);
    
    // 백엔드에서 핫이슈 가져오기
    await fetchHotIssues(randomSite.id);
  };

  const fetchHotIssues = async (siteId) => {
    try {
      // 모바일 앱용 PC IP 주소 사용
      const apiUrl = 'http://192.168.219.113:5000';
      
      const response = await fetch(`${apiUrl}/api/hot-issues/${siteId}`);
      const data = await response.json();
      setHotIssues(data);
    } catch (error) {
      console.error('핫이슈 불러오기 실패:', error);
      // 에러 시 샘플 데이터 사용
      setHotIssues([
        {
          id: 1,
          title: `${selectedSite?.name || '커뮤니티'} 인기글 1 - 실제 크롤링 데이터로 대체 예정`,
          source: selectedSite?.name || '커뮤니티',
          views: '1.2k',
          comments: '45',
          thumbnail: 'https://via.placeholder.com/300x200',
          url: '#'
        },
        {
          id: 2,
          title: `${selectedSite?.name || '커뮤니티'} 인기글 2 - 클릭하면 해당 사이트로 이동`,
          source: selectedSite?.name || '커뮤니티',
          views: '2.5k',
          comments: '89',
          thumbnail: 'https://via.placeholder.com/300x200',
          url: '#'
        },
        {
          id: 3,
          title: `${selectedSite?.name || '커뮤니티'} 인기글 3 - 백엔드 크롤링 구현 필요`,
          source: selectedSite?.name || '커뮤니티',
          views: '890',
          comments: '23',
          thumbnail: 'https://via.placeholder.com/300x200',
          url: '#'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const communities = [
    { id: 'humoruniv', name: '웃긴대학', url: 'https://m.humoruniv.com/board/list.html?table=pds', icon: '😄' },
    { id: 'todayhumor', name: '오늘의유머', url: 'https://www.todayhumor.co.kr/', icon: '😂' },
    { id: 'mlbpark', name: 'MLBPARK', url: 'https://mlbpark.donga.com/mp/b.php?b=bullpen', icon: '⚾' },
    { id: 'ppomppu', name: '뽐뿌', url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', icon: '💰' },
    { id: 'fmkorea', name: '에펨코리아', url: 'https://www.fmkorea.com/humor', icon: '🔥' },
    { id: 'dcinside', name: '디시인사이드', url: 'https://www.dcinside.com/', icon: '💬' },
    { id: 'instiz', name: '인스티즈', url: 'https://www.instiz.net/', icon: '✨' },
    { id: 'dogdrip', name: '개드립', url: 'https://www.dogdrip.net/', icon: '🐶' },
    { id: 'natepann', name: '네이트판', url: 'https://pann.nate.com/', icon: '💭' },
    { id: 'yosimdae', name: '여성시대', url: 'https://cafe.daum.net/subdued20club', icon: '👩' },
    { id: 'jjukbbang', name: '쭉빵', url: 'https://cafe.daum.net/ok1221', icon: '🍞' },
    { id: 'everytime', name: '에브리타임', url: 'https://everytime.kr/', icon: '🎓' },
    { id: 'blind', name: '블라인드', url: 'https://www.teamblind.com/kr/', icon: '🕶️' },
  ];

  const shortforms = [
    { id: 'tiktok', name: '틱톡', url: 'https://www.tiktok.com/ko-KR/', icon: '🎵' },
    { id: 'youtube-shorts', name: '유튜브 쇼츠', url: 'https://www.youtube.com/shorts/tV5XZE38xvU', icon: '▶️' },
  ];

  const webtoons = [
    { id: 'naver-webtoon', name: '네이버웹툰', url: 'https://comic.naver.com/index', icon: '📗' },
    { id: 'kakao-webtoon', name: '카카오웹툰', url: 'https://webtoon.kakao.com/', icon: '📙' },
    { id: 'lezhin', name: '레진코믹스', url: 'https://www.lezhin.com/ko', icon: '📕' },
    { id: 'ridi-webtoon', name: '리디웹툰', url: 'https://ridibooks.com/webtoon/recommendation', icon: '📘' },
    { id: 'toomics', name: '투믹스', url: 'https://www.toomics.com/', icon: '📔' },
    { id: 'comico', name: '코미코', url: 'https://www.comico.jp/', icon: '📒' },
  ];

  const novels = [
    { id: 'munpia', name: '문피아', url: 'https://www.munpia.com/', icon: '📚' },
    { id: 'kakaopage', name: '카카오페이지', url: 'https://page.kakao.com/', icon: '📖' },
    { id: 'naver-series', name: '네이버시리즈', url: 'https://series.naver.com/novel/home.series', icon: '📘' },
    { id: 'ridibooks', name: '리디북스', url: 'https://ridibooks.com/romance/webnovel', icon: '📙' },
    { id: 'novelpia', name: '노벨피아', url: 'https://novelpia.com/', icon: '📗' },
    { id: 'blice', name: '블라이스', url: 'https://www.blice.co.kr/web/homescreen/main.kt?service=WEBNOVEL&genre=romance', icon: '📕' },
    { id: 'bookpal', name: '북팔', url: 'https://www.bookpal.co.kr/', icon: '📔' },
  ];

  const games = [
    { id: 'poki', name: 'Poki', url: 'https://poki.com/kr', icon: '🎮' },
    { id: 'y8', name: 'Y8게임', url: 'https://ko.y8.com/', icon: '🕹️' },
    { id: 'crazygames', name: 'Crazy Games', url: 'https://www.crazygames.com/', icon: '🎯' },
    { id: 'miniclip', name: 'Miniclip', url: 'https://miniclip.com/', icon: '🎲' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* 상단 광고 */}
      <AdBanner position="top" />
      
      {/* 로그인 안내 문구 */}
      <div className="text-white/70 text-sm mb-4 px-1">
        * 최초 로그인 1회 로그인 시 로그인 상태 유지됩니다.
      </div>
      
      {/* 오늘의 핫이슈 섹션 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center">
            🔥 오늘의 핫이슈
            {selectedSite && (
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                {selectedSite.name}
              </span>
            )}
          </h2>
          <button
            onClick={selectRandomSiteAndFetchIssues}
            className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap flex-shrink-0"
          >
            🔄 다시보기
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
          {loading ? (
            <div className="text-white">로딩 중...</div>
          ) : (
            hotIssues.map((issue) => (
              <HotIssueCard 
                key={issue.id} 
                issue={issue} 
                siteId={selectedSite?.id || 'humoruniv'} 
              />
            ))
          )}
        </div>
      </section>

      {/* 커뮤니티 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          💬 커뮤니티
        </h2>
        <SiteGrid sites={communities} categoryName="커뮤니티" />
      </section>

      {/* 중간 광고 */}
      <AdBanner position="middle" />

      {/* 숏폼 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎵 숏폼
        </h2>
        <SiteGrid sites={shortforms} categoryName="숏폼" />
      </section>

      {/* 웹툰 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          📚 웹툰
        </h2>
        <SiteGrid sites={webtoons} categoryName="웹툰" />
      </section>

      {/* 소설 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          📖 웹소설
        </h2>
        <SiteGrid sites={novels} categoryName="웹소설" />
      </section>

      {/* 게임 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎮 웹게임
        </h2>
        <SiteGrid sites={games} categoryName="웹게임" />
      </section>

      {/* 하단 광고 */}
      <AdBanner position="bottom" />
    </div>
  );
};

export default HomePage;
