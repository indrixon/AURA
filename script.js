import { turso } from './turso-config.js';

// ──────────────── PANIER ────────────────
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// ──────────────── AFFICHAGE DES PARFUMS (TURSO SQL) ────────────────
async function displayPerfumes() {
  const grid = document.getElementById('perfumeGrid');
  if (!grid) return;

  grid.innerHTML = '<p style="color:#aaa;text-align:center;">Chargement du catalogue Turso...</p>';

  try {
    // Requête SQL pour récupérer les parfums approuvés
    const rs = await turso.execute("SELECT * FROM perfumes WHERE status = 'approved' ORDER BY id DESC");

    if (rs.rows.length === 0) {
      grid.innerHTML = '<p style="color:#aaa;text-align:center;">Aucun parfum disponible dans la base.</p>';
      return;
    }

    grid.innerHTML = '';
    rs.rows.forEach(p => {
      const card = document.createElement('div');
      card.className = 'perfume-card';

      // Utilisation des colonnes SQL (p.imageUrl, p.name, etc.)
      const imgSrc = p.imageUrl
        ? escapeHtml(p.imageUrl)
        : 'https://placehold.co/400x300?text=AURA';

      card.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(p.name)}"
             onerror="this.src='https://placehold.co/400x300?text=AURA'">
        <div class="perfume-info">
          <div class="perfume-name">${escapeHtml(p.name)}</div>
          <div class="perfume-price">${Number(p.price).toLocaleString()} FCFA</div>
          <div class="perfume-desc">${escapeHtml(p.description || 'Fragrance envoûtante')}</div>
          <button class="btn-add"
            data-id="${p.id}"
            data-name="${escapeHtml(p.name)}"
            data-price="${p.price}">Ajouter au panier</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Gestion des clics sur "Ajouter au panier"
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart({
          id:       btn.dataset.id,
          name:     btn.dataset.name,
          price:    parseInt(btn.dataset.price),
          quantity: 1
        });
      });
    });
  } catch (err) {
    grid.innerHTML = `<p style="color:#e55;text-align:center;">Erreur Turso : ${err.message}</p>`;
    console.error("Détails de l'erreur :", err);
  }
}

// ──────────────── LOGIQUE PANIER (Inchangée) ────────────────
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  animateCartIcon();
}

function updateCartUI() {
  const cartItemsDiv  = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <span><strong>${escapeHtml(item.name)}</strong> x${item.quantity}</span>
        <span>${(item.price * item.quantity).toLocaleString()} FCFA
          <button class="btn-outline" style="padding:2px 8px; margin-left:8px;"
            onclick="window.removeFromCart(${idx})">✖</button>
        </span>
      </div>
    `;
  });

  if (cartTotalSpan) cartTotalSpan.innerText = total.toLocaleString();
  updateCartCount();
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
};

window.toggleCart = function() {
  document.getElementById('cartSidebar').classList.toggle('open');
};

function animateCartIcon() {
  const btn = document.getElementById('cartFloatingBtn');
  if (btn) {
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
  }
}

window.checkout = function() {
  if (cart.length === 0) { alert("Votre panier est vide."); return; }

  let details = "";
  cart.forEach(item => {
    details += `✨ ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA%0A`;
  });

  const totalPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  let message  = `🕯️ COMMANDE AURA BY CARSON 🕯️%0A%0A`;
  message += details;
  message += `%0A💰 *TOTAL : ${totalPrice.toLocaleString()} FCFA*%0A`;

  const phone = "22871048481";
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
};

function updateCartCount() {
  const stored = JSON.parse(localStorage.getItem('cart')) || [];
  const count  = stored.reduce((s, i) => s + i.quantity, 0);
  const span   = document.getElementById('cartCount');
  if (span) span.innerText = count;
}

// ──────────────── INIT ────────────────
displayPerfumes();
updateCartUI();
setInterval(updateCartCount, 1000);
