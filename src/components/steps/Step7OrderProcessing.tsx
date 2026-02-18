import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, CreditCard, Loader2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrderProcessingState } from "@/types";

type Step7Props = {
  state: OrderProcessingState;
  onAdjustOffer: () => void;
  onRetryPayment: () => void;
  onPayCard: () => void;
};

export function Step7OrderProcessing({ state, onAdjustOffer, onRetryPayment, onPayCard }: Step7Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const orderNumber = `A1-${Date.now().toString().slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {state === "credit-check" && (
          <motion.div
            key="credit-check"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 className="h-16 w-16 text-primary mx-auto" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Provjeravamo vašu narudžbu...</h2>
              <p className="text-muted-foreground">Molimo pričekajte dok obradimo vaš zahtjev</p>
            </div>
          </motion.div>
        )}

        {state === "credit-denied" && (
          <motion.div
            key="credit-denied"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 border-destructive/50 bg-destructive/5">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Nije moguće obraditi narudžbu</h2>
                <p className="text-muted-foreground">
                  Narudžbu nije moguće obraditi u trenutnoj konfiguraciji. Pokušajte prilagoditi ponudu — npr. promijeniti uređaj, tarifu ili način plaćanja.
                </p>
                <Button onClick={onAdjustOffer} className="w-full mt-4" size="lg">
                  Prilagodi ponudu
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {state === "card-payment" && (
          <motion.div
            key="card-payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Kartično plaćanje</h2>
                  <p className="text-muted-foreground mt-1">Unesite podatke vaše kartice</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Broj kartice</Label>
                    <Input
                      id="card-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19))}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-expiry">Datum isteka</Label>
                      <Input
                        id="card-expiry"
                        value={cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          setCardExpiry(v);
                        }}
                        placeholder="MM/GG"
                        className="mt-2"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input
                        id="card-cvv"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        className="mt-2"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onPayCard}
                  className="w-full"
                  size="lg"
                  disabled={cardNumber.replace(/\s/g, "").length < 16 || cardExpiry.length < 5 || cardCvv.length < 3}
                >
                  Plati
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {state === "payment-error" && (
          <motion.div
            key="payment-error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 border-destructive/50 bg-destructive/5">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold">Greška pri plaćanju</h2>
                <p className="text-muted-foreground">
                  Transakcija nije uspjela. Provjerite podatke kartice ili pokušajte s drugom karticom.
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <Button onClick={onRetryPayment} size="lg">
                    Pokušaj ponovo
                  </Button>
                  <Button onClick={onAdjustOffer} variant="outline" size="lg">
                    Prilagodi ponudu
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold">Vaša narudžba je zaprimljena!</h2>
                <p className="text-muted-foreground">
                  Broj narudžbe: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Potvrdni email s detaljima narudžbe bit će poslan na vašu email adresu. Hvala na povjerenju!
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
