/* ---- product — one part: tile or 3D view, price, quantity and specs ---- */

function productTemplate(state) {
    if (!state.current) return "";
    var p = productById(state.current);
    if (!p) return "";
    var cat = categoryById(p.category_id);
    var room = roomFor(p.id);           // stock not already in the cart
    var qty = Math.min(state.qty, Math.max(room, 1));

    var buy = p.stock <= 0
        ? '<button class="btn" type="button" disabled>Out of stock</button>'
        : room <= 0
            ? '<button class="btn" type="button" disabled>All stock in cart</button>'
            : '<button class="btn btn--blue" type="button" onclick="addFromProduct()">Add to cart — ' + money(p.price * qty) + '</button>';

    var specs = specsOf(p.id).map(function (s) {
        return '<div class="spec"><span class="spec__k">' + esc(s.label) + '</span>' +
                   '<span class="spec__v">' + esc(s.value) + '</span></div>';
    }).join("");

    // the part's page in its vequir design catalogue (vequir-power, vequir-unit, …)
    var design = p.design
        ? '<div class="spec spec--design"><span class="spec__k">Design</span>' +
              '<a class="spec__v design-link" href="' + esc(p.design) + '" target="_blank" rel="noopener">' +
                  esc(designSource(p.design)) + ' <span class="design-link__more">— 3D model, STEP, STL ↗</span></a>' +
          '</div>'
        : "";

    return '<section class="view view--product">' +
               '<a class="back-link" ' + linkAttrs(categoryPath(cat && cat.slug), "openList(" + (cat ? "'" + esc(cat.slug) + "'" : "null") + ")") + '>' +
                   '← ' + esc(cat ? cat.name : "All parts") + '</a>' +
               '<div class="pdp">' +
                   // a part with a model leaves its tile empty: the
                   // viewer (comps/viewer.js) moves its live figure in
                   (meshesOf(p.id).length
                       ? '<div class="' + tileClass(p) + ' pdp__tile pdp__tile--3d" data-viewer="' + p.id + '"></div>'
                       : '<div class="' + tileClass(p) + ' pdp__tile">' + tileArt(p) +
                             '<span class="pdp__sku">SKU ' + esc(p.slug.toUpperCase()) + '</span>' +
                         '</div>') +
                   '<div class="pdp__info">' +
                       '<div class="pdp__intro">' +
                           '<h1 class="display">' + esc(p.name) + '</h1>' +
                           '<p class="pdp__blurb">' + esc(p.blurb) + '</p>' +
                       '</div>' +
                       '<div class="pdp__price-row">' +
                           '<span class="pdp__price">' + money(p.price) + '</span>' +
                           '<span class="stock"><span class="stock__dot' + (p.stock <= 0 ? ' stock__dot--out' : '') + '"></span>' +
                               stockLabel(p) + '</span>' +
                       '</div>' +
                       '<div class="pdp__buy">' +
                           '<div class="stepper">' +
                               '<button type="button" onclick="productQty(-1)" aria-label="One fewer"' + (qty <= 1 ? ' disabled' : '') + '>−</button>' +
                               '<span class="stepper__n" aria-live="polite">' + qty + '</span>' +
                               '<button type="button" onclick="productQty(1)" aria-label="One more"' + (qty >= room ? ' disabled' : '') + '>+</button>' +
                           '</div>' +
                           buy +
                       '</div>' +
                       '<div class="specs">' +
                           '<h2 class="label">Specs</h2>' + specs + design +
                       '</div>' +
                   '</div>' +
               '</div>' +
           '</section>';
}

// "vequir-power" from https://anroleroux.co.za/vequir-power/library/…: the
// catalogue a design link points into (its first path segment), else its host
function designSource(url) {
    var m = /^https?:\/\/([^\/]+)\/([^\/]+)/.exec(url);
    return m ? m[2] : url;
}

var product = mount(
    document.getElementById("product"),
    { current: null, qty: 1 },
    productTemplate
);

function productQty(step) {
    var room = roomFor(product.current);
    product.qty = Math.max(1, Math.min(product.qty + step, room));
}

function addFromProduct() {
    if (addToCart(product.current, product.qty)) {
        product.qty = 1;
        openCart();
    }
}
