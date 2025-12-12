import { Minus, Plus, Wifi, Phone, Globe } from "lucide-react";
import { tariffs } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ExtensionLineWithTariff } from "@/types";

type TariffQuantity = {
  tariffId: string;
  quantity: number;
};

type Step2Props = {
  tariffQuantities: TariffQuantity[];
  maxLines: number;
  extensionLines: ExtensionLineWithTariff[];
  onUpdateQuantity: (tariffId: string, delta: number) => void;
  onUpdateExtensionLineTariff: (lineId: string, tariffId: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2TariffSelection({ 
  tariffQuantities, 
  maxLines, 
  extensionLines,
  onUpdateQuantity, 
  onUpdateExtensionLineTariff,
  onNext, 
  onBack 
}: Step2Props) {
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

  // Calculate lines for new tariffs (maxLines - extension lines)
  const newLinesMax = maxLines - extensionLines.length;
  const totalNewLines = tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0);
  const allExtensionLinesHaveTariff = extensionLines.every(line => line.newTariffId !== null);
  const canProceed = totalNewLines === newLinesMax && allExtensionLinesHaveTariff;
  const canAddMore = totalNewLines < newLinesMax;

  // Title logic
  const remainingExtensionLines = extensionLines.filter(l => !l.newTariffId).length;
  const remainingNewLines = newLinesMax - totalNewLines;
  const totalRemaining = remainingExtensionLines + remainingNewLines;

  const getTitle = () => {
    if (canProceed) return "Odabrane tarife";
    if (totalRemaining === 1) return `Odaberite još 1 tarifu`;
    return `Odaberite još ${totalRemaining} tarifa`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
      </div>

      {/* Extension Lines Section */}
      {extensionLines.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Produljenje postojećih linija</h2>
          <div className="space-y-3">
            {extensionLines.map((line) => (
              <div 
                key={line.lineId}
                className={cn(
                  "flex items-center justify-between gap-4 p-4 rounded-xl border-2 bg-card transition-all",
                  line.newTariffId ? "border-primary" : "border-border"
                )}
              >
                <div className="flex-1">
                  <div className="font-semibold">{line.msisdn}</div>
                  <div className="text-sm text-muted-foreground">
                    Trenutna tarifa: {line.currentTariff}
                  </div>
                </div>
                <div className="w-64">
                  <Select
                    value={line.newTariffId ?? ""}
                    onValueChange={(value) => onUpdateExtensionLineTariff(line.lineId, value)}
                  >
                    <SelectTrigger className={cn(
                      "w-full",
                      !line.newTariffId && "border-destructive"
                    )}>
                      <SelectValue placeholder="Odaberi novu tarifu" />
                    </SelectTrigger>
                    <SelectContent>
                      {tariffs.map((tariff) => (
                        <SelectItem key={tariff.id} value={tariff.id}>
                          <div className="flex items-center justify-between gap-4">
                            <span>{tariff.name}</span>
                            <span className="text-muted-foreground">€{tariff.monthly.toFixed(2)}/mj</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Lines Section */}
      {newLinesMax > 0 && (
        <>
          {extensionLines.length > 0 && (
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Nove linije ({totalNewLines}/{newLinesMax})</h2>
          )}
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="pl-4">
              {displayedTariffs.map((tariff) => {
                const tq = tariffQuantities.find((t) => t.tariffId === tariff.id);
                const quantity = tq?.quantity ?? 0;
                const canIncrease = totalNewLines < newLinesMax;

                return (
                  <CarouselItem key={tariff.id} className="p-4 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className={cn(
                        "rounded-2xl border-2 bg-card p-6 shadow-sm transition-all relative h-full cursor-pointer",
                        quantity > 0 ? "border-primary" : "border-border hover:border-primary/30 hover:bg-accent/50"
                      )}
                      onClick={() => canIncrease && onUpdateQuantity(tariff.id, 1)}
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

                      {/* Centered quantity controls in framed container */}
                      <div className="flex justify-center mt-6">
                        <div className="inline-flex items-center gap-4 bg-muted/50 border border-border rounded-full px-4 py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity(tariff.id, -1);
                            }}
                            disabled={quantity === 0}
                            className="h-10 w-10 rounded-full hover:bg-background"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <div className="text-2xl font-bold min-w-[40px] text-center">{quantity}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity(tariff.id, 1);
                            }}
                            disabled={!canIncrease}
                            className="h-10 w-10 rounded-full hover:bg-background"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-16 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
            <CarouselNext className="right-0 translate-x-16 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
          </Carousel>
        </>
      )}
    </div>
  );
}
