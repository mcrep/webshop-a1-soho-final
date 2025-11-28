import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Smartphone, ArrowUpToLine } from "lucide-react";
import { devices, tariffs } from "@/data/catalog";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
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
              className={`rounded-2xl border-2 bg-card p-6 shadow-sm transition-all duration-300 flex flex-col ${
                slot.isActive 
                  ? "border-border hover:border-primary/50 animate-scale-in" 
                  : canToggleOn 
                    ? "border-border opacity-60 hover:border-primary/50 scale-95" 
                    : "border-border opacity-60 scale-95"
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
                  <div className="text-center">
                    <div className="font-bold text-lg mb-1">{device.brand} {device.name}</div>
                    {variant && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {variant.color} • {variant.memory}
                      </div>
                    )}
                    {slot.isActive && (
                      <div className="text-xs text-primary font-medium mt-2 group-hover:underline">
                        Klikni za promjenu
                      </div>
                    )}
                  </div>
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
                <div className="mt-auto pt-4 border-t border-border space-y-3">
                  {/* Wallet usage - show for upfront payment */}
                  {slot.paymentMethod === "upfront" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Jednokratna cijena:</span>
                        <span className="font-bold">€{devicePrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor={`wallet-${slot.id}`} className="text-sm font-medium">
                            A1 Wallet popust:
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
                            className="w-32 text-right"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateWalletUse(slot.id, maxWalletForDevice)}
                          className="w-full h-10"
                          title="Postavi maksimalni popust"
                        >
                          Max popust
                        </Button>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-sm font-medium">Ukupna cijena uređaja:</span>
                        <span className="font-bold text-lg text-primary">
                          €{Math.max(0, devicePrice - slot.walletUse).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Wallet usage for installments - on upfront portion only */}
                  {slot.paymentMethod === "installments" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Jednokratna cijena:</span>
                        <span className="font-bold">€{Math.max(0, devicePrice - (slot.monthlyInstallment * 24)).toFixed(2)}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor={`wallet-inst-${slot.id}`} className="text-sm font-medium">
                            A1 Wallet popust:
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
                            className="w-32 text-right"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const upfrontCost = Math.max(0, devicePrice - (slot.monthlyInstallment * 24));
                            const maxWallet = Math.min(
                              upfrontCost,
                              totalWallet - deviceSlots.reduce((sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse), 0)
                            );
                            onUpdateWalletUse(slot.id, maxWallet);
                          }}
                          className="w-full h-10"
                          title="Postavi maksimalni popust"
                        >
                          Max popust
                        </Button>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-sm font-medium">Ukupna cijena uređaja:</span>
                        <span className="font-bold text-lg text-primary">
                          €{Math.max(0, devicePrice - (slot.monthlyInstallment * 24) - slot.walletUse).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}


                  {/* Screen insurance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4 rounded-lg p-3 border border-border">
                      <Label htmlFor={`insurance-${slot.id}`} className="text-sm font-medium flex-1">
                        Osiguranje ekrana
                      </Label>
                      <Switch
                        id={`insurance-${slot.id}`}
                        checked={slot.screenInsurance}
                        onCheckedChange={(checked) => onUpdateInsurance(slot.id, checked)}
                      />
                    </div>
                    {slot.screenInsurance && (
                      <p className="text-xs text-muted-foreground pl-3">
                        Uz uređaj je aktivirano osiguranje ekrana s mjesečnom naknadom 4,19€
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
