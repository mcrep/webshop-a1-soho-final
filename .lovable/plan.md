

# Plan: Redizajn tablice Usporedba tarifa

## Trenutni problemi
- Separatori izgledaju kao prazni redovi bez jasne namjene
- Nedostaje vizualna hijerarhija između grupa podataka
- Popust badge je u zelenoj boji koja odskače od A1 brand palete
- Tablica je prilično "ravna" bez jasne strukture

## Prijedlozi za poboljšanje

### Opcija A: Minimalistički pristup (preporučeno)
- Ukloniti separatore kao prazne retke
- Dodati suptilne horizontalne linije samo ispod "Vaša cijena" i "Roaming" redaka (border-b-2)
- Popust prikazati kao jednostavan crveni tekst (-21%) bez badge-a
- "Vaša cijena" istaknuti s većom veličinom fonta i bold stilom u crvenoj boji

### Opcija B: Grupirana struktura
- Dodati nazive grupa kao zaglavlja ("CIJENE", "ZNAČAJKE", "A1 WALLET")
- Svaka grupa ima blagi background (#f8f8f8)
- Čišći vizualni prijelazi između sekcija

### Opcija C: Kartica stil
- Svaki stupac tarife kao zasebna kartica
- Hover efekt koji ističe cijeli stupac
- Gornji dio kartice s nazivom tarife i cijenom

## Preporučeni dizajn (Opcija A - minimalistički)

```text
+------------------+----------+----------+----------+
| Značajka         | Entry Biz| Easy Biz | ...      |
+------------------+----------+----------+----------+
| Mjesečna cijena  | €17.99   | €22.99   | ...      |
| Popust           | -21%     | -24%     | ...      | ← crveni tekst
| Vaša cijena      | €14.20   | €17.51   | ...      | ← bold, veći font
+==================+----------+----------+----------+ ← deblji separator
| Podatkovni promet| 1 GB     | 5 GB     | ...      |
| Pozivi i SMS     | 200 min  | Neogr.   | ...      |
| Roaming          | HR       | HR       | ...      |
+==================+----------+----------+----------+ ← deblji separator
| A1 Wallet popust | €10      | €35      | ...      |
| Wallet bonus     | +€5      | +€10     | ...      |
+------------------+----------+----------+----------+
```

## Tehnička implementacija

1. **Ukloniti separatore kao zasebne retke** - zamijeniti s border-b-2 na određenim redcima
2. **Stilizirati popust** - jednostavan crveni tekst umjesto zelenog badge-a
3. **Poboljšati tipografiju** - jasnija razlika između labela i vrijednosti
4. **Dodati hover efekt na stupce** - suptilni background highlight
5. **Poboljšati zaglavlje tarifa** - veći font, možda s malim badge-om za popularnu tarifu

## Datoteke za izmjenu
- `src/components/modals/CompareTariffsModal.tsx`

