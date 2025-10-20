import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { upload } from "../config/cloudinary";

const router = Router();

// Upload supporting documents to Cloudinary
router.post("/documents", isAuthenticated, upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Get Cloudinary URLs from uploaded files
    const fileUrls = (req.files as any[]).map(file => file.path);

    res.json({ files: fileUrls });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to upload files",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;
