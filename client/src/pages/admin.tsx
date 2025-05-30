import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserCircle, 
  FileArchive, 
  Eye, 
  Check, 
  X, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DocumentPreviewModal from "@/components/document-preview-modal";
import ApprovalModal from "@/components/approval-modal";
import { useState } from "react";

export default function Admin() {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ["/api/admin/requests/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return apiRequest("PUT", `/api/admin/requests/${requestId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests/pending"] });
      toast({
        title: "Request Approved",
        description: "The request has been approved and user profile has been synced.",
      });
      setShowApprovalModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: number; reason: string }) => {
      return apiRequest("PUT", `/api/admin/requests/${requestId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests/pending"] });
      toast({
        title: "Request Rejected",
        description: "The request has been rejected and user has been notified.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePreview = (request: any) => {
    setSelectedRequest(request);
    setShowPreviewModal(true);
  };

  const handleApprove = (request: any) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const handleReject = async (request: any) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectMutation.mutate({ requestId: request.id, reason });
    }
  };

  const confirmApproval = () => {
    if (selectedRequest) {
      approveMutation.mutate(selectedRequest.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pending Review Requests</h2>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tax">Tax Documents</SelectItem>
              <SelectItem value="identity">Identity Verification</SelectItem>
              <SelectItem value="business">Business Licenses</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/requests/pending"] })}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {!pendingRequests || pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending requests found</p>
            ) : (
              pendingRequests.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <UserCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{request.user?.fullName}</h4>
                          <span className="text-sm text-gray-500">ID: #{request.user?.id}</span>
                          <Badge variant="secondary">Priority</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Document Package: <strong>{request.fileName}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          Submitted: {formatDate(request.submittedAt)}
                        </p>

                        {/* Package Contents */}
                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Package Contents ({request.fileCount} files):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {request.extractedFiles?.slice(0, 4).map((file: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <FileArchive className="h-3 w-3 text-gray-400" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                            {request.fileCount > 4 && (
                              <div className="text-gray-500">
                                +{request.fileCount - 4} more files
                              </div>
                            )}
                          </div>
                        </div>

                        {/* User Profile Summary */}
                        <div className="bg-blue-50 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-2">User Profile Information:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Email: {request.user?.email}</div>
                            <div>Phone: {request.user?.phone}</div>
                            <div>Business: {request.user?.businessName}</div>
                            <div>Category: {request.user?.businessCategory}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(request)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(request)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pendingRequests && pendingRequests.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Showing 1 to {pendingRequests.length} of {pendingRequests.length} requests
              </p>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DocumentPreviewModal
        request={selectedRequest}
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        onApprove={() => {
          setShowPreviewModal(false);
          setShowApprovalModal(true);
        }}
        onReject={() => {
          setShowPreviewModal(false);
          handleReject(selectedRequest);
        }}
      />

      <ApprovalModal
        request={selectedRequest}
        open={showApprovalModal}
        onOpenChange={setShowApprovalModal}
        onConfirm={confirmApproval}
        isLoading={approveMutation.isPending}
      />
    </div>
  );
}
