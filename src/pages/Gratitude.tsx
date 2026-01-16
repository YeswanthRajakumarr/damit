import { motion } from "framer-motion";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { GratitudeWall } from "@/components/analytics/GratitudeWall";

export default function Gratitude() {
    const { data: logs } = useDailyLogs();

    return (
        <div className="min-h-screen gradient-warm">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-8 pb-4"
            >
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                        <h1 className="text-xl font-bold text-foreground">DAMit!</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                <div className="flex items-center gap-3 px-2 mb-6">
                    <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                        <Heart className="w-6 h-6 fill-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Gratitude Wall</h2>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="px-6 pb-12">
                <GratitudeWall logs={logs} />
            </main>
        </div>
    );
}
