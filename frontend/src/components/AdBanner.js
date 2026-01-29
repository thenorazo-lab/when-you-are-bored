import React, { useEffect, useState, useRef } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// refreshInterval: 0이면 한 번 표시 후 새로고침 안 함. 주기적 새로고침은 유효 노출을 늘리지 않고 정책 위험만 있음.
const AdBanner = ({ position = 'bottom', refreshInterval = 0 }) => {
  const [isNative, setIsNative] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  const [bannerShown, setBannerShown] = useState(false);
  const [error, setError] = useState(null);

  const productionAdUnitId = 'ca-app-pub-1120357008550196/9792898335';
  const testAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  const useTestBanner = process.env.REACT_APP_ADMOB_USE_TEST_BANNER === 'true';
  const adUnitId = useTestBanner ? testAdUnitId : productionAdUnitId;

  const refreshTimerRef = useRef(null);
  const listenersAddedRef = useRef(false);

  // 플랫폼 확인 및 AdMob 초기화
  useEffect(() => {
    const nativePlatform = Capacitor.isNativePlatform();
    setIsNative(nativePlatform);

    if (!nativePlatform) {
      setError('웹 환경에서는 광고가 표시되지 않습니다');
      return;
    }

    const initializeAdMob = async () => {
      try {
        await AdMob.initialize({ initializeForTesting: useTestBanner });
        setAdInitialized(true);
      } catch (error) {
        console.error('AdMob 초기화 실패:', error);
        setError('광고 초기화 실패: ' + (error?.message || error));
        setAdInitialized(true); // 초기화 실패해도 배너 표시 시도
      }
    };

    initializeAdMob();
  }, [useTestBanner]);

  // AdMob 이벤트 리스너는 한 번만 등록 (bannerShown 의존 제거 → 무한 해제/등록 방지)
  useEffect(() => {
    if (!isNative || listenersAddedRef.current) return;

    let loadedHandle;
    let failedHandle;

    const setup = async () => {
      loadedHandle = await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        setBannerShown(true);
        setError(null);
      });
      failedHandle = await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
        setError('광고 로드 실패: ' + (err?.message || err));
        setBannerShown(false);
      });
      listenersAddedRef.current = true;
    };
    setup();

    return () => {
      if (loadedHandle?.remove) loadedHandle.remove();
      if (failedHandle?.remove) failedHandle.remove();
      listenersAddedRef.current = false;
    };
  }, [isNative]);

  // 배너 표시 로직
  useEffect(() => {
    if (!isNative || !adInitialized) return;

    const showBanner = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          await AdMob.hideBanner().catch(() => {});
        }

        await AdMob.showBanner({
          adId: adUnitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });

        // showBanner가 성공하면 배너가 표시된 것으로 간주
        setBannerShown(true);
        setError(null);
      } catch (error) {
        console.error('배너 표시 실패:', error);
        setError('배너 표시 실패: ' + (error?.message || error));
        setBannerShown(false);
      }
    };

    showBanner(false);

    if (refreshInterval > 0) {
      refreshTimerRef.current = setInterval(() => showBanner(true), refreshInterval);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      AdMob.hideBanner().catch(() => {});
    };
  }, [isNative, adInitialized, adUnitId, position, refreshInterval]);

  // 웹 환경에서는 플레이스홀더 표시
  if (!isNative) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 my-4">
        <div className="text-center text-yellow-800 font-bold">
          📱 애드몹 광고 영역 ({position})
        </div>
        <div className="text-center text-yellow-600 text-sm mt-1">
          웹 브라우저에서는 표시되지 않습니다
        </div>
      </div>
    );
  }

  // 네이티브 환경 - 상태 표시
  return (
    <div className="w-full" style={{ height: '50px', backgroundColor: '#f0f0f0' }}>
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        {!adInitialized && '광고 초기화 중...'}
        {adInitialized && !bannerShown && '광고 로딩 중...'}
        {bannerShown && '광고 표시됨!'}
        {error && <span className="text-red-500 px-2">{error}</span>}
      </div>
    </div>
  );
};

export default AdBanner;
