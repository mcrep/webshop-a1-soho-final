import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Line } from "@/types";

type PrepaidToPostpaidModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (data: Partial<Line>) => void;
};

export function PrepaidToPostpaidModal({ current, onClose, onSave }: PrepaidToPostpaidModalProps) {
  const [prepaidNumber, setPrepaidNumber] = useState(current.prepaidNumber || "");

  const handleSave = () => {
    onSave({ prepaidNumber });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Prelazak s bonova na pretplatu</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Zatvori"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prepaidNumber">Broj na A1 ili Tomato bonovima</Label>
            <Input
              id="prepaidNumber"
              value={prepaidNumber}
              onChange={(e) => setPrepaidNumber(e.target.value)}
              placeholder="Unesite broj"
            />
            <p className="text-sm text-muted-foreground">
              Unesite broj koji se trenutno nalazi na A1 ili Tomato bonovima.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Odustani
          </Button>
          <Button onClick={handleSave}>
            Spremi
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
