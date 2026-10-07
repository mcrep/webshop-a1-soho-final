# Razlog umjesto naziva procesa

## Problem današnjeg prekidača

Dvije oznake ("Aktivacija i produljenje ugovora", "Naknadno uzimanje uređaja") su A1-žargon. Korisnik mora prvo razumjeti razliku, a ne dobiva nikakav signal vrijedi li opcija za njega — tek nakon klikova sazna je li pogriješio.

## Prijedlog

Prekidač ostaje mali i u jednom redu, ali svaka opcija nosi **korisnikove vlastite podatke** pa sama objašnjava za koga je:

```text
        [ Aktivacija i produljenje ugovora | 3 za produljenje ]   [ Naknadno uzimanje uređaja | 2 bez uređaja ]
                          Nove linije, tarife i produljenje postojećih linija
```

- Lijeva opcija dobiva oznaku s brojem linija kojima ugovor ističe (ili je već istekao) — "3 za produljenje".
- Desna opcija dobiva broj linija koje danas nemaju uređaj — "2 bez uređaja".
- Ako je neki broj nula, oznaka se ne prikazuje (prazno, bez "0").
- Na mobitelu ostaje skraćena labela ("Aktivacija", "Naknadno uzimanje") i samo brojčana oznaka.
- Linija s objašnjenjem ispod se preformulira iz definicije u posljedicu:
  - Aktivacija: "Biraš linije i tarife; uređaji su opcija."
  - Naknadno uzimanje: "Tarife se ne mijenjaju — samo kupnja uređaja."

Time korisnik ne mora znati što znači "naknadno uzimanje" — vidi "2 bez uređaja" i zna da je to njegova opcija.

## Pametan zadani izbor

Umjesto fiksnog zadanog "Aktivacija", zadanje se izvodi iz podataka: ako nijedna linija ne može na produljenje, a barem jedna nema uređaj, otvara se "Naknadno uzimanje uređaja". Prekidač ostaje vidljiv i u jedan klik vraća na drugu opciju.

## Što se namjerno ne radi

- Odvojeni prekidač se ne uklanja iz ekrana (varijanta "prekidač u rečenici" sakriva izbor).
- Ne dodaje se vođeni "Nisam siguran" korak — dodatni klik za sve korisnike.
- Ne prelazi se na popis namjera bez izbora procesa — to diruje sve korake flow-a.

## Tehnički detalji

- `src/data/mock-existing-lines.ts`: tip `MockExistingLine` dobiva `hasDevice: boolean`; postojeći `expires` datumi (15.12.2025, 20.01.2026, 05.03.2026) svi su u prošlosti, pa se pomiču u budućnost da se oznake mogu demonstrirati.
- `src/components/steps/Step1CustomerInfo.tsx`: `PROCESS_OPTIONS` umjesto statičnog `hint` dobiva izračun oznake iz `mockExistingLines`; chip se renderira unutar segmenta (`rounded-full`, `bg-primary/10`, `text-primary`, mala tipografija), na mobitelu samo broj.
- Dodaje se pomoćna funkcija za hrvatsku množinu (1 "linija", 2–4 "linije", 5+ "linija") i brojanje linija s istekom unutar 12 mjeseci te linija bez uređaja.
- `src/pages/Index.tsx`: početni `processType` se izvodi iz gornjih kriterija umjesto da bude stalno "activation".
- Nema test runnera u projektu, pa se provjera radi typecheck-om i u pregledniku: slika prvog ekrana u obje opcije i na mobitelu.
