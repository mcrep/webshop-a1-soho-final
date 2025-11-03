import { Info } from "lucide-react";
import { LineRow } from "./LineRow";
import type { Line } from "@/types";

type LineConfiguratorProps = {
  lines: Line[];
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onUpdateLine: (id: string, patch: Partial<Line>) => void;
  onOpenTariffModal: (id: string) => void;
  onOpenDeviceModal: (id: string) => void;
  onOpenAddonsModal: (id: string) => void;
  walletTotal: number;
  walletRemaining: number;
};

export function LineConfigurator({
  lines,
  onAddLine,
  onRemoveLine,
  onUpdateLine,
  onOpenTariffModal,
  onOpenDeviceModal,
  onOpenAddonsModal,
  walletTotal,
  walletRemaining,
}: LineConfiguratorProps) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-4 flex items-center justify-end">
        <button
          onClick={onAddLine}
          className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          Želim još jednu liniju
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="rounded-2xl border border-primary/20 bg-accent px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm flex items-center gap-2 relative group">
            <Info size={16} className="text-accent-foreground cursor-pointer" />
            <span className="font-semibold">A1 Wallet stanje:</span> €{walletTotal.toFixed(2)}
            <span className="text-accent-foreground/80">
              (zbraja se po odabranoj tarifi, može se iskoristiti za uređaje)
            </span>
            <div className="absolute top-6 left-0 bg-popover text-popover-foreground text-xs border border-border rounded-lg shadow-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 z-10">
              Za cijelo stanje walleta molimo vas da se prijavite u sustav
            </div>
          </div>
          <div className="text-xs text-accent-foreground">
            Raspoloživo za potrošnju: €{walletRemaining.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="border-t border-border divide-y divide-border">
        {lines.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center">
            Još nema linija. Klikni <span className="font-medium">Želim još jednu liniju</span>.
          </div>
        ) : (
          lines.map((line, idx) => {
            const sumUsedOthers = lines.reduce(
              (sum, l) => sum + (l.id === line.id ? 0 : l.walletUse ?? 0),
              0
            );
            const avail = Math.max(0, walletTotal - sumUsedOthers);
            return (
              <LineRow
                key={line.id}
                index={idx}
                line={line}
                onChange={(patch) => onUpdateLine(line.id, patch)}
                onRemove={() => onRemoveLine(line.id)}
                onOpenTariffModal={() => onOpenTariffModal(line.id)}
                onOpenDeviceModal={() => onOpenDeviceModal(line.id)}
                onOpenAddonsModal={() => onOpenAddonsModal(line.id)}
                walletAvailForLine={avail}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
