import { useMemo, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LineTabs } from "@/components/LineTabs";
import { LineDetailConfig } from "@/components/LineDetailConfig";
import { Summary } from "@/components/Summary";
import { LoginPanel } from "@/components/LoginPanel";
import { OrderSummary } from "@/components/OrderSummary";
import { DeviceModal } from "@/components/modals/DeviceModal";
import { DeviceListModal } from "@/components/modals/DeviceListModal";
import { OTPModal } from "@/components/modals/OTPModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { NumberPortingModal } from "@/components/modals/NumberPortingModal";
import { PrepaidToPostpaidModal } from "@/components/modals/PrepaidToPostpaidModal";
import { ExistingLineExtensionModal } from "@/components/modals/ExistingLineExtensionModal";
import { tariffs, devices, addons } from "@/data/catalog";
import type { Line } from "@/types";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

const Index = () => {
  // State
  const [lines, setLines] = useState<Line[]>([
    {
      id: rid(),
      tariffId: "biz-m",
      deviceId: null,
      devicePayment: "installments",
      deviceMonthly: null,
      addonIds: [],
      lineType: null,
      walletUse: 0,
      screenInsurance: true,
    },
  ]);
  const [activeLineId, setActiveLineId] = useState<string>(lines[0]?.id || rid());
  const [deviceModalFor, setDeviceModalFor] = useState<string | null>(null);
  const [deviceListModalFor, setDeviceListModalFor] = useState<string | null>(null);
  const [lineTypeModalFor, setLineTypeModalFor] = useState<{ lineId: string; lineType: string } | null>(null);
  const [activePanel, setActivePanel] = useState<"config" | "login">("config");
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [loginOpen, setLoginOpen] = useState(false);

  const maskedPhone = "********97";

  // Mutators
  const addLine = () => {
    const newId = rid();
    setLines((ls) => [
      ...ls,
      {
        id: newId,
        tariffId: "biz-m",
        deviceId: null,
        devicePayment: "installments",
        deviceMonthly: null,
        addonIds: [],
        lineType: null,
        walletUse: 0,
        screenInsurance: true,
      },
    ]);
    setActiveLineId(newId);
  };

  const removeLine = (id: string) => {
    setLines((ls) => {
      const filtered = ls.filter((l) => l.id !== id);
      // If removing active line, switch to first available
      if (id === activeLineId && filtered.length > 0) {
        setActiveLineId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateLine = (id: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  // Ensure activeLineId is always valid
  useEffect(() => {
    if (lines.length > 0 && !lines.find((l) => l.id === activeLineId)) {
      setActiveLineId(lines[0].id);
    }
  }, [lines, activeLineId]);

  // Get active line data
  const activeLine = lines.find((l) => l.id === activeLineId);

  // Helper function to get line label
  const getLineLabel = (line: Line, index: number) => {
    if (line.portingNumber) return line.portingNumber;
    if (line.prepaidNumber) return line.prepaidNumber;
    if (line.existingLineId) {
      // Mock data for existing lines - should match ExistingLineExtensionModal
      const existingLines = [
        { id: "line-1", number: "385912345678" },
        { id: "line-2", number: "385918765432" },
        { id: "line-3", number: "385915551234" },
      ];
      const existing = existingLines.find(l => l.id === line.existingLineId);
      if (existing) return existing.number;
    }
    return `Linija ${index + 1}`;
  };

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

  // Wallet calculation for active line
  const sumUsedOthers = lines.reduce(
    (sum, l) => sum + (l.id === activeLineId ? 0 : l.walletUse ?? 0),
    0
  );
  const walletAvailForActiveLine = Math.max(0, walletTotal - sumUsedOthers);

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
        const device = devices.find((x) => x.id === l.deviceId);
        const screenInsuranceCost = device && device.id !== "no-dev" && l.screenInsurance ? 4.99 : 0;
        return s + Math.max(0, t + devMonthly + add - applied + screenInsuranceCost);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        onOpenOTP={() => setOtpOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-8 grid lg:grid-cols-[1.5fr,1fr] gap-8">
        {/* Left/main content */}
        <div className="order-2 lg:order-1">
          {/* Steps layout */}
          <div className="grid grid-cols-[80px,1fr] gap-4">
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
              <div className="w-[2px] h-24 bg-border my-2" />
              <button
                onClick={() => setActivePanel("login")}
                className={`h-10 w-10 rounded-full grid place-items-center border text-sm font-semibold transition-all ${
                  activePanel === "login"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-current={activePanel === "login" ? "step" : undefined}
                title="Korak 2: Sažetak narudžbe"
              >
                2
              </button>
            </div>

            {/* Step content */}
            <div className="space-y-6">
              {activePanel === "config" && (
                <>
                  <section className="rounded-2xl border border-border bg-card shadow-sm p-4">
                    <h2 className="text-lg font-semibold mb-4">Konfiguracija linija</h2>
                    <LineTabs
                      lines={lines}
                      activeLineId={activeLineId}
                      onSelectLine={setActiveLineId}
                      onAddLine={addLine}
                      onRemoveLine={removeLine}
                    />
                  </section>

                  {activeLine && (
                    <section className="rounded-2xl border border-border bg-card shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-6">
                        Detaljna konfiguracija - {getLineLabel(activeLine, lines.findIndex((l) => l.id === activeLineId))}
                      </h2>
                      <LineDetailConfig
                        line={activeLine}
                        onChange={(patch) => updateLine(activeLineId, patch)}
                        onOpenDeviceModal={() => setDeviceModalFor(activeLineId)}
                        onOpenDeviceListModal={() => setDeviceListModalFor(activeLineId)}
                        onOpenLineTypeModal={(lineType) => setLineTypeModalFor({ lineId: activeLineId, lineType })}
                      />
                    </section>
                  )}
                </>
              )}

              {activePanel === "login" && (
                <OrderSummary lines={lines} getLineLabel={getLineLabel} />
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar: Summary (sticky) */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-6 self-start space-y-4">
          <Summary monthly={monthly} onetime={onetime} lineCount={lines.length} />
        </div>
      </div>

      {/* Modals */}
      {deviceListModalFor && (
        <DeviceListModal
          onClose={() => setDeviceListModalFor(null)}
          onSelectDevice={(deviceId) => {
            updateLine(deviceListModalFor, { deviceId });
            setDeviceListModalFor(null);
            setDeviceModalFor(deviceListModalFor);
          }}
        />
      )}

      {deviceModalFor && (
        <DeviceModal
          current={lines.find((l) => l.id === deviceModalFor)!}
          onClose={() => setDeviceModalFor(null)}
          onSave={(deviceId, pay, rate, walletUse, screenInsurance) => {
            updateLine(deviceModalFor, {
              deviceId,
              devicePayment: pay,
              deviceMonthly: pay === "installments" ? rate : null,
              walletUse,
              screenInsurance,
            });
            setDeviceModalFor(null);
          }}
          walletAvailForLine={walletAvailForActiveLine}
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

      {/* Line type modals */}
      {lineTypeModalFor?.lineType === "mnp" && (
        <NumberPortingModal
          current={lines.find((l) => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, data);
            setLineTypeModalFor(null);
          }}
        />
      )}

      {lineTypeModalFor?.lineType === "pre2post" && (
        <PrepaidToPostpaidModal
          current={lines.find((l) => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, data);
            setLineTypeModalFor(null);
          }}
        />
      )}

      {lineTypeModalFor?.lineType === "renew" && (
        <ExistingLineExtensionModal
          current={lines.find((l) => l.id === lineTypeModalFor.lineId)!}
          onClose={() => setLineTypeModalFor(null)}
          onSave={(data) => {
            updateLine(lineTypeModalFor.lineId, data);
            setLineTypeModalFor(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
