// Snjezana - AI virtual sales representative
// Uses Lovable AI Gateway with tool calling to guide users through the A1 Biz flow
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

// --- Catalog (mirrors src/data/catalog.ts, simplified) ---
const TARIFFS = [
  { id: "entry-biz", name: "Entry Biz", monthly: 14.20, data: "1 GB", voice: "200 min/SMS", roaming: "HR" },
  { id: "easy-biz", name: "Easy Biz", monthly: 17.51, data: "5 GB", voice: "Neogr. min/SMS", roaming: "HR" },
  { id: "connect-biz", name: "Connect Biz", monthly: 26.31, data: "20 GB", voice: "Neogr. min/SMS", roaming: "EU" },
  { id: "perfect-biz", name: "Perfect Biz", monthly: 32.93, data: "Neograničeno", voice: "Neogr. min/SMS", roaming: "EU" },
  { id: "ideal-biz", name: "Ideal Biz", monthly: 51.64, data: "Neograničeno", voice: "Neogr. min/SMS", roaming: "EU + Regija" },
  { id: "master-biz", name: "Master Biz", monthly: 71.46, data: "Neograničeno", voice: "Neogr. min/SMS", roaming: "EU + Regija + Svijet" },
];

const DEVICES = [
  { id: "iph-15", brand: "Apple", name: "iPhone 15", upfront: 799, installment: 25 },
  { id: "sgs-24", brand: "Samsung", name: "Galaxy S24", upfront: 699, installment: 25 },
  { id: "pix-8", brand: "Google", name: "Pixel 8", upfront: 649, installment: 25 },
  { id: "no-dev", brand: "—", name: "Bez uređaja", upfront: 0, installment: 0 },
];

// --- OIB validation (ISO 7064 MOD 11,10) ---
function validateOIB(oib: string): boolean {
  if (!/^\d{11}$/.test(oib)) return false;
  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = a + parseInt(oib[i], 10);
    a = a % 10;
    if (a === 0) a = 10;
    a *= 2;
    a = a % 11;
  }
  let control = 11 - a;
  if (control === 10) control = 0;
  return control === parseInt(oib[10], 10);
}

