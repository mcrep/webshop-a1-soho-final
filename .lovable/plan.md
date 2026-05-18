
# Plan: Virtualni prodajni predstavnik "Snježana"

AI agent koji vodi korisnika kroz cijeli A1 Biz flow razgovorom (tekst + glas) i na kraju kreira narudžbu — bez da korisnik prolazi kroz 7 koraka ručno.

---

## 1. UI komponente

### 1.1 Plutajući balončić (FAB)
- Fiksiran u donjem desnom kutu, `z-50`, vidljiv na svim stranicama
- Avatar Snježane + suptilni "puls" animacija (framer-motion) da privuče pažnju
- Mali badge "Trebate pomoć? 👋" koji se pojavi nakon 10s neaktivnosti
- Klik → otvara modal

### 1.2 Glavni chat modal
Veliki centriran modal (max-w-5xl, h-[85vh]), dva stupca:

**Lijevi stupac (40%) — Avatar Snježane**
- Generirani avatar (premium image, professional female sales rep, A1 brendiranje)
- Stanje: idle / sluša (mic ikona pulsira) / govori (waveform animacija) / razmišlja (shimmer)
- Ispod avatara: ime "Snježana", uloga "Vaš prodajni savjetnik", indikator statusa
- "Quick actions" gumbi: "Resetiraj razgovor", "Predaj ljudskom agentu" (mock)

**Desni stupac (60%) — Chat + composer**
- AI Elements: `Conversation`, `Message`, `MessageResponse`, `PromptInput`
- Tool execution prikazi (npr. "Pretražujem tarife...", "Provjeravam OIB...") kao tool accordion
- Composer: textarea + mic gumb + send gumb
- Mic gumb → ElevenLabs realtime STT (push-to-talk ili VAD)
- Opcionalno: TTS readback Snježaninih odgovora (ElevenLabs ženski hr glas)

### 1.3 Sidecar "Live narudžba"
Iznad chata mali collapsible panel koji u realnom vremenu pokazuje što je AI zaključao:
- Tip korisnika, OIB/tvrtka, broj linija, odabrane tarife, uređaji, dostava, plaćanje
- Vizualna potvrda korisniku da AI "razumije" — gradi povjerenje

---

## 2. Tok razgovora (AI orchestration)

Snježana ima jasan **system prompt** koji ju vodi kroz iste korake kao postojeći flow:

1. **Pozdrav + identifikacija** — "Jeste li već A1 poslovni korisnik ili novi klijent?"
2. **Ako postojeći** → tool `request_login` (otvara postojeći AuthModal kroz custom event, AI čeka rezultat)
3. **Ako novi** → pita OIB → tool `verify_oib`
4. **Potrebe** — broj linija, broj uređaja, koliko zaposlenika putuje, koliko podataka treba
5. **Preporuka tarife** — tool `recommend_tariff` analizira potrebe i predlaže s objašnjenjem
6. **Uređaji** — pita treba li uređaj, za koga (iOS/Android), budžet → tool `recommend_devices`
7. **Per-liniju konfiguracija** — tip linije (nova/MNP/pre2post), eSIM/fizička, porting podaci
8. **Sažetak** — prikaže "Live narudžbu", pita za potvrdu
9. **Verifikacija** (za nove) — ovlaštena osoba: ime, OIB, kontakt
10. **Dostava** — A1 centar ili pošta
11. **Plaćanje** — račun ili kartica
12. **Finalizacija** — tool `submit_order` pokreće postojeći Step7OrderProcessing tijek

AI uvijek mora moći **preskočiti naprijed/nazad** ako korisnik kaže "promijeni mi tarifu" ili "dodaj još jednu liniju".

---

## 3. Backend / AI sloj

### 3.1 Lovable Cloud edge funkcija `chat-with-snjezana`
- Koristi Lovable AI Gateway (`google/gemini-3-flash-preview` kao default — brz i jeftin za chat)
- `streamText` + `toUIMessageStreamResponse`
- Šalje cijelu povijest razgovora svaki put
- System prompt sadrži: persona Snježane, katalog tarifa/uređaja, business rules, korake flow-a

### 3.2 AI Tools (AI SDK `tool()` s Zod schemom)

