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
    const copyBtn = document.getElementById("copyBtn");
    const copyMsg = document.getElementById("copyMsg");

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
      ratioEl.textContent = Number.isFinite(ratio) ? ratio.toFixed(2) + " de 1" : "—";

      setStatus(aaNormalEl, ratio >= 4.5);
      setStatus(aaaNormalEl, ratio >= 7);
      setStatus(aaLargeEl, ratio >= 3);
      setStatus(aaaLargeEl, ratio >= 4.5);
    }

    function setStatus(el, pass) {
      el.classList.remove("ok", "bad");
      if (!Number.isFinite(parseFloat(ratioEl.textContent))) {
        el.textContent = "—"; el.classList.add("bad"); return;
      }
      el.textContent = pass ? "Cumple" : "No cumple";
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

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(ratioEl.textContent);
        copyMsg.textContent = "Copiado";
        setTimeout(() => (copyMsg.textContent = ""), 1200);
      } catch {
        copyMsg.textContent = "No se pudo copiar";
        setTimeout(() => (copyMsg.textContent = ""), 1200);
      }
    });

    update();