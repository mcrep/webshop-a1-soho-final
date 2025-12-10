import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, UserPlus, Users, Smartphone, Minus, Plus, Check } from "lucide-react";
import { AuthModal } from "@/components/modals/AuthModal";

type Step1Props = {
  customerType: "new" | "existing" | null;
  numberOfLines: number;
  numberOfDevices: number;
  isLoggedIn: boolean;
  onUpdateCustomerType: (type: "new" | "existing") => void;
  onUpdateNumberOfLines: (num: number) => void;
  onUpdateNumberOfDevices: (num: number) => void;
  onLoginSuccess: () => void;
  onNext: () => void;
};

export function Step1CustomerInfo({
  customerType,
  numberOfLines,
  numberOfDevices,
  isLoggedIn,
  onUpdateCustomerType,
  onUpdateNumberOfLines,
  onUpdateNumberOfDevices,
  onLoginSuccess,
  onNext,
}: Step1Props) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const canProceed = customerType !== null && numberOfLines > 0 && numberOfDevices >= 0 && numberOfDevices <= numberOfLines && (customerType === "new" || isLoggedIn);

  return (
    <div className="w-full">
      {/* Configuration Cards */}
      <div className="space-y-6 mb-8 max-w-6xl mx-auto px-4">
        {/* Customer Type Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Ja sam</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onUpdateCustomerType("new")}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "new"
                    ? "border-primary"
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
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowAuthModal(true);
                  }
                  onUpdateCustomerType("existing");
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "existing"
                    ? "border-primary"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                {customerType === "existing" && isLoggedIn ? (
                  <Check className="h-8 w-8 mx-auto mb-3 text-green-500" />
                ) : (
                  <Users className={`h-8 w-8 mx-auto mb-3 ${customerType === "existing" ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <p className={`font-semibold ${customerType === "existing" ? "text-accent-foreground" : "text-foreground"}`}>
                  Postojeći korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {customerType === "existing" && isLoggedIn ? "Prijavljen" : "Već dio A1 obitelji"}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Number of Lines Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Želim aktivirati</h3>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfLines(Math.max(0, numberOfLines - 1))}
                disabled={numberOfLines <= 0}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-center min-w-[80px]">
                <p className="text-5xl font-bold text-primary">{numberOfLines}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfLines(numberOfLines + 1)}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-semibold">{numberOfLines === 1 ? "liniju" : "linija"}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Number of Devices Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Uz to želim kupiti</h3>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => onUpdateNumberOfDevices(Math.max(0, numberOfDevices - 1))}
                disabled={numberOfDevices <= 0}
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-center min-w-[80px]">
                <p className="text-5xl font-bold text-primary">{numberOfDevices}</p>
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
              <h3 className="text-lg font-semibold">{numberOfDevices === 1 ? "uređaj" : "uređaja"}</h3>
            </div>
            {numberOfDevices > numberOfLines && (
              <p className="text-sm text-destructive text-center mt-4">
                Broj uređaja ne može biti veći od broja linija
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            onLoginSuccess();
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
