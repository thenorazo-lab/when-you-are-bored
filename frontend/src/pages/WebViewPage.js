import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebViewPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 bg-white">
      <div className="text-6xl mb-4">🌐</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        홈에서 링크를 탭하면 브라우저로 열립니다
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        콘텐츠는 외부 브라우저에서만 열립니다.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
      >
        홈으로
      </button>
    </div>
  );
};

export default WebViewPage;
