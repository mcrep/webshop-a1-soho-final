import { Plus, X } from "lucide-react";
import type { Line } from "@/types";

type LineTabsProps = {
  lines: Line[];
  activeLineId: string | null;
  onSelectLine: (id: string) => void;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
};

export function LineTabs({
  lines,
  activeLineId,
  onSelectLine,
  onAddLine,
  onRemoveLine,
}: LineTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {lines.map((line, idx) => (
        <div
          key={line.id}
          className={`group relative rounded-xl border transition-all ${
            activeLineId === line.id
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border bg-card hover:bg-muted"
          }`}
        >
          <button
            onClick={() => onSelectLine(line.id)}
            className="px-4 py-2 pr-8 text-sm font-medium"
          >
            Linija {idx + 1}
          </button>
          {lines.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveLine(line.id);
              }}
              className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                activeLineId === line.id
                  ? "hover:bg-primary-foreground/20 text-primary-foreground"
                  : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              }`}
              title="Ukloni liniju"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAddLine}
        className="rounded-xl border border-dashed border-border bg-card hover:bg-muted transition-colors p-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        title="Dodaj novu liniju"
      >
        <Plus size={16} />
        <span>Dodaj liniju</span>
      </button>
    </div>
  );
}
