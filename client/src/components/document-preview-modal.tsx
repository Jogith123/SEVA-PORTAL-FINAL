import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FileImage, 
  FileArchive, 
  Download, 
  Check, 
  X,
  Calendar,
  User
} from "lucide-react";

interface DocumentPreviewModalProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function DocumentPreviewModal({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: DocumentPreviewModalProps) {
  if (!request) return null;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-8 w-8 text-blue-500" />;
      default:
        return <FileArchive className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Document Preview - {request.fileName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm"><strong>Submitted by:</strong> {request.user?.fullName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm"><strong>Date:</strong> {formatDate(request.submittedAt)}</span>
              </div>
              <div>
                <span className="text-sm"><strong>Email:</strong> {request.user?.email}</span>
              </div>
              <div>
                <span className="text-sm"><strong>Business:</strong> {request.user?.businessName}</span>
              </div>
            </div>
          </div>

          {/* Package Contents */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Package Contents ({request.fileCount} files)
            </h4>
            
            {request.extractedFiles && request.extractedFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.extractedFiles.map((file: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 text-center hover:bg-gray-50">
                    <div className="flex flex-col items-center space-y-2">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileArchive className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No file details available</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge 
              className={
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                request.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }
            >
              {request.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {request.status === 'pending' && (
            <>
              <Button 
                variant="destructive"
                onClick={onReject}
              >
                <X className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Request
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
