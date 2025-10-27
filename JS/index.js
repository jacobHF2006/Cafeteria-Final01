// ================================
// PRODUCTOS.JS - BARISTAS
// ================================

// --- VARIABLES GLOBALES ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- ELEMENTOS DEL DOM ---
const botonesAgregar = document.querySelectorAll(".btn-agregar");
const carritoIcono = document.querySelector(".fa-basket-shopping");
const personaIcono = document.querySelector(".fa-user"); // 👤 ícono persona
const numeroCarrito = document.querySelector(".content-shopping-cart .number");

// ================================
// FUNCIONES PRINCIPALES DEL CARRITO
// ================================

function actualizarNumeroCarrito() {
  numeroCarrito.textContent = `(${carrito.length})`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarNotificacion(texto) {
  const noti = document.createElement("div");
  noti.className = "notificacion-carrito";
  noti.textContent = texto;
  document.body.appendChild(noti);
  setTimeout(() => noti.remove(), 2000);
}

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const producto = boton.parentElement;
    const nombre = producto.querySelector("h4").textContent;
    const precio = parseFloat(
      producto.querySelector(".precio").textContent.replace("S/ ", "")
    );

    carrito.push({ nombre, precio });
    actualizarNumeroCarrito();
    mostrarNotificacion(`${nombre} añadido al carrito ✅`);
  });
});

// ================================
// MODAL DEL CARRITO
// ================================

function crearModalCarrito() {
  if (carrito.length === 0) {
    mostrarAdvertencia(
      "Tu carrito está vacío 🛒<br>Agrega productos antes de continuar."
    );
    return;
  }

  const modal = document.createElement("div");
  modal.className = "modal-carrito";
  modal.innerHTML = `
    <div class="modal-contenido">
      <span class="cerrar-modal">&times;</span>
      <h2>🛍️ Tu Carrito</h2>
      <div id="lista-carrito"></div>
      <p id="total-carrito"></p>

      <h3>Tipo de entrega</h3>
      <label><input type="radio" name="entrega" value="tienda" checked> Recojo en tienda</label><br>
      <label><input type="radio" name="entrega" value="delivery"> Delivery</label>

      <div id="campo-contacto" style="display:none; margin-top:10px;">
        <input type="text" id="telefono" placeholder="Número de WhatsApp o llamada" />
      </div>

      <h3>Método de pago</h3>
      <select id="metodo-pago">
        <option value="efectivo">Efectivo</option>
        <option value="yape/plin">Yape / Plin</option>
        <option value="tarjeta">Tarjeta</option>
      </select>

      <button id="btn-comprar">Confirmar compra</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal
    .querySelector(".cerrar-modal")
    .addEventListener("click", () => modal.remove());

  const radios = modal.querySelectorAll("input[name='entrega']");
  const campoContacto = modal.querySelector("#campo-contacto");
  radios.forEach((r) =>
    r.addEventListener("change", () => {
      campoContacto.style.display =
        r.value === "delivery" && r.checked ? "block" : "none";
    })
  );

  modal
    .querySelector("#btn-comprar")
    .addEventListener("click", () => generarBoleta(modal));

  mostrarCarritoEnModal(modal);
}

function mostrarCarritoEnModal(modal) {
  const lista = modal.querySelector("#lista-carrito");
  const total = modal.querySelector("#total-carrito");

  if (carrito.length === 0) {
    lista.innerHTML = "<p>Tu carrito está vacío ☕</p>";
    total.textContent = "";
    return;
  }

  lista.innerHTML = carrito
    .map(
      (item, i) => `
      <div class="item-carrito">
        ${item.nombre} - S/ ${item.precio.toFixed(2)}
        <button class="eliminar-item" data-indice="${i}">❌</button>
      </div>
    `
    )
    .join("");

  total.textContent = `Total: S/ ${carrito
    .reduce((acc, p) => acc + p.precio, 0)
    .toFixed(2)}`;

  lista.querySelectorAll(".eliminar-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      carrito.splice(btn.dataset.indice, 1);
      actualizarNumeroCarrito();
      modal.remove();
      crearModalCarrito();
    });
  });
}

if (carritoIcono) carritoIcono.addEventListener("click", crearModalCarrito);

// ================================
// ADVERTENCIA VISUAL
// ================================
function mostrarAdvertencia(mensaje) {
  const fondo = document.createElement("div");
  fondo.className = "fondo-advertencia";

  const ventana = document.createElement("div");
  ventana.className = "ventana-advertencia";
  ventana.innerHTML = `
    <h3>⚠️ Aviso</h3>
    <p>${mensaje}</p>
    <button id="cerrar-advertencia">Aceptar</button>
  `;

  fondo.appendChild(ventana);
  document.body.appendChild(fondo);

  document
    .getElementById("cerrar-advertencia")
    .addEventListener("click", () => fondo.remove());
}

// ================================
// GENERAR BOLETA EN PDF
// ================================
async function generarBoleta(modal) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  const entrega = document.querySelector('input[name="entrega"]:checked').value;
  const metodoPago = document.querySelector("#metodo-pago").value;
  const telefono = document.querySelector("#telefono")?.value || "N/A";

  doc.setFontSize(14);
  doc.text("🧾 Boleta de Compra - Baristas", 10, 10);
  doc.setFontSize(12);
  doc.text("====================================", 10, 15);

  carrito.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.nombre} - S/ ${item.precio.toFixed(2)}`, 10, 25 + i * 10);
  });

  doc.text("------------------------------------", 10, 25 + carrito.length * 10);
  doc.text(`Total: S/ ${total.toFixed(2)}`, 10, 35 + carrito.length * 10);
  doc.text(`Tipo de entrega: ${entrega}`, 10, 45 + carrito.length * 10);
  if (entrega === "delivery") doc.text(`Teléfono: ${telefono}`, 10, 55 + carrito.length * 10);
  doc.text(`Pago: ${metodoPago}`, 10, 65 + carrito.length * 10);

  doc.save("boleta_baristas.pdf");

  mostrarAdvertencia("✅ Boleta generada correctamente.");
  carrito = [];
  actualizarNumeroCarrito();
  localStorage.removeItem("carrito");
  modal.remove();
}

