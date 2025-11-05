import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { tariffs, devices, lineTypes } from "@/data/catalog";
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
  const allLinesHaveType = lines.every(line => line.lineType !== null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sažetak narudžbe</h1>
        <p className="text-muted-foreground">Korak 4 od 4 - Pregledajte i odaberite vrstu linije</p>
      </div>

      {/* Summary table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold">Linija</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Tarifa</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Uređaj</th>
                <th className="text-center py-3 px-4 text-sm font-semibold">Način plaćanja</th>
                <th className="text-center py-3 px-4 text-sm font-semibold">A1 Wallet popust</th>
                <th className="text-center py-3 px-4 text-sm font-semibold">Mjesečno</th>
                <th className="text-center py-3 px-4 text-sm font-semibold">Jednokratno</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Vrsta linije</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const tariff = tariffs.find((t) => t.id === line.tariffId);
                const device = devices.find((d) => d.id === line.deviceId);
                const hasDevice = device && device.id !== "no-dev";
                const lineTypeLabel = lineTypes.find((lt) => lt.id === line.lineType)?.name ?? "Nije odabrano";

                // Calculate prices
                const deviceMonthly = line.devicePayment === "installments" 
                  ? (line.deviceMonthly ?? device?.installment ?? 0)
                  : 0;
                const deviceUpfront = line.devicePayment === "upfront" ? (device?.upfront ?? 0) : 0;
                const walletDiscount = line.walletUse ?? 0;
                const screenInsuranceCost = hasDevice && line.screenInsurance ? 4.99 : 0;

                const lineMonthly = Math.max(
                  0,
                  (tariff?.monthly ?? 0) + 
                  deviceMonthly + 
                  screenInsuranceCost - 
                  (line.devicePayment === "installments" ? walletDiscount : 0)
                );

                const lineOnetime = Math.max(
                  0,
                  deviceUpfront - (line.devicePayment === "upfront" ? walletDiscount : 0)
                );

                return (
                  <tr key={line.id} className="border-b border-border hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="font-medium">Linija {index + 1}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{tariff?.name}</div>
                      <div className="text-xs text-muted-foreground">€{tariff?.monthly.toFixed(2)}/mj</div>
                    </td>
                    <td className="py-3 px-4">
                      {device ? (
                        <div>
                          <div className="font-medium">{device.name}</div>
                          {hasDevice && (
                            <div className="text-xs text-muted-foreground">
                              MPC: €{device.upfront}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasDevice ? (
                        <span className="text-sm">
                          {line.devicePayment === "installments" ? "24 rate" : "Jednokratno"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-primary">
                        {walletDiscount > 0 ? `€${walletDiscount}` : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold">€{lineMonthly.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold">
                        {lineOnetime > 0 ? `€${lineOnetime.toFixed(2)}` : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenLineTypeModal(line.id)}
                        className={line.lineType ? "" : "border-primary text-primary"}
                      >
                        {line.lineType ? (
                          <>
                            <span className="mr-2">{lineTypeLabel}</span>
                            <Edit size={14} />
                          </>
                        ) : (
                          "Odaberi"
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-muted/30 border-t-2 border-border">
              <tr>
                <td colSpan={5} className="py-4 px-4 text-right font-bold text-lg">
                  UKUPNO:
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-xl font-bold text-primary">€{totalMonthly.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">mjesečno</div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="text-xl font-bold text-primary">
                    {totalOnetime > 0 ? `€${totalOnetime.toFixed(2)}` : "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">jednokratno</div>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-muted/30 border border-border p-4">
        <p className="text-sm text-muted-foreground">
          Sve cijene su bez PDV-a. Demo izračun na temelju odabranih linija i uređaja.
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onFinish} size="lg" disabled={!allLinesHaveType}>
          Završi narudžbu
        </Button>
      </div>
    </div>
  );
}
