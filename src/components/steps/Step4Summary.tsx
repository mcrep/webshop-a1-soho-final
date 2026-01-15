import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, Smartphone, CreditCard, Shield, Wallet, Tag } from "lucide-react";
import { tariffs, devices } from "@/data/catalog";
import type { Line } from "@/types";
import { cn } from "@/lib/utils";

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
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set());
  const allLinesConfigured = lines.every((line) => line.lineType !== null);

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
          
          const isExtensionLine = line.isExtension === true;

          const isExpanded = expandedLines.has(line.id);

          return (
            <div
              key={line.id}
              className={cn(
                "rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-200",
                isExpanded && "ring-2 ring-primary/20"
              )}
            >
              {/* Card Header - Always Visible */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleLine(line.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-center">
                      <span className="text-xs font-bold text-primary leading-tight px-1">
                        {(line.lineType === "renew" || line.lineType === "mnp" || line.lineType === "pre2post") && line.existingLineId 
                          ? line.existingLineId 
                          : `Linija ${index + 1}`}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{tariff?.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {device?.id !== "no-dev" ? `${device?.brand} ${device?.name}` : "Bez uređaja"}
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

              {/* Line Type Selection - Always Visible */}
              <div className="px-4 pb-4 border-t border-border bg-muted/5">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      line.lineType ? "bg-primary/10" : "bg-destructive/10"
                    )}>
                      {line.lineType ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        <span className="text-destructive font-bold text-sm">!</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Vrsta linije</h4>
                      <p className={cn(
                        "text-sm",
                        line.lineType ? "text-primary font-medium" : "text-destructive"
                      )}>
                        {line.lineType ? lineTypeName : "Obavezno odaberite vrstu linije"}
                        {isExtensionLine && line.extensionLabel && (
                          <span className="ml-2 text-muted-foreground">({line.extensionLabel})</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!isExtensionLine && (
                    <Button
                      variant={line.lineType ? "outline" : "default"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLineTypeModal(line.id);
                      }}
                    >
                      {line.lineType ? "Promijeni" : "Odaberi vrstu"}
                    </Button>
                  )}
                </div>
              </div>

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
                            <div className="text-right text-sm">
                              {line.devicePayment === "installments" ? (
                                <>
                                  <div className="font-semibold">{lineOnetime.toFixed(2)}€</div>
                                  <div className="text-muted-foreground">upfront</div>
                                </>
                              ) : (
                                <>
                                  <div className="font-semibold">{devicePrice.toFixed(2)}€</div>
                                  <div className="text-muted-foreground">MPC</div>
                                </>
                              )}
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
                              {line.devicePayment === "installments" && (
                                <div className="text-sm text-muted-foreground">24 mjeseca × {(line.deviceMonthly ?? 0).toFixed(2)}€</div>
                              )}
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
                    {line.walletUse && line.walletUse > 0 && (
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
    </div>
  );
}
