
const mensaje = "écnica N°4 Ricardo Alberto Lopez";
const texto = document.getElementById("texto");

let i = 0;
let escribiendo = true;

function maquinaDeEscribir() {
    if (escribiendo) {
        texto.textContent = mensaje.substring(0, i);
        i++;
        if (i > mensaje.length) {
            escribiendo = false;
            setTimeout(maquinaDeEscribir, 1500);
            return;
        }
        setTimeout(maquinaDeEscribir, 100);
    } else {
        texto.textContent = mensaje.substring(0, i);
        i--;
        if (i < 0) {
            escribiendo = true;
            i = 0;
            setTimeout(maquinaDeEscribir, 500);
            return;
        }
        setTimeout(maquinaDeEscribir, 100);
    }
}

maquinaDeEscribir();

function initMenu() {
    const menuBtn = document.querySelector(".menu-btn");
    const links = document.querySelector(".links");
    if (!menuBtn || !links) return;

    const menuIcon = menuBtn.querySelector(".material-icons");

    function toggleMenu() {
        const abierto = links.classList.toggle("active");
        menuBtn.classList.toggle("active", abierto);
        menuIcon.textContent = abierto ? "close" : "menu";
    }

    menuBtn.addEventListener("click", toggleMenu);

    links.querySelectorAll("a:not(.dropdown-toggle)").forEach((link) => {
        link.addEventListener("click", () => {
            if (links.classList.contains("active")) toggleMenu();
        });
    });

    document.addEventListener("click", (e) => {
        if (
            links.classList.contains("active") &&
            !links.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {
            toggleMenu();
        }
    });
}

document.addEventListener("navbarCargado", initMenu);