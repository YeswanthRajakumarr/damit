import { useState } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

// Popular emoji categories for avatar selection
const EMOJI_CATEGORIES = {
  "😊 Happy": ["😊", "😄", "😃", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😋", "😎"],
  "😍 Love": ["😍", "🥰", "😘", "😗", "😙", "😚", "❤️", "💕", "💖", "💗", "💓", "💝"],
  "😎 Cool": ["😎", "🤩", "🥳", "😏", "😌", "😊", "🤗", "🤔", "😴", "🤤", "😪", "😵"],
  "🎭 Fun": ["🤡", "🥸", "😈", "👹", "👺", "🤖", "👽", "👻", "💀", "☠️", "👾", "🤠"],
  "🌍 Nature": ["🌞", "🌝", "🌚", "🌛", "🌜", "🌙", "⭐", "🌟", "💫", "✨", "🔥", "💥"],
  "🎨 Creative": ["🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎵", "🎶", "🎸", "🎹", "🎺", "🎻"],
  "🏆 Achievement": ["🏆", "🥇", "🥈", "🥉", "🎖️", "🏅", "🎗️", "🎫", "🎟️", "🎪", "🎭", "🎨"],
  "💪 Strength": ["💪", "👊", "✊", "🤛", "🤜", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆"],
};

export function EmojiPicker({ value, onChange, className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-auto py-3",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-3">
            {value ? (
              <span className="text-3xl">{value}</span>
            ) : (
              <Smile className="h-5 w-5 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Avatar Emoji</div>
              <div className="text-xs text-muted-foreground">
                {value ? "Click to change" : "Select an emoji"}
              </div>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category} className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {category}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className={cn(
                      "text-2xl p-2 rounded-lg hover:bg-secondary transition-colors",
                      value === emoji && "bg-primary/10 ring-2 ring-primary"
                    )}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full"
            >
              Clear Avatar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
