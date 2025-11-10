import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Smartphone, Wallet } from "lucide-react";
import { devices } from "@/data/catalog";

type DeviceSlot = {
  id: string;
  deviceId: string | null;
  walletUse: number;
};

type Step3Props = {
  deviceSlots: DeviceSlot[];
  totalWallet: number;
  onOpenDeviceModal: (slotId: string) => void;
  onUpdateWalletUse: (slotId: string, amount: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3DeviceSelection({ 
  deviceSlots, 
  totalWallet,
  onOpenDeviceModal, 
  onUpdateWalletUse,
  onNext, 
  onBack 
}: Step3Props) {
  const allDevicesSelected = deviceSlots.every((slot) => slot.deviceId !== null);
  const walletUsed = deviceSlots.reduce((sum, slot) => sum + slot.walletUse, 0);
  const walletRemaining = totalWallet - walletUsed;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Floating wallet indicator */}
      <div className="fixed top-24 right-8 z-50 rounded-2xl border-2 border-primary bg-card/95 backdrop-blur-sm p-6 shadow-2xl min-w-[280px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">A1 Wallet</div>
            <div className="text-2xl font-bold text-primary">€{totalWallet.toFixed(2)}</div>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Iskorišteno:</span>
            <span className="font-semibold">€{walletUsed.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Preostalo:</span>
            <span className="font-bold text-primary">€{walletRemaining.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Odabir uređaja i raspodjela walleta</h1>
        <p className="text-muted-foreground">Korak 3 od 4 - Odaberite {deviceSlots.length} uređaja i raspodijelite wallet kredit</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deviceSlots.map((slot, index) => {
          const device = devices.find((d) => d.id === slot.deviceId);
          
          // Calculate max wallet for this device
          const deviceCost = device ? device.upfront : 0;
          const otherUsage = deviceSlots.reduce(
            (sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse),
            0
          );
          const maxWalletForDevice = Math.min(deviceCost, totalWallet - otherUsage);

          return (
            <div
              key={slot.id}
              className="rounded-2xl border-2 border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <button
                onClick={() => onOpenDeviceModal(slot.id)}
                className="flex flex-col items-center gap-4 mb-4 group"
              >
                {device ? (
                  <>
                    {device.image ? (
                      <img src={device.image} alt={device.name} className="w-32 h-32 object-contain" />
                    ) : (
                      <span className="text-6xl">{device.emoji}</span>
                    )}
                    <div className="text-center">
                      <div className="font-bold text-lg mb-1">{device.name}</div>
                      <div className="text-sm text-muted-foreground">
                        MPC: €{device.upfront}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rata: €{device.installment}/mj
                      </div>
                    </div>
                    <div className="text-xs text-primary font-medium mt-2 group-hover:underline">
                      Klikni za promjenu
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                      <Smartphone className="w-16 h-16 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-muted-foreground mb-1">Uređaj {index + 1}</div>
                      <div className="text-sm text-primary font-medium">
                        Klikni za konfiguraciju uređaja
                      </div>
                    </div>
                  </>
                )}
              </button>

              {device && (
                <div className="mt-auto pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wallet popust:</span>
                    <span className="text-lg font-bold text-primary">€{slot.walletUse.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[slot.walletUse]}
                    min={0}
                    max={maxWalletForDevice}
                    step={1}
                    onValueChange={(value) => onUpdateWalletUse(slot.id, value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>€0</span>
                    <span>Maks: €{maxWalletForDevice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} disabled={!allDevicesSelected} size="lg">
          Nastavi na sažetak
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
