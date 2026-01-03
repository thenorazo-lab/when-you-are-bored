import React from 'react';
import { useNavigate } from 'react-router-dom';

const HotIssueCard = ({ issue, siteId }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (issue.url && issue.url !== '#') {
      console.log('🔥 핫이슈 카드 클릭!');
      console.log('  issue.url:', issue.url);
      console.log('  siteId:', siteId);
      
      // 숏폼 타입이나 회원가입 필요 타입이면 새 탭에서 직접 열기
      if (issue.type === 'shortform' || issue.type === 'membership') {
        window.open(issue.url, '_blank');
        return;
      }
      
      // 실제 게시글 URL을 localStorage에 저장
      localStorage.setItem('currentArticleUrl', issue.url);
      console.log('✅ localStorage 저장 완료:', issue.url);
      
      // WebViewPage로 이동
      navigate(`/view/${siteId}`);
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
      className="min-w-[300px] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 snap-start cursor-pointer"
    >
      <div className="relative">
        {isMembership ? (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <img 
              src={issue.favicon}
              alt={issue.title}
              className="w-24 h-24 object-contain"
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
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(issue.source);
            }}
          />
        )}
        {isShortform ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-6xl">{issue.icon || '▶️'}</div>
          </div>
        ) : null}
        <div className={`absolute top-2 right-2 ${isShortform ? 'bg-pink-500' : isMembership ? 'bg-purple-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          {isShortform ? '숏폼' : isMembership ? '회원전용' : 'HOT'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
          {issue.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {issue.source}
          </span>
          <div className="flex gap-3">
            <span>👁️ {issue.views}</span>
            {issue.comments && issue.comments !== '0' && (
              <span>💬 {issue.comments}</span>
            )}
            {issue.date && (
              <span>📅 {issue.date}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotIssueCard;
