# AGENTS.md

- Highlighted ("hero") devices are declared as data in `src/data/catalog.ts` (`hero`, `heroLabel`, `heroReason`) and rendered through the shared `src/components/devices/DeviceHeroBadge.tsx` (`DeviceHeroBadge`, `heroFirst`, `isHeroDevice`) — so every device list stays consistent and swapping the hero device needs no UI changes. Why: the user wants to change which devices are highlighted without touching components.
