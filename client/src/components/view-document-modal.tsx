import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Calendar, User, MapPin, Phone, Mail } from "lucide-react";
import { translations, type Language } from "@/i18n/translations";

interface ViewDocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: any;
  documentType: string;
  language?: Language;
}

export default function ViewDocumentModal({
  open,
  onClose,
  document,
  documentType,
  language = 'en',
}: ViewDocumentModalProps) {
  if (!document) return null;
  
  const t = translations[language];

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

  const getDocumentNumber = () => {
    switch (documentType) {
      case "aadhaar":
        return document.aadhaarNumber;
      case "pan":
        return document.panNumber;
      case "voterId":
        return document.voterIdNumber;
      case "drivingLicense":
        return document.licenseNumber;
      case "rationCard":
        return document.rationCardNumber;
      default:
        return "N/A";
    }
  };

  const handleDownload = () => {
    // Simulate PDF download
    const element = document.createElement("a");
    const file = new Blob([`${getDocumentTitle()} - ${document.name}\nDocument Number: ${getDocumentNumber()}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${documentType}_${document.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const renderDocumentSpecificFields = () => {
    switch (documentType) {
      case "aadhaar":
        return (
          <>
            <div className="info-row">
              <span className="info-label">{t.gender}:</span>
              <span className="info-value">{document.gender || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.fatherName}:</span>
              <span className="info-value">{document.fatherName || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.email}:</span>
              <span className="info-value">{document.email || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.phone}:</span>
              <span className="info-value">{document.phone || "N/A"}</span>
            </div>
          </>
        );
      
      case "pan":
        return (
          <div className="info-row">
            <span className="info-label">{t.fatherName}:</span>
            <span className="info-value">{document.fatherName || "N/A"}</span>
          </div>
        );
      
      case "voterId":
        return (
          <>
            <div className="info-row">
              <span className="info-label">{t.gender}:</span>
              <span className="info-value">{document.gender || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.fatherName}:</span>
              <span className="info-value">{document.fatherName || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.constituency}:</span>
              <span className="info-value">{document.constituency || "N/A"}</span>
            </div>
          </>
        );
      
      case "drivingLicense":
        return (
          <>
            <div className="info-row">
              <span className="info-label">{t.fatherName}:</span>
              <span className="info-value">{document.fatherName || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.vehicleClass}:</span>
              <span className="info-value">{document.vehicleClass || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.expiryDate}:</span>
              <span className="info-value">{document.expiryDate || "N/A"}</span>
            </div>
          </>
        );
      
      case "rationCard":
        return (
          <>
            <div className="info-row">
              <span className="info-label">{t.familyMembers}:</span>
              <span className="info-value">{document.familyMembers || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.category}:</span>
              <span className="info-value">
                <Badge variant="secondary">{document.category || "N/A"}</Badge>
              </span>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            {getDocumentTitle()} {t.details}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{getDocumentTitle()}</CardTitle>
                <Badge className="status-verified">{t.verified}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {getDocumentNumber()}
                </div>
                <div className="text-lg font-semibold">{document.name}</div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t.personalInformation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="info-row">
                <span className="info-label">{t.fullName}:</span>
                <span className="info-value">{document.name}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">{t.dateOfBirth}:</span>
                <span className="info-value">{document.dateOfBirth || "N/A"}</span>
              </div>

              {renderDocumentSpecificFields()}
            </CardContent>
          </Card>

          {/* Address Information */}
          {document.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t.addressInformation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="info-row">
                  <span className="info-label">{t.address}:</span>
                  <span className="info-value">{document.address}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t.documentInformation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="info-row">
                <span className="info-label">{t.documentNumber}:</span>
                <span className="info-value font-mono">{getDocumentNumber()}</span>
              </div>
              
              {document.issueDate && (
                <div className="info-row">
                  <span className="info-label">{t.issueDate}:</span>
                  <span className="info-value">{document.issueDate}</span>
                </div>
              )}
              
              <div className="info-row">
                <span className="info-label">{t.lastUpdated}:</span>
                <span className="info-value">{formatDate(document.lastUpdated)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleDownload} className="flex-1 government-button">
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPDF}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
