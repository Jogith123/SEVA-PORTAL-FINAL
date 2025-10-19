# Redis Installation Guide for Windows

## Option 1: Using Docker (Recommended) ⭐

### Prerequisites
1. Install Docker Desktop from: https://www.docker.com/products/docker-desktop/

### Steps
1. **Install Docker Desktop**
   - Download and install Docker Desktop for Windows
   - Start Docker Desktop
   - Wait for it to fully start (whale icon in system tray)

2. **Run Redis Container**
   ```bash
   docker run -d --name seva-redis -p 6379:6379 redis
   ```

3. **Verify Redis is Running**
   ```bash
   docker ps
   ```
   You should see `seva-redis` container running

4. **Test Redis Connection**
   ```bash
   docker exec -it seva-redis redis-cli ping
   ```
   Should return: `PONG`

### Redis Commands:
```bash
# Start Redis
docker start seva-redis

# Stop Redis
docker stop seva-redis

# View Redis logs
docker logs seva-redis

# Clear all data (use carefully!)
docker exec -it seva-redis redis-cli FLUSHALL
```

---

## Option 2: Using WSL2 (Windows Subsystem for Linux)

### Prerequisites
1. Enable WSL2 on Windows
2. Install Ubuntu from Microsoft Store

### Steps
1. **Open Ubuntu Terminal**

2. **Install Redis**
   ```bash
   sudo apt update
   sudo apt install redis-server -y
   ```

3. **Start Redis**
   ```bash
   sudo service redis-server start
   ```

4. **Test Connection**
   ```bash
   redis-cli ping
   ```
   Should return: `PONG`

5. **Make Redis Start Automatically**
   ```bash
   sudo systemctl enable redis-server
   ```

---

## Option 3: Native Windows Installation (Not Recommended)

### Using Memurai (Redis-compatible for Windows)
1. Download from: https://www.memurai.com/get-memurai
2. Install Memurai
3. It will run on port 6379 by default

---

## Verify Redis is Working

### Method 1: Using redis-cli
```bash
redis-cli ping
# Should return: PONG
```

### Method 2: Using Docker
```bash
docker exec -it seva-redis redis-cli ping
# Should return: PONG
```

### Method 3: Check from Node.js
Create a test file `test-redis.js`:
```javascript
const Redis = require('ioredis');
const redis = new Redis();

redis.on('connect', () => {
  console.log('✅ Redis connected successfully!');
  redis.quit();
  process.exit(0);
});

redis.on('error', (err) => {
  console.error('❌ Redis connection failed:', err);
  process.exit(1);
});
```

Run: `node test-redis.js`

---

## Common Issues & Solutions

### Issue: "ECONNREFUSED" Error
**Solution**: Redis is not running. Start Redis using one of the methods above.

### Issue: Port 6379 Already in Use
**Solution**: 
```bash
# Find what's using the port
netstat -ano | findstr :6379

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Docker not starting
**Solution**: 
- Restart Docker Desktop
- Check if Hyper-V is enabled in Windows Features
- Update Docker Desktop to latest version

---

## Redis GUI Tools (Optional)

For easier management, install a Redis GUI:

1. **RedisInsight** (Official, Free)
   - Download: https://redis.io/insight/
   - Best for beginners

2. **Another Redis Desktop Manager**
   - Download: https://github.com/qishibo/AnotherRedisDesktopManager

---

## After Installing Redis

1. **Update your `.env` file:**
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

2. **Restart your application:**
   ```bash
   npm run dev
   ```

3. **You should see:**
   ```
   ✅ Redis client connected successfully
   ✅ Redis client is ready
   ```

---

## Quick Commands Reference

```bash
# Start Redis (Docker)
docker start seva-redis

# Stop Redis (Docker)
docker stop seva-redis

# Clear all OTP data
docker exec -it seva-redis redis-cli FLUSHALL

# Monitor Redis commands in real-time
docker exec -it seva-redis redis-cli MONITOR

# Check Redis memory usage
docker exec -it seva-redis redis-cli INFO memory

# List all keys
docker exec -it seva-redis redis-cli KEYS '*'

# Get specific OTP
docker exec -it seva-redis redis-cli GET "otp:123456789121"
```

---

## Need Help?

If Redis installation fails, the application will still work using **in-memory fallback mode**. However, for production use, Redis is strongly recommended.
