import { User, Phone } from "lucide-react";

type LoginPanelProps = {
  onOpenOTP: () => void;
  onOpenLogin: () => void;
};

export function LoginPanel({ onOpenOTP, onOpenLogin }: LoginPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Prijava u sustav</h2>
        <p className="text-xs text-muted-foreground">Odaberi način prijave</p>
      </div>
      <div className="border-t border-border p-4 grid gap-4">
        <div className="grid gap-4">
          {/* Username & password */}
          <button
            onClick={onOpenLogin}
            className="w-full text-left rounded-2xl border border-border px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-muted-foreground">
              <User size={20} />
            </div>
            <div>
              <div className="font-medium">Korisničko ime i lozinka</div>
              <div className="text-xs text-muted-foreground">
                Prijava putem korisničkih podataka.
              </div>
            </div>
          </button>

          {/* A1 mobile number */}
          <button
            onClick={onOpenOTP}
            className="w-full text-left rounded-2xl border border-border px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive">
              <Phone size={20} />
            </div>
            <div>
              <div className="font-medium">A1 mobilni broj</div>
              <div className="text-xs text-muted-foreground">
                Putem SMS-a ćemo poslati kod koji ćeš unijeti u sljedećem koraku.
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
