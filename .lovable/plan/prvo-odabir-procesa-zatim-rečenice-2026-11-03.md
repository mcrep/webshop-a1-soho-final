# Prvo odabir procesa, zatim rečenice

## Ideja

Kada se postojeći korisnik prijavi, ispod "Ja sam" se ne prikazuju odmah rečenice za aktivaciju. Umjesto toga pojavljuje se pitanje **"Što želite napraviti?"** s dvije jednako važne kartice. Rečenice se pokazuju tek nakon odabira.

```text
Što želite napraviti?

[ (dokument)  Aktivacija i produljenje ugovora ]   [ (mobitel)  Naknadno uzimanje uređaja ]
  Nove linije, produljenje i uređaji uz tarifu       Uređaj za postojeću liniju, tarifa ostaje ista
```

Nakon klika:
- Kartice se smanje u mali klizni prekidač (današnji dizajn) na vrhu, da se izbor može promijeniti u jedan klik.
- Ispod se blago pojavi (fade-in, 200 ms) samo odgovarajući sadržaj:
  - Aktivacija: "Želim aktivirati X novih mobilnih linija / i produljiti X / a uz to želim kupiti X uređaja"
  - Naknadno uzimanje: "Želim kupiti (X) mobilnih uređaja"
- Dok ništa nije odabrano, gumb "Nastavi" je onemogućen (uz shake pri kliku, kao drugdje).

Za novog korisnika ništa se ne mijenja — on nema izbor procesa pa odmah vidi rečenicu "Želim aktivirati...".

## Ponašanje

- Zadano stanje nakon prijave: ništa odabrano (nema više automatskog "Aktivacija").
- Promjena procesa zadržava već upisane brojeve za svaki proces posebno.
- Odjava i "Kreni ispočetka" vraćaju na neodabrano stanje.

## Tehnički detalji

- `ProcessType` dobiva stanje `null` u `Index.tsx` (početno `null`, reset u `handleLogout`/`handleStartOver`; admin impersonacija također počinje s `null`).
- `Step1CustomerInfo.tsx`: ako je `isLoggedIn && processType === null` → prikaz dvije veće kartice (stil odabira kao "Ja sam", bijela `bg-card`, odabrano `#F2F2F2`); inače postojeći segmentirani prekidač. Kartica s rečenicama renderira se samo kad je `!isLoggedIn || processType !== null`, s `motion.div` fade-in (opacity 0→1, 200ms easeOut, bez exit animacije).
- `canProceed` vraća `false` kad je ulogiran i `processType === null`; `steps` useMemo tretira `null` kao aktivacijski tok za prikaz indikatora koraka.
- Provjera: typecheck i Playwright (prijava preko `/admovrd`, oba izbora, promjena izbora).
