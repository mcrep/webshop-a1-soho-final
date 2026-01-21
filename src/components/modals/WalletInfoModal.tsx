import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, Gift, Info } from "lucide-react";

type WalletInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WalletInfoModal({ open, onOpenChange }: WalletInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Gradient Header */}
        <DialogHeader className="bg-gradient-to-r from-[#3F1EE2]/80 to-[#A8C6FF]/60 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              O A1 Wallet
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A8C6FF]/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5" style={{ color: '#3F1EE2' }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bonus za tarife</h3>
              <p className="text-sm text-muted-foreground">
                Ovisno o odabranoj tarifi u A1 Wallet dobivate popust koji se može koristiti za umanjenje cijene uređaja.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A8C6FF]/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5" style={{ color: '#3F1EE2' }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bonus za linije bez uređaja</h3>
              <p className="text-sm text-muted-foreground">
                Svaka linija bez uređaja donosi dodatni popust u A1 Wallet. Iznos bonusa ovisi o odabranoj tarifi – veća tarifa znači veći bonus!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
