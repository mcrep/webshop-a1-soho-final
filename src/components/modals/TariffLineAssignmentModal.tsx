import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Check, Phone, X } from "lucide-react";
import type { Tariff } from "@/types";
import { cn } from "@/lib/utils";

export type LineForAssignment = {
  id: string;
  label: string; // "Linija 1" or MSISDN
  isExtension: boolean;
  currentTariff?: string; // Only for extension lines
  assignedTariffId: string | null;
};

type TariffLineAssignmentModalProps = {
  onOpenChange: (open: boolean) => void;
  tariff: Tariff;
  lines: LineForAssignment[];
  onAssignLines: (tariffId: string, lineIds: string[]) => void;
};

export function TariffLineAssignmentModal({
  onOpenChange,
  tariff,
  lines,
  onAssignLines,
}: TariffLineAssignmentModalProps) {
  // Lines currently assigned to this tariff
  const currentlyAssigned = lines.filter(l => l.assignedTariffId === tariff.id).map(l => l.id);
  
  // Track selected lines (starts with currently assigned)
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>(currentlyAssigned);

  // Reset selection when modal opens (modal is mounted only when open)
  useEffect(() => {
    setSelectedLineIds(currentlyAssigned);
  }, [tariff.id, currentlyAssigned.join(",")]);

  const toggleLine = (lineId: string) => {
    setSelectedLineIds(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId)
        : [...prev, lineId]
    );
  };

  const handleConfirm = () => {
    onAssignLines(tariff.id, selectedLineIds);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Available lines: unassigned OR assigned to this tariff
  const availableLines = lines.filter(l => l.assignedTariffId === null || l.assignedTariffId === tariff.id);
  const newLines = availableLines.filter(l => !l.isExtension);
  const extensionLinesList = availableLines.filter(l => l.isExtension);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Phone className="h-6 w-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-xl font-bold">{tariff.name}</h2>
              <p className="text-sm opacity-90">
                {tariff.monthly.toFixed(2)}€/mj
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-muted-foreground mb-6">
            Odaberite linije koje želite dodijeliti ovoj tarifi:
          </p>

          {availableLines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Sve linije su već dodijeljene drugim tarifama.
            </div>
          ) : (
            <div className="space-y-4">
              {/* New Lines */}
              {newLines.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Nove linije</h4>
                  <div className="space-y-2">
                    {newLines.map((line, index) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                      >
                        <LineCheckbox
                          line={line}
                          isSelected={selectedLineIds.includes(line.id)}
                          onToggle={() => toggleLine(line.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extension Lines */}
              {extensionLinesList.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Produljenje postojećih linija</h4>
                  <div className="space-y-2">
                    {extensionLinesList.map((line, index) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + (newLines.length + index) * 0.05 }}
                      >
                        <LineCheckbox
                          line={line}
                          isSelected={selectedLineIds.includes(line.id)}
                          onToggle={() => toggleLine(line.id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="p-6 pt-0 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Odustani
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Potvrdi ({selectedLineIds.length})
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function LineCheckbox({ 
  line, 
  isSelected, 
  onToggle 
}: { 
  line: LineForAssignment; 
  isSelected: boolean; 
  onToggle: () => void;
}) {
  return (
    <motion.div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/30 hover:bg-accent/50"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      animate={isSelected ? { 
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.05)"
      } : {}}
      transition={{ duration: 0.15 }}
    >
      <Checkbox 
        checked={isSelected} 
        onCheckedChange={onToggle}
        className="pointer-events-none"
      />
      <div className="flex-1">
        <div className="font-medium">{line.label}</div>
        {line.currentTariff && (
          <div className="text-xs text-muted-foreground">
            Trenutna tarifa: {line.currentTariff}
          </div>
        )}
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="h-5 w-5 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
