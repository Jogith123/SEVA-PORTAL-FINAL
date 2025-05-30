import { 
  users, 
  documentRequests, 
  documents,
  type User, 
  type InsertUser,
  type DocumentRequest,
  type InsertDocumentRequest,
  type Document,
  type InsertDocument,
  type UpdateUserProfile,
  type ExtractedFile
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: number, profile: UpdateUserProfile): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Document request operations
  createDocumentRequest(request: InsertDocumentRequest): Promise<DocumentRequest>;
  getDocumentRequest(id: number): Promise<DocumentRequest | undefined>;
  getDocumentRequestsByUser(userId: number): Promise<DocumentRequest[]>;
  getAllDocumentRequests(): Promise<DocumentRequest[]>;
  getPendingDocumentRequests(): Promise<DocumentRequest[]>;
  updateDocumentRequestStatus(id: number, status: string, reviewedBy?: number, rejectionReason?: string): Promise<DocumentRequest | undefined>;
  updateDocumentRequestFiles(id: number, extractedFiles: ExtractedFile[]): Promise<DocumentRequest | undefined>;

  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByRequest(requestId: number): Promise<Document[]>;
  getDocumentsByUser(userId: number): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documentRequests: Map<number, DocumentRequest>;
  private documents: Map<number, Document>;
  private currentUserId: number;
  private currentRequestId: number;
  private currentDocumentId: number;

  constructor() {
    this.users = new Map();
    this.documentRequests = new Map();
    this.documents = new Map();
    this.currentUserId = 1;
    this.currentRequestId = 1;
    this.currentDocumentId = 1;

    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "System Administrator",
      email: "admin@gov.system",
      phone: "(555) 000-0000",
      isAdmin: true,
    });

    // Create default regular user
    this.createUser({
      username: "john.smith",
      password: "password123",
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 987-6543",
      ssn: "***-**-1234",
      address: "123 Main Street",
      city: "Washington",
      state: "DC",
      zipCode: "20001",
      businessName: "Smith Consulting LLC",
      businessCategory: "Professional Services",
      isAdmin: false,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      profileSyncedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(id: number, profile: UpdateUserProfile): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...profile,
      profileSyncedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createDocumentRequest(request: InsertDocumentRequest): Promise<DocumentRequest> {
    const id = this.currentRequestId++;
    const documentRequest: DocumentRequest = {
      ...request,
      id,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      extractedFiles: null,
    };
    this.documentRequests.set(id, documentRequest);
    return documentRequest;
  }

  async getDocumentRequest(id: number): Promise<DocumentRequest | undefined> {
    return this.documentRequests.get(id);
  }

  async getDocumentRequestsByUser(userId: number): Promise<DocumentRequest[]> {
    return Array.from(this.documentRequests.values()).filter(req => req.userId === userId);
  }

  async getAllDocumentRequests(): Promise<DocumentRequest[]> {
    return Array.from(this.documentRequests.values());
  }

  async getPendingDocumentRequests(): Promise<DocumentRequest[]> {
    return Array.from(this.documentRequests.values()).filter(req => 
      req.status === 'pending' || req.status === 'under_review'
    );
  }

  async updateDocumentRequestStatus(id: number, status: string, reviewedBy?: number, rejectionReason?: string): Promise<DocumentRequest | undefined> {
    const request = this.documentRequests.get(id);
    if (!request) return undefined;

    const updatedRequest: DocumentRequest = {
      ...request,
      status,
      reviewedAt: new Date(),
      reviewedBy: reviewedBy || null,
      rejectionReason: rejectionReason || null,
    };
    this.documentRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async updateDocumentRequestFiles(id: number, extractedFiles: ExtractedFile[]): Promise<DocumentRequest | undefined> {
    const request = this.documentRequests.get(id);
    if (!request) return undefined;

    const updatedRequest: DocumentRequest = {
      ...request,
      extractedFiles,
    };
    this.documentRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const doc: Document = {
      ...document,
      id,
      extractedAt: new Date(),
    };
    this.documents.set(id, doc);
    return doc;
  }

  async getDocumentsByRequest(requestId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.requestId === requestId);
  }

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    const userRequests = await this.getDocumentRequestsByUser(userId);
    const requestIds = userRequests.map(req => req.id);
    return Array.from(this.documents.values()).filter(doc => 
      requestIds.includes(doc.requestId)
    );
  }
}

export const storage = new MemStorage();
