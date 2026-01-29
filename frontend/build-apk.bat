@echo off
echo ====================================
echo APK 빌드 스크립트
echo ====================================
echo.

echo [1/3] React 앱 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo React 빌드 실패!
    pause
    exit /b 1
)
echo React 빌드 완료!
echo.

echo [2/3] Capacitor 동기화 중...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Capacitor 동기화 실패!
    pause
    exit /b 1
)
echo Capacitor 동기화 완료!
echo.

echo [3/3] Android APK 빌드 중...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo APK 빌드 실패!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ====================================
echo APK 빌드 완료!
echo ====================================
echo.
echo APK 파일 위치:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 파일을 찾을 수 없으면 다음 명령어로 확인하세요:
echo   dir android\app\build\outputs\apk\debug\*.apk
echo.
pause
