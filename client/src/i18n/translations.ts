// Translation definitions for multi-language support

export type Language = 'en' | 'hi' | 'te' | 'ta';

export interface Translations {
  // Top bar
  governmentOfIndia: string;
  screenReaderAccess: string;
  fontSize: string;
  
  // Secondary nav
  welcomeMessage: string;
  userManual: string;
  help: string;
  contact: string;
  feedback: string;
  
  // Main header
  portalTitle: string;
  portalTagline: string;
  
  // Login card
  secureLoginPortal: string;
  accessDocuments: string;
  citizenLogin: string;
  governmentLogin: string;
  
  // Citizen login
  aadhaarNumber: string;
  enterAadhaar: string;
  sendOTP: string;
  otpSentTo: string;
  enterOTP: string;
  verifyLogin: string;
  resendOTP: string;
  changeNumber: string;
  
  // Government login
  govEmployeeId: string;
  enterGovId: string;
  password: string;
  enterPassword: string;
  loginToAdmin: string;
  
  // Footer
  termsConditions: string;
  privacyPolicy: string;
  copyright: string;
  
  // Messages
  sending: string;
  verifying: string;
  
  // Dashboard
  welcome: string;
  manageDocuments: string;
  totalDocuments: string;
  activeDocuments: string;
  pendingRequests: string;
  yourDocuments: string;
  verified: string;
  pending: string;
  rejected: string;
  view: string;
  edit: string;
  logout: string;
  loggingOut: string;
  loggedOutSuccess: string;
  loadingDocuments: string;
  citizenPortal: string;
  
  // Document types
  aadhaarCard: string;
  panCard: string;
  voterId: string;
  drivingLicense: string;
  rationCard: string;
  
  // Document fields
  number: string;
  name: string;
  lastUpdated: string;
  
  // Admin Panel
  adminPanel: string;
  changeRequests: string;
  viewRequest: string;
  approve: string;
  reject: string;
  requestId: string;
  requestDate: string;
  status: string;
  
  // Document Modal
  details: string;
  personalInformation: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  email: string;
  phone: string;
  addressInformation: string;
  address: string;
  documentInformation: string;
  documentNumber: string;
  issueDate: string;
  downloadPDF: string;
  close: string;
  constituency: string;
  vehicleClass: string;
  expiryDate: string;
  familyMembers: string;
  category: string;
  
  // Edit Modal
  editDocument: string;
  documentChangeRequest: string;
  allChangesRequireApproval: string;
  fieldToUpdate: string;
  selectFieldToUpdate: string;
  adminApprovalRequired: string;
  newValue: string;
  enterNewValue: string;
  supportingDocuments: string;
  supportingDocumentsRequired: string;
  dropFilesHere: string;
  uploadSupportingDocs: string;
  uploadedFiles: string;
  submitRequest: string;
  submitting: string;
  cancel: string;
  requestSubmitted: string;
  requestSubmittedWith: string;
  twoDocsRequired: string;
  failedToSubmit: string;
  phoneNumber: string;
  
  // Admin Panel Extended
  adminControlPanel: string;
  reviewManageRequests: string;
  officer: string;
  totalRequests: string;
  pendingReview: string;
  processedToday: string;
  changeRequestsManagement: string;
  noChangeRequests: string;
  adminSession: string;
  securelyLogoutAdmin: string;
  referenceId: string;
  user: string;
  documentType: string;
  field: string;
  changeType: string;
  submitted: string;
  actions: string;
  viewDocs: string;
  review: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    governmentOfIndia: "भारत सरकार | Government of India",
    screenReaderAccess: "Screen Reader Access",
    fontSize: "Font Size:",
    
    welcomeMessage: "Welcome to Digital Document Services Portal",
    userManual: "User Manual",
    help: "Help",
    contact: "Contact",
    feedback: "Feedback",
    
    portalTitle: "Digital Document Services",
    portalTagline: "Secure access to your government documents",
    
    secureLoginPortal: "Secure Login Portal",
    accessDocuments: "Access your digital documents",
    citizenLogin: "Citizen Login",
    governmentLogin: "Government Login",
    
