# Email Setup (Optional)

The biometric approval system now works **without email configuration**. However, if you want to send automatic email notifications to users, follow this guide.

## Current Behavior

✅ **Without Email Config**: Approval works, but admin must inform users manually  
✅ **With Email Config**: Approval works AND sends automatic email notification to users

---

## Email Configuration (Optional)

### Option 1: Gmail (Recommended for Testing)

1. **Create/Use Gmail Account**
2. **Enable 2-Factor Authentication**:
   - Go to Google Account Settings → Security
   - Enable 2-Step Verification

3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

4. **Add to `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

5. **Restart Server**:
   ```bash
   npm run dev
   ```

### Option 2: Other Email Services

#### **Outlook/Hotmail**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### **Yahoo Mail**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### **Custom SMTP Server**
```env
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-smtp-password
```

---

## Testing Email Configuration

### 1. Check Server Logs

After starting the server, you should see:
```
Email transporter initialized with Gmail SMTP
```

### 2. Test Approval Process

1. Login as admin
2. Approve a biometric request
3. Check for success message:
   - ✅ "Request approved and biometric verification email sent successfully"
   - ⚠️  "Request approved, but email notification could not be sent"

### 3. Check User's Email

The user should receive an email with:
- Subject: "Biometric Verification Required - Action Needed"
- Content: Instructions to visit office within 7 days
- Office hours and what to bring

---

## Troubleshooting

### Error: "Email transporter not initialized"

**Cause**: Email credentials not configured or invalid

**Solution**: 
- Verify SMTP credentials in `.env`
- Restart the server
- The approval will still work, but no email will be sent

### Gmail: "Username and Password not accepted"

**Cause**: Using regular password instead of App Password

**Solution**:
- Enable 2-Factor Authentication
- Generate App Password (see Option 1)
- Use the 16-character App Password in `.env`

### Emails Not Received

**Possible Causes**:
1. Email in spam folder
2. Wrong email address in user profile
3. SMTP server blocked by firewall

**Solutions**:
1. Check spam/junk folder
2. Verify user has valid email in database
3. Check firewall settings

---

## Email Template

The system sends a professional email with:

```
✉️ Subject: Biometric Verification Required - Action Needed

📋 Content:
- Approval confirmation
- Deadline: 7 days from approval
- Office hours
- What to bring (ID, documents, confirmation)
- Important warnings
```

---

## Production Recommendations

### For Production Use:

1. **Use Professional SMTP Service**:
   - SendGrid (100 free emails/day)
   - Mailgun (Free tier available)
   - Amazon SES (Very cheap)
   - Custom domain email

2. **Configure Domain Email**:
   ```env
   SMTP_USER=noreply@yourgovernmentdomain.gov.in
   ```

3. **Add SPF/DKIM Records** to your domain for better deliverability

4. **Monitor Email Delivery**:
   - Check server logs
   - Set up bounce handling
   - Track email opens (optional)

---

## Disabling Email Completely

If you never want to use email:

1. The system already handles this gracefully
2. Approvals work without email
3. Admin receives notification that email wasn't sent
4. Admin can inform users manually

**No additional configuration needed!**

---

## FAQ

**Q: Do I need to configure email?**  
A: No, the approval system works without it.

**Q: What happens if email is not configured?**  
A: Approvals work normally, but admin must inform users manually.

**Q: Can I use free email services?**  
A: Yes, Gmail, Outlook, etc. work fine for testing.

**Q: Is email secure?**  
A: Yes, we use TLS encryption for all email communications.

**Q: Can I customize the email template?**  
A: Yes, edit the `sendBiometricApprovalEmail` function in `server/routes/auth.ts`

---

## Summary

- ✅ Email is **optional** - system works without it
- ✅ Easy setup with Gmail for testing
- ✅ Professional template included
- ✅ Graceful error handling
- ✅ Admin always notified of email status

Configure email only if you want automatic notifications. Otherwise, the system works perfectly without it!
