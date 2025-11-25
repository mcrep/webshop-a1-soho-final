import { Check } from "lucide-react";

type StepIndicatorProps = {
  currentStep: number;
  onStepClick: (step: number) => void;
  steps: { number: number; name: string }[];
};

export function StepIndicator({ currentStep, onStepClick, steps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStepClick(step.number)}
              className={`h-5 w-5 rounded-full grid place-items-center border text-xs font-semibold transition-all ${
                currentStep === step.number
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : currentStep > step.number
                  ? "bg-primary/20 text-primary border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              }`}
              aria-current={currentStep === step.number ? "step" : undefined}
              title={`Korak ${step.number}: ${step.name}`}
            >
              {currentStep > step.number ? <Check size={8} /> : step.number}
            </button>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                currentStep === step.number ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && <div className="w-[1px] h-4 bg-border ml-2.5" />}
        </div>
      ))}
    </div>
  );
}
