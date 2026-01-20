import { useState } from "react";
import { Wifi, Phone, Globe, Users, X, Scale, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tariffs } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TariffLineAssignmentModal, type LineForAssignment } from "@/components/modals/TariffLineAssignmentModal";
import { CompareTariffsModal } from "@/components/modals/CompareTariffsModal";
import { StatusNotification } from "@/components/StatusNotification";
import type { ExtensionLineWithTariff } from "@/types";

type LineAssignment = {
  lineId: string;
  tariffId: string | null;
};

type Step2Props = {
  numberOfLines: number;
  extensionLines: ExtensionLineWithTariff[];
  lineAssignments: LineAssignment[];
  onUpdateLineAssignments: (assignments: LineAssignment[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2TariffSelection({ 
  numberOfLines,
  extensionLines,
  lineAssignments,
  onUpdateLineAssignments,
  onNext, 
  onBack 
}: Step2Props) {
  const [selectedTariffId, setSelectedTariffId] = useState<string | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [shakingTariffId, setShakingTariffId] = useState<string | null>(null);

  const handleDisabledClick = (tariffId: string) => {
    setShakingTariffId(tariffId);
    setTimeout(() => setShakingTariffId(null), 500);
  };

  // Sort tariffs from most expensive to cheapest (by original price)
  const displayedTariffs = [...tariffs].sort((a, b) => {
    const aPrice = a.originalMonthly ?? a.monthly;
    const bPrice = b.originalMonthly ?? b.monthly;
    return bPrice - aPrice;
  });

  // Build lines for assignment modal
  const allLines: LineForAssignment[] = [
    // New lines
    ...Array.from({ length: numberOfLines }, (_, i) => ({
      id: `new-line-${i + 1}`,
      label: `Linija ${i + 1}`,
      isExtension: false,
      assignedTariffId: lineAssignments.find(a => a.lineId === `new-line-${i + 1}`)?.tariffId ?? null,
    })),
    // Extension lines
    ...extensionLines.map(ext => ({
      id: ext.lineId,
      label: ext.msisdn,
      isExtension: true,
      currentTariff: ext.currentTariff,
      assignedTariffId: lineAssignments.find(a => a.lineId === ext.lineId)?.tariffId ?? null,
    })),
  ];

  // Count unassigned lines
  const unassignedLines = allLines.filter(l => l.assignedTariffId === null);
  const totalLines = allLines.length;
  const assignedCount = totalLines - unassignedLines.length;
  const isSingleLine = totalLines === 1;

  // Handle tariff click - simplified for single line
  const handleTariffClick = (tariffId: string, isDisabled: boolean, hasAssignments: boolean) => {
    if (isDisabled) {
      handleDisabledClick(tariffId);
      return;
    }
    
    // Single line: directly assign if unassigned, otherwise open modal to allow removal
    if (isSingleLine) {
      const singleLineId = allLines[0].id;
      const currentAssignment = lineAssignments.find(a => a.lineId === singleLineId);
      
      // If already assigned to this tariff, open modal to allow removal
      if (currentAssignment?.tariffId === tariffId) {
        setSelectedTariffId(tariffId);
        return;
      }
      
      // Otherwise directly assign
      onUpdateLineAssignments([{ lineId: singleLineId, tariffId }]);
      return;
    }
    
    // Multiple lines: open modal
    setSelectedTariffId(tariffId);
  };

  // Handle line assignment from modal
  const handleAssignLines = (tariffId: string, lineIds: string[]) => {
    // Get all line IDs that are NOT being assigned to this tariff
    const otherAssignments = lineAssignments.filter(a => !lineIds.includes(a.lineId) && a.tariffId !== tariffId);
    
    // Add the new assignments for this tariff
    const newAssignments: LineAssignment[] = [
      ...otherAssignments,
      ...lineIds.map(lineId => ({ lineId, tariffId })),
    ];

    // Also include lines that were assigned to this tariff but are now being unassigned (set to null)
    const previouslyAssignedToThisTariff = lineAssignments
      .filter(a => a.tariffId === tariffId && !lineIds.includes(a.lineId))
      .map(a => ({ lineId: a.lineId, tariffId: null as string | null }));

    onUpdateLineAssignments([...newAssignments, ...previouslyAssignedToThisTariff].filter(a => a.tariffId !== null) as LineAssignment[]);
  };

  // Remove a single line from its tariff
  const handleRemoveLine = (lineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLineAssignments(lineAssignments.filter(a => a.lineId !== lineId));
  };

  // Get count of lines assigned to each tariff
  const getAssignedCount = (tariffId: string) => {
    return lineAssignments.filter(a => a.tariffId === tariffId).length;
  };

  // Title logic with Croatian declension
  const getLineDeclension = (count: number) => {
    if (count === 1) return "1 mobilnu liniju";
    if (count >= 2 && count <= 4) return `${count} mobilne linije`;
    return `${count} mobilnih linija`;
  };

  const isComplete = assignedCount === totalLines;
  const statusMessage = isComplete 
    ? "Odabrali ste tarife za sve linije!" 
    : `Molimo odaberite tarifu za ${getLineDeclension(unassignedLines.length)} prije završetka narudžbe.`;

  const selectedTariff = tariffs.find(t => t.id === selectedTariffId);

  return (
    <div className="w-full">
      {/* Tariff Cards Container */}
      <div className="bg-card rounded-2xl p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dodijeli linije
          </h2>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowCompareModal(true)}
          >
            <Scale className="h-4 w-4" />
            Usporedi tarife
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTariffs.map((tariff) => {
              const assignedToThis = getAssignedCount(tariff.id);
              const hasAssignments = assignedToThis > 0;
              const allLinesAssigned = unassignedLines.length === 0;
              const isDisabled = allLinesAssigned && !hasAssignments;

              return (
                <motion.div 
                  key={tariff.id}
                  className={cn(
                    "rounded-2xl border-2 bg-card p-6 shadow-sm relative h-full transition-all duration-300",
                    isDisabled 
                      ? "cursor-not-allowed border-border" 
                      : hasAssignments 
                        ? "border-primary cursor-pointer" 
                        : "border-border hover:border-primary/50 cursor-pointer",
                    shakingTariffId === tariff.id && "animate-shake"
                  )}
                  animate={{
                    opacity: isDisabled ? 0.5 : 1,
                    scale: isDisabled ? 0.98 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => handleTariffClick(tariff.id, isDisabled, hasAssignments)}
                >
                  {/* Savings Badge - Top Left */}
                  {tariff.originalMonthly && tariff.originalMonthly > tariff.monthly && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      <Tag className="h-3 w-3" />
                      Ušteda {((tariff.originalMonthly - tariff.monthly) / tariff.originalMonthly * 100).toFixed(0)}%
                    </div>
                  )}
                  
                  {/* Wallet Badge - Top Right */}
                  <div className="absolute top-4 right-4 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    +{tariff.walletCredit}€ A1 Wallet
                  </div>
                  <h3 className="text-xl font-bold mb-2 mt-6">{tariff.name}</h3>
                  
                  {/* Price Display */}
                  <div className="mb-3">
                    {tariff.originalMonthly && tariff.originalMonthly > tariff.monthly && (
                      <div className="text-sm text-muted-foreground line-through">
                        {tariff.originalMonthly.toFixed(2)}€/mj
                      </div>
                    )}
                    <div className="text-2xl font-bold text-primary">
                      {tariff.monthly.toFixed(2)}€<span className="text-sm text-muted-foreground font-normal">/mj</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tariff.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tariff.voice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{tariff.roaming}</span>
                    </div>
                  </div>

                  {/* Assignment indicator - only show when has assignments */}
                  {hasAssignments && (
                    <div className="flex justify-center mt-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground">
                        <Users className="h-4 w-4" />
                        <span className="font-semibold text-sm">
                          {assignedToThis} {assignedToThis === 1 ? 'linija' : assignedToThis < 5 ? 'linije' : 'linija'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Show assigned lines preview */}
                  {hasAssignments && (
                    <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-1.5">
                        <AnimatePresence mode="popLayout">
                          {lineAssignments
                            .filter(a => a.tariffId === tariff.id)
                            .map(a => {
                              const line = allLines.find(l => l.id === a.lineId);
                              return (
                                <motion.div
                                  key={a.lineId}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  layout
                                >
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs pr-1 flex items-center gap-1"
                                  >
                                    {line?.label}
                                    <button
                                      onClick={(e) => handleRemoveLine(a.lineId, e)}
                                      className="ml-0.5 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                </motion.div>
                              );
                            })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {selectedTariffId && selectedTariff && (
          <TariffLineAssignmentModal
            onOpenChange={(open) => !open && setSelectedTariffId(null)}
            tariff={selectedTariff}
            lines={allLines}
            onAssignLines={handleAssignLines}
          />
        )}
      </AnimatePresence>

      {/* Compare Tariffs Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <CompareTariffsModal 
            open={showCompareModal} 
            onOpenChange={setShowCompareModal} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
