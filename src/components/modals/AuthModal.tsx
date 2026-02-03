import { useState, useEffect, useRef } from "react";
import { User, Phone, ArrowLeft, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";

type AuthModalProps = {
  onClose: () => void;
  onLoginSuccess: (identifier: string, type: "email" | "phone") => void;
};

type AuthView = "select" | "login" | "login-otp" | "phone-input" | "otp";

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("select");
  
  // Login form state
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [userTouched, setUserTouched] = useState(false);
  const [passTouched, setPassTouched] = useState(false);
  
  // Phone/OTP state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginPhoneNumber, setLoginPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const otpInputRef = useRef<HTMLInputElement>(null);

  const formatPhoneDisplay = (phone: string) => {
    // Format: 9X XXX XXXX (2 3 4 pattern)
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return "+385 " + phone;
    const formatted = formatPhoneDisplay(phone);
    const visible = formatted.slice(-2);
    const hidden = formatted.slice(0, -2).replace(/\d/g, "*");
    return "+385 " + hidden + visible;
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
      // Dummy phone number from "backend" - will be fetched based on user credentials
      setLoginPhoneNumber("912345678");
      setView("login-otp");
    }
  };

  const handleLoginOTPSubmit = () => {
    if (code.length === 6) {
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

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (code.length === 6) {
      if (view === "otp") {
        handleOTPSubmit();
      } else if (view === "login-otp") {
        handleLoginOTPSubmit();
      }
    }
  }, [code, view]);

  // Auto-focus OTP input when entering OTP views
  useEffect(() => {
    if (view === "otp" || view === "login-otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [view]);

  const handleBack = () => {
    if (view === "otp") {
      setView("phone-input");
      setCode("");
    } else if (view === "login-otp") {
      setView("login");
      setCode("");
    } else {
      setView("select");
      setUser("");
      setPass("");
      setUserTouched(false);
      setPassTouched(false);
      setPhoneNumber("");
      setLoginPhoneNumber("");
      setCode("");
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg mx-4 rounded-2xl bg-card shadow-2xl overflow-hidden"
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
          {view !== "select" && (
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <LogIn className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {view === "select" && "Prijavite se"}
                {view === "login" && "Prijava"}
                {view === "login-otp" && "Potvrda identiteta"}
                {view === "phone-input" && "Prijava putem SMS-a"}
                {view === "otp" && "Potvrda identiteta"}
              </h2>
              <p className="text-sm opacity-90">
                {view === "select" && "Postojeći poslovni korisnik"}
                {view === "login" && "Korisničko ime i lozinka"}
                {view === "login-otp" && "Unesite SMS kod"}
                {view === "phone-input" && "A1 mobilni broj"}
                {view === "otp" && "Unesite SMS kod"}
              </p>
            </div>
          </div>
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
                    onBlur={() => setUserTouched(true)}
                    className="rounded-xl border border-border p-3 bg-card focus:ring-2 focus:ring-primary outline-none"
                    placeholder="ime.prezime@firma.hr"
                  />
                  <AnimatePresence>
                    {userTouched && !user && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-[11px] text-destructive"
                      >
                        Obavezno polje.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Lozinka</label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    onBlur={() => setPassTouched(true)}
                    className="rounded-xl border border-border p-3 bg-card focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                  <AnimatePresence>
                    {passTouched && !pass && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-[11px] text-destructive"
                      >
                        Obavezno polje.
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      value={formatPhoneDisplay(phoneNumber)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, "").slice(0, 9);
                        setPhoneNumber(rawValue);
                      }}
                      inputMode="tel"
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
                
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    ref={otpInputRef}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={1} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={2} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={3} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={4} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={5} className="h-14 w-12 rounded-xl border-border text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex items-center justify-between mt-2">
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

            {/* Login OTP View - after credentials */}
            {view === "login-otp" && (
              <div className="grid gap-4">
                <p className="text-muted-foreground">
                  Poslali smo ti šesteroznamenkasti kod SMS-om na {maskPhoneNumber(loginPhoneNumber)}
                </p>
                
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    ref={otpInputRef}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={1} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={2} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={3} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={4} className="h-14 w-12 rounded-xl border-border text-xl" />
                      <InputOTPSlot index={5} className="h-14 w-12 rounded-xl border-border text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <Button
                    onClick={handleLoginOTPSubmit}
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
    </motion.div>
  );
}
