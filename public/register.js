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

const translations = {
  en: {
    "home-link": "Home",
    "login-text": "Login",
    "button": "Register",
    "user_nombre": "Fist name",
    "user_apellido": "Last name",
    "user_password": "Password",
    "user_email": "Email",
    "h2-register-text": "User Register"
  },
  es: {
    "home-link": "Inicio",
    "login-text": "Iniciar Sesión",
    "button": "Registrarse",
    "user_nombre": "Nombre",
    "user_apellido": "Apellido",
    "user_password": "Contraseña",
    "user_email": "Correo Electrónico",
    "h2-register-text": "Registro de Usuario"
  }
};

function changeLanguage(lang) {
  const elements = document.querySelectorAll('[id]');
  elements.forEach(element => {
    const key = element.id;
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }

    // Change placeholders
    const inputs = document.querySelectorAll('input[placeholder]');
    inputs.forEach(input => {
      const key = input.id;
      if (translations[lang][key]) {
        input.placeholder = translations[lang][key];
      }
    });

    // Change select options
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
      const key = select.id;
      if (translations[lang][key]) {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
          if (option.value === "") {
            option.textContent = translations[lang][key];
          }
        });
      }
    });
  });

  // Change language image
  const languageImg = document.getElementById('language-img');
  if (lang === 'es') {
    languageImg.src = 'img/MXlenguaje.png';
  } else {
    languageImg.src = 'img/language.png';
  }
}

document.getElementById('language-options').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    const lang = e.target.dataset.lang;
    changeLanguage(lang);
  }
});