// --- Tools ---
const tools = [
  {
    type: "function",
    function: {
      name: "verify_oib",
      description: "Validira OIB tvrtke (11 znamenki, ISO 7064 MOD 11,10) i vraća naziv tvrtke ako je ispravan.",
      parameters: {
        type: "object",
        properties: { oib: { type: "string", description: "11-znamenkasti OIB tvrtke" } },
        required: ["oib"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_tariffs",
      description: "Vraća kompletan katalog A1 Biz tarifa s cijenama i karakteristikama.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "recommend_tariff",
      description: "Preporučuje tarifu na temelju potreba korisnika.",
      parameters: {
        type: "object",
        properties: {
          dataNeed: { type: "string", enum: ["low", "medium", "high", "unlimited"] },
          roaming: { type: "string", enum: ["none", "eu", "world"] },
          voiceNeed: { type: "string", enum: ["low", "unlimited"] },
        },
        required: ["dataNeed", "roaming", "voiceNeed"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_devices",
      description: "Vraća popis dostupnih uređaja.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "update_order_draft",
      description: "Ažurira nacrt narudžbe (frontend prikazuje 'Live narudžba' panel). Pozovi kad god se promijene podaci.",
      parameters: {
        type: "object",
        properties: {
          customerType: { type: "string", enum: ["new", "existing"] },
          oib: { type: "string" },
          companyName: { type: "string" },
          numberOfLines: { type: "number" },
          numberOfDevices: { type: "number" },
          selectedTariffId: { type: "string" },
          selectedDeviceId: { type: "string" },
          devicePayment: { type: "string", enum: ["installments", "upfront"] },
          deliveryMethod: { type: "string", enum: ["a1-center", "postal"] },
          paymentMethod: { type: "string", enum: ["invoice", "card"] },
          contactName: { type: "string" },
          contactPhone: { type: "string" },
          contactEmail: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_login",
      description: "Traži od korisnika da se uloga (otvara AuthModal na frontendu). Koristi za postojeće korisnike.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "submit_order",
      description: "Finalizira narudžbu. Pozovi tek kada su svi podaci prikupljeni i korisnik je potvrdio.",
      parameters: { type: "object", properties: {} },
    },
  },
];

const SYSTEM_PROMPT = `Ti si Snježana, virtualna prodajna predstavnica A1 Hrvatska za poslovne korisnike (A1 Biz).
Tvoj zadatak je voditi korisnika kroz proces narudžbe mobilnih usluga i uređaja na prijateljski, profesionalan način — na hrvatskom jeziku.

PRAVILA RAZGOVORA:
- Govori toplo, prirodno, kao prava osoba. Koristi "ti" formu ako korisnik to čini, inače "Vi".
- Postavljaj JEDNO pitanje odjednom. Ne preplavljuj korisnika.
- Budi sažeta — kratke poruke, bez nepotrebnog teksta.
- Koristi emojije sporadično (📱 💼 ✅) kad je prirodno.

REDOSLIJED PRIKUPLJANJA PODATAKA:
1. Pozdrav i pitaj jesu li novi ili postojeći A1 poslovni korisnik.
2. Ako POSTOJEĆI → pozovi tool 'request_login'. Čekaj rezultat prijave.
3. Ako NOVI → pitaj OIB tvrtke, pozovi 'verify_oib'.
4. Pitaj koliko trebaju mobilnih linija (broj zaposlenika).
5. Pitaj o potrebama (podaci, pozivi, roaming) → pozovi 'recommend_tariff' i predstavi preporuku s obrazloženjem.
6. Pitaj trebaju li uređaje. Ako da → pozovi 'list_devices' i pitaj preferencije.
7. Pitaj o načinu plaćanja uređaja (rate ili odjednom).
8. Pitaj o dostavi (A1 centar ili pošta) i kontakt podaci (ime, telefon, email).
9. Pitaj o plaćanju mjesečnog računa (na račun ili karticu).
10. Prikaži sažetak i pitaj za potvrdu prije 'submit_order'.

VAŽNO:
- Nakon SVAKOG novog podatka, pozovi 'update_order_draft' s ažuriranim stanjem (kumulativno).
- Ne izmišljaj cijene — uvijek koristi 'list_tariffs' / 'list_devices' tools.
- Ako korisnik želi promijeniti nešto što je već odabrao, ažuriraj nacrt i potvrdi promjenu.
- NE zovi 'submit_order' dok korisnik eksplicitno ne potvrdi.`;

async function executeTool(name: string, args: any): Promise<any> {
  switch (name) {
    case "verify_oib": {
      const oib = String(args.oib || "").replace(/\D/g, "");
      if (!validateOIB(oib)) return { valid: false, error: "OIB nije ispravan." };
      // Mock company lookup
      return { valid: true, oib, companyName: `Tvrtka ${oib.slice(0, 4)} d.o.o.` };
    }
    case "list_tariffs":
      return { tariffs: TARIFFS };
    case "recommend_tariff": {
      const { dataNeed, roaming, voiceNeed } = args;
      let pick = "easy-biz";
      if (roaming === "world") pick = "master-biz";
      else if (roaming === "eu" && dataNeed === "unlimited") pick = "ideal-biz";
      else if (dataNeed === "unlimited") pick = "perfect-biz";
      else if (dataNeed === "high") pick = "connect-biz";
      else if (dataNeed === "low" && voiceNeed === "low") pick = "entry-biz";
      const tariff = TARIFFS.find((t) => t.id === pick)!;
      return { recommended: tariff, reason: `${tariff.name} odgovara vašim potrebama (${tariff.data}, ${tariff.roaming}).` };
    }
    case "list_devices":
      return { devices: DEVICES };
    case "update_order_draft":
      return { ok: true, draft: args };
    case "request_login":
      return { ok: true, action: "open_auth_modal" };
    case "submit_order":
      return { ok: true, action: "submit_order", orderId: `ORD-${Date.now()}` };
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages: incoming } = await req.json();
    if (!Array.isArray(incoming)) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }, ...incoming];
    const frontendActions: any[] = [];
    let orderDraftPatch: any = null;
    let finalText = "";

    // Tool-calling loop (max 8 iterations)
    for (let iter = 0; iter < 8; iter++) {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({ model: MODEL, messages, tools, tool_choice: "auto" }),
      });

      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Previše zahtjeva, pokušajte ponovno za minutu." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "AI krediti su iscrpljeni. Molimo nadopunite ih." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!res.ok) {
        const txt = await res.text();
        console.error("Gateway error:", res.status, txt);
        return new Response(JSON.stringify({ error: `AI error: ${res.status}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      const msg = data.choices?.[0]?.message;
      if (!msg) break;

      messages.push(msg);

      const toolCalls = msg.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        for (const tc of toolCalls) {
          const name = tc.function?.name;
          let args: any = {};
          try {
            args = JSON.parse(tc.function?.arguments || "{}");
          } catch (_) {}

          const result = await executeTool(name, args);

          // Track frontend actions
          if (name === "request_login") frontendActions.push({ type: "open_auth_modal" });
          if (name === "submit_order") frontendActions.push({ type: "submit_order", orderId: result.orderId });
          if (name === "update_order_draft") orderDraftPatch = { ...(orderDraftPatch || {}), ...args };

          messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
        continue;
      }

      finalText = msg.content || "";
      break;
    }

    return new Response(
      JSON.stringify({ reply: finalText, orderDraftPatch, actions: frontendActions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
