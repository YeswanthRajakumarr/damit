import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Goal {
    id: string;
    user_id: string;
    title: string;
    target: string;
    icon_type: string;
    color: string;
    created_at: string;
    updated_at: string;
}

export interface CreateGoalParams {
    title: string;
    target: string;
    icon_type: string;
    color: string;
}

export interface UpdateGoalParams {
    id: string;
    title: string;
    target: string;
    icon_type: string;
    color: string;
}

export const useGoals = () => {
    return useQuery({
        queryKey: ["goals"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("goals")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true });

            if (error) throw error;
            return data as Goal[];
        },
    });
};

export const useCreateGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: CreateGoalParams) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("goals")
                .insert({
                    user_id: user.id,
                    title: params.title,
                    target: params.target,
                    icon_type: params.icon_type,
                    color: params.color,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
};

export const useUpdateGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: UpdateGoalParams) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("goals")
                .update({
                    title: params.title,
                    target: params.target,
                    icon_type: params.icon_type,
                    color: params.color,
                })
                .eq("id", params.id)
                .eq("user_id", user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
};

export const useDeleteGoal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("goals")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["goals"] });
        },
    });
};
