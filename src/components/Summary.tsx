type SummaryProps = {
  monthly: number;
  onetime: number;
  lineCount: number;
};

export function Summary({ monthly, onetime, lineCount }: SummaryProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Sažetak narudžbe</h2>
        <div className="text-xs text-muted-foreground">Linije: {lineCount}</div>
      </div>
      <div className="mt-3 grid gap-3 text-sm">
        <Stat label="Ukupno mjesečno" value={`€${monthly.toFixed(2)}`} strong />
        <Stat label="Jednokratno (uređaji)" value={`€${onetime.toFixed(2)}`} />
        <div className="flex items-center justify-end">
          <a
            href="#"
            className="rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            Završi narudžbu
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Sve cijene su bez PDV-a. Demo izračun na temelju odabranih linija.
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-border p-3 ${
        strong ? "font-semibold bg-accent/50" : "bg-card"
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
