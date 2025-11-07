import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";

type Step3Props = {
  totalWallet: number;
  onNext: () => void;
  onBack: () => void;
};

export function Step3WalletSummary({ totalWallet, onNext, onBack }: Step3Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">A1 Wallet</h1>
        <p className="text-muted-foreground">Korak 3 od 5 - Vaš kredit za kupnju uređaja</p>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-12 shadow-lg text-center">
        <Wallet className="w-16 h-16 mx-auto mb-6 text-primary" />
        <div className="text-6xl font-bold text-primary mb-4">
          €{totalWallet.toFixed(2)}
        </div>
        <p className="text-lg text-muted-foreground">
          Ukupan A1 Wallet kredit
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-bold mb-3">Što možete raditi s A1 Wallet kreditom?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Koristite ga za snižavanje cijene uređaja</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Možete ga iskoristiti odmah ili poslije</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Slobodno ga rasporedite na više uređaja</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} size="lg">
          Nastavi na odabir uređaja
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
