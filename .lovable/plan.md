

## Flow nakon klika "Zavrsi narudzbu" -- Credit Check, Placanje i Rezultat

### Pregled

Nakon sto korisnik klikne "Zavrsi narudzbu" na koraku Isporuka, pokrece se sljedeci tok:

1. **Credit check** (simuliran) -- prikazuje se loading ekran
2. Ako je **pozitivan**:
   - Ako je placanje **fakturom** -- direktno prikazuje success ekran
   - Ako je placanje **karticom** -- otvara se ekran za unos kartice, pa success ili error
3. Ako je **negativan** -- prikazuje se error ekran s opcijom da se korisnik vrati u flow i prilagodi ponudu

### Novi korak: Step 7 -- Obrada narudzbe

Dodaje se novi "virtualni" korak koji nije vidljiv u step indicatoru, vec je fullscreen overlay s razlicitim stanjima:

```text
Stanja:
  "credit-check"  -->  spinner + "Provjeravamo vasu narudzbu..."
  "credit-denied"  -->  error kartica s opisom + gumb "Prilagodi ponudu"
  "card-payment"   -->  forma za unos kartice (dummy)
  "payment-error"  -->  error kartica + gumb "Pokusaj ponovo" ili "Prilagodi ponudu"
  "success"        -->  success kartica s potvrdom narudzbe
```

### Korisnicko iskustvo

**Credit check pozitivan + faktura:**
- Loading (2s simulacija) --> Success ekran ("Vasa narudzba je zaprimljena!")

**Credit check pozitivan + kartica:**
- Loading (2s) --> Ekran za karticu --> Klik "Plati" --> Loading (1s) --> Success ili Payment Error

**Credit check negativan:**
- Loading (2s) --> Error ekran ("Nije moguce obraditi narudzbu u trenutnoj konfiguraciji")
- Gumb "Prilagodi ponudu" vraca korisnika na korak Sazet tak gdje moze mijenjati uredaje, rate itd.

**Payment error:**
- Error ekran s opcijama "Pokusaj ponovo" (vraca na karticu) ili "Prilagodi ponudu" (vraca u flow)

### Tehnicki detalji

**Nove datoteke:**
1. `src/components/steps/Step7OrderProcessing.tsx` -- komponenta s svim stanjima (credit-check, credit-denied, card-payment, payment-error, success)

**Izmjene u postojecim datotekama:**

1. **`src/pages/Index.tsx`**:
   - Dodati novo stanje `orderProcessingState` za pracenje stanja obrade
   - `handleDeliveryNext` pokrece credit check (setTimeout simulacija)
   - Dodati renderiranje Step7 komponente
   - Funkcija `handleAdjustOffer` vraca korisnika na korak Sazetak
   - Funkcija `handleRetryPayment` vraca na card-payment stanje

2. **`src/types/index.ts`**:
   - Dodati tip `OrderProcessingState = "credit-check" | "credit-denied" | "card-payment" | "payment-error" | "success"`

**Komponenta Step7OrderProcessing:**
- `credit-check`: Animirani spinner (framer-motion) s tekstom "Provjeravamo..."
- `credit-denied`: Crvena kartica s ikonom AlertTriangle, opis problema, gumb "Prilagodi ponudu"
- `card-payment`: Dummy forma (broj kartice, datum, CVV) s gumbom "Plati"
- `payment-error`: Crvena kartica s opisom greske, dva gumba
- `success`: Zelena kartica s CheckCircle ikonom, broj narudzbe, poruka potvrde

**Simulacija credit checka:**
- Random rezultat (npr. 70% prolazi, 30% ne) za demo svrhe
- setTimeout od 2 sekunde za simulaciju API poziva

