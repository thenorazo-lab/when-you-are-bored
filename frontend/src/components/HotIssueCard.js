import React from 'react';
import { useNavigate } from 'react-router-dom';

const HotIssueCard = ({ issue, siteId }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {    e.preventDefault();
    e.stopPropagation();
        if (issue.url && issue.url !== '#') {
      console.log('🔥 핫이슈 카드 클릭!');
      console.log('  issue.url:', issue.url);
      console.log('  siteId:', siteId);
      
      // 모두 앱 내 WebView로 열기
      localStorage.setItem('currentArticleUrl', issue.url);
      console.log('✅ localStorage 저장 완료:', issue.url);
      
      // 직접 URL 변경
      window.location.hash = `/view/${siteId}`;
    }
  };

  // 타입별 UI 설정
  const isShortform = issue.type === 'shortform';
  const isMembership = issue.type === 'membership';
  
  let thumbnailUrl;
  if (isShortform) {
    thumbnailUrl = `https://via.placeholder.com/300x200/${issue.platform === 'tiktok' ? '000000/00f2ea' : 'FF0000/FFFFFF'}?text=${encodeURIComponent(issue.icon || '▶️')}`;
  } else if (isMembership) {
    // 회원가입 필요 커뮤니티는 파비콘을 크게 표시
    thumbnailUrl = issue.favicon || 'https://via.placeholder.com/300x200/E0E0E0/666666?text=🔒';
  } else {
    thumbnailUrl = issue.thumbnail || 'https://via.placeholder.com/300x200';
  }

  return (
    <div 
      onClick={handleClick}
      className="min-w-[150px] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 snap-start cursor-pointer"
    >
      <div className="relative" style={{ pointerEvents: 'none' }}>
        {isMembership ? (
          <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <img 
              src={issue.favicon}
              alt={issue.title}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/96/E0E0E0/666666?text=🔒';
              }}
            />
          </div>
        ) : (
          <img 
            src={thumbnailUrl}
            alt={issue.title}
            className="w-full h-24 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150x100?text=' + encodeURIComponent(issue.source);
            }}
          />
        )}
        {isShortform ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-3xl">{issue.icon || '▶️'}</div>
          </div>
        ) : null}
        <div className={`absolute top-1 right-1 ${isShortform ? 'bg-pink-500' : isMembership ? 'bg-purple-500' : 'bg-red-500'} text-white px-2 py-1 rounded text-[10px] font-bold`}>
          {isShortform ? '숏폼' : isMembership ? '회원전용' : 'HOT'}
        </div>
      </div>
      <div className="p-2" style={{ pointerEvents: 'none' }}>
        <h3 className="font-bold text-xs mb-1 line-clamp-2 text-gray-800">
          {issue.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-gray-600" style={{ pointerEvents: 'none' }}>
          <span className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-[10px]">
            {issue.source}
          </span>
          <div className="flex gap-1">
            <span className="text-[10px]">👁️ {issue.views}</span>
            {issue.comments && issue.comments !== '0' && (
              <span className="text-[10px]">💬 {issue.comments}</span>
            )}
            {issue.date && (
              <span className="text-[10px]">📅 {issue.date}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotIssueCard;
