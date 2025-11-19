import { tariffs, devices, addons, lineTypes } from "@/data/catalog";
import type { Line } from "@/types";

type LineRowProps = {
  index: number;
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onRemove: () => void;
  onOpenTariffModal: () => void;
  onOpenDeviceModal: () => void;
  onOpenAddonsModal: () => void;
  walletAvailForLine: number;
};

export function LineRow({
  index,
  line,
  onChange,
  onRemove,
  onOpenTariffModal,
  onOpenDeviceModal,
  onOpenAddonsModal,
  walletAvailForLine,
}: LineRowProps) {
  const tariff = tariffs.find((t) => t.id === line.tariffId);
  const device = devices.find((d) => d.id === line.deviceId);
  const variant = device?.variants?.find((v) => v.id === line.deviceVariantId);
  const devicePrice = variant?.upfront || device?.upfront || 0;

  let deviceMonthly = 0;
  if (line.devicePayment === "installments" && device && device.id !== "no-dev") {
    // deviceMonthly now stores the monthly installment amount
    deviceMonthly = line.deviceMonthly ?? 0;
  }

  const monthly = Math.max(
    0,
    (tariff?.monthly ?? 0) +
      deviceMonthly +
      line.addonIds.reduce((s, id) => s + (addons.find((a) => a.id === id)?.monthly ?? 0), 0) +
      (device && device.id !== "no-dev" && line.screenInsurance ? 4.99 : 0)
  );

  // Calculate device cap for wallet usage
  let deviceCap = 0;
  if (device && device.id !== "no-dev") {
    if (line.devicePayment === "upfront") {
      deviceCap = devicePrice;
    } else {
      // For installments: wallet can reduce upfront = device price - total installments
      const monthlyRate = line.deviceMonthly ?? 0;
      const totalInstallments = monthlyRate * 24;
      deviceCap = Math.max(0, devicePrice - totalInstallments);
    }
  }
  
  const maxForLine = Math.max(0, Math.min(deviceCap, walletAvailForLine + (line.walletUse ?? 0)));
  const safeWalletUse = Math.min(Math.max(0, line.walletUse ?? 0), maxForLine);

  // Calculate onetime cost
  let onetime = 0;
  if (device && device.id !== "no-dev") {
    if (line.devicePayment === "upfront") {
      onetime = Math.max(0, devicePrice - safeWalletUse);
    } else {
      // For installments: upfront = device price - total installments - wallet
      const monthlyRate = line.deviceMonthly ?? 0;
      const totalInstallments = monthlyRate * 24;
      onetime = Math.max(0, devicePrice - totalInstallments - safeWalletUse);
    }
  }

  const setWalletUseClamped = (val: number) => {
    const v = Number.isFinite(val) ? val : 0;
    const clamped = Math.min(Math.max(0, v), maxForLine);
    onChange({ walletUse: clamped });
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-xl grid place-items-center text-xs font-semibold bg-foreground text-background">
            {index + 1}
          </div>
          <div className="text-sm text-muted-foreground">Linija #{index + 1}</div>
        </div>
        <button onClick={onRemove} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
          Ukloni
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Tariff */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Tarifa</label>
          <button
            onClick={onOpenTariffModal}
            className="rounded-xl border border-border p-2 text-left text-sm hover:bg-muted transition-colors"
          >
            {tariff
              ? `${tariff.name} (€${tariff.monthly}/mj, +€${tariff.walletCredit} Wallet)`
              : "Odaberi tarifu"}
          </button>
        </div>

        {/* Device */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Uređaj</label>
          <button
            onClick={onOpenDeviceModal}
            className="rounded-xl border border-border p-2 text-left text-sm hover:bg-muted transition-colors"
          >
            {device ? `${device.name}` : "Odaberi uređaj"}
          </button>
        </div>

        {/* Addons */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Dodatne opcije</label>
          <button
            onClick={onOpenAddonsModal}
            className="rounded-xl border border-border p-2 text-left text-sm hover:bg-muted transition-colors"
          >
            {line.addonIds.length ? `${line.addonIds.length} odabrano` : "Odaberi opcije"}
          </button>
        </div>

        {/* Line type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Vrsta linije</label>
          <select
            className={`rounded-xl border p-2 text-sm bg-card hover:bg-muted transition-colors ${
              !line.lineType ? "border-red-500" : "border-border"
            }`}
            value={line.lineType ?? ""}
            onChange={(e) => onChange({ lineType: e.target.value || null })}
          >
            <option value="">— Odaberi vrstu —</option>
            {lineTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wallet apply */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Primijeni iz Walleta</label>
          <div className="rounded-xl border border-border p-2 bg-card">
            <input
              type="number"
              min={0}
              step={1}
              value={Math.round(safeWalletUse)}
              onChange={(e) => setWalletUseClamped(Math.round(parseFloat(e.target.value) || 0))}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === ',') {
                  e.preventDefault();
                }
              }}
              className="w-full outline-none bg-transparent"
            />
            <div className="mt-1 text-[11px] text-muted-foreground">
              Max za ovu liniju: €{maxForLine.toFixed(0)}{" "}
              {device
                ? line.devicePayment === "upfront"
                  ? "(umanjuje jednokratno)"
                  : "(umanjuje mjesečno)"
                : "(odaberi uređaj)"}
            </div>
          </div>
        </div>

        {/* Price preview */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Trošak</label>
          <div className="rounded-xl border border-border p-2 text-sm flex justify-between bg-accent/30">
            <span>Mjes.</span>
            <span className="font-semibold">€{monthly.toFixed(2)}</span>
          </div>
          {onetime > 0 && (
            <div className="mt-2 rounded-xl border border-border p-2 text-xs flex justify-between bg-card">
              <span>Jednokratno</span>
              <span>€{onetime.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
