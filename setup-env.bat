@echo off
echo ========================================
echo   Seva Portal - Environment Setup
echo ========================================
echo.

if exist .env (
    echo .env file already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto :end
    echo.
)

echo Creating .env file...
(
echo # Server Configuration
echo PORT=3000
echo NODE_ENV=development
echo SESSION_SECRET=government-portal-secret-key-dev-12345
echo.
echo # Client Configuration
echo NEXT_PUBLIC_API_URL=http://localhost:3000
echo.
echo # Database Configuration
echo DATABASE_URL=./data.db
echo.
echo # JWT Configuration
echo JWT_SECRET=your_jwt_secret_key
echo JWT_EXPIRES_IN=24h
echo.
echo # Redis Configuration ^(Optional - leave empty for in-memory^)
echo REDIS_HOST=
echo REDIS_PORT=
echo REDIS_PASSWORD=
echo.
echo # Twilio SMS Configuration ^(Optional - leave empty for console OTP^)
echo TWILIO_SID=
echo TWILIO_TOKEN=
echo TWILIO_FROM=
echo.
echo # Email Configuration ^(Optional^)
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=
echo SMTP_PASS=
echo.
echo # File Upload Configuration
echo UPLOAD_DIR=./uploads
echo MAX_FILE_SIZE=5242880
echo.
echo # Admin Configuration
echo ADMIN_EMAIL=admin@example.com
echo ADMIN_PASSWORD=admin_password
echo.
echo # Optional: Rate Limiting
echo RATE_LIMIT_WINDOW=15
echo RATE_LIMIT_MAX=100
) > .env

echo.
echo ========================================
echo   SUCCESS! .env file created
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file if you want to add Twilio or Redis credentials
echo 2. Run: npm run dev
echo 3. Open: http://localhost:5000/login
echo.
echo For Redis setup, see: REDIS_SETUP.md
echo For .env details, see: ENV_SETUP.md
echo.

:end
pause
