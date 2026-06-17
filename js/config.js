// js/config.js

// Centralized Web Application API Endpoints Registry (Google Apps Script Engine)
const APP_API_REGISTRY = {
  // Base operational routes
  parcelDashboard: "https://script.google.com/macros/s/AKfycby9f86QjvNESTF8Rm0oYfaZEMOvpCjyQ_TZL1id8lkLZu0Ck1qYPIhrSwVbxYuxdSUe7g/exec",
  parcelEntry: "https://script.google.com/macros/s/AKfycbwZw152zyjIA1gU5Ssn4YRl8kTXrdaDlMB8XzZWHc6Hb4WNI7C6D5W4xH-sRI0lE_ZNTA/exec",
  parcelScannerSetup: "https://script.google.com/macros/s/AKfycbxC0SywOr5T6ra5kFbwO9hC8jfb4ImECZbMSXAlTSadie7Yv4IMTNi5T_TCf6X5GY-LFA/exec",
  
  // Enterprise domain workspace script endpoints
  dnaLabsWorkspace: "https://script.google.com/a/macros/dnalabsindia.com/s/AKfycbyRGVI_o6lBULgdc53o0EfWrbWnkC5t7WZLgQ2VpToNp3WGuBIl7-Sv_64wQXQk-uVoLw/exec",
  
  // Report tracking & analysis pipelines
  deliveredToday: "https://script.google.com/macros/s/AKfycbxrAMIt5g_szYTWAXFAACOI7R-XpJiP9CS9bGEsX5bja552Ic-EoAJwbBSN99ZTwdyU_A/exec",
  totalSamples: "https://script.google.com/macros/s/AKfycbxB5-Po-A-N70dR7Ie9VXP0QDHw1hFARAhaMTDoD4FbcNbDrPdh4W1nWootW1iepmtWbA/exec",
  
  // Media asset handlers
  imageGallery: "https://script.google.com/macros/s/AKfycbxrtcZeaWfHYcTfEhidGXr3mxzmrUTaN-zliEJUGlbb8kBl48gby01-mEHxEuV2WlFzrA/exec",
  sampleImageUpload: "https://script.google.com/macros/s/AKfycbyDie30z8_YE8HbZXobIKVXles9RFW3Xo5k1NE24DzrfnTZkfks6u6e4_ZKYFmumrrV/exec",
  
  // Database and Patient Record engines
  patientRecords: "https://script.google.com/macros/s/AKfycbx4xArW62ztoofyoU578qkNRmBpxbU7tN0eJmlcu_Xh16FlHzZKws6PiyLvbsxCZD0hqw/exec",
  optimizedImageCache: "https://script.google.com/macros/s/AKfycbz0eXdOvzB5zVGRNkQkCnCmLixnZdH3E-uXpZRkv4nIZfqMDmOcuU1DvcFGVshO3yyG/exec",
  
  // Additional system fallback routers
  systemUtilityA: "https://script.google.com/macros/s/AKfycbwiTXXO1ypYhs-fykSl9apgTV4ZM9sGvdK5uKp-hkxGYcJjCJoaNZzsuXXFouq9ziY/exec",
  systemUtilityB: "https://script.google.com/macros/s/AKfycbV2_zUbYNt3j_FPtRtauZ1wZaXFqc2fDik3PWK18Asoki_cGYH2HEdKgPhUNaNGLyJGQ/exec"
};

// Legacy Reference Alias (For Firebase compatibility fallbacks if needed)
const FIREBASE_CONFIG = {
  projectId: "dnaindia-9bdd7"
};
