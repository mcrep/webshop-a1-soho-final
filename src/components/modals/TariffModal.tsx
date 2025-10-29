import { useState } from "react";
import { tariffs } from "@/data/catalog";
import type { Line } from "@/types";

type TariffModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (tariffId: string) => void;
};

export function TariffModal({ current, onClose, onSave }: TariffModalProps) {
  const [selected, setSelected] = useState(current.tariffId ?? "");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-border">
            <div className="font-semibold text-lg">Odaberi tarifu</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-auto">
            {tariffs.map((t) => (
              <label
                key={t.id}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  selected === t.id
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t.data} • {t.voice}
                </div>
                <div className="text-xs text-muted-foreground/70">Roaming: {t.roaming}</div>
                <div className="text-xs text-muted-foreground mt-2">{t.desc}</div>
                <div className="mt-2 text-sm font-semibold">
                  €{t.monthly}/mj • +€{t.walletCredit} u Wallet
                </div>
                <input
                  type="radio"
                  name="tariffPick"
                  className="mt-2"
                  checked={selected === t.id}
                  onChange={() => setSelected(t.id)}
                />
              </label>
            ))}
          </div>
          <div className="border-t border-border p-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              Odustani
            </button>
            <button
              onClick={() => onSave(selected)}
              className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              Spremi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
