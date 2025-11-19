import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Device, DeviceVariant } from "@/types";

type DeviceDetailModalProps = {
  device: Device;
  onClose: () => void;
  onSelectDevice: (deviceId: string, variantId: string) => void;
};

export function DeviceDetailModal({ device, onClose, onSelectDevice }: DeviceDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<DeviceVariant | null>(
    device.variants?.[0] || null
  );
  const [screenInsurance, setScreenInsurance] = useState(false);

  const images = device.images || [device.image || ""];
  const availableColors = Array.from(new Set(device.variants?.map(v => v.color) || []));
  const availableMemories = Array.from(new Set(device.variants?.map(v => v.memory) || []));

  // Filter variants by selected color and memory
  const selectedColor = selectedVariant?.color || availableColors[0];
  const selectedMemory = selectedVariant?.memory || availableMemories[0];

  const handleColorChange = (color: string) => {
    const newVariant = device.variants?.find(
      v => v.color === color && v.memory === selectedMemory
    );
    if (newVariant) setSelectedVariant(newVariant);
  };

  const handleMemoryChange = (memory: string) => {
    const newVariant = device.variants?.find(
      v => v.color === selectedColor && v.memory === memory
    );
    if (newVariant) setSelectedVariant(newVariant);
  };

  const handleSelect = () => {
    if (selectedVariant) {
      onSelectDevice(device.id, selectedVariant.id);
      onClose();
    }
  };

  const upfront = selectedVariant?.upfront || device.upfront;
  const maxInstallment = selectedVariant?.installment || device.installment;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-6xl rounded-2xl bg-card shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="font-bold text-2xl flex items-center gap-3">
                {device.brand} {device.name}
                {device.energyClass && (
                  <Badge variant="outline" className="text-sm font-normal">
                    Energetski razred: {device.energyClass}
                  </Badge>
                )}
              </h2>
              {device.description && (
                <p className="text-sm text-muted-foreground mt-2">{device.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Left Column - Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border">
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${device.name} ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedImageIndex
                            ? "border-primary scale-105"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-6">
                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Boja: {selectedColor}</Label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => {
                        const variant = device.variants?.find(v => v.color === color);
                        return (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedColor === color
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                              style={{ backgroundColor: variant?.colorHex }}
                            />
                            <span className="text-sm font-medium">{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Memory Selection */}
                {availableMemories.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Memorija</Label>
                    <div className="flex flex-wrap gap-3">
                      {availableMemories.map((memory) => (
                        <button
                          key={memory}
                          onClick={() => handleMemoryChange(memory)}
                          className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
                            selectedMemory === memory
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {memory}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jednokratno:</span>
                    <span className="text-2xl font-bold">€{upfront}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rate:</span>
                    <span className="text-xl font-semibold">
                      do €{maxInstallment}/mj <span className="text-sm text-muted-foreground">(24 mj)</span>
                    </span>
                  </div>
                </div>

                {/* Screen Insurance */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <Label htmlFor="insurance" className="font-semibold">Osiguranje ekrana</Label>
                    <p className="text-sm text-muted-foreground">+€4.99/mj</p>
                  </div>
                  <Switch
                    id="insurance"
                    checked={screenInsurance}
                    onCheckedChange={setScreenInsurance}
                  />
                </div>

                {/* Technical Specs */}
                {device.specs && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Tehničke karakteristike</Label>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Zaslon</div>
                          <div className="text-sm font-medium">{device.specs.display}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Procesor</div>
                          <div className="text-sm font-medium">{device.specs.processor}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Kamera</div>
                          <div className="text-sm font-medium">{device.specs.camera}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Baterija</div>
                          <div className="text-sm font-medium">{device.specs.battery}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">Težina</div>
                          <div className="text-sm font-medium">{device.specs.weight}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Odustani
                  </Button>
                  <Button onClick={handleSelect} className="flex-1" disabled={!selectedVariant}>
                    Odaberi uređaj
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
