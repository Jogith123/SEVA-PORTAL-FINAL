import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Check if Cloudinary credentials are configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (!isCloudinaryConfigured) {
  console.warn('⚠️  Cloudinary credentials not found in environment variables!');
  console.warn('Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file');
  console.warn('See CLOUDINARY_SETUP.md for setup instructions');
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Create Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';
    
    return {
      folder: 'seva-portal/supporting-documents',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: resourceType,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname.split('.')[0]}`,
    };
  },
});

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDFs and images
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  },
});

export { cloudinary };
