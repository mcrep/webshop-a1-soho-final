import { tariffs, devices } from "@/data/catalog";

type StartPickerProps = {
  startMode: "device" | "tariff";
  setStartMode: (mode: "device" | "tariff") => void;
  onShowMore: (mode: "devices" | "tariffs") => void;
  onPickDevice: (deviceId: string) => void;
  onPickTariff: (tariffId: string) => void;
};

export function StartPicker({
  startMode,
  setStartMode,
  onShowMore,
  onPickDevice,
  onPickTariff,
}: StartPickerProps) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm font-semibold">Kako želiš započeti konfiguraciju?</div>
        <div className="rounded-2xl bg-muted p-1 inline-flex">
          <button
            onClick={() => setStartMode("tariff")}
            className={`px-3 py-1.5 text-sm rounded-xl transition-all ${
              startMode === "tariff" ? "bg-card shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            Kreni s tarifom
          </button>
          <button
            onClick={() => setStartMode("device")}
            className={`px-3 py-1.5 text-sm rounded-xl transition-all ${
              startMode === "device" ? "bg-card shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            Kreni s uređajem
          </button>
        </div>
      </div>

      {/* Horizontal showcase */}
      {startMode === "device" ? (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Istaknuti uređaji</div>
            <button
              className="text-sm text-primary hover:underline"
              onClick={() => onShowMore("devices")}
            >
              Prikaži više
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {devices
              .filter((d) => d.id !== "no-dev")
              .map((d) => (
                <div
                  key={d.id}
                  className="min-w-[220px] rounded-2xl border border-border p-3 shrink-0 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl">{d.emoji}</div>
                  <div className="text-xs text-muted-foreground">{d.brand}</div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Jednokratno €{d.upfront} • Rate €{d.installment}/mj
                  </div>
                  <button
                    className="mt-3 w-full rounded-xl bg-primary text-primary-foreground text-sm py-2 hover:bg-primary/90 transition-colors"
                    onClick={() => onPickDevice(d.id)}
                  >
                    Odaberi
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Istaknute tarife</div>
            <button
              className="text-sm text-primary hover:underline"
              onClick={() => onShowMore("tariffs")}
            >
              Prikaži više
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tariffs.map((t) => (
              <div
                key={t.id}
                className="min-w-[220px] rounded-2xl border border-border p-3 shrink-0 bg-card hover:shadow-md transition-shadow"
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t.data} • {t.voice}
                </div>
                <div className="text-xs text-muted-foreground/70">Roaming: {t.roaming}</div>
                <div className="mt-2 text-sm font-semibold">
                  €{t.monthly}/mj • +€{t.walletCredit} Wallet
                </div>
                <button
                  className="mt-3 w-full rounded-xl bg-primary text-primary-foreground text-sm py-2 hover:bg-primary/90 transition-colors"
                  onClick={() => onPickTariff(t.id)}
                >
                  Odaberi
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
