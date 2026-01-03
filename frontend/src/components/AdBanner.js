import React, { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const AdBanner = ({ position = 'top' }) => {
  const [isNative, setIsNative] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);

  useEffect(() => {
    // 네이티브 환경인지 확인
    setIsNative(Capacitor.isNativePlatform());

    // AdMob 초기화
    const initializeAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: ['YOUR_TEST_DEVICE_ID'], // 실제 기기 테스트용
            initializeForTesting: false, // 실제 광고 표시
          });
          console.log('✅ AdMob 초기화 성공');
          setAdInitialized(true);
        } catch (error) {
          console.error('❌ AdMob 초기화 실패:', error);
        }
      }
    };

    initializeAdMob();
  }, []);

  useEffect(() => {
    if (isNative && adInitialized) {
      showBannerAd();
    }

    return () => {
      if (isNative && adInitialized) {
        hideBannerAd();
      }
    };
  }, [isNative, adInitialized, position]);

  const showBannerAd = async () => {
    try {
      // 기존 광고 숨기기
      await AdMob.hideBanner();

      // 배너 광고 표시
      await AdMob.showBanner({
        adId: 'ca-app-pub-1120357008550196/9792898335', // 실제 광고 단위 ID
        adSize: BannerAdSize.BANNER, // 320x50
        position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
      console.log(`✅ ${position} 배너 광고 표시 성공`);
    } catch (error) {
      console.error(`❌ ${position} 배너 광고 표시 실패:`, error);
    }
  };

  const hideBannerAd = async () => {
    try {
      await AdMob.hideBanner();
      console.log('✅ 배너 광고 숨김');
    } catch (error) {
      console.error('❌ 배너 광고 숨김 실패:', error);
    }
  };

  // 웹 환경에서는 플레이스홀더 표시
  if (!isNative) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 my-4">
        <div className="text-center text-yellow-800 font-bold">
          📱 애드몹 광고 영역 ({position})
        </div>
        <div className="text-center text-yellow-600 text-sm mt-1">
          320x50 배너 광고 (앱에서만 표시)
        </div>
      </div>
    );
  }

  // 네이티브 환경에서는 빈 공간 (광고가 오버레이로 표시됨)
  return <div className="h-[50px] w-full bg-transparent" />;
};

export default AdBanner;
