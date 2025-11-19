import type { Tariff, Device, Addon, LineTypeOpt } from "@/types";
import iphone15 from "@/assets/devices/iphone-15.png";
import galaxyS24 from "@/assets/devices/galaxy-s24.png";
import pixel8 from "@/assets/devices/pixel-8.png";

export const tariffs: Tariff[] = [
  {
    id: "entry-biz",
    name: "Entry Biz",
    monthly: 14.20,
    data: "1 GB",
    voice: "200 min i SMS",
    roaming: "HR",
    desc: "200 minuta i SMS poruka • 1 GB podatkovnog prometa",
    walletCredit: 10,
  },
  {
    id: "easy-biz",
    name: "Easy Biz",
    monthly: 17.51,
    data: "5 GB",
    voice: "Neograničene min i SMS",
    roaming: "HR",
    desc: "Neograničene minute i SMS poruke • 5 GB podatkovnog prometa",
    walletCredit: 35,
  },
  {
    id: "connect-biz",
    name: "Connect Biz",
    monthly: 26.31,
    data: "20 GB",
    voice: "Neograničene min i SMS",
    roaming: "EU",
    desc: "20GB internet prometa • Neograničene min i SMS",
    walletCredit: 75,
  },
  {
    id: "perfect-biz",
    name: "Perfect Biz",
    monthly: 32.93,
    data: "Neograničeno",
    voice: "Neograničeni pozivi i SMS",
    roaming: "EU",
    desc: "Neograničeni internet • Neograničeni pozivi i SMS • A1 Net Protect",
    walletCredit: 170,
  },
  {
    id: "ideal-biz",
    name: "Ideal Biz",
    monthly: 51.64,
    data: "Neograničeno",
    voice: "Neograničene min i SMS",
    roaming: "EU + Regija (3GB)",
    desc: "Neograničeni internet • Neograničene min i SMS • 3 GB u roamingu u zemljama regije • MultiSIM za samo 3,61 €/mj. • A1 Net Protect",
    walletCredit: 285,
  },
  {
    id: "master-biz",
    name: "Master Biz",
    monthly: 71.46,
    data: "Neograničeno",
    voice: "Neograničeni pozivi i SMS",
    roaming: "EU + Regija (3GB) + Svijet (250MB)",
    desc: "Neograničeni internet • Neograničeni pozivi i SMS • 3 GB u roamingu u zemljama regije i 250MB roaminga u svijetu • MultiSIM • A1 Net Protect",
    walletCredit: 360,
  },
];

