import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDateLocal } from "@/lib/utils";

export interface DailyLog {
  id: string;
  log_date: string;
  diet: number | null;
  energy_level: number | null;
  stress_fatigue: number | null;
  workout: number | null;
  water_intake: number | null;
  sleep_last_night: number | null;
  cravings: number | null;
  hunger_level: number | null;
  step_goal_reached: number | null;
  good_thing: string | null;
  step_count: number | null;
  proud_of_yourself: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

import { DateRange } from "react-day-picker";

export const useDailyLogs = (page?: number, pageSize?: number, dateRange?: DateRange) => {
  return useQuery({
    queryKey: ["daily-logs", page, pageSize, dateRange],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("daily_logs")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("log_date", { ascending: false });

      if (dateRange?.from) {
        query = query.gte("log_date", formatDateLocal(dateRange.from));
      }
      if (dateRange?.to) {
        query = query.lte("log_date", formatDateLocal(dateRange.to));
      }

      if (page !== undefined && pageSize !== undefined) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return {
        logs: data as DailyLog[],
        totalCount: count || 0,
      };
    },
  });
};

export const useCheckExistingLog = (date: Date) => {
  const dateStr = formatDateLocal(date);

  return useQuery({
    queryKey: ["daily-log-check", dateStr],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("daily_logs")
        .select("id, log_date, updated_at")
        .eq("log_date", dateStr)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

interface SaveDailyLogParams {
  answers: Record<number, string | number | null>;
  selectedDate: Date;
  imageFile?: File | null;
}

export const useSaveDailyLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ answers, selectedDate, imageFile }: SaveDailyLogParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const logDate = formatDateLocal(selectedDate);
      let photoUrl = (answers as any).photo_url || null;

      // Check if there's an existing log to get the old photo URL
      const { data: existingLog } = await supabase
        .from("daily_logs")
        .select("photo_url")
        .eq("log_date", logDate)
        .eq("user_id", user.id)
        .maybeSingle();

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/${logDate}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Delete old photo if exists and we're uploading a new one
        if (existingLog?.photo_url) {
          const oldFileName = existingLog.photo_url.split('/').pop();
          if (oldFileName) {
            const oldFilePath = `${user.id}/${oldFileName}`;
            await supabase.storage
              .from('log-photos')
              .remove([oldFilePath]);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('log-photos')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('log-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      const logData = {
        user_id: user.id,
        log_date: logDate,
        diet: answers[1] as number | null,
        energy_level: answers[2] as number | null,
        stress_fatigue: answers[3] as number | null,
        workout: answers[4] as number | null,
        water_intake: answers[5] as number | null,
        sleep_last_night: answers[6] as number | null,
        cravings: answers[7] as number | null,
        hunger_level: answers[8] as number | null,
        step_goal_reached: answers[9] as number | null,
        good_thing: answers[10] as string | null,
        step_count: answers[11] ? Number(answers[11]) : null,
        proud_of_yourself: answers[12] === 1 ? "Yes" : answers[12] === 0 ? "No" : answers[12] as string | null,
        photo_url: photoUrl,
      };

      // Upsert - update if exists for today, otherwise insert
      const { data, error } = await supabase
        .from("daily_logs")
        .upsert(logData, { onConflict: "user_id,log_date" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
    },
  });
};
export const useDeleteLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("daily_logs")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
    },
  });
};
