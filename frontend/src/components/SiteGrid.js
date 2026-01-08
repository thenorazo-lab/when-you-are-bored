import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { visitHistoryManager } from '../utils/visitHistory';

const SiteGrid = ({ sites, categoryName }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const handleSiteClick = async (e, site) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🎯 SiteGrid 클릭:', site.name, site.url);
    
    try {
      // iframe 차단 사이트 목록
      const blockedSites = [
        'mlbpark','everytime','blind','yosimdae','jjukbbang','dcinside','instiz',
        // 숏폼
        'tiktok','youtube-shorts',
        // 웹툰
        'naver-webtoon','kakao-webtoon','lezhin','ridi-webtoon','toomics','comico',
        // 웹소설
        'munpia','kakaopage','naver-series','ridibooks','novelpia','blice','bookpal',
        // AI
        'chatgpt','claude','wrtn',
        // 웹게임
        'poki','y8','crazygames','miniclip'
      ];
      
      // 차단 사이트는 외부 브라우저로 열기
      if (blockedSites.includes(site.id)) {
        console.log('🌐 외부 브라우저로 열기:', site.url);
        visitHistoryManager.recordVisit(site.id, site.name);
        
        if (Capacitor.isNativePlatform()) {
          await Browser.open({ url: site.url });
        } else {
          window.open(site.url, '_blank');
        }
        return;
      }
      
      // 일반 사이트는 앱 내 뷰어로
      visitHistoryManager.recordVisit(site.id, site.name);
      localStorage.setItem('currentArticleUrl', site.url);
      console.log('✅ localStorage 저장:', site.url);
      console.log('🚀 직접 이동 to /#/view/' + site.id);
      
      // navigate 대신 직접 URL 변경
      window.location.hash = `/view/${site.id}`;
    } catch (error) {
      console.error('❌ 클릭 에러:', error);
    }
  };

  const displaySites = showAll ? sites : sites.slice(0, 4);
  const hasMore = sites.length > 4;

  // 도메인에서 favicon 가져오기
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {displaySites.map((site) => {
          const hasVisited = visitHistoryManager.hasVisited(site.id);
          const faviconUrl = getFaviconUrl(site.url);
          
          return (
            <button
              key={site.id}
              onClick={(e) => {
                console.log('👆 button onClick 발생!');
                handleSiteClick(e, site);
              }}
              className={`backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full ${
                hasVisited 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {/* 로고 이미지 */}
              <div className="flex justify-center items-center mb-1 h-8" style={{ pointerEvents: 'none' }}>
                {faviconUrl ? (
                  <img 
                    src={faviconUrl} 
                    alt={site.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className="text-2xl" style={{ display: faviconUrl ? 'none' : 'block' }}>
                  {site.icon || '🌐'}
                </div>
              </div>
              
              <h3 className={`text-center font-bold text-[10px] ${
                hasVisited ? 'text-white/60' : 'text-white'
              }`} style={{ pointerEvents: 'none' }}>
                {site.name}
              </h3>
              
              {/* 외부 브라우저 배지 */}
              {site.badge && (
                <div className="mt-1 text-[8px] text-orange-300 font-bold" style={{ pointerEvents: 'none' }}>
                  🌐 {site.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 전체보기 버튼 */}
      {hasMore && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            {showAll ? '접기 ▲' : `전체보기 (${sites.length}개) ▼`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteGrid;
