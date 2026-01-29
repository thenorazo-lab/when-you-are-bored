@echo off
chcp 65001 >nul
echo ========================================
echo  v7 AAB (Android App Bundle) 빌드
echo ========================================
echo.

echo [1/3] React 빌드...
call npm run build
if %errorlevel% neq 0 (
  echo React 빌드 실패.
  pause
  exit /b 1
)

echo [2/3] Capacitor 동기화...
call npx cap sync android
if %errorlevel% neq 0 (
  echo Capacitor 동기화 실패.
  pause
  exit /b 1
)

echo [3/3] AAB 빌드 (bundleRelease)...
cd android
call gradlew.bat bundleRelease
if %errorlevel% neq 0 (
  echo AAB 빌드 실패.
  cd ..
  pause
  exit /b 1
)
cd ..

echo.
echo ========================================
echo  AAB 빌드 완료 (versionCode 7, versionName 3.0)
echo ========================================
echo.
echo  출력 파일:
echo    android\app\build\outputs\bundle\release\app-release.aab
echo.
echo  Play Console 업로드 시 위 .aab 파일을 사용하세요.
echo.
pause
