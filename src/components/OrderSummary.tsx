import { tariffs, devices, addons } from "@/data/catalog";
import type { Line } from "@/types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type OrderSummaryProps = {
  lines: Line[];
  getLineLabel: (line: Line, index: number) => string;
};

export function OrderSummary({ lines, getLineLabel }: OrderSummaryProps) {
  // Calculate Mozaik discount based on number of lines
  const getMozaikDiscount = () => {
    const lineCount = lines.length;
    if (lineCount === 1) return 0;
    if (lineCount === 2) return 1;
    if (lineCount === 3) return 2;
    return 3;
  };

  const mozaikDiscountPerLine = getMozaikDiscount();

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Detaljni sažetak narudžbe</h2>
      
      <div className="space-y-6">
        {lines.map((line, index) => {
          const tariff = tariffs.find((t) => t.id === line.tariffId);
          const device = devices.find((d) => d.id === line.deviceId);
          const lineAddons = line.addonIds.map((id) => addons.find((a) => a.id === id)).filter(Boolean);
          
          let deviceMonthly = 0;
          if (line.devicePayment === "installments" && device && device.id !== "no-dev") {
            // deviceMonthly now stores the monthly installment amount
            deviceMonthly = line.deviceMonthly ?? 0;
          }
          
          // Calculate upfront
          let deviceUpfront = 0;
          if (device && device.id !== "no-dev") {
            if (line.devicePayment === "upfront") {
              deviceUpfront = device.upfront;
            } else {
              // For installments: upfront = device price - total installments
              const monthlyRate = line.deviceMonthly ?? 0;
              const totalInstallments = monthlyRate * 24;
              deviceUpfront = Math.max(0, device.upfront - totalInstallments);
            }
          }
          
          const appliedWallet = line.walletUse ?? 0;
          
          const screenInsuranceCost = device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0;
          
          const totalMonthly = Math.max(
            0,
            (tariff?.monthly ?? 0) +
              deviceMonthly +
              lineAddons.reduce((sum, addon) => sum + (addon?.monthly ?? 0), 0) +
              screenInsuranceCost -
              mozaikDiscountPerLine
          );
          
          const totalOnetime = Math.max(0, deviceUpfront - appliedWallet);

          return (
            <div
              key={line.id}
              className="rounded-xl border border-border bg-muted/30 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base">{getLineLabel(line, index)}</h3>
                {line.lineType && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">
                    {line.lineType === "mnp" && "Prijenos broja"}
                    {line.lineType === "pre2post" && "Prepaid → Postpaid"}
                    {line.lineType === "renew" && "Produljenje linije"}
                  </span>
                )}
              </div>

              {/* Basic info row */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Tarifa</div>
                  <div className="font-medium">{tariff?.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Uređaj</div>
                  <div className="font-medium">{device?.name || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Vrsta linije</div>
                  <div className="font-medium">
                    {line.lineType === "new" && "Nova"}
                    {line.lineType === "mnp" && "Prijenos"}
                    {line.lineType === "pre2post" && "Pre→Post"}
                    {line.lineType === "renew" && "Produljenje"}
                    {!line.lineType && "-"}
                  </div>
                </div>
              </div>

              {/* Price info with tooltips */}
              <TooltipProvider>
                <div className="flex gap-6 text-sm pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Mjesečno: €{totalMonthly.toFixed(2)}</span>
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
                      <span className="font-semibold">Jednokratno: €{totalOnetime.toFixed(2)}</span>
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

              <div className="space-y-2 text-sm pt-2 border-t border-border">
                {/* Tariff */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tarifa</span>
                  <span className="font-medium">{tariff?.name} - €{tariff?.monthly.toFixed(2)}/mj</span>
                </div>

                {/* Mozaik discount */}
                {mozaikDiscountPerLine > 0 && (
                  <div className="flex items-center justify-between pl-4">
                    <span className="text-muted-foreground text-xs">Mozaik popust</span>
                    <span className="text-xs text-primary">-€{mozaikDiscountPerLine.toFixed(2)}/mj</span>
                  </div>
                )}

                {/* Device */}
                {device && device.id !== "no-dev" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Uređaj</span>
                      <span className="font-medium">{device.name}</span>
                    </div>
                    
                    {line.devicePayment === "installments" && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-muted-foreground text-xs">Rate</span>
                        <span className="text-xs">€{deviceMonthly.toFixed(2)}/mj</span>
                      </div>
                    )}
                    
                    {line.devicePayment === "upfront" && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-muted-foreground text-xs">Jednokratno</span>
                        <span className="text-xs">€{device.upfront.toFixed(2)}</span>
                      </div>
                    )}

                    {line.screenInsurance && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-muted-foreground text-xs">Osiguranje ekrana</span>
                        <span className="text-xs">€{screenInsuranceCost.toFixed(2)}/mj</span>
                      </div>
                    )}

                    {/* Wallet */}
                    {appliedWallet > 0 && (
                      <div className="flex items-center justify-between pl-4">
                        <span className="text-muted-foreground text-xs">A1 Wallet popust</span>
                        <span className="text-xs text-primary">-€{appliedWallet.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Addons */}
                {lineAddons.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Opcije</span>
                    {lineAddons.map((addon) => (
                      <div key={addon!.id} className="flex items-center justify-between pl-4">
                        <span className="text-xs text-muted-foreground">{addon!.name}</span>
                        <span className="text-xs">€{addon!.monthly.toFixed(2)}/mj</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Line totals */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Ukupno mjesečno</span>
                  <span>€{totalMonthly.toFixed(2)}</span>
                </div>
                {totalOnetime > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jednokratno</span>
                    <span>€{totalOnetime.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
