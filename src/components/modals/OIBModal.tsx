import { useState } from "react";
import { motion } from "framer-motion";
import { X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateOIB } from "@/lib/utils";

type OIBModalProps = {
  onClose: () => void;
  onSubmit: (oib: string) => void;
};

export function OIBModal({ onClose, onSubmit }: OIBModalProps) {
  const [oib, setOib] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!oib.trim()) {
      setError("OIB je obavezan");
      return;
    }
    if (oib.length !== 11) {
      setError("OIB mora sadržavati točno 11 znamenki");
      return;
    }
    if (!validateOIB(oib)) {
      setError("Uneseni OIB nije ispravan");
      return;
    }
    setError("");
    onSubmit(oib);
  };

  const handleOIBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setOib(value);
    if (error) setError("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Želite li personaliziranu ponudu?</h2>
              <p className="text-sm opacity-90">Novi poslovni korisnik</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Kako bismo vam mogli ponuditi najbolju poslovnu ponudu prilagođenu vašim potrebama, 
            molimo vas da unesete OIB vašeg poslovnog subjekta.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="oib" className="block text-sm font-medium mb-2">
                OIB poslovnog subjekta
              </label>
              <Input
                id="oib"
                type="text"
                placeholder="Unesite 11-znamenkasti OIB"
                value={oib}
                onChange={handleOIBChange}
                className={error ? "border-destructive" : ""}
                maxLength={11}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={onClose}
          >
            Ne želim personaliziranu ponudu
          </Button>
          <Button
            className="flex-1 text-sm"
            onClick={handleSubmit}
          >
            Želim personaliziranu ponudu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
