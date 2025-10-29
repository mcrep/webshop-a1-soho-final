import { useState, useMemo, useEffect } from "react";
import { devices } from "@/data/catalog";
import type { Line } from "@/types";

type DeviceModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (deviceId: string, pay: "installments" | "upfront", rate: number) => void;
};

export function DeviceModal({ current, onClose, onSave }: DeviceModalProps) {
  const [sel, setSel] = useState(current.deviceId ?? "no-dev");
  const [pay, setPay] = useState<"installments" | "upfront">(current.devicePayment ?? "installments");
  
  const initialInstall = useMemo(() => {
    const d = devices.find((x) => x.id === sel);
    const base = d?.installment ?? 1;
    return Math.min(28, Math.max(1, base));
  }, [sel]);
  
  const [rate, setRate] = useState<number>(current.deviceMonthly ?? initialInstall);
  
  useEffect(() => {
    const d = devices.find((x) => x.id === sel);
    const base = d?.installment ?? 1;
    setRate((prev) => (current.deviceMonthly != null ? prev : Math.min(28, Math.max(1, base))));
  }, [sel, current.deviceMonthly]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-border">
            <div className="font-semibold">Odaberi uređaj</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-auto">
            {devices.map((d) => (
              <label
                key={d.id}
                className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                  sel === d.id
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="text-3xl">{d.emoji}</div>
                <div className="text-sm text-muted-foreground">{d.brand}</div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">
                  Jednokratno: €{d.upfront} • Rate: €{d.installment}/mj
                </div>
                <input
                  type="radio"
                  name="devicePick"
                  className="mt-2"
                  checked={sel === d.id}
                  onChange={() => setSel(d.id)}
                />
              </label>
            ))}
          </div>
          <div className="border-t border-border p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-3 text-sm flex-1">
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="devpay"
                    checked={pay === "installments"}
                    onChange={() => setPay("installments")}
                  />
                  <span>Na rate</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="devpay"
                    checked={pay === "upfront"}
                    onChange={() => setPay("upfront")}
                  />
                  <span>Jednokratno</span>
                </label>
              </div>
              {pay === "installments" && sel !== "no-dev" && (
                <div className="rounded-xl border border-border p-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span>Iznos rate</span>
                    <span className="font-semibold">€{rate}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={28}
                    step={1}
                    value={rate}
                    onChange={(e) => setRate(parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Podesi mjesečni iznos rate između €1 i €28.
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={onClose}
                className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Odustani
              </button>
              <button
                onClick={() => onSave(sel, pay, rate)}
                className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                Spremi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
