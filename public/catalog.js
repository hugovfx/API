document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
  
      const productList = document.getElementById('product-list');
  
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <img src="${product.image_url}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
          <button class="btn-buy" onclick="showDetail(${product.id})">Comprar</button>
        `;
        productList.appendChild(productCard);
      });
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  });
  
  function showDetail(productId) {
    fetch(`/api/products/${productId}`)
      .then(response => response.json())
      .then(product => {
        document.getElementById('detail-name').innerText = product.name;
        document.getElementById('detail-image').src = product.image_url;
        document.getElementById('detail-price').innerText = `$${product.price}`;
        document.getElementById('detail-category').innerText = product.category_name;
        document.getElementById('detail-user').innerText = product.user_name;
        document.getElementById('product-detail').style.display = 'block';
      })
      .catch(error => console.error('Error al obtener los detalles del producto:', error));
  }
  
  function closeDetail() {
    document.getElementById('product-detail').style.display = 'none';
  }
  