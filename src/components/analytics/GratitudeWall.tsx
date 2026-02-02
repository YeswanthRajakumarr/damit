import { motion, AnimatePresence } from "framer-motion";
import { DailyLog } from "@/hooks/useDailyLogs";
import { format, parseISO } from "date-fns";
import { Heart, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface GratitudeWallProps {
    logs: DailyLog[] | undefined;
}

export const GratitudeWallSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-soft">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const GratitudeWall = ({ logs }: GratitudeWallProps) => {
    // Show logs that have either a photo OR gratitude text
    const gratitudeLogs = logs?.filter(log =>
        (log.good_thing && log.good_thing.trim() !== "") || log.photo_url
    ) || [];
    const [selectedImage, setSelectedImage] = useState<{ url: string; log: DailyLog } | null>(null);

    if (gratitudeLogs.length === 0) return null;

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                    <Heart className="w-5 h-5 text-destructive fill-destructive" />
                    <h3 className="text-xl font-bold text-foreground">Gratitude Wall</h3>
                    <span className="text-sm text-muted-foreground">({gratitudeLogs.length} moments)</span>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {gratitudeLogs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="break-inside-avoid"
                        >
                            <div className="rounded-2xl bg-card border border-border/50 shadow-soft overflow-hidden group hover:shadow-lg transition-all">
                                {log.photo_url && (
                                    <div
                                        className="relative overflow-hidden aspect-auto cursor-pointer"
                                        onClick={() => setSelectedImage({ url: log.photo_url!, log })}
                                    >
                                        <img
                                            src={log.photo_url}
                                            alt={`Photo from ${format(parseISO(log.log_date), "MMMM d")}`}
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Heart className="w-4 h-4 text-destructive fill-destructive" />
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            {format(parseISO(log.log_date), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                    {log.good_thing && log.good_thing.trim() !== "" && (
                                        <p className="text-sm text-foreground italic leading-relaxed">
                                            "{log.good_thing}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Image Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt="Full size"
                                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            />
                            <div className="mt-4 text-center text-white">
                                <p className="text-sm font-medium mb-2">
                                    {format(parseISO(selectedImage.log.log_date), "EEEE, MMMM d, yyyy")}
                                </p>
                                {selectedImage.log.good_thing && selectedImage.log.good_thing.trim() !== "" && (
                                    <p className="text-lg italic">
                                        "{selectedImage.log.good_thing}"
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
