import type { Tariff, Device, Addon, LineTypeOpt } from "@/types";
import iphone15 from "@/assets/devices/iphone-15.png";
import galaxyS24 from "@/assets/devices/galaxy-s24.png";
import pixel8 from "@/assets/devices/pixel-8.png";

export const tariffs: Tariff[] = [
  {
    id: "biz-s",
    name: "Biz S",
    monthly: 9.9,
    data: "10 GB",
    voice: "Neogr. pozivi/SMS u HR",
    roaming: "EU",
    desc: "Najbolja opcija za male korisnike koji žele osnovnu mobilnu tarifu.",
    walletCredit: 30,
  },
  {
    id: "biz-m",
    name: "Biz M",
    monthly: 14.9,
    data: "50 GB",
    voice: "Neogr. pozivi/SMS u HR",
    roaming: "EU + Regija",
    desc: "Idealna za korisnike koji žele više gigabajta i širi roaming.",
    walletCredit: 60,
  },
  {
    id: "biz-l",
    name: "Biz L Global",
    monthly: 24.9,
    data: "Neograničeno",
    voice: "Neogr. pozivi/SMS u HR",
    roaming: "EU + Global",
    desc: "Premium tarifa s globalnim roamingom i neograničenim podatkovnim prometom.",
    walletCredit: 120,
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
