import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileText, User, Settings } from "lucide-react";
import { translations, type Language } from "@/i18n/translations";
import "@/styles/global.css";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];
  
  const [userForm, setUserForm] = useState({ aadhaarNumber: "", otp: "" });
  const [adminForm, setAdminForm] = useState({ employeeId: "", password: "" });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [maskedMobile, setMaskedMobile] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const sendOtpMutation = useMutation({
    mutationFn: async (data: { aadhaarNumber: string }) => {
      try {
        const response = await apiRequest("POST", "/api/auth/user/send-otp", data);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Server error: ${response.status}`);
        }
        
        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error("Non-JSON Response:", responseText);
          throw new Error("Server returned non-JSON response");
        }
        
        return response.json();
      } catch (error) {
        console.error("Send OTP Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setOtpSent(true);
      setMaskedMobile(data.maskedMobile);
      setError("");
      toast({
        title: "OTP Sent",
        description: `OTP has been sent to +91-${data.maskedMobile}`,
      });
      // Start resend timer (60 seconds)
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error: any) => {
      console.error("Send OTP Mutation Error:", error);
      setError(error.message || "Failed to send OTP. Please check if the API endpoint exists.");
    },
  });

  // Verify OTP and login mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { aadhaarNumber: string; otp: string }) => {
      try {
        const response = await apiRequest("POST", "/api/auth/user/verify-otp", data);
        return response.json();
      } catch (error) {
        console.error("Verify OTP Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], { type: "user", user: data.user });
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.user.name}!`,
      });
      // First update the query cache
      queryClient.invalidateQueries();
      // Then navigate to the dashboard
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to verify OTP");
    }
  });

  const adminLoginMutation = useMutation({
    mutationFn: async (data: { employeeId: string; password: string }) => {
      try {
        const response = await apiRequest("POST", "/api/auth/admin/login", data);
        return response.json();
      } catch (error) {
        console.error("Admin Login Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], { type: "admin", admin: data.admin });
      toast({
        title: "Admin Login Successful",
        description: `Welcome, ${data.admin.name}!`,
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!userForm.aadhaarNumber || userForm.aadhaarNumber.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    sendOtpMutation.mutate({ aadhaarNumber: userForm.aadhaarNumber });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!userForm.otp || userForm.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    verifyOtpMutation.mutate(userForm);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtpMutation.mutate({ aadhaarNumber: userForm.aadhaarNumber });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!adminForm.employeeId || !adminForm.password) {
      setError("Please enter both Employee ID and password");
      return;
    }
    
    adminLoginMutation.mutate(adminForm);
  };

  const resetUserLogin = () => {
    setOtpSent(false);
    setUserForm({ aadhaarNumber: "", otp: "" });
    setMaskedMobile("");
    setError("");
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Skip to main content - Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 px-4 py-2 rounded-md">
        Skip to main content
      </a>

      {/* Top Navigation Bar */}
      <div className="bg-[#1a1a1a] text-white py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>{t.governmentOfIndia}</span>
            <div className="h-4 w-px bg-white/20"></div>
            <a href="#" className="hover:text-orange-400">{t.screenReaderAccess}</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>{t.fontSize}</span>
              <button className="hover:text-orange-400 px-1">A-</button>
              <button className="hover:text-orange-400 px-1 text-base">A</button>
              <button className="hover:text-orange-400 px-1 text-lg">A+</button>
            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent border-0 text-xs hover:text-orange-400 cursor-pointer outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm flex items-center gap-6">
            <span className="font-medium">{t.welcomeMessage}</span>
            <a href="#" className="hover:text-orange-400 flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {t.userManual}
            </a>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-orange-400">{t.help}</a>
            <a href="#" className="hover:text-orange-400">{t.contact}</a>
            <a href="#" className="hover:text-orange-400">{t.feedback}</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img 
              src="/emblem.svg" 
              alt="National Emblem of India" 
              className="w-16 h-16 mb-2" 
            />
            <h1 className="text-2xl font-bold text-blue-600">{t.portalTitle}</h1>
            <p className="text-sm text-gray-600">{t.portalTagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 border-2 border-blue-600 rounded text-blue-600 font-semibold">G20</div>
            <div className="text-sm text-gray-600">Digital India</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Information Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Important Information */}
          <Card>
            <CardHeader className="bg-orange-50 border-b">
              <h3 className="text-lg font-semibold text-orange-600">Important Information</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Secure Authentication</h4>
                    <p className="text-sm text-gray-600">Your data is protected with state-of-the-art encryption and security measures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Digital Documents</h4>
                    <p className="text-sm text-gray-600">Access and manage all your government documents in one place.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services & Features */}
          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <h3 className="text-lg font-semibold text-blue-600">Available Services</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Document Verification</h4>
                </div>
                <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Identity Services</h4>
                </div>
                <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Certificate Management</h4>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notice Board */}
          <Card>
            <CardHeader className="bg-red-50 border-b">
              <h3 className="text-lg font-semibold text-red-600">Important Notices</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <p>Please ensure your Aadhaar is linked with your mobile number for OTP verification.</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <p>For any technical issues, please contact our 24x7 helpdesk at 1800-XXX-XXXX.</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <p>Government officials are advised to use their official email IDs for registration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Login Card (Centered Vertically) */}
        <div className="lg:col-span-1 flex items-center">
          <Card className="shadow-lg w-full">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-semibold">{t.secureLoginPortal}</h2>
              <p className="text-sm opacity-90">{t.accessDocuments}</p>
            </div>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
              <Tabs defaultValue="user" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user" className="text-sm">{t.citizenLogin}</TabsTrigger>
                  <TabsTrigger value="admin" className="text-sm">{t.governmentLogin}</TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaarNumber" className="font-medium">{t.aadhaarNumber}</Label>
                        <Input
                          id="aadhaar"
                          type="text"
                          placeholder={t.enterAadhaar}
                          maxLength={12}
                          value={userForm.aadhaarNumber}
                          onChange={(e) => setUserForm({ ...userForm, aadhaarNumber: e.target.value })}
                          className="text-center tracking-wider"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSendOtp}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={sendOtpMutation.isPending}
                      >
                        {sendOtpMutation.isPending ? t.sending : t.sendOTP}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar-display">Aadhaar Number</Label>
                        <Input
                          id="aadhaar-display"
                          type="text"
                          value={userForm.aadhaarNumber}
                          disabled
                          className="text-center tracking-wider bg-gray-100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="font-medium">{t.enterOTP}</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder={t.enterOTP}
                          maxLength={6}
                          value={userForm.otp}
                          onChange={(e) => setUserForm({ ...userForm, otp: e.target.value })}
                          className="text-center tracking-wider text-lg"
                        />
                        {maskedMobile && (
                          <p className="text-sm text-gray-600 text-center">
                            {t.otpSentTo} +91-{maskedMobile}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleVerifyOtp}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={verifyOtpMutation.isPending}
                        >
                          {verifyOtpMutation.isPending ? t.verifying : t.verifyLogin}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={resetUserLogin}
                          className="px-3"
                        >
                          {t.changeNumber}
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          onClick={handleResendOtp}
                          disabled={resendTimer > 0 || sendOtpMutation.isPending}
                          className="text-sm"
                        >
                          {resendTimer > 0 
                            ? `${t.resendOTP} ${resendTimer}s` 
                            : sendOtpMutation.isPending 
                              ? t.sending 
                              : t.resendOTP
                          }
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="admin">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="font-medium">{t.govEmployeeId}</Label>
                      <Input
                        id="employeeId"
                        type="text"
                        placeholder={t.enterGovId}
                        value={adminForm.employeeId}
                        onChange={(e) => setAdminForm({ ...adminForm, employeeId: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-medium">{t.password}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t.enterPassword}
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAdminLogin}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={adminLoginMutation.isPending}
                    >
                      {adminLoginMutation.isPending ? t.verifying : t.loginToAdmin}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white/80 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <p>24x7 Helpline: 1800-XXX-XXXX</p>
                <p>Email: support@digitaldocs.gov.in</p>
                <p>Working Hours: 9:00 AM to 6:00 PM</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Important Links</h4>
              <div className="space-y-2 text-sm">
                <p><a href="#" className="hover:text-orange-400">{t.termsConditions}</a></p>
                <p><a href="#" className="hover:text-orange-400">{t.privacyPolicy}</a></p>
                <p><a href="#" className="hover:text-orange-400">Accessibility Statement</a></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <div className="space-y-2 text-sm">
                <p>This is a secure government portal</p>
                <p>All transactions are encrypted</p>
                <p>{t.copyright}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}