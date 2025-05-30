import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('zipFile', file);

      // Simulate upload progress
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/documents/upload');
        xhr.send(formData);
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Upload Successful",
        description: `File uploaded and processed successfully. ${data.fileCount} files extracted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      setSelectedFile(null);
      setUploadProgress(0);
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a ZIP file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 50MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('zipUpload')?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={triggerFileUpload}
      >
        <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Drop your ZIP file here or click to browse</p>
        <p className="text-sm text-gray-500 mb-4">Supported formats: ZIP (max 50MB)</p>
        <input
          type="file"
          id="zipUpload"
          accept=".zip"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button type="button" onClick={triggerFileUpload}>
          Choose File
        </Button>
      </div>

      {selectedFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Selected: {selectedFile.name}</span>
            <Button 
              onClick={handleUpload} 
              disabled={uploadMutation.isPending}
              size="sm"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Uploading {selectedFile?.name}</span>
            <span className="text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
    </div>
  );
}
