# AdMob 설정 완료! 🎉

## 완료된 작업
- ✅ AdMob 플러그인 설치
- ✅ 앱 ID 등록: ca-app-pub-1120357008550196~4541421712
- ✅ 광고 단위 ID 설정: ca-app-pub-1120357008550196/9792898335
- ✅ AndroidManifest.xml 설정
- ✅ 배너 광고 코드 통합

## APK 빌드 방법

### 방법 1: Android Studio 사용 (권장)
1. Android Studio 열기
2. "Open an Existing Project" 선택
3. 경로: `C:\Users\금진\when-you-are-bored\when-bored-app\frontend\android`
4. Gradle 동기화 완료 대기
5. `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
6. 완료 후 APK 위치 확인

### 방법 2: 명령줄 사용
```powershell
cd c:\Users\금진\when-you-are-bored\when-bored-app\frontend\android
.\gradlew assembleDebug
```

APK 위치: `android\app\build\outputs\apk\debug\app-debug.apk`

## 광고 테스트 방법
1. 실제 Android 기기에 APK 설치
2. 앱 실행
3. 상단/하단에 배너 광고가 표시됨
4. 처음에는 테스트 광고가 표시될 수 있음

## 실제 광고로 전환
- 현재 설정: 실제 광고 ID 사용 중
- AdMob 대시보드에서 승인 후 실제 광고 표시

## 주의사항
⚠️ 본인 광고 클릭 금지 (계정 정지 위험)
⚠️ 앱 출시 전 AdMob 정책 준수 확인
