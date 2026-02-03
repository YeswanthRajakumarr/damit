import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft, Share2, Copy, Check, Globe, BarChart3, User, LogOut, Camera, Smile, Loader2,
    Target, TrendingUp, Trash2, Edit, Footprints, Moon, Dumbbell, GlassWater, Utensils,
    Heart, Zap, Brain, Apple, Bike, Timer, Flame, Activity, Trophy, Coffee, Book, Sparkles, Sun
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ImageCropper } from "@/components/ImageCropper";
import { GoalDialog } from "@/components/GoalDialog";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, Goal } from "@/hooks/useGoals";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ICON_MAP: Record<string, any> = {
    target: Target,
    trending: TrendingUp,
    steps: Footprints,
    sleep: Moon,
    workout: Dumbbell,
    water: GlassWater,
    diet: Utensils,
    heart: Heart,
    energy: Zap,
    mindfulness: Brain,
    nutrition: Apple,
    cardio: Bike,
    time: Timer,
    calories: Flame,
    activity: Activity,
    wellness: Smile,
    achievement: Trophy,
    habits: Coffee,
    learning: Book,
    motivation: Sparkles,
    morning: Sun,
};

export default function Profile() {
    const { user, signOut } = useAuthContext();
    const { emoji, updateEmoji, avatarUrl, uploadAvatar, removeAvatar, isUploading } = useProfileAvatar();
    const [copied, setCopied] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Goals state
    const { data: goals, isLoading: loadingGoals } = useGoals();
    const createGoal = useCreateGoal();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();
    const [goalDialogOpen, setGoalDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<Goal | undefined>(undefined);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setCropImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleAddGoal = () => {
        setEditingGoal(undefined);
        setGoalDialogOpen(true);
    };

    const handleEditGoal = (goal: Goal) => {
        setEditingGoal(goal);
        setGoalDialogOpen(true);
    };

    const handleSaveGoal = async (goalData: { title: string; target: string; icon_type: string; color: string }) => {
        try {
            if (editingGoal) {
                await updateGoal.mutateAsync({
                    id: editingGoal.id,
                    ...goalData,
                });
                toast.success("Goal updated successfully!");
            } else {
                await createGoal.mutateAsync(goalData);
                toast.success("Goal added successfully!");
            }
            setGoalDialogOpen(false);
            setEditingGoal(undefined);
        } catch (error) {
            toast.error("Failed to save goal");
        }
    };

    const handleDeleteClick = (goal: Goal) => {
        setGoalToDelete(goal);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!goalToDelete) return;

        try {
            await deleteGoal.mutateAsync(goalToDelete.id);
            toast.success("Goal deleted successfully!");
            setDeleteDialogOpen(false);
            setGoalToDelete(undefined);
        } catch (error) {
            toast.error("Failed to delete goal");
        }
    };

    return (
        <div className="min-h-screen gradient-warm">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pt-6 pb-2"
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
            <main className="px-6 pb-8 space-y-4">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="goals" className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Goals
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-0">
                        <Card className="border-border/50">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle>Profile Avatar</CardTitle>
                                        <CardDescription>
                                            Customize your appearance
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center pb-6">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />

                                <div className="relative mb-6">
                                    <div className="relative">
                                        <Avatar className="h-32 w-32 border-4 border-background shadow-soft ring-2 ring-border/20">
                                            <AvatarImage src={avatarUrl || ""} className="object-cover" />
                                            <AvatarFallback className="bg-secondary/50 text-5xl">
                                                {emoji || user?.email?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {isUploading && (
                                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        <Camera className="w-4 h-4" />
                                        {avatarUrl ? "Change Photo" : "Upload Photo"}
                                    </Button>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="gap-2" disabled={isUploading}>
                                                <Smile className="w-4 h-4" />
                                                Choose Emoji
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 border-none shadow-none bg-transparent">
                                            <EmojiPicker
                                                value={emoji}
                                                onChange={(newEmoji) => {
                                                    updateEmoji(newEmoji);
                                                    if (avatarUrl) {
                                                        removeAvatar();
                                                    }
                                                    toast.success("Emoji updated!");
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-soft backdrop-blur-sm relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Share Your Dashboard</h3>
                                </div>

                                <p className="text-muted-foreground mb-4 max-w-md">
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
                                <Share2 className="w-32 h-32 text-primary" />
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
                    </TabsContent>

                    <TabsContent value="goals" className="space-y-4 mt-0">
                        <Card className="border-border/50">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle>Your Health Goals</CardTitle>
                                        <CardDescription>
                                            Set and track your daily targets
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loadingGoals ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-20 rounded-xl bg-secondary/20 animate-pulse" />
                                        ))}
                                    </div>
                                ) : goals && goals.length > 0 ? (
                                    <div className="space-y-3">
                                        {goals.map((goal) => {
                                            const IconComponent = ICON_MAP[goal.icon_type] || Target;
                                            return (
                                                <div key={goal.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/30 group hover:bg-secondary/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg bg-${goal.color}/10`}>
                                                            <IconComponent className={`w-5 h-5 text-${goal.color}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{goal.title}</p>
                                                            <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditGoal(goal)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(goal)}
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <Target className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="text-muted-foreground mb-4">No goals yet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Start by adding your first goal to track!
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button className="w-full gap-2" onClick={handleAddGoal}>
                                        <Target className="w-4 h-4" />
                                        Add New Goal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">Track Your Progress</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set realistic goals and track them daily. Your analytics will show how you're progressing toward each target!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

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

                <GoalDialog
                    open={goalDialogOpen}
                    onClose={() => {
                        setGoalDialogOpen(false);
                        setEditingGoal(undefined);
                    }}
                    onSave={handleSaveGoal}
                    goal={editingGoal}
                    isSaving={createGoal.isPending || updateGoal.isPending}
                />

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{goalToDelete?.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteGoal.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                disabled={deleteGoal.isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deleteGoal.isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
