import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import JSZip from "jszip";
import { storage } from "./storage";
import { insertDocumentRequestSchema, updateUserProfileSchema } from "@shared/schema";
import { z } from "zod";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication and profile routes
  app.get("/api/user", async (req, res) => {
    // For demo purposes, return a default user (in real app, this would use session)
    const user = await storage.getUserByUsername("john.smith");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.get("/api/admin/user", async (req, res) => {
    // For admin access
    const user = await storage.getUserByUsername("admin");
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    res.json(user);
  });

  app.put("/api/user/profile", async (req, res) => {
    try {
      const profileData = updateUserProfileSchema.parse(req.body);
      // In real app, get userId from session
      const user = await storage.getUserByUsername("john.smith");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUserProfile(user.id, profileData);
      if (!updatedUser) {
        return res.status(404).json({ message: "Failed to update profile" });
      }

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Document upload and processing routes
  app.post("/api/documents/upload", upload.single('zipFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get current user (in real app, from session)
      const user = await storage.getUserByUsername("john.smith");
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const zipFile = req.file;
      const zipBuffer = fs.readFileSync(zipFile.path);
      
      // Extract ZIP file
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipBuffer);
      
      const extractedFiles = [];
      const extractDir = path.join(uploadDir, 'extracted', `request_${Date.now()}`);
      fs.mkdirSync(extractDir, { recursive: true });

      for (const [filename, file] of Object.entries(zipContent.files)) {
        if (!file.dir) {
          const content = await file.async('nodebuffer');
          const filePath = path.join(extractDir, filename);
          const fileDir = path.dirname(filePath);
          
          if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, content);
          
          extractedFiles.push({
            name: filename,
            type: path.extname(filename).toLowerCase(),
            size: content.length,
            path: filePath,
          });
        }
      }

      // Create document request
      const requestData = {
        userId: user.id,
        fileName: zipFile.originalname,
        fileSize: zipFile.size,
        fileCount: extractedFiles.length,
        status: 'pending',
      };

      const documentRequest = await storage.createDocumentRequest(requestData);
      
      // Update request with extracted files
      await storage.updateDocumentRequestFiles(documentRequest.id, extractedFiles);

      // Create individual document records
      for (const file of extractedFiles) {
        await storage.createDocument({
          requestId: documentRequest.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          filePath: file.path,
        });
      }

      // Clean up original uploaded file
      fs.unlinkSync(zipFile.path);

      res.json({
        message: "File uploaded and processed successfully",
        requestId: documentRequest.id,
        fileCount: extractedFiles.length,
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Failed to process uploaded file" });
    }
  });

  // Document request routes
  app.get("/api/documents/requests", async (req, res) => {
    try {
      // Get current user
      const user = await storage.getUserByUsername("john.smith");
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const requests = await storage.getDocumentRequestsByUser(user.id);
      
      // Add user information to each request
      const requestsWithUserInfo = await Promise.all(
        requests.map(async (request) => {
          const requestUser = await storage.getUser(request.userId);
          return {
            ...request,
            user: requestUser ? {
              fullName: requestUser.fullName,
              email: requestUser.email,
              businessName: requestUser.businessName,
            } : null,
          };
        })
      );

      res.json(requestsWithUserInfo);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: "Failed to fetch document requests" });
    }
  });

  app.get("/api/documents/requests/:id", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getDocumentRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Document request not found" });
      }

      const documents = await storage.getDocumentsByRequest(requestId);
      const user = await storage.getUser(request.userId);

      res.json({
        ...request,
        documents,
        user,
      });
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ message: "Failed to fetch document request" });
    }
  });

  // Admin routes
  app.get("/api/admin/requests/pending", async (req, res) => {
    try {
      const pendingRequests = await storage.getPendingDocumentRequests();
      
      // Add user information to each request
      const requestsWithUserInfo = await Promise.all(
        pendingRequests.map(async (request) => {
          const user = await storage.getUser(request.userId);
          return {
            ...request,
            user: user ? {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              businessName: user.businessName,
              businessCategory: user.businessCategory,
            } : null,
          };
        })
      );

      res.json(requestsWithUserInfo);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      res.status(500).json({ message: "Failed to fetch pending requests" });
    }
  });

  app.put("/api/admin/requests/:id/approve", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        return res.status(401).json({ message: "Admin not authenticated" });
      }

      const request = await storage.getDocumentRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Document request not found" });
      }

      // Update request status to approved
      const updatedRequest = await storage.updateDocumentRequestStatus(
        requestId, 
        'approved', 
        adminUser.id
      );

      if (!updatedRequest) {
        return res.status(500).json({ message: "Failed to approve request" });
      }

      // If there's profile data in the request, sync it to the user profile
      if (updatedRequest.extractedFiles && updatedRequest.extractedFiles.length > 0) {
        const user = await storage.getUser(request.userId);
        if (user) {
          // Trigger profile sync timestamp update
          await storage.updateUserProfile(user.id, {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            ssn: user.ssn,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
            businessName: user.businessName,
            businessCategory: user.businessCategory,
          });
        }
      }

      res.json({
        message: "Request approved successfully",
        request: updatedRequest,
      });
    } catch (error) {
      console.error('Error approving request:', error);
      res.status(500).json({ message: "Failed to approve request" });
    }
  });

  app.put("/api/admin/requests/:id/reject", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { reason } = req.body;
      const adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        return res.status(401).json({ message: "Admin not authenticated" });
      }

      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }

      const updatedRequest = await storage.updateDocumentRequestStatus(
        requestId, 
        'rejected', 
        adminUser.id,
        reason
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Document request not found" });
      }

      res.json({
        message: "Request rejected successfully",
        request: updatedRequest,
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      res.status(500).json({ message: "Failed to reject request" });
    }
  });

  // Statistics route
  app.get("/api/statistics", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("john.smith");
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userRequests = await storage.getDocumentRequestsByUser(user.id);
      
      const stats = {
        totalUploads: userRequests.length,
        pendingReview: userRequests.filter(req => req.status === 'pending' || req.status === 'under_review').length,
        approved: userRequests.filter(req => req.status === 'approved').length,
        rejected: userRequests.filter(req => req.status === 'rejected').length,
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
