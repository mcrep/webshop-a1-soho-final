import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Smartphone } from "lucide-react";
import { devices } from "@/data/catalog";

type DeviceSlot = {
  id: string;
  deviceId: string | null;
};

type Step4Props = {
  deviceSlots: DeviceSlot[];
  onOpenDeviceModal: (slotId: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step4DeviceSelection({ deviceSlots, onOpenDeviceModal, onNext, onBack }: Step4Props) {
  const allDevicesSelected = deviceSlots.every((slot) => slot.deviceId !== null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Odabir uređaja</h1>
        <p className="text-muted-foreground">Korak 4 od 5 - Odaberite {deviceSlots.length} uređaja</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deviceSlots.map((slot, index) => {
          const device = devices.find((d) => d.id === slot.deviceId);
          
          return (
            <button
              key={slot.id}
              onClick={() => onOpenDeviceModal(slot.id)}
              className="group rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50 p-8 shadow-sm hover:shadow-md transition-all aspect-[3/4] flex flex-col items-center justify-center text-center"
            >
              {device ? (
                <div className="flex flex-col items-center gap-4">
                  {device.image ? (
                    <img src={device.image} alt={device.name} className="w-32 h-32 object-contain" />
                  ) : (
                    <span className="text-6xl">{device.emoji}</span>
                  )}
                  <div>
                    <div className="font-bold text-lg mb-1">{device.name}</div>
                    <div className="text-sm text-muted-foreground">
                      MPC: €{device.upfront}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rata: €{device.installment}/mj
                    </div>
                  </div>
                  <div className="text-xs text-primary font-medium mt-2">
                    Klikni za promjenu
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Smartphone className="w-16 h-16 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-muted-foreground mb-1">Uređaj {index + 1}</div>
                    <div className="text-sm text-primary font-medium">
                      Klikni za konfiguraciju uređaja
                    </div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button onClick={onBack} variant="outline" size="lg">
          <ArrowLeft className="mr-2" size={18} />
          Natrag
        </Button>
        <Button onClick={onNext} disabled={!allDevicesSelected} size="lg">
          Nastavi na raspodjelu walleta
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
