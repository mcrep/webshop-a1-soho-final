

## Discount Banner on Device Images

### Overview
Adding a red discount banner overlaid on device photos (matching the reference screenshot style) in both the Device List Modal and Device Detail Modal. The discount is driven by a new `mpcOverride` field on each device -- the final price displayed becomes `upfront - mpcOverride`.

### Data Model Change

**`src/types/index.ts`** -- Add optional `mpcOverride` to `Device` type:
- `mpcOverride?: number` -- the discount amount in EUR

**`src/types/index.ts`** -- Add optional `mpcOverride` to `DeviceVariant` type as well, so discounts can vary per variant (color/memory combo).

**`src/data/catalog.ts`** -- Add sample `mpcOverride` values to devices and their variants. For example:
- iPhone 15: `mpcOverride: 124` (and corresponding per-variant values)
- Galaxy S24: `mpcOverride: 80`
- Pixel 8: `mpcOverride: 50`

### UI Changes

#### 1. Device List Modal (`src/components/modals/DeviceListModal.tsx`)

On each device card, overlay a red discount badge in the bottom-right corner of the device image (matching the reference: red background, white text, "-XX EUR" format):

```text
+---------------------------+
|                           |
|     [device photo]        |
|                    +------+
|                    |-124 EUR|
+--------------------+------+
| Brand                     |
| Name                      |
| EUR XXX (was EUR YYY)     |
+---------------------------+
```

- Show the banner only when `device.mpcOverride > 0`
- Update the price display: show the original `upfront` crossed out, and the discounted price (`upfront - mpcOverride`) as the main price

#### 2. Device Detail Modal (`src/components/modals/DeviceDetailModal.tsx`)

- Same red discount badge overlaid on the main gallery image (bottom-right corner)
- The badge amount updates based on the selected variant's `mpcOverride` (falling back to the device-level value)
- Update all pricing calculations to use `upfront - mpcOverride` as the base price
- Show original price crossed out next to the discounted price in the pricing section

### Visual Style (matching reference)
- Badge: `bg-primary text-white font-bold` (A1 red)
- Position: `absolute bottom-4 right-4`
- Text format: `-{amount} EUR`
- Rounded corners, padding for readability
- No rotation or skew -- clean rectangular badge like in the screenshot

### Technical Details

Files to modify:
1. `src/types/index.ts` -- add `mpcOverride` to `Device` and `DeviceVariant`
2. `src/data/catalog.ts` -- add sample discount values
3. `src/components/modals/DeviceListModal.tsx` -- discount badge on card image + updated pricing
4. `src/components/modals/DeviceDetailModal.tsx` -- discount badge on gallery image + updated pricing calculations

