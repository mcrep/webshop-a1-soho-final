import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, Loader2 } from "lucide-react";
import snjezanaAvatar from "@/assets/snjezana-avatar.jpg";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useOrderDraft, type OrderDraft } from "@/stores/useOrderDraft";
import { LiveOrderPanel } from "./LiveOrderPanel";
import { toast } from "sonner";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Bok! Ja sam Snježana, vaša virtualna prodajna predstavnica iz A1 Biz. 😊\n\nMogu vas brzo provesti kroz cijelu narudžbu mobilnih usluga. Za početak — jeste li **novi** korisnik ili već imate A1 poslovne usluge?";

type Props = { open: boolean; onClose: () => void };

export function SnjezanaModal({ open, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { draft, patch, reset } = useOrderDraft();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-snjezana", {
        body: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      const reply = data?.reply || "Žao mi je, došlo je do greške. Pokušajmo ponovno.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);

      if (data?.orderDraftPatch) {
        patch(data.orderDraftPatch as Partial<OrderDraft>);
      }

      if (Array.isArray(data?.actions)) {
        for (const action of data.actions) {
          if (action.type === "open_auth_modal") {
            toast.info("Snježana traži prijavu — otvorite postojeću prijavu kroz aplikaciju.");
          }
          if (action.type === "submit_order") {
            toast.success(`Narudžba poslana! (${action.orderId})`);
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Greška u komunikaciji sa Snježanom.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleReset() {
    setMessages([{ role: "assistant", content: GREETING }]);
    reset();
    toast.info("Razgovor je resetiran.");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl h-[85vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex"
          >
            {/* LEFT — Avatar panel */}
            <div className="hidden md:flex w-[40%] flex-col bg-gradient-to-br from-primary/10 via-card to-primary/5 border-r border-border">
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  animate={loading ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
                  className="relative"
                >
                  <div className="h-56 w-56 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
                    <img
                      src={snjezanaAvatar}
                      alt="Snježana - virtualna prodajna predstavnica"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-green-500 border-4 border-card" />
                </motion.div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">Snježana</h2>
                <p className="text-sm text-muted-foreground mt-1">Virtualna prodajna predstavnica</p>
                <p className="text-xs text-muted-foreground mt-0.5">A1 Biz</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> razmišlja...
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500" /> dostupna
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <LiveOrderPanel draft={draft} />
              </div>
            </div>

            {/* RIGHT — Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3 md:hidden">
                  <img
                    src={snjezanaAvatar}
                    alt="Snježana"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div>
                    <div className="font-semibold text-sm">Snježana</div>
                    <div className="text-xs text-muted-foreground">A1 Biz</div>
                  </div>
                </div>
                <div className="hidden md:block font-semibold">Razgovor sa Snježanom</div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleReset} title="Resetiraj razgovor">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Zatvori">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} />
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    Snježana tipka...
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex gap-2 items-end">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Napišite poruku..."
                    rows={2}
                    className="resize-none flex-1"
                    disabled={loading}
                  />
                  <Button onClick={send} disabled={!input.trim() || loading} size="icon" className="h-10 w-10 shrink-0">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  Snježana je AI asistent. Odgovori mogu sadržavati pogreške.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {formatMarkdownLite(content)}
      </div>
    </motion.div>
  );
}

// Minimal markdown: **bold**
function formatMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
