import { X } from "lucide-react";
import { lineTypes } from "@/data/catalog";

type Props = {
  currentLineType?: string;
  onClose: () => void;
  onSelect: (lineType: string) => void;
};

export function LineTypeSelectionModal({ currentLineType, onClose, onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Odaberi vrstu linije</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
            aria-label="Zatvori"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {lineTypes.map((lt) => (
            <button
              key={lt.id}
              onClick={() => onSelect(lt.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                currentLineType === lt.id
                  ? "ring-2 ring-primary border-primary bg-accent/50"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="font-medium">{lt.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
