import React, { useEffect } from 'react';
import AdBanner from './AdBanner';

const SplashScreen = ({ onFinish, duration = 1500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800">
      <div className="text-4xl mb-4 text-white font-bold drop-shadow-lg">🎮 심심할때 여기어때</div>
      <div className="mb-8 text-white/80 text-lg">로딩 중...</div>
      {/* 하단에 짧게 배너 광고 */}
      <div className="absolute bottom-0 left-0 w-full">
        <AdBanner position="bottom" />
      </div>
    </div>
  );
};

export default SplashScreen;
