# Quick Test Guide - File Upload & Biometric Approval

## ⚡ Quick Setup (Required)

### 1. Configure Cloudinary
```bash
# Add to .env file
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get credentials from: https://cloudinary.com/users/register/free

### 2. Restart Server
```bash
npm run dev
```

---

## 🧪 Test 1: File Upload (Change Request)

### Steps:
1. **Login as User**
   - Navigate to http://localhost:5000
   - Enter Aadhaar number
   - Enter OTP

2. **Submit Change Request**
   - Click "My Documents"
   - Click "Edit" on any document (e.g., Aadhaar)
   - Select field to update (e.g., "Name")
   - Enter new value (e.g., "jogith")
   - **Upload 2 supporting documents** (PDF, JPG, or PNG)
   - Click "Submit Request"

### Expected Results:
✅ Success message: "Your request has been submitted with reference ID: REQxxxxxxxxx"  
✅ Files uploaded to Cloudinary  
✅ Request appears in admin panel

### Check Cloudinary:
- Login to Cloudinary Dashboard
- Go to Media Library
- Should see files in `seva-portal/supporting-documents` folder

---

## 🧪 Test 2: Biometric Approval

### Steps:
1. **Login as Admin**
   - Navigate to http://localhost:5000/admin
   - Employee ID: `GOV001` (or your admin ID)
   - Password: Your admin password

2. **Approve Request**
   - Go to "Change Requests" tab
   - Find pending request
   - Click "Review"
   - View supporting documents (click "View" button)
   - Add comments
   - Click "Approve"

### Expected Results (Without Email Config):
✅ Success message: "Approval Successful - Request approved, but email notification could not be sent. Please inform the user manually."  
✅ Request status changes to "Approved"  
✅ Admin can view supporting documents

### Expected Results (With Email Config):
✅ Success message: "Request approved and biometric verification email sent successfully."  
✅ User receives email with biometric verification instructions  
✅ Request status changes to "Approved"

---

## 📊 What to Check

### In Browser Console:
```
✅ No errors (except optional email warnings)
✅ Files upload successfully
✅ Approval completes without 500 error
```

### In Server Logs:
```
✅ Email transporter initialized (if SMTP configured)
⚠️  Cloudinary credentials not found (if not configured)
✅ Biometric approval email sent (if SMTP configured)
⚠️  Email sending failed (if SMTP not configured - this is OK!)
```

### In Cloudinary Dashboard:
```
✅ Files appear in Media Library
✅ Folder: seva-portal/supporting-documents
✅ Files are accessible via URL
```

---

## 🐛 Common Issues

### Issue 1: "Failed to upload files"
**Cause**: Cloudinary not configured  
**Fix**: Add Cloudinary credentials to `.env` and restart

### Issue 2: "Request approved, but email notification could not be sent"
**Cause**: SMTP not configured (this is OK!)  
**Fix**: 
- Option 1: Configure email (see `EMAIL_SETUP_OPTIONAL.md`)
- Option 2: Ignore - approval still works, inform users manually

### Issue 3: Files not showing in admin panel
**Cause**: Database not updated  
**Fix**: Check browser console for errors, verify file upload completed

---

## ✅ Success Checklist

- [ ] Cloudinary credentials configured
- [ ] Server restarted after configuration
- [ ] User can upload 2 supporting documents
- [ ] Submit request succeeds
- [ ] Request appears in admin panel
- [ ] Admin can view uploaded documents
- [ ] Admin can approve request (with or without email)
- [ ] No 500 errors in console

---

## 📚 Documentation

- **Cloudinary Setup**: `CLOUDINARY_SETUP.md`
- **Email Setup (Optional)**: `EMAIL_SETUP_OPTIONAL.md`
- **All Changes**: `CHANGES_SUMMARY.md`

---

## 🎯 TL;DR

1. **Setup Cloudinary** (Required)
2. **Upload 2 files when submitting change request**
3. **Admin can approve with or without email config**
4. **Everything works!** ✅

---

## Need Help?

**File Upload Issues**: Check `CLOUDINARY_SETUP.md`  
**Email Issues**: Check `EMAIL_SETUP_OPTIONAL.md`  
**Other Issues**: Check server console logs
