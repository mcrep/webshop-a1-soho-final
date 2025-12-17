import { useState } from "react";
import { X, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-[60]">
      <motion.div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div 
          className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold">Odaberi linije za produljenje</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Zatvori"
            >
              <X size={20} />
            </button>
          </div>

          <motion.div 
            className="p-6 space-y-4"
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
              Odaberite jednu ili više linija koje želite produžiti. Možete odabrati više linija.
            </motion.p>

            {mockExistingLines.map((line, index) => (
              <motion.button
                key={line.id}
                onClick={() => handleToggleLine(line.id)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  selected.includes(line.id)
                    ? "border-primary"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold text-lg">{line.number}</div>
                    <div className="text-sm text-muted-foreground">Tarifa: {line.tariff}</div>
                    <div className="text-sm text-muted-foreground">Istječe: {line.expires}</div>
                  </div>
                  {selected.includes(line.id) && (
                    <motion.div 
                      className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                      <Check size={16} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3 justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Odabrano: {selected.length} {selected.length === 1 ? "linija" : "linija"}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Odustani
              </Button>
              <Button onClick={handleSave}>
                Spremi ({selected.length})
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
