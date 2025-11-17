import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { Step1CustomerInfo } from "@/components/steps/Step1CustomerInfo";
import { Step2Login } from "@/components/steps/Step2Login";
import { Step2TariffSelection } from "@/components/steps/Step2TariffSelection";
import { Step3DeviceSelection } from "@/components/steps/Step3DeviceSelection";
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

type DeviceSlot = {
  id: string;
  deviceId: string | null;
  walletUse: number;
  tariffId: string;
  isActive: boolean;
  paymentMethod: "upfront" | "installments";
  screenInsurance: boolean;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerType, setCustomerType] = useState<"new" | "existing" | null>(null);
  const [numberOfLines, setNumberOfLines] = useState(0);
  const [numberOfDevices, setNumberOfDevices] = useState(0);
  const [tariffQuantities, setTariffQuantities] = useState<TariffQuantity[]>(
    tariffs.map((t) => ({ tariffId: t.id, quantity: 0 }))
  );
  const [deviceSlots, setDeviceSlots] = useState<DeviceSlot[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [deviceListModalFor, setDeviceListModalFor] = useState<string | null>(null);
  const [lineTypeSelectionFor, setLineTypeSelectionFor] = useState<string | null>(null);
  const [lineTypeModalFor, setLineTypeModalFor] = useState<{ lineId: string; lineType: string } | null>(null);

  const steps = useMemo(() => {
    const dynamicSteps = [{ number: 1, name: "Početak" }];
    let stepNumber = 2;
    if (customerType === "existing") {
      dynamicSteps.push({ number: stepNumber, name: "Prijava" });
      stepNumber++;
    }
    dynamicSteps.push({ number: stepNumber, name: "Tarife" });
    stepNumber++;
    if (numberOfDevices > 0) {
      dynamicSteps.push({ number: stepNumber, name: "Uređaji" });
      stepNumber++;
    }
    dynamicSteps.push({ number: stepNumber, name: "Sažetak" });
    return dynamicSteps;
  }, [customerType, numberOfDevices]);

  const updateQuantity = (tariffId: string, delta: number) => {
    setTariffQuantities((prev) =>
      prev.map((tq) =>
        tq.tariffId === tariffId ? { ...tq, quantity: Math.max(0, tq.quantity + delta) } : tq
      )
    );
  };

  const generateDeviceSlots = () => {
    const slots: DeviceSlot[] = [];
    let slotIndex = 0;
    tariffQuantities.forEach((tq) => {
      for (let i = 0; i < tq.quantity; i++) {
        slots.push({
          id: rid(),
          deviceId: null,
          walletUse: 0,
          tariffId: tq.tariffId,
          isActive: slotIndex < numberOfDevices,
          paymentMethod: "installments",
          screenInsurance: false,
        });
        slotIndex++;
      }
    });
    setDeviceSlots(slots);
  };

  const handleToggleSlot = (slotId: string) => {
    setDeviceSlots((prev) => {
      const activeCount = prev.filter((s) => s.isActive).length;
      const slot = prev.find((s) => s.id === slotId);
      if (!slot) return prev;
      
      // Can't turn on if already at max numberOfDevices
      if (!slot.isActive && activeCount >= numberOfDevices) return prev;
      
      // Can always turn off, can turn on only if under limit
      return prev.map((s) => (s.id === slotId ? { ...s, isActive: !s.isActive, deviceId: null, walletUse: 0 } : s));
    });
  };

  const handleUpdatePaymentMethod = (slotId: string, method: "upfront" | "installments") => {
    setDeviceSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, paymentMethod: method, walletUse: method === "installments" ? 0 : s.walletUse } : s))
    );
  };

  const handleUpdateWalletUse = (slotId: string, amount: number) => {
    setDeviceSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, walletUse: amount } : s)));
  };

  const handleUpdateInsurance = (slotId: string, insurance: boolean) => {
    setDeviceSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, screenInsurance: insurance } : s)));
  };

  const generateLinesFromConfiguration = () => {
    const newLines: Line[] = deviceSlots.map((slot) => ({
      id: rid(),
      tariffId: slot.tariffId,
      deviceId: slot.isActive && slot.deviceId ? slot.deviceId : "no-dev",
      devicePayment: slot.paymentMethod,
      deviceMonthly: null,
      addonIds: [],
      lineType: null,
      walletUse: slot.walletUse,
      screenInsurance: slot.screenInsurance,
    }));
    setLines(newLines);
  };

  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const walletTotal = useMemo(
    () =>
      tariffQuantities.reduce((sum, tq) => {
        const credit = tariffs.find((t) => t.id === tq.tariffId)?.walletCredit ?? 0;
        return sum + credit * tq.quantity;
      }, 0),
    [tariffQuantities]
  );

  const totalMonthly = useMemo(
    () =>
      lines.reduce((s, l) => {
        const t = tariffs.find((x) => x.id === l.tariffId)?.monthly ?? 0;
        const devMonthly = l.devicePayment === "installments" ? (l.deviceMonthly ?? devices.find((x) => x.id === l.deviceId)?.installment) ?? 0 : 0;
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
        const upfront = l.devicePayment === "upfront" ? devices.find((x) => x.id === l.deviceId)?.upfront ?? 0 : 0;
        const applied = l.devicePayment === "upfront" ? l.walletUse ?? 0 : 0;
        return s + Math.max(0, upfront - applied);
      }, 0),
    [lines]
  );

  const getStepNumberForScreen = (screenName: string): number => {
    const step = steps.find((s) => s.name === screenName);
    return step?.number ?? 1;
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleStep1Next = () => {
    const nextStepNumber = customerType === "existing" ? 2 : getStepNumberForScreen("Tarife");
    setCurrentStep(nextStepNumber);
  };

  const handleLoginNext = () => {
    setCurrentStep(getStepNumberForScreen("Tarife"));
  };

  const handleTariffNext = () => {
    // Generate device slots AFTER tariffs are selected
    generateDeviceSlots();
    
    const nextStepNumber = numberOfDevices > 0 ? getStepNumberForScreen("Uređaji") : getStepNumberForScreen("Sažetak");
    if (numberOfDevices === 0) {
      generateLinesFromConfiguration();
    }
    setCurrentStep(nextStepNumber);
  };

  const handleDeviceNext = () => {
    generateLinesFromConfiguration();
    setCurrentStep(getStepNumberForScreen("Sažetak"));
  };

  const handleFinish = () => {
    console.log("Narudžba završena!", { lines, totalMonthly, totalOnetime });
  };

  const lineCount = lines.length;
  const allLinesConfigured = lines.every((line) => line.lineType !== null);
  const currentScreen = steps.find((s) => s.number === currentStep)?.name ?? "Početak";

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
        {currentStep > 1 && <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} steps={steps} />}
        {currentScreen === "Početak" && (
          <Step1CustomerInfo
            customerType={customerType}
            numberOfLines={numberOfLines}
            numberOfDevices={numberOfDevices}
            onUpdateCustomerType={setCustomerType}
            onUpdateNumberOfLines={setNumberOfLines}
            onUpdateNumberOfDevices={setNumberOfDevices}
            onNext={handleStep1Next}
          />
        )}
        {currentScreen === "Prijava" && <Step2Login onNext={handleLoginNext} onBack={() => setCurrentStep(1)} />}
        {currentScreen === "Tarife" && (
          <Step2TariffSelection
            tariffQuantities={tariffQuantities}
            maxLines={numberOfLines}
            onUpdateQuantity={updateQuantity}
            onNext={handleTariffNext}
            onBack={() => {
              const prevStep = customerType === "existing" ? getStepNumberForScreen("Prijava") : 1;
              setCurrentStep(prevStep);
            }}
          />
        )}
        {currentScreen === "Uređaji" && (
          <Step3DeviceSelection
            deviceSlots={deviceSlots}
            totalWallet={walletTotal}
            numberOfDevices={numberOfDevices}
            onOpenDeviceModal={setDeviceListModalFor}
            onToggleSlot={handleToggleSlot}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
            onUpdateWalletUse={handleUpdateWalletUse}
            onUpdateInsurance={handleUpdateInsurance}
            onNext={handleDeviceNext}
            onBack={() => setCurrentStep(getStepNumberForScreen("Tarife"))}
          />
        )}
        {currentScreen === "Sažetak" && (
          <Step4Summary
            lines={lines}
            totalMonthly={totalMonthly}
            totalOnetime={totalOnetime}
            onUpdateLine={updateLine}
            onBack={() => {
              const prevStep = numberOfDevices > 0 ? getStepNumberForScreen("Uređaji") : getStepNumberForScreen("Tarife");
              setCurrentStep(prevStep);
            }}
            onFinish={handleFinish}
            onOpenLineTypeModal={setLineTypeSelectionFor}
          />
        )}
      </div>
      {deviceListModalFor && (
        <DeviceListModal
          onClose={() => setDeviceListModalFor(null)}
          onSelectDevice={(deviceId) => {
            setDeviceSlots((prev) => prev.map((s) => (s.id === deviceListModalFor ? { ...s, deviceId } : s)));
            setDeviceListModalFor(null);
          }}
        />
      )}
      {lineTypeSelectionFor && (
        <LineTypeSelectionModal
          onClose={() => setLineTypeSelectionFor(null)}
          onSelect={(lineType) => {
            setLineTypeModalFor({ lineId: lineTypeSelectionFor, lineType });
            setLineTypeSelectionFor(null);
          }}
        />
      )}
      {lineTypeModalFor && lineTypeModalFor.lineType === "mnp" && (
        <NumberPortingModal
          current={lines.find(l => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, { lineType: "mnp", ...data });
            setLineTypeModalFor(null);
          }}
        />
      )}
      {lineTypeModalFor && lineTypeModalFor.lineType === "pre2post" && (
        <PrepaidToPostpaidModal
          current={lines.find(l => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, { lineType: "pre2post", ...data });
            setLineTypeModalFor(null);
          }}
        />
      )}
      {lineTypeModalFor && lineTypeModalFor.lineType === "renew" && (
        <ExistingLineExtensionModal
          current={lines.find(l => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, { lineType: "renew", ...data });
            setLineTypeModalFor(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
