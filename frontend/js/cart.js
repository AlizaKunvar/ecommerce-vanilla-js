const API = 'http://127.0.0.1:5000/api';
const itemsDiv = document.getElementById('cart-items');
const totalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function loadCart(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if(cart.length===0){
    itemsDiv.innerHTML = `<p class="text-gray-500">Your cart is empty 🛍️</p>`;
    totalEl.textContent = '';
    return;
  }

  let total = 0;
  itemsDiv.innerHTML = cart.map(item=>{
    total += item.price * item.qty;
    return `
      <div class="flex items-center justify-between bg-white p-4 rounded shadow">
        <div>
          <h3 class="font-semibold">${item.name}</h3>
          <p>Rs ${item.price} × ${item.qty}</p>
        </div>
        <div>
          <button class="px-3 py-1 bg-gray-200 rounded" onclick="changeQty('${item._id}',-1)">-</button>
          <button class="px-3 py-1 bg-gray-200 rounded" onclick="changeQty('${item._id}',1)">+</button>
          <button class="px-3 py-1 bg-red-500 text-white rounded" onclick="removeItem('${item._id}')">x</button>
        </div>
      </div>
    `;
  }).join('');
  totalEl.textContent = `Total: Rs ${total}`;
  updateCartCount();
}

function changeQty(id,delta){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(x=>x._id===id);
  if(idx>=0){
    cart[idx].qty += delta;
    if(cart[idx].qty<=0) cart.splice(idx,1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function removeItem(id){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]').filter(x=>x._id!==id);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

document.getElementById('checkout').onclick = ()=>{
  alert('✅ Checkout successful! (simulation)');
  localStorage.removeItem('cart');
  loadCart();
};

loadCart();
