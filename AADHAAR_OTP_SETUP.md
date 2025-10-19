# Aadhaar-Based OTP Authentication Setup

## Overview
This document explains the Aadhaar-based OTP authentication system implemented for the Seva Portal.

## Features Implemented

### 🔐 Security Features
- **Bcrypt OTP Hashing**: OTPs are hashed using bcrypt before storage (never stored in plain text)
- **Redis Storage**: OTPs stored in Redis with 5-minute TTL (automatic expiration)
- **Rate Limiting**: Maximum 5 OTP requests per hour per Aadhaar number
- **Attempt Tracking**: Maximum 3 verification attempts per OTP
- **Secure OTP Generation**: Using `crypto.randomInt()` for cryptographically secure random numbers

### 📱 SMS Integration
- **Twilio SMS**: OTP delivery via SMS to registered mobile number
- **Mock Mode**: Works without Twilio credentials (logs OTP to console for testing)
- **Masked Mobile Display**: Shows mobile number as "98*****425" to user

### 🏗️ Architecture
- **Modular Design**: Separated OTP controller for easy maintenance
- **Production Ready**: Environment variable configuration
- **Blockchain Ready**: Architecture supports future Polygon integration

## Test Credentials

### Test Aadhaar Number
```
Aadhaar: 123456789121
Mobile: 9392330425
```

When you enter this Aadhaar number, the system will:
1. Generate a 6-digit OTP
2. Display masked mobile: "98*****425"
3. Send OTP via SMS (or log to console in mock mode)

## Installation & Setup

### 1. Install Dependencies
```bash
npm install ioredis bcryptjs rate-limiter-flexible twilio @types/bcryptjs
```

### 2. Install Redis (Required)

#### Windows:
Download Redis for Windows:
- Install from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run -d -p 6379:6379 redis`

#### Linux/Mac:
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Mac
brew install redis
```

Start Redis:
```bash
redis-server
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Redis (Required)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Twilio SMS (Optional - works without for testing)
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_FROM=+1234567890

# Session Secret
SESSION_SECRET=government-portal-secret-key
```

**Note**: Twilio credentials are optional. Without them, OTP will be logged to the console for testing.

### 4. Start the Server
```bash
npm run dev
```

## How It Works

### Step 1: Request OTP
**Endpoint**: `POST /api/auth/user/send-otp`
```json
{
  "aadhaarNumber": "123456789121"
}
```

**Process**:
1. Validates 12-digit Aadhaar number
2. Checks rate limit (5 per hour)
3. Fetches masked mobile from mapping
4. Generates secure 6-digit OTP
5. Hashes OTP with bcrypt
6. Stores hash in Redis (5-minute TTL)
7. Sends OTP via SMS (or logs to console)

**Response**:
```json
{
  "message": "OTP sent successfully",
  "maskedMobile": "98*****425",
  "remainingRequests": 4
}
```

### Step 2: Verify OTP
**Endpoint**: `POST /api/auth/user/verify-otp`
```json
{
  "aadhaarNumber": "123456789121",
  "otp": "123456"
}
```

**Process**:
1. Validates input
2. Checks remaining attempts (max 3)
3. Retrieves hashed OTP from Redis
4. Compares using bcrypt
5. Deletes OTP on success
6. Creates user session
7. Returns user details

**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "testuser@example.com",
    "aadhaarNumber": "123456789121",
    "type": "user"
  }
}
```

## File Structure

```
server/
├── config/
│   └── redis.ts                 # Redis connection setup
├── controllers/
│   └── otpController.ts         # OTP business logic
└── routes/
    └── auth.ts                  # Authentication routes

client/src/pages/
└── login.tsx                    # Frontend login with OTP UI
```

## Security Best Practices Implemented

✅ **Input Validation**: Zod schemas for 12-digit Aadhaar and 6-digit OTP
✅ **Rate Limiting**: Prevents brute force attacks (5 requests/hour)
✅ **Attempt Limiting**: Max 3 verification attempts per OTP
✅ **OTP Expiration**: Automatic 5-minute expiry
✅ **Hashed Storage**: bcrypt hashing (never plain text)
✅ **Minimal Logging**: Logs masked Aadhaar only (first 4 + last 4 digits)
✅ **Session Security**: HTTP-only cookies, secure in production
✅ **No Plain Aadhaar Storage**: Aadhaar handling follows compliance

## Testing

### Manual Test Flow:
1. Go to `http://localhost:5000/login`
2. Enter Aadhaar: `123456789121`
3. Click "Send OTP"
4. Check console for OTP (if Twilio not configured)
5. Enter the OTP shown in console
6. Click "Verify & Login"
7. Should redirect to dashboard

### Console Output Example:
```
📱 OTP Request for Aadhaar: 1234****9121
🔐 Generated OTP: 456789 (for testing only)
✅ OTP stored for Aadhaar: 1234****9121
📱 [MOCK SMS]
To: +919392330425
Message: Your Seva Portal OTP is 456789. Valid for 5 minutes.
✅ OTP sent successfully in 245ms
📊 Remaining requests: 4
```

## Production Deployment Checklist

- [ ] Set up Redis in production
- [ ] Configure real Twilio credentials
- [ ] Set `SESSION_SECRET` to strong random value
- [ ] Enable HTTPS and set `cookie.secure = true`
- [ ] Integrate with actual UIDAI/AUA API (replace mock mapping)
- [ ] Set up Redis persistence (AOF/RDB)
- [ ] Configure Redis password
- [ ] Remove OTP logging from production
- [ ] Set up monitoring for rate limit triggers
- [ ] Configure proper error reporting

## Future Enhancements

- [ ] Blockchain integration for identity verification (Polygon)
- [ ] Biometric authentication
- [ ] Multi-factor authentication
- [ ] Aadhaar eKYC integration
- [ ] SMS delivery reports tracking
- [ ] Analytics dashboard for OTP metrics

## Support

For issues or questions:
- Check Redis is running: `redis-cli ping` (should return `PONG`)
- Check server logs for OTP values during testing
- Verify Aadhaar number is exactly 12 digits
- Ensure port 5000 is not blocked by firewall

## Compliance Note

**IMPORTANT**: This implementation is a demonstration system. For production use with real Aadhaar data:
- You must obtain proper AUA/KUA license from UIDAI
- Follow UIDAI guidelines for Aadhaar handling
- Implement proper audit logging
- Ensure data residency compliance
- Follow IT Act and Aadhaar Act regulations
