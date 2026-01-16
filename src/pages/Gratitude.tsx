import { motion } from "framer-motion";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { GratitudeWall, GratitudeWallSkeleton } from "@/components/analytics/GratitudeWall";

export default function Gratitude() {
    const { data, isLoading } = useDailyLogs();
    const logs = data?.logs;

    return (
        <div className="min-h-screen gradient-warm px-6 pt-8 pb-12 safe-bottom">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="p-2 rounded-xl bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-all border border-border/50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Gratitude Wall</h1>
                            <p className="text-sm text-muted-foreground">All the good things in one place</p>
                        </div>
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
