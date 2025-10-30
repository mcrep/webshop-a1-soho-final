import { tariffs, devices, addons } from "@/data/catalog";
import type { Line } from "@/types";

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
          
          const deviceMonthly =
            line.devicePayment === "installments"
              ? (line.deviceMonthly ?? device?.installment ?? 0)
              : 0;
          
          const deviceUpfront =
            line.devicePayment === "upfront" ? (device?.upfront ?? 0) : 0;
          
          const appliedWallet = line.walletUse ?? 0;
          
          const screenInsuranceCost = device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0;
          
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

              <div className="space-y-2 text-sm">
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
