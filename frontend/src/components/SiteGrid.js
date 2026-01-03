import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitHistoryManager } from '../utils/visitHistory';

const SiteGrid = ({ sites, categoryName }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const handleSiteClick = (site) => {
    // 방문 기록 추가
    visitHistoryManager.addVisit(site.id, site.name, categoryName);
    
    // 앱 내 WebView로 열기
    localStorage.setItem('currentArticleUrl', site.url);
    navigate(`/view/${site.id}`);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displaySites.map((site) => {
          const hasVisited = visitHistoryManager.hasVisited(site.id);
          const faviconUrl = getFaviconUrl(site.url);
          
          return (
            <div
              key={site.id}
              onClick={() => handleSiteClick(site)}
              className={`backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                hasVisited 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {/* 로고 이미지 */}
              <div className="flex justify-center items-center mb-3 h-16">
                {faviconUrl ? (
                  <img 
                    src={faviconUrl} 
                    alt={site.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className="text-4xl" style={{ display: faviconUrl ? 'none' : 'block' }}>
                  {site.icon || '🌐'}
                </div>
              </div>
              
              <h3 className={`text-center font-bold text-sm ${
                hasVisited ? 'text-white/60' : 'text-white'
              }`}>
                {site.name}
              </h3>
            </div>
          );
        })}
      </div>
      
      {/* 전체보기 버튼 */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            {showAll ? '접기 ▲' : `전체보기 (${sites.length}개) ▼`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteGrid;
