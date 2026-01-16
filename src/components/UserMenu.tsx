import { LogOut, User as UserIcon, TrendingUp, Heart } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEmojiAvatar } from "@/hooks/useEmojiAvatar";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserMenu = () => {
    const { user, signOut } = useAuthContext();
    const { emoji } = useEmojiAvatar();

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error("Failed to logout");
        } else {
            toast.success("Logged out successfully");
        }
    };

    if (!user) return null;

    const initial = user.email?.[0].toUpperCase() || "?";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 border border-border/50 shadow-soft hover:shadow-card transition-all">
                        <AvatarFallback className={emoji ? "bg-secondary/50 text-2xl" : "bg-primary/10 text-primary font-bold text-lg"}>
                            {emoji || initial}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <Link to="/profile" className="text-sm font-medium leading-none text-foreground hover:underline">
                            Profile
                        </Link>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/analytics" className="cursor-pointer">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/gratitude" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4 text-destructive" />
                        <span>Gratitude Wall</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
