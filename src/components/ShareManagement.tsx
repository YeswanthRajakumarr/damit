import { useState, useEffect } from "react";
import { usePublicShare, ShareToken } from "@/hooks/usePublicShare";
import { Share2, Copy, Check, RefreshCw, X, Clock, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export const ShareManagement = () => {
    const { generateShareLink, disableSharing, getCurrentShareToken } = usePublicShare();
    const [shareToken, setShareToken] = useState<ShareToken | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expiryDays, setExpiryDays] = useState(30);

    useEffect(() => {
        loadCurrentToken();
    }, []);

    const loadCurrentToken = async () => {
        const token = await getCurrentShareToken();
        setShareToken(token);
    };

    const handleGenerate = async () => {
        setLoading(true);
        const token = await generateShareLink(expiryDays);
        if (token) {
            setShareToken(token);
            toast.success("Share link generated!");
        } else {
            toast.error("Failed to generate share link");
        }
        setLoading(false);
    };

    const handleDisable = async () => {
        if (!confirm("Are you sure you want to disable public sharing? This will invalidate your current link.")) {
            return;
        }
        setLoading(true);
        const success = await disableSharing();
        if (success) {
            setShareToken(null);
            toast.success("Public sharing disabled");
        } else {
            toast.error("Failed to disable sharing");
        }
        setLoading(false);
    };

    const handleCopy = async () => {
        if (!shareToken) return;
        const url = `${window.location.origin}/p/${shareToken.token}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const getExpiryText = () => {
        if (!shareToken?.expires_at) return "Never expires";
        const expiryDate = new Date(shareToken.expires_at);
        if (expiryDate < new Date()) return "Expired";
        return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
    };

    const isExpired = shareToken?.expires_at && new Date(shareToken.expires_at) < new Date();

    return (
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Public Sharing</h3>
                    <p className="text-sm text-muted-foreground">Share your progress with others</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {shareToken && !isExpired ? (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <LinkIcon className="w-4 h-4 text-success" />
                                        <span className="text-sm font-medium text-success">Active Share Link</span>
                                    </div>
                                    <code className="text-xs text-muted-foreground break-all block bg-muted/30 p-2 rounded mt-2">
                                        {window.location.origin}/p/{shareToken.token}
                                    </code>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {getExpiryText()}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-elevated transition-all"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            </button>
                            <button
                                onClick={handleDisable}
                                disabled={loading}
                                className="px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-all disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="inactive"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {isExpired && (
                            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-sm text-destructive">
                                Your previous share link has expired. Generate a new one to continue sharing.
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="block">
                                <span className="text-sm font-medium text-foreground mb-2 block">Link Expiry</span>
                                <select
                                    value={expiryDays}
                                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value={7}>7 days</option>
                                    <option value={30}>30 days</option>
                                    <option value={90}>90 days</option>
                                    <option value={365}>1 year</option>
                                </select>
                            </label>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-white font-bold shadow-soft hover:shadow-card transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-5 h-5" />
                                        Generate Share Link
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            Anyone with the link can view your public dashboard
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
