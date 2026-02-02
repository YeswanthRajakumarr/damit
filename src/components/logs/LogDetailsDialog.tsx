import { format } from "date-fns";
import { TrendingUp, Activity, Heart, Quote } from "lucide-react";
import { DailyLog } from "@/hooks/useDailyLogs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface LogDetailsDialogProps {
    selectedLog: DailyLog | null;
    onClose: () => void;
}

const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    if (value >= 1) return "Excellent";
    if (value >= 0.5) return "Good";
    if (value >= 0 || value === 0.25) return "Fair";
    return "Poor";
};

const getValueColor = (value: number | null): string => {
    if (value === null) return "text-muted-foreground";
    if (value >= 1) return "text-primary";
    if (value >= 0.5) return "text-success";
    if (value >= 0 || value === 0.25) return "text-warning";
    return "text-destructive";
};

export function LogDetailsDialog({ selectedLog, onClose }: LogDetailsDialogProps) {
    return (
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-none shadow-elevated">
                {selectedLog && (
                    <div className="flex flex-col">
                        <div className="relative h-24 gradient-primary flex items-center px-8">
                            <DialogHeader>
                                <div className="flex items-baseline gap-2">
                                    <DialogTitle className="text-2xl font-bold text-white">
                                        {format(new Date(selectedLog.log_date), "EEEE")}
                                    </DialogTitle>
                                    <span className="text-white/80 font-medium">
                                        {format(new Date(selectedLog.log_date), "MMM d, yyyy")}
                                    </span>
                                </div>
                            </DialogHeader>
                        </div>

                        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto gradient-warm">
                            {/* Scores Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Diet", val: selectedLog.diet, icon: TrendingUp },
                                    { label: "Energy", val: selectedLog.energy_level, icon: Activity },
                                    { label: "Stress", val: selectedLog.stress_fatigue, icon: Activity },
                                    { label: "Workout", val: selectedLog.workout, icon: Heart },
                                    { label: "Water", val: selectedLog.water_intake, icon: Activity },
                                    { label: "Are you proud?", val: selectedLog.proud_of_yourself, icon: Heart }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-card/50 p-2.5 rounded-2xl border border-border/50 text-center">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 leading-tight">
                                            {item.label}
                                        </p>
                                        <p className={`text-[11px] font-bold ${getValueColor(Number(item.val))}`}>
                                            {item.label === "Are you proud?"
                                                ? (["1", "yes", "true", "yeah"].includes(String(item.val).toLowerCase()) ? 'Yes' : 'No')
                                                : formatValue(Number(item.val))}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Steps Card */}
                            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-soft flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Daily Movement</p>
                                        <p className="text-lg font-bold">{selectedLog.step_count?.toLocaleString() || "0"} Steps</p>
                                    </div>
                                </div>
                                {selectedLog.step_goal_reached && (
                                    <span className="px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                                        GOAL MET
                                    </span>
                                )}
                            </div>

                            {/* Good Thing Quote & Image */}
                            <div className="bg-primary/5 rounded-2xl overflow-hidden border border-primary/10">
                                {selectedLog.photo_url && (
                                    <div className="w-full aspect-video border-b border-primary/10">
                                        <img
                                            src={selectedLog.photo_url}
                                            alt="Daily moment"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6 relative">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10" />
                                    <div className="relative z-10">
                                        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">One Good Thing</p>
                                        <p className="text-foreground leading-relaxed italic font-serif text-lg">
                                            "{selectedLog.good_thing || "Today was a day of focus and growth."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
