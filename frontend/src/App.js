import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { Capacitor } from '@capacitor/core';
import './App.css';
import HomePage from './pages/HomePage';
import WebViewPage from './pages/WebViewPage';
import AdBanner from './components/AdBanner';
import SplashScreen from './components/SplashScreen';

function BackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onBack = async ({ canGoBack }) => {
      // 홈이면 종료 확인, 그 외엔 뒤로가기
      if (location.pathname === '/') {
        const result = Capacitor.isNativePlatform()
          ? await Dialog.confirm({ title: '앱 종료', message: '앱을 종료하시겠습니까?' })
          : { value: window.confirm('앱을 종료하시겠습니까?') };
        if (result.value) {
          await CapApp.exitApp();
        }
      } else {
        // 라우터 히스토리 뒤로가기
        if (canGoBack) {
          navigate(-1);
        } else {
          window.history.back();
        }
      }
    };

    let listener;
    (async () => {
      listener = await CapApp.addListener('backButton', onBack);
    })();

    return () => {
      if (listener && listener.remove) listener.remove();
    };
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} duration={1500} />;
  }

  return (
    <Router>
      <div className="App">
        <BackHandler />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/view/:siteId" element={<WebViewPage />} />
        </Routes>
        <AdBanner position="bottom" />
      </div>
    </Router>
  );
}

export default App;
