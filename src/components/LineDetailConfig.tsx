import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { tariffs, devices, addons } from "@/data/catalog";
import type { Line } from "@/types";

type LineDetailConfigProps = {
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onOpenDeviceModal: () => void;
  onOpenDeviceListModal: () => void;
  onOpenAddonsModal: () => void;
  onComplete?: () => void;
  showCompleteButton?: boolean;
};

export function LineDetailConfig({
  line,
  onChange,
  onOpenDeviceModal,
  onOpenDeviceListModal,
  onOpenAddonsModal,
  onComplete,
  showCompleteButton = false,
}: LineDetailConfigProps) {
  const tariff = tariffs.find((t) => t.id === line.tariffId);
  const device = devices.find((d) => d.id === line.deviceId);

  // Tariff scroll state
  const tariffScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeftTariff, setCanScrollLeftTariff] = useState(false);
  const [canScrollRightTariff, setCanScrollRightTariff] = useState(false);

  const checkTariffScroll = () => {
    if (tariffScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tariffScrollRef.current;
      setCanScrollLeftTariff(scrollLeft > 0);
      setCanScrollRightTariff(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollTariff = (direction: "left" | "right") => {
    if (tariffScrollRef.current) {
      const scrollAmount = 300;
      tariffScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const ref = tariffScrollRef.current;
    if (ref) {
      checkTariffScroll();
      ref.addEventListener("scroll", checkTariffScroll);
      window.addEventListener("resize", checkTariffScroll);
      return () => {
        ref.removeEventListener("scroll", checkTariffScroll);
        window.removeEventListener("resize", checkTariffScroll);
      };
    }
  }, []);

  // Top devices including "No device" option
  const topDevices = devices.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Tariff and addons selection */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Tarifa i dodatne opcije</h3>
        <div className="relative group">
          {canScrollLeftTariff && (
            <button
              onClick={() => scrollTariff("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-primary/90"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {canScrollRightTariff && (
            <button
              onClick={() => scrollTariff("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-primary/90"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div
            ref={tariffScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide p-1"
          >
            {tariffs.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange({ tariffId: t.id })}
                className={`relative flex-shrink-0 w-[280px] min-h-[200px] rounded-2xl border p-6 text-left transition-all ${
                  line.tariffId === t.id
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  +{t.walletCredit}€ popusta na uređaj
                </div>
                <div className="font-semibold text-lg">{t.name}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  €{t.monthly}/mjesečno
                </div>
                <div className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {t.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Addons button (shown when tariff is selected) */}
        {line.tariffId && (
          <div className="mt-4">
            <button
              onClick={onOpenAddonsModal}
              className="w-full rounded-xl border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Dodatne opcije
            </button>
          </div>
        )}

        {/* Selected addons as cards */}
        {line.addonIds.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {line.addonIds.map((addonId) => {
              const addon = addons.find((a) => a.id === addonId);
              if (!addon) return null;
              return (
                <div
                  key={addonId}
                  className="flex items-center gap-2 rounded-lg border border-primary/30 bg-accent/30 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{addon.name}</span>
                  <span className="text-xs text-muted-foreground">
                    €{addon.monthly.toFixed(2)}/mj
                  </span>
                  <button
                    onClick={() => {
                      const newIds = line.addonIds.filter((id) => id !== addonId);
                      onChange({ addonIds: newIds });
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Ukloni addon"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Device selection */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Uređaj</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          {topDevices.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onChange({ deviceId: d.id });
                if (d.id !== "no-dev") {
                  onOpenDeviceModal();
                }
              }}
              className={`rounded-2xl border p-4 text-left transition-all ${
                line.deviceId === d.id
                  ? "ring-2 ring-primary border-primary bg-accent/50"
                  : "border-border hover:bg-muted"
              }`}
            >
              {d.image ? (
                <img src={d.image} alt={d.name} className="w-24 h-24 object-contain mb-2" />
              ) : (
                <div className="text-4xl mb-2">{d.emoji}</div>
              )}
              <div className="font-semibold text-sm">{d.name}</div>
              {d.id !== "no-dev" && (
                <div className="text-xs text-muted-foreground mt-1">
                  €{d.upfront} / €{d.installment}/mj
                </div>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenDeviceListModal}
          className="w-full mt-3 rounded-xl border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          Prikaži više uređaja
        </button>
      </section>


      {/* Complete button */}
      {showCompleteButton && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            disabled={!line.tariffId || !line.deviceId}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Gotovo
          </button>
        </div>
      )}
    </div>
  );
}
