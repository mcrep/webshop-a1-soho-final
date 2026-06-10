import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, User, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminView = "login" | "impersonate";

const Admovrd = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>("login");

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  };

  const handleLogin = () => {
    if (user.trim() === "admin" && pass === "admin") {
      setLoginError(false);
      setView("impersonate");
    } else {
      setLoginError(true);
    }
  };

  const handleImpersonate = () => {
    if (phoneNumber.length < 8) return;
    const msisdn = "385" + phoneNumber;
    sessionStorage.setItem("adminImpersonateMsisdn", msisdn);
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Override</h1>
                <p className="text-sm opacity-90">
                  {view === "login"
                    ? "Prijava administratora"
                    : "Oponašanje korisnika"}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {view === "login" && (
              <div className="grid gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Korisničko ime</label>
                  <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
                    <span className="pl-3 text-muted-foreground">
                      <User size={18} />
                    </span>
                    <input
                      value={user}
                      onChange={(e) => {
                        setUser(e.target.value);
                        setLoginError(false);
                      }}
                      className="flex-1 p-3 bg-transparent outline-none"
                      placeholder="admin"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Lozinka</label>
                  <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
                    <span className="pl-3 text-muted-foreground">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      value={pass}
                      onChange={(e) => {
                        setPass(e.target.value);
                        setLoginError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="flex-1 p-3 bg-transparent outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[12px] text-destructive"
                    >
                      Pogrešno korisničko ime ili lozinka.
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button onClick={handleLogin} className="rounded-2xl mt-2">
                  Prijavi se
                </Button>
              </div>
            )}

            {view === "impersonate" && (
              <div className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Unesi MSISDN korisnika kojeg želiš oponašati.
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">MSISDN korisnika</label>
                  <div className="flex items-center rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary">
                    <span className="pl-3 text-muted-foreground">
                      <Phone size={18} />
                    </span>
                    <span className="pl-1 pr-1 text-muted-foreground select-none">+385</span>
                    <input
                      value={formatPhoneDisplay(phoneNumber)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                        setPhoneNumber(raw);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleImpersonate()}
                      inputMode="tel"
                      className="flex-1 p-3 pl-1 bg-transparent outline-none"
                      placeholder="9X XXX XXXX"
                      autoFocus
                    />
                  </div>
                  {phoneNumber.length > 0 && phoneNumber.length < 8 && (
                    <div className="text-[11px] text-destructive">Minimalno 8 znamenki.</div>
                  )}
                </div>

                <Button
                  onClick={handleImpersonate}
                  className="rounded-2xl mt-2"
                  disabled={phoneNumber.length < 8}
                >
                  Nastavi kao korisnik
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Admovrd;
