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

 
 // Conversión HEX a RGB
    function hexToRgb(hex) {
      const clean = hex.trim().replace(/^#/, "");
      if (![3, 6].includes(clean.length)) return null;
      const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
      const n = parseInt(full, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    // sRGB -> lineal
    function srgbToLinear(c) {
      const cs = c / 255;
      return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    }
    // Luminancia relativa
    function relativeLuminance({ r, g, b }) {
      const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    // Ratio de contraste
    function contrastRatio(hex1, hex2) {
      const rgb1 = hexToRgb(hex1), rgb2 = hexToRgb(hex2);
      if (!rgb1 || !rgb2) return NaN;
      const L1 = relativeLuminance(rgb1), L2 = relativeLuminance(rgb2);
      const lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
      return (lighter + 0.05) / (darker + 0.05);
    }
    // Normalizar HEX
    function normalizeHex(v) {
      const s = v.trim();
      if (/^#?[0-9a-fA-F]{3}$/.test(s) || /^#?[0-9a-fA-F]{6}$/.test(s)) {
        return "#" + s.replace("#", "").toLowerCase();
      }
      return null;
    }
    // UI refs
    const fgColor = document.getElementById("fgColor");
    const bgColor = document.getElementById("bgColor");
    const fgHexInput = document.getElementById("fgHex");
    const bgHexInput = document.getElementById("bgHex");
    const ratioEl = document.getElementById("ratio");
    const aaNormalEl = document.getElementById("aaNormal");
    const aaaNormalEl = document.getElementById("aaaNormal");
    const aaLargeEl = document.getElementById("aaLarge");
    const aaaLargeEl = document.getElementById("aaaLarge");
    const swatchFg = document.getElementById("swatchFg");
    const swatchBg = document.getElementById("swatchBg");
    const swatchFgHex = document.getElementById("swatchFgHex");
    const swatchBgHex = document.getElementById("swatchBgHex");
    const preview = document.getElementById("preview");

    function update() {
      const fgHex = fgColor.value;
      const bgHex = bgColor.value;
      fgHexInput.value = fgHex;
      bgHexInput.value = bgHex;

      swatchFg.style.background = fgHex;
      swatchBg.style.background = bgHex;
      swatchFgHex.textContent = fgHex;
      swatchBgHex.textContent = bgHex;

      preview.style.color = fgHex;
      preview.style.background = bgHex;

      const ratio = contrastRatio(fgHex, bgHex);
      ratioEl.textContent = Number.isFinite(ratio) ? ratio.toFixed(2) + " de 27" : "—";

      setStatus(aaNormalEl, ratio >= 4.5);
      setStatus(aaaNormalEl, ratio >= 7);
      setStatus(aaLargeEl, ratio >= 3);
      setStatus(aaaLargeEl, ratio >= 4.5);
    }

   function setStatus(el, pass) {
  el.classList.remove("ok", "bad");

  if (!Number.isFinite(parseFloat(ratioEl.textContent))) {
    el.textContent = "—";
    el.classList.add("bad");
    return;
  }

  if (pass) {
    // Icono verde de check
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"
           viewBox="0 0 24 24" fill="#15c46f"
           class="icon icon-tabler icons-tabler-filled icon-tabler-square-check">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
      </svg>`;
  } else {
    // Icono rojo de X
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="#f07070" class="icon icon-tabler icons-tabler-filled icon-tabler-xbox-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10m3.6 5.2a1 1 0 0 0 -1.4 .2l-2.2 2.933l-2.2 -2.933a1 1 0 1 0 -1.6 1.2l2.55 3.4l-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2 -2.933l2.2 2.933a1 1 0 0 0 1.6 -1.2l-2.55 -3.4l2.55 -3.4a1 1 0 0 0 -.2 -1.4" /></svg>`;
  }

  el.classList.add(pass ? "ok" : "bad");
}


    function updateFromTextInputs() {
      const f = normalizeHex(fgHexInput.value);
      const b = normalizeHex(bgHexInput.value);
      if (f) fgColor.value = f;
      if (b) bgColor.value = b;
      update();
    }

    fgColor.addEventListener("input", update);
    bgColor.addEventListener("input", update);
    fgHexInput.addEventListener("change", updateFromTextInputs);
    bgHexInput.addEventListener("change", updateFromTextInputs);


    update();