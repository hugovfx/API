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
    "h2-register-text": "User Register",
    

    "about":"About us",
        "abouttext":"We are a website dedicated to offering a wide variety of products from students and staff of UTCH, promoting entrepreneurship and competitiveness.",
        "links":"Quick links",
        "contact":"Contact us",
  },
  "es": {
    "home-link": "Inicio",
    "login-text": "Iniciar Sesión",
    "button": "Registrarse",
    "user_nombre": "Nombre",
    "user_apellido": "Apellido",
    "user_password": "Contraseña",
    "user_email": "Correo Electrónico",
    "h2-register-text": "Registro de Usuario",
    "abouttext": "Somos un sitio web dedicado a ofrecer una amplia variedad de productos de alumnos y personal de la UTCH promoviendo el emprendimiento y la competitividad.",
    "links": "Enlaces rápidos",
    "contact": "Contáctanos",
    "about": "Acerca de nosotros"
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
  });
  
  // Change placeholders
  const inputs = document.querySelectorAll('input[placeholder]');
  inputs.forEach(input => {
      const key = input.id;
      if (translations[lang][key]) {
          input.placeholder = translations[lang][key];
      }
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

const languageDropdown = document.getElementById('languageDropdown');
const languageOptions = document.getElementById('language-options');

languageOptions.addEventListener('click', (event) => {
  const lang = event.target.getAttribute('data-lang');
  if (lang) {
    localStorage.setItem('language', lang);
    applyTranslations(lang);
  }
});

function applyTranslations(lang) {
  const elements = document.querySelectorAll('[id]');
  elements.forEach(element => {
    const key = element.id;
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
    const languageImg = document.getElementById('language-img');
    if (lang === 'es') {
      languageImg.src = 'img/MXlenguaje.png';
    } else {
      languageImg.src = 'img/language.png';
    }
  });

  // Change placeholders
  const inputs = document.querySelectorAll('input[placeholder]');
  inputs.forEach(input => {
      const key = input.id;
      if (translations[lang][key]) {
          input.placeholder = translations[lang][key];
      }
  });
}

// Apply translations based on stored preference
const storedLanguage = localStorage.getItem('language') || 'en';
applyTranslations(storedLanguage);