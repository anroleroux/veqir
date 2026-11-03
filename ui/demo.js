/* ============================================================
   demo.js — the offline seed.

   Fills the catalogue models (categories, products, specs, meshes,
   shipping_methods) in localStorage so a visitor lands on a stocked
   shop. They are reseeded whenever DEMO_VERSION changes, so an edit
   here reaches browsers that already hold an older copy. The
   shopper's own models (cart_items, orders, order_items) are never
   touched — those only ever come from using the shop.

   dev-only: once an online build exists it reads the real back end
   and this file stays out of its map. Keep the rows in step with the
   models documented in the README.
   ============================================================ */

var DEMO_VERSION = 10;

/* Specs are their own model (one row per label/value, ordered by
   `position`); they are written inline here only to keep the seed
   readable, and flattened into the `specs` key below. */
var DEMO_PRODUCTS = [
    /* vequir-unit's PICO2W (products/PICO2W/board): still and mesh by
       make/neobotics.py, `design` its page. */
    { id: 25, category_id: 1, slug: "pico2w", name: "Raspberry Pi Pico 2 W", code: "PICO 2 W", price: 135, stock: 60,
      image: "img/products/pico2w.webp",
      design: "https://anroleroux.co.za/vequir-unit/products/PICO2W/board/index.html",
      blurb: "RP2350 with Wi‑Fi and Bluetooth. Castellated, so it solders flat or takes headers.",
      specs: [["Core", "Dual Cortex‑M33 or Hazard3 RISC‑V, 150 MHz"], ["Flash / SRAM", "4 MB / 520 KB"], ["Wireless", "Wi‑Fi 4 (2.4 GHz), Bluetooth 5.2"], ["GPIO", "26"], ["Logic level", "3.3 V"], ["USB / size", "Micro‑USB, 51 × 21 mm"]],
      meshes: [["board", "#1f7a4d"]] },
    { id: 6, category_id: 2, slug: "buck", name: "MP1584 Buck 3A", code: "MP1584", price: 45, stock: 200,
      blurb: "Step it down. Efficiently.",
      specs: [["Input", "4.5 – 28 V"], ["Output", "0.8 – 20 V, adj."], ["Current", "3 A max"], ["Efficiency", "up to 92%"], ["Switching", "1.5 MHz"], ["Size", "22 × 17 mm"]] },
    { id: 7, category_id: 2, slug: "boost", name: "MT3608 Boost 2A", code: "MT3608", price: 35, stock: 160,
      blurb: "Step it up. From one cell to 28 V.",
      specs: [["Input", "2 – 24 V"], ["Output", "up to 28 V, adj."], ["Current", "2 A max"], ["Efficiency", "up to 93%"], ["Switching", "1.2 MHz"], ["Size", "36 × 17 mm"]] },
    { id: 8, category_id: 2, slug: "tp4056", name: "LiPo Charger USB‑C", code: "TP4056", price: 30, stock: 3,
      blurb: "Single-cell charging with protection. USB‑C in.",
      specs: [["Input", "5 V, USB‑C"], ["Charge current", "1 A, adj."], ["Cutoff", "4.2 V ±1%"], ["Protection", "DW01A + FS8205"], ["Indicators", "Charge / Done LED"], ["Size", "28 × 17 mm"]] },
    { id: 9, category_id: 2, slug: "psu", name: "Bench PSU 30V 5A", code: "PSU‑305", price: 1399, stock: 12,
      blurb: "Linear-quiet, switching-efficient. CV/CC with four-digit readout.",
      specs: [["Output", "0 – 30 V, 0 – 5 A"], ["Mode", "CV / CC"], ["Ripple", "< 10 mVpp"], ["Display", "4-digit V / A"], ["Protection", "OCP, OVP, OTP"], ["Weight", "2.1 kg"]] },
    { id: 10, category_id: 3, slug: "iron", name: "Soldering Station 90W", code: "TS‑90", price: 1149, stock: 18,
      blurb: "Hot in 8 seconds. Holds temp under load.",
      specs: [["Power", "90 W"], ["Range", "150 – 450 °C"], ["Heat-up", "≈ 8 s to 350 °C"], ["Tips", "T12 compatible"], ["ESD", "Grounded tip"], ["Display", "OLED"]] },
    { id: 11, category_id: 3, slug: "dmm", name: "Auto‑Range Multimeter", code: "DMM‑6000", price: 699, stock: 25,
      blurb: "True RMS, 6000 counts. Measures V, I and R — naturally.",
      specs: [["Counts", "6000"], ["DC V", "600 mV – 600 V"], ["Current", "up to 10 A"], ["Resistance", "600 Ω – 60 MΩ"], ["True RMS", "Yes"], ["Safety", "CAT III 600 V"]] },
    { id: 12, category_id: 3, slug: "logic", name: "Logic Analyzer 8ch", code: "LA‑8", price: 329, stock: 40,
      blurb: "Eight channels, 24 MHz. Decode I²C, SPI, UART and more.",
      specs: [["Channels", "8"], ["Sample rate", "24 MS/s"], ["Input", "0 – 5 V"], ["Protocols", "I²C, SPI, UART, CAN"], ["Software", "sigrok / PulseView"], ["Connection", "USB‑C"]] },
    { id: 13, category_id: 3, slug: "bb", name: "Breadboard 830", code: "BB‑830", price: 89, stock: 300,
      blurb: "830 tie points. Grips tight, releases clean.",
      specs: [["Tie points", "830"], ["Power rails", "4"], ["Contacts", "Phosphor bronze"], ["Wire gauge", "20 – 29 AWG"], ["Backing", "Adhesive"], ["Size", "165 × 55 mm"]] },
    { id: 14, category_id: 4, slug: "load", name: "VequIR Ω‑1 Electronic Load", code: "Ω‑1", price: 1599, stock: 7,
      blurb: "Constant current, power and resistance. Test every supply you own.",
      specs: [["Modes", "CC, CP, CR"], ["Rating", "0 – 30 V, 0 – 10 A, 150 W"], ["Resolution", "1 mA / 10 mV"], ["Cooling", "Active, temp-controlled"], ["Interface", "USB‑C serial"], ["Display", "2\" IPS"]] },
    { id: 15, category_id: 4, slug: "meter", name: "VequIR Spark USB Meter", code: "SPARK", price: 519, stock: 54,
      blurb: "In-line V, A and W for any USB‑C cable. PD sniffing included.",
      specs: [["Range", "4 – 48 V, 0 – 6 A"], ["Accuracy", "±0.5%"], ["Protocols", "USB PD 3.1, QC"], ["Logging", "10k samples"], ["Display", "0.96\" OLED"], ["Size", "42 × 18 mm"]] },
    { id: 16, category_id: 4, slug: "node", name: "VequIR Node N1", code: "NODE N1", price: 599, stock: 2,
      blurb: "Battery sensor node. Sleeps at 8 µA, wakes on anything.",
      specs: [["MCU", "ESP32‑C6"], ["Wireless", "Wi‑Fi 6, BLE, Thread"], ["Sleep current", "8 µA"], ["Sensors", "Temp, RH, pressure, light"], ["Battery", "18650 holder"], ["Expansion", "Qwiic / STEMMA"]] },
    { id: 17, category_id: 4, slug: "pulse", name: "VequIR Pulse Generator", code: "PULSE", price: 1049, stock: 15,
      blurb: "Square, sine, triangle — and anything you can draw.",
      specs: [["Channels", "2"], ["Bandwidth", "10 MHz sine"], ["Sample rate", "125 MS/s"], ["Amplitude", "±10 V"], ["Waveforms", "4 + arbitrary"], ["Interface", "USB‑C, rotary"]] },
    /* From vequir-power's parts library (battery_holders/…), built with
       neoBotics: the still and the meshes are exported by make/neobotics.py,
       and `design` links the item's page on vequir-power's catalogue site.
       Meshes are [name, colour] — the file is ui/models/<slug>/<name>.stl. */
    { id: 18, category_id: 2, slug: "holder-18650", name: "18650 Holder, Single", code: "18650 ×1", price: 35, stock: 85,
      image: "img/products/holder-18650.webp",
      design: "https://anroleroux.co.za/vequir-power/library/battery_holders/single_18650_holder/index.html",
      blurb: "One cell, two Keystone clips, solder lugs out the ends. Bolts to its neighbours.",
      specs: [["Cells", "1 × 18650"], ["Size", "76 × 21 × 20 mm"], ["Contacts", "Keystone 1107‑1 clips"], ["Terminals", "Solder lug, each end"], ["Joining", "M1.2 tap holes in both end faces"], ["Included", "Holder, 2 clips — no cell"]],
      meshes: [["holder", "#38383d"], ["cell", "#e08f3d"], ["clips", "#ccccd1"]] },
    { id: 19, category_id: 2, slug: "pack-18650-6", name: "18650 Six-Pack Holder", code: "18650 ×6", price: 239, stock: 24,
      image: "img/products/pack-18650-6.webp",
      design: "https://anroleroux.co.za/vequir-power/library/battery_holders/pack_3x2/index.html",
      blurb: "Six single holders, three wide and two deep, locked together by an end strip at each end.",
      specs: [["Cells", "6 × 18650, 3 × 2"], ["Size", "80.4 × 63 × 40 mm"], ["Contacts", "12 × Keystone 1107‑1 clips"], ["Joining", "2 end strips, 24 × M1.2 × 6 screws"], ["Mounting", "2 tabs per strip, M1.2"], ["Included", "Holders, clips, strips, screws — no cells"]],
      meshes: [["holders", "#38383d"], ["cells", "#e08f3d"], ["clips", "#ccccd1"], ["strips", "#4c5461"], ["screws", "#b3b3b8"]] },
    /* vequir-unit's product PB6 (products/PB6), a powerbank: the six-cell
       pack and its USB boards in the enclosure, under the lid — hide the
       lid layer to look inside. `design` links its vequir-unit page. */
    { id: 20, category_id: 4, slug: "pb6", name: "VequIR PB6 Powerbank", code: "PB6", price: 879, stock: 9,
      image: "img/products/pb6.webp",
      design: "https://anroleroux.co.za/vequir-unit/products/PB6/index.html",
      blurb: "Six 18650 cells in one enclosure. Charge it over USB‑C; charge your phone and anything else from its two USB‑A ports.",
      specs: [["Battery", "6 × 18650 pack, 2S3P, 8.4 V full"], ["Size", "140 × 69 × 53 mm"], ["Charging", "CN3302 2S boost charger, USB‑C in"], ["USB out", "2 × USB‑A fast charge (IP6505)"], ["Cell mounting", "Pack screwed to 4 pillars, 8 × M1.2"], ["Cells", "Not included"]],
      meshes: [["lid", "#66ad73"], ["base", "#5c8fc7"], ["holders", "#38383d"], ["cells", "#e08f3d"], ["clips", "#ccccd1"], ["strips", "#4c5461"], ["screws", "#b3b3b8"], ["chargers", "#26734c"]] },
    /* From vequir-standard's parts library, built with neoBotics: stills
       and meshes by make/neobotics.py (one layer each), `design` its page. */
    { id: 21, category_id: 2, slug: "cell-18650", name: "18650 Li‑ion Cell", code: "18650", price: 79, stock: 140,
      image: "img/products/cell-18650.webp",
      design: "https://anroleroux.co.za/vequir-standard/library/batteries/cell_18650/index.html",
      blurb: "The cell every VequIR holder and pack is sized for. Button top, flat negative.",
      specs: [["Size", "18.4 × 65 mm, button included"], ["Chemistry", "Li‑ion"], ["Nominal", "3.6 V, 4.2 V full"], ["Capacity", "3000 mAh"], ["Positive", "7 mm button, 1 mm proud"], ["Fits", "18650 Holder, Six-Pack, PB6"]],
      meshes: [["cell", "#e08f3d"]] },
    { id: 22, category_id: 2, slug: "clip-1107", name: "Keystone 1107‑1 Battery Clip", code: "1107‑1", price: 6.5, stock: 600,
      image: "img/products/clip-1107.webp",
      design: "https://anroleroux.co.za/vequir-standard/library/terminals/keystone_1107_1/index.html",
      blurb: "Spring clip with a solder lug. Hooks over a 1 mm wall — two per 18650 holder.",
      specs: [["Size", "6.35 × 13.7 mm, 4.0 mm deep"], ["Material", "Tin‑nickel plated spring steel"], ["Cells", "AA, A, 17500, 18350, 18650, C, D"], ["Terminal", "Solder lug, 1.8 mm hole"], ["Wall", "Hooks over 1 mm"], ["Fits", "18650 Holder (2 per holder)"]],
      meshes: [["clip", "#ccccd1"]] },
    { id: 23, category_id: 5, slug: "screw-m1-2x6", name: "M1.2 × 6 Countersunk Screws, 50", code: "M1.2 × 6", price: 49, stock: 75,
      image: "img/products/screw-m1-2x6.webp",
      design: "https://anroleroux.co.za/vequir-standard/library/fasteners/m1_2x6_countersunk/index.html",
      blurb: "Slotted flat‑head screws that join 18650 holders into packs and fix packs down.",
      specs: [["Standard", "DIN 963, slotted countersunk"], ["Thread", "M1.2 × 0.25"], ["Length", "6 mm overall"], ["Head", "2.3 mm, 90°"], ["Tap hole", "0.95 mm"], ["Pack", "50 screws"]],
      meshes: [["screw", "#b3b3b8"]] },
    /* Bought in from DIY Electronics; modelled in vequir-power's library
       (protection_boards/bms_3s_20a): still and mesh by make/neobotics.py. */
    { id: 24, category_id: 2, slug: "bms-3s-20a", name: "3S Li‑ion BMS 20A", code: "3S BMS", price: 89, stock: 30,
      image: "img/products/bms-3s-20a.webp",
      design: "https://anroleroux.co.za/vequir-power/library/protection_boards/bms_3s_20a/index.html",
      blurb: "Protection board for a three-cell 18650 or 26650 pack. Charge at 12.6 V, draw up to 20 A.",
      specs: [["Cells", "3S, 3.6 – 3.7 V nominal"], ["Output", "20 A, 252 W max"], ["Charge voltage", "12.6 V"], ["Charge max", "12.75 V — do not exceed"], ["Fits", "18650 / 26650 Li‑ion, LiPo"], ["Size", "64 × 20 × 3.4 mm"]],
      meshes: [["board", "#2a5d9f"]] }
];

