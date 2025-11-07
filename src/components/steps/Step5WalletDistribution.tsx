import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { devices } from "@/data/catalog";

type DeviceSlot = {
  id: string;
  deviceId: string | null;
  walletUse: number;
};

type Step5Props = {
  deviceSlots: DeviceSlot[];
  totalWallet: number;
  onUpdateWalletUse: (slotId: string, amount: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step5WalletDistribution({ deviceSlots, totalWallet, onUpdateWalletUse, onNext, onBack }: Step5Props) {
  const walletUsed = deviceSlots.reduce((sum, slot) => sum + slot.walletUse, 0);
  const walletRemaining = totalWallet - walletUsed;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Raspodjela A1 Wallet kredita</h1>
        <p className="text-muted-foreground">Korak 5 od 6 - Raspredijelite kredit na uređaje</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Ukupan A1 Wallet:</span>
              <span className="text-xl font-bold text-primary ml-2">€{totalWallet.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Iskorišteno:</span>
              <span className="text-xl font-bold ml-2">€{walletUsed.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Preostalo:</span>
            <span className="text-xl font-bold text-primary ml-2">€{walletRemaining.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {deviceSlots.map((slot, index) => {
          const device = devices.find((d) => d.id === slot.deviceId);
          if (!device) return null;

          const deviceCost = device.upfront; // For simplicity, using upfront cost as max
          const otherUsage = deviceSlots.reduce(
            (sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse),
            0
          );
          const maxWalletForDevice = Math.min(deviceCost, totalWallet - otherUsage);

          return (
            <div
              key={slot.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {device.image ? (
                    <img src={device.image} alt={device.name} className="w-20 h-20 object-contain" />
                  ) : (
                    <span className="text-4xl">{device.emoji}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Uređaj {index + 1}</div>
                  <h3 className="text-xl font-bold mb-1">{device.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    MPC: €{device.upfront} • Rata: €{device.installment}/mj
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <label className="text-sm font-medium block mb-2 text-right">
                    Popust A1 Wallet (€)
                  </label>
                  <div className="text-xs text-muted-foreground mb-2 text-right">
                    Maksimalno: €{maxWalletForDevice.toFixed(2)}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={maxWalletForDevice}
                    step="1"
                    value={Math.round(slot.walletUse)}
                    onChange={(e) => {
                      const val = Math.round(parseFloat(e.target.value) || 0);
                      const clamped = Math.min(Math.max(0, val), maxWalletForDevice);
                      onUpdateWalletUse(slot.id, clamped);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '.' || e.key === ',') {
                        e.preventDefault();
                      }
                    }}
                    className="w-32 bg-background border border-input rounded-lg px-3 py-2 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} size="lg">
          Nastavi na sažetak
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
