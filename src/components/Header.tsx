import { User, Phone, LogIn, ShoppingCart, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import a1Logo from "@/assets/a1-logo.png";

type HeaderProps = {
  onOpenOTP: () => void;
  onOpenLogin: () => void;
  lineCount: number;
  monthly: number;
  onetime: number;
  allLinesConfigured: boolean;
  onFinishOrder: () => void;
  currentStep?: number;
  steps?: { number: number; name: string }[];
  onStepClick?: (step: number) => void;
};

export function Header({ onOpenOTP, onOpenLogin, lineCount, monthly, onetime, allLinesConfigured, onFinishOrder, currentStep, steps, onStepClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm border-b border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        {steps && steps.length > 0 && currentStep && onStepClick ? (
          // Grid layout with stepper in center
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={a1Logo} alt="A1 Logo" className="h-9 w-auto" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Business Webshop</h1>
                <p className="text-xs text-foreground">
                  Konfigurator tarifa za male poslovne korisnike
                </p>
              </div>
            </div>

            {/* Horizontal Stepper - Centered */}
            <div className="hidden md:flex items-center gap-2 justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center gap-2">
                  <button
                    onClick={() => onStepClick(step.number)}
                    disabled={step.number > currentStep}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : step.number < currentStep
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                    title={`Korak ${step.number}: ${step.name}`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full grid place-items-center text-xs font-semibold border ${
                        currentStep === step.number
                          ? "border-primary-foreground"
                          : step.number < currentStep
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      {step.number < currentStep ? <Check size={12} /> : step.number}
                    </div>
                    <span className="text-xs font-medium whitespace-nowrap hidden lg:inline">
                      {step.name}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-[2px] bg-border" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 justify-end">
              {/* Shopping Cart */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative">
                    <ShoppingCart className="h-5 w-5" />
                    {lineCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {lineCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Sažetak narudžbe</h3>
                    
                    {lineCount === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nema konfiguriranih linija
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Broj linija</span>
                          <span className="font-semibold">{lineCount}</span>
                        </div>
                        
                        <div className="border-t border-border pt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mjesečno</span>
                            <span className="text-lg font-bold">€{monthly.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Jednokratno</span>
                            <span className="text-lg font-bold">€{onetime.toFixed(2)}</span>
                          </div>
                        </div>

                        {allLinesConfigured && (
                          <Button 
                            onClick={onFinishOrder}
                            className="w-full mt-4"
                            size="lg"
                          >
                            Završi narudžbu
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <LogIn className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-popover">
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem
                      onClick={onOpenLogin}
                      className="cursor-pointer p-3 rounded-lg"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-muted-foreground flex-shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Korisničko ime i lozinka</div>
                          <div className="text-xs text-muted-foreground">
                            Prijava putem korisničkih podataka.
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={onOpenOTP}
                      className="cursor-pointer p-3 rounded-lg"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive flex-shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">A1 mobilni broj</div>
                          <div className="text-xs text-muted-foreground">
                            Putem SMS-a ćemo poslati kod.
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          // Flex layout without stepper
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={a1Logo} alt="A1 Logo" className="h-9 w-auto" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Business Webshop</h1>
                <p className="text-xs text-foreground">
                  Konfigurator tarifa za male poslovne korisnike
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Shopping Cart */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative">
                    <ShoppingCart className="h-5 w-5" />
                    {lineCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {lineCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Sažetak narudžbe</h3>
                    
                    {lineCount === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nema konfiguriranih linija
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Broj linija</span>
                          <span className="font-semibold">{lineCount}</span>
                        </div>
                        
                        <div className="border-t border-border pt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mjesečno</span>
                            <span className="text-lg font-bold">€{monthly.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Jednokratno</span>
                            <span className="text-lg font-bold">€{onetime.toFixed(2)}</span>
                          </div>
                        </div>

                        {allLinesConfigured && (
                          <Button 
                            onClick={onFinishOrder}
                            className="w-full mt-4"
                            size="lg"
                          >
                            Završi narudžbu
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Login */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <LogIn className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-popover">
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem
                      onClick={onOpenLogin}
                      className="cursor-pointer p-3 rounded-lg"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-muted-foreground flex-shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Korisničko ime i lozinka</div>
                          <div className="text-xs text-muted-foreground">
                            Prijava putem korisničkih podataka.
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={onOpenOTP}
                      className="cursor-pointer p-3 rounded-lg"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive flex-shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">A1 mobilni broj</div>
                          <div className="text-xs text-muted-foreground">
                            Putem SMS-a ćemo poslati kod.
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
