import { Sparkles } from "lucide-react";
import type { Device } from "@/types";

/** A device is "hero" when the catalog flags it as highlighted. */
export const isHeroDevice = (device: Pick<Device, "hero">) => Boolean(device.hero);

/** Badge text for a hero device, with a safe default. */
export const heroLabel = (device: Pick<Device, "heroLabel">) =>
  device.heroLabel?.trim() || "Istaknuto";

/** Hero devices come first; every other device keeps the incoming order. */
export function heroFirst<T extends Pick<Device, "hero">>(list: T[]): T[] {
  return [...list].sort(
    (a, b) => Number(isHeroDevice(b)) - Number(isHeroDevice(a))
  );
}

type DeviceHeroBadgeProps = {
  device: Pick<Device, "hero" | "heroLabel">;
  /** "light" is for dark / colored backgrounds (e.g. gradient modal headers). */
  tone?: "primary" | "light";
  className?: string;
};

export function DeviceHeroBadge({
  device,
  tone = "primary",
  className = "",
}: DeviceHeroBadgeProps) {
  if (!device.hero) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm ${
        tone === "light"
          ? "bg-card text-primary"
          : "bg-primary text-primary-foreground"
      } ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {heroLabel(device)}
    </span>
  );
}
