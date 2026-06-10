# Admin override stranica (/admovrd)

Nova ruta `/admovrd` koja otvara login modal sa sistemskim podacima (admin / admin). Nakon prijave admin upisuje MSISDN bilo kojeg korisnika i ulazi u glavni tok narudžbe kao taj (postojeći) korisnik.

## Tok

```text
/admovrd  ->  Login modal (admin / admin)
                     |  uspjeh
                     v
              Unos MSISDN-a (bilo koji broj)
                     |  potvrda
                     v
              Preusmjeravanje na /  (prijavljen kao taj MSISDN,
                                      postojeći korisnik)
```

## Što se gradi

1. **Nova stranica `src/pages/Admovrd.tsx`**
   - Na učitavanju odmah prikazuje modal (isti vizualni stil kao postojeći modali: bijela `bg-card`, `z-50`, gradient header, `AnimatePresence`).
   - Korak 1 — prijava: polja korisničko ime i lozinka. Provjera isključivo lokalno protiv fiksnih vrijednosti `admin` / `admin`. Kod pogrešnih podataka prikazuje grešku.
   - Korak 2 — impersonacija: polje za unos MSISDN-a (formatiranje kroz postojeću MSISDN logiku, +385 9X XXX XXXX). Prihvaća bilo koji ispravno formatiran broj (bez provjere prema mock listi). Gumb "Nastavi".
   - Na potvrdu sprema MSISDN u `sessionStorage` (npr. ključ `adminImpersonateMsisdn`) i preusmjerava na `/`.

2. **Registracija rute** u `src/App.tsx`
   - Dodati `<Route path="/admovrd" element={<Admovrd />} />` iznad catch-all rute.

3. **Prihvat impersonacije u `src/pages/Index.tsx`**
   - Na mountu provjeriti `sessionStorage` ključ; ako postoji MSISDN: postaviti `isLoggedIn = true`, `userIdentifier = MSISDN`, `customerType = "existing"`, te očistiti ključ (jednokratno).
   - Time korisnik ulazi u isti tok kao i normalno prijavljeni postojeći korisnik.

## Napomene

- Nema vidljive oznake/trake da je u tijeku admin override (po dogovoru).
- Nema backend/auth promjena — sve je lokalno (mock), u skladu s ostatkom aplikacije. Vjerodajnice `admin/admin` su namjerno fiksne za demo svrhu.
- Poštuju se memorijska pravila: stil modala, MSISDN formatiranje, bez logiranja osjetljivih podataka.

## Tehnički detalji

- `sessionStorage` se koristi jer je stanje prijave lokalni state u `Index` (nije globalni store); ključ se čita jednom na mountu i briše.
- MSISDN formatiranje koristi postojeću util logiku (`mem://features/msisdn-formatting-logic`).
