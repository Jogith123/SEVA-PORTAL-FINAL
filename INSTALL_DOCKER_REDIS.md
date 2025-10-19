# Complete Docker and Redis Installation Guide for Windows

## Part 1: Install Docker Desktop

### Step 1: Download Docker Desktop
1. Go to: **https://www.docker.com/products/docker-desktop/**
2. Click **"Download for Windows"**
3. Wait for the installer to download (approx 500MB)

### Step 2: Install Docker Desktop
1. **Run the installer** (Docker Desktop Installer.exe)
2. Check **"Use WSL 2 instead of Hyper-V"** (recommended)
3. Click **"OK"** to proceed
4. Wait for installation (5-10 minutes)
5. Click **"Close and restart"** when done

### Step 3: Start Docker Desktop
1. **Open Docker Desktop** from Start Menu
2. Accept the **Service Agreement**
3. **Skip the tutorial** or complete it (optional)
4. Wait for Docker Engine to start (look for green "Running" status)
5. You'll see a whale icon in your system tray when ready

### Step 4: Verify Docker Installation
Open PowerShell and run:
```powershell
docker --version
```

You should see something like:
```
Docker version 24.0.x, build xxxxx
```

---

## Part 2: Install and Run Redis

### Step 1: Pull Redis Image
Open PowerShell and run:
```powershell
docker pull redis
```

Wait for the download to complete (approx 100MB).

### Step 2: Run Redis Container
```powershell
docker run -d --name seva-redis -p 6379:6379 redis
```

**What this does:**
- `-d` = Run in background (detached mode)
- `--name seva-redis` = Name the container
- `-p 6379:6379` = Map port 6379 (Redis default port)
- `redis` = Use the Redis image

### Step 3: Verify Redis is Running
```powershell
docker ps
```

You should see:
```
CONTAINER ID   IMAGE   COMMAND                  STATUS
xxxxxxxxxx     redis   "docker-entrypoint.s…"   Up X seconds
```

### Step 4: Test Redis Connection
```powershell
docker exec -it seva-redis redis-cli ping
```

Should return: **PONG**

---

## Part 3: Configure Your App to Use Redis

### Step 1: Check if .env File Exists
Open PowerShell in your project folder:
```powershell
cd C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal
```

Check if .env exists:
```powershell
Test-Path .env
```

### Step 2: Update .env File

**Option A: Edit Manually**
1. Open `.env` file in your editor
2. Find these lines and update:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Option B: Use PowerShell**
```powershell
# Backup current .env
Copy-Item .env .env.backup

# Update Redis config
(Get-Content .env) -replace 'REDIS_HOST=.*', 'REDIS_HOST=localhost' | Set-Content .env
(Get-Content .env) -replace 'REDIS_PORT=.*', 'REDIS_PORT=6379' | Set-Content .env
```

---

## Part 4: Clear Rate Limit and Restart Server

### Step 1: Stop Current Server
In the terminal where server is running, press:
```
Ctrl + C
```

Or kill all Node processes:
```powershell
taskkill /F /IM node.exe
```

### Step 2: Restart Development Server
```powershell
npm run dev
```

### Step 3: Verify Redis Connection
You should see in the console:
```
✅ Redis client connected successfully
✅ Redis client is ready
🚀 serving on port 5000
```

---

## Part 5: Test Everything Works

### Test 1: Check Docker
```powershell
# List running containers
docker ps

# Check Redis logs
docker logs seva-redis
```

### Test 2: Test Redis Directly
```powershell
# Connect to Redis CLI
docker exec -it seva-redis redis-cli

# Inside Redis CLI, test commands:
PING
# Should return: PONG

SET test "Hello Redis"
# Should return: OK

GET test
# Should return: "Hello Redis"

# Exit Redis CLI
exit
```

### Test 3: Test OTP System
1. Go to: http://localhost:5000/login
2. Enter Aadhaar: `123456789121`
3. Click "Send OTP"
4. Check server console for OTP
5. Enter OTP and login

---

## Useful Docker Commands

### Container Management
```powershell
# Start Redis
docker start seva-redis

# Stop Redis
docker stop seva-redis

# Restart Redis
docker restart seva-redis

# Remove Redis container (if needed)
docker stop seva-redis
docker rm seva-redis

# View Redis logs
docker logs seva-redis

# Follow Redis logs in real-time
docker logs -f seva-redis
```

