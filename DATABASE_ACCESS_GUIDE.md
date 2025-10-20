# Database Access Guide

## ✅ Yes, You Have a Database!

**Database Type**: SQLite  
**Database File**: `data.db` (in your project root)  
**ORM**: Drizzle ORM  
**Driver**: better-sqlite3

---

## 📁 Database Location

```
C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal\data.db
```

This file contains all your data:
- Users
- Admins
- Documents (Aadhaar, PAN, Voter ID, etc.)
- Change requests
- Supporting documents URLs

---

## 🔧 3 Ways to Access Your Database

### Option 1: VS Code Extension (Easiest) ⭐

1. **Install SQLite Viewer Extension**:
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "SQLite Viewer"
   - Install the extension

2. **Open Database**:
   - Right-click on `data.db` file
   - Select "Open Database"
   - Browse tables and data visually

3. **Run Queries**:
   - Click "Run Query" button
   - Type SQL and execute

### Option 2: DB Browser for SQLite (Visual Tool)

1. **Download**: https://sqlitebrowser.org/dl/
2. **Install** the application
3. **Open Database**:
   - Launch DB Browser
   - File → Open Database
   - Select `data.db`
4. **Browse Data**:
   - See all tables
   - Edit data visually
   - Run SQL queries

### Option 3: Command Line (Advanced)

```bash
# Navigate to project folder
cd C:\Users\Asus\OneDrive\Desktop\SevaPortal\SevaPortal

# Open SQLite
sqlite3 data.db

# View tables
.tables

# View data
SELECT * FROM change_requests;

# Exit
.exit
```

---

## 📊 Database Tables

Your database has these tables:

1. **users** - User accounts
2. **admins** - Admin accounts
3. **aadhaar_table** - Aadhaar documents
4. **pan_table** - PAN card documents
5. **voterid_table** - Voter ID documents
6. **driving_license_table** - Driving licenses
7. **ration_card_table** - Ration cards
8. **change_requests** - Document change requests ⭐
9. **field_change_tracker** - Change history

---

## 🔍 View Change Requests with Supporting Documents

### Using SQL Query:

```sql
-- View all change requests with supporting documents
SELECT 
  id,
  referenceId,
  userId,
  documentType,
  fieldToUpdate,
  newValue,
  supportingDocuments,
  status,
  submittedAt
FROM change_requests
ORDER BY submittedAt DESC;
```

### Check PDF URLs:

```sql
-- Find all requests with PDF documents
SELECT 
  id,
  referenceId,
  supportingDocuments
FROM change_requests
WHERE supportingDocuments LIKE '%.pdf%';
```

---

## 🛠️ Fix Old PDF URLs (Optional)

### ⚠️ IMPORTANT: Backup First!

```bash
# Create backup
copy data.db data.db.backup
```

### Option A: Fix All PDF URLs

```sql
-- Fix PDF URLs that have /image/upload/ to /raw/upload/
UPDATE change_requests 
SET supportingDocuments = REPLACE(supportingDocuments, '/image/upload/', '/raw/upload/')
WHERE supportingDocuments LIKE '%cloudinary%'
  AND supportingDocuments LIKE '%.pdf%'
  AND supportingDocuments LIKE '%/image/upload/%';
```

### Option B: Fix Specific Request

```sql
-- Check first
SELECT id, referenceId, supportingDocuments 
FROM change_requests 
WHERE id = YOUR_REQUEST_ID;

-- Then fix
UPDATE change_requests 
SET supportingDocuments = 'NEW_URL_HERE'
WHERE id = YOUR_REQUEST_ID;
```

### Verify Changes:

```sql
-- Check updated records
SELECT 
  id,
  referenceId,
  supportingDocuments
FROM change_requests
WHERE supportingDocuments LIKE '%/raw/upload/%';
```

---

## 📝 Safe Database Operations

### 1. Always Backup First

```bash
# Before any UPDATE or DELETE
copy data.db data.db.backup
```

### 2. Test with SELECT First

```sql
-- Test your query with SELECT first
SELECT * FROM change_requests 
WHERE supportingDocuments LIKE '%/image/upload/%pdf%';

-- If results look good, then UPDATE
UPDATE change_requests 
SET supportingDocuments = REPLACE(...)
WHERE supportingDocuments LIKE '%/image/upload/%pdf%';
```

### 3. Use Transactions (Advanced)

```sql
-- Start transaction
BEGIN TRANSACTION;

-- Make changes
UPDATE change_requests ...

-- Check results
SELECT * FROM change_requests WHERE ...

-- If good: commit
COMMIT;

-- If bad: rollback
ROLLBACK;
```

---

## 🔍 Useful Queries

### View All Pending Requests:

```sql
SELECT 
  referenceId,
  documentType,
  fieldToUpdate,
  newValue,
  status,
  submittedAt
FROM change_requests
WHERE status = 'pending'
ORDER BY submittedAt DESC;
```

### Count Requests by Status:

```sql
SELECT 
  status,
  COUNT(*) as count
FROM change_requests
GROUP BY status;
```

