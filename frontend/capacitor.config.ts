import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whenbored.app',
  appName: '심심할때여기어때',
  webDir: 'build',
  plugins: {
    // 브라우저 플러그인 설정 (쿠키 및 세션 유지)
    Browser: {
      presentationStyle: 'popover',
      toolbarColor: '#667eea'
    },
    // 쿠키 및 로컬스토리지 유지 설정
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    },
    // AdMob 설정
    AdMob: {
      appId: {
        android: 'ca-app-pub-1120357008550196~4541421712',
        ios: 'ca-app-pub-1120357008550196~4541421712'
      }
    }
  },
  // iOS 설정
  ios: {
    contentInset: 'always'
  },
  // Android 설정
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
