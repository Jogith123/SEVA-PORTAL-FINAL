import { apiRequest } from "./queryClient";

export const api = {
  // User operations
  async getCurrentUser() {
    const response = await apiRequest("GET", "/api/user");
    return response.json();
  },

  async updateUserProfile(profileData: any) {
    const response = await apiRequest("PUT", "/api/user/profile", profileData);
    return response.json();
  },

  // Document operations
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('zipFile', file);
    
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  },

  async getDocumentRequests() {
    const response = await apiRequest("GET", "/api/documents/requests");
    return response.json();
  },

  async getDocumentRequest(id: number) {
    const response = await apiRequest("GET", `/api/documents/requests/${id}`);
    return response.json();
  },

  // Admin operations
  async getPendingRequests() {
    const response = await apiRequest("GET", "/api/admin/requests/pending");
    return response.json();
  },

  async approveRequest(requestId: number) {
    const response = await apiRequest("PUT", `/api/admin/requests/${requestId}/approve`);
    return response.json();
  },

  async rejectRequest(requestId: number, reason: string) {
    const response = await apiRequest("PUT", `/api/admin/requests/${requestId}/reject`, { reason });
    return response.json();
  },

  // Statistics
  async getStatistics() {
    const response = await apiRequest("GET", "/api/statistics");
    return response.json();
  },
};
