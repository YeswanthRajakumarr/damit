import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useLogStats } from "./useLogStats";
import { DailyLog } from "@/hooks/useDailyLogs";

const createMockLog = (overrides: Partial<DailyLog> = {}): DailyLog => ({
    id: Math.random().toString(),
    log_date: new Date().toISOString(),
    diet: 1,
    energy_level: 1,
    stress_fatigue: 1,
    workout: 1,
    water_intake: 1,
    sleep_last_night: 1,
    cravings: 1,
    hunger_level: 1,
    step_count: 10000,
    step_goal_reached: 1,
    good_thing: "Everything is fine",
    proud_of_yourself: "yes",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
});

describe("useLogStats", () => {
    it("should return null if logs are undefined", () => {
        const { result } = renderHook(() => useLogStats(undefined));
        expect(result.current).toBeNull();
    });

    it("should return null if logs are empty", () => {
        const { result } = renderHook(() => useLogStats([]));
        expect(result.current).toBeNull();
    });

    it("should calculate correct stats for 7 logs", () => {
        const logs = [
            createMockLog({ diet: 1, step_count: 10000, proud_of_yourself: "yes", log_date: "2024-03-07T12:00:00Z" }),
            createMockLog({ diet: 0.5, step_count: 5000, proud_of_yourself: "no", log_date: "2024-03-06T12:00:00Z" }),
            createMockLog({ diet: 0.25, step_count: 2000, proud_of_yourself: "yes", log_date: "2024-03-05T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 15000, proud_of_yourself: "yes", log_date: "2024-03-04T12:00:00Z" }),
            createMockLog({ diet: 0, step_count: 0, proud_of_yourself: "no", log_date: "2024-03-03T12:00:00Z" }),
            createMockLog({ diet: 0.5, step_count: 8000, proud_of_yourself: "1", log_date: "2024-03-02T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 12000, proud_of_yourself: "yeah", log_date: "2024-03-01T12:00:00Z" }),
        ];

        const { result } = renderHook(() => useLogStats(logs));

        // avgDiet: (1 + 0.5 + 0.25 + 1 + 0 + 0.5 + 1) / 7 = 4.25 / 7 = 0.607... -> 61/100
        expect(result.current?.avgDiet).toBe(61);

        // totalSteps: 10k + 5k + 2k + 15k + 0 + 8k + 12k = 52,000
        expect(result.current?.totalSteps).toBe("52,000");

        // mindsetRate: (yes, yes, yes, 1, yeah) = 5/7 = 71.4... -> 71
        expect(result.current?.mindsetRate).toBe(71);
    });

    it("should calculate for less than 7 logs", () => {
        const logs = [
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes" }),
            createMockLog({ diet: 0, step_count: 0, proud_of_yourself: "no" }),
        ];
        const { result } = renderHook(() => useLogStats(logs));
        // avgDiet: (1 + 0) / 2 = 0.5 -> 50/100
        expect(result.current?.avgDiet).toBe(50);
        expect(result.current?.totalSteps).toBe("1,000");
        expect(result.current?.mindsetRate).toBe(50);
    });

    it("should handle mixed mindset ratings correctly", () => {
        const logs = [
            createMockLog({ proud_of_yourself: "yes" }),
            createMockLog({ proud_of_yourself: "yeah" }),
            createMockLog({ proud_of_yourself: "1" }),
            createMockLog({ proud_of_yourself: "no" }),
            createMockLog({ proud_of_yourself: "0" }),
            createMockLog({ proud_of_yourself: "" }),
            createMockLog({ proud_of_yourself: null as any }),
        ];
        const { result } = renderHook(() => useLogStats(logs));
        // 3 out of 7 are "yes" equivalents
        expect(result.current?.mindsetRate).toBe(Math.round((3 / 7) * 100));
    });

    it("should handle null fields in logs gracefully", () => {
        const logs = [
            createMockLog({ diet: null, step_count: null, proud_of_yourself: null as any }),
        ];
        const { result } = renderHook(() => useLogStats(logs));
        // avgDiet: 0 -> 0/100
        expect(result.current?.avgDiet).toBe(0);
        expect(result.current?.totalSteps).toBe("0");
        expect(result.current?.mindsetRate).toBe(0);
    });

    it("should only take the most recent 7 logs regardless of input order", () => {
        const logs = [
            createMockLog({ step_count: 1000, log_date: "2024-03-01T12:00:00Z" }), // Oldest
            createMockLog({ step_count: 10, log_date: "2024-03-02T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-03T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-04T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-05T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-06T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-07T12:00:00Z" }),
            createMockLog({ step_count: 10, log_date: "2024-03-08T12:00:00Z" }), // Newest
        ];
        // Recent 7 should have 7 * 10 = 70 steps, ignore the 1000.
        const { result } = renderHook(() => useLogStats(logs));
        expect(result.current?.totalSteps).toBe("70");
    });

    it("should only take the most recent 7 logs", () => {
        // 8 logs, first one is oldest and should be ignored
        const logs = [
            createMockLog({ diet: 0, step_count: 0, proud_of_yourself: "no", log_date: "2024-03-01T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-02T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-03T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-04T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-05T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-06T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-07T12:00:00Z" }),
            createMockLog({ diet: 1, step_count: 1000, proud_of_yourself: "yes", log_date: "2024-03-08T12:00:00Z" }),
        ];

        const { result } = renderHook(() => useLogStats(logs));

        // If it took all 8: totalSteps would be 7000? No, 8000.
        // If it took recent 7: totalSteps is 7000.
        expect(result.current?.totalSteps).toBe("7,000");
    });
});
