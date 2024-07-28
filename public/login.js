document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token en localStorage
      alert('Inicio de sesión exitoso');
      window.location.href = 'postProducto.html'; // Redirige a la página de publicación de productos
    } else {
      const data = await response.json();
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error en la solicitud de inicio de sesión:', error);
    alert('Error en la solicitud de inicio de sesión');
  }
});
