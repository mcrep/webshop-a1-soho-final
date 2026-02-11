export type DeviceVariant = {
  id: string;
  color: string;
  colorHex: string;
  memory: string;
  upfront: number;
  installment: number;
};

export type Line = {
  id: string;
  tariffId: string | null;
  deviceId: string | null;
  deviceVariantId?: string | null;
  devicePayment: "installments" | "upfront";
  deviceMonthly?: number | null;
  addonIds: string[];
  lineType: string | null;
  walletUse?: number;
  screenInsurance?: boolean;
  completed?: boolean;
  isExtension?: boolean;
  extensionLabel?: string;
  simType?: "esim" | "physical";
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
  originalMonthly?: number;
  data: string;
  voice: string;
  roaming: string;
  desc: string;
  walletCredit: number;
  noDeviceWalletBonus: number;
};

export type Device = {
  id: string;
  brand: string;
  name: string;
  upfront: number;
  installment: number;
  emoji: string;
  image?: string;
  images?: string[];
  description?: string;
  variants?: DeviceVariant[];
  specs?: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
    weight: string;
  };
  esimSupport?: boolean;
  energyClass?: string;
  availability?: "available" | "on-request" | "unavailable";
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

export type VerificationData = {
  companyOib: string;
  authorizedPerson: {
    firstName: string;
    lastName: string;
    oib: string;
    contactNumber: string;
    contactEmail: string;
  };
};

export type DeliveryData = {
  method: "a1-center" | "postal";
  a1CenterId?: string;
  postalAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  contactPerson?: string;
  contactPhone?: string;
};

export type PaymentData = {
  method: "invoice" | "card";
};

export type A1Center = {
  id: string;
  name: string;
  address: string;
  city: string;
};

export type ExtensionLineWithTariff = {
  lineId: string;
  msisdn: string;
  currentTariff: string;
  newTariffId: string | null;
};
