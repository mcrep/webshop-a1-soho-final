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
  selectedLines?: number;
  maxLines?: number;
};

export function WalletBanner({ 
  total, 
  used, 
  remaining, 
  showDetails = true,
  tariffCredit = 0,
  noDeviceBonus = 0,
  linesWithoutDevices = 0,
  selectedLines = 0,
  maxLines = 0
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
      className="border-l border-r border-b border-border rounded-b-2xl sticky top-[57px] z-40"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, #fff1f1 100%)'
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4">
          {/* Header row with icon and title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-[#A8C6FF]/30 flex items-center justify-center ${isAnimating ? "animate-pulse" : ""}`}>
              <Wallet className="w-5 h-5" style={{ color: '#3F1EE2' }} />
            </div>
            <h2 className="text-xl font-bold text-foreground">A1 Wallet</h2>
          </div>

          {/* Amounts + progress in the same row */}
          <div className="flex items-center gap-6">
            {/* Left: Available amount */}
            <div className="min-w-[180px] flex-shrink-0">
              <div className="text-sm text-muted-foreground mb-1">Dostupan iznos</div>
              <div className={`text-2xl font-bold ${getAnimationColor()} transition-colors flex items-center`}>
                €{animatedRemaining.toFixed(2)}
                {isAnimating && direction === "up" && (
                  <TrendingUp className="w-5 h-5 ml-2 text-green-500 animate-pulse" />
                )}
                {isAnimating && direction === "down" && (
                  <TrendingDown className="w-5 h-5 ml-2 text-destructive animate-pulse" />
                )}
              </div>
            </div>

            {/* Center: Progress bar between the two amounts */}
            <div className="flex-1">
              <Progress
                value={showDetails ? remainingPercentage : (maxLines > 0 ? (selectedLines / maxLines) * 100 : 0)}
                className="h-3"
              />
            </div>

            {/* Right: keep reserved space so the progress always ends where "Iskorišteni iznos" starts */}
            {showDetails ? (
              <div className="min-w-[180px] flex-shrink-0 text-right">
                <div className="text-sm text-muted-foreground mb-1">Iskorišteni iznos</div>
                <div className="text-2xl font-bold text-muted-foreground">€{used.toFixed(2)}</div>
              </div>
            ) : (
              <div className="min-w-[180px] flex-shrink-0" aria-hidden="true" />
            )}
          </div>

          {/* Bonus/Educational text row */}
          {showDetails ? (
            linesWithoutDevices > 0 && (
              <div className="flex items-start gap-2 pt-3 border-t border-border/50">
                <Gift className="w-4 h-4 text-bonus mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground text-left">
                  Svaka linija bez uređaja donosi dodatni popust u A1 Wallet. Iznos bonusa ovisi o odabranoj tarifi – veća tarifa znači veći bonus!
                </p>
              </div>
            )
          ) : (
            <div className="flex items-start gap-2 pt-3 border-t border-border/50">
              <Gift className="w-4 h-4 text-bonus mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground text-left">
                Ovisno o odabranoj tarifi u A1 Wallet dobivate popust koji se može koristiti za umanjenje cijene uređaja.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
