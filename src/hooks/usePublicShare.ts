import { supabase } from "@/integrations/supabase/client";

export interface ShareToken {
    token: string;
    expires_at: string | null;
}

export const usePublicShare = () => {
    const generateShareLink = async (expiryDays: number = 30): Promise<ShareToken | null> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase.rpc("regenerate_share_token", {
                user_id: user.id,
                expiry_days: expiryDays,
            });

            if (error) throw error;
            return data?.[0] || null;
        } catch (error) {
            console.error("Error generating share link:", error);
            return null;
        }
    };

    const disableSharing = async (): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase.rpc("disable_sharing", {
                user_id: user.id,
            });

            if (error) throw error;
            return data || false;
        } catch (error) {
            console.error("Error disabling sharing:", error);
            return false;
        }
    };

    const getCurrentShareToken = async (): Promise<ShareToken | null> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("share_token, share_token_expires_at, share_enabled")
                .eq("id", user.id)
                .single();

            if (error) throw error;

            if (!data?.share_enabled || !data?.share_token) return null;

            return {
                token: data.share_token,
                expires_at: data.share_token_expires_at,
            };
        } catch (error) {
            console.error("Error fetching share token:", error);
            return null;
        }
    };

    return {
        generateShareLink,
        disableSharing,
        getCurrentShareToken,
    };
};
