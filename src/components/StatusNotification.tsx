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
        "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm",
        isComplete
          ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300"
          : "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300"
      )}
    >
      {isComplete ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
      ) : (
        <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
      )}
      <span>{message}</span>
    </div>
  );
}
