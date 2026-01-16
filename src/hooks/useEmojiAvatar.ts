import { useState, useCallback, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const STORAGE_KEY_PREFIX = "damit-emoji-avatar-";

export function useEmojiAvatar() {
  const { user } = useAuthContext();
  const storageKey = user ? `${STORAGE_KEY_PREFIX}${user.id}` : null;

  const [emoji, setEmoji] = useState<string>(() => {
    if (!storageKey || typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(storageKey) || "";
  });

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      return;
    }
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setEmoji(stored);
    }
  }, [storageKey]);

  const updateEmoji = useCallback(
    (newEmoji: string) => {
      if (!storageKey || typeof window === "undefined") {
        return;
      }
      setEmoji(newEmoji);
      localStorage.setItem(storageKey, newEmoji);
    },
    [storageKey]
  );

  return {
    emoji,
    updateEmoji,
  };
}
