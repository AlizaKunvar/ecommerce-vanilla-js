const API = 'http://127.0.0.1:5000/api';

document.getElementById('save').onclick = async ()=>{
  const prod = {
    name: name.value,
    price: Number(price.value),
    image: image.value,
    description: description.value,
    category: category.value,
    stock: Number(stock.value)
  };
  const token = document.getElementById('token').value;
  if(!token){ alert('Enter Admin Token'); return; }

  try{
    const res = await fetch(`${API}/admin/products`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify(prod)
    });
    if(!res.ok){
      alert('❌ Failed: Unauthorized or invalid data');
      return;
    }
    const data = await res.json();
    alert('✅ Product added: '+data.name);
  }catch(err){
    alert('Error: '+err.message);
  }
};
