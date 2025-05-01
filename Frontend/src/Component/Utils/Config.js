let backendUrl = "";

if (window.location.hostname === "localhost") {
  // Running locally, use Firebase Functions emulated backend
  backendUrl = "http://localhost:5001/artvista-market/us-central1/api";
} else {
  // Production
  backendUrl = "https://api-avfkvnhjaq-uc.a.run.app";
}

export { backendUrl };
