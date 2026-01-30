import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { tariffs, devices } from "@/data/catalog";
import { findExistingLineNumber } from "@/data/mock-existing-lines";
import type { Line } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        <h1 className="text-3xl font-bold">Sažetak narudžbe</h1>
      </div>


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
                "rounded-2xl border-2 bg-card shadow-sm overflow-hidden transition-all duration-200 cursor-pointer",
                isExpanded 
                  ? "border-border" 
                  : "border-transparent hover:border-foreground"
              )}
              onClick={() => toggleLine(line.id)}
            >
              {/* Card Header - Always Visible */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-foreground">{index + 1}</span>
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className={cn(
                        "text-lg font-semibold tracking-tight truncate",
                        msisdn ? "font-mono" : ""
                      )}>
                        {msisdn ?? `Nova linija ${index + 1}`}
                      </div>
                      
                      {/* Badge row: Tariff, Device, Line Type */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                          {tariff?.name}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                          {device?.id !== "no-dev" ? `${device?.brand} ${device?.name}` : "Bez uređaja"}
                        </span>
                        
                        {/* Line Type: Button or Badge */}
                        {!isExtensionLine && (
                          line.lineType ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                              {lineTypeName}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateLine(line.id, { lineType: null, portingNumber: undefined, prepaidNumber: undefined });
                                }}
                                className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                                aria-label="Ukloni odabir"
                              >
                                <X size={12} className="text-muted-foreground" />
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenLineTypeModal(line.id);
                              }}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              Odaberi vrstu
                            </button>
                          )
                        )}
                      </div>
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


              {/* Expanded Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border p-4 space-y-4">
                      
                      {/* PAKET sekcija */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Paket
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tariff?.name}</span>
                          <span className="font-semibold">{tariffMonthly.toFixed(2)}€/mj</span>
                        </div>
                      </div>

                      {/* Separator */}
                      {device?.id !== "no-dev" && <div className="border-t border-border" />}

                      {/* UREĐAJ sekcija */}
                      {device?.id !== "no-dev" && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Uređaj
                          </div>
                          
                          {/* Naziv uređaja s varijantom */}
                          <div className="font-medium">
                            {device?.brand} {device?.name}
                            {variant && ` · ${variant.color} · ${variant.memory}`}
                          </div>

                          {/* Podstavke s uvlakom */}
                          <div className="pl-4 space-y-1 text-sm">
                            {/* Način plaćanja */}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {line.devicePayment === "installments" 
                                  ? "Plaćanje na rate (24 mj)" 
                                  : "Jednokratno plaćanje"}
                              </span>
                              <span>
                                {line.devicePayment === "installments" 
                                  ? `${deviceMonthly.toFixed(2)}€/mj` 
                                  : `${lineOnetime.toFixed(2)}€`}
                              </span>
                            </div>

                            {/* A1 Wallet popust - jedina stavka u boji */}
                            {line.walletUse > 0 && (
                              <div className="flex justify-between text-primary">
                                <span>A1 Wallet popust</span>
                                <span className="font-semibold">−{line.walletUse.toFixed(2)}€</span>
                              </div>
                            )}

                            {/* Osiguranje ekrana */}
                            {line.screenInsurance && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Osiguranje ekrana</span>
                                <span>4.99€/mj</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

    </div>
  );
}
