import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { tariffs, devices } from "@/data/catalog";
import type { Line } from "@/types";

type Step3Props = {
  lines: Line[];
  totalWallet: number;
  walletUsed: number;
  onUpdateLine: (id: string, patch: Partial<Line>) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenDeviceModal: (lineId: string) => void;
};

export function Step3DeviceConfiguration({
  lines,
  totalWallet,
  walletUsed,
  onUpdateLine,
  onNext,
  onBack,
  onOpenDeviceModal,
}: Step3Props) {
  const walletRemaining = totalWallet - walletUsed;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Odabir uređaja</h1>
        <p className="text-muted-foreground">Korak 3 od 4 - Konfigurirajte uređaje za svaku liniju</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Preostali A1 Wallet kredit:</span>
          <span className="text-xl font-bold text-primary">€{walletRemaining.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {lines.map((line, index) => {
          const tariff = tariffs.find((t) => t.id === line.tariffId);
          const device = devices.find((d) => d.id === line.deviceId);
          const hasDevice = device && device.id !== "no-dev";

          // Calculate max wallet for this device
          const deviceCost = line.devicePayment === "installments" 
            ? (device?.installment ?? 0) * 24 
            : (device?.upfront ?? 0);
          const sumUsedOthers = lines.reduce(
            (sum, l) => sum + (l.id === line.id ? 0 : l.walletUse ?? 0),
            0
          );
          const maxWalletForDevice = Math.min(deviceCost, totalWallet - sumUsedOthers);

          return (
            <div
              key={line.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Linija {index + 1}</div>
                  <h3 className="text-xl font-bold">{tariff?.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    €{tariff?.monthly.toFixed(2)}/mj • {tariff?.data} • A1 Wallet: €{tariff?.walletCredit}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Device selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Uređaj</label>
                  <Button
                    variant="outline"
                    onClick={() => onOpenDeviceModal(line.id)}
                    className="w-full justify-start text-left h-auto py-3"
                  >
                    {device ? (
                      <div className="flex items-center gap-3">
                        {device.emoji && <span className="text-2xl">{device.emoji}</span>}
                        <div>
                          <div className="font-semibold">{device.name}</div>
                          {device.id !== "no-dev" && (
                            <div className="text-xs text-muted-foreground">
                              MPC: €{device.upfront} • Rata: €{device.installment}/mj
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Odaberi uređaj</span>
                    )}
                  </Button>
                </div>

                {/* Payment method */}
                {hasDevice && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Način plaćanja</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={line.devicePayment === "installments" ? "default" : "outline"}
                        onClick={() => onUpdateLine(line.id, { devicePayment: "installments" })}
                        className="h-auto py-3"
                      >
                        <div>
                          <div className="font-semibold">Rate</div>
                          <div className="text-xs">24 mjeseca</div>
                        </div>
                      </Button>
                      <Button
                        variant={line.devicePayment === "upfront" ? "default" : "outline"}
                        onClick={() => onUpdateLine(line.id, { devicePayment: "upfront" })}
                        className="h-auto py-3"
                      >
                        <div>
                          <div className="font-semibold">Jednokratno</div>
                          <div className="text-xs">MPC cijena</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet discount */}
              {hasDevice && (
                <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label className="text-sm font-medium">Popust A1 Wallet (€)</label>
                      <div className="text-xs text-muted-foreground mt-1">
                        Maksimalno: €{maxWalletForDevice.toFixed(2)}
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={maxWalletForDevice}
                      step="1"
                      value={Math.round(line.walletUse ?? 0)}
                      onChange={(e) => {
                        const val = Math.round(parseFloat(e.target.value) || 0);
                        const clamped = Math.min(Math.max(0, val), maxWalletForDevice);
                        onUpdateLine(line.id, { walletUse: clamped });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === ',') {
                          e.preventDefault();
                        }
                      }}
                      className="w-28 bg-background border border-input rounded-lg px-3 py-2 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Screen insurance */}
              {hasDevice && (
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`insurance-${line.id}`}
                    checked={line.screenInsurance ?? true}
                    onChange={(e) => onUpdateLine(line.id, { screenInsurance: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <label htmlFor={`insurance-${line.id}`} className="text-sm cursor-pointer">
                    Zaštita ekrana (+€4.99/mj)
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} size="lg">
          Nastavi na sažetak
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
