import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  className?: string;
  id?: string;
}

export function TimePicker({ value, onChange, className, id }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  
  // Parse time value (HH:mm format) and round minutes to nearest 5
  const parseTime = (timeStr: string) => {
    if (!timeStr) return [20, 0];
    const [h, m] = timeStr.split(":").map(Number);
    const roundedMinute = Math.round(m / 5) * 5;
    return [h, roundedMinute % 60];
  };
  
  const [hours, minutes] = parseTime(value);
  
  // Normalize time value: round minutes to nearest 5 and sync back if different
  useEffect(() => {
    if (!value) return;
    
    const [h, m] = value.split(":").map(Number);
    const roundedMinute = Math.round(m / 5) * 5;
    const normalizedTime = `${String(h).padStart(2, "0")}:${String(roundedMinute).padStart(2, "0")}`;
    
    // If the rounded value differs from the input, sync it back
    if (normalizedTime !== value) {
      onChange(normalizedTime);
    }
  }, [value, onChange]);
  
  const handleHourChange = (newHour: number) => {
    const hour24 = newHour % 24;
    const newTime = `${String(hour24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onChange(newTime);
  };

  const handleMinuteChange = (newMinute: number) => {
    const minute60 = newMinute % 60;
    const newTime = `${String(hours).padStart(2, "0")}:${String(minute60).padStart(2, "0")}`;
    onChange(newTime);
  };

  const formatDisplayTime = (h: number, m: number) => {
    const hour12 = h % 12 || 12;
    const ampm = h < 12 ? "AM" : "PM";
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const displayTime = formatDisplayTime(hours, minutes);

  // Generate hour and minute options
  const hours24 = Array.from({ length: 24 }, (_, i) => i);
  // Show minutes in 5-minute intervals for better UX
  const minutes60 = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-popover border-border" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Hour</Label>
            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
              {hours24.map((hour) => (
                <Button
                  key={hour}
                  variant={hours === hour ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleHourChange(hour)}
                  className={cn(
                    "min-w-[40px]",
                    hours === hour && "bg-primary text-primary-foreground"
                  )}
                >
                  {String(hour).padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Minute</Label>
            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto">
              {minutes60.map((minute) => (
                <Button
                  key={minute}
                  variant={minutes === minute ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMinuteChange(minute)}
                  className={cn(
                    "min-w-[40px]",
                    minutes === minute && "bg-primary text-primary-foreground"
                  )}
                >
                  {String(minute).padStart(2, "0")}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="text-sm font-medium text-foreground">
              {displayTime} ({String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")})
            </div>
            <Button
              size="sm"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
