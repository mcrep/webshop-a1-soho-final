import type { Tariff, Device, Addon, LineTypeOpt } from "@/types";
import iphone15 from "@/assets/devices/iphone-15.png";
import galaxyS24 from "@/assets/devices/galaxy-s24.png";
import pixel8 from "@/assets/devices/pixel-8.png";

export const tariffs: Tariff[] = [
  {
    id: "connect-biz",
    name: "Connect Biz",
    monthly: 26.31,
    data: "20 GB",
    voice: "Neograničene min i SMS",
    roaming: "EU",
    desc: "20GB internet prometa • Neograničene min i SMS",
    walletCredit: 50,
  },
  {
    id: "perfect-biz",
    name: "Perfect Biz",
    monthly: 32.93,
    data: "Neograničeno",
    voice: "Neograničeni pozivi i SMS",
    roaming: "EU",
    desc: "Neograničeni internet • Neograničeni pozivi i SMS • A1 Net Protect",
    walletCredit: 80,
  },
  {
    id: "ideal-biz",
    name: "Ideal Biz",
    monthly: 51.64,
    data: "Neograničeno",
    voice: "Neograničene min i SMS",
    roaming: "EU + Regija (3GB)",
    desc: "Neograničeni internet • Neograničene min i SMS • 3 GB u roamingu u zemljama regije • MultiSIM za samo 3,61 €/mj. • A1 Net Protect",
    walletCredit: 120,
  },
  {
    id: "master-biz",
    name: "Master Biz",
    monthly: 71.46,
    data: "Neograničeno",
    voice: "Neograničeni pozivi i SMS",
    roaming: "EU + Regija (3GB) + Svijet (250MB)",
    desc: "Neograničeni internet • Neograničeni pozivi i SMS • 3 GB u roamingu u zemljama regije i 250MB roaminga u svijetu • MultiSIM • A1 Net Protect",
    walletCredit: 150,
  },
];

export const devices: Device[] = [
  {
    id: "iph-15",
    brand: "Apple",
    name: "iPhone 15",
    upfront: 799,
    installment: 33,
    emoji: "📱",
    image: iphone15,
  },
  {
    id: "sgs-24",
    brand: "Samsung",
    name: "Galaxy S24",
    upfront: 699,
    installment: 29,
    emoji: "📱",
    image: galaxyS24,
  },
  {
    id: "pix-8",
    brand: "Google",
    name: "Pixel 8",
    upfront: 649,
    installment: 27,
    emoji: "📱",
    image: pixel8,
  },
  {
    id: "no-dev",
    brand: "—",
    name: "Bez uređaja",
    upfront: 0,
    installment: 0,
    emoji: "➖",
  },
];

export const addons: Addon[] = [
  { id: "xgb-10", name: "+10 GB", monthly: 3 },
  { id: "int-100", name: "100 min Intl", monthly: 5 },
  { id: "mdm", name: "Mobile Security", monthly: 2.5 },
  { id: "roam-eu", name: "Roam EU+", monthly: 4 },
];

export const lineTypes: LineTypeOpt[] = [
  { id: "new", name: "Nova linija" },
  { id: "pre2post", name: "Prelazak s bonova na pretplatu" },
  { id: "mnp", name: "Prijenos broja s druge mreže" },
  { id: "renew", name: "Produljenje postojeće linije" },
];
