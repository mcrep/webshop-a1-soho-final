import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { devices } from "@/data/catalog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Search, ChevronLeft, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import type { Device, DeviceVariant } from "@/types";
import a1Logo from "@/assets/a1-logo.png";

function DeviceDetailView({ device, onClose }: { device: Device; onClose: () => void }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<DeviceVariant | null>(
    device.variants?.[0] || null
  );

  const images = device.images || [device.image || ""];
  const availableColors = Array.from(new Set(device.variants?.map(v => v.color) || []));
  const availableMemories = Array.from(new Set(device.variants?.map(v => v.memory) || []));

  const selectedColor = selectedVariant?.color || availableColors[0];
  const selectedMemory = selectedVariant?.memory || availableMemories[0];

  const handleColorChange = (color: string) => {
    const newVariant = device.variants?.find(v => v.color === color && v.memory === selectedMemory);
    if (newVariant) setSelectedVariant(newVariant);
  };

  const handleMemoryChange = (memory: string) => {
    const newVariant = device.variants?.find(v => v.color === selectedColor && v.memory === memory);
    if (newVariant) setSelectedVariant(newVariant);
  };

  const upfront = selectedVariant?.upfront || device.upfront;
  const discount = selectedVariant?.mpcOverride ?? device.mpcOverride ?? 0;
  const finalUpfront = upfront - discount;
  const installment = selectedVariant?.installment || device.installment;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-5xl mx-4 rounded-2xl bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-3 flex-wrap">
                {device.brand} {device.name}
                {device.energyClass && (
                  <Badge variant="secondary" className="text-xs font-normal bg-white/20 text-primary-foreground border-0">
                    Energetski razred: {device.energyClass}
                  </Badge>
                )}
                {device.availability && (
                  <span className="flex items-center gap-1.5 text-sm font-normal">
                    <span className={`w-2 h-2 rounded-full ${
                      device.availability === "available" ? "bg-green-400" :
                      device.availability === "on-request" ? "bg-orange-400" : "bg-red-400"
                    }`} />
                    {device.availability === "available" ? "Dostupan" :
                     device.availability === "on-request" ? "Na upit" : "Nedostupan"}
                  </span>
                )}
              </h2>
              {device.description && <p className="text-sm opacity-90 mt-1">{device.description}</p>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border">
                <img src={images[selectedImageIndex]} alt={device.name} className="w-full h-full object-contain" />
                {discount > 0 && (
                  <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground font-bold text-base px-4 py-2 rounded-lg shadow-md">
                    -{discount} EUR
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImageIndex((p) => (p - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setSelectedImageIndex((p) => (p + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === selectedImageIndex ? "bg-muted border-transparent" : "border-border hover:border-foreground"}`}>
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Colors */}
              {availableColors.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Boja: {selectedColor}</Label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => {
                      const variant = device.variants?.find(v => v.color === color);
                      return (
                        <button key={color} onClick={() => handleColorChange(color)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === color ? "bg-muted border-transparent" : "border-border hover:border-foreground"}`}>
                          <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: variant?.colorHex }} />
                          <span className="text-sm font-medium">{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Memory */}
              {availableMemories.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Memorija</Label>
                  <div className="flex flex-wrap gap-3">
                    {availableMemories.map((memory) => (
                      <button key={memory} onClick={() => handleMemoryChange(memory)} className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${selectedMemory === memory ? "bg-muted border-transparent" : "border-border hover:border-foreground"}`}>
                        {memory}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cijena:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">€{finalUpfront}</span>
                    {discount > 0 && <span className="text-base text-muted-foreground line-through">€{upfront}</span>}
                  </div>
                </div>
                {installment > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ili na rate:</span>
                    <span className="text-lg font-semibold">do €{installment}/mj <span className="text-sm text-muted-foreground">(24 mj)</span></span>
                  </div>
                )}
              </div>

              {/* Specs */}
              {device.specs && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Tehničke karakteristike</Label>
                  <div className="divide-y divide-border">
                    {Object.entries(device.specs).map(([key, value]) => (
                      <div key={key} className="py-2 flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key === "display" ? "Zaslon" : key === "processor" ? "Procesor" : key === "camera" ? "Kamera" : key === "battery" ? "Baterija" : key === "weight" ? "Težina" : key}
                        </span>
                        <span className="text-sm font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* eSIM */}
              {device.esimSupport !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">eSIM podrška:</span>
                  <Badge variant={device.esimSupport ? "default" : "secondary"}>
                    {device.esimSupport ? "Da" : "Ne"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <Button variant="outline" onClick={onClose} className="w-full">
            Zatvori
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const catalogDevices = devices.filter(d => d.id !== "no-dev");
  const brands = Array.from(new Set(catalogDevices.map(d => d.brand)));

  let filtered = catalogDevices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === "all" || d.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  if (priceSort !== "none") {
    filtered = [...filtered].sort((a, b) => priceSort === "asc" ? a.upfront - b.upfront : b.upfront - a.upfront);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={a1Logo} alt="A1" className="h-8" />
            <h1 className="text-xl font-bold text-foreground hidden sm:block">Uređaji</h1>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži uređaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Proizvođač:</Label>
                  <div className="flex gap-1.5">
                    <button onClick={() => setBrandFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${brandFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>Svi</button>
                    {brands.map(b => (
                      <button key={b} onClick={() => setBrandFilter(b)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${brandFilter === b ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>{b}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Cijena:</Label>
                  <div className="flex gap-1.5">
                    {([["none", "Sve"], ["asc", "↑ Najniža"], ["desc", "↓ Najviša"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => setPriceSort(val)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${priceSort === val ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"}`}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Device grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nema uređaja koji odgovaraju pretrazi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((device) => {
              const discount = device.mpcOverride ?? 0;
              return (
                <motion.button
                  key={device.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedDevice(device)}
                  className="group p-5 rounded-2xl border-2 border-border bg-card hover:border-foreground transition-all text-left shadow-sm hover:shadow-md"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/20">
                    <img src={device.image} alt={device.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    {discount > 0 && (
                      <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground font-bold text-sm px-3 py-1.5 rounded-lg shadow-md">
                        -{discount} EUR
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs text-muted-foreground font-medium">{device.brand}</div>
                    <div className="font-bold text-lg">{device.name}</div>
                    <div className="flex items-baseline gap-2">
                      {discount > 0 ? (
                        <>
                          <span className="text-xl font-bold text-primary">€{device.upfront - discount}</span>
                          <span className="text-sm text-muted-foreground line-through">€{device.upfront}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-primary">€{device.upfront}</span>
                      )}
                    </div>
                    {device.installment > 0 && (
                      <div className="text-xs text-muted-foreground">ili do €{device.installment}/mj (24 mj)</div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      {device.energyClass && (
                        <Badge variant="secondary" className="text-xs">{device.energyClass}</Badge>
                      )}
                      {device.availability && (
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            device.availability === "available" ? "bg-green-500" :
                            device.availability === "on-request" ? "bg-orange-500" : "bg-red-500"
                          }`} />
                          <span className="text-xs text-muted-foreground">
                            {device.availability === "available" ? "Dostupan" :
                             device.availability === "on-request" ? "Na upit" : "Nedostupan"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedDevice && (
          <DeviceDetailView device={selectedDevice} onClose={() => setSelectedDevice(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
