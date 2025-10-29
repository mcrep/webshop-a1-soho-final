import { Info } from "lucide-react";
import { tariffs, devices, addons, lineTypes } from "@/data/catalog";
import type { Line } from "@/types";

type LineDetailConfigProps = {
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onOpenTariffModal: () => void;
  onOpenDeviceModal: () => void;
  onOpenAddonsModal: () => void;
  walletAvailForLine: number;
  walletTotal: number;
};

export function LineDetailConfig({
  line,
  onChange,
  onOpenTariffModal,
  onOpenDeviceModal,
  onOpenAddonsModal,
  walletAvailForLine,
  walletTotal,
}: LineDetailConfigProps) {
  const tariff = tariffs.find((t) => t.id === line.tariffId);
  const device = devices.find((d) => d.id === line.deviceId);

  const deviceCap =
    line.devicePayment === "upfront"
      ? device?.upfront ?? 0
      : (line.deviceMonthly ?? device?.installment) ?? 0;
  const maxForLine = Math.max(
    0,
    Math.min(deviceCap, walletAvailForLine + (line.walletUse ?? 0))
  );
  const safeWalletUse = Math.min(Math.max(0, line.walletUse ?? 0), maxForLine);

  const monthly = Math.max(
    0,
    (tariff?.monthly ?? 0) +
      (line.devicePayment === "installments"
        ? (line.deviceMonthly ?? device?.installment) ?? 0
        : 0) +
      line.addonIds.reduce((s, id) => s + (addons.find((a) => a.id === id)?.monthly ?? 0), 0) -
      (line.devicePayment === "installments" ? safeWalletUse : 0)
  );

  const onetime = Math.max(
    0,
    (line.devicePayment === "upfront" ? device?.upfront ?? 0 : 0) -
      (line.devicePayment === "upfront" ? safeWalletUse : 0)
  );

  const setWalletUseClamped = (val: number) => {
    const v = Number.isFinite(val) ? val : 0;
    const clamped = Math.min(Math.max(0, v), maxForLine);
    onChange({ walletUse: clamped });
  };

  return (
    <div className="space-y-6">
      {/* Wallet info banner */}
      <div className="rounded-2xl border border-primary/20 bg-accent px-4 py-3">
        <div className="text-sm flex items-center gap-2 relative group">
          <Info size={16} className="text-accent-foreground cursor-pointer" />
          <span className="font-semibold">A1 Wallet stanje:</span> €{walletTotal.toFixed(2)}
          <span className="text-accent-foreground/80 text-xs">
            (zbraja se po odabranoj tarifi, može se iskoristiti za uređaje)
          </span>
          <div className="absolute top-6 left-0 bg-popover text-popover-foreground text-xs border border-border rounded-lg shadow-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 z-10">
            Za cijelo stanje walleta molimo vas da se prijavite u sustav
          </div>
        </div>
      </div>

      {/* Configuration sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tariff selection */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Tarifa</h3>
          <button
            onClick={onOpenTariffModal}
            className="w-full rounded-xl border border-border p-4 text-left hover:bg-muted transition-colors"
          >
            {tariff ? (
              <div>
                <div className="font-semibold">{tariff.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  €{tariff.monthly}/mjesečno • +€{tariff.walletCredit} Wallet
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tariff.data} • {tariff.voice}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Klikni za odabir tarife</div>
            )}
          </button>
        </section>

        {/* Device selection */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Uređaj</h3>
          <button
            onClick={onOpenDeviceModal}
            className="w-full rounded-xl border border-border p-4 text-left hover:bg-muted transition-colors"
          >
            {device ? (
              <div>
                <div className="font-semibold">
                  {device.emoji} {device.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {line.devicePayment === "upfront"
                    ? `Jednokratno: €${device.upfront}`
                    : `Rate: €${line.deviceMonthly ?? device.installment}/mj`}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Klikni za odabir uređaja</div>
            )}
          </button>
        </section>
      </div>

      {/* Addons and line type */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Addons */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Dodatne opcije</h3>
          <button
            onClick={onOpenAddonsModal}
            className="w-full rounded-xl border border-border p-4 text-left hover:bg-muted transition-colors"
          >
            {line.addonIds.length ? (
              <div>
                <div className="font-semibold">{line.addonIds.length} opcija odabrano</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {line.addonIds
                    .map((id) => addons.find((a) => a.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Klikni za odabir opcija</div>
            )}
          </button>
        </section>

        {/* Line type */}
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Vrsta linije</h3>
          <select
            className="w-full rounded-xl border border-border p-4 bg-card hover:bg-muted transition-colors"
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
        </section>
      </div>

      {/* Wallet application */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Primjena A1 Walleta</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Iznos za primjenu (€)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={safeWalletUse}
              onChange={(e) => setWalletUseClamped(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-border p-3 bg-background outline-none focus:border-primary transition-colors"
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Maksimalno za ovu liniju: €{maxForLine.toFixed(0)}{" "}
              {device
                ? line.devicePayment === "upfront"
                  ? "(umanjuje jednokratno)"
                  : "(umanjuje mjesečno)"
                : "(najprije odaberi uređaj)"}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted-foreground mb-2">Pregled troška za ovu liniju:</div>
            <div className="rounded-xl border border-primary/30 bg-accent/30 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mjesečno</span>
                <span className="text-lg font-bold">€{monthly.toFixed(2)}</span>
              </div>
              {onetime > 0 && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                  <span className="text-sm">Jednokratno</span>
                  <span className="text-lg font-bold">€{onetime.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
