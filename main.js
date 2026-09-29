
let shoppingCart = [
  {
    id: 'hand-cream',
    name: 'Restoring Care Hand Cream',
    price: 550,
    size: '75 ml',
    image: 'images/velune_poster.png',
    qty: 1
  }
];

const productsDatabase = [
  {
    id: 'hand-cream',
    category: 'hand',
    title: 'Restoring Care Hand Cream',
    actives: 'Coconut Oil & Sweet Almond Milk',
    price: 550,
    size: '75 ml',
    image: 'images/velune_poster.png',
    tag: 'BESTSELLER'
  },
  {
    id: 'body-lotion',
    category: 'lotions',
    title: 'Intense Care Body Lotion',
    actives: 'Ceramide Serum & Almond Oil',
    price: 2400,
    size: '400 ml',
    image: 'images/lotion.png',
    tag: 'DEEP MOISTURE'
  },
  {
    id: 'body-wash',
    category: 'washes',
    title: 'Moisture Boost Body Wash',
    actives: 'Hyaluronic Serum & Wild Aloe',
    price: 2200,
    size: '500 ml',
    image: 'images/bodywash.png',
    tag: 'HYDRATION'
  },
  {
    id: 'body-butter',
    category: 'butters',
    title: 'Glowing Care Body Butter',
    actives: 'Whipped Mango Butter & Vitamin C',
    price: 1999,
    size: '200 ml',
    image: 'images/bodybutter.png',
    tag: 'RADIANCE'
  },
  {
    id: 'body-scrub',
    category: 'butters',
    title: 'Radiance Renewal Body Scrub',
    actives: 'Crushed Macadamia & Rice Milk',
    price: 19.00,
    size: '298 g',
    image: 'images/bodyscrub.png',
    tag: 'EXFOLIATING'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initVolumeSwitcher();
  init3DTiltPoster();
  initCartDrawer();
  initCatalogFilters();
  updateCartUI();
});


function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function updatePosterVolumeContent(vol) {
  const posterImg = document.querySelector('.poster-img');
  const volumeTitle = document.querySelector('.pin-3 .tooltip-title');
  const volumeBody = document.querySelector('.pin-3 .tooltip-body');

  const volumeMeta = {
    '75ml': {
      title: '75ml Cargo Certified',
      body: 'Ergonomic size crafted for daily handbag carry and instant moisture restoration on the go.'
    },
    '150ml': {
      title: '150ml Cargo Certified',
      body: 'Travel-ready size for longer-lasting hydration with a richer, everyday skin ritual.'
    },
    '200ml': {
      title: '200ml Cargo Certified',
      body: 'A generous daily-care size designed for extended softness, replenishment, and ritual comfort.'
    }
  };

  if (posterImg && volumeMeta[vol]) {
    posterImg.alt = `Velune Restoring Care Hand Cream ${vol.replace('ml', ' ml')}`;
  }

  if (volumeTitle && volumeMeta[vol]) {
    volumeTitle.textContent = volumeMeta[vol].title;
  }

  if (volumeBody && volumeMeta[vol]) {
    volumeBody.textContent = volumeMeta[vol].body;
  }
}

function initVolumeSwitcher() {
  const volButtons = document.querySelectorAll('.vol-option-btn');
  const mainPrice = document.getElementById('price-main-display');
  const sizeLabel = document.getElementById('selected-vol-label');

  const volumePrices = {
    '75ml': { price: '550', num: 550, label: '75 ML / 2.5 FL. OZ.' },
    '150ml': { price: '1,100', num: 1100, label: '150 ML / 5.0 FL. OZ.' },
    '200ml': { price: '2,100', num: 2100, label: '200 ML / 6.7 FL. OZ.' }
  };

  volButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      volButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const vol = btn.getAttribute('data-vol');
      if (volumePrices[vol]) {
        const { price, num, label } = volumePrices[vol];
        if (mainPrice) mainPrice.textContent = price;
        if (sizeLabel) sizeLabel.textContent = label;
        updatePosterVolumeContent(vol);

        // Update hero item in cart database if present
        const heroItem = shoppingCart.find(i => i.id === 'hand-cream');
        if (heroItem) {
          heroItem.size = vol;
          heroItem.price = num;
          updateCartUI();
        }
      }
    });
  });
}


function init3DTiltPoster() {
  const posterWrapper = document.getElementById('poster-wrapper');
  if (!posterWrapper) return;

  const card = posterWrapper.querySelector('.poster-canvas-wrapper');
  if (!card) return;

  posterWrapper.addEventListener('mousemove', (e) => {
    const rect = posterWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -8;
    const rotY = (x / (rect.width / 2)) * 8;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
  });

  posterWrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const catalogCards = document.querySelectorAll('.catalog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      catalogCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const openBtns = document.querySelectorAll('.cart-pill-btn, #btn-hero-buy');
  const closeBtn = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-card-add')) {
      const prodId = e.target.getAttribute('data-id');
      const product = productsDatabase.find(p => p.id === prodId);
      if (product) {
        addToCart(product);
        openDrawer();
      }
    }
  });
}

function addToCart(product) {
  const existing = shoppingCart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    shoppingCart.push({
      id: product.id,
      name: product.title,
      price: product.price,
      size: product.size,
      image: product.image,
      qty: 1
    });
  }
  updateCartUI();
}

function removeFromCart(id) {
  shoppingCart = shoppingCart.filter(item => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const cartList = document.getElementById('cart-items-container');
  const cartBadge = document.getElementById('header-cart-count');
  const subtotalEl = document.getElementById('drawer-subtotal-val');
  const checkoutBtnEl = document.getElementById('drawer-checkout-btn-text');

  let totalQty = 0;
  let totalPrice = 0;
  const formatPrice = amount => new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);

  if (cartList) {
    cartList.innerHTML = '';

    if (shoppingCart.length === 0) {
      cartList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">Your shopping bag is empty.</div>`;
    } else {
      shoppingCart.forEach(item => {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${item.size} • Qty: ${item.qty}</div>
            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove Item">✕</button>
        `;
        cartList.appendChild(row);
      });
    }
  }

  if (cartBadge) cartBadge.textContent = totalQty;
  if (subtotalEl) subtotalEl.textContent = formatPrice(totalPrice);
  if (checkoutBtnEl) checkoutBtnEl.textContent = `CHECKOUT — ${formatPrice(totalPrice)}`;
}
