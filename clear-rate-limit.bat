@echo off
echo ========================================
echo   Clearing Rate Limit - Quick Fix
echo ========================================
echo.

echo Stopping Node.js server...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo No Node.js process found.
) else (
    echo ✅ Server stopped successfully
)
echo.

echo Rate limit will be cleared automatically when server restarts.
echo (Rate limits are stored in memory, not persistent)
echo.

echo Starting development server...
echo.
npm run dev
