import { Wallet, Gift, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCountAnimation } from "@/hooks/use-count-animation";

type WalletBannerProps = {
  total: number;
  used: number;
  remaining: number;
  showDetails?: boolean;
  tariffCredit?: number;
  noDeviceBonus?: number;
  linesWithoutDevices?: number;
};

export function WalletBanner({ 
  total, 
  used, 
  remaining, 
  showDetails = true,
  tariffCredit = 0,
  noDeviceBonus = 0,
  linesWithoutDevices = 0
}: WalletBannerProps) {
  // Animate wallet remaining whenever it changes
  const { value: animatedRemaining, isAnimating, direction } = useCountAnimation({
    value: remaining,
    duration: 600,
    enabled: true,
  });

  // Conditional styling based on remaining amount and animation direction
  const getAnimationColor = () => {
    if (isAnimating && direction === "up") return "text-green-600";
    if (isAnimating && direction === "down") return "text-destructive";
    return getRemainingTextColor();
  };

  const getRemainingTextColor = () => {
    const remainingPercentage = (remaining / total) * 100;
    if (remainingPercentage < 10) return "text-destructive";
    if (remainingPercentage < 30) return "text-orange-500";
    return "text-primary";
  };

  const remainingPercentage = total > 0 ? (animatedRemaining / total) * 100 : 0;

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
                <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${isAnimating ? "animate-pulse" : ""}`}>
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">A1 Wallet dostupno</div>
                  <div className={`text-xl font-bold ${getAnimationColor()} transition-colors`}>
                    €{animatedRemaining.toFixed(2)}
                    {isAnimating && direction === "up" && (
                      <TrendingUp className="inline-block w-4 h-4 ml-1 text-green-500 animate-pulse" />
                    )}
                    {isAnimating && direction === "down" && (
                      <TrendingDown className="inline-block w-4 h-4 ml-1 text-destructive animate-pulse" />
                    )}
                  </div>
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

            {/* Bonus explanation row */}
            {showDetails && linesWithoutDevices > 0 && (
              <div className="flex items-start gap-2 pt-3 border-t border-border/50">
                <Gift className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground text-left">
                  Svaka linija bez uređaja donosi dodatni bonus u A1 Wallet. Iznos bonusa ovisi o odabranoj tarifi – veća tarifa znači veći bonus! Trenutno imate {linesWithoutDevices} linija bez uređaja koje vam donose ukupno €{noDeviceBonus.toFixed(2)} bonusa.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Icon + Remaining (Available) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${isAnimating ? "animate-pulse" : ""}`}>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">A1 Wallet dostupno</div>
                <div className={`text-xl font-bold ${getAnimationColor()}`}>
                  €{animatedRemaining.toFixed(2)}
                  {isAnimating && direction === "up" && (
                    <TrendingUp className="inline-block w-4 h-4 ml-1 text-green-500 animate-pulse" />
                  )}
                  {isAnimating && direction === "down" && (
                    <TrendingDown className="inline-block w-4 h-4 ml-1 text-destructive animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
