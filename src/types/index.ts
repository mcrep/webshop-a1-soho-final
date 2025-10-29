export type Line = {
  id: string;
  tariffId: string | null;
  deviceId: string | null;
  devicePayment: "installments" | "upfront";
  deviceMonthly?: number | null;
  addonIds: string[];
  lineType: string | null;
  walletUse?: number;
  screenInsurance?: boolean;
  // Number porting data (mnp)
  portingNumber?: string;
  portingNumberType?: "prepaid" | "postpaid";
  portingCustomerType?: "business" | "private";
  portingCustomerName?: string;
  portingOib?: string;
  portingAddress?: string;
  portingContactNumber?: string;
  portingStartDate?: Date;
  portingFromNetwork?: "ht" | "telemach";
  portingTime?: "morning" | "afternoon";
  // Prepaid to postpaid data (pre2post)
  prepaidNumber?: string;
  // Existing line extension data (renew)
  existingLineId?: string;
};

export type Tariff = {
  id: string;
  name: string;
  monthly: number;
  data: string;
  voice: string;
  roaming: string;
  desc: string;
  walletCredit: number;
};

export type Device = {
  id: string;
  brand: string;
  name: string;
  upfront: number;
  installment: number;
  emoji: string;
};

export type Addon = {
  id: string;
  name: string;
  monthly: number;
};

export type LineTypeOpt = {
  id: string;
  name: string;
};
