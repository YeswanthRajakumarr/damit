import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyLog } from "./useDailyLogs";

export const usePublicLogs = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["public-logs", userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("daily_logs")
                .select("*")
                .eq("user_id", userId)
                .order("log_date", { ascending: false });

            if (error) throw error;
            return data as DailyLog[];
        },
        enabled: !!userId,
    });
};

export const usePublicProfile = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["public-profile", userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("display_name, avatar_url")
                .eq("user_id", userId)
                .maybeSingle();

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
};
