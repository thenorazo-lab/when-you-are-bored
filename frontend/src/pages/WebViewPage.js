import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const WebViewPage = () => {
  const navigate = useNavigate();

  // 모든 컨텐츠는 외부 브라우저에서만 열리도록 안내
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 bg-white">
      <div className="text-6xl mb-4">🌐</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        모든 컨텐츠는 외부 브라우저에서만 열립니다
      </h2>
      <p className="text-gray-600 mb-2 text-center">
        보안 정책 및 로그인 문제로 앱 내에서 열 수 없습니다.<br />
        아래 버튼을 눌러 브라우저에서 열어주세요!
      </p>
      <button
        onClick={async () => {
          const url = window.location.hash.split('/view/')[1];
          const siteUrl = url ? decodeURIComponent(url) : '';
          if (siteUrl) {
            if (Capacitor.isNativePlatform()) {
              await Browser.open({ url: siteUrl });
            } else {
              window.open(siteUrl, '_blank');
            }
          }
          window.location.hash = '/';
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
      >
        브라우저로 열기 →
      </button>
    </div>
  );
};

export default WebViewPage;
