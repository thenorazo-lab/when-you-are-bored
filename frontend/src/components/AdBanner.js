import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const AdBanner = ({ position = 'bottom', refreshInterval = 60000 }) => {
  const [isNative, setIsNative] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  const [bannerShown, setBannerShown] = useState(false);
  const [error, setError] = useState(null);

  const productionAdUnitId = 'ca-app-pub-1120357008550196/9792898335';
  const testAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  const useTestBanner = (process.env.REACT_APP_ADMOB_USE_TEST_BANNER === 'true');
  const adUnitId = useTestBanner ? testAdUnitId : productionAdUnitId;

  console.log('🎯 AdBanner 렌더링 - position:', position, 'useTestBanner:', useTestBanner, 'adUnitId:', adUnitId);

  console.log('🎯 AdBanner 렌더링 - position:', position, 'useTestBanner:', useTestBanner, 'adUnitId:', adUnitId);

  // AdMob 초기화
  useEffect(() => {
    const nativePlatform = Capacitor.isNativePlatform();
    console.log('📱 플랫폼 확인:', nativePlatform ? 'Native' : 'Web');
    setIsNative(nativePlatform);

    if (!nativePlatform) return;

    const initializeAdMob = async () => {
      try {
        console.log('🔧 AdMob 초기화 시작...');
        await AdMob.initialize({
          initializeForTesting: useTestBanner,
        });
        console.log('✅ AdMob 초기화 완료 (testing:', useTestBanner, ')');
        setAdInitialized(true);
      } catch (error) {
        console.error('❌ AdMob 초기화 실패:', error);
        setError('초기화 실패: ' + (error?.message || error));
      }
    };

    initializeAdMob();
  }, [useTestBanner]);

  // 배너 표시 및 주기적 새로고침
  useEffect(() => {
    if (!isNative || !adInitialized) {
      console.log('⏸️ 배너 표시 대기 중 - isNative:', isNative, 'adInitialized:', adInitialized);
      return;
    }

    let isMounted = true;
    let refreshTimer = null;

    const showBanner = async () => {
      try {
        console.log('🎬 배너 표시 시작 - adId:', adUnitId, 'position:', position);
        // 기존 배너 제거
        try {
          await AdMob.hideBanner();
        } catch (e) {
          console.log('ℹ️ 기존 배너 없음');
        }
        // 배너 표시
        await AdMob.showBanner({
          adId: adUnitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
        if (isMounted) {
          console.log('✅ 배너 표시 성공!');
          setBannerShown(true);
          setError(null);
        }
      } catch (error) {
        console.error('❌ 배너 표시 실패:', error);
        if (isMounted) {
          setError('배너 표시 실패: ' + (error?.message || error));
          // 프로덕션 광고 실패 시 테스트 배너로 재시도
          if (!useTestBanner && error?.message?.includes('No fill')) {
            console.log('🔄 테스트 배너로 재시도...');
            try {
              await AdMob.showBanner({
                adId: testAdUnitId,
                adSize: BannerAdSize.ADAPTIVE_BANNER,
                position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
              });
              console.log('✅ 테스트 배너 표시 성공');
              setBannerShown(true);
              setError(null);
            } catch (fallbackError) {
              console.error('❌ 테스트 배너도 실패:', fallbackError);
            }
          }
        }
      }
    };

    showBanner();

    // 주기적 새로고침
    if (refreshInterval > 0) {
      refreshTimer = setInterval(() => {
        showBanner();
      }, refreshInterval);
    }

    return () => {
      isMounted = false;
      if (refreshTimer) clearInterval(refreshTimer);
      AdMob.hideBanner().catch(e => console.log('ℹ️ 배너 숨김 스킵:', e?.message));
    };
  }, [isNative, adInitialized, position, adUnitId, useTestBanner, testAdUnitId, refreshInterval]);

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

  // 네이티브 환경 - 상태 표시와 함께
  return (
    <div className="w-full" style={{ height: '50px', backgroundColor: '#f0f0f0' }}>
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        {!adInitialized && '광고 초기화 중...'}
        {adInitialized && !bannerShown && '광고 로딩 중...'}
        {bannerShown && ''}
        {error && <span className="text-red-500 px-2">{error}</span>}
      </div>
    </div>
  );
};

export default AdBanner;
