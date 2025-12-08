import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Smartphone, Plus, Gift } from "lucide-react";
import { devices, tariffs } from "@/data/catalog";
import { Label } from "@/components/ui/label";
import { motion, LayoutGroup } from "framer-motion";

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
  const inactiveSlots = deviceSlots.filter((slot) => !slot.isActive);
  const correctNumberOfDevices = activeSlots.length === numberOfDevices;
  const allActiveDevicesSelected = activeSlots.every((slot) => slot.deviceId !== null);
  const canProceed = correctNumberOfDevices && allActiveDevicesSelected;

  // Track which slot is shaking
  const [shakingSlotId, setShakingSlotId] = useState<string | null>(null);

  const handleDisabledClick = (slotId: string) => {
    setShakingSlotId(slotId);
    setTimeout(() => setShakingSlotId(null), 500);
  };

  // Calculate total bonus from inactive slots
  const totalNoDeviceBonus = inactiveSlots.reduce((sum, slot) => {
    const tariff = tariffs.find(t => t.id === slot.tariffId);
    return sum + (tariff?.noDeviceWalletBonus ?? 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">
          {canProceed ? "Odabrani uređaji" : `Odaberi ${numberOfDevices - activeSlots.filter(s => s.deviceId !== null).length} ${numberOfDevices - activeSlots.filter(s => s.deviceId !== null).length === 1 ? 'uređaj' : 'uređaja'}`}
        </h1>
      </div>

      <LayoutGroup>
        {/* Active slots - full cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeSlots.map((slot) => {
            const device = devices.find((d) => d.id === slot.deviceId);
            const variant = device?.variants?.find((v) => v.id === slot.deviceVariantId);
            const tariff = tariffs.find((t) => t.id === slot.tariffId);
            
            const devicePrice = variant?.upfront || device?.upfront || 0;
            const deviceCost = device && slot.paymentMethod === "upfront" ? devicePrice : 0;
            const otherUsage = deviceSlots.reduce(
              (sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse),
              0
            );
            const maxWalletForDevice = Math.min(deviceCost, totalWallet - otherUsage);

            return (
              <motion.div
                key={slot.id}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="rounded-2xl border-2 bg-card p-6 shadow-sm flex flex-col border-border hover:border-primary/50"
              >
                {/* Tariff name */}
                <div className="mb-3 pb-3 border-b border-border">
                  <div className="text-sm text-muted-foreground">Tarifa:</div>
                  <div className="font-bold text-lg">{tariff?.name || "Unknown"}</div>
                </div>

                {/* Toggle activation */}
                <div 
                  className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border rounded-lg p-3 transition-all cursor-pointer"
                  onClick={() => onToggleSlot(slot.id)}
                >
                  <Label htmlFor={`toggle-${slot.id}`} className="text-sm font-medium flex-1 cursor-pointer">
                    Želim kupiti uređaj uz ovu tarifu
                  </Label>
                  <Switch
                    id={`toggle-${slot.id}`}
                    checked={slot.isActive}
                    onCheckedChange={() => onToggleSlot(slot.id)}
                    className="pointer-events-none"
                  />
                </div>

                {/* Device selection */}
                <button
                  onClick={() => onOpenDeviceModal(slot.id)}
                  className="flex flex-col items-center gap-4 mb-4 group"
                >
                  {device ? (
                    <div className="text-center">
                      <div className="font-bold text-lg mb-1">{device.brand} {device.name}</div>
                      {variant && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {variant.color} • {variant.memory}
                        </div>
                      )}
                      <div className="text-xs text-primary font-medium mt-2 group-hover:underline">
                        Klikni za promjenu
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed flex items-center justify-center transition-colors border-border group-hover:border-primary/50">
                        <Smartphone className="w-16 h-16 transition-colors text-muted-foreground/40 group-hover:text-primary/40" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-muted-foreground mb-1">Odaberi uređaj</div>
                        <div className="text-sm text-primary font-medium">Klikni za konfiguraciju</div>
                      </div>
                    </>
                  )}
                </button>

                {/* Configuration - only show when device selected */}
                {device && (
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
                            Primjeni maksimalni popust
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
                            Primjeni maksimalni popust
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
              </motion.div>
            );
          })}
        </div>

        {/* Inactive slots - compact horizontal rows */}
        {inactiveSlots.length > 0 && (
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mt-8 space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Linije bez uređaja ({inactiveSlots.length})
            </h3>
            <div className="space-y-2">
              {inactiveSlots.map((slot) => {
                const tariff = tariffs.find((t) => t.id === slot.tariffId);
                const activeCount = deviceSlots.filter(s => s.isActive).length;
                const canToggleOn = activeCount < numberOfDevices;

                return (
                  <motion.div
                    key={slot.id}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => canToggleOn ? onToggleSlot(slot.id) : handleDisabledClick(slot.id)}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border bg-card transition-all ${
                      canToggleOn 
                        ? "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer" 
                        : "border-border/50 opacity-60 cursor-not-allowed"
                    } ${shakingSlotId === slot.id ? "animate-shake" : ""}`}
                  >
                    {/* Tariff info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{tariff?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">Bez uređaja</div>
                      </div>
                    </div>

                    {/* Bonus info */}
                    <div className="flex items-center gap-2 text-green-600">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm font-medium">+{tariff?.noDeviceWalletBonus || 0}€ bonus</span>
                    </div>

                    {/* Activate button */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canToggleOn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canToggleOn) onToggleSlot(slot.id);
                      }}
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Aktiviraj
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </LayoutGroup>
    </div>
  );
}
