// Quick test script to verify OTP functionality
const aadhaarToMobileMap = {
  '123456789121': '9392330425',
  '987654321098': '9876543210',
};

function getMaskedMobile(aadhaar) {
  const mobile = aadhaarToMobileMap[aadhaar];
  
  if (!mobile) {
    console.log(`❌ No mobile found for Aadhaar: ${aadhaar}`);
    return null;
  }
  
  const masked = mobile.slice(0, 2) + '*****' + mobile.slice(-3);
  console.log(`✅ Found mobile for Aadhaar: ${aadhaar} -> ${masked}`);
  return { masked, mobile };
}

// Test with your Aadhaar
console.log('\n🧪 Testing OTP Controller Mapping:');
console.log('=====================================\n');

const testAadhaar = '123456789121';
console.log(`Testing Aadhaar: ${testAadhaar}`);
const result = getMaskedMobile(testAadhaar);

if (result) {
  console.log(`\n✅ SUCCESS!`);
  console.log(`   Masked Mobile: ${result.masked}`);
  console.log(`   Full Mobile: ${result.mobile}`);
} else {
  console.log(`\n❌ FAILED - No mapping found`);
}

console.log('\n=====================================\n');
