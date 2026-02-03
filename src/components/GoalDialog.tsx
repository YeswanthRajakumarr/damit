import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Target, TrendingUp, Footprints, Moon, Dumbbell, GlassWater, Utensils,
    Heart, Zap, Brain, Apple, Bike, Timer, Flame,
    Activity, Smile, Trophy, Coffee, Book, Sparkles, Sun
} from "lucide-react";
import { Goal } from "@/hooks/useGoals";

interface GoalDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (goal: { title: string; target: string; icon_type: string; color: string }) => void;
    goal?: Goal;
    isSaving?: boolean;
}

const ICON_OPTIONS = [
    { value: "target", label: "Target", icon: Target, color: "text-primary" },
    { value: "trending", label: "Trending", icon: TrendingUp, color: "text-success" },
    { value: "steps", label: "Steps", icon: Footprints, color: "text-teal-500" },
    { value: "sleep", label: "Sleep", icon: Moon, color: "text-indigo-500" },
    { value: "workout", label: "Workout", icon: Dumbbell, color: "text-blue-500" },
    { value: "water", label: "Water", icon: GlassWater, color: "text-cyan-500" },
    { value: "diet", label: "Diet", icon: Utensils, color: "text-emerald-500" },
    { value: "heart", label: "Heart", icon: Heart, color: "text-rose-500" },
    { value: "energy", label: "Energy", icon: Zap, color: "text-yellow-500" },
    { value: "mindfulness", label: "Mind", icon: Brain, color: "text-purple-500" },
    { value: "nutrition", label: "Nutrition", icon: Apple, color: "text-green-500" },
    { value: "cardio", label: "Cardio", icon: Bike, color: "text-orange-500" },
    { value: "time", label: "Timer", icon: Timer, color: "text-slate-500" },
    { value: "calories", label: "Calories", icon: Flame, color: "text-red-500" },
    { value: "activity", label: "Activity", icon: Activity, color: "text-pink-500" },
    { value: "wellness", label: "Wellness", icon: Smile, color: "text-amber-500" },
    { value: "achievement", label: "Trophy", icon: Trophy, color: "text-yellow-600" },
    { value: "habits", label: "Habits", icon: Coffee, color: "text-brown-500" },
    { value: "learning", label: "Learning", icon: Book, color: "text-blue-600" },
    { value: "motivation", label: "Sparkle", icon: Sparkles, color: "text-violet-500" },
    { value: "morning", label: "Morning", icon: Sun, color: "text-orange-400" },
];

const COLOR_OPTIONS = [
    { value: "primary", label: "Primary", class: "bg-primary" },
    { value: "success", label: "Green", class: "bg-success" },
    { value: "amber-500", label: "Amber", class: "bg-amber-500" },
    { value: "blue-500", label: "Blue", class: "bg-blue-500" },
    { value: "purple-500", label: "Purple", class: "bg-purple-500" },
    { value: "rose-500", label: "Rose", class: "bg-rose-500" },
    { value: "cyan-500", label: "Cyan", class: "bg-cyan-500" },
    { value: "indigo-500", label: "Indigo", class: "bg-indigo-500" },
];

export function GoalDialog({ open, onClose, onSave, goal, isSaving }: GoalDialogProps) {
    const [title, setTitle] = useState(goal?.title || "");
    const [target, setTarget] = useState(goal?.target || "");
    const [selectedIcon, setSelectedIcon] = useState(goal?.icon_type || "target");
    const [selectedColor, setSelectedColor] = useState(goal?.color || "primary");

    const handleSave = () => {
        if (!title.trim() || !target.trim()) return;

        onSave({
            title: title.trim(),
            target: target.trim(),
            icon_type: selectedIcon,
            color: selectedColor,
        });
    };

    const handleClose = () => {
        if (!isSaving) {
            setTitle("");
            setTarget("");
            setSelectedIcon("target");
            setSelectedColor("primary");
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
                    <DialogDescription>
                        {goal ? "Update your goal details" : "Create a new goal to track your progress"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Goal Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Daily Step Goal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target">Target</Label>
                        <Input
                            id="target"
                            placeholder="e.g., 10,000 steps per day"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            disabled={isSaving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="grid grid-cols-7 gap-2 max-h-[280px] overflow-y-auto">
                            {ICON_OPTIONS.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSelectedIcon(option.value)}
                                        disabled={isSaving}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedIcon === option.value
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <IconComponent className={`w-5 h-5 mx-auto ${option.color}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="grid grid-cols-8 gap-2">
                            {COLOR_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setSelectedColor(option.value)}
                                    disabled={isSaving}
                                    className={`w-10 h-10 rounded-lg ${option.class} transition-all ${selectedColor === option.value
                                        ? "ring-2 ring-offset-2 ring-foreground"
                                        : "hover:ring-2 hover:ring-offset-2 hover:ring-foreground/50"
                                        }`}
                                    title={option.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!title.trim() || !target.trim() || isSaving}
                    >
                        {isSaving ? "Saving..." : goal ? "Update Goal" : "Add Goal"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
