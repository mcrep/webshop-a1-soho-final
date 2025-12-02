import { Wallet, Gift, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type WalletBannerProps = {
  total: number;
  used: number;
  remaining: number;
  showDetails?: boolean;
  tariffCredit?: number;
  noDeviceBonus?: number;
};

export function WalletBanner({ 
  total, 
  used, 
  remaining, 
  showDetails = true,
  tariffCredit = 0,
  noDeviceBonus = 0
}: WalletBannerProps) {
  // Conditional styling based on remaining amount
  const getRemainingTextColor = () => {
    const remainingPercentage = (remaining / total) * 100;
    if (remainingPercentage < 10) return "text-destructive";
    if (remainingPercentage < 30) return "text-orange-500";
    return "text-primary";
  };

  const remainingPercentage = total > 0 ? (remaining / total) * 100 : 0;
  const showBreakdown = showDetails && (tariffCredit > 0 || noDeviceBonus > 0);

  return (
    <div 
      className="border-l border-r border-b border-border -mt-px rounded-b-2xl sticky top-[73px] z-40"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, #fff1f1 100%)'
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        {showDetails ? (
          <div className="flex flex-col gap-4">
            {/* Main row */}
            <div className="flex items-center gap-6">
              {/* Left: Icon + Remaining (Available) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">A1 Wallet dostupno</div>
                  <div className={`text-xl font-bold ${getRemainingTextColor()}`}>€{remaining.toFixed(2)}</div>
                </div>
              </div>

              {/* Center: Progress bar */}
              <div className="flex-1">
                <Progress value={remainingPercentage} className="h-3" />
              </div>

              {/* Right: Used amount */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div>
                  <div className="text-xs text-muted-foreground">A1 Wallet iskorišteno</div>
                  <div className="text-xl font-bold text-muted-foreground">€{used.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Breakdown row */}
            {showBreakdown && (
              <div className="flex flex-col gap-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tarife:</span>
                    <span className="font-semibold">€{tariffCredit.toFixed(2)}</span>
                  </div>
                  <span className="text-muted-foreground">+</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-muted-foreground">Bonus bez uređaja:</span>
                    <span className="font-semibold text-green-600">€{noDeviceBonus.toFixed(2)}</span>
                  </div>
                  <span className="text-muted-foreground">=</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Ukupno:</span>
                    <span className="font-bold text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Svaka linija bez uređaja donosi dodatni bonus u A1 Wallet. Iznos bonusa ovisi o odabranoj tarifi – veća tarifa znači veći bonus!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Icon + Remaining (Available) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">A1 Wallet dostupno</div>
                <div className={`text-xl font-bold ${getRemainingTextColor()}`}>€{remaining.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