    aadhaarNumber: "Aadhaar Number",
    enterAadhaar: "Enter 12-digit Aadhaar number",
    sendOTP: "Send OTP",
    otpSentTo: "OTP sent to",
    enterOTP: "Enter 6-digit OTP",
    verifyLogin: "Verify & Login",
    resendOTP: "Resend OTP",
    changeNumber: "Change Number",
    
    govEmployeeId: "Government Employee ID",
    enterGovId: "Enter Government ID",
    password: "Password",
    enterPassword: "Enter password",
    loginToAdmin: "Login to Admin Panel",
    
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    copyright: "© 2024 Government of India. All rights reserved.",
    
    sending: "Sending...",
    verifying: "Verifying...",
    
    welcome: "Welcome",
    manageDocuments: "Manage your government documents and track change requests in one secure place.",
    totalDocuments: "Total Documents",
    activeDocuments: "Active Documents",
    pendingRequests: "Pending Requests",
    yourDocuments: "Your Documents",
    verified: "VERIFIED",
    pending: "PENDING",
    rejected: "REJECTED",
    view: "View",
    edit: "Edit",
    logout: "Logout",
    loggingOut: "Logging out...",
    loggedOutSuccess: "You have been securely logged out.",
    loadingDocuments: "Loading your documents...",
    citizenPortal: "Citizen Portal",
    
    aadhaarCard: "Aadhaar Card",
    panCard: "PAN Card",
    voterId: "Voter ID",
    drivingLicense: "Driving License",
    rationCard: "Ration Card",
    
    number: "Number",
    name: "Name",
    lastUpdated: "Last Updated",
    
    adminPanel: "Admin Panel",
    changeRequests: "Change Requests",
    viewRequest: "View Request",
    approve: "Approve",
    reject: "Reject",
    requestId: "Request ID",
    requestDate: "Request Date",
    status: "Status",
    
    details: "Details",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    fatherName: "Father's Name",
    email: "Email",
    phone: "Phone",
    addressInformation: "Address Information",
    address: "Address",
    documentInformation: "Document Information",
    documentNumber: "Document Number",
    issueDate: "Issue Date",
    downloadPDF: "Download PDF",
    close: "Close",
    constituency: "Constituency",
    vehicleClass: "Vehicle Class",
    expiryDate: "Expiry Date",
    familyMembers: "Family Members",
    category: "Category",
    
    editDocument: "Edit",
    documentChangeRequest: "Document Change Request",
    allChangesRequireApproval: "All changes require admin approval and supporting documents",
    fieldToUpdate: "Field to Update",
    selectFieldToUpdate: "Select field to update",
    adminApprovalRequired: "Admin Approval Required",
    newValue: "New Value",
    enterNewValue: "Enter new value",
    supportingDocuments: "Supporting Documents",
    supportingDocumentsRequired: "Supporting Documents (Required for all changes)",
    dropFilesHere: "Drop files here or click to upload",
    uploadSupportingDocs: "Upload 2 supporting documents to verify your identity (PDF, JPG, PNG)",
    uploadedFiles: "Uploaded Files",
    submitRequest: "Submit Request",
    submitting: "Submitting...",
    cancel: "Cancel",
    requestSubmitted: "Request Submitted",
    requestSubmittedWith: "Your request has been submitted with reference ID",
    twoDocsRequired: "All changes require 2 supporting documents",
    failedToSubmit: "Failed to submit request",
    phoneNumber: "Phone Number",
    