### Redis Management
```powershell
# Clear all OTP data (reset rate limits)
docker exec -it seva-redis redis-cli FLUSHALL

# Monitor Redis commands in real-time
docker exec -it seva-redis redis-cli MONITOR

# Check Redis memory usage
docker exec -it seva-redis redis-cli INFO memory

# List all keys
docker exec -it seva-redis redis-cli KEYS '*'

# Get specific OTP (replace with actual Aadhaar)
docker exec -it seva-redis redis-cli GET "otp:123456789121"

# Check rate limit for an Aadhaar
docker exec -it seva-redis redis-cli GET "otp_rate_limit:123456789121"
```

---

## Troubleshooting

### Issue: Docker Desktop won't start
**Solutions:**
1. Enable virtualization in BIOS
2. Enable WSL 2:
   ```powershell
   wsl --install
   ```
3. Restart computer
4. Update Windows to latest version

### Issue: "port 6379 already in use"
**Solution:**
```powershell
# Find what's using port 6379
netstat -ano | findstr :6379

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### Issue: Redis container not starting
**Solutions:**
```powershell
# Check if port is available
docker run --rm -p 6379:6379 redis redis-cli ping

# Remove old container and recreate
docker stop seva-redis
docker rm seva-redis
docker run -d --name seva-redis -p 6379:6379 redis
```

### Issue: App still shows "Redis connection refused"
**Solutions:**
1. Check .env has correct values:
   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
2. Restart the development server
3. Check Redis is running: `docker ps`

### Issue: Rate limit still active
**Solution:**
```powershell
# Clear all Redis data
docker exec -it seva-redis redis-cli FLUSHALL

# Restart server
npm run dev
```

---

## Redis Data Persistence (Optional)

To keep data even when container restarts:

```powershell
# Stop and remove old container
docker stop seva-redis
docker rm seva-redis

# Create with volume for persistence
docker run -d --name seva-redis -p 6379:6379 -v redis-data:/data redis redis-server --appendonly yes
```

---

## Docker Desktop GUI

### View Containers
1. Open Docker Desktop
2. Click "Containers" in left menu
3. See `seva-redis` container
4. Click on it to view:
   - Logs
   - Stats (CPU, Memory)
   - Terminal access

### Useful Features
- **Start/Stop** containers with one click
- **View logs** without command line
- **Inspect** container details
- **Delete** containers easily

---

## Quick Reference Card

```powershell
# =======================
# Essential Commands
# =======================

# Start Redis
docker start seva-redis

# Stop Redis
docker stop seva-redis

# Test connection
docker exec -it seva-redis redis-cli ping

# Clear rate limits
docker exec -it seva-redis redis-cli FLUSHALL

# View logs
docker logs seva-redis

# Restart app
npm run dev

# Check if working
# Should see: ✅ Redis client connected
```

---

## After Installation Checklist

- [ ] Docker Desktop installed and running
- [ ] Redis container running (`docker ps`)
- [ ] .env file updated with Redis config
- [ ] Server restarted (`npm run dev`)
- [ ] See "✅ Redis client connected" message
- [ ] Can send OTP without rate limit errors
- [ ] OTP stored in Redis (not memory)

---

## Success Indicators

When everything is working, you'll see:

**In Terminal:**
```
✅ Redis client connected successfully
✅ Redis client is ready
✅ Twilio credentials not found - SMS will be mocked
🚀 serving on port 5000
```

**When sending OTP:**
```
📱 OTP Request for Aadhaar: 1234****9121
🔐 Generated OTP: 456789
✅ OTP stored for Aadhaar: 1234****9121
📱 [MOCK SMS]
OTP: 456789
✅ OTP sent successfully in 45ms
```

**No more 429 errors!** Rate limits will persist even if you restart the server.

---

## Need Help?

If you encounter issues:
1. Check Docker Desktop is running (green status)
2. Verify Redis container is up: `docker ps`
3. Test Redis: `docker exec -it seva-redis redis-cli ping`
4. Check .env has correct config
5. Restart server: `npm run dev`

Still stuck? The app will still work with in-memory fallback, but Redis is recommended for production.
