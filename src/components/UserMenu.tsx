import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";

export const UserMenu = () => {
    const { user } = useAuthContext();
    const { emoji, avatarUrl } = useProfileAvatar();

    if (!user) return null;

    const initial = user.email?.[0].toUpperCase() || "?";

    return (
        <Link
            to="/app/profile"
            className="block focus:outline-none"
            aria-label="Profile"
        >
            <Avatar className="h-9 w-9 border border-border/50 shadow-soft hover:shadow-card transition-all cursor-pointer">
                <AvatarImage src={avatarUrl || ""} className="object-cover" />
                <AvatarFallback className={emoji ? "bg-secondary/50 text-2xl" : "bg-primary/10 text-primary font-bold text-lg"}>
                    {emoji || initial}
                </AvatarFallback>
            </Avatar>
        </Link>
    );
};
