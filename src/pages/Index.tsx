import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { WalletBanner } from "@/components/WalletBanner";
import { StepIndicator } from "@/components/StepIndicator";
import { Footer } from "@/components/Footer";
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
  deviceVariantId?: string | null;
  walletUse: number;
  tariffId: string;
  isActive: boolean;
  paymentMethod: "upfront" | "installments";
  screenInsurance: boolean;
  monthlyInstallment: number; // Monthly installment amount (1-30€)
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
          monthlyInstallment: 1,
        });
        slotIndex++;
      }
    });
    setDeviceSlots(slots);
    return slots;
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
      prev.map((s) => (s.id === slotId ? { ...s, paymentMethod: method } : s))
    );
  };

  const handleUpdateWalletUse = (slotId: string, amount: number) => {
    setDeviceSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, walletUse: amount } : s)));
  };

  const handleUpdateInsurance = (slotId: string, insurance: boolean) => {
    setDeviceSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, screenInsurance: insurance } : s)));
  };

  const handleUpdateMonthlyInstallment = (slotId: string, amount: number) => {
    setDeviceSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, monthlyInstallment: amount } : s)));
  };

  const generateLinesFromConfiguration = () => {
    const newLines: Line[] = deviceSlots.map((slot) => ({
      id: rid(),
      tariffId: slot.tariffId,
      deviceId: slot.isActive && slot.deviceId ? slot.deviceId : "no-dev",
      deviceVariantId: slot.isActive && slot.deviceVariantId ? slot.deviceVariantId : null,
      devicePayment: slot.paymentMethod,
      deviceMonthly: slot.paymentMethod === "installments" ? slot.monthlyInstallment : null,
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

  const walletUsed = useMemo(
    () => deviceSlots.reduce((sum, slot) => sum + slot.walletUse, 0),
    [deviceSlots]
  );

  const walletRemaining = walletTotal - walletUsed;

  const totalMonthly = useMemo(
    () =>
      lines.reduce((s, l) => {
        const t = tariffs.find((x) => x.id === l.tariffId)?.monthly ?? 0;
        const device = devices.find((x) => x.id === l.deviceId);
        const variant = device?.variants?.find((v) => v.id === l.deviceVariantId);
        let devMonthly = 0;
        if (l.devicePayment === "installments" && device && device.id !== "no-dev") {
          // deviceMonthly now stores the monthly installment amount
          devMonthly = l.deviceMonthly ?? 0;
        }
        const screenInsuranceCost = device && device.id !== "no-dev" && l.screenInsurance ? 4.99 : 0;
        return s + t + devMonthly + screenInsuranceCost;
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
    const slots = generateDeviceSlots();
    
    const nextStepNumber = numberOfDevices > 0 ? getStepNumberForScreen("Uređaji") : getStepNumberForScreen("Sažetak");
    if (numberOfDevices === 0) {
      // Generate lines immediately with the new slots
      const newLines: Line[] = slots.map((slot) => ({
        id: rid(),
        tariffId: slot.tariffId,
        deviceId: "no-dev",
        deviceVariantId: null,
        devicePayment: slot.paymentMethod,
        deviceMonthly: null,
        addonIds: [],
        lineType: null,
        walletUse: 0,
        screenInsurance: false,
      }));
      setLines(newLines);
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
  const showWallet = currentScreen === "Tarife" || currentScreen === "Uređaji";

  // Footer props based on current screen
  const getFooterProps = () => {
    const canProceed = {
      "Početak": customerType !== null && numberOfLines > 0 && numberOfDevices >= 0 && numberOfDevices <= numberOfLines,
      "Prijava": false, // Handled in Step2Login component state
      "Tarife": tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0) === numberOfLines,
      "Uređaji": (() => {
        const activeSlots = deviceSlots.filter((slot) => slot.isActive);
        const correctNumberOfDevices = activeSlots.length === numberOfDevices;
        const allActiveDevicesSelected = activeSlots.every((slot) => slot.deviceId !== null);
        return correctNumberOfDevices && allActiveDevicesSelected;
      })(),
      "Sažetak": allLinesConfigured
    };

    const nextLabels = {
      "Početak": "Nastavi na odabir tarifa",
      "Prijava": "Nastavi na tarife",
      "Tarife": "Nastavi na uređaje",
      "Uređaji": "Nastavi na sažetak",
      "Sažetak": "Završi narudžbu"
    };

    const handlers = {
      "Početak": { onNext: handleStep1Next, onBack: undefined },
      "Prijava": { onNext: handleLoginNext, onBack: () => setCurrentStep(1) },
      "Tarife": { 
        onNext: handleTariffNext, 
        onBack: () => {
          const prevStep = customerType === "existing" ? getStepNumberForScreen("Prijava") : 1;
          setCurrentStep(prevStep);
        }
      },
      "Uređaji": { 
        onNext: handleDeviceNext, 
        onBack: () => setCurrentStep(getStepNumberForScreen("Tarife"))
      },
      "Sažetak": { 
        onNext: handleFinish, 
        onBack: () => {
          const prevStep = numberOfDevices > 0 ? getStepNumberForScreen("Uređaji") : getStepNumberForScreen("Tarife");
          setCurrentStep(prevStep);
        }
      }
    };

    return {
      showBack: currentScreen !== "Početak",
      showNext: true,
      nextDisabled: !canProceed[currentScreen as keyof typeof canProceed],
      nextLabel: nextLabels[currentScreen as keyof typeof nextLabels],
      onNext: handlers[currentScreen as keyof typeof handlers].onNext,
      onBack: handlers[currentScreen as keyof typeof handlers].onBack
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header
        onOpenOTP={() => {}}
        onOpenLogin={() => {}}
        lineCount={lineCount}
        monthly={totalMonthly}
        onetime={totalOnetime}
        allLinesConfigured={allLinesConfigured}
        onFinishOrder={handleFinish}
        currentStep={currentStep > 1 ? currentStep : undefined}
        steps={currentStep > 1 ? steps : undefined}
        onStepClick={handleStepClick}
      />
      <div className="flex pt-[73px]">
        <div className={`mx-auto max-w-6xl px-4 w-full ${
          currentScreen === "Početak" 
            ? "flex items-center min-h-[calc(100vh-73px-96px)]" 
            : "pb-8"
        }`}>
          {showWallet && (
            <WalletBanner
              total={walletTotal}
              used={walletUsed}
              remaining={walletRemaining}
            />
          )}
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
              onUpdateMonthlyInstallment={handleUpdateMonthlyInstallment}
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
      </div>
      {deviceListModalFor && (
        <DeviceListModal
          onClose={() => setDeviceListModalFor(null)}
          onSelectDevice={(deviceId, variantId, paymentMethod, monthlyInstallment, screenInsurance) => {
            setDeviceSlots((prev) => 
              prev.map((s) => 
                s.id === deviceListModalFor 
                  ? { ...s, deviceId, deviceVariantId: variantId, paymentMethod, monthlyInstallment, screenInsurance } 
                  : s
              )
            );
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
      <Footer {...getFooterProps()} />
    </div>
  );
};

export default Index;
