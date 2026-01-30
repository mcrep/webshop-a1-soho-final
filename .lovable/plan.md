

# Izmjena hover boje za outline/ghost gumbe

## Problem

Trenutno `outline` i `ghost` varijante gumba koriste `hover:bg-accent` koja je definirana kao roza/crvenkasta boja (`5 79% 88%`).

## Rješenje

Promijenit ću hover pozadinu na neutralnu sivu boju umjesto roza tona. Koristit ću postojeću `muted` boju koja je već definirana kao neutralna siva (`210 40% 96%`).

## Promjene

**Datoteka:** `src/components/ui/button.tsx`

| Varijanta | Prije | Poslije |
|-----------|-------|---------|
| `outline` | `hover:bg-accent hover:text-accent-foreground` | `hover:bg-muted hover:text-foreground` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | `hover:bg-muted hover:text-foreground` |

## Vizualni rezultat

- **Prije**: Hover daje roza/crvenkasti ton
- **Poslije**: Hover daje neutralnu sivu pozadinu (ista kao `--muted: 210 40% 96%`)

## Napomena

Ova promjena utječe na sve `outline` i `ghost` gumbe u aplikaciji, uključujući:
- "Natrag" gumb u footeru
- Gumbi za odabir količine (+/-)
- Dropdown okidači
- Sve ostale ghost/outline gumbe