    adminControlPanel: "Admin Control Panel",
    reviewManageRequests: "Review and manage citizen document change requests with comprehensive verification tools.",
    officer: "Officer",
    totalRequests: "Total Requests",
    pendingReview: "Pending Review",
    processedToday: "Processed Today",
    changeRequestsManagement: "Change Requests Management",
    noChangeRequests: "No change requests found",
    adminSession: "Admin Session",
    securelyLogoutAdmin: "Securely logout from admin panel",
    referenceId: "Reference ID",
    user: "User",
    documentType: "Document Type",
    field: "Field",
    changeType: "Change Type",
    submitted: "Submitted",
    actions: "Actions",
    viewDocs: "View Docs",
    review: "Review",
  },
  
  hi: {
    governmentOfIndia: "भारत सरकार | Government of India",
    screenReaderAccess: "स्क्रीन रीडर एक्सेस",
    fontSize: "फ़ॉन्ट आकार:",
    
    welcomeMessage: "डिजिटल दस्तावेज़ सेवा पोर्टल में आपका स्वागत है",
    userManual: "उपयोगकर्ता मैनुअल",
    help: "सहायता",
    contact: "संपर्क करें",
    feedback: "प्रतिक्रिया",
    
    portalTitle: "डिजिटल दस्तावेज़ सेवाएं",
    portalTagline: "अपने सरकारी दस्तावेजों तक सुरक्षित पहुंच",
    
    secureLoginPortal: "सुरक्षित लॉगिन पोर्टल",
    accessDocuments: "अपने डिजिटल दस्तावेज़ों तक पहुंचें",
    citizenLogin: "नागरिक लॉगिन",
    governmentLogin: "सरकारी लॉगिन",
    
    aadhaarNumber: "आधार संख्या",
    enterAadhaar: "12 अंकों की आधार संख्या दर्ज करें",
    sendOTP: "ओटीपी भेजें",
    otpSentTo: "ओटीपी भेजा गया",
    enterOTP: "6 अंकों का ओटीपी दर्ज करें",
    verifyLogin: "सत्यापित करें और लॉगिन करें",
    resendOTP: "ओटीपी पुनः भेजें",
    changeNumber: "नंबर बदलें",
    
    govEmployeeId: "सरकारी कर्मचारी आईडी",
    enterGovId: "सरकारी आईडी दर्ज करें",
    password: "पासवर्ड",
    enterPassword: "पासवर्ड दर्ज करें",
    loginToAdmin: "एडमिन पैनल में लॉगिन करें",
    
    termsConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    copyright: "© 2024 भारत सरकार। सर्वाधिकार सुरक्षित।",
    
    sending: "भेज रहे हैं...",
    verifying: "सत्यापित कर रहे हैं...",
    
    welcome: "स्वागत है",
    manageDocuments: "अपने सरकारी दस्तावेज़ों को प्रबंधित करें और एक सुरक्षित स्थान पर परिवर्तन अनुरोधों को ट्रैक करें।",
    totalDocuments: "कुल दस्तावेज़",
    activeDocuments: "सक्रिय दस्तावेज़",
    pendingRequests: "लंबित अनुरोध",
    yourDocuments: "आपके दस्तावेज़",
    verified: "सत्यापित",
    pending: "लंबित",
    rejected: "अस्वीकृत",
    view: "देखें",
    edit: "संपादित करें",
    logout: "लॉग आउट",
    loggingOut: "लॉग आउट हो रहा है...",
    loggedOutSuccess: "आप सुरक्षित रूप से लॉग आउट हो गए हैं।",
    loadingDocuments: "आपके दस्तावेज़ लोड हो रहे हैं...",
    citizenPortal: "नागरिक पोर्टल",
    
    aadhaarCard: "आधार कार्ड",
    panCard: "पैन कार्ड",
    voterId: "वोटर आईडी",
    drivingLicense: "ड्राइविंग लाइसेंस",
    rationCard: "राशन कार्ड",
    
    number: "संख्या",
    name: "नाम",
    lastUpdated: "अंतिम अपडेट",
    
    adminPanel: "एडमिन पैनल",
    changeRequests: "परिवर्तन अनुरोध",
    viewRequest: "अनुरोध देखें",
    approve: "स्वीकृत करें",
    reject: "अस्वीकार करें",
    requestId: "अनुरोध आईडी",
    requestDate: "अनुरोध तिथि",
    status: "स्थिति",
    
    details: "विवरण",
    personalInformation: "व्यक्तिगत जानकारी",
    fullName: "पूरा नाम",
    dateOfBirth: "जन्म तिथि",
    gender: "लिंग",
    fatherName: "पिता का नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    addressInformation: "पता जानकारी",
    address: "पता",
    documentInformation: "दस्तावेज़ जानकारी",
    documentNumber: "दस्तावेज़ संख्या",
    issueDate: "जारी तिथि",
    downloadPDF: "PDF डाउनलोड करें",
    close: "बंद करें",
    constituency: "निर्वाचन क्षेत्र",
    vehicleClass: "वाहन श्रेणी",
    expiryDate: "समाप्ति तिथि",
    familyMembers: "परिवार के सदस्य",
    category: "श्रेणी",
    
    editDocument: "संपादित करें",
    documentChangeRequest: "दस्तावेज़ परिवर्तन अनुरोध",
    allChangesRequireApproval: "सभी परिवर्तनों के लिए प्रशासक अनुमोदन और समर्थन दस्तावेज़ आवश्यक हैं",
    fieldToUpdate: "अपडेट करने के लिए फ़ील्ड",
    selectFieldToUpdate: "अपडेट करने के लिए फ़ील्ड चुनें",
    adminApprovalRequired: "एडमिन अनुमोदन आवश्यक",
    newValue: "नया मान",
    enterNewValue: "नया मान दर्ज करें",
    supportingDocuments: "समर्थन दस्तावेज़",
    supportingDocumentsRequired: "समर्थन दस्तावेज़ (सभी परिवर्तनों के लिए आवश्यक)",
    dropFilesHere: "फ़ाइलें यहां छोड़ें या अपलोड करने के लिए क्लिक करें",
    uploadSupportingDocs: "अपनी पहचान सत्यापित करने के लिए 2 समर्थन दस्तावेज़ अपलोड करें (PDF, JPG, PNG)",
    uploadedFiles: "अपलोड की गई फ़ाइलें",
    submitRequest: "अनुरोध सबमिट करें",
    submitting: "सबमिट हो रहा है...",
    cancel: "रद्द करें",
    requestSubmitted: "अनुरोध सबमिट किया गया",
    requestSubmittedWith: "आपका अनुरोध संदर्भ आईडी के साथ सबमिट किया गया है",
    twoDocsRequired: "सभी परिवर्तनों के लिए 2 समर्थन दस्तावेज़ आवश्यक हैं",
    failedToSubmit: "अनुरोध सबमिट करने में विफल",
    phoneNumber: "फ़ोन नंबर",
    
    adminControlPanel: "एडमिन नियंत्रण पैनल",
    reviewManageRequests: "व्यापक सत्यापन उपकरणों के साथ नागरिक दस्तावेज़ परिवर्तन अनुरोधों की समीक्षा और प्रबंधन करें।",
    officer: "अधिकारी",
    totalRequests: "कुल अनुरोध",
    pendingReview: "समीक्षाधीन",
    processedToday: "आज संसाधित",
    changeRequestsManagement: "परिवर्तन अनुरोध प्रबंधन",
    noChangeRequests: "कोई परिवर्तन अनुरोध नहीं मिला",
    adminSession: "एडमिन सत्र",
    securelyLogoutAdmin: "एडमिन पैनल से सुरक्षित रूप से लॉग आउट करें",
    referenceId: "संदर्भ आईडी",
    user: "उपयोगकर्ता",
    documentType: "दस्तावेज़ प्रकार",
    field: "फ़ील्ड",
    changeType: "परिवर्तन प्रकार",
    submitted: "सबमिट किया गया",
    actions: "क्रियाएं",
    viewDocs: "दस्तावेज़ देखें",
    review: "समीक्षा करें",
  },
  
  te: {
    governmentOfIndia: "భారత ప్రభుత్వం | Government of India",
    screenReaderAccess: "స్క్రీన్ రీడర్ యాక్సెస్",
    fontSize: "ఫాంట్ పరిమాణం:",
    
    welcomeMessage: "డిజిటల్ డాక్యుమెంట్ సర్వీసెస్ పోర్టల్‌కు స్వాగతం",
    userManual: "వినియోగదారు మాన్యువల్",
    help: "సహాయం",
    contact: "సంప్రదించండి",
    feedback: "అభిప్రాయం",
    
    portalTitle: "డిజిటల్ డాక్యుమెంట్ సర్వీసెస్",
    portalTagline: "మీ ప్రభుత్వ పత్రాలకు సురక్షిత ప్రవేశం",
    
    secureLoginPortal: "సురక్షిత లాగిన్ పోర్టల్",
    accessDocuments: "మీ డిజిటల్ పత్రాలను యాక్సెస్ చేయండి",
    citizenLogin: "పౌరుల లాగిన్",
    governmentLogin: "ప్రభుత్వ లాగిన్",
    
    aadhaarNumber: "ఆధార్ నంబర్",
    enterAadhaar: "12 అంకెల ఆధార్ నంబర్ నమోదు చేయండి",
    sendOTP: "OTP పంపండి",
    otpSentTo: "OTP పంపబడింది",
    enterOTP: "6 అంకెల OTP నమోదు చేయండి",
    verifyLogin: "ధృవీకరించి లాగిన్ అవండి",
    resendOTP: "OTP మళ్లీ పంపండి",
    changeNumber: "నంబర్ మార్చండి",
    
    govEmployeeId: "ప్రభుత్వ ఉద్యోగి ID",
    enterGovId: "ప్రభుత్వ ID నమోదు చేయండి",
    password: "పాస్‌వర్డ్",
    enterPassword: "పాస్‌వర్డ్ నమోదు చేయండి",
    loginToAdmin: "అడ్మిన్ ప్యానెల్‌కు లాగిన్ అవండి",
    
    termsConditions: "నిబంధనలు & షరతులు",
    privacyPolicy: "గోప్యతా విధానం",
    copyright: "© 2024 భారత ప్రభుత్వం. అన్ని హక్కులు రక్షించబడ్డాయి.",
    
    sending: "పంపుతోంది...",
    verifying: "ధృవీకరిస్తోంది...",
    
    welcome: "స్వాగతం",
    manageDocuments: "మీ ప్రభుత్వ పత్రాలను నిర్వహించండి మరియు ఒక సురక్షిత ప్రదేశంలో మార్పు అభ్యర్థనలను ట్రాక్ చేయండి.",
    totalDocuments: "మొత్తం పత్రాలు",
    activeDocuments: "సక్రియ పత్రాలు",
    pendingRequests: "పెండింగ్ అభ్యర్థనలు",
    yourDocuments: "మీ పత్రాలు",
    verified: "ధృవీకరించబడింది",
    pending: "పెండింగ్",
    rejected: "తిరస్కరించబడింది",
    view: "చూడండి",
    edit: "సవరించండి",
    logout: "లాగ్ అవుట్",
    loggingOut: "లాగ్ అవుట్ అవుతోంది...",
    loggedOutSuccess: "మీరు సురక్షితంగా లాగ్ అవుట్ అయ్యారు.",
    loadingDocuments: "మీ పత్రాలు లోడ్ అవుతున్నాయి...",
    citizenPortal: "పౌర పోర్టల్",
    
    aadhaarCard: "ఆధార్ కార్డ్",
    panCard: "PAN కార్డ్",
    voterId: "ఓటర్ ID",
    drivingLicense: "డ్రైవింగ్ లైసెన్స్",
    rationCard: "రేషన్ కార్డ్",
    
    number: "నంబర్",
    name: "పేరు",
    lastUpdated: "చివరి నవీకరణ",
    
    adminPanel: "అడ్మిన్ ప్యానెల్",
    changeRequests: "మార్పు అభ్యర్థనలు",
    viewRequest: "అభ్యర్థనను చూడండి",
    approve: "ఆమోదించండి",
    reject: "తిరస్కరించండి",
    requestId: "అభ్యర్థన ID",
    requestDate: "అభ్యర్థన తేదీ",
    status: "స్థితి",
    
    details: "వివరాలు",
    personalInformation: "వ్యక్తిగత సమాచారం",
    fullName: "పూర్తి పేరు",
    dateOfBirth: "పుట్టిన తేదీ",
    gender: "లింగం",
    fatherName: "తండ్రి పేరు",
    email: "ఇమెయిల్",
    phone: "ఫోన్",
    addressInformation: "చిరునామా సమాచారం",
    address: "చిరునామా",
    documentInformation: "పత్రం సమాచారం",
    documentNumber: "పత్రం నంబర్",
    issueDate: "జారీ తేదీ",
    downloadPDF: "PDF డౌన్‌లోడ్ చేయండి",
    close: "మూసివేయండి",
    constituency: "నియోజకవర్గం",
    vehicleClass: "వాహన తరగతి",
    expiryDate: "గడువు తేదీ",
    familyMembers: "కుటుంబ సభ్యులు",
    category: "వర్గం",
    
    editDocument: "సవరించండి",
    documentChangeRequest: "పత్రం మార్పు అభ్యర్థన",
    allChangesRequireApproval: "అన్ని మార్పులకు అడ్మిన్ ఆమోదం మరియు సహాయక పత్రాలు అవసరం",
    fieldToUpdate: "నవీకరించడానికి ఫీల్డ్",
    selectFieldToUpdate: "నవీకరించడానికి ఫీల్డ్‌ను ఎంచుకోండి",
    adminApprovalRequired: "అడ్మిన్ ఆమోదం అవసరం",
    newValue: "కొత్త విలువ",
    enterNewValue: "కొత్త విలువ నమోదు చేయండి",
    supportingDocuments: "సహాయక పత్రాలు",
    supportingDocumentsRequired: "సహాయక పత్రాలు (అన్ని మార్పులకు అవసరం)",
    dropFilesHere: "ఫైల్‌లను ఇక్కడ వదలండి లేదా అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి",
    uploadSupportingDocs: "మీ గుర్తింపును ధృవీకరించడానికి 2 సహాయక పత్రాలను అప్‌లోడ్ చేయండి (PDF, JPG, PNG)",
    uploadedFiles: "అప్‌లోడ్ చేసిన ఫైల్‌లు",
    submitRequest: "అభ్యర్థనను సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    cancel: "రద్దు చేయండి",
    requestSubmitted: "అభ్యర్థన సమర్పించబడింది",
    requestSubmittedWith: "మీ అభ్యర్థన సూచన IDతో సమర్పించబడింది",
    twoDocsRequired: "అన్ని మార్పులకు 2 సహాయక పత్రాలు అవసరం",
    failedToSubmit: "అభ్యర్థనను సమర్పించడంలో విఫలమైంది",
    phoneNumber: "ఫోన్ నంబర్",
    
    adminControlPanel: "అడ్మిన్ నియంత్రణ ప్యానెల్",
    reviewManageRequests: "సమగ్ర ధృవీకరణ సాధనాలతో పౌర పత్రం మార్పు అభ్యర్థనలను సమీక్షించండి మరియు నిర్వహించండి.",
    officer: "అధికారి",
    totalRequests: "మొత్తం అభ్యర్థనలు",
    pendingReview: "సమీక్షలో ఉంది",
    processedToday: "నేడు ప్రాసెస్ చేయబడింది",
    changeRequestsManagement: "మార్పు అభ్యర్థనల నిర్వహణ",
    noChangeRequests: "మార్పు అభ్యర్థనలు కనుగొనబడలేదు",
    adminSession: "అడ్మిన్ సెషన్",
    securelyLogoutAdmin: "అడ్మిన్ ప్యానెల్ నుండి సురక్షితంగా లాగ్ అవుట్ అవండి",
    referenceId: "సూచన ID",
    user: "వినియోగదారు",
    documentType: "పత్రం రకం",
    field: "ఫీల్డ్",
    changeType: "మార్పు రకం",
    submitted: "సమర్పించబడింది",
    actions: "చర్యలు",
    viewDocs: "పత్రాలు చూడండి",
    review: "సమీక్షించండి",
  },
  
  ta: {
    governmentOfIndia: "இந்திய அரசு | Government of India",
    screenReaderAccess: "திரை வாசிப்பான் அணுகல்",
    fontSize: "எழுத்துரு அளவு:",
    
    welcomeMessage: "டிஜிட்டல் ஆவண சேவைகள் போர்ட்டலுக்கு வரவேற்கிறோம்",
    userManual: "பயனர் கையேடு",
    help: "உதவி",
    contact: "தொடர்பு கொள்ளவும்",
    feedback: "கருத்து",
    
    portalTitle: "டிஜிட்டல் ஆவண சேவைகள்",
    portalTagline: "உங்கள் அரசு ஆவணங்களுக்கு பாதுகாப்பான அணுகல்",
    
    secureLoginPortal: "பாதுகாப்பான உள்நுழைவு போர்ட்டல்",
    accessDocuments: "உங்கள் டிஜிட்டல் ஆவணங்களை அணுகவும்",
    citizenLogin: "குடிமக்கள் உள்நுழைவு",
    governmentLogin: "அரசு உள்நுழைவு",
    
    aadhaarNumber: "ஆதார் எண்",
    enterAadhaar: "12 இலக்க ஆதார் எண்ணை உள்ளிடவும்",
    sendOTP: "OTP அனுப்பவும்",
    otpSentTo: "OTP அனுப்பப்பட்டது",
    enterOTP: "6 இலக்க OTP ஐ உள்ளிடவும்",
    verifyLogin: "சரிபார்த்து உள்நுழைக",
    resendOTP: "OTP ஐ மீண்டும் அனுப்பவும்",
    changeNumber: "எண்ணை மாற்றவும்",
    
    govEmployeeId: "அரசு ஊழியர் ID",
    enterGovId: "அரசு ID ஐ உள்ளிடவும்",
    password: "கடவுச்சொல்",
    enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
    loginToAdmin: "நிர்வாக பேனலுக்கு உள்நுழைக",
    
    termsConditions: "விதிமுறைகள் & நிபந்தனைகள்",
    privacyPolicy: "தனியுரிமைக் கொள்கை",
    copyright: "© 2024 இந்திய அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    
    sending: "அனுப்புகிறது...",
    verifying: "சரிபார்க்கிறது...",
    
    welcome: "வரவேற்பு",
    manageDocuments: "உங்கள் அரசு ஆவணங்களை நிர்வகிக்கவும் மற்றும் ஒரு பாதுகாப்பான இடத்தில் மாற்ற கோரிக்கைகளை கண்காணிக்கவும்.",
    totalDocuments: "மொத்த ஆவணங்கள்",
    activeDocuments: "செயல்படும் ஆவணங்கள்",
    pendingRequests: "நிலுவையில் உள்ள கோரிக்கைகள்",
    yourDocuments: "உங்கள் ஆவணங்கள்",
    verified: "சரிபார்க்கப்பட்டது",
    pending: "நிலுவையில்",
    rejected: "நிராகரிக்கப்பட்டது",
    view: "பார்க்க",
    edit: "திருத்து",
    logout: "வெளியேறு",
    loggingOut: "வெளியேறுகிறது...",
    loggedOutSuccess: "நீங்கள் பாதுகாப்பாக வெளியேறிவிட்டீர்கள்.",
    loadingDocuments: "உங்கள் ஆவணங்கள் ஏற்றப்படுகின்றன...",
    citizenPortal: "குடிமக்கள் போர்ட்டல்",
    
    aadhaarCard: "ஆதார் அட்டை",
    panCard: "PAN அட்டை",
    voterId: "ஓட்டாளர் அடையாள அட்டை",
    drivingLicense: "ஓட்டுநர் உரிமம்",
    rationCard: "ரேஷன் அட்டை",
    
    number: "எண்",
    name: "பெயர்",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    
    adminPanel: "நிர்வாக பேனல்",
    changeRequests: "மாற்ற கோரிக்கைகள்",
    viewRequest: "கோரிக்கையைப் பார்க்க",
    approve: "அங்கீகரி",
    reject: "நிராகரி",
    requestId: "கோரிக்கை ID",
    requestDate: "கோரிக்கை தேதி",
    status: "நிலை",
    
    details: "விவரங்கள்",
    personalInformation: "தனிப்பட்ட தகவல்",
    fullName: "முழு பெயர்",
    dateOfBirth: "பிறந்த தேதி",
    gender: "பாலினம்",
    fatherName: "தந்தையின் பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    addressInformation: "முகவரி தகவல்",
    address: "முகவரி",
    documentInformation: "ஆவண தகவல்",
    documentNumber: "ஆவண எண்",
    issueDate: "வெளியீட்டு தேதி",
    downloadPDF: "PDF பதிவிறக்கவும்",
    close: "மூடு",
    constituency: "தொகுதி",
    vehicleClass: "வாகன வகுப்பு",
    expiryDate: "காலாவதி தேதி",
    familyMembers: "குடும்ப உறுப்பினர்கள்",
    category: "வகை",
    
    editDocument: "திருத்து",
    documentChangeRequest: "ஆவண மாற்ற கோரிக்கை",
    allChangesRequireApproval: "அனைத்து மாற்றங்களுக்கும் நிர்வாக ஒப்புதல் மற்றும் ஆதாரப் ஆவணங்கள் தேவை",
    fieldToUpdate: "புதுப்பிக்க வேண்டிய புலம்",
    selectFieldToUpdate: "புதுப்பிக்க வேண்டிய புலத்தைத் தேர்ந்தெடுக்கவும்",
    adminApprovalRequired: "நிர்வாக ஒப்புதல் தேவை",
    newValue: "புதிய மதிப்பு",
    enterNewValue: "புதிய மதிப்பை உள்ளிடவும்",
    supportingDocuments: "ஆதாரப் ஆவணங்கள்",
    supportingDocumentsRequired: "ஆதாரப் ஆவணங்கள் (அனைத்து மாற்றங்களுக்கும் தேவை)",
    dropFilesHere: "கோப்புகளை இங்கே இழுத்து விடவும் அல்லது பதிவேற்ற கிளிக் செய்யவும்",
    uploadSupportingDocs: "உங்கள் அடையாளத்தை சரிபார்க்க 2 ஆதாரப் ஆவணங்களைப் பதிவேற்றவும் (PDF, JPG, PNG)",
    uploadedFiles: "பதிவேற்றப்பட்ட கோப்புகள்",
    submitRequest: "கோரிக்கையைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கிறது...",
    cancel: "ரத்துசெய்",
    requestSubmitted: "கோரிக்கை சமர்ப்பிக்கப்பட்டது",
    requestSubmittedWith: "உங்கள் கோரிக்கை குறிப்பு IDயுடன் சமர்ப்பிக்கப்பட்டது",
    twoDocsRequired: "அனைத்து மாற்றங்களுக்கும் 2 ஆதாரப் ஆவணங்கள் தேவை",
    failedToSubmit: "கோரிக்கையைச் சமர்ப்பிப்பதில் தோல்வி",
    phoneNumber: "தொலைபேசி எண்",
    
    adminControlPanel: "நிர்வாக கட்டுப்பாட்டு பேனல்",
    reviewManageRequests: "விரிவான சரிபார்ப்பு கருவிகளுடன் குடிமக்கள் ஆவண மாற்ற கோரிக்கைகளை மதிப்பாய்வு செய்து நிர்வகிக்கவும்.",
    officer: "அதிகாரி",
    totalRequests: "மொத்த கோரிக்கைகள்",
    pendingReview: "மதிப்பாய்வு நிலுவையில்",
    processedToday: "இன்று செயலாக்கப்பட்டது",
    changeRequestsManagement: "மாற்ற கோரிக்கைகள் மேலாண்மை",
    noChangeRequests: "மாற்ற கோரிக்கைகள் எதுவும் கிடைக்கவில்லை",
    adminSession: "நிர்வாக அமர்வு",
    securelyLogoutAdmin: "நிர்வாக பேனலிலிருந்து பாதுகாப்பாக வெளியேறவும்",
    referenceId: "குறிப்பு ID",
    user: "பயனர்",
    documentType: "ஆவண வகை",
    field: "புலம்",
    changeType: "மாற்ற வகை",
    submitted: "சமர்ப்பிக்கப்பட்டது",
    actions: "செயல்கள்",
    viewDocs: "ஆவணங்களைப் பார்க்க",
    review: "மதிப்பாய்வு",
  },
};

export function useTranslation(lang: Language = 'en'): Translations {
  return translations[lang];
}
