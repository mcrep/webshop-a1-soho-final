import { useState } from "react";
import { X, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { ExtensionLineWithTariff } from "@/types";

type ExtensionLine = {
  id: string;
  number: string;
  tariff: string;
  expires: string;
};

type ExtensionLinesModalProps = {
  onClose: () => void;
  onSave: (selectedLines: ExtensionLineWithTariff[]) => void;
  selectedLines: ExtensionLineWithTariff[];
};

// Mock data - zamijeni s pravim podacima iz API-ja
const mockExistingLines: ExtensionLine[] = [
  { id: "line-1", number: "385912345678", tariff: "Biz M", expires: "15.12.2025" },
  { id: "line-2", number: "385918765432", tariff: "Biz S", expires: "20.01.2026" },
  { id: "line-3", number: "385915551234", tariff: "Biz L Global", expires: "05.03.2026" },
  { id: "line-4", number: "385917778899", tariff: "Biz XL", expires: "10.02.2026" },
];

export function ExtensionLinesModal({ onClose, onSave, selectedLines }: ExtensionLinesModalProps) {
  const [selected, setSelected] = useState<string[]>(selectedLines.map(l => l.lineId));

  const handleToggleLine = (lineId: string) => {
    setSelected((prev) =>
      prev.includes(lineId) ? prev.filter((id) => id !== lineId) : [...prev, lineId]
    );
  };

  const handleSave = () => {
    const selectedWithTariffs: ExtensionLineWithTariff[] = selected.map(lineId => {
      const mockLine = mockExistingLines.find(l => l.id === lineId);
      const existing = selectedLines.find(l => l.lineId === lineId);
      return {
        lineId,
        msisdn: mockLine?.number ?? "",
        currentTariff: mockLine?.tariff ?? "",
        newTariffId: existing?.newTariffId ?? null,
      };
    });
    onSave(selectedWithTariffs);
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg mx-4 rounded-2xl bg-background shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Produljenje linija</h2>
              <p className="text-sm opacity-90">Odaberite linije za produljenje</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <motion.div 
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            <motion.p 
              className="text-sm text-muted-foreground mb-4"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Odaberite jednu ili više linija koje želite produžiti.
            </motion.p>

            {mockExistingLines.map((line) => (
              <motion.button
                key={line.id}
                onClick={() => handleToggleLine(line.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-all flex items-start gap-3 ${
                  selected.includes(line.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  selected.includes(line.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                }`}>
                  {selected.includes(line.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                      <Check size={14} />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{line.number}</div>
                  <div className="text-sm text-muted-foreground">Tarifa: {line.tariff}</div>
                  <div className="text-sm text-muted-foreground">Istječe: {line.expires}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-background">
          <div className="text-sm text-muted-foreground">
            Odabrano: {selected.length} {selected.length === 1 ? "linija" : "linija"}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-2xl">
              Odustani
            </Button>
            <Button onClick={handleSave} className="rounded-2xl">
              Spremi ({selected.length})
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
