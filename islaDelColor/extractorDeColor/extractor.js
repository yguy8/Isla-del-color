//modo oscuro
const boton = document.getElementById("modoOscuroBtn");

const iconMoon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="#d4af37" class="icon-moon">
  <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z"/>
</svg>`;

const iconSun = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="#d4af37" class="icon-sun">
  <path d="M12 19a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1m-4.95 -2.05a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m11.314 0l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m-5.049 -9.836a5 5 0 1 1 -2.532 9.674a5 5 0 0 1 2.532 -9.674m-9.315 3.886a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm18 0a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-16.364 -6.778l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m14.142 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m-7.778 -3.222a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1"/>
</svg>`;

boton.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
  const tema = document.body.classList.contains("oscuro") ? "oscuro" : "claro";
  localStorage.setItem("tema", tema);

  // Cambiar ícono según tema
  boton.innerHTML = tema === "oscuro" ? iconSun : iconMoon;
});

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  const tema = localStorage.getItem("tema");
  if (tema === "oscuro") {
    document.body.classList.add("oscuro");
    boton.innerHTML = iconSun;
  } else {
    boton.innerHTML = iconMoon;
  }
});

//menú hamburguesa en moviles/celulares
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu-list');

toggle.addEventListener('click', () => {
    menu.classList.toggle('show');

    // Cambiar ícono ☰ ↔ ✖
    if (menu.classList.contains('show')) {
        toggle.textContent = '✖';
    } else {
        toggle.textContent = '☰';
    }
});

// --- Utilidades extra ---
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function isValidCssColor(value) {
  const s = new Option().style;
  s.color = value;
  return s.color !== "";
}

// --- Variables y constantes globales ---
const pickBtn = document.getElementById("pickBtn");
const fileInput = document.getElementById("fileInput");
const stage = document.getElementById("stage");
const ctx = stage.getContext("2d");
const emptyMsg = document.getElementById("emptyMsg");

const swatch = document.getElementById("swatch");
const hexEl = document.getElementById("hex");
const rgbEl = document.getElementById("rgb");
const paletteContainer = document.getElementById("palette");
const toast = document.getElementById("toast");
const paletteBtn = document.getElementById("paletteBtn");
const copyPaletteBtn = document.getElementById("copyPalette"); // botón global copiar paleta

const zoomCanvas = document.getElementById("zoomCanvas");
const zoomCtx = zoomCanvas.getContext("2d");
zoomCanvas.width = 100;
zoomCanvas.height = 100;

let img = null;
let selectedPoints = []; // hasta 5 puntos
let draggingPoint = null;

// --- Funciones utilitarias ---
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function setCanvasSize(w, h) {
  stage.width = w;        // tamaño interno
  stage.height = h;
  stage.style.width = w + "px";   // tamaño visible
  stage.style.height = h + "px";
}

function drawImageToCanvas(image) {
  const w = image.naturalWidth, h = image.naturalHeight;
  const maxW = stage.parentElement.clientWidth;
  const scale = Math.min(1, maxW / w);
  setCanvasSize(w * scale, h * scale);
  ctx.clearRect(0, 0, stage.width, stage.height);
  ctx.drawImage(image, 0, 0, stage.width, stage.height);
  emptyMsg.style.display = "none";
}

function redrawAll() {
  drawImageToCanvas(img);
  selectedPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = p.hex;
    ctx.fill();
    ctx.stroke();
  });
}

// --- Cargar imagen desde disco ---
pickBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png", "svg"].includes(ext)) {
    showToast("Formato no soportado");
    return;
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    img = image;
    selectedPoints = []; // reset puntos
    drawImageToCanvas(img);
    URL.revokeObjectURL(url);
    paletteBtn.disabled = false;
    copyPaletteBtn.disabled = false;
  };
  image.onerror = () => showToast("No se pudo cargar la imagen");
  image.src = url;
});

// --- Zoom pixelado flotante ---
stage.addEventListener("mousemove", e => {
  if (!img) return;
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const size = 20; // área de recorte
  zoomCtx.imageSmoothingEnabled = false;
  zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
  zoomCtx.drawImage(
    stage,
    x - size/2, y - size/2, size, size,
    0, 0, zoomCanvas.width, zoomCanvas.height
  );

  // mostrar y posicionar el zoomCanvas cerca del cursor
  zoomCanvas.style.display = "block";
  zoomCanvas.style.position = "absolute";
  zoomCanvas.style.left = `${e.pageX + 20}px`;
  zoomCanvas.style.top = `${e.pageY + 20}px`;
});

