import { Progress } from "@/components/ui/progress";
import { Wallet } from "lucide-react";

type WalletBannerProps = {
  total: number;
  used: number;
  remaining: number;
};

export function WalletBanner({ total, used, remaining }: WalletBannerProps) {
  const progressValue = total > 0 ? (used / total) * 100 : 0;
  const percentageUsed = total > 0 ? Math.round((used / total) * 100) : 0;

  // Conditional styling based on remaining amount
  const getProgressColor = () => {
    const remainingPercentage = (remaining / total) * 100;
    if (remainingPercentage < 10) return "bg-destructive";
    if (remainingPercentage < 30) return "bg-orange-500";
    return "bg-primary";
  };

  const getRemainingTextColor = () => {
    const remainingPercentage = (remaining / total) * 100;
    if (remainingPercentage < 10) return "text-destructive";
    if (remainingPercentage < 30) return "text-orange-500";
    return "text-primary";
  };

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-border rounded-xl p-4 mb-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Left: Icon + Total */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">A1 Wallet</div>
            <div className="text-xl font-bold text-primary">€{total.toFixed(2)}</div>
          </div>
        </div>

        {/* Center: Usage info */}
        <div className="flex gap-6 text-sm flex-shrink-0">
          <div>
            <span className="text-muted-foreground">Iskorišteno: </span>
            <span className="font-semibold">€{used.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Preostalo: </span>
            <span className={`font-bold ${getRemainingTextColor()}`}>
              €{remaining.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right: Progress bar */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
            <Progress 
              value={progressValue} 
              className="h-3 flex-1"
            />
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {percentageUsed}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
