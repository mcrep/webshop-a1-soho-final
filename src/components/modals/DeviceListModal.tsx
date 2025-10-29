import { useState } from "react";
import { devices } from "@/data/catalog";
import { X } from "lucide-react";

type DeviceListModalProps = {
  onClose: () => void;
  onSelectDevice: (deviceId: string) => void;
};

export function DeviceListModal({ onClose, onSelectDevice }: DeviceListModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");

  // Get unique brands
  const brands = Array.from(new Set(devices.map((d) => d.brand))).filter(
    (b) => b !== "—"
  );

  // Filter and sort devices
  let filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === "all" || d.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  if (priceSort !== "none") {
    filteredDevices = [...filteredDevices].sort((a, b) => {
      const priceA = a.upfront;
      const priceB = b.upfront;
      return priceSort === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-5xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="font-semibold text-lg">Svi uređaji</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Odaberi uređaj za detaljnu konfiguraciju
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left sidebar - Filters */}
            <div className="w-64 border-r border-border p-4 space-y-4 overflow-auto">
              <div>
                <h3 className="text-sm font-semibold mb-3">Pretraživanje</h3>
                <input
                  type="text"
                  placeholder="Traži uređaj..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-border p-3 bg-background text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Proizvođač</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={brandFilter === "all"}
                      onChange={() => setBrandFilter("all")}
                      className="accent-primary"
                    />
                    <span className="text-sm">Svi</span>
                  </label>
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={brandFilter === brand}
                        onChange={() => setBrandFilter(brand)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Sortiraj po cijeni</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceSort === "none"}
                      onChange={() => setPriceSort("none")}
                      className="accent-primary"
                    />
                    <span className="text-sm">Bez sortiranja</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceSort === "asc"}
                      onChange={() => setPriceSort("asc")}
                      className="accent-primary"
                    />
                    <span className="text-sm">Najjeftiniji prvo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceSort === "desc"}
                      onChange={() => setPriceSort("desc")}
                      className="accent-primary"
                    />
                    <span className="text-sm">Najskuplji prvo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right content - Device grid */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDevices.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onSelectDevice(d.id)}
                    className="rounded-2xl border border-border p-4 text-left hover:bg-muted hover:border-primary/50 transition-all group"
                  >
                    <div className="text-4xl mb-3">{d.emoji}</div>
                    <div className="text-xs text-muted-foreground">{d.brand}</div>
                    <div className="font-semibold mt-1">{d.name}</div>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <div>Jednokratno: €{d.upfront}</div>
                      <div>Rate: €{d.installment}/mj</div>
                    </div>
                    <div className="mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Klikni za konfiguraciju →
                    </div>
                  </button>
                ))}
              </div>
              {filteredDevices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nema uređaja koji odgovaraju filterima</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
