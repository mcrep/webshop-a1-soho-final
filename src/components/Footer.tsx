import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type FooterProps = {
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
};

export function Footer({ 
  onBack, 
  onNext, 
  showBack = false, 
  showNext = true, 
  nextDisabled = false,
  nextLabel = "Nastavi",
  backLabel = "Natrag"
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-card shadow-sm border-t border-border z-40">
      <div className="mx-auto max-w-[1600px] px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            {showBack && onBack && (
              <Button onClick={onBack} variant="outline" size="lg">
                <ArrowLeft className="mr-2" size={18} />
                {backLabel}
              </Button>
            )}
          </div>
          <div>
            {showNext && onNext && (
              <Button 
                onClick={onNext} 
                disabled={nextDisabled} 
                size="lg"
                className={nextDisabled ? "bg-white border border-border text-muted-foreground hover:bg-white disabled:opacity-100" : ""}
              >
                {nextLabel}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
