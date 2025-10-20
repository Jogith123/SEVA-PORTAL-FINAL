import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X } from "lucide-react";
import { translations, type Language } from "@/i18n/translations";

interface EditDocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: any;
  documentType: string;
  onSuccess: () => void;
  language?: Language;
}

export default function EditDocumentModal({
  open,
  onClose,
  document,
  documentType,
  onSuccess,
  language = 'en',
}: EditDocumentModalProps) {
  const { toast } = useToast();
  const t = translations[language];
  
  // All changes require admin approval
  const [fieldToUpdate, setFieldToUpdate] = useState("");
  const [newValue, setNewValue] = useState("");
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const createRequestMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/user/change-requests", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit request");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t.requestSubmitted,
        description: `${t.requestSubmittedWith}: ${data.referenceId}`,
      });
      onSuccess();
      resetForm();
    },
    onError: (error: any) => {
      setError(error.message || t.failedToSubmit);
    },
  });

  const resetForm = () => {
    // All changes require admin approval
    setFieldToUpdate("");
    setNewValue("");
    setSupportingFiles([]);
    setError("");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const getFieldOptions = () => {
    const commonFields = [
      { value: "name", label: t.name },
      { value: "address", label: t.address },
      { value: "phone", label: t.phoneNumber },
      { value: "dateOfBirth", label: t.dateOfBirth },
    ];

    switch (documentType) {
      case "aadhaar":
        return [
          ...commonFields,
          { value: "email", label: t.email },
          { value: "fatherName", label: t.fatherName },
        ];
      case "pan":
        return [
          ...commonFields,
          { value: "fatherName", label: t.fatherName, type: "major" },
        ];
      case "voterId":
        return [
          ...commonFields,
          { value: "fatherName", label: t.fatherName },
          { value: "constituency", label: t.constituency },
        ];
      case "drivingLicense":
        return [
          ...commonFields,
          { value: "fatherName", label: t.fatherName },
          { value: "vehicleClass", label: t.vehicleClass },
        ];
      case "rationCard":
        return [
          { value: "name", label: t.name },
          { value: "address", label: t.address },
          { value: "familyMembers", label: t.familyMembers },
          { value: "category", label: t.category },
        ];
      default:
        return commonFields;
    }
  };

  const handleFieldChange = (value: string) => {
    setFieldToUpdate(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (supportingFiles.length + files.length > 2) {
      setError("You can upload maximum 2 supporting documents");
      return;
    }
    setSupportingFiles([...supportingFiles, ...files]);
    setError("");
  };

  const removeFile = (index: number) => {
    setSupportingFiles(supportingFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fieldToUpdate || !newValue.trim()) {
      setError("Please select a field and enter a new value");
      return;
    }

    if (supportingFiles.length < 2) {
      setError(t.twoDocsRequired);
      return;
    }

    // Create FormData to send files
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("changeType", "major"); // All changes require admin approval
    formData.append("fieldToUpdate", fieldToUpdate);
    formData.append("newValue", newValue.trim());
    
    // Append each file with the field name "supportingFiles"
    supportingFiles.forEach((file) => {
      formData.append("supportingFiles", file);
    });

    createRequestMutation.mutate(formData);
  };

  const getDocumentTitle = () => {
    const titles: { [key: string]: string } = {
      aadhaar: t.aadhaarCard,
      pan: t.panCard,
      voterId: t.voterId,
      drivingLicense: t.drivingLicense,
      rationCard: t.rationCard,
    };
    return titles[documentType] || "Document";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.editDocument} {getDocumentTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="p-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">{t.documentChangeRequest}</h4>
              <p className="text-sm text-muted-foreground">
                {t.allChangesRequireApproval}
              </p>
            </div>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="field">{t.fieldToUpdate}</Label>
            <Select value={fieldToUpdate} onValueChange={handleFieldChange}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectFieldToUpdate} />
              </SelectTrigger>
              <SelectContent>
                {getFieldOptions().map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{field.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {t.adminApprovalRequired}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newValue">{t.newValue}</Label>
            <Input
              id="newValue"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={t.enterNewValue}
            />
          </div>

          {/* All changes require supporting documents */}
          {(
            <div className="space-y-4">
              <Label>{t.supportingDocumentsRequired}</Label>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium mb-2">{t.dropFilesHere}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.uploadSupportingDocs}
                  </p>
                </label>
              </div>

              {supportingFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>{t.uploadedFiles} ({supportingFiles.length}/2)</Label>
                  {supportingFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 government-button"
              disabled={createRequestMutation.isPending}
            >
              {createRequestMutation.isPending ? t.submitting : t.submitRequest}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createRequestMutation.isPending}
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
