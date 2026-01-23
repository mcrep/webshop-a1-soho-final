import { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeftRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Line } from "@/types";

type PrepaidToPostpaidModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (data: Partial<Line>) => void;
};

export function PrepaidToPostpaidModal({ current, onClose, onSave }: PrepaidToPostpaidModalProps) {
  const [prepaidNumber, setPrepaidNumber] = useState(current.prepaidNumber || "");

  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPrepaidNumber(rawValue);
  };

  const handleSave = () => {
    onSave({ prepaidNumber });
    onClose();
  };

  const isValid = prepaidNumber.length >= 8;

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
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prelazak s bonova</h2>
              <p className="text-sm opacity-90">Prebacite prepaid broj na pretplatu</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Unesite broj koji se trenutno nalazi na A1 ili Tomato bonovima kako biste ga prebacili na pretplatu.
          </p>

          <div className="space-y-2">
            <Label htmlFor="prepaidNumber">Broj na bonovima</Label>
            <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
              <span className="pl-3 pr-1 text-muted-foreground select-none">+385</span>
              <input
                id="prepaidNumber"
                value={formatPhoneDisplay(prepaidNumber)}
                onChange={handlePhoneChange}
                inputMode="tel"
                className="flex-1 p-3 pl-1 bg-transparent outline-none"
                placeholder="9X XXX XXXX"
              />
            </div>
            {prepaidNumber.length > 0 && prepaidNumber.length < 8 && (
              <p className="text-sm text-destructive">Minimalno 8 znamenki.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Odustani
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!isValid}
          >
            Spremi
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
