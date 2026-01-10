import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  good_thing: string | null;
  step_count: number | null;
  proud_of_yourself: string | null;
  created_at: string;
  updated_at: string;
}

export const useDailyLogs = () => {
  return useQuery({
    queryKey: ["daily-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .order("log_date", { ascending: false });

      if (error) throw error;
      return data as DailyLog[];
    },
  });
};

export const useSaveDailyLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answers: Record<number, string | number | null>) => {
      const today = new Date().toISOString().split("T")[0];

      const logData = {
        log_date: today,
        diet: answers[1] as number | null,
        energy_level: answers[2] as number | null,
        stress_fatigue: answers[3] as number | null,
        workout: answers[4] as number | null,
        water_intake: answers[5] as number | null,
        sleep_last_night: answers[6] as number | null,
        cravings: answers[7] as number | null,
        hunger_level: answers[8] as number | null,
        good_thing: answers[9] as string | null,
        step_count: answers[10] ? Number(answers[10]) : null,
        proud_of_yourself: answers[11] as string | null,
      };

      // Upsert - update if exists for today, otherwise insert
      const { data, error } = await supabase
        .from("daily_logs")
        .upsert(logData, { onConflict: "log_date" })
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
