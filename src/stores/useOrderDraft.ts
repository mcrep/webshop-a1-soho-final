import { create } from "zustand";

export type OrderDraft = {
  customerType?: "new" | "existing";
  oib?: string;
  companyName?: string;
  numberOfLines?: number;
  numberOfDevices?: number;
  selectedTariffId?: string;
  selectedDeviceId?: string;
  devicePayment?: "installments" | "upfront";
  deliveryMethod?: "a1-center" | "postal";
  paymentMethod?: "invoice" | "card";
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
};

type OrderDraftStore = {
  draft: OrderDraft;
  patch: (p: Partial<OrderDraft>) => void;
  reset: () => void;
};

export const useOrderDraft = create<OrderDraftStore>((set) => ({
  draft: {},
  patch: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  reset: () => set({ draft: {} }),
}));
