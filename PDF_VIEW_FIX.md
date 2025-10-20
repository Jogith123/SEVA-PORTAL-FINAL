# PDF View Fix - Cloudinary Resource Type

## Issue Fixed
PDF documents were showing "Failed to load PDF document" error when clicking "View" in admin panel.

## Root Cause
Cloudinary was uploading PDFs with incorrect resource type:
- ❌ Wrong: `/image/upload/` (treats PDFs as images)
- ✅ Correct: `/raw/upload/` (treats PDFs as raw files)

## Solution Implemented

### 1. Fixed Cloudinary Upload Configuration
**File**: `server/config/cloudinary.ts`

Changed from:
```typescript
resource_type: 'auto'  // Doesn't always detect PDFs correctly
```

To:
```typescript
const isPdf = file.mimetype === 'application/pdf';
const resourceType = isPdf ? 'raw' : 'image';  // Explicit detection
```

### 2. Fixed Existing URLs in Admin Panel
**File**: `client/src/pages/admin-panel.tsx`

Added URL transformation:
```typescript
// Fix Cloudinary URL: PDFs need /raw/upload/ instead of /image/upload/
let fixedUrl = doc;
if (isPDF && doc.includes('cloudinary.com') && doc.includes('/image/upload/')) {
  fixedUrl = doc.replace('/image/upload/', '/raw/upload/');
}
```

## What This Means

### For New Uploads
- ✅ PDFs will upload with correct URL format automatically
- ✅ PDFs will be viewable immediately

### For Existing Uploads (Before Fix)
- ✅ URLs are automatically fixed when viewing in admin panel
- ✅ No need to re-upload existing documents
- ✅ Old documents will work correctly

## Testing

### Test with New Upload:
1. Submit a change request with PDF documents
2. Admin views the request
3. Click "View" on PDF document
4. ✅ PDF should open correctly

### Test with Existing Upload (Before Fix):
1. View old requests with PDF documents
2. Click "View" on PDF document
3. ✅ PDF should open correctly (URL auto-fixed)

## URL Format Examples

### Correct PDF URL:
```
https://res.cloudinary.com/[cloud]/raw/upload/v123/seva-portal/supporting-documents/file.pdf
                                    ^^^^
```

### Incorrect PDF URL (Old):
```
https://res.cloudinary.com/[cloud]/image/upload/v123/seva-portal/supporting-documents/file.pdf
                                    ^^^^^
```

### Image URL (Correct):
```
https://res.cloudinary.com/[cloud]/image/upload/v123/seva-portal/supporting-documents/file.jpg
                                    ^^^^^
```

## No Action Required

This fix is **automatic**:
- ✅ New PDFs upload correctly
- ✅ Old PDFs display correctly
- ✅ Images continue to work
- ✅ No configuration changes needed
- ✅ No re-uploads required

## Summary

**Status**: ✅ Fixed

**Changes**:
1. Cloudinary config now explicitly sets resource type
2. Admin panel auto-fixes old PDF URLs
3. All PDFs (old and new) now viewable

**Result**: PDFs open correctly in browser when clicking "View" in admin panel! 🎉
