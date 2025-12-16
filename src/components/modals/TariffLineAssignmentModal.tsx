import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Check, Phone } from "lucide-react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff: Tariff;
  lines: LineForAssignment[];
  onAssignLines: (tariffId: string, lineIds: string[]) => void;
};

export function TariffLineAssignmentModal({
  open,
  onOpenChange,
  tariff,
  lines,
  onAssignLines,
}: TariffLineAssignmentModalProps) {
  // Lines currently assigned to this tariff
  const currentlyAssigned = lines.filter(l => l.assignedTariffId === tariff.id).map(l => l.id);
  
  // Track selected lines (starts with currently assigned)
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>(currentlyAssigned);

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedLineIds(currentlyAssigned);
    }
  }, [open, currentlyAssigned.join(',')]);

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

  // Available lines: unassigned OR assigned to this tariff
  const availableLines = lines.filter(l => l.assignedTariffId === null || l.assignedTariffId === tariff.id);
  const newLines = availableLines.filter(l => !l.isExtension);
  const extensionLinesList = availableLines.filter(l => l.isExtension);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-lg overflow-hidden" forceMount asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30,
                mass: 0.8
              }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <motion.div 
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Phone className="h-5 w-5 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="text-xl font-bold">{tariff.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      €{tariff.monthly.toFixed(2)}/mj • +€{tariff.walletCredit} A1 Wallet
                    </div>
                  </motion.div>
                </DialogTitle>
              </DialogHeader>

              <motion.div 
                className="py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-muted-foreground mb-4">
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

              <DialogFooter className="gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-2 w-full sm:w-auto"
                >
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Odustani
                  </Button>
                  <Button onClick={handleConfirm}>
                    Potvrdi ({selectedLineIds.length})
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
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
      <Badge variant={line.isExtension ? "default" : "secondary"} className="text-xs">
        {line.isExtension ? "Produljenje" : "Nova"}
      </Badge>
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
