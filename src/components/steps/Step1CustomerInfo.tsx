import { useState, useEffect } from "react";
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
  onUpdateCustomerType: (type: "new" | "existing") => void;
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
        <h1 className="text-2xl font-bold mb-2">Dobrodošli u A1 Webshop za poslovne korisnike</h1>
        <p className="text-muted-foreground text-base">
          Konfigurirajte svoje mobilne linije i uređaje u par jednostavnih koraka. 
          Odaberite tarife, uređaje i dodatke koji vam najviše odgovaraju.
        </p>
      </div>

      {/* Configuration Cards */}
      <div className="space-y-6 mb-8 max-w-6xl mx-auto px-4">
        {/* Customer Type Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Ja sam</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    onUpdateCustomerType("new");
                    setShowOIBModal(true);
                  }
                }}
                disabled={isLoggedIn}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  isLoggedIn
                    ? "opacity-50 cursor-not-allowed border-border bg-muted"
                    : customerType === "new"
                    ? "border-primary"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <UserPlus className={`h-8 w-8 mx-auto mb-3 ${customerType === "new" ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`font-semibold ${customerType === "new" ? "text-accent-foreground" : "text-foreground"}`}>
                  Novi korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">Nova tvrtka koja ne koristi usluge u A1 mreži i želi aktivirati nove usluge</p>
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setShowAuthModal(true);
                  }
                  onUpdateCustomerType("existing");
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  customerType === "existing"
                    ? "border-primary"
                    : "border-border hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                {customerType === "existing" && isLoggedIn ? (
                  <Check className="h-8 w-8 mx-auto mb-3 text-green-500" />
                ) : (
                  <Users className={`h-8 w-8 mx-auto mb-3 ${customerType === "existing" ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <p className={`font-semibold ${customerType === "existing" ? "text-accent-foreground" : "text-foreground"}`}>
                  Postojeći korisnik
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {customerType === "existing" && isLoggedIn ? 'Prijavljeni ste kao tvrtka "Test tvrtka d.o.o."' : "Postojeća tvrtka koja koristi mobilne, fiksne ili ICT usluge u A1 mreži i želi raditi promjene"}
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Number of Lines Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Želim aktivirati</h3>
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
              <div className="text-center min-w-[80px]">
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
          </CardContent>
        </Card>

        {/* Extension Lines Card - Only shown when logged in */}
        {isLoggedIn && (
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">i produljiti</h3>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowExtensionModal(true)}
                  className="h-16 min-w-[80px] rounded-full text-5xl font-bold text-primary hover:bg-primary/10"
                >
                  <AnimatedNumber value={extensionLines.length} className="text-5xl font-bold text-primary" />
                </Button>
                <h3 className="text-lg font-semibold"><AnimatedText text={getLinePlural(extensionLines.length)} /></h3>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Number of Devices Card */}
        <Card className="border-2 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">a uz to želim kupiti</h3>
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
              <div className="text-center min-w-[80px]">
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
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(identifier, type) => {
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
