# when-you-are-bored 배포 체크리스트

## ✅ 완료된 작업

### 백엔드 설정
- [x] MongoDB 연결 설정 (`config/db.js`)
- [x] mongoose 패키지 설치
- [x] Health check 엔드포인트 추가 (`/health`)
- [x] MongoDB 핑 자동화 (5분마다)
- [x] CORS 설정 (환경 변수 사용)
- [x] Render 배포 설정 파일 (`render.yaml`)
- [x] .env.example 생성
- [x] .gitignore 설정

### 프론트엔드 설정
- [x] 환경 변수로 API URL 변경
- [x] Vercel 배포 설정 파일 (`vercel.json`)
- [x] .env.production 생성
- [x] .env.example 생성
- [x] .gitignore 업데이트

## 📋 배포 단계

### 1단계: MongoDB Atlas 설정
```
1. https://www.mongodb.com/cloud/atlas/register 가입
2. 무료 클러스터 생성 (M0)
3. Database Access에서 사용자 생성
4. Network Access에서 0.0.0.0/0 추가
5. 연결 문자열 복사
```

### 2단계: Render 백엔드 배포
```
1. https://render.com 가입
2. New > Web Service
3. GitHub 레포지토리 연결
4. Root Directory: backend
5. 환경 변수 설정:
   - MONGODB_URI
   - FRONTEND_URL (Vercel URL)
6. 배포 후 URL 복사
```

### 3단계: Vercel 프론트엔드 배포
```
1. https://vercel.com 가입
2. Import Project
3. Root Directory: frontend
4. 환경 변수 설정:
   - REACT_APP_API_URL (Render URL)
5. 배포 후 URL 복사
```

### 4단계: UptimeRobot 설정 (슬립 방지)
```
1. https://uptimerobot.com 가입
2. Add New Monitor
3. URL: https://your-backend.onrender.com/health
4. Interval: 5분
```

### 5단계: APK 재빌드
```powershell
cd frontend
npm run build
npx cap sync android
cd android
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew assembleDebug
```

## 🔗 URL 구조

- **백엔드**: https://when-bored-backend.onrender.com
- **프론트엔드**: https://when-bored.vercel.app
- **Health Check**: https://when-bored-backend.onrender.com/health
- **API**: https://when-bored-backend.onrender.com/api/hot-issues/:siteId

## 📝 환경 변수

### 백엔드 (.env)
```
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://when-bored.vercel.app
PORT=5000
```

### 프론트엔드 (.env.production)
```
REACT_APP_API_URL=https://when-bored-backend.onrender.com
```

## ⚠️ 주의사항

1. **Render 무료 플랜**: 15분 동안 요청이 없으면 슬립 모드
   - 해결: UptimeRobot으로 5분마다 핑
   
2. **MongoDB 연결**: 5분마다 자동 핑으로 연결 유지

3. **CORS**: 프론트엔드 URL을 백엔드 환경 변수에 추가

4. **APK 빌드**: .env.production에 실제 백엔드 URL 설정 필수

## 🚀 배포 후 확인사항

- [ ] Health check 엔드포인트 작동 확인
- [ ] 프론트엔드에서 백엔드 API 호출 확인
- [ ] 모바일 APK에서 실시간 데이터 확인
- [ ] UptimeRobot 모니터링 활성화 확인
- [ ] MongoDB 연결 로그 확인
