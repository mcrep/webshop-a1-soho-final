import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

type Step1Props = {
  customerType: "new" | "existing" | null;
  numberOfLines: number;
  numberOfDevices: number;
  onUpdateCustomerType: (type: "new" | "existing") => void;
  onUpdateNumberOfLines: (num: number) => void;
  onUpdateNumberOfDevices: (num: number) => void;
  onNext: () => void;
};

export function Step1CustomerInfo({
  customerType,
  numberOfLines,
  numberOfDevices,
  onUpdateCustomerType,
  onUpdateNumberOfLines,
  onUpdateNumberOfDevices,
  onNext,
}: Step1Props) {
  const canProceed = customerType !== null && numberOfLines > 0 && numberOfDevices > 0 && numberOfDevices <= numberOfLines;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Dobrodošli</h1>
        <p className="text-muted-foreground">Korak 1 od 5 - Recite nam što trebate</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-lg leading-relaxed">
          <span className="text-foreground">Ja sam</span>
          
          <Select value={customerType || ""} onValueChange={(val) => onUpdateCustomerType(val as "new" | "existing")}>
            <SelectTrigger className="w-[180px] h-12 text-lg font-semibold">
              <SelectValue placeholder="odaberi..." />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="new">novi</SelectItem>
              <SelectItem value="existing">postojeći</SelectItem>
            </SelectContent>
          </Select>
          
          <span className="text-foreground">A1 korisnik. Želim aktivirati</span>
          
          <Input
            type="number"
            min="0"
            value={numberOfLines || ""}
            onChange={(e) => onUpdateNumberOfLines(parseInt(e.target.value) || 0)}
            className="w-24 h-12 text-center text-lg font-semibold"
            placeholder="0"
          />
          
          <span className="text-foreground">mobilnih linija i kupiti</span>
          
          <Input
            type="number"
            min="0"
            max={numberOfLines}
            value={numberOfDevices || ""}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              onUpdateNumberOfDevices(Math.min(val, numberOfLines));
            }}
            className="w-24 h-12 text-center text-lg font-semibold"
            placeholder="0"
          />
          
          <span className="text-foreground">mobilnih uređaja.</span>
        </div>

        {numberOfDevices > numberOfLines && (
          <div className="mt-4 text-sm text-destructive">
            Broj uređaja mora biti jednak ili manji od broja linija
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={onNext} disabled={!canProceed} size="lg">
          Nastavi na odabir tarifa
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
