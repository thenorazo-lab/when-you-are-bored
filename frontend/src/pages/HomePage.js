import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import HotIssueCard from '../components/HotIssueCard';
import SiteGrid from '../components/SiteGrid';

// 오늘의 핫이슈 랜덤 후보 (개드립·여성시대 제외)
const CRAWLABLE_SITES = [
  { id: 'humoruniv', name: '웃긴대학', category: '커뮤니티' },
  { id: 'todayhumor', name: '오늘의유머', category: '커뮤니티' },
  { id: 'ppomppu', name: '뽐뿌', category: '커뮤니티' },
  { id: 'natepann', name: '네이트판', category: '커뮤니티' },
  { id: 'dcinside', name: '디시인사이드', category: '커뮤니티' },
  { id: 'instiz', name: '인스티즈', category: '커뮤니티' },
  { id: 'mlbpark', name: 'MLBPARK', category: '커뮤니티' },
];

const HomePage = () => {
  const [hotIssues, setHotIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(null);

  const fetchHotIssues = useCallback(async (siteId, siteName) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://roamom-backend.onrender.com';
      const response = await fetch(`${apiUrl}/api/hot-issues/${siteId}`);
      const data = await response.json();
      setHotIssues(data);
    } catch (err) {
      console.error('핫이슈 불러오기 실패:', err);
      const name = siteName || '커뮤니티';
      setHotIssues([
        { id: 1, title: `${name} 인기글 1 - 로딩 실패`, source: name, views: '1.2k', comments: '45', thumbnail: 'https://via.placeholder.com/300x200', url: '#' },
        { id: 2, title: `${name} 인기글 2 - 클릭 시 해당 사이트로 이동`, source: name, views: '2.5k', comments: '89', thumbnail: 'https://via.placeholder.com/300x200', url: '#' },
        { id: 3, title: `${name} 인기글 3`, source: name, views: '890', comments: '23', thumbnail: 'https://via.placeholder.com/300x200', url: '#' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRandomSiteAndFetchIssues = useCallback(async () => {
    const randomSite = CRAWLABLE_SITES[Math.floor(Math.random() * CRAWLABLE_SITES.length)];
    setSelectedSite(randomSite);
    await fetchHotIssues(randomSite.id, randomSite.name);
  }, [fetchHotIssues]);

  // 마운트 시 1회만 실행 (의존 배열에 selectRandomSiteAndFetchIssues 넣으면 무한 루프 발생하므로 빈 배열)
  useEffect(() => {
    selectRandomSiteAndFetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const communities = [
    { id: 'humoruniv', name: '웃긴대학', url: 'https://m.humoruniv.com/board/list.html?table=pds', icon: '😄' },
    { id: 'todayhumor', name: '오늘의유머', url: 'https://m.todayhumor.co.kr/list.php?table=bestofbest', icon: '😂' },
    { id: 'ppomppu', name: '뽐뿌', url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', icon: '💰' },
    { id: 'fmkorea', name: '에펨코리아', url: 'https://www.fmkorea.com/humor', icon: '🔥' },
    { id: 'dogdrip', name: '개드립', url: 'https://www.dogdrip.net/', icon: '🐶' },
    { id: 'natepann', name: '네이트판', url: 'https://pann.nate.com/', icon: '💭' },
    { id: 'mlbpark', name: 'MLBPARK', url: 'https://mlbpark.donga.com/mp/b.php?b=bullpen', icon: '⚾' },
    { id: 'dcinside', name: '디시인사이드', url: 'https://www.dcinside.com/', icon: '💬' },
    { id: 'instiz', name: '인스티즈', url: 'https://www.instiz.net/hot.htm', icon: '✨' },
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
    { id: 'kakao-webtoon', name: '카카오웹툰', url: 'https://webtoon.kakao.com/', icon: '📙' },
    { id: 'naver-webtoon', name: '네이버웹툰', url: 'https://comic.naver.com/index', icon: '📗' },
    { id: 'lezhin', name: '레진코믹스', url: 'https://www.lezhin.com/ko', icon: '📕' },
    { id: 'toomics', name: '투믹스', url: 'https://www.toomics.com/', icon: '📔' },
    { id: 'ridi-webtoon', name: '리디웹툰', url: 'https://ridibooks.com/webtoon/recommendation', icon: '📘' },
    { id: 'comico', name: '코미코', url: 'https://www.comico.jp/', icon: '📒' },
  ];

  const novels = [
    { id: 'kakaopage', name: '카카오페이지', url: 'https://page.kakao.com/', icon: '📖' },
    { id: 'naver-series', name: '네이버시리즈', url: 'https://series.naver.com/novel/home.series', icon: '📘' },
    { id: 'novelpia', name: '노벨피아', url: 'https://novelpia.com/', icon: '📗' },
    { id: 'blice', name: '블라이스', url: 'https://www.blice.co.kr/web/homescreen/main.kt?service=WEBNOVEL&genre=romance', icon: '📕' },
    { id: 'bookpal', name: '북팔', url: 'https://www.bookpal.co.kr/', icon: '📔' },
    { id: 'munpia', name: '문피아', url: 'https://www.munpia.com/', icon: '📚' },
    { id: 'ridibooks', name: '리디북스', url: 'https://ridibooks.com/romance/webnovel', icon: '📙' },
  ];

  const aiServices = [
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', icon: '🤖' },
    { id: 'claude', name: 'Claude', url: 'https://claude.ai/new', icon: '🧠' },
    { id: 'wrtn', name: '뤼튼', url: 'https://wrtn.ai/', icon: '✨' },
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
      <div className="text-white/70 text-sm mb-4 px-1">
        * 최초 1회만 로그인하면 로그인 상태가 유지됩니다.
      </div>
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

      {/* AI 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          🤖 AI
        </h2>
        <SiteGrid sites={aiServices} categoryName="AI" />
      </section>

      {/* 게임 섹션 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎮 웹게임
        </h2>
        <SiteGrid sites={games} categoryName="웹게임" />
      </section>

      {/* 하단 광고 배너 여유 공간 */}
      <div className="h-24"></div>
    </div>
  );
};

export default HomePage;
