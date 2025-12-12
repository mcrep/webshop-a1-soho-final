import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { WalletBanner } from "@/components/WalletBanner";
import { StepIndicator } from "@/components/StepIndicator";
import { Footer } from "@/components/Footer";
import { Step1CustomerInfo } from "@/components/steps/Step1CustomerInfo";
import { Step2TariffSelection } from "@/components/steps/Step2TariffSelection";
import { Step3DeviceSelection } from "@/components/steps/Step3DeviceSelection";
import { Step4Summary } from "@/components/steps/Step4Summary";
import { Step5Verification } from "@/components/steps/Step5Verification";
import { Step6DeliveryPayment } from "@/components/steps/Step6DeliveryPayment";
import { DeviceListModal } from "@/components/modals/DeviceListModal";
import { LineTypeSelectionModal } from "@/components/modals/LineTypeSelectionModal";
import { NumberPortingModal } from "@/components/modals/NumberPortingModal";
import { PrepaidToPostpaidModal } from "@/components/modals/PrepaidToPostpaidModal";
import { ExistingLineExtensionModal } from "@/components/modals/ExistingLineExtensionModal";
import { AuthModal } from "@/components/modals/AuthModal";
import { tariffs, devices } from "@/data/catalog";
import type { Line, VerificationData, DeliveryData, PaymentData, ExtensionLineWithTariff } from "@/types";
import { toast } from "@/hooks/use-toast";

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
  monthlyInstallment: number;
  label: string; // "Linija 1", "Linija 2", or MSISDN for extension lines
  isExtension: boolean; // true for extension lines
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerType, setCustomerType] = useState<"new" | "existing" | null>(null);
  const [numberOfLines, setNumberOfLines] = useState(0);
  const [numberOfDevices, setNumberOfDevices] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [extensionLines, setExtensionLines] = useState<ExtensionLineWithTariff[]>([]);
  const [showHeaderAuthModal, setShowHeaderAuthModal] = useState(false);
  const [tariffQuantities, setTariffQuantities] = useState<TariffQuantity[]>(
    tariffs.map((t) => ({ tariffId: t.id, quantity: 0 }))
  );
  const [deviceSlots, setDeviceSlots] = useState<DeviceSlot[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [deviceListModalFor, setDeviceListModalFor] = useState<string | null>(null);
  const [lineTypeSelectionFor, setLineTypeSelectionFor] = useState<string | null>(null);
  const [lineTypeModalFor, setLineTypeModalFor] = useState<{ lineId: string; lineType: string } | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const steps = useMemo(() => {
    const dynamicSteps = [{ number: 1, name: "Početak" }];
    let stepNumber = 2;
    // Removed login step - login is now handled on first screen
    dynamicSteps.push({ number: stepNumber, name: "Tarife" });
    stepNumber++;
    if (numberOfDevices > 0) {
      dynamicSteps.push({ number: stepNumber, name: "Uređaji" });
      stepNumber++;
    }
    dynamicSteps.push({ number: stepNumber, name: "Sažetak" });
    stepNumber++;
    if (customerType === "new") {
      dynamicSteps.push({ number: stepNumber, name: "Verifikacija" });
      stepNumber++;
    }
    dynamicSteps.push({ number: stepNumber, name: "Isporuka" });
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
    let newLineIndex = 1;
    
    // Add slots from new lines (tariffQuantities)
    tariffQuantities.forEach((tq) => {
      for (let i = 0; i < tq.quantity; i++) {
        slots.push({
          id: rid(),
          deviceId: null,
          walletUse: 0,
          tariffId: tq.tariffId,
          isActive: false,
          paymentMethod: "installments",
          screenInsurance: true,
          monthlyInstallment: 1,
          label: `Linija ${newLineIndex}`,
          isExtension: false,
        });
        newLineIndex++;
      }
    });
    // Add slots from extension lines
    extensionLines.forEach((extLine) => {
      if (extLine.newTariffId) {
        slots.push({
          id: rid(),
          deviceId: null,
          walletUse: 0,
          tariffId: extLine.newTariffId,
          isActive: false,
          paymentMethod: "installments",
          screenInsurance: true,
          monthlyInstallment: 1,
          label: extLine.msisdn,
          isExtension: true,
        });
      }
    });
    setDeviceSlots(slots);
    return slots;
  };

  const updateExtensionLineTariff = (lineId: string, tariffId: string) => {
    setExtensionLines((prev) =>
      prev.map((line) =>
        line.lineId === lineId ? { ...line, newTariffId: tariffId } : line
      )
    );
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

  // Check if all device lines have been selected
  const activeDeviceSlots = deviceSlots.filter(slot => slot.isActive);
  const allDeviceLinesSelected = activeDeviceSlots.length === numberOfDevices;

  // Track previous state to detect when bonus is added
  const prevAllDeviceLinesSelectedRef = useRef(false);

  // Wallet bonus from inactive slots (lines without devices) - only calculated AFTER all device lines are selected
  const noDeviceWalletBonus = useMemo(
    () => {
      if (!allDeviceLinesSelected) return 0;
      return deviceSlots
        .filter(slot => !slot.isActive)
        .reduce((sum, slot) => {
          const tariff = tariffs.find(t => t.id === slot.tariffId);
          return sum + (tariff?.noDeviceWalletBonus ?? 0);
        }, 0);
    },
    [deviceSlots, allDeviceLinesSelected, numberOfDevices]
  );

  // Show toast when wallet bonus is added
  useEffect(() => {
    if (allDeviceLinesSelected && !prevAllDeviceLinesSelectedRef.current && noDeviceWalletBonus > 0) {
      toast({
        title: "🎁 A1 Wallet napunjen!",
        description: `Dodano +€${noDeviceWalletBonus.toFixed(2)} bonusa za linije bez uređaja.`,
      });
    }
    prevAllDeviceLinesSelectedRef.current = allDeviceLinesSelected;
  }, [allDeviceLinesSelected, noDeviceWalletBonus]);

  // Count of lines without devices
  const linesWithoutDevices = useMemo(
    () => deviceSlots.filter(slot => !slot.isActive).length,
    [deviceSlots]
  );

  // Tariff-based wallet credit (new lines + extension lines)
  const tariffCredit = useMemo(
    () => {
      // Credit from new lines
      const newLinesCredit = tariffQuantities.reduce((sum, tq) => {
        const credit = tariffs.find((t) => t.id === tq.tariffId)?.walletCredit ?? 0;
        return sum + credit * tq.quantity;
      }, 0);
      // Credit from extension lines with selected tariffs
      const extensionLinesCredit = extensionLines.reduce((sum, extLine) => {
        if (extLine.newTariffId) {
          const credit = tariffs.find((t) => t.id === extLine.newTariffId)?.walletCredit ?? 0;
          return sum + credit;
        }
        return sum;
      }, 0);
      return newLinesCredit + extensionLinesCredit;
    },
    [tariffQuantities, extensionLines]
  );

  const walletTotal = useMemo(
    () => noDeviceWalletBonus + tariffCredit,
    [noDeviceWalletBonus, tariffCredit]
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

  const handleSummaryNext = () => {
    const nextScreen = customerType === "new" ? "Verifikacija" : "Isporuka";
    setCurrentStep(getStepNumberForScreen(nextScreen));
  };

  const handleVerificationNext = () => {
    setCurrentStep(getStepNumberForScreen("Isporuka"));
  };

  const handleDeliveryNext = () => {
    console.log("Narudžba završena!", { 
      lines, 
      totalMonthly, 
      totalOnetime, 
      verificationData, 
      deliveryData, 
      paymentData 
    });
  };

  const handleFinish = () => {
    handleSummaryNext();
  };

  const lineCount = lines.length;
  const allLinesConfigured = lines.every((line) => line.lineType !== null);
  const currentScreen = steps.find((s) => s.number === currentStep)?.name ?? "Početak";
  const showWallet = currentScreen === "Tarife" || currentScreen === "Uređaji";
  const showWalletDetails = currentScreen === "Uređaji";

  // Footer props based on current screen
  const getFooterProps = () => {
    const totalLines = isLoggedIn ? numberOfLines + extensionLines.length : numberOfLines;
    const allExtensionLinesHaveTariff = extensionLines.every(line => line.newTariffId !== null);
    const newLinesCount = tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0);
    const newLinesMax = totalLines - extensionLines.length;
    const canProceed = {
      "Početak": customerType !== null && numberOfLines > 0 && numberOfDevices >= 0 && numberOfDevices <= totalLines && (customerType === "new" || isLoggedIn),
      "Tarife": newLinesCount === newLinesMax && allExtensionLinesHaveTariff,
      "Uređaji": (() => {
        const activeSlots = deviceSlots.filter((slot) => slot.isActive);
        const correctNumberOfDevices = activeSlots.length === numberOfDevices;
        const allActiveDevicesSelected = activeSlots.every((slot) => slot.deviceId !== null);
        return correctNumberOfDevices && allActiveDevicesSelected;
      })(),
      "Sažetak": allLinesConfigured,
      "Verifikacija": verificationData !== null,
      "Isporuka": deliveryData !== null && paymentData !== null
    };

    const nextLabels = {
      "Početak": "Nastavi",
      "Tarife": "Nastavi",
      "Uređaji": "Nastavi",
      "Sažetak": "Nastavi",
      "Verifikacija": "Nastavi",
      "Isporuka": "Završi narudžbu"
    };

    const handlers = {
      "Početak": { onNext: handleStep1Next, onBack: undefined },
      "Tarife": { 
        onNext: handleTariffNext, 
        onBack: () => setCurrentStep(1)
      },
      "Uređaji": { 
        onNext: handleDeviceNext, 
        onBack: () => setCurrentStep(getStepNumberForScreen("Tarife"))
      },
      "Sažetak": { 
        onNext: handleSummaryNext, 
        onBack: () => {
          const prevStep = numberOfDevices > 0 ? getStepNumberForScreen("Uređaji") : getStepNumberForScreen("Tarife");
          setCurrentStep(prevStep);
        }
      },
      "Verifikacija": {
        onNext: handleVerificationNext,
        onBack: () => setCurrentStep(getStepNumberForScreen("Sažetak"))
      },
      "Isporuka": {
        onNext: handleDeliveryNext,
        onBack: () => {
          const prevStep = customerType === "new" ? getStepNumberForScreen("Verifikacija") : getStepNumberForScreen("Sažetak");
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserIdentifier("");
    setExtensionLines([]);
    setCustomerType(null);
  };

  const handleLoginSuccess = (identifier: string, type: "email" | "phone") => {
    setIsLoggedIn(true);
    setUserIdentifier(identifier);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header
        onOpenAuth={() => setShowHeaderAuthModal(true)}
        lineCount={lineCount}
        monthly={totalMonthly}
        onetime={totalOnetime}
        allLinesConfigured={allLinesConfigured}
        onFinishOrder={handleFinish}
        currentStep={currentStep > 1 ? currentStep : undefined}
        steps={currentStep > 1 ? steps : undefined}
        onStepClick={handleStepClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="flex pt-[73px]">
        <div className="mx-auto max-w-6xl px-4 w-full">
          {showWallet && (
            <WalletBanner
              total={walletTotal}
              used={walletUsed}
              remaining={walletRemaining}
              showDetails={showWalletDetails}
              tariffCredit={tariffCredit}
              noDeviceBonus={noDeviceWalletBonus}
              linesWithoutDevices={linesWithoutDevices}
              selectedLines={tariffQuantities.reduce((sum, tq) => sum + tq.quantity, 0) + extensionLines.filter(l => l.newTariffId).length}
              maxLines={isLoggedIn ? numberOfLines + extensionLines.length : numberOfLines}
            />
          )}
          <div className={currentScreen === "Početak" 
            ? "flex items-center min-h-[calc(100vh-73px-96px)]" 
            : "pb-8"
          }>
            {currentScreen === "Početak" && (
            <Step1CustomerInfo
              customerType={customerType}
              numberOfLines={numberOfLines}
              numberOfDevices={numberOfDevices}
              isLoggedIn={isLoggedIn}
              extensionLines={extensionLines}
              onUpdateCustomerType={setCustomerType}
              onUpdateNumberOfLines={setNumberOfLines}
              onUpdateNumberOfDevices={setNumberOfDevices}
              onLoginSuccess={handleLoginSuccess}
              onUpdateExtensionLines={setExtensionLines}
              onNext={handleStep1Next}
            />
          )}
          {currentScreen === "Tarife" && (
            <Step2TariffSelection
              tariffQuantities={tariffQuantities}
              maxLines={isLoggedIn ? numberOfLines + extensionLines.length : numberOfLines}
              extensionLines={extensionLines}
              onUpdateQuantity={updateQuantity}
              onUpdateExtensionLineTariff={updateExtensionLineTariff}
              onNext={handleTariffNext}
              onBack={() => setCurrentStep(1)}
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
          {currentScreen === "Verifikacija" && (
            <Step5Verification
              data={verificationData}
              onUpdate={setVerificationData}
            />
          )}
          {currentScreen === "Isporuka" && (
            <Step6DeliveryPayment
              deliveryData={deliveryData}
              paymentData={paymentData}
              onUpdateDelivery={setDeliveryData}
              onUpdatePayment={setPaymentData}
            />
            )}
          </div>
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
      <AnimatePresence>
        {showHeaderAuthModal && (
          <AuthModal
            onClose={() => setShowHeaderAuthModal(false)}
            onLoginSuccess={(identifier, type) => {
              handleLoginSuccess(identifier, type);
              setCustomerType("existing");
              setShowHeaderAuthModal(false);
            }}
          />
        )}
      </AnimatePresence>
      <Footer {...getFooterProps()} />
    </div>
  );
};

export default Index;
