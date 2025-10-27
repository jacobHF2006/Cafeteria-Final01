// ===============================
// BLOG.JS - BARISTAS
// ===============================

// Contenedor donde se mostrarán las publicaciones
const blogGrid = document.querySelector(".blog-grid");
const form = document.querySelector(".comment-form");

// Lista de imágenes de animalitos tiernos
const imagenesAnimalitos = [
  "https://i.pinimg.com/originals/ae/3d/63/ae3d63ecfc2f0196c28d07d78606dddf.jpg",
  "https://pic.huitu.com/pic/20231115/2860520_20231115133124854201_0.jpg",
  "https://www.shutterstock.com/image-illustration/black-white-cow-cartoon-baby-260nw-2188504027.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/013/156/013/small_2x/cow-cute-animal-face-design-for-kids-vector.jpg",
  "https://static.vecteezy.com/system/resources/previews/016/755/725/non_2x/cute-face-ox-free-vector.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/042/399/589/small_2x/cow-animal-head-flat-free-vector.jpg",
  "https://tse4.mm.bing.net/th/id/OIP.eJL_-93IADuO7StACdJncgAAAA?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://img.freepik.com/premium-vector/milk-cow-illustration-minimal-style_1375-8901.jpg",
];

// Cargar publicaciones guardadas en localStorage
let publicaciones = JSON.parse(localStorage.getItem("publicacionesBaristas")) || [];

// Función para mostrar publicaciones
function mostrarPublicaciones() {
  blogGrid.innerHTML = ""; // limpiar contenido anterior

  if (publicaciones.length === 0) {
    blogGrid.innerHTML = `<p class="sin-comentarios">Aún no hay comentarios publicados ☕</p>`;
    return;
  }

  publicaciones.forEach((publi, index) => {
    const article = document.createElement("article");
    article.classList.add("blog-post");

    article.innerHTML = `
      <img src="${publi.imagen}" alt="Usuario" class="blog-img" />
      <div class="blog-content">
        <h3>${publi.nombre}</h3>
        <p>"${publi.mensaje}"</p>
        <a href="${publi.enlace}" target="_blank" class="blog-link">
          Ver publicación <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <button class="eliminar-btn" data-index="${index}">🗑️</button>
      </div>
    `;

    blogGrid.appendChild(article);
  });

  // Añadir eventos a los botones de eliminar
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = e.target.dataset.index;
      publicaciones.splice(i, 1);
      guardarPublicaciones();
      mostrarPublicaciones();
    });
  });
}

// Guardar publicaciones en localStorage
function guardarPublicaciones() {
  localStorage.setItem("publicacionesBaristas", JSON.stringify(publicaciones));
}

// Evento para el envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = form.querySelector('input[type="text"]').value.trim();
  const enlace = form.querySelector('input[type="url"]').value.trim();
  const mensaje = form.querySelector("textarea").value.trim();

  if (!nombre || !enlace || !mensaje) {
    alert("Por favor, completa todos los campos antes de publicar ☕");
    return;
  }

  // Seleccionar una imagen aleatoria de animalito tierno
  const imagenAleatoria = imagenesAnimalitos[Math.floor(Math.random() * imagenesAnimalitos.length)];

  const nuevaPublicacion = {
    nombre,
    enlace,
    mensaje,
    imagen: imagenAleatoria,
  };

  publicaciones.unshift(nuevaPublicacion); // añadir al inicio
  guardarPublicaciones();
  mostrarPublicaciones();

  form.reset();
  alert("✅ ¡Tu comentario ha sido publicado!");
});

// Mostrar publicaciones al cargar la página
mostrarPublicaciones();
