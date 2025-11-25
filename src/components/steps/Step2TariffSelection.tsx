import { Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { tariffs } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
        <h1 className="text-3xl font-bold mb-2">Odaberite tarife</h1>
        <p className="text-muted-foreground">Korak 2 od 4 - Odaberite točno {maxLines} {maxLines === 1 ? 'liniju' : 'linija'}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Odabrane linije:</span>
          <span className="text-xl font-bold">
            {totalLines} / {maxLines}
          </span>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {displayedTariffs.map((tariff) => {
            const tq = tariffQuantities.find((t) => t.tariffId === tariff.id);
            const quantity = tq?.quantity ?? 0;
            const canIncrease = totalLines < maxLines;

            return (
              <CarouselItem key={tariff.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative h-full">
                  <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    +€{tariff.walletCredit} A1 Wallet
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tariff.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-3">
                    €{tariff.monthly.toFixed(2)}<span className="text-sm text-muted-foreground">/mj</span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Internet:</span>
                      <span className="font-medium">{tariff.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Pozivi:</span>
                      <span className="font-medium">{tariff.voice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Roaming:</span>
                      <span className="font-medium">{tariff.roaming}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(tariff.id, -1)}
                      disabled={quantity === 0}
                      className="h-12 w-12 rounded-full"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <div className="text-2xl font-bold min-w-[40px] text-center">{quantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(tariff.id, 1)}
                      disabled={!canIncrease}
                      className="h-12 w-12 rounded-full"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-12 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
        <CarouselNext className="right-0 translate-x-12 h-12 w-12 bg-primary/10 hover:bg-primary/20" />
      </Carousel>
    </div>
  );
}
