import React from 'react';

const Header = () => {
  return (
    <header className="mb-8">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2">
          🎮 심심할때 여기어때
        </h1>
        <p className="text-white/80 text-center text-xs sm:text-sm">
          커뮤니티, 웹툰, 소설 한곳에서 즐기기
        </p>
      </div>
    </header>
  );
};

export default Header;
