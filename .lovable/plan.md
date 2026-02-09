

## Implementacija odabira eSIM / Fizička SIM kartica

### Pregled

Dodavanje mogućnosti odabira vrste SIM kartice (eSIM ili fizička) za svaku liniju na ekranu Sažetak (Step 4). Korisnik će moći odabrati željeni tip SIM kartice za svaku liniju individualno.

### Korisnicko iskustvo

1. U redu s badge-ovima (tarifa, uredaj, vrsta linije) dodaje se novi element za SIM tip
2. Po defaultu ce stajati "Fizicka SIM" kao badge s X gumbom za promjenu
3. Klikom na X ili na sam badge otvara se mali inline picker s dvije opcije
4. Odabir se sprema i prikazuje kao badge

### Vizualni prikaz

```text
+------------------------------------------------------------------+
|  1  | Nova linija 1                          | 32.99€/mj    [v]  |
|     |                                        |                   |
|     | [Perfect Biz] [iPhone 15] [Nova linija] [Fizicka SIM x]    |
+------------------------------------------------------------------+
```

Kada korisnik klikne na badge "Fizicka SIM", pojavljuje se dropdown/picker:

```text
+------------------------------------------------------------------+
|  1  | Nova linija 1                          | 32.99€/mj    [v]  |
|     |                                        |                   |
|     | [Perfect Biz] [iPhone 15] [Nova linija]                    |
|     |                                                            |
|     |   Odaberi vrstu SIM kartice:                               |
|     |   ( ) eSIM                                                 |
|     |   (o) Fizicka SIM kartica                                  |
+------------------------------------------------------------------+
```

---

## Tehnicka implementacija

### 1. Azuriranje Line tipa

**Datoteka:** `src/types/index.ts`

Dodati novo polje u Line tip:

```typescript
export type Line = {
  // ... postojeca polja
  simType?: "esim" | "physical";  // Default: "physical"
};
```

### 2. Azuriranje Step4Summary komponente

**Datoteka:** `src/components/steps/Step4Summary.tsx`

**2.1 Dodati lokalni state za prikaz pickera:**
```typescript
const [simPickerLineId, setSimPickerLineId] = useState<string | null>(null);
```

**2.2 Dodati SIM badge u badge row (nakon Line Type):**

Logika prikaza:
- Ako `simPickerLineId === line.id` - prikazati inline radio picker
- Inace prikazati badge s trenutnim odabirom i X gumbom

**2.3 Implementacija badge-a:**

```typescript
{/* SIM Type Badge */}
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
  {line.simType === "esim" ? "eSIM" : "Fizicka SIM"}
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSimPickerLineId(line.id);
    }}
    className="ml-1 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
  >
    <X size={12} className="text-muted-foreground" />
  </button>
</span>
```

**2.4 Implementacija inline pickera:**

Kada je picker aktivan, prikazati radio group ispod badge reda:

```typescript
{simPickerLineId === line.id && (
  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
    <p className="text-sm text-foreground mb-2">Odaberi vrstu SIM kartice:</p>
    <div className="flex gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={line.simType !== "esim"}
          onChange={() => {
            onUpdateLine(line.id, { simType: "physical" });
            setSimPickerLineId(null);
          }}
        />
        <span className="text-sm">Fizicka SIM kartica</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={line.simType === "esim"}
          onChange={() => {
            onUpdateLine(line.id, { simType: "esim" });
            setSimPickerLineId(null);
          }}
        />
        <span className="text-sm">eSIM</span>
      </label>
    </div>
  </div>
)}
```

### 3. Azuriranje Index.tsx (parent komponente)

**Datoteka:** `src/pages/Index.tsx`

Osigurati da `onUpdateLine` funkcija podrzava novo `simType` polje (vec bi trebala raditi jer koristi `Partial<Line>`).

Pri kreiranju novih linija, postaviti default vrijednost:
```typescript
simType: "physical"
```

### 4. Prikaz u prosirenom pogledu (opcijski)

U expanded sekciji kartice, dodati informaciju o odabranom SIM tipu:

```typescript
{/* SIM sekcija */}
<div className="border-t border-border" />
<div className="space-y-1">
  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
    SIM kartica
  </div>
  <div className="flex justify-between items-center">
    <span className="font-semibold">
      {line.simType === "esim" ? "eSIM" : "Fizicka SIM kartica"}
    </span>
  </div>
</div>
```

---

## Sazeti koraci implementacije

1. Dodati `simType` polje u `Line` tip (`src/types/index.ts`)
2. U `Index.tsx` postaviti default `simType: "physical"` pri kreiranju linija
3. U `Step4Summary.tsx`:
   - Dodati state za aktivni picker
   - Dodati SIM badge u badge row
   - Dodati inline picker koji se prikazuje na klik
   - (Opcijski) Dodati SIM info u prošireni pogled

