import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEmojiAvatar } from "@/hooks/useEmojiAvatar";

export const UserMenu = () => {
    const { user } = useAuthContext();
    const { emoji } = useEmojiAvatar();

    if (!user) return null;

    const initial = user.email?.[0].toUpperCase() || "?";

    return (
        <Link
            to="/app/profile"
            className="block focus:outline-none"
            aria-label="Profile"
        >
            <Avatar className="h-9 w-9 border border-border/50 shadow-soft hover:shadow-card transition-all cursor-pointer">
                <AvatarFallback className={emoji ? "bg-secondary/50 text-2xl" : "bg-primary/10 text-primary font-bold text-lg"}>
                    {emoji || initial}
                </AvatarFallback>
            </Avatar>
        </Link>
    );
};
