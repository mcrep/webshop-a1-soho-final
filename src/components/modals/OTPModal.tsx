type OTPModalProps = {
  maskedTarget: string;
  code: string;
  setCode: (s: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function OTPModal({ maskedTarget, code, setCode, onClose, onSubmit }: OTPModalProps) {
  const boxes = Array.from({ length: 6 });
  
  const handleChange = (i: number, val: string) => {
    const v = (val || "").replace(/\D/g, "").slice(0, 1);
    const chars = (code || "").split("");
    chars[i] = v;
    const next = chars.join("").slice(0, 6);
    setCode(next);
  };
  
  const handleKeyDown = (e: any, i: number) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const prev = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  };
  
  const focusNext = (i: number) => {
    const next = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
    next?.focus();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-6 flex items-start justify-between border-b border-border">
            <div className="text-2xl font-semibold leading-snug">
              Poslali smo ti šester znamenkasti kod SMS-om
              <br />
              na {maskedTarget}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="px-6 pb-6 pt-4">
            <div className="flex gap-3">
              {boxes.map((_, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i] || ""}
                  onChange={(e) => {
                    handleChange(i, e.target.value);
                    if (e.target.value) focusNext(i);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="h-14 w-12 rounded-xl border border-border text-center text-xl bg-card focus:ring-2 focus:ring-primary outline-none"
                />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={onSubmit}
                style={{ backgroundColor: "hsl(0 100% 50%)" }}
                className="rounded-2xl text-white px-4 py-2 text-sm hover:opacity-90 transition-opacity"
              >
                Pošalji
              </button>
              <button
                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
                onClick={() => setCode("")}
              >
                Poruka nije stigla? Pošalji ponovno
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