| Tool | Što radi |
|---|---|
| `verify_oib` | MOD 11,10 validacija + (mock) registar lookup |
| `request_login` | Šalje event frontendu da otvori AuthModal, čeka rezultat |
| `list_tariffs` | Vraća katalog tarifa s cijenama |
| `recommend_tariff` | Na temelju potreba korisnika preporuči konkretnu tarifu + obrazloženje |
| `list_devices` | Vraća uređaje (filtriranje po brendu/budžetu) |
| `recommend_devices` | Preporuka uređaja |
| `update_order_draft` | Ažurira "Live narudžba" panel (Zustand store) |
| `calculate_total` | Mjesečno + jednokratno + wallet odbitak |
| `submit_order` | **needsApproval: true** — pokreće finalizaciju, korisnik mora kliknuti potvrdu |

Sve tool execution dešava se serverski osim `request_login` i `submit_order` koji emitiraju eventove na frontend.

### 3.3 Edge funkcija `elevenlabs-stt-token`
- Generira single-use token za ElevenLabs realtime transcription (`scribe_v2_realtime`)
- Klijent koristi `@elevenlabs/react` `useScribe` hook za diktiranje
- Token traje 15 min, generira se po potrebi

### 3.4 (Opcionalno) Edge funkcija `elevenlabs-tts`
- Snježanini odgovori se mogu čitati naglas (hr ženski glas)
- Streaming audio response

---

## 4. State management

Zustand store `useOrderDraft`:
```
{ customerType, oib, companyName, lines[], delivery, payment, totals }
```

- AI tools pišu u ovaj store
- Sidecar "Live narudžba" čita iz njega
- Na `submit_order` se mapira u postojeći `Step7OrderProcessing` payload — tako reusamo cijelu postojeću logiku finalizacije bez duplikacije

---

## 5. Integracija s postojećim flow-om

**Bez duplikacije logike:**
- AuthModal, OIBModal, Step7OrderProcessing — sve se reusa
- `verify_oib` tool koristi isti `validateOIB()` helper
- Katalog dolazi iz `src/data/catalog.ts` (single source of truth)
- Konačna narudžba ide kroz isti `OrderProcessingState` flow (credit check → payment → success)

**Custom eventovi za bridge:**
- `snjezana:open-auth` → otvara AuthModal
- `snjezana:auth-result` → AI dobiva rezultat
- `snjezana:finalize-order` → mounta Step7 s pred-popunjenim podacima

---

## 6. Tehnički detalji

```text
Stack:
- AI SDK (ai, @ai-sdk/openai-compatible) za chat + tools
- Lovable AI Gateway provider helper
- AI Elements (conversation, message, prompt-input, tool, shimmer)
- @elevenlabs/react za STT (i opcionalno TTS)
- Zustand za order draft state
- Lovable Cloud edge funkcije (chat, stt-token)
- Tajne: LOVABLE_API_KEY (auto), ELEVENLABS_API_KEY (treba dodati)
```

```text
Novi fajlovi:
- src/components/snjezana/SnjezanaFab.tsx
- src/components/snjezana/SnjezanaModal.tsx
- src/components/snjezana/SnjezanaAvatar.tsx
- src/components/snjezana/LiveOrderPanel.tsx
- src/components/snjezana/VoiceInput.tsx
- src/stores/useOrderDraft.ts
- src/lib/snjezana-tools.ts (frontend event bridge)
- supabase/functions/chat-with-snjezana/index.ts
- supabase/functions/elevenlabs-stt-token/index.ts
- supabase/functions/_shared/ai-gateway.ts
- src/assets/snjezana-avatar.png (generirano)
```

```text
Izmjene:
- src/App.tsx → mount <SnjezanaFab /> globalno
- src/components/steps/Step7OrderProcessing.tsx → prihvati pred-popunjene podatke iz storea
```

---

## 7. Što ću pitati prije implementacije

1. **Glasovni izlaz (TTS):** treba li Snježana i govoriti, ili samo slušati korisnika i odgovarati tekstom? (TTS ima dodatne troškove)
2. **Persistencija razgovora:** treba li čuvati povijest razgovora po korisniku u bazi, ili samo u sessionu (localStorage)?
3. **Avatar:** statična slika ili animirani avatar (npr. lottie ili D-ID-style — puno kompleksnije)?

---

## 8. Faze isporuke

| Faza | Sadržaj |
|---|---|
| **MVP** | FAB, modal, chat (samo tekst), tools za OIB/tarife/uređaje, live order panel, mock submit |
| **V2** | ElevenLabs STT (glasovni unos), integracija s postojećim AuthModal, pravi `submit_order` kroz Step7 |
| **V3** | TTS, predaja ljudskom agentu (mock), perzistencija razgovora, analytics |

MVP fokus: dokazati da AI može voditi korisnika kroz cijeli flow tekstom i kreirati validnu narudžbu. Glas i TTS dolaze u V2.
