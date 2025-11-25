import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { tariffs, devices } from "@/data/catalog";
import type { Line } from "@/types";

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
  const allLinesConfigured = lines.every((line) => line.lineType !== null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-2">Sažetak narudžbe</h1>
        <p className="text-muted-foreground">Korak 4 od 4 - Pregled i finalizacija</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
        <table className="w-full bg-card">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 font-semibold">Linija</th>
              <th className="text-left p-4 font-semibold">Tarifa</th>
              <th className="text-left p-4 font-semibold">Uređaj</th>
              <th className="text-left p-4 font-semibold">Plaćanje</th>
              <th className="text-left p-4 font-semibold">Popust</th>
              <th className="text-right p-4 font-semibold">Mjesečno</th>
              <th className="text-right p-4 font-semibold">Jednokratno</th>
              <th className="text-left p-4 font-semibold">Vrsta linije</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const tariff = tariffs.find((t) => t.id === line.tariffId);
              const device = devices.find((d) => d.id === line.deviceId);
              const variant = device?.variants?.find((v) => v.id === line.deviceVariantId);
              const devicePrice = variant?.upfront || device?.upfront || 0;
              
              const tariffMonthly = tariff?.monthly ?? 0;
              let deviceMonthly = 0;
              if (line.devicePayment === "installments" && device && device.id !== "no-dev") {
                // deviceMonthly now stores the monthly installment amount
                deviceMonthly = line.deviceMonthly ?? 0;
              }
              const screenInsuranceCost = device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0;
              const lineMonthly = tariffMonthly + deviceMonthly + screenInsuranceCost;

              // For upfront: show device upfront - wallet
              // For installments: show upfront = device.upfront - (monthlyRate × 24) - wallet
              let lineOnetime = 0;
              if (device && device.id !== "no-dev") {
                if (line.devicePayment === "upfront") {
                  lineOnetime = Math.max(0, devicePrice - (line.walletUse ?? 0));
                } else {
                  // Installments: upfront = device price - total installments - wallet
                  const monthlyRate = line.deviceMonthly ?? 0;
                  const totalInstallments = monthlyRate * 24;
                  lineOnetime = Math.max(0, devicePrice - totalInstallments - (line.walletUse ?? 0));
                }
              }

              const lineTypeName = line.lineType === "new" ? "Nova linija" :
                line.lineType === "mnp" ? "Prijenos broja" :
                line.lineType === "pre2post" ? "S bonova na pretplatu" :
                line.lineType === "renew" ? "Produljenje linije" : null;

              return (
                <tr key={line.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">Linija {index + 1}</td>
                  <td className="p-4">
                    <div className="font-semibold">{tariff?.name}</div>
                    <div className="text-xs text-muted-foreground">{tariff?.data}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{device?.name}</div>
                    {variant && (
                      <div className="text-xs text-muted-foreground">
                        {variant.color} • {variant.memory}
                      </div>
                    )}
                    {device && device.id !== "no-dev" && line.screenInsurance && (
                      <div className="text-xs text-muted-foreground">
                        Zaštita ekrana
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {device?.id !== "no-dev" ? (
                      line.devicePayment === "installments" ? `Rate (24 mj × €${line.deviceMonthly?.toFixed(2) ?? "0.00"})` : "Jednokratno"
                    ) : "—"}
                  </td>
                  <td className="p-4">
                    {line.walletUse ? (
                      <span className="text-primary font-semibold">-€{line.walletUse.toFixed(2)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold">
                    €{lineMonthly.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-semibold">
                    {lineOnetime > 0 ? `€${lineOnetime.toFixed(2)}` : "—"}
                  </td>
                  <td className="p-4">
                    <Button
                      variant={line.lineType ? "outline" : "default"}
                      size="sm"
                      onClick={() => onOpenLineTypeModal(line.id)}
                      className="w-full justify-start"
                    >
                      {line.lineType ? (
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-primary" />
                          <span className="text-xs">{lineTypeName}</span>
                        </div>
                      ) : (
                        <span className="text-xs">Odaberi vrstu</span>
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30">
              <td colSpan={5} className="p-4 text-right font-bold text-lg">
                UKUPNO:
              </td>
              <td className="p-4 text-right font-bold text-xl text-primary">
                €{totalMonthly.toFixed(2)}/mj
              </td>
              <td className="p-4 text-right font-bold text-xl text-primary">
                {totalOnetime > 0 ? `€${totalOnetime.toFixed(2)}` : "—"}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        *Sve cijene su bez PDV-a
      </div>
    </div>
  );
}
