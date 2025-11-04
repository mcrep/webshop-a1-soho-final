import { useMemo, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LineTabs } from "@/components/LineTabs";
import { LineDetailConfig } from "@/components/LineDetailConfig";
import { OrderSummary } from "@/components/OrderSummary";
import { DeviceModal } from "@/components/modals/DeviceModal";
import { DeviceListModal } from "@/components/modals/DeviceListModal";
import { AddonsModal } from "@/components/modals/AddonsModal";
import { OTPModal } from "@/components/modals/OTPModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { NumberPortingModal } from "@/components/modals/NumberPortingModal";
import { PrepaidToPostpaidModal } from "@/components/modals/PrepaidToPostpaidModal";
import { ExistingLineExtensionModal } from "@/components/modals/ExistingLineExtensionModal";
import { LineTypeSelectionModal } from "@/components/modals/LineTypeSelectionModal";
import { tariffs, devices, addons } from "@/data/catalog";
import type { Line } from "@/types";
import { Edit, ChevronRight, Trash2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

const Index = () => {
  // State
  const [lines, setLines] = useState<Line[]>([
    {
      id: rid(),
      tariffId: "perfect-biz",
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
  const [addonsModalFor, setAddonsModalFor] = useState<string | null>(null);
  const [lineTypeModalFor, setLineTypeModalFor] = useState<{ lineId: string; lineType: string } | null>(null);
  const [lineTypeSelectionFor, setLineTypeSelectionFor] = useState<string | null>(null);
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
        tariffId: "perfect-biz",
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

  // Check if line has all required parameters
  const isLineComplete = (line: Line) => {
    return !!(line.tariffId && line.deviceId && line.lineType);
  };

  // Separate completed and active lines
  const completedLines = lines.filter(l => l.completed);
  const activeLineIsCompleted = activeLine?.completed ?? false;

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
        lineCount={lines.length}
        monthly={monthly}
        onetime={onetime}
        onFinishOrder={() => {
          // TODO: Implement finish order logic
          console.log("Završi narudžbu clicked");
        }}
      />

      <div className="mx-auto max-w-[1600px] px-4 py-8">
        {/* Main content */}
        <div>
          {/* Stepper - centered horizontally */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setActivePanel("config")}
                className={`h-12 w-12 rounded-full grid place-items-center border text-sm font-semibold transition-all ${
                  activePanel === "config"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-current={activePanel === "config" ? "step" : undefined}
                title="Korak 1: Konfiguracija"
              >
                1
              </button>
              <span className={`text-sm font-medium ${
                activePanel === "config" ? "text-primary" : "text-muted-foreground"
              }`}>
                Konfiguracija
              </span>
            </div>
            <div className="h-[2px] w-24 bg-border mb-6" />
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setActivePanel("login")}
                className={`h-12 w-12 rounded-full grid place-items-center border text-sm font-semibold transition-all ${
                  activePanel === "login"
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-current={activePanel === "login" ? "step" : undefined}
                title="Korak 2: Plaćanje i isporuka"
              >
                2
              </button>
              <span className={`text-sm font-medium ${
                activePanel === "login" ? "text-primary" : "text-muted-foreground"
              }`}>
                Plaćanje i isporuka
              </span>
            </div>
          </div>

          {/* Step content */}
          <div className="space-y-6">
              {activePanel === "config" && (
                <>
                  {/* Completed lines summary */}
                  {completedLines.length > 0 && (
                    <section className="space-y-4">
                      {completedLines.map((line) => {
                        const lineIndex = lines.findIndex((l) => l.id === line.id);
                        const tariff = tariffs.find((t) => t.id === line.tariffId);
                        const device = devices.find((d) => d.id === line.deviceId);
                        const lineTypeLabels = {
                          new: "Nova linija",
                          mnp: "Prijenos broja",
                          pre2post: "Prepaid u Postpaid",
                          renew: "Produženje ugovora",
                        };
                        
                        // Calculate prices for this line
                        const lineAddons = line.addonIds.map((id) => addons.find((a) => a.id === id)).filter(Boolean);
                        const deviceMonthly = line.devicePayment === "installments" ? (line.deviceMonthly ?? device?.installment ?? 0) : 0;
                        const deviceUpfront = line.devicePayment === "upfront" ? (device?.upfront ?? 0) : 0;
                        const appliedWallet = line.walletUse ?? 0;
                        const screenInsuranceCost = device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0;
                        
                        // Mozaik discount
                        const getMozaikDiscount = () => {
                          const lineCount = lines.length;
                          if (lineCount === 1) return 0;
                          if (lineCount === 2) return 1;
                          if (lineCount === 3) return 2;
                          return 3;
                        };
                        const mozaikDiscountPerLine = getMozaikDiscount();
                        
                        const totalMonthly = Math.max(
                          0,
                          (tariff?.monthly ?? 0) +
                            deviceMonthly +
                            lineAddons.reduce((sum, addon) => sum + (addon?.monthly ?? 0), 0) +
                            screenInsuranceCost -
                            (line.devicePayment === "installments" ? appliedWallet : 0) -
                            mozaikDiscountPerLine
                        );
                        
                        const totalOnetime = Math.max(
                          0,
                          deviceUpfront - (line.devicePayment === "upfront" ? appliedWallet : 0)
                        );
                        
                        return (
                          <div
                            key={line.id}
                            className="rounded-2xl border border-border bg-card shadow-sm p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">
                                {getLineLabel(line, lineIndex)}
                              </h3>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setActiveLineId(line.id);
                                    updateLine(line.id, { completed: false });
                                  }}
                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  title="Uredi liniju"
                                >
                                  <Edit size={16} />
                                  <span>Uredi</span>
                                </button>
                                <button
                                  onClick={() => removeLine(line.id)}
                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                                  title="Izbriši liniju"
                                >
                                  <Trash2 size={16} />
                                  <span>Izbriši</span>
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="rounded-xl border border-border bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Tarifa</div>
                                  <div className="font-medium">
                                    {tariff?.name}
                                  </div>
                                </div>
                                
                                <div className="rounded-xl border border-border bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Uređaj</div>
                                  <div className="font-medium">{device?.name}</div>
                                </div>
                                
                                <button
                                  onClick={() => {
                                    // Open line type selection modal
                                    setLineTypeSelectionFor(line.id);
                                  }}
                                  className={`rounded-xl border p-3 flex items-center justify-between group hover:bg-muted/50 transition-colors w-full text-left ${
                                    !line.lineType 
                                      ? "border-red-500 bg-background" 
                                      : "border-border bg-background"
                                  }`}
                                >
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">Vrsta linije</div>
                                    <div className="font-medium">
                                      {line.lineType ? lineTypeLabels[line.lineType as keyof typeof lineTypeLabels] : "-"}
                                    </div>
                                  </div>
                                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                </button>
                              </div>
                              
                              {/* Device pricing details */}
                              {device && device.id !== "no-dev" && (() => {
                                const mpcPrice = device.upfront ?? 0;
                                const rate = line.deviceMonthly ?? device.installment ?? 0;
                                const onetimeCostOriginal = line.devicePayment === "installments" 
                                  ? Math.max(0, mpcPrice - (rate * 24))
                                  : mpcPrice;
                                
                                // Calculate available wallet for this line
                                const otherLinesWallet = lines.reduce(
                                  (sum, l) => sum + (l.id === line.id ? 0 : l.walletUse ?? 0),
                                  0
                                );
                                const availableWallet = Math.max(0, walletTotal - otherLinesWallet);
                                const maxWalletForDevice = Math.min(availableWallet, Math.max(0, onetimeCostOriginal - 1));
                                
                                const currentWallet = line.walletUse ?? 0;
                                const totalDevicePrice = Math.max(1, onetimeCostOriginal - currentWallet);
                                
                                return (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-border bg-background p-3">
                                      <div className="text-xs text-muted-foreground mb-1">MPC cijena uređaja</div>
                                      <div className="font-medium">€{mpcPrice.toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="rounded-xl border border-border bg-background p-3">
                                      <div className="text-xs text-muted-foreground mb-1">Popust na uređaj (A1 Wallet)</div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="number"
                                          min="0"
                                          max={maxWalletForDevice}
                                          step="0.01"
                                          value={currentWallet.toFixed(2)}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            const clamped = Math.min(Math.max(0, val), maxWalletForDevice);
                                            updateLine(line.id, { walletUse: clamped });
                                          }}
                                          className="w-full bg-background border border-input rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <span className="text-xs text-muted-foreground">€</span>
                                      </div>
                                    </div>
                                    
                                    <div className="rounded-xl border border-border bg-background p-3">
                                      <div className="text-xs text-muted-foreground mb-1">Ukupna cijena uređaja</div>
                                      <div className="font-medium">€{totalDevicePrice.toFixed(2)}</div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Price info with tooltips */}
                            <TooltipProvider>
                              <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">Mjesečne naknade: €{totalMonthly.toFixed(2)}</span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Info size={16} />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-1 text-xs">
                                        <div className="font-semibold mb-2">Detalji mjesečne cijene:</div>
                                        <div className="flex justify-between">
                                          <span>Tarifa ({tariff?.name})</span>
                                          <span>€{tariff?.monthly.toFixed(2)}</span>
                                        </div>
                                        {mozaikDiscountPerLine > 0 && (
                                          <div className="flex justify-between text-primary">
                                            <span>Mozaik popust</span>
                                            <span>-€{mozaikDiscountPerLine.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {deviceMonthly > 0 && (
                                          <div className="flex justify-between">
                                            <span>Uređaj (rate)</span>
                                            <span>€{deviceMonthly.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {screenInsuranceCost > 0 && (
                                          <div className="flex justify-between">
                                            <span>Osiguranje ekrana</span>
                                            <span>€{screenInsuranceCost.toFixed(2)}</span>
                                          </div>
                                        )}
                                        {lineAddons.map((addon) => (
                                          <div key={addon!.id} className="flex justify-between">
                                            <span>{addon!.name}</span>
                                            <span>€{addon!.monthly.toFixed(2)}</span>
                                          </div>
                                        ))}
                                        {line.devicePayment === "installments" && appliedWallet > 0 && (
                                          <div className="flex justify-between text-primary">
                                            <span>A1 Wallet popust</span>
                                            <span>-€{appliedWallet.toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between font-semibold pt-1 mt-1 border-t border-border">
                                          <span>Ukupno</span>
                                          <span>€{totalMonthly.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                
                                {totalOnetime > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">Jednokratne naknade: €{totalOnetime.toFixed(2)}</span>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                                          <Info size={16} />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <div className="space-y-1 text-xs">
                                          <div className="font-semibold mb-2">Detalji jednokratne cijene:</div>
                                          <div className="flex justify-between">
                                            <span>Uređaj ({device?.name})</span>
                                            <span>€{deviceUpfront.toFixed(2)}</span>
                                          </div>
                                          {line.devicePayment === "upfront" && appliedWallet > 0 && (
                                            <div className="flex justify-between text-primary">
                                              <span>A1 Wallet popust</span>
                                              <span>-€{appliedWallet.toFixed(2)}</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between font-semibold pt-1 mt-1 border-t border-border">
                                            <span>Ukupno</span>
                                            <span>€{totalOnetime.toFixed(2)}</span>
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            </TooltipProvider>
                          </div>
                        );
                      })}
                    </section>
                  )}

                  <section className="rounded-2xl border border-border bg-card shadow-sm p-4">
                    {lines.every(l => l.completed) && (
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={addLine}
                          className="rounded-xl border border-dashed border-red-500 bg-card hover:bg-muted transition-colors px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <span>Želim još jednu liniju</span>
                        </button>
                        <button
                          onClick={() => {
                            console.log("Završi narudžbu clicked");
                            // TODO: Navigate to next step or process order
                          }}
                          disabled={!lines.every(l => l.lineType)}
                          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Završi narudžbu
                        </button>
                      </div>
                    )}
                    {!lines.every(l => l.completed) && (
                      <LineTabs
                        lines={lines.filter(l => !l.completed)}
                        activeLineId={activeLineId}
                        onSelectLine={setActiveLineId}
                        onAddLine={addLine}
                        onRemoveLine={removeLine}
                      />
                    )}
                  </section>

                  {activeLine && !activeLineIsCompleted && (
                    <section className="rounded-2xl border border-border bg-card shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-6">
                        Detaljna konfiguracija - {getLineLabel(activeLine, lines.findIndex((l) => l.id === activeLineId))}
                      </h2>
                      <LineDetailConfig
                        line={activeLine}
                        onChange={(patch) => updateLine(activeLineId, patch)}
                        onOpenDeviceModal={() => setDeviceModalFor(activeLineId)}
                        onOpenDeviceListModal={() => setDeviceListModalFor(activeLineId)}
                        onOpenAddonsModal={() => setAddonsModalFor(activeLineId)}
                        onComplete={() => {
                          // Mark line as completed
                          updateLine(activeLineId, { completed: true });
                          // When completed, if there are more incomplete lines, switch to first incomplete
                          const nextIncomplete = lines.find(l => l.id !== activeLineId && !l.completed);
                          if (nextIncomplete) {
                            setActiveLineId(nextIncomplete.id);
                          }
                        }}
                        showCompleteButton={true}
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

      {addonsModalFor && (
        <AddonsModal
          current={lines.find((l) => l.id === addonsModalFor)!}
          onClose={() => setAddonsModalFor(null)}
          onSave={(addonIds) => {
            updateLine(addonsModalFor, { addonIds });
            setAddonsModalFor(null);
          }}
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

      {/* Line type selection modal */}
      {lineTypeSelectionFor && (
        <LineTypeSelectionModal
          currentLineType={lines.find((l) => l.id === lineTypeSelectionFor)?.lineType}
          onClose={() => setLineTypeSelectionFor(null)}
          onSelect={(lineType) => {
            updateLine(lineTypeSelectionFor, { lineType });
            setLineTypeSelectionFor(null);
            // Open specific modal if needed
            if (lineType !== "new") {
              setLineTypeModalFor({ lineId: lineTypeSelectionFor, lineType });
            }
          }}
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
