import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";

type Step2Props = {
  totalWallet: number;
  onNext: () => void;
  onBack: () => void;
};

export function Step2WalletSummary({ totalWallet, onNext, onBack }: Step2Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">A1 Wallet Kredit</h1>
        <p className="text-muted-foreground">Korak 2 od 4 - Vaš ukupan kredit za popuste</p>
      </div>

      <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-12 shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 grid place-items-center">
            <Wallet size={40} className="text-primary" />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-6xl font-bold text-primary mb-2">
            €{totalWallet.toFixed(2)}
          </div>
          <div className="text-xl text-muted-foreground">Ukupan A1 Wallet kredit</div>
        </div>

        <div className="max-w-md mx-auto mt-8 p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-semibold mb-3 text-lg">Što možete raditi s A1 Wallet kreditom?</h3>
          <ul className="space-y-2 text-sm text-left text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Koristite kredit za popust na uređaje koje želite</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Smanjite mjesečne rate ili jednokratnu cijenu uređaja</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Slobodno rasporedite kredit između svih linija</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} size="lg">
          Nastavi na uređaje
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
