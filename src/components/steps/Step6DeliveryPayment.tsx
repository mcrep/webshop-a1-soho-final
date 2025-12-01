import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { a1Centers } from "@/data/a1-centers";
import type { DeliveryData, PaymentData } from "@/types";

type Step6DeliveryPaymentProps = {
  deliveryData: DeliveryData | null;
  paymentData: PaymentData | null;
  onUpdateDelivery: (data: DeliveryData) => void;
  onUpdatePayment: (data: PaymentData) => void;
};

export function Step6DeliveryPayment({
  deliveryData,
  paymentData,
  onUpdateDelivery,
  onUpdatePayment,
}: Step6DeliveryPaymentProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<"a1-center" | "postal">(
    deliveryData?.method || "a1-center"
  );
  const [selectedCenter, setSelectedCenter] = useState(deliveryData?.a1CenterId || "");
  const [street, setStreet] = useState(deliveryData?.postalAddress?.street || "");
  const [city, setCity] = useState(deliveryData?.postalAddress?.city || "");
  const [postalCode, setPostalCode] = useState(deliveryData?.postalAddress?.postalCode || "");
  const [paymentMethod, setPaymentMethod] = useState<"invoice" | "card">(
    paymentData?.method || "invoice"
  );

  useEffect(() => {
    if (deliveryMethod === "a1-center" && selectedCenter) {
      onUpdateDelivery({
        method: "a1-center",
        a1CenterId: selectedCenter,
      });
    } else if (deliveryMethod === "postal" && street && city && postalCode) {
      onUpdateDelivery({
        method: "postal",
        postalAddress: {
          street,
          city,
          postalCode,
        },
      });
    }
  }, [deliveryMethod, selectedCenter, street, city, postalCode, onUpdateDelivery]);

  useEffect(() => {
    onUpdatePayment({
      method: paymentMethod,
    });
  }, [paymentMethod, onUpdatePayment]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Isporuka i plaćanje</h2>
        <p className="text-muted-foreground">Odaberite način isporuke i plaćanja</p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Način isporuke</h3>
        <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as "a1-center" | "postal")}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="a1-center" id="a1-center" />
              <Label htmlFor="a1-center" className="cursor-pointer flex-1">
                Isporuka u A1 centru
              </Label>
            </div>
            {deliveryMethod === "a1-center" && (
              <div className="ml-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="center-select">Odaberite A1 centar</Label>
                <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                  <SelectTrigger id="center-select" className="w-full mt-2">
                    <SelectValue placeholder="Odaberite lokaciju" />
                  </SelectTrigger>
                  <SelectContent>
                    {a1Centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name} - {center.address}, {center.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="postal" id="postal" />
              <Label htmlFor="postal" className="cursor-pointer flex-1">
                Isporuka poštom
              </Label>
            </div>
            {deliveryMethod === "postal" && (
              <div className="ml-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <Label htmlFor="street">Ulica i kućni broj *</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ulica i kućni broj"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Grad *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Grad"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal-code">Poštanski broj *</Label>
                    <Input
                      id="postal-code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="10000"
                      maxLength={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Način plaćanja</h3>
        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "invoice" | "card")}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="invoice" id="invoice" />
              <Label htmlFor="invoice" className="cursor-pointer flex-1">
                Plaćanje po predračunu
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="cursor-pointer flex-1">
                Kartično plaćanje
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
}
