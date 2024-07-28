document.addEventListener('DOMContentLoaded', async () => {
  const categoryFilter = document.getElementById('category-filter');
  const productList = document.getElementById('product-list');

  // Cargar categorías
  const categoriesResponse = await fetch('/api/categories');
  const categories = await categoriesResponse.json();
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });

  // Cargar productos
  async function loadProducts(categoryId = 'all') {
    productList.innerHTML = '';
    const productsResponse = await fetch(`/api/products${categoryId !== 'all' ? `?category_id=${categoryId}` : ''}`);
    const products = await productsResponse.json();

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
  }

  categoryFilter.addEventListener('change', () => {
    const selectedCategory = categoryFilter.value;
    loadProducts(selectedCategory);
  });

  // Cargar todos los productos por defecto
  loadProducts();
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
