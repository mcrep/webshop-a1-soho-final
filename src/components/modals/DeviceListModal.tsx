import { useState } from "react";
import { devices } from "@/data/catalog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeviceDetailModal } from "./DeviceDetailModal";
import type { Device } from "@/types";

type DeviceListModalProps = {
  onClose: () => void;
  onSelectDevice: (
    deviceId: string, 
    variantId: string,
    paymentMethod: "upfront" | "installments",
    monthlyInstallment: number,
    screenInsurance: boolean
  ) => void;
};

export function DeviceListModal({ onClose, onSelectDevice }: DeviceListModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Get unique brands
  const brands = Array.from(new Set(devices.map((d) => d.brand))).filter(
    (b) => b !== "—"
  );

  // Filter and sort devices
  let filteredDevices = devices.filter((d) => {
    if (d.id === "no-dev") return false; // Don't show "Bez uređaja" in this modal
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

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

  return (
    <>
      <div className="fixed inset-0 z-[100]">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="w-full max-w-7xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border bg-muted/30">
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

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Sidebar - Filters */}
              <div
                className={`border-r border-border bg-muted/10 transition-all duration-300 ${
                  sidebarOpen ? "w-64" : "w-0"
                } overflow-hidden`}
              >
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Filtri</h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Proizvođač</Label>
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

                  {/* Price Sort */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Cijena</Label>
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
                        <span className="text-sm">Od najniže</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={priceSort === "desc"}
                          onChange={() => setPriceSort("desc")}
                          className="accent-primary"
                        />
                        <span className="text-sm">Od najviše</span>
                      </label>
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setBrandFilter("all");
                      setPriceSort("none");
                      setSearchTerm("");
                    }}
                  >
                    Resetiraj filtere
                  </Button>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-border bg-background/50">
                  <div className="flex gap-2">
                    {!sidebarOpen && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    )}
                    <Input
                      type="text"
                      placeholder="Pretraži uređaje po nazivu ili proizvođaču..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Device Grid */}
                <div className="flex-1 overflow-auto p-6">
                  {filteredDevices.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Nema uređaja koji odgovaraju odabranim filterima.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDevices.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => handleDeviceClick(device)}
                          className="group p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary transition-all text-left"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted/30">
                            <img
                              src={device.image}
                              alt={device.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{device.brand}</div>
                            <div className="font-semibold">{device.name}</div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-primary">€{device.upfront}</span>
                              <span className="text-xs text-muted-foreground">
                                ili do €{device.installment}/mj
                              </span>
                            </div>
                            {device.energyClass && (
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                Energetski razred: {device.energyClass}
                                {device.availability && (
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      device.availability === "available" ? "bg-green-500" :
                                      device.availability === "on-request" ? "bg-orange-500" :
                                      "bg-red-500"
                                    }`} />
                                    <span className="text-xs">
                                      {device.availability === "available" ? "Dostupan" :
                                       device.availability === "on-request" ? "Na upit" :
                                       "Nedostupan"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onSelectDevice={onSelectDevice}
        />
      )}
    </>
  );
}
