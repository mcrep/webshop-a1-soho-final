
## Implementacija Fade + Scale animacije za prijelaz između ekrana

### Opis
Implementirat ćemo glatku animaciju prijelaza između koraka gdje trenutni ekran izbljeđuje i lagano se smanjuje, dok se novi pojavljuje s blagim povećanjem.

### Vizualni efekt
```text
┌───────────┐          ┌───────────┐
│  Korak 1  │  fade    │  Korak 2  │
│  scale ↓  │  ────>   │  scale ↑  │
│  opacity↓ │          │  opacity↑ │
└───────────┘          └───────────┘
```

### Tehnički detalji

**Datoteka:** `src/pages/Index.tsx`

**Promjene:**

1. **Import motion iz framer-motion**
   - Već postoji `AnimatePresence`, dodat ćemo `motion`

2. **Kreirati animacijske varijante**
   - `initial`: scale 0.95, opacity 0
   - `animate`: scale 1, opacity 1
   - `exit`: scale 0.95, opacity 0

3. **Omotati sadržaj koraka u motion.div**
   - Koristiti `AnimatePresence` s `mode="wait"` da se čeka završetak exit animacije
   - `key={currentStep}` za triggiranje animacije pri promjeni koraka

4. **Postavke animacije**
   - Trajanje: 250ms
   - Easing: ease-out za prirodan osjećaj

**Primjer koda:**
```tsx
import { motion, AnimatePresence } from "framer-motion";

const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// U renderiranju:
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    variants={fadeScaleVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {currentScreen === "Početak" && <Step1CustomerInfo ... />}
    {currentScreen === "Tarife" && <Step2TariffSelection ... />}
    {/* ... ostali koraci */}
  </motion.div>
</AnimatePresence>
```

### Rezultat
Svaki prijelaz između koraka imat će profesionalnu, glatku animaciju koja daje osjećaj poliranosti bez usporavanja korisničkog iskustva.
