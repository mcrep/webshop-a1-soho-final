import { useState } from "react";
import { addons } from "@/data/catalog";
import type { Line } from "@/types";

type AddonsModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (ids: string[]) => void;
};

export function AddonsModal({ current, onClose, onSave }: AddonsModalProps) {
  const [sel, setSel] = useState<string[]>(current.addonIds ?? []);
  const toggle = (id: string) =>
    setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="font-semibold">Dodatne opcije</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
            {addons.map((a) => (
              <label
                key={a.id}
                className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                  sel.includes(a.id)
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">€{a.monthly.toFixed(2)}/mj</div>
                <input
                  type="checkbox"
                  className="mt-2"
                  checked={sel.includes(a.id)}
                  onChange={() => toggle(a.id)}
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
              onClick={() => onSave(sel)}
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
