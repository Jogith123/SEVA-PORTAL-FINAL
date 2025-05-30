import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, FolderSync } from "lucide-react";

interface ApprovalModalProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ApprovalModal({
  request,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ApprovalModalProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle>Approve Request</DialogTitle>
              <p className="text-sm text-gray-500">This action will update the user's profile</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FolderSync className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Profile FolderSync Notice</p>
                <p className="text-sm text-blue-700 mt-1">
                  Approving this request will automatically sync the validated information 
                  to the user's profile and all associated documents.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>User:</strong> {request.user?.fullName}</p>
            <p><strong>Request:</strong> {request.fileName}</p>
            <p><strong>Files:</strong> {request.fileCount} documents</p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Processing..." : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
