import { useState } from "react";
import { Wifi, Phone, Globe, Users, AlertCircle } from "lucide-react";
import { tariffs } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { TariffLineAssignmentModal, type LineForAssignment } from "@/components/modals/TariffLineAssignmentModal";
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

  // Sort tariffs to show Perfect, Ideal, and Master Biz first
  const displayedTariffs = [...tariffs].sort((a, b) => {
    const priority = ['perfect-biz', 'ideal-biz', 'master-biz'];
    const aIndex = priority.indexOf(a.id);
    const bIndex = priority.indexOf(b.id);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
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

  // Get count of lines assigned to each tariff
  const getAssignedCount = (tariffId: string) => {
    return lineAssignments.filter(a => a.tariffId === tariffId).length;
  };

  // Title logic
  const getTitle = () => {
    if (assignedCount === totalLines) return "Odabrane tarife";
    if (unassignedLines.length === 1) return `Dodijelite tarifu za još 1 liniju`;
    return `Dodijelite tarife za još ${unassignedLines.length} linija`;
  };

  const selectedTariff = tariffs.find(t => t.id === selectedTariffId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
      </div>

      {/* Unassigned Lines Warning */}
      {unassignedLines.length > 0 && (
        <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium mb-2">Linije bez tarife:</div>
              <div className="flex flex-wrap gap-2">
                {unassignedLines.map(line => (
                  <Badge 
                    key={line.id} 
                    variant={line.isExtension ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {line.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tariff Cards */}
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="pl-4">
          {displayedTariffs.map((tariff) => {
            const assignedToThis = getAssignedCount(tariff.id);
            const hasAssignments = assignedToThis > 0;

            return (
              <CarouselItem key={tariff.id} className="p-4 md:basis-1/2 lg:basis-1/3">
                <div 
                  className={cn(
                    "rounded-2xl border-2 bg-card p-6 shadow-sm transition-all relative h-full cursor-pointer",
                    hasAssignments ? "border-primary" : "border-border hover:border-primary/30 hover:bg-accent/50"
                  )}
                  onClick={() => setSelectedTariffId(tariff.id)}
                >
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    +€{tariff.walletCredit} A1 Wallet
                  </div>
                  {tariff.id === 'perfect-biz' && (
                    <Badge className="absolute top-4 left-4 bg-gray-500 text-white hover:bg-gray-600">
                      Preporučeno
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold mb-2 mt-6">{tariff.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-3">
                    €{tariff.monthly.toFixed(2)}<span className="text-sm text-muted-foreground">/mj</span>
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

                  {/* Assignment indicator */}
                  <div className="flex justify-center mt-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                      hasAssignments 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted/50 border border-border text-muted-foreground"
                    )}>
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">
                        {hasAssignments 
                          ? `${assignedToThis} ${assignedToThis === 1 ? 'linija' : assignedToThis < 5 ? 'linije' : 'linija'}`
                          : 'Dodijeli linije'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Show assigned lines preview */}
                  {hasAssignments && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-1.5">
                        {lineAssignments
                          .filter(a => a.tariffId === tariff.id)
                          .map(a => {
                            const line = allLines.find(l => l.id === a.lineId);
                            return (
                              <Badge 
                                key={a.lineId} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {line?.label}
                              </Badge>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-16 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
        <CarouselNext className="right-0 translate-x-16 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
      </Carousel>

      {/* Assignment Modal */}
      {selectedTariff && (
        <TariffLineAssignmentModal
          open={selectedTariffId !== null}
          onOpenChange={(open) => !open && setSelectedTariffId(null)}
          tariff={selectedTariff}
          lines={allLines}
          onAssignLines={handleAssignLines}
        />
      )}
    </div>
  );
}
