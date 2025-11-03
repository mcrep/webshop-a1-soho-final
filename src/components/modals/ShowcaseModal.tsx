import { devices, tariffs } from "@/data/catalog";

type ShowcaseModalProps = {
  mode: "devices" | "tariffs";
  onClose: () => void;
  onPickDevice: (deviceId: string) => void;
  onPickTariff: (tariffId: string) => void;
};

export function ShowcaseModal({
  mode,
  onClose,
  onPickDevice,
  onPickTariff,
}: ShowcaseModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="font-semibold text-lg">
              {mode === "devices" ? "Odaberi uređaj" : "Odaberi tarifu"}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[70vh] overflow-auto">
            {mode === "devices"
              ? devices
                  .filter((d) => d.id !== "no-dev")
                  .map((d) => (
                    <div key={d.id} className="rounded-2xl border border-border p-3 bg-card hover:shadow-md transition-shadow">
                      {d.image ? (
                        <img src={d.image} alt={d.name} className="w-16 h-16 object-contain" />
                      ) : (
                        <div className="text-4xl">{d.emoji}</div>
                      )}
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
                  ))
              : tariffs.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border p-3 bg-card hover:shadow-md transition-shadow">
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
      </div>
    </div>
  );
}
