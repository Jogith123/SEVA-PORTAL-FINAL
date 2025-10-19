/**
 * OTP Controller
 * Handles Aadhaar-based OTP authentication with SMS delivery
 * Security: bcrypt hashing, rate limiting, Redis storage (with in-memory fallback)
 */
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import redis, { redisConnected } from '../config/redis';
import twilio from 'twilio';
import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';

// Initialize Twilio client
let twilioClient: twilio.Twilio | null = null;

export function initializeTwilioClient() {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_TOKEN;
  
  if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('✅ Twilio SMS client initialized');
  } else {
    console.warn('⚠️ Twilio credentials not found - SMS will be mocked');
  }
}

// In-memory storage fallbacks when Redis is not available
const memoryOtpStore = new Map<string, string>();
const memoryAttemptsStore = new Map<string, number>();
const memoryRateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiter configuration: 100 OTP requests per hour per Aadhaar (increased for testing)
let rateLimiter: RateLimiterRedis | RateLimiterMemory;

try {
  rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'otp_rate_limit',
    points: 100,
    duration: 3600,
  });
} catch (error) {
  // Fallback to memory-based rate limiter
  rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 3600,
  });
  console.warn('⚠️  Using in-memory rate limiter (not recommended for production)');
}

/**
 * Mock Aadhaar to mobile number mapping
 * In production, this would call UIDAI/AUA authorized API
 * IMPORTANT: This is for demonstration only
 */
const aadhaarToMobileMap: Record<string, string> = {
  '123456789121': '9392330425', // Test Aadhaar
  '987654321098': '9876543210', // Additional test data
};

/**
 * Generate secure 6-digit OTP using crypto
 */
export function generateOtp(length: number = 6): string {
  const num = crypto.randomInt(0, 10 ** length).toString().padStart(length, '0');
  return num;
}

/**
 * Hash OTP using bcrypt before storing
 */
export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);
  return hash;
}

/**
 * Store hashed OTP in Redis with TTL (5 minutes = 300 seconds)
 * Falls back to in-memory storage if Redis unavailable
 */
export async function storeHashedOtp(aadhaar: string, otp: string): Promise<void> {
  const hash = await hashOtp(otp);
  
  try {
    await redis.set(`otp:${aadhaar}`, hash, 'EX', 300); // 5 minutes expiry
  } catch (error) {
    // Fallback to memory
    memoryOtpStore.set(aadhaar, hash);
    // Set timeout to delete after 5 minutes
    setTimeout(() => memoryOtpStore.delete(aadhaar), 300000);
  }
  
  console.log(`✅ OTP stored for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
}

/**
 * Verify OTP against stored hash
 * Falls back to in-memory storage if Redis unavailable
 */
export async function verifyStoredOtp(aadhaar: string, otp: string): Promise<boolean> {
  let hash: string | null = null;
  
  try {
    hash = await redis.get(`otp:${aadhaar}`);
  } catch (error) {
    // Fallback to memory
    hash = memoryOtpStore.get(aadhaar) || null;
  }
  
  if (!hash) {
    console.log(`❌ No OTP found for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
    return false;
  }
  
  const isValid = await bcrypt.compare(otp, hash);
  
  if (isValid) {
    // Delete OTP after successful verification
    try {
      await redis.del(`otp:${aadhaar}`);
    } catch (error) {
      memoryOtpStore.delete(aadhaar);
    }
    console.log(`✅ OTP verified and deleted for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
  } else {
    console.log(`❌ Invalid OTP attempt for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
  }
  
  return isValid;
}

/**
 * Get masked mobile number for an Aadhaar
 * In production, this would call authorized govt API
 */
export async function getMaskedMobileForAadhaar(aadhaar: string): Promise<{ masked: string; mobile: string } | null> {
  // IMPORTANT: In production, this must call AUA/KUA integration
  // This is a stub for demonstration
  const mobile = aadhaarToMobileMap[aadhaar];
  
  if (!mobile) {
    console.log(`❌ No mobile found for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
    return null;
  }
  
  // Create masked version (show first 2 and last 3 digits)
  const masked = mobile.slice(0, 2) + '*****' + mobile.slice(-3);
  
  console.log(`✅ Retrieved mobile for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)} -> ${masked}`);
  
  return { masked, mobile };
}

/**
 * Send OTP via SMS using Twilio
 */
export async function sendOtpSms(mobile: string, otp: string): Promise<boolean> {
  const message = `Your Seva Portal OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;
  
  if (!twilioClient) {
    // Mock SMS for development
    console.log('📱 [MOCK SMS]');
    console.log(`To: +91${mobile}`);
    console.log(`Message: ${message}`);
    console.log(`OTP: ${otp}`);
    return true;
  }
  
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_FROM || '+1234567890',
      to: `+91${mobile}`,
    });
    
    console.log(`✅ SMS sent successfully. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
    throw new Error('Failed to send OTP SMS');
  }
}

/**
 * Check rate limit for Aadhaar number
 */
export async function checkRateLimit(aadhaar: string): Promise<{ allowed: boolean; remaining?: number }> {
  try {
    const rateLimiterRes = await rateLimiter.consume(aadhaar);
    return {
      allowed: true,
      remaining: rateLimiterRes.remainingPoints,
    };
  } catch (rateLimiterRes: any) {
    console.log(`⚠️ Rate limit exceeded for Aadhaar: ${aadhaar.slice(0, 4)}****${aadhaar.slice(-4)}`);
    return {
      allowed: false,
      remaining: 0,
    };
  }
}

/**
 * Track OTP verification attempts in Redis
 * Falls back to in-memory storage if Redis unavailable
 */
export async function trackOtpAttempt(aadhaar: string): Promise<number> {
  const key = `otp_attempts:${aadhaar}`;
  let attempts = 1;
  
  try {
    attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, 300);
    }
  } catch (error) {
    // Fallback to memory
    const current = memoryAttemptsStore.get(aadhaar) || 0;
    attempts = current + 1;
    memoryAttemptsStore.set(aadhaar, attempts);
    
    if (attempts === 1) {
      setTimeout(() => memoryAttemptsStore.delete(aadhaar), 300000);
    }
  }
  
  return attempts;
}

/**
 * Get remaining OTP attempts
 * Falls back to in-memory storage if Redis unavailable
 */
export async function getRemainingAttempts(aadhaar: string): Promise<number> {
  const key = `otp_attempts:${aadhaar}`;
  let attemptCount = 0;
  
  try {
    const attempts = await redis.get(key);
    attemptCount = attempts ? parseInt(attempts) : 0;
  } catch (error) {
    // Fallback to memory
    attemptCount = memoryAttemptsStore.get(aadhaar) || 0;
  }
  
  return Math.max(0, 3 - attemptCount);
}

/**
 * Reset OTP attempts after successful verification
 * Falls back to in-memory storage if Redis unavailable
 */
export async function resetOtpAttempts(aadhaar: string): Promise<void> {
  const key = `otp_attempts:${aadhaar}`;
  
  try {
    await redis.del(key);
  } catch (error) {
    // Fallback to memory
    memoryAttemptsStore.delete(aadhaar);
  }
}
