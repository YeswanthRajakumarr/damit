import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Copy, Check, Globe, BarChart3, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { EmojiPicker } from "@/components/EmojiPicker";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ImageCropper } from "@/components/ImageCropper";

export default function Profile() {
    const { user, signOut } = useAuthContext();
    const { emoji, updateEmoji, avatarUrl, uploadAvatar, removeAvatar, isUploading } = useProfileAvatar();
    const [copied, setCopied] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);

    const handleShare = async () => {
        if (!user) return;

        const shareUrl = `${window.location.protocol}//${window.location.host}/p/${user.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Public link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };
    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error("Failed to logout");
        } else {
            toast.success("Logged out successfully");
        }
    };


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
                        to="/app"
                        className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                        <h1 className="text-xl font-bold text-foreground hidden sm:inline">DAMit!</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/app/analytics"
                            className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                            aria-label="Analytics"
                            title="Analytics"
                        >
                            <BarChart3 className="w-5 h-5 text-foreground" />
                        </Link>
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground px-2 mb-6">Profile</h2>
            </motion.header>

            {/* Main Content */}
            <main className="px-6 pb-8 space-y-6">
                <Card className="border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Profile Avatar</CardTitle>
                                <CardDescription>
                                    Choose an emoji or upload a photo
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={avatarUrl ? "image" : "emoji"} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="emoji">Emoji</TabsTrigger>
                                <TabsTrigger value="image">Photo</TabsTrigger>
                            </TabsList>
                            <TabsContent value="emoji" className="space-y-4">
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <Avatar className="h-24 w-24 border-2 border-border shadow-soft">
                                        <AvatarFallback className="bg-secondary/50 text-4xl">
                                            {emoji || user?.email?.[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm text-muted-foreground text-center">
                                        Select an emoji from below to use as your avatar
                                    </p>
                                </div>
                                <EmojiPicker value={emoji} onChange={(newEmoji) => {
                                    updateEmoji(newEmoji);
                                    if (avatarUrl) {
                                        removeAvatar();
                                    }
                                    toast.success("Avatar updated!");
                                }} />
                            </TabsContent>
                            <TabsContent value="image" className="space-y-4">
                                <div className="flex flex-col items-center gap-4 py-4">
                                    <Avatar className="h-24 w-24 border-2 border-border shadow-soft">
                                        <AvatarImage src={avatarUrl || ""} className="object-cover" />
                                        <AvatarFallback className="bg-secondary/50 text-4xl">
                                            {user?.email?.[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="w-full max-w-sm">
                                        <ImageUpload
                                            onImageSelect={(file) => {
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setCropImage(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    // Handle removal via ImageUpload component if it supports it
                                                    // But ImageUpload usually just selects file. 
                                                    // We might need a button to remove existing image if we are in this tab
                                                    removeAvatar();
                                                }
                                            }}
                                            existingImageUrl={avatarUrl}
                                        />
                                        {isUploading && (
                                            <p className="text-sm text-center text-muted-foreground mt-2 animate-pulse">
                                                Uploading...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-soft backdrop-blur-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Share Your Dashboard</h3>
                        </div>

                        <p className="text-muted-foreground mb-8 max-w-md">
                            Copy your permanent public link to share your analytics and health trends with friends, coaches, or your community.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold shadow-soft hover:shadow-card transition-all"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? "Link Copied!" : "Copy Public Link"}
                            </button>

                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-secondary/30 rounded-xl border border-border/30">
                                <Globe className="w-3 h-3" />
                                <span>This link is permanent and works anytime</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Share2 className="w-48 h-48 text-primary" />
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Log out
                    </button>
                </div>

                <ImageCropper
                    imageSrc={cropImage}
                    open={!!cropImage}
                    onCancel={() => setCropImage(null)}
                    onCropComplete={(blob) => {
                        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
                        uploadAvatar(file);
                        setCropImage(null);
                    }}
                />
            </main>
        </div>
    );
}
