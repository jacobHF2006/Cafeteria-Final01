document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("formRegistro");
  const formLogin = document.getElementById("formLogin");
  const formPromos = document.getElementById("formPromos");
  const listaPromos = document.getElementById("listaPromos");
  const mensajeBienvenida = document.getElementById("mensajeBienvenida");

  // Alternar formularios
  document.getElementById("mostrarLogin").addEventListener("click", (e) => {
    e.preventDefault();
    formRegistro.classList.add("oculto");
    formLogin.classList.remove("oculto");
  });

  document.getElementById("mostrarRegistro").addEventListener("click", (e) => {
    e.preventDefault();
    formLogin.classList.add("oculto");
    formRegistro.classList.remove("oculto");
  });

  // Registrar usuario
  document.getElementById("btnRegistrar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !correo || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (usuarios[correo]) {
      alert("⚠️ Este correo ya está registrado.");
      return;
    }

    usuarios[correo] = { nombre, password };
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");

    formRegistro.classList.add("oculto");
    formLogin.classList.remove("oculto");
  });

  // Iniciar sesión
  document.getElementById("btnLogin").addEventListener("click", () => {
    const correo = document.getElementById("correoLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (!usuarios[correo] || usuarios[correo].password !== password) {
      alert("❌ Correo o contraseña incorrectos.");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[correo]));

    mostrarPromociones(usuarios[correo].nombre);
  });

  // Mostrar promociones personalizadas
  function mostrarPromociones(nombre) {
    formLogin.classList.add("oculto");
    formRegistro.classList.add("oculto");
    formPromos.classList.remove("oculto");

    mensajeBienvenida.textContent = `🎉 ¡Bienvenido, ${nombre}!`;
    alert(`Bienvenido ${nombre} ☕`);

    const promociones = [
      "10% de descuento en tu primera compra ☕",
      "2x1 en cafés los fines de semana 🥐",
      "Envío gratuito por compras mayores a S/50 🚚",
      "Participa en sorteos mensuales de productos premium 🎁"
    ];

    listaPromos.innerHTML = promociones.map(p => `<li>${p}</li>`).join("");
  }

  // Cerrar sesión
  document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    formPromos.classList.add("oculto");
    formLogin.classList.remove("oculto");
  });

  // Si ya está logueado
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuarioActivo) {
    mostrarPromociones(usuarioActivo.nombre);
  }
});
