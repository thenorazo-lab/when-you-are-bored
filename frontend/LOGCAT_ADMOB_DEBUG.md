# Android Studio Logcat으로 AdMob 로그 확인하기

## 1. Logcat 열기

1. **Android Studio**에서 프로젝트 열기  
   - `when-bored-app/frontend/android` 폴더를 **Open**으로 열기

2. **Logcat 창** 열기  
   - 메뉴: **View → Tool Windows → Logcat**  
   - 또는 하단 **Logcat** 탭 클릭  
   - 단축키: **Alt + 6** (Windows)

3. **기기/에뮬레이터 선택**  
   - 상단 드롭다운에서 연결된 기기 또는 에뮬레이터 선택  
   - 앱이 실행 중인 기기여야 로그가 보입니다

---

## 2. AdMob 관련 로그만 보기 (필터)

### 방법 A: 검색창에 키워드 입력

Logcat 상단 **검색창**에 아래 중 하나 입력:

```
AdMob
admob
광고
banner
AdLoader
ca-app-pub
```

- 한 번에 하나씩 입력해 보면서 AdMob/광고 관련 로그만 확인

### 방법 B: Regex 필터 사용

1. 검색창 왼쪽 **필터 드롭다운** 클릭 → **Edit Filter Configuration** 선택  
2. **+** 버튼으로 새 필터 추가  
3. 설정 예시:
   - **Filter Name:** `AdMob`
   - **Log Tag:** `Ads|AdMob|admob` (또는 비워두기)
   - **Log Message:** `AdMob|admob|banner|광고|failed|error`
   - **Package Name:** `com.whenbored.app` (앱 패키지만 보려면)
4. **OK** → 상단에서 방금 만든 **AdMob** 필터 선택

---

## 3. 우리 앱 로그만 보기 (Package 필터)

1. Logcat 상단 **필터 드롭다운** → **Edit Filter Configuration**
2. **+** 로 새 필터 추가
3. 설정:
   - **Filter Name:** `WhenBored App`
   - **Package Name:** `com.whenbored.app`
4. **OK** 후 이 필터 선택  
   → 앱에서 출력하는 `console.log`, `console.error` 등이 여기 나옵니다

---

## 4. AdMob에서 자주 나오는 로그/에러

- **성공 시**
  - `배너 광고 로드 성공` (우리 코드의 console.log)
  - `Ad loaded` / `Banner ad loaded` (Google 라이브러리)

- **실패 시**
  - `광고 로드 실패` / `배너 표시 실패` (우리 코드)
  - `AdMob: ...` / `Ads: ...` 로 시작하는 메시지
  - `ERROR` 레벨 로그
  - `LoadAdError` / `code` / `domain` (에러 코드 확인용)

---

## 5. 로그 레벨 설정

- Logcat 상단 **Verbose** 드롭다운 클릭  
- **Debug** 또는 **Info** 선택 시 불필요한 로그 감소  
- 에러만 보려면 **Error** 선택

---

## 6. 앱에서 AdMob 로그 강화 (선택)

`AdBanner.js`에서 이미 `console.error`로 실패 시 로그를 남기고 있습니다.  
Logcat에서는 **package: com.whenbored.app** 필터를 쓰면  
`배너 표시 실패`, `광고 로드 실패` 같은 메시지를 쉽게 찾을 수 있습니다.

---

## 요약 체크리스트

- [ ] Android Studio에서 `frontend/android` 프로젝트 열기  
- [ ] 기기/에뮬레이터 연결 후 앱 실행  
- [ ] Logcat 열기 (View → Tool Windows → Logcat)  
- [ ] 검색창에 `AdMob` 또는 `admob` 입력  
- [ ] Package 필터 `com.whenbored.app` 로 앱 로그만 보기  
- [ ] `ERROR`, `failed`, `LoadAdError` 등 에러 메시지 확인  

에러 메시지 내용(스크린샷 또는 복사)을 알려주시면 원인 분석에 도움이 됩니다.
