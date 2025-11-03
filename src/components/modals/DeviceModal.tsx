import { useState, useEffect, useMemo } from "react";
import { devices } from "@/data/catalog";
import type { Line } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, ShieldOff, Pencil } from "lucide-react";

type DeviceModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (deviceId: string, pay: "installments" | "upfront", rate: number, walletUse: number, screenInsurance: boolean) => void;
  walletAvailForLine: number;
};

export function DeviceModal({ current, onClose, onSave, walletAvailForLine }: DeviceModalProps) {
  const selectedDevice = devices.find((d) => d.id === current.deviceId);
  
  const [pay, setPay] = useState<"installments" | "upfront">(
    current.devicePayment ?? "installments"
  );

  const initialInstall = useMemo(() => selectedDevice?.installment ?? 1, [selectedDevice]);

  const [rate, setRate] = useState(current.deviceMonthly ?? initialInstall);
  
  // Wallet state - automatically apply full wallet discount
  const deviceCap =
    pay === "upfront"
      ? selectedDevice?.upfront ?? 0
      : rate;
  const maxWallet = Math.max(0, Math.min(deviceCap, walletAvailForLine + (current.walletUse ?? 0)));
  const [walletUse, setWalletUse] = useState(maxWallet);

  const [screenInsurance, setScreenInsurance] = useState(current.screenInsurance ?? true);
  const [isEditingOnetime, setIsEditingOnetime] = useState(false);
  const [editedOnetime, setEditedOnetime] = useState("");
  const [walletForOnetime, setWalletForOnetime] = useState(0);

  useEffect(() => {
    if (selectedDevice) {
      const newRate = current.deviceMonthly ?? selectedDevice.installment;
      const bounded = Math.min(Math.max(1, newRate), selectedDevice.installment);
      setRate(bounded);
    }
  }, [selectedDevice, current.deviceMonthly]);

  // Update wallet when device/payment changes
  useEffect(() => {
    const newCap = pay === "upfront" ? (selectedDevice?.upfront ?? 0) : rate;
    const newMax = Math.max(0, Math.min(newCap, walletAvailForLine + (current.walletUse ?? 0)));
    setWalletUse((prev) => Math.min(prev, newMax));
  }, [pay, rate, selectedDevice, walletAvailForLine, current.walletUse]);

  const setWalletUseClamped = (val: number) => {
    const v = Number.isFinite(val) ? val : 0;
    const clamped = Math.min(Math.max(0, v), maxWallet);
    setWalletUse(clamped);
  };

  // Cost calculation
  const screenInsuranceCost = screenInsurance ? 4.99 : 0;
  
  // MPC cijena uređaja
  const mpcPrice = selectedDevice?.upfront ?? 0;
  
  // Onetimecost ovisi o načinu plaćanja
  // Za rate: Početni trošak = MPC - (rata × 24)
  // Za jednokratno: MPC cijena
  const onetimeCostOriginal = pay === "installments" 
    ? Math.max(0, mpcPrice - (rate * 24))
    : mpcPrice;
  
  // Initialize wallet distribution - only for one-time costs
  useEffect(() => {
    const totalWallet = walletUse;
    setWalletForOnetime(totalWallet);
  }, [walletUse]);

  const monthlyCost = pay === "installments" ? rate + screenInsuranceCost : (screenInsurance ? screenInsuranceCost : 0);
  const onetimeCost = Math.max(0, onetimeCostOriginal - walletForOnetime);
  
  const totalWalletUsed = walletForOnetime;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="font-semibold">Konfiguracija uređaja</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-auto flex-1">
            {/* Device info */}
            {selectedDevice && (
              <div className="rounded-2xl border border-primary/30 bg-accent/20 p-4 mb-6">
                <div className="flex items-center gap-4">
                  {selectedDevice.image ? (
                    <img src={selectedDevice.image} alt={selectedDevice.name} className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="text-4xl">{selectedDevice.emoji}</div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground">{selectedDevice.brand}</div>
                    <div className="font-semibold text-lg">{selectedDevice.name}</div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement device info modal
                      }}
                      className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 mt-1 transition-colors"
                    >
                      Više informacija o uređaju
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedDevice && selectedDevice.id !== "no-dev" && (
              <>
                {/* Screen Insurance */}
                <div className="rounded-2xl border border-border bg-card p-4 mb-4">
                  <h4 className="text-sm font-semibold mb-3">Osiguranje ekrana</h4>
                  <RadioGroup
                    value={screenInsurance ? "yes" : "no"}
                    onValueChange={(val) => setScreenInsurance(val === "yes")}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="yes"
                        id="insurance-yes"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="insurance-yes"
                        className="flex flex-col items-center justify-center rounded-xl border p-3 cursor-pointer transition-all peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent/50 hover:bg-muted"
                      >
                        <Shield className="h-6 w-6 mb-2 text-primary" />
                        <span className="text-xs font-medium text-center">Želim osiguranje ekrana</span>
                        <span className="text-xs text-primary font-semibold mt-1">4,99€/mj</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem
                        value="no"
                        id="insurance-no"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="insurance-no"
                        className="flex flex-col items-center justify-center rounded-xl border p-3 cursor-pointer transition-all peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent/50 hover:bg-muted"
                      >
                        <ShieldOff className="h-6 w-6 mb-2 text-muted-foreground" />
                        <span className="text-xs font-medium text-center">Ne želim osiguranje ekrana</span>
                        <span className="text-xs mt-1 opacity-0">placeholder</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {/* Payment method */}
                <div className="rounded-2xl border border-border bg-card p-4 mb-4">
                  <h4 className="text-sm font-semibold mb-3">Način plaćanja</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPay("installments")}
                      className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                        pay === "installments"
                          ? "ring-2 ring-primary border-primary bg-accent/50"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      Na rate
                    </button>
                    <button
                      onClick={() => setPay("upfront")}
                      className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                        pay === "upfront"
                          ? "ring-2 ring-primary border-primary bg-accent/50"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      Jednokratno
                    </button>
                  </div>
                </div>

                {/* Monthly rate slider (only for installments) */}
                {pay === "installments" && (
                  <div className="rounded-2xl border border-border bg-card p-4 mb-4">
                    <h4 className="text-sm font-semibold mb-3">Mjesečna rata</h4>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={selectedDevice.installment}
                        step={1}
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <div className="text-sm font-semibold min-w-[60px] text-right">
                        €{rate.toFixed(0)}/mj
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Odaberi iznos mjesečne rate (€1 - €{selectedDevice.installment})
                    </div>
                  </div>
                )}

                {/* Combined Cost Preview */}
                <div className="rounded-2xl border border-primary/30 bg-accent/30 p-4">
                  <h4 className="text-sm font-semibold mb-4">Pregled troška</h4>
                  
                  {/* Original costs */}
                  <div className="space-y-2 mb-4">
                    {pay === "installments" && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Rata uređaja</span>
                        <span className="font-medium">€{rate.toFixed(2)}/mj</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {pay === "installments" ? "Početni trošak" : "MPC cijena"}
                      </span>
                      <span className="font-medium">€{onetimeCostOriginal.toFixed(2)}</span>
                    </div>
                    {walletForOnetime > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Popust (A1 Wallet)</span>
                        <span className="font-medium text-green-600">-€{walletForOnetime.toFixed(2)}</span>
                      </div>
                    )}
                    {screenInsurance && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Osiguranje ekrana</span>
                        <span className="font-medium">€{screenInsuranceCost.toFixed(2)}/mj</span>
                      </div>
                    )}
                  </div>

                  {/* Final costs with edit option */}
                  <div className="pt-4 border-t border-primary/50 space-y-3">
                    {(pay === "installments" || screenInsurance) && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Ukupno mjesečno</span>
                        <span className="text-xl font-bold text-primary">€{monthlyCost.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Ukupno jednokratno</span>
                      <div className="flex items-center gap-2">
                        {!isEditingOnetime ? (
                          <>
                            <span className="text-xl font-bold text-primary">€{onetimeCost.toFixed(2)}</span>
                            <button
                              onClick={() => {
                                setIsEditingOnetime(true);
                                setEditedOnetime(onetimeCost.toFixed(2));
                              }}
                              className="text-primary hover:text-primary/80 transition-colors p-1"
                              title="Uredi cijenu"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">€</span>
                            <input
                              type="number"
                              min={0}
                              max={onetimeCostOriginal}
                              step={0.01}
                              value={editedOnetime}
                              onChange={(e) => setEditedOnetime(e.target.value)}
                              onBlur={() => {
                                const val = parseFloat(editedOnetime) || 0;
                                const clampedPrice = Math.min(Math.max(0, val), onetimeCostOriginal);
                                const newWalletForOnetime = onetimeCostOriginal - clampedPrice;
                                setWalletForOnetime(Math.min(newWalletForOnetime, maxWallet));
                                setEditedOnetime(clampedPrice.toFixed(2));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                  setIsEditingOnetime(false);
                                } else if (e.key === 'Escape') {
                                  setIsEditingOnetime(false);
                                }
                              }}
                              className="w-24 rounded-lg border border-primary px-2 py-1 text-lg font-bold text-primary bg-background outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                            />
                            <button
                              onClick={() => setIsEditingOnetime(false)}
                              className="text-sm text-primary hover:text-primary/80 px-2 py-1 border border-primary rounded-lg"
                            >
                              OK
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-border p-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              Odustani
            </button>
            <button
              onClick={() => onSave(current.deviceId!, pay, rate, totalWalletUsed, screenInsurance)}
              disabled={!selectedDevice}
              className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spremi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
