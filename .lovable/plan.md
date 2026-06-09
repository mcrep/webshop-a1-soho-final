## Cilj

Uz postojeće "Osiguranje ekrana" dodati i "Osiguranje uređaja" na istom mjestu u kartici uređaja (Korak 3). Umjesto trenutnog toggle reda, prikazati dvije odabir-kartice jedna pored druge. Obje se mogu uključiti neovisno. Ako uređaj ne podržava neku opciju, ta kartica se sakriva (zasad svi uređaji podržavaju oboje).

## UX prikaz

Dvije kartice u gridu unutar konfiguracije uređaja:

```text
┌──────────────────────┐  ┌──────────────────────┐
│ ✓  Osiguranje ekrana │  │ ✓  Osiguranje uređaja│
│    4,99 €/mj         │  │    29,99 €/mj        │
└──────────────────────┘  └──────────────────────┘
```

- Klik na karticu uključuje/isključuje tu opciju (kvačica u kutu + istaknuti obrub kad je aktivna).
- Aktivna kartica: obrub/pozadina u naglasku (A1 stil), neaktivna: neutralni obrub.
- Kad uređaj podržava samo jednu opciju → prikazuje se samo ta kartica (puna širina ako je sama).
- Kad uređaj ne podržava nijednu → cijela sekcija se sakrije (prazno).
- Zadržavamo postojeću napomenu ispod (mali tekst) koja se prilagođava odabranim osiguranjima.

## Cijene

- Osiguranje ekrana: 4,99 €/mj (postojeće)
- Osiguranje uređaja: 29,99 €/mj (novo)

## Tehničke izmjene

**Model podataka**
- `src/types/index.ts`: dodati `deviceInsurance?: boolean` na `Line`. Po želji dodati zastave dostupnosti na `Device` (`screenInsuranceAvailable?`, `deviceInsuranceAvailable?`) — zasad defaultaju na `true` za sve uređaje.
- DeviceSlot tip (Step3 + Index): dodati `deviceInsurance: boolean`.

**Stanje i handleri (`src/pages/Index.tsx`)**
- Inicijalizirati `deviceInsurance` u slotovima (default `false`, osim gdje se trenutno postavlja `screenInsurance: true`).
- Dodati handler `handleUpdateDeviceInsurance` analogno `handleUpdateInsurance`.
- Uključiti trošak osiguranja uređaja (29,99) u sve mjesečne kalkulacije gdje se već računa `screenInsuranceCost`.

**UI (`src/components/steps/Step3DeviceSelection.tsx`)**
- Zamijeniti postojeći toggle red s dvije odabir-kartice (grid).
- Dodati prop `onUpdateDeviceInsurance` i koristiti zastave dostupnosti za uvjetni prikaz kartica.

**Sažeci / cijene (gdje se pojavljuje `screenInsuranceCost`)**
- `src/components/OrderSummary.tsx`, `src/components/steps/Step4Summary.tsx`: dodati red "Osiguranje uređaja" i uračunati 29,99 u zbroj kad je uključeno.

**Prosljeđivanje kroz modale**
- `DeviceDetailModal.tsx` i `DeviceListModal.tsx`: proširiti `onSelectDevice` potpis da nosi i `deviceInsurance` (ili ostaviti `screenInsurance` netaknut i samo dodati novi flag) kako bi se zadržala dosljednost s `Index.tsx`.

## Napomena
U kodu je trošak osiguranja ekrana 4,99 €, dok stara tekstualna napomena spominje 4,19 €. Uskladit ću napomenu na 4,99 € radi dosljednosti.