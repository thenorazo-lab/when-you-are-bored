# 배포 가이드 - 심심할때 여기어때

## 1. MongoDB Atlas 설정 (무료)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) 가입
2. 무료 클러스터 생성 (M0)
3. Database Access에서 사용자 생성
4. Network Access에서 `0.0.0.0/0` 추가 (모든 IP 허용)
5. 연결 문자열 복사:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/when-bored?retryWrites=true&w=majority
   ```

## 2. Render 백엔드 배포

1. [Render](https://render.com) 가입 (GitHub 연동)
2. New > Web Service 선택
3. GitHub 레포지토리 연결
4. 설정:
   - **Name**: when-bored-backend
   - **Region**: Singapore
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Environment Variables 추가:
   - `MONGODB_URI`: MongoDB 연결 문자열
   - `FRONTEND_URL`: Vercel URL (나중에 추가)
6. Create Web Service 클릭
7. 배포 완료 후 URL 복사 (예: `https://when-bored-backend.onrender.com`)

## 3. Vercel 프론트엔드 배포

1. [Vercel](https://vercel.com) 가입 (GitHub 연동)
2. Import Project 선택
3. GitHub 레포지토리 선택
4. 설정:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
5. Environment Variables 추가:
   - Key: `REACT_APP_API_URL`
   - Value: Render 백엔드 URL (예: `https://when-bored-backend.onrender.com`)
6. Deploy 클릭
7. 배포 완료 후 URL 복사 (예: `https://when-bored.vercel.app`)

## 4. Render 환경 변수 업데이트

1. Render 대시보드로 돌아가기
2. Environment > Edit
3. `FRONTEND_URL`을 Vercel URL로 업데이트
4. Save Changes (자동 재배포됨)

## 5. UptimeRobot 설정 (Render 슬립 모드 방지)

1. [UptimeRobot](https://uptimerobot.com) 가입 (무료)
2. Add New Monitor 클릭
3. 설정:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: When Bored Backend
   - **URL**: `https://when-bored-backend.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
4. Create Monitor 클릭

## 6. Capacitor 환경 변수 설정

`frontend/.env.production` 파일 생성:
```
REACT_APP_API_URL=https://when-bored-backend.onrender.com
```

## 7. 새 APK 빌드

```powershell
cd frontend
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK 위치: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

## 완료! 🎉

이제 모바일 앱이 클라우드 서버와 통신합니다!
- MongoDB가 항상 연결 유지
- UptimeRobot이 5분마다 핑을 보내 Render 슬립 방지
- Vercel에서 프론트엔드 호스팅
- 모바일 앱에서 실시간 데이터 확인 가능
