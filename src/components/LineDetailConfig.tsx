import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tariffs, devices, addons, lineTypes } from "@/data/catalog";
import type { Line } from "@/types";

type LineDetailConfigProps = {
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onOpenDeviceModal: () => void;
  onOpenDeviceListModal: () => void;
};

export function LineDetailConfig({
  line,
  onChange,
  onOpenDeviceModal,
  onOpenDeviceListModal,
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

  // Top 3 devices
  const topDevices = devices.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Tariff selection */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Tarifa</h3>
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
            className="flex gap-3 overflow-x-auto scrollbar-hide"
          >
            {tariffs.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange({ tariffId: t.id })}
                className={`flex-shrink-0 w-[280px] rounded-2xl border p-4 text-left transition-all ${
                  line.tariffId === t.id
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  €{t.monthly}/mjesečno • +€{t.walletCredit} Wallet
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.data} • {t.voice}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Device selection */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Uređaj</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {topDevices.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onChange({ deviceId: d.id });
                onOpenDeviceModal();
              }}
              className={`rounded-xl border p-4 text-left transition-all ${
                line.deviceId === d.id
                  ? "ring-2 ring-primary border-primary bg-accent/50"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="text-2xl mb-2">{d.emoji}</div>
              <div className="font-semibold text-sm">{d.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                €{d.upfront} / €{d.installment}/mj
              </div>
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

      {/* Addons selection */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Dodatne opcije</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {addons.map((a) => {
            const isSelected = line.addonIds.includes(a.id);
            return (
              <label
                key={a.id}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-accent/50"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground">
                      €{a.monthly.toFixed(2)}/mj
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...line.addonIds, a.id]
                        : line.addonIds.filter((id) => id !== a.id);
                      onChange({ addonIds: newIds });
                    }}
                    className="h-5 w-5"
                  />
                </div>
              </label>
            );
          })}
        </div>
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
  );
}
