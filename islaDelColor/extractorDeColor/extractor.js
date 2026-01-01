const pickBtn = document.getElementById("pickBtn");
const fileInput = document.getElementById("fileInput");
const stage = document.getElementById("stage");
const ctx = stage.getContext("2d");
const emptyMsg = document.getElementById("emptyMsg");

const swatch = document.getElementById("swatch");
const hexEl = document.getElementById("hex");
const rgbEl = document.getElementById("rgb");
const copyHexBtn = document.getElementById("copyHex");
const copyRgbBtn = document.getElementById("copyRgb");
const paletteContainer = document.getElementById("palette");
const toast = document.getElementById("toast");

let img = null;

// --- Utilidades ---
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function setCanvasSize(w, h) {
  stage.width = w;
  stage.height = h;
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
    drawImageToCanvas(img);
    URL.revokeObjectURL(url);
  };
  image.onerror = () => showToast("No se pudo cargar la imagen");
  image.src = url;
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
  swatch.style.backgroundColor = `rgb(${r},${g},${b})`;
  hexEl.textContent = hex;
  rgbEl.textContent = `rgb(${r},${g},${b})`;
  copyHexBtn.disabled = false;
  copyRgbBtn.disabled = false;
  generatePaletteFromSeed([r, g, b]);
});

// --- Copiado ---
copyHexBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(hexEl.textContent)
    .then(() => showToast("HEX copiado"))
    .catch(() => showToast("No se pudo copiar HEX"));
});
copyRgbBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(rgbEl.textContent)
    .then(() => showToast("RGB copiado"))
    .catch(() => showToast("No se pudo copiar RGB"));
});

// --- Paleta dominante  ---
function generatePaletteFromSeed(seed) {
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  tmp.width = 200;
  tmp.height = Math.round(200 * (stage.height / stage.width));
  tctx.drawImage(stage, 0, 0, tmp.width, tmp.height);
  const { data } = tctx.getImageData(0, 0, tmp.width, tmp.height);

  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 64) continue;
    const key = `${r},${g},${b}`;
    const dist = Math.sqrt(
      Math.pow(r - seed[0], 2) +
      Math.pow(g - seed[1], 2) +
      Math.pow(b - seed[2], 2)
    );
    buckets.set(key, dist);
  }

  const sorted = [...buckets.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, 6)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, hex: rgbToHex(r, g, b) };
    });

  paletteContainer.innerHTML = "";
  sorted.forEach(c => {
    const chip = document.createElement("div");
    chip.className = "chip";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = `rgb(${c.r},${c.g},${c.b})`;

    const meta = document.createElement("div");
    meta.className = "meta";

    const hexSpan = document.createElement("span");
    hexSpan.className = "hex";
    hexSpan.textContent = c.hex;

    const rgbSpan = document.createElement("span");
    rgbSpan.textContent = `rgb(${c.r},${c.g},${c.b})`;

    meta.appendChild(hexSpan);
    meta.appendChild(rgbSpan);

    chip.appendChild(colorDiv);
    chip.appendChild(meta);
    paletteContainer.appendChild(chip);
  });
}

// --- Estado inicial ---
(function init() {
  emptyMsg.style.display = "block";
  copyHexBtn.disabled = true;
  copyRgbBtn.disabled = true;
  setCanvasSize(320, 240);
})();
