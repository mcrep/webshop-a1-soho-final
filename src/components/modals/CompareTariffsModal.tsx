import { tariffs } from "@/data/catalog";
import { Check, X, Wifi, Phone, Globe, Wallet, Tag, Scale } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

type CompareTariffsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CompareTariffsModal({ open, onOpenChange }: CompareTariffsModalProps) {
  // Sort tariffs by price
  const sortedTariffs = [...tariffs].sort((a, b) => a.monthly - b.monthly);

  const features = [
    { 
      key: "monthly", 
      label: "Mjesečna cijena", 
      icon: null,
      render: (tariff: typeof tariffs[0]) => {
        if (tariff.originalMonthly && tariff.originalMonthly > tariff.monthly) {
          return (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm text-muted-foreground line-through">
                €{tariff.originalMonthly.toFixed(2)}
              </span>
              <span className="font-bold text-primary text-lg">
                €{tariff.monthly.toFixed(2)}
              </span>
            </div>
          );
        }
        return <span className="font-bold text-primary text-lg">€{tariff.monthly.toFixed(2)}</span>;
      }
    },
    { 
      key: "savings", 
      label: "Ušteda", 
      icon: Tag,
      render: (tariff: typeof tariffs[0]) => {
        if (tariff.originalMonthly && tariff.originalMonthly > tariff.monthly) {
          const savingsPercent = ((tariff.originalMonthly - tariff.monthly) / tariff.originalMonthly * 100).toFixed(0);
          const savingsAmount = (tariff.originalMonthly - tariff.monthly).toFixed(2);
          return (
            <div className="inline-flex flex-col items-center gap-1">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                -{savingsPercent}%
              </span>
              <span className="text-xs text-muted-foreground">
                €{savingsAmount}/mj
              </span>
            </div>
          );
        }
        return <span className="text-muted-foreground">—</span>;
      }
    },
    { 
      key: "data", 
      label: "Podatkovni promet", 
      icon: Wifi,
      render: (tariff: typeof tariffs[0]) => tariff.data
    },
    { 
      key: "voice", 
      label: "Pozivi i SMS", 
      icon: Phone,
      render: (tariff: typeof tariffs[0]) => tariff.voice
    },
    { 
      key: "roaming", 
      label: "Roaming", 
      icon: Globe,
      render: (tariff: typeof tariffs[0]) => tariff.roaming
    },
    { 
      key: "walletCredit", 
      label: "A1 Wallet kredit", 
      icon: Wallet,
      render: (tariff: typeof tariffs[0]) => `€${tariff.walletCredit}`
    },
    { 
      key: "noDeviceWalletBonus", 
      label: "Bonus bez uređaja", 
      icon: Wallet,
      render: (tariff: typeof tariffs[0]) => `+€${tariff.noDeviceWalletBonus}`
    },
    { 
      key: "unlimitedData", 
      label: "Neograničeni internet", 
      icon: null,
      render: (tariff: typeof tariffs[0]) => tariff.data === "Neograničeno"
    },
    { 
      key: "unlimitedVoice", 
      label: "Neograničeni pozivi", 
      icon: null,
      render: (tariff: typeof tariffs[0]) => tariff.voice.toLowerCase().includes("neograničen")
    },
    { 
      key: "euRoaming", 
      label: "EU roaming uključen", 
      icon: null,
      render: (tariff: typeof tariffs[0]) => tariff.roaming.includes("EU")
    },
    { 
      key: "regionRoaming", 
      label: "Regionalni roaming", 
      icon: null,
      render: (tariff: typeof tariffs[0]) => tariff.roaming.includes("Regija")
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
        className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
        <ScrollArea className="flex-1">
          <div className="p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b border-border bg-muted/50 sticky left-0 z-10 min-w-[160px] rounded-tl-lg">
                    Značajka
                  </th>
                  {sortedTariffs.map((tariff, idx) => (
                    <th 
                      key={tariff.id} 
                      className={`text-center p-3 border-b border-border bg-muted/50 min-w-[120px] ${idx === sortedTariffs.length - 1 ? 'rounded-tr-lg' : ''}`}
                    >
                      <div className="font-bold text-primary">{tariff.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr key={feature.key} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="p-3 border-b border-border font-medium flex items-center gap-2 sticky left-0 bg-inherit z-10">
                      {feature.icon && <feature.icon className="h-4 w-4 text-muted-foreground" />}
                      {feature.label}
                    </td>
                    {sortedTariffs.map((tariff) => {
                      const value = feature.render(tariff);
                      const isBoolean = typeof value === "boolean";
                      
                      return (
                        <td 
                          key={tariff.id} 
                          className="p-3 border-b border-border text-center"
                        >
                          {isBoolean ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                            )
                          ) : typeof value === 'object' ? (
                            value
                          ) : (
                            <span className={feature.key === "monthly" ? "font-bold text-primary text-lg" : ""}>
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
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