function seedDemo() {
    var stale = Number(localStorage.getItem("demo_version")) !== DEMO_VERSION;

    if (stale || !localStorage.getItem("categories")) {
        saveLocal("categories", [
            { id: 1, slug: "microcontrollers", name: "Microcontrollers", house: false, position: 1 },
            { id: 2, slug: "power", name: "Power", house: false, position: 2 },
            { id: 3, slug: "tools", name: "Tools", house: false, position: 3 },
            { id: 5, slug: "hardware", name: "Hardware", house: false, position: 4 },
            { id: 4, slug: "vequir-devices", name: "VequIR devices", house: true, position: 5 }
        ]);
    }

    if (stale || !localStorage.getItem("products")) {
        saveLocal("products", DEMO_PRODUCTS.map(function (p) {
            return { id: p.id, category_id: p.category_id, slug: p.slug, name: p.name, code: p.code,
                     price: p.price, stock: p.stock, blurb: p.blurb, image: p.image || null,
                     design: p.design || null, position: p.id };
        }));
    }

    if (stale || !localStorage.getItem("specs")) {
        var specs = [];
        DEMO_PRODUCTS.forEach(function (p) {
            p.specs.forEach(function (s, i) {
                specs.push({ id: specs.length + 1, product_id: p.id, label: s[0], value: s[1], position: i + 1 });
            });
        });
        saveLocal("specs", specs);
    }

    if (stale || !localStorage.getItem("meshes")) {
        var meshes = [];
        DEMO_PRODUCTS.forEach(function (p) {
            (p.meshes || []).forEach(function (m, i) {
                meshes.push({ id: meshes.length + 1, product_id: p.id, name: m[0],
                              file: "models/" + p.slug + "/" + m[0] + ".stl", color: m[1], position: i + 1 });
            });
        });
        saveLocal("meshes", meshes);
    }

    if (stale || !localStorage.getItem("shipping_methods")) {
        saveLocal("shipping_methods", [
            { id: 1, name: "Standard", eta: "3–5 days", price: 89, free_over: 900, position: 1 },
            { id: 2, name: "Express", eta: "Next day", price: 229, free_over: null, position: 2 }
        ]);
    }

    try { localStorage.setItem("demo_version", String(DEMO_VERSION)); } catch (e) { /* blocked */ }
}
