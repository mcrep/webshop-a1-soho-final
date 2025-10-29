import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { StartPicker } from "@/components/StartPicker";
import { LineConfigurator } from "@/components/LineConfigurator";
import { Summary } from "@/components/Summary";
import { LoginPanel } from "@/components/LoginPanel";
import { TariffModal } from "@/components/modals/TariffModal";
import { DeviceModal } from "@/components/modals/DeviceModal";
import { AddonsModal } from "@/components/modals/AddonsModal";
import { ShowcaseModal } from "@/components/modals/ShowcaseModal";
import { OTPModal } from "@/components/modals/OTPModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { tariffs, devices, addons, lineTypes } from "@/data/catalog";
import type { Line } from "@/types";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

const Index = () => {
  // State
  const [lines, setLines] = useState<Line[]>([]);
  const [tariffModalFor, setTariffModalFor] = useState<string | null>(null);
  const [deviceModalFor, setDeviceModalFor] = useState<string | null>(null);
  const [addonsModalFor, setAddonsModalFor] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"config" | "login">("config");
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [startMode, setStartMode] = useState<"device" | "tariff">("device");
  const [showcaseOpen, setShowcaseOpen] = useState<null | "devices" | "tariffs">(null);

  const maskedPhone = "********97";

  // Mutators
  const addLine = () =>
    setLines((ls) => [
      ...ls,
      {
        id: rid(),
        tariffId: null,
        deviceId: null,
        devicePayment: "installments",
        deviceMonthly: null,
        addonIds: [],
        lineType: null,
        walletUse: 0,
      },
    ]);
  const removeLine = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id));
  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  // Helpers for start picker
  const ensureLine = () => {
    if (lines.length === 0) {
      const id = rid();
      setLines((ls) => [
        ...ls,
        {
          id,
          tariffId: null,
          deviceId: null,
          devicePayment: "installments",
          deviceMonthly: null,
          addonIds: [],
          lineType: null,
          walletUse: 0,
        },
      ]);
      return id;
    }
    return lines[lines.length - 1].id;
  };

  const pickDeviceFromShowcase = (deviceId: string) => {
    const lid = ensureLine();
    updateLine(lid, { deviceId });
    setActivePanel("config");
    setDeviceModalFor(lid);
    setShowcaseOpen(null);
  };

  const pickTariffFromShowcase = (tariffId: string) => {
    const lid = ensureLine();
    updateLine(lid, { tariffId });
    setActivePanel("config");
    setTariffModalFor(lid);
    setShowcaseOpen(null);
  };

  // Pricing
  const monthly = useMemo(
    () =>
      lines.reduce((s, l) => {
        const t = tariffs.find((x) => x.id === l.tariffId)?.monthly ?? 0;
        const devMonthly =
          l.devicePayment === "installments"
            ? (l.deviceMonthly ?? devices.find((x) => x.id === l.deviceId)?.installment) ?? 0
            : 0;
        const add = l.addonIds.reduce(
          (sum, id) => sum + (addons.find((x) => x.id === id)?.monthly ?? 0),
          0
        );
        const applied = l.devicePayment === "installments" ? l.walletUse ?? 0 : 0;
        return s + Math.max(0, t + devMonthly + add - applied);
      }, 0),
    [lines]
  );

  const onetime = useMemo(
    () =>
      lines.reduce((s, l) => {
        const upfront =
          l.devicePayment === "upfront" ? devices.find((x) => x.id === l.deviceId)?.upfront ?? 0 : 0;
        const applied = l.devicePayment === "upfront" ? l.walletUse ?? 0 : 0;
        return s + Math.max(0, upfront - applied);
      }, 0),
    [lines]
  );

  // Wallet
  const walletTotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const credit = tariffs.find((t) => t.id === l.tariffId)?.walletCredit ?? 0;
        return sum + credit;
      }, 0),
    [lines]
  );
  const walletUsed = lines.reduce((sum, l) => sum + (l.walletUse ?? 0), 0);
  const walletRemaining = Math.max(0, walletTotal - walletUsed);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* Left/main content */}
        <div className="lg:col-span-2">
          {/* Steps layout */}
          <div className="grid grid-cols-[56px,1fr] gap-4">
            {/* Stepper */}
            <div className="flex flex-col items-center pt-2">
              <button
                onClick={() => setActivePanel("config")}
                className={`h-10 w-10 rounded-full grid place-items-center border text-sm font-semibold transition-all ${
                  activePanel === "config"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-current={activePanel === "config" ? "step" : undefined}
                title="Korak 1: Konfiguracija"
              >
                1
              </button>
              <div className="w-[2px] flex-1 bg-border my-2" />
              <button
                onClick={() => setActivePanel("login")}
                className={`h-10 w-10 rounded-full grid place-items-center border text-sm font-semibold transition-all ${
                  activePanel === "login"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-current={activePanel === "login" ? "step" : undefined}
                title="Korak 2: Prijava u sustav"
              >
                2
              </button>
            </div>

            {/* Step content */}
            <div className="space-y-6">
              {activePanel === "config" && (
                <>
                  <StartPicker
                    startMode={startMode}
                    setStartMode={setStartMode}
                    onShowMore={(mode) => setShowcaseOpen(mode)}
                    onPickDevice={pickDeviceFromShowcase}
                    onPickTariff={pickTariffFromShowcase}
                  />

                  <LineConfigurator
                    lines={lines}
                    onAddLine={addLine}
                    onRemoveLine={removeLine}
                    onUpdateLine={updateLine}
                    onOpenTariffModal={setTariffModalFor}
                    onOpenDeviceModal={setDeviceModalFor}
                    onOpenAddonsModal={setAddonsModalFor}
                    walletTotal={walletTotal}
                    walletRemaining={walletRemaining}
                  />
                </>
              )}

              {activePanel === "login" && (
                <LoginPanel
                  onOpenOTP={() => setOtpOpen(true)}
                  onOpenLogin={() => setLoginOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar: Summary (sticky) */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 self-start">
          <Summary monthly={monthly} onetime={onetime} lineCount={lines.length} />
        </div>
      </div>

      {/* Modals */}
      {tariffModalFor && (
        <TariffModal
          current={lines.find((l) => l.id === tariffModalFor)!}
          onClose={() => setTariffModalFor(null)}
          onSave={(tariffId) => {
            updateLine(tariffModalFor, { tariffId });
            setTariffModalFor(null);
          }}
        />
      )}

      {deviceModalFor && (
        <DeviceModal
          current={lines.find((l) => l.id === deviceModalFor)!}
          onClose={() => setDeviceModalFor(null)}
          onSave={(deviceId, pay, rate) => {
            updateLine(deviceModalFor, {
              deviceId,
              devicePayment: pay,
              deviceMonthly: pay === "installments" ? rate : null,
            });
            setDeviceModalFor(null);
          }}
        />
      )}

      {addonsModalFor && (
        <AddonsModal
          current={lines.find((l) => l.id === addonsModalFor)!}
          onClose={() => setAddonsModalFor(null)}
          onSave={(ids) => {
            updateLine(addonsModalFor, { addonIds: ids });
            setAddonsModalFor(null);
          }}
        />
      )}

      {showcaseOpen && (
        <ShowcaseModal
          mode={showcaseOpen}
          onClose={() => setShowcaseOpen(null)}
          onPickDevice={pickDeviceFromShowcase}
          onPickTariff={pickTariffFromShowcase}
        />
      )}

      {otpOpen && (
        <OTPModal
          maskedTarget={maskedPhone}
          code={otp}
          setCode={setOtp}
          onClose={() => setOtpOpen(false)}
          onSubmit={() => setOtpOpen(false)}
        />
      )}

      {loginOpen && (
        <LoginModal
          user={authUser}
          pass={authPass}
          onChangeUser={setAuthUser}
          onChangePass={setAuthPass}
          onClose={() => setLoginOpen(false)}
          onSubmit={() => setLoginOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
