import { tariffs } from "@/data/catalog";
import { X, Wifi, Phone, Globe, Wallet, Scale } from "lucide-react";
import { motion } from "framer-motion";

type CompareTariffsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FeatureRow = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | null;
  group: "price" | "features" | "wallet";
  render: (tariff: typeof tariffs[0]) => React.ReactNode;
  isGroupEnd?: boolean;
};

export function CompareTariffsModal({ open, onOpenChange }: CompareTariffsModalProps) {
  // Sort tariffs by price
  const sortedTariffs = [...tariffs].sort((a, b) => a.monthly - b.monthly);

  const features: FeatureRow[] = [
    // Grupa: Cijene
    { 
      key: "originalMonthly", 
      label: "Mjesečna cijena", 
      icon: null,
      group: "price",
      render: (tariff) => (
        <span className="text-muted-foreground text-xs sm:text-sm">€{(tariff.originalMonthly || tariff.monthly).toFixed(2)}</span>
      )
    },
    { 
      key: "discount", 
      label: "Popust", 
      icon: null,
      group: "price",
      render: (tariff) => {
        if (tariff.originalMonthly && tariff.originalMonthly > tariff.monthly) {
          const savings = (tariff.originalMonthly - tariff.monthly).toFixed(2);
          return (
            <span className="text-xs sm:text-sm">-€{savings}</span>
          );
        }
        return <span className="text-muted-foreground">—</span>;
      }
    },
    { 
      key: "yourPrice", 
      label: "Vaša cijena", 
      icon: null,
      group: "price",
      isGroupEnd: true,
      render: (tariff) => (
        <span className="font-bold text-primary text-base sm:text-lg">€{tariff.monthly.toFixed(2)}</span>
      )
    },
    // Grupa: Značajke
    { 
      key: "data", 
      label: "Podatkovni promet", 
      icon: Wifi,
      group: "features",
      render: (tariff) => <span className="font-medium text-xs sm:text-sm">{tariff.data}</span>
    },
    { 
      key: "voice", 
      label: "Pozivi i SMS", 
      icon: Phone,
      group: "features",
      render: (tariff) => <span className="font-medium text-xs sm:text-sm">{tariff.voice}</span>
    },
    { 
      key: "roaming", 
      label: "Roaming", 
      icon: Globe,
      group: "features",
      isGroupEnd: true,
      render: (tariff) => <span className="font-medium text-xs sm:text-sm">{tariff.roaming}</span>
    },
    // Grupa: A1 Wallet
    { 
      key: "walletCredit", 
      label: "A1 Wallet popust", 
      icon: Wallet,
      group: "wallet",
      render: (tariff) => <span className="font-medium text-[#3F1EE2] text-xs sm:text-sm">€{tariff.walletCredit}</span>
    },
    { 
      key: "noDeviceWalletBonus", 
      label: "Wallet bonus", 
      icon: Wallet,
      group: "wallet",
      render: (tariff) => <span className="font-medium text-[#3F1EE2] text-xs sm:text-sm">+€{tariff.noDeviceWalletBonus}</span>
    },
  ];

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
    >
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-4 sm:p-6 text-primary-foreground">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Usporedba tarifa</h2>
              <p className="text-xs sm:text-sm opacity-90">Usporedi sve tarife i odaberi najbolju za tebe</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6">
            <table className="w-full border-collapse table-fixed">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="text-left p-2 sm:p-3 border-b-2 border-border bg-card w-[100px] sm:w-[160px]">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">Značajka</span>
                  </th>
                  {sortedTariffs.map((tariff) => (
                    <th 
                      key={tariff.id} 
                      className="text-center p-2 sm:p-3 border-b-2 border-border bg-card"
                    >
                      <div className="font-bold text-xs sm:text-sm text-foreground truncate">{tariff.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr 
                    key={feature.key} 
                    className={`bg-background hover:bg-muted/30 transition-colors ${
                      feature.isGroupEnd ? 'border-b-2 border-border' : 'border-b border-border/50'
                    }`}
                  >
                    <td className="p-2 sm:p-3 font-medium">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {feature.icon && <feature.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />}
                        <span className="text-xs sm:text-sm leading-tight">{feature.label}</span>
                      </div>
                    </td>
                    {sortedTariffs.map((tariff) => (
                      <td 
                        key={tariff.id} 
                        className="p-2 sm:p-3 text-center"
                      >
                        {feature.render(tariff)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Zatvori
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
