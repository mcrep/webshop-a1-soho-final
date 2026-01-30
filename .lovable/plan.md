

# Implementacija Opcije D: Grupiranje po kategorijama

## Pregled promjena

Redizajniram prošireni prikaz stavki unutar svake linije na Step 4 (Sažetak) koristeći grupiranje po kategorijama bez ikona i zasebnih kartica.

---

## Vizualni prikaz novog dizajna

```text
┌─────────────────────────────────────────────────────────────┐
│  PAKET                                                      │
│  Connect Biz                                   26.31€/mj    │
├─────────────────────────────────────────────────────────────┤
│  UREĐAJ                                                     │
│  Apple iPhone 15 · Blue · 256GB                             │
│    Plaćanje na rate (24 mj)                    28.00€/mj    │
│    A1 Wallet popust                            −50.00€      │
│    Osiguranje ekrana                            4.99€/mj    │
└─────────────────────────────────────────────────────────────┘
```

---

## Što se uklanja

- Grid layout s 2 stupca
- Sve ikone (Tag, Smartphone, CreditCard, Shield, Wallet)
- Obojeni krugovi za ikone
- Zasebne kartice za svaku stavku (bg-card rounded-xl border)
- Uppercase naslovi iznad svake stavke

---

## Što se dodaje

1. **PAKET sekcija**
   - Naslov "PAKET" (uppercase, muted, mali font)
   - Jedan redak: naziv tarife lijevo, cijena desno
   - Separator linija ispod

2. **UREĐAJ sekcija** (samo ako postoji uređaj)
   - Naslov "UREĐAJ" (uppercase, muted, mali font)
   - Naziv uređaja s varijantom (boja · memorija)
   - Podstavke s uvlakom (pl-4):
     - Način plaćanja (rate ili jednokratno)
     - A1 Wallet popust (ako postoji) - **jedina stavka u primarnoj boji**
     - Osiguranje ekrana (ako je odabrano)

---

## Struktura koda

```tsx
{/* Expanded Details */}
{isExpanded && (
  <div className="border-t border-border p-4 space-y-4">
    
    {/* PAKET sekcija */}
    <div className="space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Paket
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">{tariff?.name}</span>
        <span className="font-semibold">{tariffMonthly.toFixed(2)}€/mj</span>
      </div>
    </div>

    {/* Separator */}
    {device?.id !== "no-dev" && <div className="border-t border-border" />}

    {/* UREĐAJ sekcija */}
    {device?.id !== "no-dev" && (
      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Uređaj
        </div>
        
        {/* Naziv uređaja s varijantom */}
        <div className="font-medium">
          {device?.brand} {device?.name}
          {variant && ` · ${variant.color} · ${variant.memory}`}
        </div>

        {/* Podstavke s uvlakom */}
        <div className="pl-4 space-y-1 text-sm">
          {/* Način plaćanja */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {line.devicePayment === "installments" 
                ? "Plaćanje na rate (24 mj)" 
                : "Jednokratno plaćanje"}
            </span>
            <span>
              {line.devicePayment === "installments" 
                ? `${deviceMonthly.toFixed(2)}€/mj` 
                : `${lineOnetime.toFixed(2)}€`}
            </span>
          </div>

          {/* A1 Wallet popust - jedina stavka u boji */}
          {line.walletUse > 0 && (
            <div className="flex justify-between text-primary">
              <span>A1 Wallet popust</span>
              <span className="font-semibold">−{line.walletUse.toFixed(2)}€</span>
            </div>
          )}

          {/* Osiguranje ekrana */}
          {line.screenInsurance && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Osiguranje ekrana</span>
              <span>4.99€/mj</span>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}
```

---

## Tehničke promjene u datoteci

**Datoteka:** `src/components/steps/Step4Summary.tsx`

1. Ukloniti nekorištene importe: `Smartphone`, `CreditCard`, `Shield`, `Wallet`, `Tag`
2. Zamijeniti cijeli blok unutar `{isExpanded && (...)}` (linije 210-312) s novim kodom
3. Ukloniti grid layout i zasebne kartice
4. Dodati vertikalni raspored sa sekcijama i separatorom

---

## Rezultat

- Čist, minimalistički prikaz usklađen s A1 dizajn sustavom
- Logično grupiranje stavki (PAKET + UREĐAJ)
- Hijerarhija kroz naslove i uvlake
- Samo A1 Wallet popust u primarnoj boji za isticanje uštede
- Bez vizualnog šuma od ikona i kartica

