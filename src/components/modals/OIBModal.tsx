import { useState } from "react";
import { motion } from "framer-motion";
import { X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OIBModalProps = {
  onClose: () => void;
  onSubmit: (oib: string) => void;
};

export function OIBModal({ onClose, onSubmit }: OIBModalProps) {
  const [oib, setOib] = useState("");
  const [error, setError] = useState("");

  const validateOIB = (value: string): boolean => {
    // OIB must be exactly 11 digits
    if (!/^\d{11}$/.test(value)) {
      return false;
    }

    // MOD 11,10 algorithm for Croatian OIB validation
    let remainder = 10;
    
    for (let i = 0; i < 10; i++) {
      const digit = parseInt(value[i], 10);
      remainder = remainder + digit;
      remainder = remainder % 10;
      if (remainder === 0) {
        remainder = 10;
      }
      remainder = remainder * 2;
      remainder = remainder % 11;
    }

    let controlDigit = 11 - remainder;
    if (controlDigit === 10) {
      controlDigit = 0;
    }

    const lastDigit = parseInt(value[10], 10);
    return controlDigit === lastDigit;
  };

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
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
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
              <h2 className="text-xl font-bold">Podaci o tvrtki</h2>
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
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Odustani
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
          >
            Nastavi
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
