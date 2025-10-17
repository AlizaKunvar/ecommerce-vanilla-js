// Use current origin so code works in Codespaces, local, or deployed environment
const API = `${window.location.origin}/api`;
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

async function load(q = '') {
  // show loading
  grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Loading...</p>';
  try {
    const res = await fetch(`${API}/products${q ? '?q=' + encodeURIComponent(q) : ''}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const products = await res.json();
    if (!products.length) {
      grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No products found</p>';
      return;
    }
    grid.innerHTML = products.map(p => `
      <div class="card p-4">
        <img src="${p.image || 'https://via.placeholder.com/300x300?text=No+Image'}" alt="${p.name}">
        <h3 class="mt-2">${p.name}</h3>
        <p class="text-blue-600 font-bold mt-1">Rs ${p.price}</p>
        <div class="flex justify-between items-center mt-2">
          <a href="product.html?id=${p._id}" class="text-sm text-blue-500 hover:underline">View</a>
          <button data-id="${p._id}" class="add text-sm">Add to Cart</button>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.add').forEach(btn => {
      btn.onclick = () => addToCart(btn.dataset.id, 1);
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    grid.innerHTML = '<p class="col-span-full text-center text-red-500">Error loading products.</p>';
  }
  updateCartCount();
}

async function addToCart(id, qty = 1) {
  try {
    const res = await fetch(`${API}/products/${id}`);
    if (!res.ok) throw new Error('Failed to load product');
    const product = await res.json();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(x => x._id === product._id);
    if (idx >= 0) cart[idx].qty += qty;
    else cart.push({ ...product, qty });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('✅ Added to cart!');
  } catch (err) {
    console.error('Add to cart error:', err);
    alert('Could not add to cart.');
  }
}

search.addEventListener('input', () => load(search.value.trim()));
// initial load
load();
