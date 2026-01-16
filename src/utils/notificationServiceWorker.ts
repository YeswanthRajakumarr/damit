// Register notification handlers for the service worker
// This runs after the service worker is registered by vite-plugin-pwa

export function setupNotificationHandlers() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.ready.then((registration) => {
    // Handle notification clicks
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "NOTIFICATION_CLICK") {
        // Focus or open the app
        window.focus();
      }
    });
  });

  // Listen for service worker updates
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Service worker updated, reload to get new version
    window.location.reload();
  });
}
