import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Clock, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/TimePicker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function NotificationSettings() {
  const {
    permission,
    settings,
    requestPermission,
    enableNotifications,
    disableNotifications,
    updateSettings,
  } = useNotifications();

  const [timeValue, setTimeValue] = useState(settings.time);

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    updateSettings({ time: newTime });
    toast.success("Reminder time updated!");
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      await enableNotifications();
    } else {
      disableNotifications();
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <CardTitle>Daily Reminders</CardTitle>
            <CardDescription>
              Get notified to fill your daily logs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled" className="text-base">
              Enable Daily Reminders
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive a notification each day to log your accountability
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={handleToggle}
            disabled={permission === "denied"}
          />
        </div>

        {/* Permission Status */}
        {permission === "denied" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/30"
          >
            <div className="flex items-start gap-3">
              <BellOff className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">
                  Notifications are blocked
                </p>
                <p className="text-xs text-muted-foreground">
                  Please enable notifications in your browser settings to receive daily reminders.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {permission === "default" && !settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Enable notifications to get started
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Click the toggle above to request notification permission.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={requestPermission}
                  className="w-full sm:w-auto"
                >
                  Request Permission
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {permission === "granted" && settings.enabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-success/10 border border-success/30"
          >
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success mb-1">
                  Notifications enabled
                </p>
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder at the time set below.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Time Picker */}
        {settings.enabled && permission === "granted" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="reminder-time" className="text-base">
                Reminder Time
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <TimePicker
                id="reminder-time"
                value={timeValue}
                onChange={handleTimeChange}
              />
              <p className="text-sm text-muted-foreground">
                Daily reminder will be sent at this time
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
