import { User, Phone, LogIn, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import a1Logo from "@/assets/a1-logo.png";

type HeaderProps = {
  onOpenOTP: () => void;
  onOpenLogin: () => void;
  lineCount: number;
  monthly: number;
  onetime: number;
  onFinishOrder: () => void;
};

export function Header({ onOpenOTP, onOpenLogin, lineCount, monthly, onetime, onFinishOrder }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={a1Logo} alt="A1 Logo" className="h-9 w-auto" />
            <div>
              <h1 className="text-lg font-semibold">Business Webshop</h1>
              <p className="text-xs text-muted-foreground">
                Konfigurator tarifa za male poslovne korisnike
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Shopping Cart */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full relative">
                  <ShoppingCart className="h-5 w-5" />
                  {lineCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {lineCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-popover">
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Sažetak narudžbe</h3>
                  
                  {lineCount === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nema konfiguriranih linija
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Broj linija</span>
                        <span className="font-semibold">{lineCount}</span>
                      </div>
                      
                      <div className="border-t border-border pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Mjesečno</span>
                          <span className="text-lg font-bold">€{monthly.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Jednokratno</span>
                          <span className="text-lg font-bold">€{onetime.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={onFinishOrder}
                        className="w-full mt-4"
                        size="lg"
                      >
                        Završi narudžbu
                      </Button>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <LogIn className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-popover">
              <div className="p-2 space-y-1">
                <DropdownMenuItem
                  onClick={onOpenLogin}
                  className="cursor-pointer p-3 rounded-lg"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-muted-foreground flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Korisničko ime i lozinka</div>
                      <div className="text-xs text-muted-foreground">
                        Prijava putem korisničkih podataka.
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={onOpenOTP}
                  className="cursor-pointer p-3 rounded-lg"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">A1 mobilni broj</div>
                      <div className="text-xs text-muted-foreground">
                        Putem SMS-a ćemo poslati kod.
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