// cuando el cursor entra al canvas
stage.addEventListener("mouseenter", () => {
  zoomCanvas.style.display = "block";
});

// cuando el cursor sale del canvas
stage.addEventListener("mouseleave", () => {
  zoomCanvas.style.display = "none";
  zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height); // opcional: limpiar
});


// --- Selección de color en canvas ---
stage.addEventListener("click", e => {
  if (!img) return;

  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);
  const data = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = data;
  const hex = rgbToHex(r, g, b);

  // Si ya hay 5 puntos, elimina el primero (FIFO)
  if (selectedPoints.length >= 5) {
    selectedPoints.shift();
  }

  // Guardar nuevo punto
  selectedPoints.push({ x, y, r, g, b, hex });

  redrawAll();

  // Mostrar último color en panel
  swatch.style.backgroundColor = `rgb(${r},${g},${b})`;
  hexEl.textContent = hex;

  renderSelectedColors();
});

// --- Drag & Drop de puntos ---
stage.addEventListener("mousedown", e => {
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  selectedPoints.forEach((p, idx) => {
    const dx = x - p.x;
    const dy = y - p.y;
    if (Math.sqrt(dx*dx + dy*dy) < 8) {
      draggingPoint = idx;
    }
  });
});

stage.addEventListener("mousemove", e => {
  if (draggingPoint === null) return;
  const rect = stage.getBoundingClientRect();
  const scaleX = stage.width / rect.width;
  const scaleY = stage.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const data = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = data;
  const hex = rgbToHex(r, g, b);
  selectedPoints[draggingPoint] = { x, y, r, g, b, hex };

  redrawAll();
  renderSelectedColors();
});

stage.addEventListener("mouseup", () => {
  draggingPoint = null;
});

// --- Renderizar lista de colores ---
function renderSelectedColors() {
  paletteContainer.innerHTML = "";
  selectedPoints.forEach((c, idx) => {
    const chip = document.createElement("div");
    chip.className = "chip";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = `rgb(${c.r},${c.g},${c.b})`;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span>${c.hex}</span> `;

    // Botón copiar color (azul)
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
           viewBox="0 0 24 24" fill="none" stroke="#5257ff" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
        <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
      </svg>
    `;
    copyBtn.onclick = () => {
      const text = `${c.hex}`;
      navigator.clipboard.writeText(text)
        .then(() => showToast("Color copiado"))
        .catch(() => showToast("No se pudo copiar el color"));
    };

    // Botón eliminar (rojo)
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" 
           viewBox="0 0 24 24" fill="none" stroke="#ff0000" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    `;
    removeBtn.onclick = () => {
      selectedPoints.splice(idx, 1);
      redrawAll();
      renderSelectedColors();
    };

    chip.appendChild(colorDiv);
    chip.appendChild(meta);
    chip.appendChild(copyBtn);
    chip.appendChild(removeBtn);
    paletteContainer.appendChild(chip);
  });
}

// --- Generar paleta completa ---
paletteBtn.addEventListener("click", () => {
  if (selectedPoints.length === 0) {
    showToast("Selecciona al menos un punto");
    return;
  }
  paletteContainer.innerHTML = "";
  selectedPoints.forEach(c => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `
      <div class="color" style="background:rgb(${c.r},${c.g},${c.b})"></div>
      <div class="meta">
        <span>${c.hex}</span>
        
      </div>`;
    paletteContainer.appendChild(chip);
  });
});

// --- Copiar paleta completa ---
copyPaletteBtn.addEventListener("click", () => {
  if (selectedPoints.length === 0) {
    showToast("No hay colores en la paleta");
    return;
  }
  const text = selectedPoints.map(c => `${c.hex}`).join("\n");
  navigator.clipboard.writeText(text)
    .then(() => showToast("Paleta copiada"))
    .catch(() => showToast("No se pudo copiar la paleta"));
});

// --- Estado inicial ---
(function init() {
  emptyMsg.style.display = "block";
  setCanvasSize(320, 240);
  paletteBtn.disabled = true;
  copyPaletteBtn.disabled = true;
})();

