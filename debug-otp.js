// Debug script to test OTP functionality
import dotenv from 'dotenv';
import crypto from 'crypto';
import Redis from 'ioredis';

dotenv.config();

console.log('\n🔍 Debugging OTP System\n');
console.log('='.repeat(50));

// Test 1: Check environment variables
console.log('\n1️⃣ Environment Variables:');
console.log('   REDIS_HOST:', process.env.REDIS_HOST || '(empty)');
console.log('   REDIS_PORT:', process.env.REDIS_PORT || '(empty)');
console.log('   TWILIO_SID:', process.env.TWILIO_SID ? 'Set' : '(empty)');
console.log('   TWILIO_TOKEN:', process.env.TWILIO_TOKEN ? 'Set' : '(empty)');
console.log('   TWILIO_FROM:', process.env.TWILIO_FROM || '(empty)');

// Test 2: Test crypto.randomInt
console.log('\n2️⃣ Testing OTP Generation:');
try {
  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  console.log('   ✅ Generated OTP:', otp);
} catch (error) {
  console.log('   ❌ Error generating OTP:', error.message);
}

// Test 3: Test Aadhaar mapping
console.log('\n3️⃣ Testing Aadhaar Mapping:');
const aadhaarToMobileMap = {
  '123456789121': '9392330425',
  '987654321098': '9876543210',
};

const testAadhaar = '123456789121';
const mobile = aadhaarToMobileMap[testAadhaar];
if (mobile) {
  const masked = mobile.slice(0, 2) + '*****' + mobile.slice(-3);
  console.log('   ✅ Aadhaar:', testAadhaar);
  console.log('   ✅ Mobile:', mobile);
  console.log('   ✅ Masked:', masked);
} else {
  console.log('   ❌ Aadhaar not found');
}

// Test 4: Test Redis connection
console.log('\n4️⃣ Testing Redis Connection:');
(async () => {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      lazyConnect: true,
    });

    await redis.connect();
    await redis.ping();
    console.log('   ✅ Redis connected successfully');
    await redis.quit();
  } catch (error) {
    console.log('   ⚠️  Redis not available:', error.message);
    console.log('   ℹ️  Will use in-memory fallback');
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Debug complete!\n');
})();
