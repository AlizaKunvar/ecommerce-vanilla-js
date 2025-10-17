const API = 'http://127.0.0.1:5000/api';
const productDiv = document.getElementById('product');
const cartCountEl = document.getElementById('cart-count');

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function getId(){
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadProduct(){
  const id = getId();
  if(!id){
    productDiv.innerHTML = `<p class="text-center text-red-500">Invalid Product ID</p>`;
    return;
  }
  try{
    const res = await fetch(`${API}/products/${id}`);
    const p = await res.json();
    productDiv.innerHTML = `
      <div class="grid md:grid-cols-2 gap-10">
        <img src="${p.image}" alt="${p.name}" class="rounded-lg shadow-md">
        <div>
          <h2 class="text-3xl font-bold mb-2">${p.name}</h2>
          <p class="text-gray-500 mb-4">${p.category}</p>
          <p class="text-lg text-gray-700 mb-4">${p.description}</p>
          <p class="text-2xl font-bold text-blue-600 mb-6">Rs ${p.price}</p>
          <button id="addBtn" class="add px-6 py-2">Add to Cart</button>
        </div>
      </div>
    `;
    document.getElementById('addBtn').onclick = () => addToCart(p._id);
  }catch(err){
    productDiv.innerHTML = `<p class="text-center text-red-500">Error loading product</p>`;
  }
  updateCartCount();
}

function addToCart(id){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(x => x._id === id);
  if(idx>=0) cart[idx].qty++;
  else cart.push({ _id:id, qty:1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('✅ Added to cart!');
}

loadProduct();
