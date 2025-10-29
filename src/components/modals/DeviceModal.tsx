import { useState, useEffect, useMemo } from "react";
import { devices } from "@/data/catalog";
import type { Line } from "@/types";

type DeviceModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (deviceId: string, pay: "installments" | "upfront", rate: number, walletUse: number) => void;
  walletAvailForLine: number;
};

export function DeviceModal({ current, onClose, onSave, walletAvailForLine }: DeviceModalProps) {
  const [sel, setSel] = useState<string>(current.deviceId ?? "");
  const [pay, setPay] = useState<"installments" | "upfront">(
    current.devicePayment ?? "installments"
  );

  const selectedDevice = devices.find((d) => d.id === sel);
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

  useEffect(() => {
    if (selectedDevice) {
      const newRate = current.deviceMonthly ?? selectedDevice.installment;
      const bounded = Math.min(Math.max(1, newRate), selectedDevice.installment);
      setRate(bounded);
    }
  }, [sel, selectedDevice, current.deviceMonthly]);

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
  const monthlyCost = pay === "installments" ? Math.max(0, rate - walletUse) : 0;
  const onetimeCost = pay === "upfront" ? Math.max(0, (selectedDevice?.upfront ?? 0) - walletUse) : 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="font-semibold">Odaberi uređaj</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-auto flex-1">
            {/* Device selection */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {devices.map((d) => (
                <label
                  key={d.id}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                    sel === d.id
                      ? "ring-2 ring-primary border-primary bg-accent/50"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{d.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{d.brand}</div>
                      <div className="text-sm">{d.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Jednokratno: €{d.upfront} / Rate: €{d.installment}/mj
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="device"
                      checked={sel === d.id}
                      onChange={() => setSel(d.id)}
                      className="mt-1"
                    />
                  </div>
                </label>
              ))}
            </div>

            {selectedDevice && selectedDevice.id !== "no-dev" && (
              <>
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

                {/* Wallet application */}
                <div className="rounded-2xl border border-border bg-card p-4 mb-4">
                  <h4 className="text-sm font-semibold mb-3">Primjena A1 Walleta</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">
                        Iznos za primjenu (€)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={walletUse}
                        onChange={(e) => setWalletUseClamped(parseFloat(e.target.value))}
                        className="w-full rounded-xl border border-border p-3 bg-background outline-none focus:border-primary transition-colors"
                      />
                      <div className="mt-2 text-xs text-muted-foreground">
                        Maksimalno za ovu liniju: €{maxWallet.toFixed(0)}{" "}
                        {pay === "upfront" ? "(umanjuje jednokratno)" : "(umanjuje mjesečno)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost preview */}
                <div className="rounded-xl border border-primary/30 bg-accent/30 p-4">
                  <div className="text-xs text-muted-foreground mb-2">Pregled troška:</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mjesečno</span>
                    <span className="text-lg font-bold">€{monthlyCost.toFixed(2)}</span>
                  </div>
                  {onetimeCost > 0 && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                      <span className="text-sm">Jednokratno</span>
                      <span className="text-lg font-bold">€{onetimeCost.toFixed(2)}</span>
                    </div>
                  )}
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
              onClick={() => onSave(sel, pay, rate, walletUse)}
              disabled={!sel}
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
