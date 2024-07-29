let currentDeleteId = null;
let currentDeleteType = null; // Añadido para diferenciar entre productos y contactos

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html'; // Redirigir a index.html si no está autenticado
    return;
  }
  
  // Obtener ID del usuario desde el token
  const response = await fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const user = await response.json();
  const userId = user.id;

  // Obtener datos del usuario
  const userResponse = await fetch(`/api/users/${userId}`);
  const userData = await userResponse.json();
  document.getElementById('user-name').textContent = ' '+userData.name;
  document.getElementById('profile-container').style.display = 'block';

  // Obtener productos del usuario
  const productsResponse = await fetch(`/api/users/${userId}/products`);
  const products = await productsResponse.json();
  const productsContainer = document.getElementById('products');

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-details">
        <img src="${product.image_url}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>Precio: ${product.price} $</p>
          <p>${product.description}</p>
          <button class="delete-button" data-id="${product.id}" data-type="product">X</button>
        </div>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });

  // Obtener formas de contacto del usuario
  const contactsResponse = await fetch(`/api/users/${userId}/contacts`);
  const contacts = await contactsResponse.json();
  const contactsContainer = document.getElementById('contacts');

  contacts.forEach(contact => {
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    
    contactItem.innerHTML = `
      <span>${contact.contact_type}: ${contact.contact_value}</span>
      <button class="delete-button" id="delete-button-2" data-id="${contact.contact_id}" data-type="contact">Delete</button>
    `;
    contactsContainer.appendChild(contactItem);
  });

  // Manejar envío del formulario de contacto
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactType = formData.get('contact-type');
    const contactValue = formData.get('contact-value');
    
    await fetch(`/api/users/${userId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact_type: contactType,
        contact_value: contactValue
      })
    });
    
    // Recargar la página para ver la nueva forma de contacto
    location.reload();
  });

  // Manejar clics en los botones de eliminar
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      currentDeleteId = event.target.getAttribute('data-id');
      currentDeleteType = event.target.getAttribute('data-type'); // Guardar el tipo
      document.getElementById('confirm-modal').style.display = 'block';
    }
  });

  // Manejar confirmación de eliminación
  document.getElementById('confirm-delete').addEventListener('click', async () => {
    if (currentDeleteId && currentDeleteType) {
      const url = currentDeleteType === 'product'
        ? `/api/products/${currentDeleteId}`
        : `/api/users/${userId}/contacts/${currentDeleteId}`;
      const method = 'DELETE';

      await fetch(url, { method });
      // Recargar la página para ver los cambios
      location.reload();
    }
  });

  // Manejar cancelación de eliminación
  document.getElementById('cancel-delete').addEventListener('click', () => {
    currentDeleteId = null;
    currentDeleteType = null; // Resetear tipo
    document.getElementById('confirm-modal').style.display = 'none';
  });

  // Cerrar sesión
  document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
  });
});

