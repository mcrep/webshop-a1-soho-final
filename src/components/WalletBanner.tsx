import { Wallet } from "lucide-react";

type WalletBannerProps = {
  total: number;
  used: number;
  remaining: number;
};

export function WalletBanner({ total, used, remaining }: WalletBannerProps) {
  // Conditional styling based on remaining amount
  const getRemainingTextColor = () => {
    const remainingPercentage = (remaining / total) * 100;
    if (remainingPercentage < 10) return "text-destructive";
    if (remainingPercentage < 30) return "text-orange-500";
    return "text-primary";
  };

  return (
    <div 
      className="border-l border-r border-b border-border -mt-px rounded-b-2xl sticky top-[73px] z-40"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, #fff1f1 100%)'
      }}
    >
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

          {/* Right: Usage info */}
          <div className="flex flex-col gap-1 text-sm">
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
        </div>
      </div>
    </div>
  );
}
