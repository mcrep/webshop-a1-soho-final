import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type SimTypeModalProps = {
  open: boolean;
  currentType: "esim" | "physical";
  onSelect: (type: "esim" | "physical") => void;
  onClose: () => void;
};

export function SimTypeModal({ open, currentType, onSelect, onClose }: SimTypeModalProps) {
  const isEsim = currentType === "esim";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 px-6 py-5 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Vrsta SIM kartice</h2>
                  <p className="text-sm opacity-90">Odaberi fizičku ili eSIM karticu</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="font-semibold text-foreground">
                    {isEsim ? "eSIM aktiviran" : "Fizička SIM kartica"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isEsim ? "Digitalna SIM kartica" : "Klasična SIM kartica"}
                  </p>
                </div>
                <Switch
                  checked={isEsim}
                  onCheckedChange={(checked) => onSelect(checked ? "esim" : "physical")}
                />
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border-2 transition-colors ${isEsim ? "border-primary bg-primary/5" : "border-border"}`}>
                  <h3 className="font-semibold text-foreground mb-1">eSIM</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Digitalna SIM kartica ugrađena u uređaj</li>
                    <li>• Aktivacija putem QR koda — bez čekanja dostave</li>
                    <li>• Mogućnost korištenja dual SIM-a</li>
                    <li>• Podržana na novijim uređajima (iPhone, Samsung, Pixel)</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border-2 transition-colors ${!isEsim ? "border-primary bg-primary/5" : "border-border"}`}>
                  <h3 className="font-semibold text-foreground mb-1">Fizička SIM kartica</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Klasična nano/micro SIM kartica</li>
                    <li>• Dostava poštom ili preuzimanje u A1 centru</li>
                    <li>• Kompatibilna sa svim uređajima</li>
                    <li>• Jednostavno prebacivanje između uređaja</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Potvrdi
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
