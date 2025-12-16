import { useState, useEffect } from "react";
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">{tariff.name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                €{tariff.monthly.toFixed(2)}/mj • +€{tariff.walletCredit} A1 Wallet
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
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
                    {newLines.map(line => (
                      <LineCheckbox
                        key={line.id}
                        line={line}
                        isSelected={selectedLineIds.includes(line.id)}
                        onToggle={() => toggleLine(line.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Extension Lines */}
              {extensionLinesList.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Produljenje postojećih linija</h4>
                  <div className="space-y-2">
                    {extensionLinesList.map(line => (
                      <LineCheckbox
                        key={line.id}
                        line={line}
                        isSelected={selectedLineIds.includes(line.id)}
                        onToggle={() => toggleLine(line.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Odustani
          </Button>
          <Button onClick={handleConfirm}>
            Potvrdi ({selectedLineIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
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
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/30 hover:bg-accent/50"
      )}
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
      {isSelected && (
        <Check className="h-5 w-5 text-primary" />
      )}
    </div>
  );
}
