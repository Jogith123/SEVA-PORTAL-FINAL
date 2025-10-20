# Quick Database Access Guide

## ✅ YES - You Have a Database!

**Type**: SQLite  
**File**: `data.db`  
**Location**: Your project root folder

```
📁 SevaPortal/
  ├── 📄 data.db          ← YOUR DATABASE IS HERE!
  ├── 📁 client/
  ├── 📁 server/
  ├── 📄 package.json
  └── ...
```

---

## 🚀 Easiest Way to Access (3 Steps)

### Step 1: Install DB Browser (One Time)

1. Go to: **https://sqlitebrowser.org/dl/**
2. Download for Windows
3. Install (next, next, finish)

### Step 2: Open Your Database

1. Launch **DB Browser for SQLite**
2. Click **"Open Database"** button
3. Navigate to: `C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal\data.db`
4. Click **Open**

### Step 3: View Your Data

1. Click **"Browse Data"** tab
2. Select table: **"change_requests"**
3. See all your change requests!

---

## 📊 What You'll See

```
╔═══════════════════════════════════════════════════════╗
║  DB Browser for SQLite                                 ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  Tables:               Browse Data:                    ║
║  ├─ users              ┌─────────────────────┐       ║
║  ├─ admins             │ id | referenceId   │       ║
║  ├─ aadhaar_table      │ 1  | REQ1234567    │       ║
║  ├─ pan_table          │ 2  | REQ1234568    │       ║
║  ├─ change_requests ✓  │ ...                │       ║
║  └─ ...                └─────────────────────┘       ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```

---

## 🔍 Quick Commands

### View All Change Requests:

1. Click **"Execute SQL"** tab
2. Type:
   ```sql
   SELECT * FROM change_requests;
   ```
3. Click **Run** button (▶️)

### Find Requests with PDFs:

```sql
SELECT id, referenceId, supportingDocuments 
FROM change_requests 
WHERE supportingDocuments LIKE '%.pdf%';
```

### Check PDF URLs:

```sql
SELECT 
  id,
  referenceId,
  supportingDocuments
FROM change_requests
WHERE supportingDocuments LIKE '%/image/upload/%'
  AND supportingDocuments LIKE '%.pdf%';
```

---

## 🛠️ Do You Need to Fix URLs?

### ❌ NO - If:
- Download button is working (it already does!)
- Documents are downloading fine
- Everything is functional

### ✅ YES - Only if you want to:
- Clean up the database
- Make URLs consistent
- Do maintenance

### 🎯 Remember:
**The Download button solution already handles both URL formats!**  
Fixing database is purely optional cleanup.

---

## 🔧 If You Want to Fix URLs (Optional)

### STEP 1: BACKUP (MUST DO!)

```bash
# In project folder, run:
copy data.db data.db.backup
```

### STEP 2: Open DB Browser

1. Open `data.db` in DB Browser
2. Go to **"Execute SQL"** tab

### STEP 3: Run This Query

```sql
-- Fix PDF URLs
UPDATE change_requests 
SET supportingDocuments = REPLACE(
  supportingDocuments, 
  '/image/upload/', 
  '/raw/upload/'
)
WHERE supportingDocuments LIKE '%cloudinary%'
  AND supportingDocuments LIKE '%.pdf%'
  AND supportingDocuments LIKE '%/image/upload/%';
```

### STEP 4: Save Changes

1. Click **"Write Changes"** button (💾)
2. Confirm the changes
3. Done!

### STEP 5: Verify

```sql
-- Check updated records
SELECT id, referenceId, supportingDocuments 
FROM change_requests 
WHERE supportingDocuments LIKE '%/raw/upload/%';
```

---

## 📍 Your Database Location

```
Full path:
C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal\data.db

You can:
✅ Open it with DB Browser
✅ Copy it for backup
✅ View it with SQLite tools
✅ Query it with SQL
```

---

## 🎯 Quick Checklist

- [ ] Database exists? → **YES** (`data.db` file)
- [ ] Can access it? → **YES** (use DB Browser)
- [ ] Need to fix URLs? → **NO** (Download buttons work!)
- [ ] Want to fix anyway? → **Backup first!**

---

## 🆘 Common Questions

**Q: Where is my database?**  
A: `C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal\data.db`

**Q: What tool should I use?**  
A: DB Browser for SQLite (easiest for beginners)

**Q: Do I need to fix the URLs?**  
A: No! Download buttons already work with both formats.

**Q: Can I break something?**  
A: Not if you backup first! Always: `copy data.db data.db.backup`

**Q: How do I restore from backup?**  
A: Just copy the backup file back: `copy data.db.backup data.db`

---

## 📚 More Information

**Detailed Guide**: `DATABASE_ACCESS_GUIDE.md`  
**Fix Old Uploads**: `FIXING_OLD_UPLOADS.md`  
**Download Solution**: `DOCUMENT_DOWNLOAD_SOLUTION.md`

---

## ✅ Summary

1. **You HAVE a database**: `data.db` ✅
2. **Access with**: DB Browser for SQLite ✅
3. **Fix URLs?**: NOT required (Download works!) ✅
4. **If you fix**: BACKUP FIRST! ⚠️

**Your database is working fine. The Download button solution handles everything!** 🎉
