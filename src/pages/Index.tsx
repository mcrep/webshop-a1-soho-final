import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1TariffSelection } from "@/components/steps/Step1TariffSelection";
import { Step2WalletSummary } from "@/components/steps/Step2WalletSummary";
import { Step3DeviceConfiguration } from "@/components/steps/Step3DeviceConfiguration";
import { Step4Summary } from "@/components/steps/Step4Summary";
import { DeviceListModal } from "@/components/modals/DeviceListModal";
import { LineTypeSelectionModal } from "@/components/modals/LineTypeSelectionModal";
import { NumberPortingModal } from "@/components/modals/NumberPortingModal";
import { PrepaidToPostpaidModal } from "@/components/modals/PrepaidToPostpaidModal";
import { ExistingLineExtensionModal } from "@/components/modals/ExistingLineExtensionModal";
import { tariffs, devices } from "@/data/catalog";
import type { Line } from "@/types";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

type TariffQuantity = {
  tariffId: string;
  quantity: number;
};

const Index = () => {
  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Tariff quantities
  const [tariffQuantities, setTariffQuantities] = useState<TariffQuantity[]>(
    tariffs.map((t) => ({ tariffId: t.id, quantity: 0 }))
  );

  // Step 3+: Lines generated from tariff quantities
  const [lines, setLines] = useState<Line[]>([]);

  // Modals
  const [deviceListModalFor, setDeviceListModalFor] = useState<string | null>(null);
  const [lineTypeSelectionFor, setLineTypeSelectionFor] = useState<string | null>(null);
  const [lineTypeModalFor, setLineTypeModalFor] = useState<{ lineId: string; lineType: string } | null>(null);

  // Steps configuration
  const steps = [
    { number: 1, name: "Tarife" },
    { number: 2, name: "A1 Wallet" },
    { number: 3, name: "Uređaji" },
    { number: 4, name: "Sažetak" },
  ];

  // Update tariff quantity
  const updateQuantity = (tariffId: string, delta: number) => {
    setTariffQuantities((prev) =>
      prev.map((tq) =>
        tq.tariffId === tariffId
          ? { ...tq, quantity: Math.max(0, tq.quantity + delta) }
          : tq
      )
    );
  };

  // Generate lines from tariff quantities (called when moving from step 1 to step 2)
  const generateLinesFromQuantities = () => {
    const newLines: Line[] = [];
    tariffQuantities.forEach((tq) => {
      for (let i = 0; i < tq.quantity; i++) {
        newLines.push({
          id: rid(),
          tariffId: tq.tariffId,
          deviceId: null,
          devicePayment: "installments",
          deviceMonthly: null,
          addonIds: [],
          lineType: null,
          walletUse: 0,
          screenInsurance: true,
        });
      }
    });
    setLines(newLines);
  };

  // Update line
  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  // Calculate wallet
  const walletTotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const credit = tariffs.find((t) => t.id === l.tariffId)?.walletCredit ?? 0;
        return sum + credit;
      }, 0),
    [lines]
  );
  const walletUsed = lines.reduce((sum, l) => sum + (l.walletUse ?? 0), 0);

  // Calculate pricing
  const totalMonthly = useMemo(
    () =>
      lines.reduce((s, l) => {
        const t = tariffs.find((x) => x.id === l.tariffId)?.monthly ?? 0;
        const devMonthly =
          l.devicePayment === "installments"
            ? (l.deviceMonthly ?? devices.find((x) => x.id === l.deviceId)?.installment) ?? 0
            : 0;
        const applied = l.devicePayment === "installments" ? l.walletUse ?? 0 : 0;
        const device = devices.find((x) => x.id === l.deviceId);
        const screenInsuranceCost = device && device.id !== "no-dev" && l.screenInsurance ? 4.99 : 0;
        return s + Math.max(0, t + devMonthly + screenInsuranceCost - applied);
      }, 0),
    [lines]
  );

  const totalOnetime = useMemo(
    () =>
      lines.reduce((s, l) => {
        const upfront =
          l.devicePayment === "upfront" ? devices.find((x) => x.id === l.deviceId)?.upfront ?? 0 : 0;
        const applied = l.devicePayment === "upfront" ? l.walletUse ?? 0 : 0;
        return s + Math.max(0, upfront - applied);
      }, 0),
    [lines]
  );

  // Step navigation
  const handleStepClick = (step: number) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && currentStep >= 2) {
      setCurrentStep(2);
    } else if (step === 3 && currentStep >= 3) {
      setCurrentStep(3);
    } else if (step === 4 && currentStep >= 4) {
      setCurrentStep(4);
    }
  };

  const handleStep1Next = () => {
    generateLinesFromQuantities();
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  const handleFinish = () => {
    console.log("Narudžba završena!", { lines, totalMonthly, totalOnetime });
    // TODO: Implement finish order logic
  };

  // Line count for header
  const lineCount = lines.length;
  const allLinesConfigured = lines.every(line => line.lineType !== null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        onOpenOTP={() => {}}
        onOpenLogin={() => {}}
        lineCount={lineCount}
        monthly={totalMonthly}
        onetime={totalOnetime}
        allLinesConfigured={allLinesConfigured}
        onFinishOrder={handleFinish}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-8">
        <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} steps={steps} />

        {currentStep === 1 && (
          <Step1TariffSelection
            tariffQuantities={tariffQuantities}
            onUpdateQuantity={updateQuantity}
            onNext={handleStep1Next}
          />
        )}

        {currentStep === 2 && (
          <Step2WalletSummary
            totalWallet={walletTotal}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3DeviceConfiguration
            lines={lines}
            totalWallet={walletTotal}
            walletUsed={walletUsed}
            onUpdateLine={updateLine}
            onNext={handleStep3Next}
            onBack={() => setCurrentStep(2)}
            onOpenDeviceModal={(lineId) => setDeviceListModalFor(lineId)}
          />
        )}

        {currentStep === 4 && (
          <Step4Summary
            lines={lines}
            totalMonthly={totalMonthly}
            totalOnetime={totalOnetime}
            onUpdateLine={updateLine}
            onBack={() => setCurrentStep(3)}
            onFinish={handleFinish}
            onOpenLineTypeModal={(lineId) => setLineTypeSelectionFor(lineId)}
          />
        )}
      </div>

      {/* Modals */}
      {deviceListModalFor && (
        <DeviceListModal
          onClose={() => setDeviceListModalFor(null)}
          onSelectDevice={(deviceId) => {
            updateLine(deviceListModalFor, { deviceId });
            setDeviceListModalFor(null);
          }}
        />
      )}

      {lineTypeSelectionFor && (
        <LineTypeSelectionModal
          onClose={() => setLineTypeSelectionFor(null)}
          onSelect={(lineType) => {
            if (lineType === "new") {
              // For new line, just set the type directly
              updateLine(lineTypeSelectionFor, { lineType: "new" });
              setLineTypeSelectionFor(null);
            } else {
              // For other types, open the appropriate modal
              setLineTypeModalFor({ lineId: lineTypeSelectionFor, lineType });
              setLineTypeSelectionFor(null);
            }
          }}
        />
      )}

      {lineTypeModalFor?.lineType === "mnp" && (() => {
        const line = lines.find(l => l.id === lineTypeModalFor.lineId);
        if (!line) return null;
        return (
          <NumberPortingModal
            current={line}
            onClose={() => setLineTypeModalFor(null)}
            onSave={(data) => {
              updateLine(lineTypeModalFor.lineId, {
                lineType: "mnp",
                ...data,
              });
              setLineTypeModalFor(null);
            }}
          />
        );
      })()}

      {lineTypeModalFor?.lineType === "pre2post" && (() => {
        const line = lines.find(l => l.id === lineTypeModalFor.lineId);
        if (!line) return null;
        return (
          <PrepaidToPostpaidModal
            current={line}
            onClose={() => setLineTypeModalFor(null)}
            onSave={(data) => {
              updateLine(lineTypeModalFor.lineId, {
                lineType: "pre2post",
                ...data,
              });
              setLineTypeModalFor(null);
            }}
          />
        );
      })()}

      {lineTypeModalFor?.lineType === "renew" && (() => {
        const line = lines.find(l => l.id === lineTypeModalFor.lineId);
        if (!line) return null;
        return (
          <ExistingLineExtensionModal
            current={line}
            onClose={() => setLineTypeModalFor(null)}
            onSave={(data) => {
              updateLine(lineTypeModalFor.lineId, {
                lineType: "renew",
                ...data,
              });
              setLineTypeModalFor(null);
            }}
          />
        );
      })()}
    </div>
  );
};

export default Index;
