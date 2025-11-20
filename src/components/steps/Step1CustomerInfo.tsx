import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, UserPlus, Users, Smartphone, Minus, Plus } from "lucide-react";

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
  const canProceed = customerType !== null && numberOfLines > 0 && numberOfDevices >= 0 && numberOfDevices <= numberOfLines;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Configuration Cards */}
      <div className="space-y-6 mb-8">
        {/* Customer Type Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Tip korisnika</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onUpdateCustomerType("new")}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "new"
                    ? "border-primary bg-accent shadow-lg scale-[1.02]"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <UserPlus className={`h-8 w-8 mx-auto mb-3 ${customerType === "new" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-semibold ${customerType === "new" ? "text-accent-foreground" : "text-foreground"}`}>
                  Novi korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">Novi u A1 obitelji</p>
              </button>
              <button
                onClick={() => onUpdateCustomerType("existing")}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "existing"
                    ? "border-primary bg-accent shadow-lg scale-[1.02]"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <Users className={`h-8 w-8 mx-auto mb-3 ${customerType === "existing" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-semibold ${customerType === "existing" ? "text-accent-foreground" : "text-foreground"}`}>
                  Postojeći korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">Već dio A1 obitelji</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Number of Lines Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Broj mobilnih linija</h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfLines(Math.max(0, numberOfLines - 1))}
                disabled={numberOfLines <= 0}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-center min-w-[120px]">
                <p className="text-5xl font-bold text-primary">{numberOfLines}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {numberOfLines === 1 ? "linija" : "linija"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfLines(numberOfLines + 1)}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Number of Devices Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Broj mobilnih uređaja</h3>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfDevices(Math.max(0, numberOfDevices - 1))}
                disabled={numberOfDevices <= 0}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-center min-w-[120px]">
                <p className="text-5xl font-bold text-primary">{numberOfDevices}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {numberOfDevices === 1 ? "uređaj" : "uređaja"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfDevices(Math.min(numberOfLines, numberOfDevices + 1))}
                disabled={numberOfDevices >= numberOfLines}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            {numberOfDevices > numberOfLines && (
              <p className="text-sm text-destructive text-center mt-4">
                Broj uređaja ne može biti veći od broja linija
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 rounded-xl bg-accent/50">
          <p className="text-sm font-medium text-accent-foreground">Brza aktivacija</p>
          <p className="text-xs text-muted-foreground mt-1">U samo 5 koraka</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-accent/50">
          <p className="text-sm font-medium text-accent-foreground">Fleksibilni planovi</p>
          <p className="text-xs text-muted-foreground mt-1">Prilagođeni vašim potrebama</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-accent/50">
          <p className="text-sm font-medium text-accent-foreground">Najbolja pokrivenost</p>
          <p className="text-xs text-muted-foreground mt-1">5G mreža u cijeloj Hrvatskoj</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onNext} 
          disabled={!canProceed} 
          size="lg"
          className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Nastavi na odabir tarifa
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}
