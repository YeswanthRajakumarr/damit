import { motion } from "framer-motion";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { GratitudeWall, GratitudeWallSkeleton } from "@/components/analytics/GratitudeWall";
import { NavBar } from "@/components/NavBar";

export default function Gratitude() {
    const { data, isLoading } = useDailyLogs();
    const logs = data?.logs;

    return (
        <div className="min-h-screen gradient-warm px-6 pt-8 pb-12 safe-bottom">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <NavBar hideGratitude backLink={{ to: "/app", label: "Back" }} />
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-foreground">Gratitude Wall</h1>
                        <p className="text-sm text-muted-foreground">All the good things in one place</p>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {isLoading ? <GratitudeWallSkeleton /> : <GratitudeWall logs={logs} />}
                </motion.div>
            </div>
        </div>
    );
}
