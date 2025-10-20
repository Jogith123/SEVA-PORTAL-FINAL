# Cloudinary Setup Guide

This guide will help you configure Cloudinary for storing supporting documents in the cloud.

## Why Cloudinary?

Cloudinary provides:
- ✅ Cloud-based file storage
- ✅ Automatic optimization
- ✅ CDN delivery
- ✅ Secure URLs
- ✅ Free tier (25GB storage, 25GB bandwidth/month)

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials

1. After logging in, go to the Dashboard
2. You'll see your **Account Details** section with:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configure Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add the following variables with your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=my-seva-portal
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Restart Your Server

After adding the environment variables:

```bash
npm run dev
```

## How It Works

### File Upload Flow

1. **User Action**: User selects 2 supporting documents (PDF, JPG, PNG)
2. **Form Submission**: Files are sent via FormData to `/api/user/change-requests`
3. **Multer Processing**: Multer middleware intercepts files
4. **Cloudinary Upload**: Files are uploaded to Cloudinary automatically
5. **URL Storage**: Cloudinary URLs are stored in the database
6. **Admin View**: Admin can view documents via Cloudinary URLs

### File Structure

```
server/
  └── config/
      └── cloudinary.ts      # Cloudinary configuration
  └── routes.ts              # Updated to handle file uploads
  └── routes/
      └── upload.ts          # Upload route (updated)
```

### Frontend Changes

- `edit-document-modal.tsx`: Now sends files via FormData
- `admin-panel.tsx`: Displays Cloudinary URLs with view buttons

## Testing

1. **Submit a Change Request**:
   - Navigate to your documents
   - Click "Edit" on any document
   - Select a field to update
   - Upload 2 supporting documents
   - Click "Submit Request"

2. **Verify Upload**:
   - Check Cloudinary Dashboard → Media Library
   - Files should appear in `seva-portal/supporting-documents` folder

3. **Admin Panel**:
   - Login as admin
   - View pending requests
   - Click "Review" on a request
   - Supporting documents should be viewable

## Troubleshooting

### Error: "Failed to upload files"

**Cause**: Missing or incorrect Cloudinary credentials

**Solution**: 
- Verify credentials in `.env` file
- Restart the server
- Check console for detailed error messages

### Error: "Only PDF and image files are allowed"

**Cause**: Unsupported file format

**Solution**: Upload only PDF, JPG, JPEG, or PNG files

### Files not showing in admin panel

**Cause**: Database not updated with URLs

**Solution**: 
- Check database `change_requests` table
- Verify `supportingDocuments` column has Cloudinary URLs
- Check browser console for errors

## Security Notes

- ⚠️ **Never commit `.env` file** to version control
- ✅ Environment variables are in `.gitignore`
- ✅ Files are uploaded to private Cloudinary folder
- ✅ 5MB file size limit enforced
- ✅ Only authenticated users can upload

## Cost Considerations

**Free Tier Limits**:
- 25GB storage
- 25GB bandwidth/month
- 25 transformation credits/month

**Estimated Usage**:
- Average file size: ~500KB
- 2 files per request
- 1000 requests = ~1GB storage

The free tier should be sufficient for most use cases.

## Alternative: Local Storage

If you prefer local storage instead of Cloudinary:
1. Remove Cloudinary dependencies
2. Use the backup upload configuration in `server/routes/upload.ts`
3. Ensure `client/public/uploads` directory exists

## Support

For Cloudinary support:
- Documentation: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com/

For application issues:
- Check server logs
- Review browser console
- Verify database entries
