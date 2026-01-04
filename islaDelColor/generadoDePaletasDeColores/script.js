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

// función para copiar texto al portapapeles
function copyText(element) {
    const parent = element.parentElement;  
    const textSpan = parent.querySelector("span"); 
    const originalText = textSpan.innerText; 
    navigator.clipboard.writeText(originalText).then(() => {  
        textSpan.innerText = "¡Copiado!";
        setTimeout(() => {
            element.style.stroke = "#1e00ff"; 
            textSpan.innerText = originalText; 
        }, 1500);
    }).catch(err => {
        alert("Error al copiar: " + err);
    });
}

//Botón para copiar toda la paleta 
// Listener click del botón principal
document.getElementById('color-btn').addEventListener('click', () => {
    applyColorChange();
    showToast("También puedes presionar la tecla 'espacio' ");

    // Crear el botón "Copiar paleta completa" solo la primera vez
    if (!document.getElementById('copy-palette-btn')) {
        const btn = document.getElementById('color-btn');
        const copyBtn = document.createElement('button');
        copyBtn.id = 'copy-palette-btn';
        copyBtn.textContent = 'Copiar paleta completa';

        btn.parentNode.insertBefore(copyBtn, btn.nextSibling);

        // Listener para copiar toda la paleta
        copyBtn.addEventListener('click', () => {
            const colors = [
                document.getElementById('color-code').textContent,
                document.getElementById('color-name-one').textContent,
                document.getElementById('color-name-two').textContent,
                document.getElementById('color-name-three').textContent,
                document.getElementById('color-name-four').textContent,
                document.getElementById('color-name-five').textContent
            ];
            const paletteText = colors.join(', ');
            navigator.clipboard.writeText(paletteText).then(() => {
                // Cambiar texto del botón temporalmente
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Paleta copiada';

                // Restaurar después de 1.5 segundos
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            }).catch(err => {
                alert("Algo salió mal :( " + err);
            });
        });
    }
});


// función que genera un color hexadecimal aleatorio
function getRandomColor() {
    const hexChars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hexChars[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Función principal que aplica el cambio de color y paleta
function applyColorChange() {
    const baseColor = getRandomColor();
    const complementaryColor = getComplementaryColor(baseColor);
    const triadicColors = getTriadicColors(baseColor);
    const analogo = getAnalogousColors(baseColor);
    const tetradicColor = getTetradicColors(baseColor);

    // Cambiar fondo y código principal
    document.body.style.backgroundColor = baseColor;
    document.getElementById('color-code').textContent = baseColor;

    // Actualizar paleta
    const paletteBoxes = document.querySelectorAll('.color-box');
    paletteBoxes[0].style.backgroundColor = complementaryColor;
    paletteBoxes[1].style.backgroundColor = triadicColors[0];
    paletteBoxes[2].style.backgroundColor = triadicColors[1];
    paletteBoxes[3].style.backgroundColor = analogo[0];
    paletteBoxes[4].style.backgroundColor = tetradicColor[0];

    document.getElementById('color-name-one').textContent = complementaryColor; 
    document.getElementById('color-name-two').textContent = triadicColors[0];
    document.getElementById('color-name-three').textContent = triadicColors[1];
    document.getElementById('color-name-four').textContent = analogo[0];
    document.getElementById('color-name-five').textContent = tetradicColor[0];
}

// Listener click del botón
document.getElementById('color-btn').addEventListener('click', applyColorChange);

// Listener de la tecla espacio
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        applyColorChange();
    }
});

// Función para obtener el color complementario
function getComplementaryColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');

    return `#${compR}${compG}${compB}`;
}

// Funciones para convertir entre RGB y HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
    }
    return { h: Math.round(h), s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
}

//Función para convertir HSL a Hexadecimal
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60)      [r, g, b] = [c, x, 0];
    else if (h < 120)[r, g, b] = [x, c, 0];
    else if (h < 180)[r, g, b] = [0, c, x];
    else if (h < 240)[r, g, b] = [0, x, c];
    else if (h < 300)[r, g, b] = [x, 0, c];
    else             [r, g, b] = [c, 0, x];

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

// Función para obtener los colores triádicos
function getTriadicColors(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const hsl = rgbToHsl(r, g, b);
    const triad1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
    const triad2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

    return [triad1, triad2];
}

// Colores análogos
function getAnalogousColors(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const hsl = rgbToHsl(r, g, b);
    const analog1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
    const analog2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);

    return [analog1, analog2];
}

// Colores tetrádicos 
function getTetradicColors(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const hsl = rgbToHsl(r, g, b);
    const tetrad1 = hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l);
    const tetrad2 = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
    const tetrad3 = hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l);

    return [tetrad1, tetrad2, tetrad3];
}

// Función para mostrar un toast cerca del botón que notifica al usuario que puede usar la tecla espacio también
let toastShown = false; // variable de control

function showToast(message) {
    if (toastShown) return; 
    toastShown = true;

    const btn = document.getElementById('color-btn');
    const rect = btn.getBoundingClientRect();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>
            ${message}
        </span>
    `;

    // Posicionar cerca del botón
    toast.style.top = `${rect.top + window.scrollY-15}px`;
    toast.style.left = `${rect.left + window.scrollX-80}px`;

    document.body.appendChild(toast);

    // Mostrar con animación
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Ocultar después de 2s
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

