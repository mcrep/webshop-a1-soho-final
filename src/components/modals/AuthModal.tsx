import { useState } from "react";
import { User, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type AuthModalProps = {
  onClose: () => void;
  onLoginSuccess: (identifier: string, type: "email" | "phone") => void;
};

type AuthView = "select" | "login" | "phone-input" | "otp";

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("select");
  
  // Login form state
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  
  // Phone/OTP state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return phone;
    const visible = phone.slice(-2);
    const hidden = phone.slice(0, -2).replace(/\d/g, "*");
    return hidden + visible;
  };

  const handleSelectLogin = () => {
    setView("login");
  };

  const handleSelectOTP = () => {
    setView("phone-input");
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 8 && phoneNumber.length <= 9) {
      setView("otp");
    }
  };

  const handleLoginSubmit = () => {
    if (user && pass) {
      onLoginSuccess(user, "email");
      onClose();
    }
  };

  const handleOTPSubmit = () => {
    if (code.length === 6) {
      onLoginSuccess(phoneNumber, "phone");
      onClose();
    }
  };

  const handleBack = () => {
    if (view === "otp") {
      setView("phone-input");
      setCode("");
    } else {
      setView("select");
      setUser("");
      setPass("");
      setPhoneNumber("");
      setCode("");
    }
  };

  const handleOTPChange = (i: number, val: string) => {
    const v = (val || "").replace(/\D/g, "").slice(0, 1);
    const chars = (code || "").split("");
    chars[i] = v;
    const next = chars.join("").slice(0, 6);
    setCode(next);
  };

  const handleOTPKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const prev = document.getElementById(`auth-otp-${i - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };

  const focusNext = (i: number) => {
    const next = document.getElementById(`auth-otp-${i + 1}`) as HTMLInputElement | null;
    next?.focus();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
          className="w-full max-w-xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 flex items-start justify-between border-b border-border">
            <div className="flex items-center gap-3">
              {view !== "select" && (
                <button
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="text-xl font-semibold">
                {view === "select" && "Prijavite se za nastavak"}
                {view === "login" && "Prijava putem korisničkih podataka"}
                {view === "phone-input" && "Unesi A1 mobilni broj"}
                {view === "otp" && "Unesi kod iz SMS-a"}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Selection View */}
            {view === "select" && (
              <div className="grid gap-4">
                <button
                  onClick={handleSelectLogin}
                  className="w-full text-left rounded-2xl border border-border px-4 py-4 hover:bg-muted transition-colors flex items-start gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-muted-foreground">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Korisničko ime ili email i lozinka</div>
                    <div className="text-sm text-muted-foreground">
                      Prijavite se putem Moj A1 korisničkog imena ili emaila i pripadajuće lozinke.
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleSelectOTP}
                  className="w-full text-left rounded-2xl border border-border px-4 py-4 hover:bg-muted transition-colors flex items-start gap-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="font-medium">A1 mobilni broj</div>
                    <div className="text-sm text-muted-foreground">
                      Prijavite se putem jednokratnog SMS koda.
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Login View */}
            {view === "login" && (
              <div className="grid gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Korisničko ime ili email</label>
                  <input
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="rounded-xl border border-border p-3 bg-card focus:ring-2 focus:ring-primary outline-none"
                    placeholder="npr. ime.prezime@firma.hr"
                  />
                  {!user && <div className="text-[11px] text-destructive">Obavezno polje.</div>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Lozinka</label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="rounded-xl border border-border p-3 bg-card focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                  {!pass && <div className="text-[11px] text-destructive">Obavezno polje.</div>}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Button
                    onClick={handleLoginSubmit}
                    className="rounded-2xl"
                    disabled={!user || !pass}
                  >
                    Prijavi se
                  </Button>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
                    Zaboravljena lozinka?
                  </button>
                </div>
              </div>
            )}

            {/* Phone Input View */}
            {view === "phone-input" && (
              <div className="grid gap-4">
                <p className="text-muted-foreground">
                  Unesi svoj A1 mobilni broj na koji ćemo poslati SMS s kodom za prijavu.
                </p>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Broj mobitela</label>
                  <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
                    <span className="pl-3 pr-1 text-muted-foreground select-none">+385</span>
                    <input
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                        setPhoneNumber(value);
                      }}
                      inputMode="tel"
                      maxLength={9}
                      className="flex-1 p-3 pl-1 bg-transparent outline-none"
                      placeholder="9X XXX XXXX"
                    />
                  </div>
                  {phoneNumber.length > 0 && phoneNumber.length < 8 && (
                    <div className="text-[11px] text-destructive">Minimalno 8 znakova.</div>
                  )}
                </div>

                <Button
                  onClick={handlePhoneSubmit}
                  className="rounded-2xl mt-2"
                  disabled={phoneNumber.length < 8}
                >
                  Pošalji SMS kod
                </Button>
              </div>
            )}

            {/* OTP View */}
            {view === "otp" && (
              <div className="grid gap-4">
                <p className="text-muted-foreground">
                  Poslali smo ti šesteroznamenkasti kod SMS-om na {maskPhoneNumber(phoneNumber)}
                </p>
                
                <div className="flex gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      id={`auth-otp-${i}`}
                      inputMode="numeric"
                      maxLength={1}
                      value={code[i] || ""}
                      onChange={(e) => {
                        handleOTPChange(i, e.target.value);
                        if (e.target.value) focusNext(i);
                      }}
                      onKeyDown={(e) => handleOTPKeyDown(e, i)}
                      className="h-14 w-12 rounded-xl border border-border text-center text-xl bg-card focus:ring-2 focus:ring-primary outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <Button
                    onClick={handleOTPSubmit}
                    className="rounded-2xl"
                    disabled={code.length !== 6}
                  >
                    Potvrdi
                  </Button>
                  <button
                    className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
                    onClick={() => setCode("")}
                  >
                    Poruka nije stigla? Pošalji ponovno
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
