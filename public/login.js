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
      Swal.fire({
        title: 'Sesión iniciada',
        text: 'Inicio de sesión exitoso',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      
      window.location.href = 'index.html'; // Redirige a la página de publicación de productos
    } else {
      const data = await response.json();
      Swal.fire({
        title: 'Error',
        text: data.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      
    }
  } catch (error) {
    console.error('Error en la solicitud de inicio de sesión:', error);
    Swal.fire({
      title: 'Error',
      text: 'Error en la solicitud de inicio de sesión',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
});
