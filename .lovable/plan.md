## Cilj
Dodati prikaz EU energetske naljepnice na stranici pojedinog uređaja (`DeviceDetailModal`).

## Trenutno stanje
U `DeviceDetailModal` već postoji informacija o energetskom razredu prikazana u headeru kao `Badge`. Potrebno je dodati vizualnu energetsku naljepnicu s linkom na detaljnu energetsku karticu.

## Implementacija

### 1. UI smještaj
U lijevi stupac ispod galerije slika (thumbnails) dodati:
- Vertikalnu sliku energetske naljepnice (`https://sc.a1.hr/sc/b.png`)
- Natpis "Energetski razred: {device.energyClass}"
- Link "Pogledaj energetsku naljepnicu" (dummy URL zasad)

### 2. Dizajn
```
- Slika: h-32, object-contain
- Hover: opacity-80 transition
- Link: text-xs, text-primary, underline
- Centrirano u lijevom stupcu
```

### 3. Edge slučajevi
- Ako `device.energyClass` ne postoji, cijeli energetski blok se ne prikazuje.
- Dummy link koristi `target="_blank" rel="noopener noreferrer"`.

## Datoteke koje se mijenjaju
- `src/components/modals/DeviceDetailModal.tsx` — dodati energetsku naljepnicu ispod thumbnails sekcije

## Ne mijenja se
- Backend, API, tipovi — energyClass već postoji u `Device` tipu.
- Ostali dijelovi UI-a (header badge ostaje).