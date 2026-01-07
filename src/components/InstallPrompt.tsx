import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show iOS prompt after delay if not installed
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("installPromptDismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (isStandalone || sessionStorage.getItem("installPromptDismissed")) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-card rounded-2xl p-4 shadow-elevated border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl gradient-primary shrink-0">
                <Download className="w-5 h-5 text-primary-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">
                  Install DAM App
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isIOS ? (
                    <>
                      Tap <Share className="inline w-3 h-3 mx-0.5" /> then "Add to Home Screen"
                    </>
                  ) : (
                    "Add to your home screen for quick access"
                  )}
                </p>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg hover:bg-secondary transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstall}
                className="w-full mt-3 py-2.5 rounded-xl gradient-primary text-primary-foreground 
                           font-medium text-sm shadow-soft hover:shadow-card transition-all"
              >
                Install App
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
