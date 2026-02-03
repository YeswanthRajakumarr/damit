import { useState, useCallback, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EMOJI_STORAGE_KEY_PREFIX = "damit-emoji-avatar-";

export function useProfileAvatar() {
    const { user } = useAuthContext();
    const emojiStorageKey = user ? `${EMOJI_STORAGE_KEY_PREFIX}${user.id}` : null;

    const [emoji, setEmoji] = useState<string>(() => {
        if (!emojiStorageKey || typeof window === "undefined") {
            return "";
        }
        return localStorage.getItem(emojiStorageKey) || "";
    });

    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        user?.user_metadata?.avatar_url || null
    );

    const [isUploading, setIsUploading] = useState(false);

    // Sync emoji from storage when user changes
    useEffect(() => {
        if (!emojiStorageKey || typeof window === "undefined") {
            return;
        }
        const stored = localStorage.getItem(emojiStorageKey);
        if (stored) {
            setEmoji(stored);
        } else {
            setEmoji("");
        }
    }, [emojiStorageKey]);

    // Sync avatarUrl from user metadata when user changes
    useEffect(() => {
        if (user?.user_metadata?.avatar_url) {
            setAvatarUrl(user.user_metadata.avatar_url);
        } else {
            setAvatarUrl(null);
        }
    }, [user]);

    const updateEmoji = useCallback(
        async (newEmoji: string) => {
            if (!emojiStorageKey || typeof window === "undefined") {
                return;
            }
            // Optimistic update
            setEmoji(newEmoji);
            localStorage.setItem(emojiStorageKey, newEmoji);

            if (user) {
                setIsUploading(true);
                try {
                    // Also update the profile in Supabase so it's visible publicly
                    const { error } = await supabase
                        .from('profiles')
                        .update({ emoji: newEmoji })
                        .eq('user_id', user.id);

                    if (error) {
                        console.error("Error updating emoji to profile:", error);
                        toast.error("Failed to sync emoji to public profile");
                    } else {
                        toast.success("Emoji updated!");
                    }
                } catch (e) {
                    console.error("Exception updating emoji:", e);
                } finally {
                    setIsUploading(false);
                }
            }
        },
        [emojiStorageKey, user]
    );

    const uploadAvatar = useCallback(async (file: File) => {
        if (!user) return;
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: data.publicUrl },
            });

            if (updateError) throw updateError;

            // Also update the profile in Supabase so it's visible publicly
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.publicUrl })
                .eq('user_id', user.id);

            if (profileError) {
                console.error("Error updating avatar to profile:", profileError);
            }

            setAvatarUrl(data.publicUrl);
            toast.success("Profile photo updated!");
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast.error(error.message || "Failed to upload profile photo");
        } finally {
            setIsUploading(false);
        }
    }, [user]);

    const removeAvatar = useCallback(async () => {
        if (!user) return;
        setIsUploading(true);

        try {
            // We don't strictly need to delete the file from storage, but updating metadata is must
            const { error } = await supabase.auth.updateUser({
                data: { avatar_url: null },
            });

            if (error) throw error;

            // Also update the profile in Supabase so it's visible publicly
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('user_id', user.id);

            if (profileError) {
                console.error("Error removing avatar from profile:", profileError);
            }

            setAvatarUrl(null);
            toast.success("Profile photo removed");
        } catch (error: any) {
            console.error("Error removing avatar:", error);
            toast.error("Failed to remove profile photo");
        } finally {
            setIsUploading(false);
        }
    }, [user]);

    return {
        emoji,
        avatarUrl,
        isUploading,
        updateEmoji,
        uploadAvatar,
        removeAvatar
    };
}
