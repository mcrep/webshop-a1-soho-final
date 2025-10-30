export function Header() {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="mx-auto max-w-[1600px] px-4 py-4">
        <div className="lg:pl-[96px] flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-foreground text-background grid place-items-center text-sm font-bold">
            A1
          </div>
          <div>
            <h1 className="text-lg font-semibold">Business Webshop</h1>
            <p className="text-xs text-muted-foreground">
              Konfigurator tarifa za male poslovne korisnike
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
