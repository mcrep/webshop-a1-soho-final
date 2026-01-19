import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusNotificationProps = {
  message: string;
  isComplete: boolean;
};

export function StatusNotification({ message, isComplete }: StatusNotificationProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border-l-4 bg-muted/50 px-4 py-3 text-sm text-foreground",
        isComplete
          ? "border-l-emerald-500 dark:border-l-emerald-400"
          : "border-l-orange-500 dark:border-l-orange-400"
      )}
    >
      {isComplete ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-400" />
      )}
      <span>{message}</span>
    </div>
  );
}
