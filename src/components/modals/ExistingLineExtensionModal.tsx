import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockExistingLines } from "@/data/mock-existing-lines";
import type { Line } from "@/types";

type ExistingLineExtensionModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (data: Partial<Line>) => void;
};

export function ExistingLineExtensionModal({ current, onClose, onSave }: ExistingLineExtensionModalProps) {
  const [selectedLineId, setSelectedLineId] = useState<string | undefined>(current.existingLineId);

  const handleSave = () => {
    onSave({ existingLineId: selectedLineId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold">Produljenje postojeće linije</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Zatvori"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Odaberite liniju koju želite produžiti. Klikom na liniju označavate je za produljenje.
          </p>
          
          {mockExistingLines.map((line) => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedLineId === line.id
                  ? "ring-2 ring-primary border-primary bg-accent/50"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-semibold text-lg">{line.number}</div>
                  <div className="text-sm text-muted-foreground">Tarifa: {line.tariff}</div>
                  <div className="text-sm text-muted-foreground">Istječe: {line.expires}</div>
                </div>
                {selectedLineId === line.id && (
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Odustani
          </Button>
          <Button onClick={handleSave} disabled={!selectedLineId}>
            Spremi
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
