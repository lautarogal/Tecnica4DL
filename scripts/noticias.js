document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("noticias-grid");
    const estado = document.getElementById("noticias-estado");
    if (!grid) return;

    const modal = document.createElement("div");
    modal.id = "noticia-modal";
    modal.className = "noticia-modal";
    modal.innerHTML = `
        <div class="noticia-modal-overlay"></div>
        <div class="noticia-modal-contenido" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
            <button type="button" class="noticia-modal-cerrar" aria-label="Cerrar noticia">
                <span class="material-icons">close</span>
            </button>
            <div class="noticia-modal-imagen"><img id="modal-imagen" src="" alt=""></div>
            <div class="noticia-modal-body">
                <span id="modal-categoria" class="noticia-categoria"></span>
                <h2 id="modal-titulo"></h2>
                <span class="noticia-fecha"><span class="material-icons">event</span><span id="modal-fecha"></span></span>
                <div id="modal-contenido" class="noticia-modal-texto"></div>
            </div>
        </div>`;
    document.body.appendChild(modal);

    const modalImagen = modal.querySelector("#modal-imagen");
    const modalCategoria = modal.querySelector("#modal-categoria");
    const modalTitulo = modal.querySelector("#modal-titulo");
    const modalFecha = modal.querySelector("#modal-fecha");
    const modalContenido = modal.querySelector("#modal-contenido");
    let noticias = [];

    function formatearFecha(fechaISO) {
        const fecha = new Date(`${fechaISO}T12:00:00`);
        return Number.isNaN(fecha.getTime())
            ? fechaISO
            : fecha.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    }

    function crearCardNoticia(noticia) {
        const card = document.createElement("article");
        card.className = "noticia-card";

        const imagen = document.createElement("div");
        imagen.className = "noticia-imagen";
        const foto = document.createElement("img");
        foto.src = noticia.portada;
        foto.alt = noticia.titulo;
        foto.loading = "lazy";
        imagen.appendChild(foto);

        const body = document.createElement("div");
        body.className = "noticia-body";

        if (noticia.categoria) {
            const categoria = document.createElement("span");
            categoria.className = "noticia-categoria";
            categoria.textContent = noticia.categoria;
            body.appendChild(categoria);
        }

        const titulo = document.createElement("h3");
        titulo.textContent = noticia.titulo;

        const fecha = document.createElement("span");
        fecha.className = "noticia-fecha";
        fecha.innerHTML = '<span class="material-icons">event</span>';
        const fechaTexto = document.createElement("span");
        fechaTexto.textContent = formatearFecha(noticia.fecha);
        fecha.appendChild(fechaTexto);

        const resumen = document.createElement("p");
        resumen.textContent = noticia.resumen;

        const enlace = document.createElement("a");
        enlace.href = `#noticia-${noticia.id}`;
        enlace.className = "noticia-link";
        enlace.dataset.noticiaId = noticia.id;
        enlace.append(document.createTextNode("Leer más "));
        const flecha = document.createElement("span");
        flecha.className = "material-icons";
        flecha.textContent = "arrow_forward";
        enlace.appendChild(flecha);

        body.append(titulo, fecha, resumen, enlace);
        card.append(imagen, body);
        return card;
    }

    function mostrarSkeletons(cantidad = 3) {
        grid.replaceChildren();
        for (let i = 0; i < cantidad; i += 1) {
            const skeleton = document.createElement("article");
            skeleton.className = "noticia-card skeleton";
            skeleton.innerHTML = '<div class="noticia-imagen"></div><div class="noticia-body"><div class="skeleton-line skeleton-small"></div><div class="skeleton-line"></div><div class="skeleton-line skeleton-short"></div></div>';
            grid.appendChild(skeleton);
        }
    }

    function renderNoticias(items) {
        grid.replaceChildren();
        if (items.length === 0) {
            const vacio = document.createElement("div");
            vacio.className = "noticias-vacio";
            vacio.textContent = "Todavía no hay noticias cargadas.";
            grid.appendChild(vacio);
            return;
        }
        items.forEach((noticia) => grid.appendChild(crearCardNoticia(noticia)));
    }

    function abrirNoticia(id) {
        const noticia = noticias.find((item) => Number(item.id) === Number(id));
        if (!noticia) return;

        modalImagen.src = noticia.portada;
        modalImagen.alt = noticia.titulo;
        modalImagen.style.display = "block";
        modalCategoria.textContent = noticia.categoria || "";
        modalTitulo.textContent = noticia.titulo;
        modalFecha.textContent = formatearFecha(noticia.fecha);
        modalContenido.innerHTML = noticia.contenido_html;
        modal.classList.add("activo");
        document.body.classList.add("modal-abierto");
    }

    function cerrarNoticia() {
        modal.classList.remove("activo");
        document.body.classList.remove("modal-abierto");
    }

    grid.addEventListener("click", (event) => {
        const link = event.target.closest(".noticia-link");
        if (!link) return;
        event.preventDefault();
        abrirNoticia(link.dataset.noticiaId);
    });
    modal.querySelector(".noticia-modal-cerrar").addEventListener("click", cerrarNoticia);
    modal.querySelector(".noticia-modal-overlay").addEventListener("click", cerrarNoticia);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("activo")) {
            cerrarNoticia();
        }
    });

    async function obtenerNoticias() {
        mostrarSkeletons();
        try {
            const limit = grid.dataset.limite;
            const endpoint = limit
                ? `api/noticias.php?limite=${encodeURIComponent(limit)}`
                : "api/noticias.php";
            const respuesta = await fetch(endpoint);
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
            noticias = await respuesta.json();
            if (!Array.isArray(noticias)) throw new Error("Respuesta de noticias inválida");
            renderNoticias(noticias);
        } catch (error) {
            console.error("No se pudieron cargar las noticias:", error);
            grid.replaceChildren();
            if (estado) estado.hidden = false;
        }
    }

    obtenerNoticias();
});
