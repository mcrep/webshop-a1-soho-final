import { CheckCircle2 } from "lucide-react";
import type { OrderDraft } from "@/stores/useOrderDraft";

const TARIFF_NAMES: Record<string, string> = {
  "entry-biz": "Entry Biz",
  "easy-biz": "Easy Biz",
  "connect-biz": "Connect Biz",
  "perfect-biz": "Perfect Biz",
  "ideal-biz": "Ideal Biz",
  "master-biz": "Master Biz",
};

const DEVICE_NAMES: Record<string, string> = {
  "iph-15": "iPhone 15",
  "sgs-24": "Galaxy S24",
  "pix-8": "Pixel 8",
  "no-dev": "Bez uređaja",
};

export function LiveOrderPanel({ draft }: { draft: OrderDraft }) {
  const items: Array<{ label: string; value: string }> = [];
  if (draft.customerType)
    items.push({ label: "Korisnik", value: draft.customerType === "new" ? "Novi" : "Postojeći" });
  if (draft.companyName) items.push({ label: "Tvrtka", value: draft.companyName });
  if (draft.oib) items.push({ label: "OIB", value: draft.oib });
  if (draft.numberOfLines !== undefined)
    items.push({ label: "Linije", value: String(draft.numberOfLines) });
  if (draft.numberOfDevices !== undefined)
    items.push({ label: "Uređaji", value: String(draft.numberOfDevices) });
  if (draft.selectedTariffId)
    items.push({ label: "Tarifa", value: TARIFF_NAMES[draft.selectedTariffId] || draft.selectedTariffId });
  if (draft.selectedDeviceId)
    items.push({ label: "Uređaj", value: DEVICE_NAMES[draft.selectedDeviceId] || draft.selectedDeviceId });
  if (draft.devicePayment)
    items.push({ label: "Plaćanje uređaja", value: draft.devicePayment === "installments" ? "Rate" : "Odjednom" });
  if (draft.deliveryMethod)
    items.push({ label: "Dostava", value: draft.deliveryMethod === "a1-center" ? "A1 centar" : "Pošta" });
  if (draft.paymentMethod)
    items.push({ label: "Račun", value: draft.paymentMethod === "invoice" ? "Uplatnica" : "Kartica" });
  if (draft.contactName) items.push({ label: "Kontakt", value: draft.contactName });

  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        <div className="text-xs font-semibold text-foreground">Live narudžba</div>
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground italic">
          Razgovaraj sa Snježanom — ovdje će se prikazati podaci...
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((it) => (
            <div key={it.label} className="flex justify-between text-xs gap-2">
              <span className="text-muted-foreground">{it.label}</span>
              <span className="font-medium text-foreground text-right truncate max-w-[60%]">{it.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
