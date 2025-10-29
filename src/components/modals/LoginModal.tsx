type LoginModalProps = {
  user: string;
  pass: string;
  onChangeUser: (v: string) => void;
  onChangePass: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function LoginModal({
  user,
  pass,
  onChangeUser,
  onChangePass,
  onClose,
  onSubmit,
}: LoginModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-card shadow-xl border border-border overflow-hidden">
          <div className="p-6 flex items-start justify-between border-b border-border">
            <div className="text-xl font-semibold">Prijava putem korisničkih podataka</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-6 pt-4 grid gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Korisničko ime ili email</label>
              <input
                value={user}
                onChange={(e) => onChangeUser(e.target.value)}
                className="rounded-xl border border-border p-2 bg-card focus:ring-2 focus:ring-primary outline-none"
                placeholder="npr. ime.prezime@firma.hr"
              />
              {!user && <div className="text-[11px] text-destructive">Obavezno polje.</div>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Lozinka</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => onChangePass(e.target.value)}
                className="rounded-xl border border-border p-2 bg-card focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
              />
              {!pass && <div className="text-[11px] text-destructive">Obavezno polje.</div>}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={onSubmit}
                style={{ backgroundColor: "hsl(0 100% 50%)" }}
                className="rounded-2xl text-white px-4 py-2 text-sm hover:opacity-90 transition-opacity"
              >
                Prijavi se
              </button>
              <button className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
                Zaboravljena lozinka?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
