@echo off
echo ========================================
echo   Fixing Twilio Configuration
echo ========================================
echo.

echo This will disable Twilio and use console OTP logging instead.
echo OTP will be displayed in the server console for testing.
echo.

choice /C YN /M "Continue"
if errorlevel 2 goto :end

echo.
echo Updating .env file...

powershell -Command "(Get-Content .env) -replace 'TWILIO_SID=.*', 'TWILIO_SID=' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'TWILIO_TOKEN=.*', 'TWILIO_TOKEN=' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'TWILIO_FROM=.*', 'TWILIO_FROM=' | Set-Content .env"

echo.
echo ✅ Twilio disabled successfully!
echo.
echo OTP will now be displayed in console.
echo Restart the server to apply changes:
echo.
echo   npm run dev
echo.

:end
pause
