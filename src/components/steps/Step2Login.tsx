import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, Smartphone } from "lucide-react";
import { LoginModal } from "@/components/modals/LoginModal";
import { OTPModal } from "@/components/modals/OTPModal";

type Step2LoginProps = {
  onNext: () => void;
  onBack: () => void;
};

export function Step2Login({ onNext, onBack }: Step2LoginProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login modal state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // OTP modal state
  const [otpCode, setOtpCode] = useState("");
  const [maskedNumber, setMaskedNumber] = useState("");

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleOpenOTP = () => {
    // Simulate masked number
    setMaskedNumber("xxx xxx 789");
    setShowOTPModal(true);
  };

  const handleLoginSubmit = () => {
    // Simulate successful login
    if (loginUser && loginPass) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const handleOTPSubmit = () => {
    // Simulate successful OTP verification
    if (otpCode.length === 6) {
      setIsLoggedIn(true);
      setShowOTPModal(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Prijava</h1>
          <p className="text-muted-foreground">
            Odaberite način prijave u vaš A1 račun
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Korisničko ime/Lozinka */}
          <button
            onClick={handleOpenLogin}
            className="group rounded-2xl border-2 border-border bg-card p-8 hover:border-primary hover:shadow-lg transition-all text-left"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Korisničko ime i lozinka</h3>
                <p className="text-sm text-muted-foreground">
                  Prijavite se pomoću svog email-a ili korisničkog imena i lozinke
                </p>
              </div>
            </div>
          </button>

          {/* A1 Mobilni broj (OTP) */}
          <button
            onClick={handleOpenOTP}
            className="group rounded-2xl border-2 border-border bg-card p-8 hover:border-primary hover:shadow-lg transition-all text-left"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">A1 mobilni broj</h3>
                <p className="text-sm text-muted-foreground">
                  Prijavite se pomoću OTP koda poslanog na vaš A1 broj
                </p>
              </div>
            </div>
          </button>
        </div>

        {isLoggedIn && (
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 text-center">
            <p className="text-primary font-semibold">✓ Uspješno ste prijavljeni</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t">
          <Button onClick={onBack} variant="outline" size="lg">
            <ArrowLeft className="mr-2" size={18} />
            Natrag
          </Button>
          <Button onClick={onNext} disabled={!isLoggedIn} size="lg">
            Nastavi na tarife
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          user={loginUser}
          pass={loginPass}
          onChangeUser={setLoginUser}
          onChangePass={setLoginPass}
          onClose={() => setShowLoginModal(false)}
          onSubmit={handleLoginSubmit}
        />
      )}

      {showOTPModal && (
        <OTPModal
          maskedTarget={maskedNumber}
          code={otpCode}
          setCode={setOtpCode}
          onClose={() => setShowOTPModal(false)}
          onSubmit={handleOTPSubmit}
        />
      )}
    </>
  );
}
