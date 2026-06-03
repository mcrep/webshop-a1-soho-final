import { useState } from "react";
import { motion } from "framer-motion";
import { X, Phone, Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Line } from "@/types";

type NumberPortingModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (data: Partial<Line>) => void;
};

export function NumberPortingModal({ current, onClose, onSave }: NumberPortingModalProps) {
  const [portingNumber, setPortingNumber] = useState(current.portingNumber || "");
  const [portingCustomerName, setPortingCustomerName] = useState(current.portingCustomerName || "");
  const [portingOib, setPortingOib] = useState(current.portingOib || "");
  const [portingAddress, setPortingAddress] = useState(current.portingAddress || "");
  const [portingContactNumber, setPortingContactNumber] = useState(current.portingContactNumber || "");
  const [portingStartDate, setPortingStartDate] = useState<Date | undefined>(
    current.portingStartDate
  );
  const [portingTime, setPortingTime] = useState<"morning" | "afternoon">(
    current.portingTime || "morning"
  );

  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  };

  const handlePhoneChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 9);
    setter(rawValue);
  };

  const handleSave = () => {
    onSave({
      portingNumber,
      portingNumberType: "postpaid",
      portingCustomerType: "business",
      portingCustomerName,
      portingOib,
      portingAddress,
      portingContactNumber,
      portingStartDate,
      portingTime,
    });
    onClose();
  };

  const isValid = portingNumber.length >= 8;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prijenos broja</h2>
              <p className="text-sm opacity-90">Prenesite broj s druge mreže na A1</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="portingNumber">Broj koji se prenosi *</Label>
            <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
              <span className="pl-3 pr-1 text-muted-foreground select-none">+385</span>
              <input
                id="portingNumber"
                value={formatPhoneDisplay(portingNumber)}
                onChange={handlePhoneChange(setPortingNumber)}
                inputMode="tel"
                className="flex-1 p-3 pl-1 bg-transparent outline-none"
                placeholder="9X XXX XXXX"
              />
            </div>
          </div>

          {/* Datum i vrijeme prijenosa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Datum početka prijenosa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl",
                      !portingStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {portingStartDate ? format(portingStartDate, "dd.MM.yyyy") : "Odaberite datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={portingStartDate}
                    onSelect={setPortingStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Vrijeme prijenosa</Label>
              <RadioGroup 
                value={portingTime} 
                onValueChange={(v) => setPortingTime(v as "morning" | "afternoon")}
                className="flex gap-4 h-10 items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning" className="cursor-pointer font-normal">Ujutro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon" className="cursor-pointer font-normal">Popodne</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Kontakt broj */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Kontakt broj</Label>
            <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
              <span className="pl-3 pr-1 text-muted-foreground select-none">+385</span>
              <input
                id="contactNumber"
                value={formatPhoneDisplay(portingContactNumber)}
                onChange={handlePhoneChange(setPortingContactNumber)}
                inputMode="tel"
                className="flex-1 p-3 pl-1 bg-transparent outline-none"
                placeholder="9X XXX XXXX"
              />
            </div>
          </div>

          {/* Naziv tvrtke */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Naziv tvrtke</Label>
            <Input
              id="customerName"
              value={portingCustomerName}
              onChange={(e) => setPortingCustomerName(e.target.value)}
              placeholder="Naziv tvrtke d.o.o."
              className="rounded-xl"
            />
          </div>

          {/* OIB */}
          <div className="space-y-2">
            <Label htmlFor="oib">OIB korisnika</Label>
            <Input
              id="oib"
              value={portingOib}
              onChange={(e) => setPortingOib(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="12345678901"
              className="rounded-xl"
              maxLength={11}
            />
          </div>

          {/* Adresa */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresa</Label>
            <Input
              id="address"
              value={portingAddress}
              onChange={(e) => setPortingAddress(e.target.value)}
              placeholder="Ulica i kućni broj, Poštanski broj Grad"
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3 shrink-0 border-t border-border bg-card">
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
