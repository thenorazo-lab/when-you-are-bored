# 🚀 모바일 앱 빌드 가이드

## 현재 웹 vs 모바일 앱 차이

### 웹 (localhost:3000)
- ❌ 틱톡, 유튜브 쇼츠 등 일부 사이트 차단됨 (X-Frame-Options)
- ✅ 다른 사이트는 iframe으로 작동
- ⚠️ 차단된 사이트는 외부 브라우저로 자동 전환

### 모바일 앱 (Android/iOS)
- ✅ **모든 사이트 앱 내에서 열림!** (InAppBrowser 사용)
- ✅ 쿠키 및 로그인 완벽 유지
- ✅ 뒤로가기 버튼으로 앱으로 복귀
- ✅ 광고 수익 극대화 가능

## 📱 Android 앱 빌드 방법

### 1. Android 플랫폼 추가
```bash
cd frontend
npm run build
npx cap add android
npx cap sync
```

### 2. Android Studio에서 열기
```bash
npx cap open android
```

### 3. Android Studio에서 실행
- 상단 메뉴: Run → Run 'app'
- 또는 재생 버튼(▶) 클릭
- USB로 연결된 폰이나 에뮬레이터에서 실행

### 4. APK 빌드 (배포용)
Android Studio에서:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- `app-debug.apk` 생성됨

## 📱 iOS 앱 빌드 방법 (Mac 필요)

### 1. iOS 플랫폼 추가
```bash
cd frontend
npm run build
npx cap add ios
npx cap sync
```

### 2. Xcode에서 열기
```bash
npx cap open ios
```

### 3. Xcode에서 실행
- 재생 버튼 클릭
- 시뮬레이터 또는 실제 iPhone에서 실행

## 🔧 모바일 앱에서 차단 사이트가 열리는 이유

1. **Capacitor Browser 플러그인**
   - 네이티브 InAppBrowser 사용
   - iframe 제한 없음
   - 시스템 브라우저처럼 작동하지만 앱 내에 유지

2. **User-Agent 변경**
   - 모바일 앱은 "모바일 브라우저"로 인식됨
   - 일부 차단 회피 가능

3. **네이티브 권한**
   - 웹뷰보다 더 많은 권한
   - 쿠키, 로컬스토리지 완벽 접근

## 🎮 테스트 방법

### 빠른 테스트 (개발용)
```bash
# Android
npx cap run android

# iOS (Mac only)
npx cap run ios
```

### 웹에서 미리보기
```bash
npm run build
npx cap copy
npx cap serve
```

## 📦 Play Store / App Store 배포

### Google Play Console
1. APK 또는 AAB 빌드
2. 개발자 계정 필요 ($25 일회성)
3. 앱 정보, 스크린샷 제출
4. 검토 후 게시

### Apple App Store  
1. Xcode에서 Archive 생성
2. 개발자 계정 필요 ($99/년)
3. TestFlight로 베타 테스트
4. App Store Connect에서 제출

## 💡 꿀팁

- **웹에서 개발 → 앱으로 빌드**하면 모든 사이트 작동!
- 틱톡, 유튜브 쇼츠 등 차단 사이트도 앱에서는 완벽 작동
- 애드몹 광고도 앱에서만 진짜 수익 발생

---

**모바일 앱으로 빌드하면 모든 문제 해결됩니다! 🎉**
