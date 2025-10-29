export type Line = {
  id: string;
  tariffId: string | null;
  deviceId: string | null;
  devicePayment: "installments" | "upfront";
  deviceMonthly?: number | null;
  addonIds: string[];
  lineType: string | null;
  walletUse?: number;
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