// ===============================
// LOGIN Y REGISTRO (FINAL FUNCIONAL)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  actualizarNumeroCarrito();

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const mensajeBienvenida = document.querySelector(".usuario-nombre");

  if (usuarioActivo && mensajeBienvenida) {
    mensajeBienvenida.textContent = `👋 ${usuarioActivo.nombre}`;
  }

  if (personaIcono) {
    personaIcono.addEventListener("click", () => {
      abrirModalLogin();
    });
  }
});

function abrirModalLogin() {
  const modal = document.createElement("div");
  modal.className = "modal-usuario";
  modal.innerHTML = `
    <div class="modal-contenido">
      <span class="cerrar-modal">&times;</span>
      <h2>👤 Cuenta de Usuario</h2>

      <p>¿Tienes una cuenta?</p>
      <div class="botones-login">
        <button id="btnAbrirLogin">Iniciar Sesión</button>
        <button id="btnAbrirRegistro">Registrarse</button>
      </div>

      <div id="contenidoLogin" style="display:none;">
        <input type="email" id="correoLogin" placeholder="Correo">
        <input type="password" id="passwordLogin" placeholder="Contraseña">
        <button id="btnIniciarSesion">Entrar</button>
      </div>

      <div id="contenidoRegistro" style="display:none;">
        <input type="text" id="nombreRegistro" placeholder="Nombre completo">
        <input type="email" id="correoRegistro" placeholder="Correo">
        <input type="password" id="passwordRegistro" placeholder="Contraseña">
        <button id="btnRegistrarUsuario">Registrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const cerrar = modal.querySelector(".cerrar-modal");
  cerrar.addEventListener("click", () => modal.remove());

  const btnAbrirLogin = modal.querySelector("#btnAbrirLogin");
  const btnAbrirRegistro = modal.querySelector("#btnAbrirRegistro");
  const contenidoLogin = modal.querySelector("#contenidoLogin");
  const contenidoRegistro = modal.querySelector("#contenidoRegistro");

  btnAbrirLogin.addEventListener("click", () => {
    contenidoLogin.style.display = "block";
    contenidoRegistro.style.display = "none";
  });

  btnAbrirRegistro.addEventListener("click", () => {
    contenidoRegistro.style.display = "block";
    contenidoLogin.style.display = "none";
  });

  modal.querySelector("#btnRegistrarUsuario").addEventListener("click", registrarUsuario);
  modal.querySelector("#btnIniciarSesion").addEventListener("click", () => {
    iniciarSesion();
    modal.remove();
  });
}

function registrarUsuario() {
  const nombre = document.getElementById("nombreRegistro").value.trim();
  const correo = document.getElementById("correoRegistro").value.trim();
  const password = document.getElementById("passwordRegistro").value.trim();

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
}

function iniciarSesion() {
  const correo = document.getElementById("correoLogin").value.trim();
  const password = document.getElementById("passwordLogin").value.trim();
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (!usuarios[correo] || usuarios[correo].password !== password) {
    alert("Correo o contraseña incorrectos.");
    return;
  }

  localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[correo]));
  mostrarBienvenida(usuarios[correo].nombre);
}

function mostrarBienvenida(nombre) {
  const mensaje = document.querySelector(".usuario-nombre");
  if (mensaje) mensaje.textContent = `👋 ${nombre}`;
}

// ===============================
// CONTACTO - VALIDAR TELÉFONO Y MENSAJE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const inputTelefono = document.getElementById("telefono");
  const btnContacto = document.getElementById("btn-contacto");
  const msg = document.getElementById("contact-msg");

  if (btnContacto && inputTelefono && msg) {
    btnContacto.addEventListener("click", () => {
      const numero = inputTelefono.value.trim();

      if (numero === "" || !/^\+?\d{7,15}$/.test(numero)) {
        mostrarMensaje("Por favor, ingresa un número de contacto válido.", false);
        return;
      }

      mostrarMensaje(
        "¡Gracias por darnos tu contacto! En breve nos comunicaremos para brindarte todas nuestras promociones.",
        true
      );

      inputTelefono.value = "";
    });

    function mostrarMensaje(texto, exito = true) {
      msg.textContent = texto;
      msg.className = exito ? "msg-success" : "msg-error";
      msg.style.display = "block";
      msg.style.opacity = "0";

      setTimeout(() => {
        msg.style.transition = "opacity 0.4s ease";
        msg.style.opacity = "1";
      }, 10);

      setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => (msg.style.display = "none"), 400);
      }, 4500);
    }
  }
});

// ===============================
// CARGAR LOGIN DESDE /appjs/index.js
// ===============================
const scriptLogin = document.createElement("script");
scriptLogin.src = "/appjs/index.js";
scriptLogin.defer = true;
document.body.appendChild(scriptLogin);
