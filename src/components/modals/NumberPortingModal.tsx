import { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [portingNumberType, setPortingNumberType] = useState<"prepaid" | "postpaid">(
    current.portingNumberType || "prepaid"
  );
  const [portingCustomerType, setPortingCustomerType] = useState<"business" | "private">(
    current.portingCustomerType || "private"
  );
  const [portingCustomerName, setPortingCustomerName] = useState(current.portingCustomerName || "");
  const [portingOib, setPortingOib] = useState(current.portingOib || "");
  const [portingAddress, setPortingAddress] = useState(current.portingAddress || "");
  const [portingContactNumber, setPortingContactNumber] = useState(current.portingContactNumber || "");
  const [portingStartDate, setPortingStartDate] = useState<Date | undefined>(
    current.portingStartDate
  );
  const [portingFromNetwork, setPortingFromNetwork] = useState<"ht" | "telemach" | "">(
    current.portingFromNetwork || ""
  );
  const [portingTime, setPortingTime] = useState<"morning" | "afternoon">(
    current.portingTime || "morning"
  );

  const handleSave = () => {
    onSave({
      portingNumber,
      portingNumberType,
      portingCustomerType,
      portingCustomerName,
      portingOib,
      portingAddress,
      portingContactNumber,
      portingStartDate,
      portingFromNetwork: portingFromNetwork as "ht" | "telemach",
      portingTime,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <h2 className="text-xl font-semibold">Prijenos broja s druge mreže</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Zatvori"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Broj koji se prenosi */}
          <div className="space-y-2">
            <Label htmlFor="portingNumber">Broj koji se prenosi</Label>
            <Input
              id="portingNumber"
              value={portingNumber}
              onChange={(e) => setPortingNumber(e.target.value)}
              placeholder="Unesite broj"
            />
          </div>

          {/* Vrsta broja */}
          <div className="space-y-2">
            <Label>Vrsta broja koji se prenosi</Label>
            <Select value={portingNumberType} onValueChange={(v) => setPortingNumberType(v as "prepaid" | "postpaid")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prepaid">Prepaid</SelectItem>
                <SelectItem value="postpaid">Postpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tip korisnika */}
          <div className="space-y-2">
            <Label>Tip korisnika</Label>
            <RadioGroup value={portingCustomerType} onValueChange={(v) => setPortingCustomerType(v as "business" | "private")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business" className="cursor-pointer font-normal">Poslovni</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="cursor-pointer font-normal">Privatni</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Naziv korisnika */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Naziv korisnika</Label>
            <Input
              id="customerName"
              value={portingCustomerName}
              onChange={(e) => setPortingCustomerName(e.target.value)}
              placeholder="Ime i prezime / Naziv tvrtke"
            />
          </div>

          {/* OIB */}
          <div className="space-y-2">
            <Label htmlFor="oib">OIB korisnika</Label>
            <Input
              id="oib"
              value={portingOib}
              onChange={(e) => setPortingOib(e.target.value)}
              placeholder="Unesite OIB"
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
              placeholder="Ulica i broj, Grad"
            />
          </div>

          {/* Kontakt broj */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Kontakt broj</Label>
            <Input
              id="contactNumber"
              value={portingContactNumber}
              onChange={(e) => setPortingContactNumber(e.target.value)}
              placeholder="Unesite kontakt broj"
            />
          </div>

          {/* Datum početka prijenosa */}
          <div className="space-y-2">
            <Label>Datum početka prijenosa</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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

          {/* S koje mreže */}
          <div className="space-y-2">
            <Label>S koje mreže se broj prenosi</Label>
            <Select value={portingFromNetwork} onValueChange={(v) => setPortingFromNetwork(v as "ht" | "telemach")}>
              <SelectTrigger>
                <SelectValue placeholder="Odaberite mrežu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ht">Hrvatski Telekom</SelectItem>
                <SelectItem value="telemach">Telemach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vrijeme prijenosa */}
          <div className="space-y-2">
            <Label>Vrijeme prijenosa</Label>
            <RadioGroup value={portingTime} onValueChange={(v) => setPortingTime(v as "morning" | "afternoon")}>
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

        <div className="bg-card border-t border-border px-6 py-4 flex gap-3 justify-end rounded-b-2xl flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Odustani
          </Button>
          <Button onClick={handleSave}>
            Spremi
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
