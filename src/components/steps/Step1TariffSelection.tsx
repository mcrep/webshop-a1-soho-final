import { Minus, Plus } from "lucide-react";
import { tariffs } from "@/data/catalog";
import { Button } from "@/components/ui/button";

type TariffQuantity = {
  tariffId: string;
  quantity: number;
};

type Step1Props = {
  tariffQuantities: TariffQuantity[];
  onUpdateQuantity: (tariffId: string, delta: number) => void;
  onNext: () => void;
};

export function Step1TariffSelection({ tariffQuantities, onUpdateQuantity, onNext }: Step1Props) {
  const totalLines = tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0);
  const canProceed = totalLines > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Odaberite tarife</h1>
        <p className="text-muted-foreground">Korak 1 od 4 - Odaberite koliko linija želite za svaku tarifu</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tariffs.map((tariff) => {
          const tq = tariffQuantities.find((t) => t.tariffId === tariff.id);
          const quantity = tq?.quantity ?? 0;

          return (
            <div
              key={tariff.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
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
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">A1 Wallet:</span>
                  <span className="font-medium text-primary">€{tariff.walletCredit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(tariff.id, -1)}
                  disabled={quantity === 0}
                  className="h-10 w-10"
                >
                  <Minus size={18} />
                </Button>
                <div className="text-2xl font-bold min-w-[40px] text-center">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(tariff.id, 1)}
                  className="h-10 w-10"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-lg">
          <span className="text-muted-foreground">Ukupno linija:</span>{" "}
          <span className="font-bold text-xl">{totalLines}</span>
        </div>
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Nastavi na A1 Wallet
        </Button>
      </div>
    </div>
  );
}
