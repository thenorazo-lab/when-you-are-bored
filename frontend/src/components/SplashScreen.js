import React, { useEffect } from 'react';

const SplashScreen = ({ onFinish, duration = 1500 }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-800">
      <div className="text-4xl mb-4 text-white font-bold drop-shadow-lg">🎮 심심할때 여기어때</div>
      <div className="mb-8 text-white/80 text-lg">로딩 중...</div>
    </div>
  );
};

export default SplashScreen;
