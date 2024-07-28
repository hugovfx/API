document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(formObject),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Registro exitoso');
      window.location.href = 'login.html'; // Redirige al login después del registro
    } else {
      const data = await response.json();
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    alert('Error en el registro');
  }
});
