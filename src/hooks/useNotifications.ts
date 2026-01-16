import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:mm format
}

const STORAGE_KEY = "damit-notification-settings";
const DEFAULT_TIME = "20:00"; // 8 PM default

// Module-level variable to track current timeout (not persisted across page reloads)
let currentNotificationTimeout: ReturnType<typeof setTimeout> | null = null;

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" ? Notification.permission : "default"
  );
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    if (typeof window === "undefined") {
      return { enabled: false, time: DEFAULT_TIME };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { enabled: false, time: DEFAULT_TIME };
      }
    }
    return { enabled: false, time: DEFAULT_TIME };
  });

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser doesn't support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setPermission("granted");
      return true;
    }

    if (Notification.permission === "denied") {
      toast.error("Notification permission was denied. Please enable it in your browser settings.");
      setPermission("denied");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      toast.success("Notification permission granted!");
      return true;
    } else {
      toast.error("Notification permission denied");
      return false;
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Reschedule notifications if enabled
    if (updated.enabled && permission === "granted") {
      scheduleDailyNotification(updated.time);
    } else {
      cancelScheduledNotifications();
    }
  }, [settings, permission]);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return;
    }
    updateSettings({ enabled: true });
    toast.success("Daily reminders enabled!");
  }, [permission, requestPermission, updateSettings]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    updateSettings({ enabled: false });
    cancelScheduledNotifications();
    toast.info("Daily reminders disabled");
  }, [updateSettings]);

  // Sync permission state with browser permission (detect external changes)
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // Check permission on window focus (user might have changed it in browser settings)
    const handleFocus = () => {
      const currentPermission = Notification.permission;
      if (currentPermission !== permission) {
        setPermission(currentPermission);
      }
    };

    // Also check periodically (every 30 seconds) in case permission changes while tab is active
    const intervalId = setInterval(() => {
      const currentPermission = Notification.permission;
      if (currentPermission !== permission) {
        setPermission(currentPermission);
      }
    }, 30000);

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, [permission]);

  // Schedule daily notification
  useEffect(() => {
    if (settings.enabled && permission === "granted") {
      scheduleDailyNotification(settings.time);
    }
    
    return () => {
      cancelScheduledNotifications();
    };
  }, [settings.enabled, settings.time, permission]);

  return {
    permission,
    settings,
    requestPermission,
    enableNotifications,
    disableNotifications,
    updateSettings,
  };
}

// Schedule daily notification
function scheduleDailyNotification(time: string) {
  // Cancel any existing notifications
  cancelScheduledNotifications();

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const msUntilNotification = scheduledTime.getTime() - now.getTime();

  // Store timeout ID in module variable (not localStorage - timeout IDs don't persist)
  currentNotificationTimeout = setTimeout(() => {
    showDailyReminderNotification();
    // Schedule next day's notification
    scheduleDailyNotification(time);
  }, msUntilNotification);
}

// Show the actual notification
async function showDailyReminderNotification() {
  // Check if notification permission is still granted
  if (Notification.permission !== "granted") {
    return;
  }

  // Check if log already exists for today
  const today = new Date().toISOString().split("T")[0];
  const lastNotificationDate = localStorage.getItem("damit-last-notification-date");
  
  // Don't show if we already notified today
  if (lastNotificationDate === today) {
    return;
  }

  const notificationOptions: NotificationOptions = {
    body: "Don't forget to log your daily accountability! 📝",
    icon: "/pwa-192x192.png",
    badge: "/favicon.png",
    tag: "daily-reminder",
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
  };

  // Check if service worker is available for better notifications
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("DAMit! Daily Reminder", notificationOptions);
    } catch (error) {
      console.error("Service worker notification failed:", error);
      // Fallback to regular notification
      new Notification("DAMit! Daily Reminder", notificationOptions);
    }
  } else {
    // Fallback for browsers without service worker support
    new Notification("DAMit! Daily Reminder", notificationOptions);
  }

  // Mark that we've notified today
  localStorage.setItem("damit-last-notification-date", today);
}

// Cancel scheduled notifications
function cancelScheduledNotifications() {
  if (currentNotificationTimeout !== null) {
    clearTimeout(currentNotificationTimeout);
    currentNotificationTimeout = null;
  }
  // Clean up any old timeout IDs from localStorage (legacy cleanup)
  localStorage.removeItem("damit-notification-timeout");
}

// Notification click handling is done in the service worker (public/sw.js)
