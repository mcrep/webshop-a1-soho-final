# Drugi flow: Naknadno uzimanje uređaja

## Pregled

Za ulogirane korisnike na prvom ekranu dodajemo izbor procesa:

1. **Aktivacija / produljenje ugovora** — postojeći flow (nove linije + produljenje + uređaji)
2. **Naknadno uzimanje uređaja** — novi flow gdje korisnik samo kupuje uređaje za postojeće linije, bez promjene tarife

## Predloženi UX na prvom ekranu (ulogiran korisnik)

Nakon prijave, iznad rečenice prikazuju se dvije odabir-kartice (isti stil kao "Novi/Postojeći korisnik"):

```text
┌─────────────────────────┐  ┌─────────────────────────┐
│   📄 Aktivacija i       │  │   📱 Naknadno uzimanje  │
│   produljenje ugovora   │  │   uređaja               │
└─────────────────────────┘  └─────────────────────────┘
```

- **Aktivacija/produljenje** (default): prikazuje se postojeća rečenica
  "Želim aktivirati X novih linija i produljiti Y linija, a uz to želim kupiti Z uređaja"
- **Naknadno uzimanje uređaja**: prikazuje se nova, jednostavnija rečenica:

```text
Želim kupiti  ( X )  mobilnih uređaja
```

gdje je **X klikabilan broj** (isti stil kao broj produljenja — veliki crveni broj u zaobljenom gumbu) koji otvara modal s popisom linija.

## Modal za odabir linija (DeviceLinesModal)

- Novi modal, vizualno identičan `ExtensionLinesModal` (isti header s gradientom, kartice linija s kvačicom, footer s "Spremi (n)")
- Naslov: "Odaberite linije za koje kupujete uređaj"
- Popis postojećih linija korisnika (mock podaci, isti kao u produljenju) — svaka linija prikazuje broj, trenutnu tarifu i datum isteka
- Korisnik označi jednu ili više linija; svaka označena linija = jedan uređaj
- Spremi → rečenica prikazuje broj označenih linija

## Promjene u flow-u koraka

Za proces "Naknadno uzimanje uređaja" stepper postaje:

```text
Početak → Uređaji → Sažetak → Isporuka
```

- **Preskače se korak Tarife** — linije već imaju svoje tarife, ne mijenjaju se
- **Uređaji**: device slotovi se generiraju iz odabranih linija, označeni MSISDN-om (kao extension linije danas), bez opcije "Bez uređaja"
- **Sažetak**: prikazuje samo uređaje s njihovim linijama; bez wallet bonusa po liniji (nema novih/produljenih linija), wallet se puni samo kroz kupnju uređaja ako je primjenjivo
- **Verifikacija se preskače** (korisnik je postojeći)
- **Isporuka i plaćanje**: nepromijenjeno, uključujući postojeći Step7 credit check / payment flow

## Tehnički detalji

- `src/types/index.ts`: novi tip `processType: "activation" | "device-purchase"` i `DevicePurchaseLine { lineId, msisdn, currentTariff }`
- `src/pages/Index.tsx`: novo stanje `processType` i `devicePurchaseLines`; `steps` useMemo gradi korake ovisno o procesu (bez Tarife/Verifikacije za device-purchase); `generateDeviceSlots` gradi slotove iz `devicePurchaseLines` kada je aktivan taj proces; reset i logout čiste novo stanje
- `src/components/steps/Step1CustomerInfo.tsx`: izbor procesa (dvije kartice, vidljivo samo ulogiranima) + uvjetni prikaz rečenice; klikabilni X otvara novi modal
- `src/components/modals/DeviceLinesModal.tsx`: nova komponenta, kopira strukturu `ExtensionLinesModal`
- `src/components/steps/Step4Summary.tsx`: za device-purchase proces prikazuje samo uređaje (bez tarifnih badgeova po liniji — tarifa se prikazuje informativno iz postojeće linije)
- Mock podaci: privremeno koristimo iste mock linije kao `mockExistingLines`; kasnije će doći iz API-ja

## Pravila (potvrđeno)

- **Wallet**: korisnik NE dobiva nikakav novi wallet iznos u ovom procesu — može trošiti samo već dostupni wallet iznos na uređaje
- **Veza uređaja i linije**: 1 uređaj se veže uz točno 1 liniju (1 linija = 1 uređaj)
