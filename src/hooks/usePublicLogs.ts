import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyLog } from "./useDailyLogs";
import { DateRange } from "react-day-picker";
import { formatDateLocal } from "@/lib/utils";

export const usePublicLogs = (userId: string | undefined, dateRange?: DateRange) => {
    return useQuery({
        queryKey: ["public-logs", userId, dateRange],
        queryFn: async () => {
            if (!userId) return null;

            // Use the supabase client which works with anon key for public access
            // The RLS policy "Anyone can view logs for public sharing" should allow this
            let query = supabase
                .from("daily_logs")
                .select("*")
                .eq("user_id", userId)
                .order("log_date", { ascending: false });

            // Add date range filters
            if (dateRange?.from) {
                query = query.gte("log_date", formatDateLocal(dateRange.from));
            }
            if (dateRange?.to) {
                query = query.lte("log_date", formatDateLocal(dateRange.to));
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching public logs:", error);
                throw error;
            }
            return data as unknown as DailyLog[];
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
                .select("display_name, avatar_url, emoji")
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
