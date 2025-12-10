import { LogIn, LogOut, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import a1Logo from "@/assets/a1-logo.png";

type HeaderProps = {
  onOpenAuth: () => void;
  lineCount: number;
  monthly: number;
  onetime: number;
  allLinesConfigured: boolean;
  onFinishOrder: () => void;
  currentStep?: number;
  steps?: { number: number; name: string }[];
  onStepClick?: (step: number) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
};

export function Header({ onOpenAuth, lineCount, monthly, onetime, allLinesConfigured, onFinishOrder, currentStep, steps, onStepClick, isLoggedIn, onLogout }: HeaderProps) {
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
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="rounded-full gap-2 px-4"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Odjava</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={onOpenAuth}
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              )}
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
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="rounded-full gap-2 px-4"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Odjava</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={onOpenAuth}
                >
                  <LogIn className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}