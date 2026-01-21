import { Wallet, Gift, Info, X } from "lucide-react";
import { motion } from "framer-motion";

type WalletInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WalletInfoModal({ open, onOpenChange }: WalletInfoModalProps) {
  if (!open) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenChange(false)}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md mx-4 rounded-2xl bg-background shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-[#3F1EE2]/80 to-[#A8C6FF]/60 p-6 text-white">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">O A1 Wallet</h2>
          </div>
        </div>

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
      </motion.div>
    </motion.div>
  );
}
