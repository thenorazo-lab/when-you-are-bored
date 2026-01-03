# 방문 내역 및 로그인 유지 기능

## 구현된 기능

### 1. 방문 내역 저장 ✅
- **localStorage 기반**: 사용자 디바이스에 영구 저장
- **방문 횟수 추적**: 각 사이트별 방문 횟수 자동 카운트
- **방문 시간 기록**: 첫 방문 및 최근 방문 시간 저장
- **시각적 표시**: 방문한 사이트에 녹색 체크 배지 표시

### 2. 로그인 유지 ✅
- **iframe sandbox 설정**: 
  - `allow-storage-access-by-user-activation`: 쿠키 저장 허용
  - `allow-same-origin`: 동일 출처 정책 허용
- **Capacitor 쿠키 설정**: 네이티브 앱에서 쿠키 유지
- **세션 유지**: 각 사이트의 로그인 세션 자동 유지

### 3. 활동 통계 ✅
- 총 방문한 사이트 수
- 총 방문 횟수
- 방문 기록 삭제 기능

## 사용 방법

### 방문 기록 확인
```javascript
import { visitHistoryManager } from './utils/visitHistory';

// 특정 사이트 방문 여부
const hasVisited = visitHistoryManager.hasVisited('humoruniv');

// 방문 정보 가져오기
const visitInfo = visitHistoryManager.getVisitInfo('humoruniv');
// { name: '웃긴대학', lastVisit: '2026-01-03T...', visitCount: 5 }

// 통계
const stats = visitHistoryManager.getStats();
```

## 주의사항

### 로그인 유지 제한
일부 사이트는 보안상 iframe에서 로그인을 차단할 수 있습니다:
- 은행 사이트
- 결제 사이트
- 일부 소셜 미디어

이런 경우 외부 브라우저로 열리며, 그곳에서 로그인하면 다음에도 유지됩니다.

## 데이터 저장 위치

- **웹**: 브라우저 localStorage
- **안드로이드**: WebView 로컬스토리지
- **iOS**: WKWebView 로컬스토리지

## 데이터 보존

- 앱 삭제 전까지 영구 보존
- 캐시 삭제해도 유지됨
- 수동 삭제: "방문 기록 삭제" 버튼 사용
