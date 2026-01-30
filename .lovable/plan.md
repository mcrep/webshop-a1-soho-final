

# Usklađivanje dizajna ExtensionLinesModal i TariffLineAssignmentModal

## Cilj

Uskladiti vizualni dizajn modala za odabir linija s već usklađenim modalima za uređaje (DeviceListModal i DeviceDetailModal).

## Dizajn principi iz Device modala

| Element | Stil |
|---------|------|
| **Hover stanje** | `border-border hover:border-foreground` (crni border) |
| **Selektirano** | `bg-[#F2F2F2] border-transparent` |
| **Neselektirano** | `border-border` |
| **Animacije** | Framer Motion spring animacije |

## Promjene po modalima

### 1. ExtensionLinesModal.tsx

**Linija kartice (line 113-117):**
```text
Prije:
- Selektirano: "border-primary bg-primary/5"
- Neselektirano: "border-border hover:bg-muted"

Poslije:
- Selektirano: "bg-[#F2F2F2] border-transparent"
- Neselektirano: "border-border hover:border-foreground"
```

**Checkbox kružić (line 123-127):**
```text
Prije:
- Selektirano: "border-primary bg-primary text-primary-foreground"
- Neselektirano: "border-muted-foreground/30"

Poslije:
- Selektirano: "border-foreground bg-foreground text-background"
- Neselektirano: "border-muted-foreground/30"
```

### 2. TariffLineAssignmentModal.tsx

**LineCheckbox komponenta (line 207-219):**
```text
Prije:
- Selektirano: "border-primary bg-primary/5"
- Neselektirano: "hover:border-primary/30 hover:bg-accent/50"
- Animacija: borderColor na primary

Poslije:
- Selektirano: "bg-[#F2F2F2] border-transparent"
- Neselektirano: "border-border hover:border-foreground"
- Animacija: uklonjena (nepotrebna s novim stilom)
```

**Checkbox komponenta:**
- Zamijeniti `<Checkbox>` s prilagođenim kružićem kao u ExtensionLinesModal
- Koristiti crnu boju za označeno stanje umjesto primary

**Check ikona (line 234-244):**
```text
Prije: "text-primary"
Poslije: "text-foreground"
```

## Vizualni pregled

```text
+--------------------------------------------------+
|  [Gradient Header - ostaje isti]                 |
+--------------------------------------------------+
|                                                  |
|  Opis tekst...                                   |
|                                                  |
|  +--------------------------------------------+  |
|  | ○  Linija 1                                |  |  <- Neselektirano
|  |    Tarifa: Biz M                           |  |     border-border
|  +--------------------------------------------+  |     hover:border-foreground (crni)
|                                                  |
|  +--------------------------------------------+  |
|  | ●  385912345678                        ✓   |  |  <- Selektirano
|  |    Tarifa: Biz S                           |  |     bg-[#F2F2F2]
|  +--------------------------------------------+  |     border-transparent
|                                                  |
+--------------------------------------------------+
|  [Odustani]              [Potvrdi (1)]          |
+--------------------------------------------------+
```

## Dodatne prilagodbe

1. **Ukloniti whileHover/whileTap scale animacije** iz TariffLineAssignmentModal jer Device modali ih ne koriste
2. **Konzistentni border-radius**: Koristiti `rounded-xl` za kartice linija (kao DeviceDetailModal)

## Datoteke za izmjenu

1. `src/components/modals/ExtensionLinesModal.tsx`
2. `src/components/modals/TariffLineAssignmentModal.tsx`

