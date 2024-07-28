document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Necesitas iniciar sesión para publicar un producto');
    window.location.href = 'login.html';
    return;
  }

  // Cargar categorías
  const categorySelect = document.getElementById('category_id');
  const response = await fetch('/api/categories');
  const categories = await response.json();

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  // Manejar el envío del formulario
  const form = document.getElementById('post-product-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        form.reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Ocurrió un error al publicar el producto.');
    }
  });
});