export const devices: Device[] = [
  {
    id: "iph-15",
    brand: "Apple",
    name: "iPhone 15",
    upfront: 799,
    installment: 25,
    emoji: "📱",
    image: iphone15,
    images: [iphone15, iphone15, iphone15, iphone15, iphone15],
    description: "iPhone 15 donosi Dynamic Island, 48MP kameru i USB-C priključak u elegantnome dizajnu.",
    energyClass: "A++",
    specs: {
      display: "6.1\" Super Retina XDR OLED",
      processor: "Apple A16 Bionic chip",
      camera: "48MP glavna + 12MP ultra široka",
      battery: "3349 mAh, do 20h videa",
      weight: "171 grama"
    },
    variants: [
      { id: "iph-15-128-black", color: "Midnight Black", colorHex: "#1a1a1a", memory: "128GB", upfront: 799, installment: 25 },
      { id: "iph-15-128-blue", color: "Blue", colorHex: "#4a90e2", memory: "128GB", upfront: 799, installment: 25 },
      { id: "iph-15-128-pink", color: "Pink", colorHex: "#ffb3c6", memory: "128GB", upfront: 799, installment: 25 },
      { id: "iph-15-256-black", color: "Midnight Black", colorHex: "#1a1a1a", memory: "256GB", upfront: 899, installment: 28 },
      { id: "iph-15-256-blue", color: "Blue", colorHex: "#4a90e2", memory: "256GB", upfront: 899, installment: 28 },
      { id: "iph-15-256-pink", color: "Pink", colorHex: "#ffb3c6", memory: "256GB", upfront: 899, installment: 28 },
      { id: "iph-15-512-black", color: "Midnight Black", colorHex: "#1a1a1a", memory: "512GB", upfront: 1099, installment: 30 },
      { id: "iph-15-512-blue", color: "Blue", colorHex: "#4a90e2", memory: "512GB", upfront: 1099, installment: 30 },
      { id: "iph-15-512-pink", color: "Pink", colorHex: "#ffb3c6", memory: "512GB", upfront: 1099, installment: 30 },
    ]
  },
  {
    id: "sgs-24",
    brand: "Samsung",
    name: "Galaxy S24",
    upfront: 699,
    installment: 25,
    emoji: "📱",
    image: galaxyS24,
    images: [galaxyS24, galaxyS24, galaxyS24, galaxyS24, galaxyS24],
    description: "Galaxy S24 s Dynamic AMOLED 2X zaslonom, Exynos 2400 procesorom i Galaxy AI značajkama.",
    energyClass: "A+",
    specs: {
      display: "6.2\" Dynamic AMOLED 2X, 120Hz",
      processor: "Samsung Exynos 2400",
      camera: "50MP glavna + 12MP ultra široka + 10MP tele",
      battery: "4000 mAh, brzo punjenje 25W",
      weight: "168 grama"
    },
    variants: [
      { id: "sgs-24-128-black", color: "Phantom Black", colorHex: "#000000", memory: "128GB", upfront: 699, installment: 25 },
      { id: "sgs-24-128-cream", color: "Cream", colorHex: "#f5f5dc", memory: "128GB", upfront: 699, installment: 25 },
      { id: "sgs-24-128-violet", color: "Violet", colorHex: "#8b7d9b", memory: "128GB", upfront: 699, installment: 25 },
      { id: "sgs-24-256-black", color: "Phantom Black", colorHex: "#000000", memory: "256GB", upfront: 799, installment: 28 },
      { id: "sgs-24-256-cream", color: "Cream", colorHex: "#f5f5dc", memory: "256GB", upfront: 799, installment: 28 },
      { id: "sgs-24-256-violet", color: "Violet", colorHex: "#8b7d9b", memory: "256GB", upfront: 799, installment: 28 },
    ]
  },
  {
    id: "pix-8",
    brand: "Google",
    name: "Pixel 8",
    upfront: 649,
    installment: 25,
    emoji: "📱",
    image: pixel8,
    images: [pixel8, pixel8, pixel8, pixel8, pixel8],
    description: "Google Pixel 8 s Tensor G3 čipom, izvanrednom kamerom i čistim Android iskustvom.",
    energyClass: "A+",
    specs: {
      display: "6.2\" OLED, 120Hz, Gorilla Glass Victus",
      processor: "Google Tensor G3",
      camera: "50MP glavna + 12MP ultra široka, AI obrada",
      battery: "4575 mAh, bezično punjenje",
      weight: "187 grama"
    },
    variants: [
      { id: "pix-8-128-obsidian", color: "Obsidian", colorHex: "#1c1c1c", memory: "128GB", upfront: 649, installment: 25 },
      { id: "pix-8-128-hazel", color: "Hazel", colorHex: "#8b7355", memory: "128GB", upfront: 649, installment: 25 },
      { id: "pix-8-128-rose", color: "Rose", colorHex: "#e8a9a9", memory: "128GB", upfront: 649, installment: 25 },
      { id: "pix-8-256-obsidian", color: "Obsidian", colorHex: "#1c1c1c", memory: "256GB", upfront: 749, installment: 27 },
      { id: "pix-8-256-hazel", color: "Hazel", colorHex: "#8b7355", memory: "256GB", upfront: 749, installment: 27 },
      { id: "pix-8-256-rose", color: "Rose", colorHex: "#e8a9a9", memory: "256GB", upfront: 749, installment: 27 },
    ]
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
