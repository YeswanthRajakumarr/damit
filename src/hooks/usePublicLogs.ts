import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyLog } from "./useDailyLogs";

export const usePublicLogs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["public-logs", userId],
        queryFn: async () => {
            if (!userId) return null;

            // Use the supabase client which works with anon key for public access
            // The RLS policy "Anyone can view logs for public sharing" should allow this
            const { data, error } = await supabase
                .from("daily_logs")
                .select("*")
                .eq("user_id", userId)
                .order("log_date", { ascending: false });

            if (error) {
                console.error("Error fetching public logs:", error);
                throw error;
            }
            return data as DailyLog[];
        },
        enabled: !!userId,
        retry: 1, // Only retry once for public queries
    });
};

export const usePublicProfile = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["public-profile", userId],
        queryFn: async () => {
            if (!userId) return null;

            // Use the supabase client which works with anon key for public access
            // The RLS policy "Anyone can view profiles for public sharing" should allow this
            const { data, error } = await supabase
                .from("profiles")
                .select("display_name, avatar_url")
                .eq("user_id", userId)
                .maybeSingle();

            if (error) {
                console.error("Error fetching public profile:", error);
                throw error;
            }
            return data;
        },
        enabled: !!userId,
        retry: 1, // Only retry once for public queries
    });
};
