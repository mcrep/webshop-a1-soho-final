import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { Device, DeviceVariant } from "@/types";

type DeviceDetailModalProps = {
  device: Device;
  onClose: () => void;
  onSelectDevice: (
    deviceId: string, 
    variantId: string, 
    paymentMethod: "upfront" | "installments",
    monthlyInstallment: number,
    screenInsurance: boolean
  ) => void;
};

export function DeviceDetailModal({ device, onClose, onSelectDevice }: DeviceDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<DeviceVariant | null>(
    device.variants?.[0] || null
  );
  const [paymentMethod, setPaymentMethod] = useState<"upfront" | "installments">("upfront");
  const [monthlyInstallment, setMonthlyInstallment] = useState(1);

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
      onSelectDevice(device.id, selectedVariant.id, paymentMethod, monthlyInstallment, false);
      onClose();
    }
  };

  const upfront = selectedVariant?.upfront || device.upfront;
  const maxInstallment = selectedVariant?.installment || device.installment;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-6xl rounded-2xl bg-card shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="font-bold text-2xl flex items-center gap-3">
                {device.brand} {device.name}
                {device.energyClass && (
                  <Badge variant="outline" className="text-sm font-normal flex items-center gap-2">
                    Energetski razred: {device.energyClass}
                    {device.availability && (
                      <>
                        <div className={`w-2 h-2 rounded-full ${
                          device.availability === "available" ? "bg-green-500" :
                          device.availability === "on-request" ? "bg-orange-500" :
                          "bg-red-500"
                        }`} />
                        <span>
                          {device.availability === "available" ? "Dostupan" :
                           device.availability === "on-request" ? "Na upit" :
                           "Nedostupan"}
                        </span>
                      </>
                    )}
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
            <div className="grid md:grid-cols-2 gap-8 p-6 pb-4">
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

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Način plaćanja:</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={paymentMethod === "upfront" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentMethod("upfront")}
                      className="flex-1"
                    >
                      Jednokratno
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "installments" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentMethod("installments")}
                      className="flex-1"
                    >
                      Rate
                    </Button>
                  </div>
                </div>

                {/* Installment Configuration */}
                {paymentMethod === "installments" && (
                  <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Iznos rate: €{monthlyInstallment}/mj
                      </Label>
                      <Slider
                        value={[monthlyInstallment]}
                        onValueChange={(value) => setMonthlyInstallment(value[0])}
                        min={1}
                        max={Math.min(30, maxInstallment)}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>€1</span>
                        <span>€{Math.min(30, maxInstallment)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Jednokratni iznos:</span>
                    <span className="text-2xl font-bold">
                      {paymentMethod === "upfront" 
                        ? `€${upfront}` 
                        : `€${Math.max(0, upfront - (monthlyInstallment * 24)).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Iznos rate:</span>
                    <span className="text-xl font-semibold">
                      {paymentMethod === "upfront"
                        ? "0€ mjesečno"
                        : `€${monthlyInstallment} mjesečno`}
                      {" "}
                      <span className="text-sm text-muted-foreground">(24 mj)</span>
                    </span>
                  </div>
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
              </div>
            </div>
          </div>

          {/* Sticky Footer with Action Buttons */}
          <div className="sticky bottom-0 bg-card border-t border-border p-6 shadow-lg">
            <div className="flex gap-3">
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
  );
}
