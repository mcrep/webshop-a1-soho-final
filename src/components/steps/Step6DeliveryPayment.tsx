import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [street, setStreet] = useState(deliveryData?.postalAddress?.street || "");
  const [city, setCity] = useState(deliveryData?.postalAddress?.city || "");
  const [postalCode, setPostalCode] = useState(deliveryData?.postalAddress?.postalCode || "");
  const [paymentMethod, setPaymentMethod] = useState<"invoice" | "card">(
    paymentData?.method || "invoice"
  );

  useEffect(() => {
    if (street && city && postalCode) {
      onUpdateDelivery({
        method: "postal",
        postalAddress: {
          street,
          city,
          postalCode,
        },
      });
    }
  }, [street, city, postalCode, onUpdateDelivery]);

  useEffect(() => {
    onUpdatePayment({
      method: paymentMethod,
    });
  }, [paymentMethod, onUpdatePayment]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Isporuka i plaćanje</h2>
        <p className="text-muted-foreground">Unesite adresu za isporuku i odaberite način plaćanja</p>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Isporuka poštom</h3>
        <div className="space-y-4">
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
