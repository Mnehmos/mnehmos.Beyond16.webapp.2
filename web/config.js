(function initConfig() {
  const params = new URLSearchParams(window.location.search);
  const overrideApiBaseUrl = params.get("apiBaseUrl");
  const autoApiBaseUrl = window.location.hostname.includes("github.io")
    ? "https://beyond16-webapp-production.up.railway.app"
    : "http://localhost:3000";

  window.__APP_CONFIG__ = {
    apiBaseUrl: overrideApiBaseUrl || autoApiBaseUrl,
  };
})();
