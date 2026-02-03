import { Link } from "react-router-dom";
import { BarChart3, Heart, Table2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";

interface NavBarProps {
    /** Hide the "Past DAMs" button (useful on the logs page itself) */
    hidePastDAMs?: boolean;
    /** Hide analytics button (useful on analytics page) */
    hideAnalytics?: boolean;
    /** Hide gratitude button (useful on gratitude page) */
    hideGratitude?: boolean;
    /** Custom back link instead of showing logo */
    backLink?: {
        to: string;
        label: string;
    };
}

export function NavBar({ hidePastDAMs, hideAnalytics, hideGratitude, backLink }: NavBarProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            {backLink ? (
                <Link
                    to={backLink.to}
                    className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                    <span>← {backLink.label}</span>
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                    <h1 className="text-xl font-bold text-foreground hidden sm:inline">DAMit!</h1>
                </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
                {!hideAnalytics && (
                    <Link
                        to="/app/analytics"
                        className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        aria-label="Analytics"
                        title="Analytics"
                    >
                        <BarChart3 className="w-5 h-5 text-foreground" />
                    </Link>
                )}

                {!hideGratitude && (
                    <Link
                        to="/app/gratitude"
                        className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                        aria-label="Gratitude Wall"
                        title="Gratitude Wall"
                    >
                        <Heart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </Link>
                )}

                <ThemeToggle />
                <NotificationBell />

                {!hidePastDAMs && (
                    <Link
                        to="/app/logs"
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium
                       bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all 
                       shadow-soft border border-border/50"
                        data-testid="nav-logs"
                        title="Past DAMs"
                    >
                        <Table2 className="w-5 h-5" />
                        <span className="hidden lg:inline">Past DAMs</span>
                    </Link>
                )}

                <UserMenu />
            </div>
        </div>
    );
}
