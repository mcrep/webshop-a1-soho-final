import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { Line } from "@/types";

type PrepaidToPostpaidModalProps = {
  current: Line;
  onClose: () => void;
  onSave: (data: Partial<Line>) => void;
};

export function PrepaidToPostpaidModal({ current, onClose, onSave }: PrepaidToPostpaidModalProps) {
  const [prepaidNumber, setPrepaidNumber] = useState(current.prepaidNumber || "");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

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

  const handleSendOtp = () => {
    // Simulate sending OTP
    setStep("otp");
    setOtpCode("");
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      onSave({ prepaidNumber });
      onClose();
    }, 800);
  };

  const handleBack = () => {
    setStep("phone");
    setOtpCode("");
  };

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [step]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otpCode.length === 6) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const isPhoneValid = prepaidNumber.length >= 8;

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
          {step === "otp" && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Natrag"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
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
              <p className="text-sm opacity-90">
                {step === "phone" 
                  ? "Prebacite prepaid broj na pretplatu" 
                  : "Potvrdite vlasništvo broja"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[200px]">
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
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
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Poslali smo SMS s kodom na broj
                  </p>
                  <p className="font-semibold text-lg">
                    +385 {formatPhoneDisplay(prepaidNumber)}
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-center">Unesite 6-znamenkasti kod</Label>
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={setOtpCode}
                    ref={otpInputRef}
                    disabled={isVerifying}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      // Simulate resend
                      setOtpCode("");
                    }}
                  >
                    Pošalji kod ponovno
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={step === "otp" ? handleBack : onClose}
          >
            {step === "otp" ? "Natrag" : "Odustani"}
          </Button>
          {step === "phone" && (
            <Button
              className="flex-1"
              onClick={handleSendOtp}
              disabled={!isPhoneValid}
            >
              Pošalji kod
            </Button>
          )}
          {step === "otp" && (
            <Button
              className="flex-1"
              onClick={handleVerifyOtp}
              disabled={otpCode.length !== 6 || isVerifying}
            >
              {isVerifying ? "Provjeravam..." : "Potvrdi"}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