### Find User by Aadhaar:

```sql
SELECT * FROM users 
WHERE aadhaarNumber = '123456789012';
```

### View All Documents for a User:

```sql
-- Get user ID first
SELECT id FROM users WHERE aadhaarNumber = 'YOUR_AADHAAR';

-- Then get their documents
SELECT * FROM aadhaar_table WHERE userId = USER_ID;
SELECT * FROM pan_table WHERE userId = USER_ID;
SELECT * FROM voterid_table WHERE userId = USER_ID;
```

---

## 🎯 Quick Fix Script for Old PDFs

Create a file `fix-pdf-urls.js`:

```javascript
import Database from "better-sqlite3";
import { join } from "path";

// Open database
const db = new Database(join(process.cwd(), "data.db"));

// Backup first
db.backup(`data.db.backup-${Date.now()}`);

// Fix PDF URLs
const result = db.prepare(`
  UPDATE change_requests 
  SET supportingDocuments = REPLACE(supportingDocuments, '/image/upload/', '/raw/upload/')
  WHERE supportingDocuments LIKE '%cloudinary%'
    AND supportingDocuments LIKE '%.pdf%'
    AND supportingDocuments LIKE '%/image/upload/%'
`).run();

console.log(`Fixed ${result.changes} records`);

// Show updated records
const updated = db.prepare(`
  SELECT id, referenceId, supportingDocuments 
  FROM change_requests 
  WHERE supportingDocuments LIKE '%/raw/upload/%pdf%'
`).all();

console.log('\nUpdated records:');
console.log(updated);

db.close();
```

Run it:
```bash
node fix-pdf-urls.js
```

---

## 🚨 Important Notes

### DO NOT Fix URLs If:
- Download button already works
- You're not experiencing issues
- **The current solution (Download buttons) already handles this!**

### DO Fix URLs Only If:
- You want cleaner database
- You're doing maintenance
- You understand SQL and backups

### Remember:
The **Download button solution already works** for old and new URLs!  
Fixing the database is optional and for cleanup only.

---

## 📊 Database Schema

### Change Requests Table:

```sql
CREATE TABLE change_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referenceId TEXT NOT NULL UNIQUE,
  userId INTEGER NOT NULL,
  documentType TEXT NOT NULL,
  changeType TEXT NOT NULL,
  fieldToUpdate TEXT NOT NULL,
  newValue TEXT NOT NULL,
  oldValue TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  supportingDocuments TEXT,  -- ⭐ Cloudinary URLs stored here
  submittedAt INTEGER DEFAULT CURRENT_TIMESTAMP,
  reviewedAt INTEGER,
  reviewedBy INTEGER,
  comments TEXT
);
```

---

## 🔧 Recommended Tools

### For Windows:

1. **DB Browser for SQLite** ⭐ (Best for beginners)
   - Visual interface
   - Easy to use
   - Free and open source
   - Download: https://sqlitebrowser.org/

2. **VS Code SQLite Extension** ⭐
   - Works inside VS Code
   - Quick and convenient
   - Search: "SQLite Viewer" in extensions

3. **HeidiSQL**
   - Powerful database manager
   - Supports multiple databases
   - Download: https://www.heidisql.com/

4. **DBeaver**
   - Universal database tool
   - Professional features
   - Download: https://dbeaver.io/

---

## 🎯 Quick Start Guide

### To Just View Data:

1. **Install DB Browser for SQLite**
2. **Open `data.db`** file
3. **Browse Data** tab
4. **Select table** (e.g., `change_requests`)
5. **View all records**

### To Run Queries:

1. **Open DB Browser**
2. **Execute SQL** tab
3. **Type your query**
4. **Click Run** (▶️ button)
5. **See results**

### To Fix PDF URLs:

1. **BACKUP data.db first!**
2. **Open DB Browser**
3. **Execute SQL** tab
4. **Run the UPDATE query**
5. **Verify with SELECT query**
6. **Write Changes** (save button)

---

## ✅ Summary

**You have SQLite database**: ✅ Yes!  
**Location**: `data.db` in project root  
**Access tools**: DB Browser, VS Code extension, CLI  
**Fix needed**: ❌ No! (Download buttons already handle it)  
**Optional cleanup**: ✅ Can fix URLs if you want  

**Recommendation**: **Don't fix the URLs** - the Download button solution already works perfectly! Fix only if you want a cleaner database for maintenance purposes.

---

## 📚 More Resources

- **SQLite Documentation**: https://www.sqlite.org/docs.html
- **DB Browser Guide**: https://github.com/sqlitebrowser/sqlitebrowser/wiki
- **Drizzle ORM Docs**: https://orm.drizzle.team/
- **SQL Tutorial**: https://www.w3schools.com/sql/

---

## 🆘 Need Help?

### Check First:
1. Is Download button working? (Yes → Don't need to fix DB!)
2. Do you have backup? (Always backup before changes!)
3. Are you comfortable with SQL? (If no → use visual tools!)

### Remember:
**The system already works with the Download button solution!**  
Database fixes are purely optional for cleanup/maintenance.
