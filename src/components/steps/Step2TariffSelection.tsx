import { Minus, Plus, Wifi, Phone, Globe } from "lucide-react";
import { tariffs } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type TariffQuantity = {
  tariffId: string;
  quantity: number;
};

type Step2Props = {
  tariffQuantities: TariffQuantity[];
  maxLines: number;
  onUpdateQuantity: (tariffId: string, delta: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2TariffSelection({ tariffQuantities, maxLines, onUpdateQuantity, onNext, onBack }: Step2Props) {
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

  const totalLines = tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0);
  const canProceed = totalLines === maxLines;
  const canAddMore = totalLines < maxLines;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-2">
          {canProceed ? "Odabrane tarife" : `Odaberite još ${maxLines - totalLines} ${maxLines - totalLines === 1 ? 'tarifu' : 'tarifa'}`}
        </h1>
        <p className="text-muted-foreground">Korak 2 od 4 - Odaberite točno {maxLines} {maxLines === 1 ? 'liniju' : 'linija'}</p>
      </div>


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
            const canIncrease = totalLines < maxLines;

            return (
              <CarouselItem key={tariff.id} className="p-4 md:basis-1/2 lg:basis-1/3">
                <div 
                  className={cn(
                    "rounded-2xl border-2 bg-card p-6 shadow-sm hover:shadow-md hover:scale-105 hover:border-primary/50 transition-all relative h-full cursor-pointer",
                    quantity > 0 ? "border-primary bg-primary/5" : "border-border"
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
    </div>
  );
}
