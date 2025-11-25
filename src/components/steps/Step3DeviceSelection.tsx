import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Smartphone } from "lucide-react";
import { devices, tariffs } from "@/data/catalog";
import { Label } from "@/components/ui/label";
import { WalletBanner } from "@/components/WalletBanner";

type DeviceSlot = {
  id: string;
  deviceId: string | null;
  deviceVariantId?: string | null;
  walletUse: number;
  tariffId: string;
  isActive: boolean;
  paymentMethod: "upfront" | "installments";
  screenInsurance: boolean;
  monthlyInstallment: number;
};

type Step3Props = {
  deviceSlots: DeviceSlot[];
  totalWallet: number;
  numberOfDevices: number;
  onOpenDeviceModal: (slotId: string) => void;
  onToggleSlot: (slotId: string) => void;
  onUpdatePaymentMethod: (slotId: string, method: "upfront" | "installments") => void;
  onUpdateWalletUse: (slotId: string, amount: number) => void;
  onUpdateInsurance: (slotId: string, insurance: boolean) => void;
  onUpdateMonthlyInstallment: (slotId: string, amount: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3DeviceSelection({
  deviceSlots,
  totalWallet,
  numberOfDevices,
  onOpenDeviceModal,
  onToggleSlot,
  onUpdatePaymentMethod,
  onUpdateWalletUse,
  onUpdateInsurance,
  onUpdateMonthlyInstallment,
  onNext,
  onBack,
}: Step3Props) {
  const activeSlots = deviceSlots.filter((slot) => slot.isActive);
  const correctNumberOfDevices = activeSlots.length === numberOfDevices;
  const allActiveDevicesSelected = activeSlots.every((slot) => slot.deviceId !== null);
  const canProceed = correctNumberOfDevices && allActiveDevicesSelected;
  const walletUsed = deviceSlots.reduce((sum, slot) => sum + slot.walletUse, 0);
  const walletRemaining = totalWallet - walletUsed;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="-mt-6 mb-6">
        <WalletBanner
          total={totalWallet}
          used={walletUsed}
          remaining={walletRemaining}
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Odabir uređaja i raspodjela walleta</h1>
        <p className="text-muted-foreground">
          Odaberite {numberOfDevices} uređaja od {deviceSlots.length} dostupnih linija
        </p>
        {!correctNumberOfDevices && (
          <p className="text-sm text-destructive mt-2">
            Morate uključiti točno {numberOfDevices} uređaja ({activeSlots.length}/{numberOfDevices})
          </p>
        )}
        {correctNumberOfDevices && !allActiveDevicesSelected && (
          <p className="text-sm text-destructive mt-2">
            Svi aktivni uređaji moraju biti konfigurirani
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deviceSlots.map((slot, index) => {
          const device = devices.find((d) => d.id === slot.deviceId);
          const variant = device?.variants?.find((v) => v.id === slot.deviceVariantId);
          const tariff = tariffs.find((t) => t.id === slot.tariffId);
          
          // Calculate max wallet for this device - use variant price if available
          const devicePrice = variant?.upfront || device?.upfront || 0;
          const deviceCost = device && slot.paymentMethod === "upfront" ? devicePrice : 0;
          const otherUsage = deviceSlots.reduce(
            (sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse),
            0
          );
          const maxWalletForDevice = Math.min(deviceCost, totalWallet - otherUsage);

          const activeCount = deviceSlots.filter(s => s.isActive).length;
          const canToggleOff = slot.isActive;
          const canToggleOn = !slot.isActive && activeCount < numberOfDevices;

          return (
            <div
              key={slot.id}
              className={`rounded-2xl border-2 bg-card p-6 shadow-sm transition-all flex flex-col ${
                slot.isActive ? "border-primary" : "border-border opacity-60"
              }`}
            >
              {/* Tariff name */}
              <div className="mb-3 pb-3 border-b border-border">
                <div className="text-sm text-muted-foreground">Tarifa:</div>
                <div className="font-bold text-lg">{tariff?.name || "Unknown"}</div>
              </div>

              {/* Toggle activation */}
              <div className={`flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border rounded-lg p-3 transition-all cursor-pointer ${
                !slot.isActive && canToggleOn 
                  ? "bg-primary/5 hover:bg-primary/10 border border-primary/20" 
                  : ""
              }`}
              onClick={() => (canToggleOn || canToggleOff) && onToggleSlot(slot.id)}
              >
                <Label htmlFor={`toggle-${slot.id}`} className="text-sm font-medium flex-1 cursor-pointer">
                  Želim kupiti uređaj uz ovu tarifu
                </Label>
                <Switch
                  id={`toggle-${slot.id}`}
                  checked={slot.isActive}
                  onCheckedChange={() => onToggleSlot(slot.id)}
                  disabled={!canToggleOn && !canToggleOff}
                  className="pointer-events-none"
                />
              </div>

              {/* Device selection */}
              <button
                onClick={() => slot.isActive && onOpenDeviceModal(slot.id)}
                disabled={!slot.isActive}
                className={`flex flex-col items-center gap-4 mb-4 group ${
                  !slot.isActive ? "cursor-not-allowed" : ""
                }`}
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
                      {variant && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {variant.color} • {variant.memory}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        MPC: €{devicePrice}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rata: do €{variant?.installment || device.installment}/mj
                      </div>
                    </div>
                    {slot.isActive && (
                      <div className="text-xs text-primary font-medium mt-2 group-hover:underline">
                        Klikni za promjenu
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={`w-32 h-32 rounded-3xl bg-muted border-2 border-dashed flex items-center justify-center transition-colors ${
                        slot.isActive
                          ? "border-border group-hover:border-primary/50"
                          : "border-border/50"
                      }`}
                    >
                      <Smartphone
                        className={`w-16 h-16 transition-colors ${
                          slot.isActive
                            ? "text-muted-foreground/40 group-hover:text-primary/40"
                            : "text-muted-foreground/20"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-muted-foreground mb-1">
                        {slot.isActive ? "Odaberi uređaj" : "Bez uređaja"}
                      </div>
                      {slot.isActive && (
                        <div className="text-sm text-primary font-medium">
                          Klikni za konfiguraciju
                        </div>
                      )}
                    </div>
                  </>
                )}
              </button>

              {/* Configuration - only show when active and device selected */}
              {slot.isActive && device && (
                <div className="mt-auto pt-4 border-t border-border space-y-4">
                  {/* Wallet usage - show for upfront payment */}
                  {slot.paymentMethod === "upfront" && (
                    <div className="space-y-2">
                      <Label htmlFor={`wallet-${slot.id}`} className="text-sm font-medium">
                        A1 Wallet popust (€):
                      </Label>
                      <Input
                        id={`wallet-${slot.id}`}
                        type="number"
                        min={0}
                        max={maxWalletForDevice}
                        value={slot.walletUse}
                        onChange={(e) => {
                          const value = Math.min(
                            Math.max(0, parseFloat(e.target.value) || 0),
                            maxWalletForDevice
                          );
                          onUpdateWalletUse(slot.id, value);
                        }}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        Maks: €{maxWalletForDevice.toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Wallet usage for installments - on upfront portion only */}
                  {slot.paymentMethod === "installments" && (
                    <div className="space-y-2">
                      <Label htmlFor={`wallet-inst-${slot.id}`} className="text-sm font-medium">
                        A1 Wallet popust na upfront (€):
                      </Label>
                      <Input
                        id={`wallet-inst-${slot.id}`}
                        type="number"
                        min={0}
                        max={Math.min(
                          Math.max(0, devicePrice - (slot.monthlyInstallment * 24)),
                          totalWallet - deviceSlots.reduce((sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse), 0)
                        )}
                        value={slot.walletUse}
                        onChange={(e) => {
                          const upfrontCost = Math.max(0, devicePrice - (slot.monthlyInstallment * 24));
                          const maxWallet = Math.min(
                            upfrontCost,
                            totalWallet - deviceSlots.reduce((sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse), 0)
                          );
                          const value = Math.min(
                            Math.max(0, parseFloat(e.target.value) || 0),
                            maxWallet
                          );
                          onUpdateWalletUse(slot.id, value);
                        }}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground">
                        Upfront nakon popusta: €{Math.max(0, devicePrice - (slot.monthlyInstallment * 24) - slot.walletUse).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Screen insurance */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Osiguranje ekrana:</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={slot.screenInsurance ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpdateInsurance(slot.id, true)}
                        className="flex-1"
                      >
                        Želim
                      </Button>
                      <Button
                        type="button"
                        variant={!slot.screenInsurance ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpdateInsurance(slot.id, false)}
                        className="flex-1"
                      >
                        Ne želim
                      </Button>
                    </div>
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
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Nastavi na sažetak
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
