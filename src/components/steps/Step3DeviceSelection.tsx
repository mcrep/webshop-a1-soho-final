import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Smartphone, Plus, Gift, Wallet, X } from "lucide-react";
import { devices, tariffs } from "@/data/catalog";
import { findExistingLineNumber } from "@/data/mock-existing-lines";
import { Label } from "@/components/ui/label";
import { motion, LayoutGroup } from "framer-motion";
import { StatusNotification } from "@/components/StatusNotification";
import type { Line } from "@/types";

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
  label: string;
  isExtension: boolean;
};

type Step3Props = {
  deviceSlots: DeviceSlot[];
  lines: Line[];
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

// Helper to get the correct label for a slot based on line data
const getSlotLabel = (slot: DeviceSlot, line: Line | undefined, index: number) => {
  // For existing (logged-in) lines, the msisdn is already on the slot label
  if (slot.isExtension && slot.label) return slot.label;

  if (line) {
    // Check for porting number (MNP)
    if (line.portingNumber) return line.portingNumber;
    // Check for prepaid number (pre2post)
    if (line.prepaidNumber) return line.prepaidNumber;
    // Check for existing line (renew)
    if (line.existingLineId) {
      const existing = findExistingLineNumber(line.existingLineId);
      if (existing) return existing;
      // If not found in mapping, it might be a direct phone number
      return line.existingLineId;
    }
  }

  return `Linija ${index + 1}`;
};

export function Step3DeviceSelection({
  deviceSlots,
  lines,
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

  // Determine title based on state
  const activeCount = activeSlots.length;
  const devicesSelectedCount = activeSlots.filter(s => s.deviceId !== null).length;
  const remainingLinesToActivate = numberOfDevices - activeCount;
  const remainingDevicesToSelect = numberOfDevices - devicesSelectedCount;

  // Helper for Croatian grammar - line declension
  const getLineText = (count: number) => {
    if (count === 1) return "1 liniju na kojoj";
    if (count >= 2 && count <= 4) return `${count} linije na kojima`;
    return `${count} linija na kojima`;
  };

  // Status message logic
  const isComplete = canProceed;
  let statusMessage = "";
  if (activeCount < numberOfDevices) {
    statusMessage = `Molimo odaberite ${getLineText(remainingLinesToActivate)} želite uzeti uređaje.`;
  } else if (!allActiveDevicesSelected) {
    statusMessage = `Molimo odaberite ${remainingDevicesToSelect} ${remainingDevicesToSelect === 1 ? 'uređaj' : 'uređaja'} prije završetka narudžbe.`;
  } else {
    statusMessage = "Svi uređaji su uspješno odabrani!";
  }

  return (
    <div className="w-full py-6">
      {/* Device Selection Container */}
      <div className="bg-card rounded-2xl p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Odaberi uređaje</h2>
          </div>
        </div>

        <LayoutGroup>
          {/* Active slots - full cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeSlots.map((slot, slotIndex) => {
            const device = devices.find((d) => d.id === slot.deviceId);
            const variant = device?.variants?.find((v) => v.id === slot.deviceVariantId);
            const tariff = tariffs.find((t) => t.id === slot.tariffId);
            
            // Find the corresponding line to get the MSISDN
            const lineIndex = deviceSlots.findIndex(s => s.id === slot.id);
            const line = lines[lineIndex];
            const displayLabel = getSlotLabel(slot, line, lineIndex);
            
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
                className="rounded-2xl border-2 border-border bg-card p-6 shadow-sm flex flex-col hover:border-foreground relative transition-colors"
              >
                {/* Close button */}
                <button
                  onClick={() => onToggleSlot(slot.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-destructive/10 transition-colors text-destructive hover:text-destructive"
                  title="Zatvori uređaj"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Line label and badges */}
                <div className="mb-3 pb-3 border-b border-border pr-8">
                  <div className="font-bold text-lg mb-2">{displayLabel}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-sm font-medium">
                      {tariff?.name || "Unknown"}
                    </span>
                    {device && (
                      <button
                        onClick={() => onOpenDeviceModal(slot.id)}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-sm font-medium hover:bg-muted/70 transition-colors cursor-pointer"
                      >
                        {device.brand} {device.name}
                      </button>
                    )}
                  </div>
                </div>

                {/* Device selection */}
                <button
                  onClick={() => onOpenDeviceModal(slot.id)}
                  className="flex flex-col items-center gap-4 mb-4 group"
                >
                  {device ? (
                    <div className="text-center">
                      {variant && (
                        <div className="text-xs text-muted-foreground">
                          {variant.color} • {variant.memory}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-32 h-32 rounded-3xl bg-muted flex items-center justify-center transition-all duration-300">
                        <Smartphone className="w-16 h-16 transition-all duration-300 text-muted-foreground/40 group-hover:text-primary group-hover:scale-110" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-primary">Odaberi uređaj</div>
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
                        
                        <div className="rounded-lg p-3 space-y-3" style={{ backgroundColor: 'rgba(63, 30, 226, 0.05)' }}>
                          <div className="flex items-center gap-2" style={{ color: '#3F1EE2' }}>
                            <Wallet className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-semibold">Umanji cijenu uređaja korištenjem A1 Wallet popusta</span>
                          </div>
                          <div className="relative">
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
                              placeholder="0"
                              className="text-center text-lg font-bold h-12 bg-background border-2 pr-10 focus:ring-0 focus:ring-offset-0"
                              style={{ borderColor: 'rgba(63, 30, 226, 0.3)', color: '#3F1EE2', outline: 'none', boxShadow: 'none' }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-medium" style={{ color: '#3F1EE2' }}>€</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-sm font-medium">Ukupna cijena uređaja:</span>
                          <span className="font-bold text-lg text-primary">
                            {Math.max(0, devicePrice - slot.walletUse).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Wallet usage for installments - on upfront portion only */}
                    {slot.paymentMethod === "installments" && (
                      <div className="space-y-3">

                        {(() => {
                          const upfrontCost = Math.max(0, devicePrice - (slot.monthlyInstallment * 24));
                          const maxWalletInstallment = Math.min(
                            upfrontCost,
                            totalWallet - deviceSlots.reduce((sum, s) => sum + (s.id === slot.id ? 0 : s.walletUse), 0)
                          );
                          return (
                            <div className="rounded-lg p-3 space-y-3" style={{ backgroundColor: 'rgba(63, 30, 226, 0.05)' }}>
                              <div className="flex items-center gap-2" style={{ color: '#3F1EE2' }}>
                                <Wallet className="h-4 w-4 shrink-0" />
                                <span className="text-sm font-semibold">Umanji cijenu uređaja korištenjem A1 Wallet popusta</span>
                              </div>
                              <div className="relative">
                                <Input
                                  id={`wallet-inst-${slot.id}`}
                                  type="number"
                                  min={0}
                                  max={maxWalletInstallment}
                                  value={slot.walletUse}
                                  onChange={(e) => {
                                    const value = Math.min(
                                      Math.max(0, parseFloat(e.target.value) || 0),
                                      maxWalletInstallment
                                    );
                                    onUpdateWalletUse(slot.id, value);
                                  }}
                                  placeholder="0"
                                  className="text-center text-lg font-bold h-12 bg-background border-2 pr-10 focus:ring-0 focus:ring-offset-0"
                                  style={{ borderColor: 'rgba(63, 30, 226, 0.3)', color: '#3F1EE2', outline: 'none', boxShadow: 'none' }}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-medium" style={{ color: '#3F1EE2' }}>€</span>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-sm font-medium">Ukupna cijena uređaja:</span>
                          <span className="font-bold text-lg text-primary">
                            {Math.max(0, devicePrice - (slot.monthlyInstallment * 24) - slot.walletUse).toFixed(2)}€
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
                const currentActiveCount = deviceSlots.filter(s => s.isActive).length;
                const canToggleOn = currentActiveCount < numberOfDevices;
                const linesSelected = currentActiveCount === numberOfDevices;
                
                // Find the corresponding line to get the MSISDN
                const lineIndex = deviceSlots.findIndex(s => s.id === slot.id);
                const line = lines[lineIndex];
                const displayLabel = getSlotLabel(slot, line, lineIndex);

                return (
                  <motion.div
                    key={slot.id}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => canToggleOn ? onToggleSlot(slot.id) : handleDisabledClick(slot.id)}
                    className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl border bg-card transition-all ${
                      canToggleOn 
                        ? "border-border hover:border-foreground cursor-pointer" 
                        : "border-border/50 opacity-60 cursor-not-allowed"
                    } ${shakingSlotId === slot.id ? "animate-shake" : ""}`}
                  >
                    {/* Line info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{displayLabel}</div>
                        <div className="text-xs text-muted-foreground">{tariff?.name || "Unknown"}</div>
                      </div>
                    </div>

                    {linesSelected && (
                      <div className="flex items-center gap-2 text-bonus">
                        <Gift className="w-4 h-4" />
                        <span className="text-sm font-medium">+{tariff?.noDeviceWalletBonus || 0}€ dodatnog bonusa za tarifu bez uređaja</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        </LayoutGroup>
      </div>
    </div>
  );
}
