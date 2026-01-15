import { motion } from "framer-motion";
import { X, Plus, ArrowLeftRight, Phone } from "lucide-react";
import { lineTypes } from "@/data/catalog";

type Props = {
  currentLineType?: string;
  onClose: () => void;
  onSelect: (lineType: string) => void;
};

const lineTypeIcons: Record<string, React.ReactNode> = {
  new: <Plus size={20} />,
  pre2post: <ArrowLeftRight size={20} />,
  mnp: <Phone size={20} />,
};

const lineTypeDescriptions: Record<string, string> = {
  new: "Aktivirajte potpuno novu mobilnu liniju s novim brojem.",
  pre2post: "Prebacite postojeći A1 prepaid broj na pretplatu.",
  mnp: "Prenesite broj s druge mreže na A1 uz zadržavanje broja.",
};

export function LineTypeSelectionModal({ currentLineType, onClose, onSelect }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/80 to-primary/60 p-6 text-primary-foreground">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Zatvori"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Vrsta linije</h2>
              <p className="text-sm opacity-90">Odaberite kako želite aktivirati liniju</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {lineTypes.map((lt) => {
            const isSelected = currentLineType === lt.id;
            return (
              <button
                key={lt.id}
                onClick={() => onSelect(lt.id)}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition-all flex items-start gap-3 ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                  isSelected 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {lineTypeIcons[lt.id] || <Plus size={20} />}
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{lt.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lineTypeDescriptions[lt.id] || ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
