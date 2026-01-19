import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, Smartphone, CreditCard, Shield, Wallet, Tag, AlertTriangle } from "lucide-react";
import { tariffs, devices } from "@/data/catalog";
import { findExistingLineNumber } from "@/data/mock-existing-lines";
import type { Line } from "@/types";
import { cn } from "@/lib/utils";

const formatMsisdn = (value: string) => {
  const digits = value.replace(/\D/g, "");
  // HR format: 385 + (2 digits) + (3 digits) + (4 digits)
  if (digits.startsWith("385") && digits.length === 12) {
    return `+385 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  // Local format without country code: 9X XXX XXXX (8-9 digits)
  if (digits.length >= 8 && digits.length <= 9 && digits.startsWith("9")) {
    return `+385 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return value;
};

type Step4Props = {
  lines: Line[];
  totalMonthly: number;
  totalOnetime: number;
  onUpdateLine: (id: string, patch: Partial<Line>) => void;
  onBack: () => void;
  onFinish: () => void;
  onOpenLineTypeModal: (lineId: string) => void;
};

export function Step4Summary({
  lines,
  totalMonthly,
  totalOnetime,
  onUpdateLine,
  onBack,
  onFinish,
  onOpenLineTypeModal,
}: Step4Props) {
  // Find unconfigured non-extension lines
  const unconfiguredLineIds = useMemo(() => {
    return lines
      .filter((line) => !line.isExtension && line.lineType === null)
      .map((line) => line.id);
  }, [lines]);

  // All lines start collapsed
  const [expandedLines, setExpandedLines] = useState<Set<string>>(
    () => new Set()
  );
  
  const allLinesConfigured = lines.every((line) => line.isExtension || line.lineType !== null);
  const unconfiguredCount = unconfiguredLineIds.length;

  const toggleLine = (lineId: string) => {
    setExpandedLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lineId)) {
        newSet.delete(lineId);
      } else {
        newSet.add(lineId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-2">Sažetak narudžbe</h1>
        <p className="text-muted-foreground">Korak 4 od 4 - Pregled i finalizacija</p>
      </div>

      {/* Warning Banner */}
      {!allLinesConfigured && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-400 animate-fade-in">
          <AlertTriangle className="shrink-0" size={20} />
          <p className="text-sm font-medium">
            Molimo odaberite vrstu linije za {unconfiguredCount} {unconfiguredCount === 1 ? "liniju" : unconfiguredCount < 5 ? "linije" : "linija"} prije završetka narudžbe.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {lines.map((line, index) => {
          const tariff = tariffs.find((t) => t.id === line.tariffId);
          const device = devices.find((d) => d.id === line.deviceId);
          const variant = device?.variants?.find((v) => v.id === line.deviceVariantId);
          const devicePrice = variant?.upfront || device?.upfront || 0;
          
          const tariffMonthly = tariff?.monthly ?? 0;
          let deviceMonthly = 0;
          if (line.devicePayment === "installments" && device && device.id !== "no-dev") {
            deviceMonthly = line.deviceMonthly ?? 0;
          }
          const screenInsuranceCost = device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0;
          const lineMonthly = tariffMonthly + deviceMonthly + screenInsuranceCost;

          let lineOnetime = 0;
          if (device && device.id !== "no-dev") {
            if (line.devicePayment === "upfront") {
              lineOnetime = Math.max(0, devicePrice - (line.walletUse ?? 0));
            } else {
              const monthlyRate = line.deviceMonthly ?? 0;
              const totalInstallments = monthlyRate * 24;
              lineOnetime = Math.max(0, devicePrice - totalInstallments - (line.walletUse ?? 0));
            }
          }

          const lineTypeName = line.lineType === "new" ? "Nova linija" :
            line.lineType === "mnp" ? "Prijenos broja" :
            line.lineType === "pre2post" ? "S bonova na pretplatu" :
            line.lineType === "renew" ? "Produljenje postojeće linije" : null;

          const existingResolved = findExistingLineNumber(line.existingLineId);
          const existingFallback = line.existingLineId && /^\+?\d{6,}$/.test(line.existingLineId.replace(/\s/g, ""))
            ? line.existingLineId
            : undefined;

          const msisdnRaw =
            line.portingNumber ??
            line.prepaidNumber ??
            (line.isExtension ? line.extensionLabel : undefined) ??
            existingResolved ??
            existingFallback;

          const msisdn = msisdnRaw ? formatMsisdn(msisdnRaw) : undefined;

          const isExtensionLine = line.isExtension === true;

          const isExpanded = expandedLines.has(line.id);

          const needsLineType = !isExtensionLine && line.lineType === null;

          return (
            <div
              key={line.id}
              className={cn(
                "rounded-2xl border bg-card shadow-sm overflow-hidden transition-all duration-200",
                "border-border",
                isExpanded && "ring-2 ring-primary/20"
              )}
            >
              {/* Card Header - Always Visible */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleLine(line.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-foreground">{index + 1}</span>
                    </div>

                    <div className="min-w-0">
                      <div className={cn(
                        "text-lg font-semibold tracking-tight truncate",
                        msisdn ? "font-mono" : ""
                      )}>
                        {msisdn ?? (isExtensionLine ? `Linija ${index + 1}` : `Nova linija ${index + 1}`)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {tariff?.name} • {device?.id !== "no-dev" ? `${device?.brand} ${device?.name}` : "Bez uređaja"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{lineMonthly.toFixed(2)}€<span className="text-sm font-normal text-muted-foreground">/mj</span></div>
                      {lineOnetime > 0 && (
                        <div className="text-sm text-muted-foreground">+ {lineOnetime.toFixed(2)}€ jednokratno</div>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Type Selection - Only for non-extension lines */}
              {!isExtensionLine && (
                <div className={cn(
                  "px-4 pb-4 border-t bg-muted/5",
                  needsLineType ? "border-orange-500/30" : "border-border"
                )}>
                  <div className={cn(
                    "flex items-center justify-between py-3 rounded-lg px-2 -mx-2",
                    needsLineType && "animate-pulse bg-orange-500/5"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        line.lineType ? "bg-primary/10" : "bg-orange-500/20"
                      )}>
                        {line.lineType ? (
                          <Check size={16} className="text-primary" />
                        ) : (
                          <AlertTriangle size={16} className="text-orange-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Vrsta linije</h4>
                        <p className={cn(
                          "text-sm",
                          line.lineType ? "text-primary font-medium" : "text-orange-600 font-medium"
                        )}>
                          {line.lineType ? lineTypeName : "Obavezno odaberite vrstu linije"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={line.lineType ? "outline" : "default"}
                      size="sm"
                      className={cn(
                        !line.lineType && "bg-orange-500 hover:bg-orange-600 text-white"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLineTypeModal(line.id);
                      }}
                    >
                      {line.lineType ? "Promijeni" : "Odaberi vrstu"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/10 p-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tariff Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tarifa</h4>
                      <div className="bg-card rounded-xl p-3 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Tag size={18} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{tariff?.name}</div>
                          </div>
                          <div className="text-right font-semibold">{tariffMonthly.toFixed(2)}€/mj</div>
                        </div>
                      </div>
                    </div>

                    {/* Device Details */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Uređaj</h4>
                      <div className="bg-card rounded-xl p-3 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                            <Smartphone size={18} className="text-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{device?.id !== "no-dev" ? `${device?.brand} ${device?.name}` : "Bez uređaja"}</div>
                          </div>
                          {device?.id !== "no-dev" && (
                            <div className="text-right font-semibold">
                              {line.devicePayment === "installments" 
                                ? `${lineOnetime.toFixed(2)}€` 
                                : `${devicePrice.toFixed(2)}€`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    {device?.id !== "no-dev" && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Način plaćanja</h4>
                        <div className="bg-card rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                              <CreditCard size={18} className="text-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">
                                {line.devicePayment === "installments" ? "Plaćanje na rate" : "Jednokratno plaćanje"}
                              </div>
                            </div>
                            {line.devicePayment === "installments" ? (
                              <div className="text-right font-semibold">{deviceMonthly.toFixed(2)}€/mj</div>
                            ) : (
                              <div className="text-right font-semibold">{lineOnetime.toFixed(2)}€</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wallet Discount */}
                    {device?.id !== "no-dev" && line.walletUse !== undefined && line.walletUse > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">A1 Wallet popust</h4>
                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Wallet size={18} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-primary">Iskorišteni kredit</div>
                              <div className="text-sm text-muted-foreground">Popust na uređaj</div>
                            </div>
                            <div className="text-right font-semibold text-primary">-{line.walletUse.toFixed(2)}€</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Screen Insurance */}
                    {device?.id !== "no-dev" && line.screenInsurance && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Osiguranje</h4>
                        <div className="bg-card rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <Shield size={18} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">Osiguranje ekrana</div>
                            </div>
                            <div className="text-right font-semibold">4.99€/mj</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Totals Card */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Ukupan trošak</h3>
            <p className="text-sm text-muted-foreground">{lines.length} {lines.length === 1 ? "linija" : lines.length < 5 ? "linije" : "linija"} u narudžbi</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Mjesečno</div>
              <div className="text-2xl font-bold text-primary">{totalMonthly.toFixed(2)}€</div>
            </div>
            {totalOnetime > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Jednokratno</div>
                <div className="text-2xl font-bold">{totalOnetime.toFixed(2)}€</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        *Sve cijene su bez PDV-a
      </div>

      {/* Disabled Button Helper Text */}
      {!allLinesConfigured && (
        <div className="text-center text-sm text-orange-600 dark:text-orange-400">
          Gumb "Završi narudžbu" bit će dostupan nakon odabira vrste za sve linije.
        </div>
      )}
    </div>
  );
}
