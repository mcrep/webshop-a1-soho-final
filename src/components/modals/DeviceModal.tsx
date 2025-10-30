import { useState, useEffect, useMemo } from "react";
import { devices } from "@/data/catalog";
import type { Line } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, ShieldOff } from "lucide-react";

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
  
  // Wallet state
  const deviceCap =
    pay === "upfront"
      ? selectedDevice?.upfront ?? 0
      : rate;
  const maxWallet = Math.max(0, Math.min(deviceCap, walletAvailForLine + (current.walletUse ?? 0)));
  const [walletUse, setWalletUse] = useState(
    Math.min(Math.max(0, current.walletUse ?? 0), maxWallet)
  );

  const [screenInsurance, setScreenInsurance] = useState(current.screenInsurance ?? true);

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
  const monthlyCost = (pay === "installments" ? Math.max(0, rate - walletUse) : 0) + screenInsuranceCost;
  const onetimeCost = pay === "upfront" ? Math.max(0, (selectedDevice?.upfront ?? 0) - walletUse) : 0;

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
                  <div className="text-4xl">{selectedDevice.emoji}</div>
                  <div>
                    <div className="text-xs text-muted-foreground">{selectedDevice.brand}</div>
                    <div className="font-semibold text-lg">{selectedDevice.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Jednokratno: €{selectedDevice.upfront} • Rate: €{selectedDevice.installment}/mj
                    </div>
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

                {/* Combined Cost Preview & Wallet Application */}
                <div className="rounded-2xl border border-primary/30 bg-accent/30 p-4">
                  <h4 className="text-sm font-semibold mb-4">Pregled troška</h4>
                  
                  {/* Original costs before wallet */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {pay === "installments" ? "Rata uređaja" : "Cijena uređaja"}
                      </span>
                      <span className="font-medium">
                        €{pay === "installments" ? rate.toFixed(2) : selectedDevice?.upfront.toFixed(2)}
                        {pay === "installments" && "/mj"}
                      </span>
                    </div>
                    {screenInsurance && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Osiguranje ekrana</span>
                        <span className="font-medium">€{screenInsuranceCost.toFixed(2)}/mj</span>
                      </div>
                    )}
                  </div>

                  {/* Wallet input */}
                  <div className="mb-4 pb-4 border-t border-border pt-4">
                    <label className="text-xs text-muted-foreground mb-2 block font-medium">
                      Iznos za primjenu A1 Walleta (€)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={maxWallet}
                      step={1}
                      value={walletUse}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        setWalletUseClamped(val);
                      }}
                      className="w-full rounded-xl border border-border p-3 bg-background outline-none focus:border-primary transition-colors"
                      placeholder="0"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Maksimalno za ovu liniju: €{maxWallet.toFixed(0)}{" "}
                      {pay === "upfront" ? "(umanjuje jednokratno)" : "(umanjuje mjesečno)"}
                    </div>
                  </div>

                  {/* Final costs after wallet */}
                  <div className="pt-4 border-t border-primary/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Ukupno mjesečno</span>
                      <span className="text-xl font-bold text-primary">€{monthlyCost.toFixed(2)}</span>
                    </div>
                    {onetimeCost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Ukupno jednokratno</span>
                        <span className="text-xl font-bold text-primary">€{onetimeCost.toFixed(2)}</span>
                      </div>
                    )}
                    {walletUse > 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Primijenjeno: €{walletUse.toFixed(2)} A1 Wallet popusta
                      </div>
                    )}
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
              onClick={() => onSave(current.deviceId!, pay, rate, walletUse, screenInsurance)}
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
