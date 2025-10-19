# Environment Variables Setup Guide

## Quick Setup

### Step 1: Create .env File
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

### Step 2: Configure Required Variables

Open `.env` file and update these values:

---

## Configuration Options

### 🔴 REQUIRED (Minimum Setup)

```env
# Server
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secret-key-change-this-in-production

# Database
DATABASE_URL=./data.db
```

---

### 🟡 OPTIONAL (For Full Functionality)

#### Redis Configuration
```env
# Leave empty to use in-memory fallback
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**When to configure:**
- Production deployment
- Multiple server instances
- Long-term data persistence needed

**If not configured:**
- App uses in-memory storage (works fine for testing)
- Rate limits reset on server restart
- OTPs cleared on server restart

---

#### Twilio SMS Configuration
```env
# Leave empty to see OTP in console logs
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_FROM=+1234567890
```

**When to configure:**
- Sending real SMS to users
- Production deployment
- Testing with actual phone numbers

**If not configured:**
- OTP displayed in server console (perfect for testing)
- No SMS actually sent
- All other functionality works normally

**How to get Twilio credentials:**
1. Sign up at: https://www.twilio.com/try-twilio
2. Get free trial credits ($15)
3. Verify your phone number
4. Go to Console: https://console.twilio.com/
5. Copy Account SID and Auth Token
6. Get a Twilio phone number (US: +1, India: +91)

---

#### Email Configuration (SMTP)
```env
# For biometric approval notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**For Gmail:**
1. Go to: https://myaccount.google.com/apppasswords
2. Create app-specific password
3. Use that password (not your regular Gmail password)

**When to configure:**
- Admin approval email notifications
- Production deployment

---

## Complete .env Template

### For Testing (Minimal Setup)
```env
# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=dev-secret-key-12345

# Database
DATABASE_URL=./data.db

# Redis (Optional - leave empty for in-memory)
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# Twilio (Optional - leave empty for console OTP)
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

### For Production (Full Setup)
```env
# Server Configuration
PORT=3000
NODE_ENV=production
SESSION_SECRET=super-strong-random-secret-change-this

# Database
DATABASE_URL=./data.db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Twilio SMS Configuration
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your_auth_token_here
TWILIO_FROM=+919876543210

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASS=your_app_specific_password

# Admin Configuration
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=strong-secure-password
```

---

## Security Best Practices

### 1. Session Secret
```env
# ❌ Bad (default/weak)
SESSION_SECRET=government-portal-secret-key

# ✅ Good (random, long, unique)
SESSION_SECRET=a8f9d72b3e1c5a6d4e8f7b2c9a1d3e5f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

Generate strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Never Commit .env to Git
```bash
# Add to .gitignore (already done)
.env
.env.local
.env.production
```

### 3. Use Different Secrets for Different Environments
- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

---

## Checking Your Configuration

### View Current Configuration
```bash
# Create check-env.js
node -e "require('dotenv').config(); console.log('Redis:', process.env.REDIS_HOST || 'Not configured'); console.log('Twilio:', process.env.TWILIO_SID ? 'Configured' : 'Not configured');"
```

### Test Redis Connection
```bash
node test-redis.js
```

### Test Complete Setup
```bash
npm run dev
```

Look for these messages:
```
✅ Email transporter initialized
✅ Twilio SMS client initialized
✅ Redis client connected
🚀 serving on port 5000
```

Or these (if using fallbacks):
```
⚠️ Twilio credentials not found - SMS will be mocked
⚠️ Redis connection refused - using in-memory fallback
```

---

## Common Issues

### Issue: "dotenv not loading"
**Solution**: Make sure `.env` file is in project root (same level as `package.json`)

### Issue: "Variables not updating"
**Solution**: Restart the development server after changing `.env`

### Issue: "Redis connection failing"
**Solution**: Check if Redis is running or leave `REDIS_HOST` empty to use fallback

### Issue: "Twilio authentication failed"
**Solution**: Verify SID and Token are correct, or leave empty for testing

---

## What You Can Change Safely

| Variable | Safe to Change | Requires Restart |
|----------|---------------|------------------|
| SESSION_SECRET | ⚠️ Yes (breaks existing sessions) | Yes |
| REDIS_HOST | ✅ Yes | Yes |
| TWILIO_SID | ✅ Yes | Yes |
| SMTP_USER | ✅ Yes | Yes |
| ADMIN_PASSWORD | ✅ Yes | No* |

*May require database update

---

## Need Help?

If you're stuck:
1. Use the minimal setup (empty Redis/Twilio)
2. Check `REDIS_SETUP.md` for Redis installation
3. Server logs will show what's working/missing
4. The app works fine without Redis/Twilio for testing!
