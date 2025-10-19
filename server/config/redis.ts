/**
 * Redis Configuration with Graceful Fallback
 * Attempts to connect to Redis, but allows operation without it for testing
 */
import Redis from 'ioredis';

let redisConnected = false;

// Create Redis client with configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    // Stop retrying after 3 attempts for faster startup
    if (times > 3) {
      console.warn('⚠️  Redis not available - OTP system will use fallback mode');
      console.warn('⚠️  For production, please install Redis: https://redis.io/download');
      return null; // Stop retrying
    }
    const delay = Math.min(times * 50, 500);
    return delay;
  },
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  lazyConnect: true, // Don't connect immediately
});

// Event handlers
redis.on('connect', () => {
  redisConnected = true;
  console.log('✅ Redis client connected successfully');
});

redis.on('error', (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    redisConnected = false;
    if (!process.env.REDIS_WARNING_SHOWN) {
      console.warn('⚠️  Redis connection refused - using in-memory fallback for testing');
      console.warn('⚠️  To enable full functionality, install Redis:');
      console.warn('   - Windows: docker run -d -p 6379:6379 redis');
      console.warn('   - Mac: brew install redis && redis-server');
      console.warn('   - Linux: sudo apt-get install redis-server');
      process.env.REDIS_WARNING_SHOWN = 'true';
    }
  }
});

redis.on('ready', () => {
  redisConnected = true;
  console.log('✅ Redis client is ready');
});

// Try to connect (non-blocking)
redis.connect().catch(() => {
  // Silently fail - warning already shown
});

export default redis;
export { redisConnected };
