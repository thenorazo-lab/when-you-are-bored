import React, { useState } from 'react';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { visitHistoryManager } from '../utils/visitHistory';

const SiteGrid = ({ sites, categoryName }) => {
  const [showAll, setShowAll] = useState(false);

  const handleSiteClick = async (e, site) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      visitHistoryManager.recordVisit(site.id, site.name);
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: site.url });
      } else {
        window.open(site.url, '_blank');
      }
    } catch (error) {
      console.error('사이트 열기 에러:', error);
    }
  };

  const displaySites = showAll ? sites : sites.slice(0, 4);
  const hasMore = sites.length > 4;
  const [failedIcons, setFailedIcons] = useState(new Set());

  // 도메인에서 favicon 가져오기 (여러 fallback 옵션)
  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      // DuckDuckGo API 사용 (더 안정적)
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch {
      return null;
    }
  };

  const handleImageError = (siteId) => {
    setFailedIcons(prev => new Set([...prev, siteId]));
  };

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {displaySites.map((site) => {
          const hasVisited = visitHistoryManager.hasVisited(site.id);
          const faviconUrl = getFaviconUrl(site.url);
          const showEmoji = !faviconUrl || failedIcons.has(site.id);
          
          return (
            <button
              key={site.id}
              onClick={(e) => handleSiteClick(e, site)}
              className={`backdrop-blur-md rounded-xl p-2 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full ${
                hasVisited 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {/* 로고 이미지 */}
              <div className="flex justify-center items-center mb-1 h-8" style={{ pointerEvents: 'none' }}>
                {!showEmoji && faviconUrl ? (
                  <img 
                    src={faviconUrl} 
                    alt={site.name}
                    className="w-6 h-6 object-contain"
                    onError={() => handleImageError(site.id)}
                  />
                ) : (
                  <div className="text-2xl">
                    {site.icon || '🌐'}
                  </div>
                )}
              </div>
              
              <h3 className={`text-center font-bold text-[10px] ${
                hasVisited ? 'text-white/60' : 'text-white'
              }`} style={{ pointerEvents: 'none' }}>
                {site.name}
              </h3>
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
