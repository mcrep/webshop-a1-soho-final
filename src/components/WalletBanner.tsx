import { useState } from "react";
import { Wallet, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCountAnimation } from "@/hooks/use-count-animation";
import { WalletInfoModal } from "@/components/modals/WalletInfoModal";

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
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Animate wallet remaining whenever it changes
  const { value: animatedRemaining, isAnimating: isAnimatingRemaining, direction: directionRemaining } = useCountAnimation({
    value: remaining,
    duration: 600,
    enabled: true,
  });

  // Animate used amount whenever it changes
  const { value: animatedUsed, isAnimating: isAnimatingUsed, direction: directionUsed } = useCountAnimation({
    value: used,
    duration: 600,
    enabled: true,
  });

  const isAnimating = isAnimatingRemaining || isAnimatingUsed;

  const remainingPercentage = total > 0 ? (animatedRemaining / total) * 100 : 0;

  return (
    <>
      <div 
        className="border-l border-r border-b border-border rounded-b-2xl sticky top-[57px] z-40"
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, #fff1f1 100%)'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4">
            {/* Header row with icon and title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${isAnimating ? "animate-pulse" : ""}`}>
                <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">A1 Wallet</h2>
              </div>
              <button
                onClick={() => setInfoModalOpen(true)}
                className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Informacije o A1 Wallet"
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Amounts + progress in the same row */}
            <div className="flex items-center">
              {/* Left: Available amount */}
              <div className="flex-shrink-0 pr-4 min-w-[140px]">
                <div className="text-sm text-muted-foreground mb-1">Dostupan iznos</div>
                <div className="text-2xl font-bold text-primary transition-colors">
                  {animatedRemaining.toFixed(2)} €
                </div>
              </div>

              {/* Center: Progress bar between the two amounts */}
              <div className="flex-1">
                <Progress
                  value={showDetails ? remainingPercentage : (maxLines > 0 ? (selectedLines / maxLines) * 100 : 0)}
                  className="h-3"
                />
              </div>

              {/* Right: Used amount - aligned with info icon above */}
              <div className="flex-shrink-0 text-right pl-4 min-w-[140px]">
                {showDetails && (
                  <>
                    <div className="text-sm text-muted-foreground mb-1">Iskorišteni iznos</div>
                    <div className="text-2xl font-bold text-muted-foreground transition-colors">
                      {animatedUsed.toFixed(2)} €
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WalletInfoModal open={infoModalOpen} onOpenChange={setInfoModalOpen} />
    </>
  );
}
