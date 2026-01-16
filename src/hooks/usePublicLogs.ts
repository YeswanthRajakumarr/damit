import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyLog } from "./useDailyLogs";

export const usePublicLogs = (shareToken: string | undefined) => {
    return useQuery({
        queryKey: ["public-logs", shareToken],
        queryFn: async () => {
            if (!shareToken) return null;

            // First, get the user_id from the share token
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("id, share_enabled, share_token_expires_at")
                .eq("share_token", shareToken)
                .maybeSingle();

            if (profileError) throw profileError;
            if (!profile) throw new Error("Invalid share link");
            if (!profile.share_enabled) throw new Error("Sharing has been disabled");

            // Check if token is expired
            if (profile.share_token_expires_at) {
                const expiryDate = new Date(profile.share_token_expires_at);
                if (expiryDate < new Date()) {
                    throw new Error("Share link has expired");
                }
            }

            // Now fetch the logs
            const { data, error } = await supabase
                .from("daily_logs")
                .select("*")
                .eq("user_id", profile.id)
                .order("log_date", { ascending: false });

            if (error) throw error;
            return data as DailyLog[];
        },
        enabled: !!shareToken,
        retry: false, // Don't retry on invalid/expired tokens
    });
};

export const usePublicProfile = (shareToken: string | undefined) => {
    return useQuery({
        queryKey: ["public-profile", shareToken],
        queryFn: async () => {
            if (!shareToken) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("display_name, avatar_url, share_enabled, share_token_expires_at")
                .eq("share_token", shareToken)
                .maybeSingle();

            if (error) throw error;
            if (!data) throw new Error("Invalid share link");
            if (!data.share_enabled) throw new Error("Sharing has been disabled");

            // Check if token is expired
            if (data.share_token_expires_at) {
                const expiryDate = new Date(data.share_token_expires_at);
                if (expiryDate < new Date()) {
                    throw new Error("Share link has expired");
                }
            }

            return data;
        },
        enabled: !!shareToken,
        retry: false,
    });
};
