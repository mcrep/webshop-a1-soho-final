import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Users, Smartphone, Minus, Plus, Check, RefreshCw } from "lucide-react";
import { AuthModal } from "@/components/modals/AuthModal";
import { ExtensionLinesModal } from "@/components/modals/ExtensionLinesModal";
import { OIBModal } from "@/components/modals/OIBModal";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtensionLineWithTariff } from "@/types";

// Croatian pluralization helper
const getLinePlural = (n: number) => {
  if (n === 1) return "novu mobilnu liniju";
  if (n >= 2 && n <= 4) return "nove mobilne linije";
  return "novih mobilnih linija";
};

// Pluralization for extension lines (without "novu/nove/novih")
const getExtensionLinePlural = (n: number) => {
  if (n === 1) return "mobilnu liniju";
  if (n >= 2 && n <= 4) return "mobilne linije";
  return "mobilnih linija";
};

const getDevicePlural = (n: number) => {
  if (n === 1) return "mobilni uređaj";
  if (n >= 2 && n <= 4) return "mobilna uređaja";
  return "mobilnih uređaja";
};

// Animated number component
const AnimatedNumber = ({ value, className }: { value: number; className?: string }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={value}
      initial={{ y: -20, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={className}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

// Animated text component for plural labels
const AnimatedText = ({ text, className }: { text: string; className?: string }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={text}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={className}
    >
      {text}
    </motion.span>
  </AnimatePresence>
);

type Step1Props = {
  customerType: "new" | "existing" | null;
  numberOfLines: number;
  numberOfDevices: number;
  isLoggedIn: boolean;
  extensionLines: ExtensionLineWithTariff[];
  companyOIB: string;
  onUpdateCustomerType: (type: "new" | "existing" | null) => void;
  onUpdateNumberOfLines: (num: number) => void;
  onUpdateNumberOfDevices: (num: number) => void;
  onLoginSuccess: (identifier: string, type: "email" | "phone") => void;
  onUpdateExtensionLines: (lines: ExtensionLineWithTariff[]) => void;
  onUpdateCompanyOIB: (oib: string) => void;
  onNext: () => void;
};

export function Step1CustomerInfo({
  customerType,
  numberOfLines,
  numberOfDevices,
  isLoggedIn,
  extensionLines,
  companyOIB,
  onUpdateCustomerType,
  onUpdateNumberOfLines,
  onUpdateNumberOfDevices,
  onLoginSuccess,
  onUpdateExtensionLines,
  onUpdateCompanyOIB,
  onNext,
}: Step1Props) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Use a ref so we can reliably detect a successful login even when AuthModal
  // calls onLoginSuccess() and onClose() synchronously in the same tick.
  const authModalLoginCompletedRef = useRef(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showOIBModal, setShowOIBModal] = useState(false);
  
  // Max devices = new lines + extension lines (for logged in users)
  const maxDevices = isLoggedIn ? numberOfLines + extensionLines.length : numberOfLines;
  const canProceed = customerType !== null && numberOfLines > 0 && numberOfDevices >= 0 && numberOfDevices <= maxDevices && (customerType === "new" || isLoggedIn);

  // Auto-adjust numberOfDevices if it exceeds maxDevices
  useEffect(() => {
    if (numberOfDevices > maxDevices) {
      onUpdateNumberOfDevices(maxDevices);
    }
  }, [numberOfLines, extensionLines.length, maxDevices, numberOfDevices, onUpdateNumberOfDevices]);

  return (
    <div className="w-full">
      {/* Welcome Message */}
      <div className="text-center mb-6 pt-6 max-w-2xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-2xl font-bold mb-2"
        >
          Dobrodošli u A1 Webshop za poslovne korisnike
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="text-muted-foreground text-base"
        >
          Konfigurirajte svoje mobilne linije i uređaje u par jednostavnih koraka. 
          Odaberite tarife, uređaje i dodatke koji vam najviše odgovaraju.
        </motion.p>
      </div>

      {/* Configuration Cards */}
      <div className="space-y-6 mb-8 max-w-6xl mx-auto px-4">
        {/* Customer Type Card - No border/hover */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Ja sam</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => {
                  if (!isLoggedIn) {
                    onUpdateCustomerType("new");
                    setShowOIBModal(true);
                  }
                }}
                disabled={isLoggedIn}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  isLoggedIn
                    ? "cursor-not-allowed border-border bg-card"
                    : customerType === "new"
                    ? "border-transparent bg-[#F2F2F2]"
                    : "border-border hover:border-black"
                }`}
                animate={{
                  opacity: isLoggedIn ? 0.5 : 1,
                  scale: isLoggedIn ? 0.98 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <UserPlus className={`h-8 w-8 mx-auto mb-3 ${customerType === "new" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-semibold ${customerType === "new" ? "text-primary" : "text-foreground"}`}>
                  Novi korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">Nova tvrtka koja ne koristi usluge u A1 mreži i želi aktivirati nove usluge</p>
              </motion.button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    authModalLoginCompletedRef.current = false;
                    setShowAuthModal(true);
                    onUpdateCustomerType("existing");
                  }
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "existing"
                    ? "border-transparent bg-[#F2F2F2]"
                    : "border-border hover:border-black"
                }`}
              >
                <Users className={`h-8 w-8 mx-auto mb-3 ${customerType === "existing" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-semibold ${customerType === "existing" ? "text-primary" : "text-foreground"}`}>
                  Postojeći korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {customerType === "existing" && isLoggedIn
                    ? 'Dobro došli, tvrtka "Test tvrtka d.o.o."'
                    : "Postojeća tvrtka koja koristi mobilne, fiksne ili ICT usluge u A1 mreži i želi raditi promjene"}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Combined Lines & Devices Configuration - Single container, no border */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 space-y-6">
            {/* Grid layout for consistent alignment */}
            <div className="flex flex-col items-center gap-6">
              {/* Number of Lines */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3 w-full max-w-2xl">
                <div className="flex items-center justify-end">
                  <h3 className="text-lg font-semibold whitespace-nowrap">Želim aktivirati</h3>
                </div>
                <motion.div whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => onUpdateNumberOfLines(Math.max(0, numberOfLines - 1))}
                    disabled={numberOfLines <= 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                </motion.div>
                <div className="text-center w-[80px]">
                  <AnimatedNumber value={numberOfLines} className="text-5xl font-bold text-primary" />
                </div>
                <motion.div whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => onUpdateNumberOfLines(numberOfLines + 1)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </motion.div>
                <h3 className="text-lg font-semibold"><AnimatedText text={getLinePlural(numberOfLines)} /></h3>
              </div>

              {/* Extension Lines - Only shown when logged in */}
              {isLoggedIn && (
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full max-w-2xl">
                  <div className="flex items-center justify-end">
                    <h3 className="text-lg font-semibold whitespace-nowrap">i produljiti</h3>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowExtensionModal(true)}
                    className="h-16 w-[80px] rounded-full text-5xl font-bold text-primary hover:bg-primary/10"
                  >
                    <AnimatedNumber value={extensionLines.length} className="text-5xl font-bold text-primary" />
                  </Button>
                  <h3 className="text-lg font-semibold"><AnimatedText text={getExtensionLinePlural(extensionLines.length)} /></h3>
                </div>
              )}

              {/* Number of Devices */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3 w-full max-w-2xl">
                <div className="flex items-center justify-end">
                  <h3 className="text-lg font-semibold whitespace-nowrap">a uz to želim kupiti</h3>
                </div>
                <motion.div whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => onUpdateNumberOfDevices(Math.max(0, numberOfDevices - 1))}
                    disabled={numberOfDevices <= 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                </motion.div>
                <div className="text-center w-[80px]">
                  <AnimatedNumber value={numberOfDevices} className="text-5xl font-bold text-primary" />
                </div>
                <motion.div whileTap={{ scale: 0.85 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => onUpdateNumberOfDevices(Math.min(maxDevices, numberOfDevices + 1))}
                    disabled={numberOfDevices >= maxDevices}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </motion.div>
                <h3 className="text-lg font-semibold"><AnimatedText text={getDevicePlural(numberOfDevices)} /></h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => {
              setShowAuthModal(false);
              const didLogin = authModalLoginCompletedRef.current;
              authModalLoginCompletedRef.current = false;
              // Reset customer type if user cancels without logging in
              if (!isLoggedIn && !didLogin) {
                onUpdateCustomerType(null);
              }
            }}
            onLoginSuccess={(identifier, type) => {
              authModalLoginCompletedRef.current = true;
              onUpdateCustomerType("existing");
              onLoginSuccess(identifier, type);
              setShowAuthModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Extension Lines Modal */}
      <AnimatePresence>
        {showExtensionModal && (
          <ExtensionLinesModal
            onClose={() => setShowExtensionModal(false)}
            onSave={onUpdateExtensionLines}
            selectedLines={extensionLines}
          />
        )}
      </AnimatePresence>

      {/* OIB Modal for new customers */}
      <AnimatePresence>
        {showOIBModal && (
          <OIBModal
            onClose={() => setShowOIBModal(false)}
            onSubmit={(oib) => {
              onUpdateCompanyOIB(oib);
              setShowOIBModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
