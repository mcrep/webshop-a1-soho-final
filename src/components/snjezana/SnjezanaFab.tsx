import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import snjezanaAvatar from "@/assets/snjezana-avatar.jpg";
import { SnjezanaModal } from "./SnjezanaModal";

export function SnjezanaFab() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        <AnimatePresence>
          {showHint && !open && (
            <motion.button
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              onClick={() => {
                setShowHint(false);
                setOpen(true);
              }}
              className="mb-3 rounded-2xl bg-card border border-border shadow-lg px-4 py-3 text-sm max-w-[240px] text-left hover:bg-muted transition-colors"
            >
              <div className="font-semibold text-foreground mb-0.5">Bok, ja sam Snježana 👋</div>
              <div className="text-muted-foreground text-xs">
                Mogu vas provesti kroz cijelu narudžbu — samo kliknite.
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="relative h-16 w-16 rounded-full overflow-hidden shadow-xl ring-4 ring-primary/20 hover:ring-primary/40 transition-all"
          aria-label="Otvori chat sa Snježanom"
        >
          <img src={snjezanaAvatar} alt="Snježana" className="h-full w-full object-cover" />
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
          {!open && (
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/30"
            />
          )}
        </motion.button>
      </div>

      <SnjezanaModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
