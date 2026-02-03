

## Reorganizacija prikaza u proširenom pogledu (Step 4 Summary)

### Cilj
Pojednostaviti i ujednačiti prikaz detalja tarife i uređaja u proširenom pogledu svake linije.

### Nova struktura

#### TARIFA sekcija
| Lijevo | Desno |
|--------|-------|
| Naziv tarife (npr. "Perfect Biz") | Puna cijena (npr. ~~42.99€/mj~~) |
| Popust | −10.06€/mj (u primary boji) |

#### UREĐAJ sekcija
| Lijevo | Desno |
|--------|-------|
| Uređaj + varijanta (npr. "Apple iPhone 15 · Blue · 256GB") | Jednokratna cijena* |
| A1 Wallet popust | −XX.XX€ (u primary boji) |
| Osiguranje ekrana | 4.99€/mj |

*Jednokratna cijena:
- Ako **upfront plaćanje** → MPC cijena uređaja
- Ako **rate** → Upfront dio (razlika između MPC i ukupnih rata)

### Tehnički detalji

**Datoteka:** `src/components/steps/Step4Summary.tsx`

**Promjene u TARIFA sekciji:**
- Prvi red: naziv tarife + `originalMonthly` (precrtano, muted boja)
- Drugi red: "Popust" + razlika u primary boji
- Ako nema popusta (originalMonthly == monthly), prikazati samo naziv + trenutnu cijenu

**Promjene u UREĐAJ sekciji:**
- Ukloniti red "Plaćanje na rate / Jednokratno plaćanje"
- Prvi red: naziv uređaja s varijantom + jednokratna cijena (devicePrice ili lineOnetime ovisno o načinu plaćanja)
- Drugi red: A1 Wallet popust (ako postoji)
- Treći red: Osiguranje ekrana (ako je uključeno)

