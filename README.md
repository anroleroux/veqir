# vequir

The VequIR online shop — microcontrollers, power modules, bench tools and
VequIR's own devices. Built the **unframe** way (see
`.claude/skills/unframe/SKILL.md`): plain HTML/CSS/JS, a ~120-line Proxy
reactivity core, and an `awk`-based Makefile that composes everything into one
static `ui/dist/index.html`. No framework, no npm.

Served at **anroleroux.co.za/vequir** (the `anroleroux` GitHub Pages project
site under the user site's custom domain).

## Status

A straight port of the design prototype (`VeqIR Shop.dc.html`) to unframe.
It is the **offline build only**: the catalogue is seeded into localStorage
by `ui/demo.js`, cart and orders live in the browser, and checkout takes no
payment. A back end (Supabase or Go + Postgres) and the `stg`/`prd` builds
come later, behind `//online` markers.

## Build

```bash
make dev                  # → ui/dist/index.html (+ 404.html, img/)
make dev BASE=/vequir/     # what the Pages workflow builds
make clean
```

`BASE` is written into `<base href>`; the router and every relative URL
resolve against it. The default (`/ui/dist/`) suits a static server at the
repo root. The page is also published as `404.html`, so deep links
(`/vequir/parts/psu`) load the app on GitHub Pages and the router opens the
right view.

`.github/workflows/pages.yml` builds and deploys on every push to **any
branch** — staging: the most recent push is what is live.
One-time setup: **Settings → Pages → Source: GitHub Actions**, and under
**Settings → Environments → github-pages → Deployment branches and tags**
allow all branches (by default only `main` may deploy).

## Layout

```
ui/
  layout.html  layout.css  layout.js  reactivity.js  demo.js
  comps/   header  listing  product  viewer  checkout  done  cart  search  toast
  img/     favicon.svg  products/<slug>.webp (part stills)
  models/  <slug>/<layer>.stl (3D parts' meshes)
make/      tpl.mk (compose macro)  js.map  web.map  neobotics.py
```

## 3D parts from the vequir catalogues

Parts designed with [neoBotics](https://github.com/anroleroux/neoBotics)
live in three catalogue repositories, each with its own product page:

| Repository | Holds | Page |
|---|---|---|
| [vequir-standard](https://github.com/anroleroux/vequir-standard) | standard parts: the 18650 cell, the Keystone 1107-1 clip, the M1.2 screw | [anroleroux.co.za/vequir-standard](https://anroleroux.co.za/vequir-standard/) |
| [vequir-power](https://github.com/anroleroux/vequir-power) | the single 18650 holder and the six-cell pack, and their parts; the 3S BMS | [anroleroux.co.za/vequir-power](https://anroleroux.co.za/vequir-power/) |
| [vequir-unit](https://github.com/anroleroux/vequir-unit) | the PB6 powerbank; the Raspberry Pi Pico 2 W | [anroleroux.co.za/vequir-unit](https://anroleroux.co.za/vequir-unit/) |

The 18650 cell, the Keystone 1107-1 clip and the M1.2 × 6 screws
(vequir-standard), the single 18650 holder, the six-cell pack and the 3S
BMS (vequir-power), and the PB6 powerbank (vequir-unit, `neobotics build PB6`)
and the Raspberry Pi Pico 2 W (vequir-unit, `PICO2W/board`)
carry a
rendered still for their tile and an interactive model on their page
(`comps/viewer.js`: drag to turn, scroll to zoom, hide or see through each
layer). The page opens on the still with an **Enable 3D** button, so
nothing extra is downloaded unless the shopper asks: only then does the
viewer load three.js 0.160.0 from jsDelivr (pinned in `layout.html`'s
import map) and the meshes. The choice is remembered in this browser
(localStorage `viewer_3d` = `"1"`), so later models open in 3D straight
away until **disable 3D** under the viewer turns it off. If three.js or a
mesh fails, the still stays in its place.

`make/neobotics.py` brings an assembly or a single part over from a
neoBotics build. For an assembly it merges the component STLs into one per
colour (a layer) and turns `part.png` into the still; a single part takes
one layer, and its still is drawn again in that layer's colour.

```bash
# in vequir-power (with neoBotics and vequir-standard cloned beside it):
#   neobotics build library/battery_holders/pack_3x2
python make/neobotics.py ../vequir-power/results/library/battery_holders/pack_3x2/_assembly/cad \
    pack-18650-6 holders=#38383d cells=#e08f3d clips=#ccccd1 strips=#4c5461 screws=#b3b3b8
```

```bash
# a single part, in vequir-standard: neobotics build library/batteries/cell_18650
python make/neobotics.py ../vequir-standard/results/library/batteries/cell_18650/cad cell-18650 cell=#e08f3d
```

Then add or update the product, its `meshes` rows and its `design` link
(the item's page on its catalogue's site) in `ui/demo.js`.

## Routes

| Path | View |
|---|---|
| `""` | All parts |
| `<category.slug>` | One category |
| `parts/<product.slug>` | Product detail |
| `checkout` | Checkout |
| `order/<orders.number>` | Order receipt |

Keys: `/` opens search, `Esc` closes search or the cart.

## Models

One localStorage key per model, each a JSON array of rows. Relations are ids.

### `categories` (catalogue)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `slug` | text | unique; URL segment |
| `name` | text | |
| `house` | boolean | VequIR's own range — tiles drawn blue |
| `position` | integer | display order |

### `products` (catalogue)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `category_id` | integer | → `categories.id` |
| `slug` | text | unique; URL segment, shown as the SKU |
| `name` | text | |
| `code` | text | part code drawn on the tile |
| `price` | number | in South African rand (ZAR), shown as `R1,399.00` |
| `stock` | integer | units on hand; ≤ 5 shows "Only n left", 0 is out of stock |
| `blurb` | text | one-line description |
| `image` | text \| null | still for the tile, relative to the base (`img/products/<slug>.webp`); null draws the part code instead |
| `design` | text \| null | absolute URL of the part's page in its vequir design catalogue (e.g. `https://anroleroux.co.za/vequir-power/library/battery_holders/pack_3x2/index.html`): its 3D model, STEP, STL and script. Shown as a "Design" row under the specs, labelled with the catalogue's name (the URL's first path segment); null shows none |
| `position` | integer | "Featured" sort order |

### `specs` (catalogue)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `product_id` | integer | → `products.id` |
| `label` | text | e.g. "Core" |
| `value` | text | e.g. "Dual Cortex‑M0+, 133 MHz" |
| `position` | integer | order on the product page; the first two form the card's summary line |

### `meshes` (catalogue)

A part's 3D model, one row per layer. A product with meshes shows the
viewer on its page instead of its tile.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `product_id` | integer | → `products.id` |
| `name` | text | layer name shown on its chip, e.g. "cells" |
| `file` | text | binary STL, relative to the base (`models/<slug>/<name>.stl`); millimetres, z up |
| `color` | text | `#rrggbb` |
| `position` | integer | draw and chip order |

### `shipping_methods` (catalogue)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `name` | text | "Standard", "Express" |
| `eta` | text | "3–5 days" |
| `price` | number | |
| `free_over` | number \| null | subtotal at which it becomes free; null = never. The first method with a threshold drives the cart's free-shipping bar |
| `position` | integer | display order |

### `cart_items` (shopper)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `product_id` | integer | → `products.id`; one row per product |
| `qty` | integer | 1 … product stock |

### `orders` (shopper)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `number` | text | unique, `VQ-######` |
| `email`, `name`, `address`, `city`, `postcode` | text | contact / delivery |
| `shipping_method_id` | integer | → `shipping_methods.id` |
| `subtotal`, `shipping`, `total` | number | rounded to cents |
| `created_at` | text | ISO 8601 timestamp |

Card details are never stored.

### `order_items` (shopper)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `order_id` | integer | → `orders.id` |
| `product_id` | integer | → `products.id` |
| `qty` | integer | |
| `price` | number | unit price at the time of the order |

Placing an order also decrements `products.stock`.

### Seeding

`ui/demo.js` writes the five catalogue models, reseeding them whenever its
`DEMO_VERSION` changes (stored under `demo_version`). The shopper models are
never seeded or overwritten.
