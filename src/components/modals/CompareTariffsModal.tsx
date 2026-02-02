import { tariffs } from "@/data/catalog";
import { X, Wifi, Phone, Globe, Wallet, Scale } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
        <span className="text-muted-foreground">€{(tariff.originalMonthly || tariff.monthly).toFixed(2)}</span>
      )
    },
    { 
      key: "discount", 
      label: "Popust", 
      icon: null,
      group: "price",
      render: (tariff) => {
        if (tariff.originalMonthly && tariff.originalMonthly > tariff.monthly) {
          const savingsPercent = ((tariff.originalMonthly - tariff.monthly) / tariff.originalMonthly * 100).toFixed(0);
          return (
            <span className="text-primary font-semibold">-{savingsPercent}%</span>
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
        <span className="font-bold text-primary text-xl">€{tariff.monthly.toFixed(2)}</span>
      )
    },
    // Grupa: Značajke
    { 
      key: "data", 
      label: "Podatkovni promet", 
      icon: Wifi,
      group: "features",
      render: (tariff) => <span className="font-medium">{tariff.data}</span>
    },
    { 
      key: "voice", 
      label: "Pozivi i SMS", 
      icon: Phone,
      group: "features",
      render: (tariff) => <span className="font-medium">{tariff.voice}</span>
    },
    { 
      key: "roaming", 
      label: "Roaming", 
      icon: Globe,
      group: "features",
      isGroupEnd: true,
      render: (tariff) => <span className="font-medium">{tariff.roaming}</span>
    },
    // Grupa: A1 Wallet
    { 
      key: "walletCredit", 
      label: "A1 Wallet popust", 
      icon: Wallet,
      group: "wallet",
      render: (tariff) => <span className="font-medium text-[#3F1EE2]">€{tariff.walletCredit}</span>
    },
    { 
      key: "noDeviceWalletBonus", 
      label: "A1 Wallet bonus bez uređaja", 
      icon: Wallet,
      group: "wallet",
      render: (tariff) => <span className="font-medium text-[#3F1EE2]">+€{tariff.noDeviceWalletBonus}</span>
    },
  ];

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
        className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Usporedba tarifa</h2>
              <p className="text-sm opacity-90">Usporedi sve tarife i odaberi najbolju za tebe</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 min-w-max">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="text-left p-4 border-b-2 border-border bg-card sticky left-0 z-30 min-w-[180px] rounded-tl-lg">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Značajka</span>
                  </th>
                  {sortedTariffs.map((tariff, idx) => (
                    <th 
                      key={tariff.id} 
                      className={`text-center p-4 border-b-2 border-border bg-card min-w-[130px] ${idx === sortedTariffs.length - 1 ? 'rounded-tr-lg' : ''}`}
                    >
                      <div className="font-bold text-lg text-foreground">{tariff.name}</div>
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
                    <td className="p-4 font-medium flex items-center gap-2.5 sticky left-0 bg-card z-10">
                      {feature.icon && <feature.icon className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <span className="text-sm">{feature.label}</span>
                    </td>
                    {sortedTariffs.map((tariff) => (
                      <td 
                        key={tariff.id} 
                        className="p-4 text-center"
                      >
                        {feature.render(tariff)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Zatvori
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
