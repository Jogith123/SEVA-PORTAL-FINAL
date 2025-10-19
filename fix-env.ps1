# Fix .env file - Disable Twilio for testing

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Twilio Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envPath = ".\.env"

if (Test-Path $envPath) {
    Write-Host "Reading .env file..." -ForegroundColor Yellow
    
    $content = Get-Content $envPath
    
    $newContent = $content -replace 'TWILIO_SID=.*', 'TWILIO_SID=' `
                           -replace 'TWILIO_TOKEN=.*', 'TWILIO_TOKEN=' `
                           -replace 'TWILIO_FROM=.*', 'TWILIO_FROM='
    
    $newContent | Set-Content $envPath
    
    Write-Host ""
    Write-Host "✅ Twilio credentials cleared!" -ForegroundColor Green
    Write-Host ""
    Write-Host "OTP will now be displayed in the console for testing." -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart the server: npm run dev" -ForegroundColor White
    Write-Host "2. Try sending OTP again" -ForegroundColor White
    Write-Host "3. Check console for OTP" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
