// ================================
// PRODUCTOS.JS - BARISTAS
// ================================

// --- VARIABLES GLOBALES ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// --- ELEMENTOS DEL DOM ---
const botonesAgregar = document.querySelectorAll(".btn-agregar");
const carritoIcono = document.querySelector(".fa-basket-shopping");
const numeroCarrito = document.querySelector(".content-shopping-cart .number");

// ================================
// FUNCIONES PRINCIPALES
// ================================

// Actualiza el número del carrito
function actualizarNumeroCarrito() {
  numeroCarrito.textContent = `(${carrito.length})`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito
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

// Notificación breve al agregar
function mostrarNotificacion(texto) {
  const noti = document.createElement("div");
  noti.className = "notificacion-carrito";
  noti.textContent = texto;
  document.body.appendChild(noti);
  setTimeout(() => noti.remove(), 2000);
}

// ================================
// MODAL DEL CARRITO
// ================================

function crearModalCarrito() {
  // ⚠️ Si el carrito está vacío, mostrar advertencia visual
  if (carrito.length === 0) {
    mostrarAdvertencia("Tu carrito está vacío 🛒<br>Agrega productos antes de continuar.");
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
      <label>
        <input type="radio" name="entrega" value="tienda" checked> Recojo en tienda
      </label><br>
      <label>
        <input type="radio" name="entrega" value="delivery"> Delivery
      </label>

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

  // Cerrar modal
  modal.querySelector(".cerrar-modal").addEventListener("click", () => modal.remove());

  // Mostrar campo de contacto si es delivery
  const radios = modal.querySelectorAll("input[name='entrega']");
  const campoContacto = modal.querySelector("#campo-contacto");
  radios.forEach((r) =>
    r.addEventListener("change", () => {
      campoContacto.style.display =
        r.value === "delivery" && r.checked ? "block" : "none";
    })
  );

  // Botón comprar
  modal.querySelector("#btn-comprar").addEventListener("click", () => generarBoleta(modal));

  mostrarCarritoEnModal(modal);
}

// Mostrar contenido del carrito dentro del modal
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

  // Eliminar productos
  lista.querySelectorAll(".eliminar-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      carrito.splice(btn.dataset.indice, 1);
      actualizarNumeroCarrito();
      modal.remove();
      crearModalCarrito(); // recargar modal
    });
  });
}

// Mostrar modal al hacer clic en el ícono del carrito
carritoIcono.addEventListener("click", crearModalCarrito);

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

  document.getElementById("cerrar-advertencia").addEventListener("click", () => fondo.remove());
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

  // Encabezado
  doc.setFontSize(14);
  doc.text("🧾 Boleta de Compra - Baristas", 10, 10);
  doc.setFontSize(12);
  doc.text("====================================", 10, 15);

  // Productos
  carrito.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.nombre} - S/ ${item.precio.toFixed(2)}`, 10, 25 + i * 10);
  });

  // Totales
  doc.text("------------------------------------", 10, 25 + carrito.length * 10);
  doc.text(`Total: S/ ${total.toFixed(2)}`, 10, 35 + carrito.length * 10);
  doc.text(`Tipo de entrega: ${entrega}`, 10, 45 + carrito.length * 10);
  if (entrega === "delivery") {
    doc.text(`Teléfono de contacto: ${telefono}`, 10, 55 + carrito.length * 10);
  }
  doc.text(`Método de pago: ${metodoPago}`, 10, 65 + carrito.length * 10);

  // Mensaje final
  doc.text("====================================", 10, 75 + carrito.length * 10);
  doc.text(
    entrega === "tienda"
      ? "📍 Muestre esta boleta al momento de recoger su pedido en tienda."
      : "🚚 Muestre esta boleta al delivery. Se comunicarán al número indicado cuando estén cerca.",
    10,
    85 + carrito.length * 10,
    { maxWidth: 180 }
  );

  // Guardar PDF
  doc.save("boleta_baristas.pdf");

  mostrarAdvertencia(
    entrega === "tienda"
      ? "✅ Boleta generada. Preséntela al momento del recojo en tienda."
      : "🚚 Boleta generada. El delivery se comunicará cuando esté cerca."
  );

  carrito = [];
  actualizarNumeroCarrito();
  localStorage.removeItem("carrito");
  modal.remove();
}

// Inicializar número de carrito al cargar
actualizarNumeroCarrito();
