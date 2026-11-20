document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("noticias-grid");
    const estado = document.getElementById("noticias-estado");

    if (!grid) return;

    const carrusel = document.getElementById("noticias-carrusel") || grid.parentElement;


    /*
     * Noticias ordenadas de la más reciente a la más antigua.
     * - id: número de la noticia en el documento de textos (1 a 9).
     * - fechaTexto: opcional. Si existe, se muestra en lugar de la fecha formateada
     *   (para noticias con fecha aproximada, ej. "Sep / Oct 2026").
     * - imagen: ruta de la imagen (ej. "img/noticias/noticia-9.jpg").
     *   Si está vacía se muestra el ícono de respaldo.
     * - posicion: opcional. object-position de la imagen (qué parte se ve al recortar),
     *   útil para fotos verticales. Por defecto "center".
     */
    const noticiasEjemplo = [
        {
            id: 9,
            titulo: "Prácticas solidarias: reparación y donación de netbooks en Quilmes",
            resumen: "Alumnos de prácticas profesionalizantes colaboraron en la donación de 12 netbooks reparadas a la Escuela Especial N° 503.",
            contenido: `
Los alumnos de prácticas profesionalizantes tuvieron una destacada participación en la Dirección de Tecnología Educativa (DTE) de Quilmes. Allí trabajaron intensamente en el armado y configuración de equipos informáticos de los programas Conectar Igualdad y Juana Manso.

Gracias a su esfuerzo técnico, logramos hacer de puente para concretar una importante donación de 12 netbooks reparadas a la Escuela Especial N° 503, aportando herramientas tecnológicas vitales para la comunidad educativa.
            `,
            fecha: "2026-11-15",
            fechaTexto: "Nov 2026",
            categoria: "Prácticas solidarias",
            imagen: "img/noticias/noticia-9.jpg"
        },

        {
            id: 8,
            titulo: "Éxito total en la Muestra Anual Educativa",
            resumen: "Las familias recorrieron proyectos de ciencias, software, taller y más en una jornada de gran éxito.",
            contenido: `
La jornada de la Muestra Anual Educativa fue un rotundo éxito. Los pasillos y aulas recibieron a las familias, que pudieron recorrer y maravillarse con una gran variedad de trabajos.

Desde proyectos literarios como "Booktoks" y experimentos de ciencias naturales, hasta las presentaciones de software en los laboratorios de informática y trabajos de carpintería y construcción en el área de taller. Incluso hubo torneos de ajedrez y una simulación de Asamblea General, demostrando el altísimo nivel y variedad de saberes de nuestros estudiantes.
            `,
            fecha: "2026-11-03",
            categoria: "Institucional",
            imagen: "img/noticias/noticia-8.jpg"
        },

        {
            id: 7,
            titulo: "Innovación en la Red de Robótica en el Teatro Argentino de La Plata",
            resumen: "Presentamos un prototipo de estación automatizada armada desde cero en el encuentro de la Red de Robótica de la ETP.",
            contenido: `
Fuimos invitados a participar en el Teatro Argentino de La Plata en el marco del encuentro de la Red de Robótica y Soluciones de Automatización de la ETP.

Felicitamos a nuestros alumnos por su excepcional desempeño: presentaron un prototipo de estación automatizada armada desde cero, siendo la única escuela que posee un desarrollo de este tipo. Este proyecto fue articulado en innovación con la Escuela Agraria N° 1 y la Secundaria N° 13, acompañados por el CEA 33 de Berazategui.

El trabajo captó la atención de todos y nuestros jóvenes incluso fueron entrevistados por la prensa.
            `,
            fecha: "2026-10-28",
            fechaTexto: "Oct 2026",
            categoria: "Robótica",
            imagen: "img/noticias/noticia-7.jpg"
        },

        {
            id: 6,
            titulo: "De las aulas a la trinchera comercial: así formamos a los futuros Gerentes Junior",
            resumen: "Alumnos certificados tras 200 horas de Prácticas Profesionalizantes en el programa Vinculando, con más de 2.000 oportunidades gestionadas en el CRM Odoo.",
            contenido: `
Creemos en la formación en el campo de batalla, y los números de nuestros chicos hoy hablan por sí solos.

La Fundación Pro Buenos Aires vivió un día de enorme orgullo al anunciar la entrega oficial de certificados a los alumnos de la EEST N° 4 de Berazategui, quienes culminaron con éxito sus 200 horas de Prácticas Profesionalizantes en el programa Vinculando.

No certificamos solo horas cumplidas. Certificamos competencias comerciales reales, probadas bajo presión y con resultados tangibles.

Lo que hicieron realmente: Los números no mienten

Lejos de las prácticas tradicionales de “observar”, nuestros alumnos se pusieron el traje de Técnicos Comerciales y ejecutaron un plan de trabajo riguroso en el CRM Odoo. Estos son los resultados de su esfuerzo:

• Más de 2.000 oportunidades de negocio relevadas, cargadas y gestionadas en la base de datos.
• Más de 620 propuestas comerciales en etapas avanzadas de negociación ("En evaluación" y "Propuesta Enviada"), listas para cerrar.
• Eficiencia de élite: alumnos destacados gestionaron más de 110 oportunidades cada uno, logrando tasas de pérdida menores al 12%. Un indicador de madurez comercial envidiable.
            `,
            fecha: "2026-10-22",
            categoria: "Prácticas Profesionalizantes",
            imagen: "img/noticias/noticia-6.jpg"
        },

        {
            id: 5,
            titulo: "Colorida celebración del Día de la Diversidad Cultural",
            resumen: "Stands, danzas y gastronomía típica de Perú, Argentina, Venezuela y Paraguay en una verdadera fiesta de integración.",
            contenido: `
La celebración del Día de la Diversidad Cultural se vivió en la escuela como una verdadera fiesta de integración. Los estudiantes prepararon hermosos trabajos artísticos, banderas, escarapelas y adornos de papel para representar a distintos países de la región.

Se organizaron stands temáticos con gastronomía típica: el espacio de Perú ofreció helados "marcianos", mientras que el stand de Argentina deleitó a todos con empanadas, tortas y alumnos vistiendo la camiseta de la selección, Venezuela deleitó con Tequeños, mientras que Paraguay nos sorprendió con una rica sopa paraguaya.

Y también representaron danzas de los países expuestos.
            `,
            fecha: "2026-10-12",
            categoria: "Institucional",
            imagen: "img/noticias/noticia-5.jpg"
        },

        {
            id: 4,
            titulo: "Participación activa del Centro de Estudiantes",
            resumen: "Representantes del Centro de Estudiantes lideraron mesas de diálogo en el encuentro de escuelas técnicas.",
            contenido: `
El Centro de Estudiantes de la EEST N° 4 participó activamente en el reciente encuentro de estudiantes de escuelas técnicas.

En un ambiente sumamente colaborativo y distendido, nuestros representantes lideraron mesas de diálogo, expusieron sus propuestas y debatieron sobre la organización estudiantil, reafirmando el compromiso cívico de nuestros jóvenes.
            `,
            fecha: "2026-10-10",
            fechaTexto: "Oct 2026",
            categoria: "Institucional",
            imagen: "img/noticias/noticia-4.jpg"
        },

        {
            id: 3,
            titulo: "Juegos Bonaerenses: Logros en Fotografía y Arte",
            resumen: "Bruno se consagró en 1er lugar en Fotografía en la etapa regional de los Juegos Bonaerenses 2026.",
            contenido: `
Nuestro estudiante Bruno se consagró en el 1er lugar en la disciplina de Fotografía durante la Etapa Regional de los Juegos Bonaerenses 2026.

Su talento lo llevó también a participar de las instancias artísticas del torneo bonaerense, donde exploró la técnica de cianotipia junto a otros jóvenes y adultos mayores, demostrando que en nuestra escuela técnica la creatividad y el arte tienen un lugar protagónico.
            `,
            fecha: "2026-10-01",
            fechaTexto: "Sep / Oct 2026",
            categoria: "Arte y Cultura",
            imagen: "img/noticias/noticia-3.jpg",
            posicion: "50% 22%"
        },

        {
            id: 2,
            titulo: "Orgullo en la Feria de Ciencias y Campeonato de Robótica",
            resumen: "Nuestros estudiantes presentaron dos proyectos innovadores en la Feria de Ciencias y participaron del Campeonato de Robótica.",
            contenido: `
Reconocemos con gran orgullo la destacada participación de nuestros estudiantes en la Feria de Ciencias, donde presentaron dos proyectos innovadores, y en el Campeonato de Robótica.

¡Su esfuerzo, creatividad y dedicación son una inspiración para toda la comunidad educativa! Sigan adelante, el futuro les pertenece.
            `,
            fecha: "2026-09-15",
            fechaTexto: "Sep 2026",
            categoria: "Ciencia y Tecnología",
            imagen: "img/noticias/noticia-2.jpg",
            posicion: "50% 22%"
        },

        {
            id: 1,
            titulo: "Destacada participación en torneos de Ajedrez",
            resumen: "Gonzalo Ruiz obtuvo el 1er puesto en un torneo interescolar y el 4° puesto en el regional Intertécnicas.",
            contenido: `
El alumno Gonzalo Ruiz representó a la escuela con excelentes resultados en dos importantes competencias de ajedrez.

El 18 de agosto, obtuvo el 1er puesto en la categoría principiantes durante el 3° Torneo Interescolar de Ajedrez realizado en la ES N° 25.

Posteriormente, el 25 de septiembre, Gonzalo demostró su nivel logrando el 4° puesto en el IX Torneo Regional de Ajedrez Intertécnicas (Copa Prof. Daniel González) organizado por la ONG Ajedrez Integrado.

¡Un gran orgullo para nuestra institución!
            `,
            fecha: "2026-09-25",
            fechaTexto: "Ago / Sep 2026",
            categoria: "Competencias",
            imagen: "img/noticias/noticia-1.jpg",
            posicion: "50% 40%"
        }
    ];


    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);

        if (isNaN(fecha.getTime())) {
            return fechaISO;
        }

        return fecha.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function etiquetaFecha(noticia) {
        return noticia.fechaTexto || formatearFecha(noticia.fecha);
    }




    function crearCardNoticia(noticia) {

        const card = document.createElement("article");

        card.className = "noticia-card";

        card.setAttribute("data-noticia-id", noticia.id);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Abrir noticia: ${noticia.titulo}`);

        let imagenHTML = "";

        if (noticia.imagen) {
            imagenHTML = `
                <img
                    src="${noticia.imagen}"
                    alt="${noticia.titulo}"
                    loading="lazy"
                    style="object-position: ${noticia.posicion || "center"}"
                >
            `;
        } else {
            imagenHTML = `
                <div class="noticia-imagen-fallback">
                    <span class="material-icons">article</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="noticia-imagen">
                ${imagenHTML}
            </div>

            <div class="noticia-body">

                ${
                    noticia.categoria
                        ? `<span class="noticia-categoria">${noticia.categoria}</span>`
                        : ""
                }

                <h3>${noticia.titulo}</h3>

                <span class="noticia-fecha">
                    <span class="material-icons">event</span>
                    ${etiquetaFecha(noticia)}
                </span>

                <p>${noticia.resumen}</p>

            </div>
        `;

        return card;
    }




    function mostrarSkeletons(cantidad = 3) {

        grid.innerHTML = "";

        for (let i = 0; i < cantidad; i++) {

            const skeleton = document.createElement("article");

            skeleton.className = "noticia-card skeleton";

            skeleton.innerHTML = `
                <div class="noticia-imagen"></div>

                <div class="noticia-body">
                    <div class="skeleton-line skeleton-small"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line skeleton-short"></div>
                </div>
            `;

            grid.appendChild(skeleton);
        }
    }


    function renderNoticias(noticias) {

        grid.innerHTML = "";

        if (!noticias || noticias.length === 0) {

            const vacio = document.createElement("div");

            vacio.className = "noticias-vacio";

            vacio.textContent = "Todavía no hay noticias cargadas.";

            grid.appendChild(vacio);

            return;
        }

        noticias.forEach((noticia) => {
            grid.appendChild(crearCardNoticia(noticia));
        });

        iniciarCarrusel();
    }




    /* ================= CARRUSEL ================= */

    let controles = null;

    function iniciarCarrusel() {

        const cards = grid.querySelectorAll(".noticia-card");
        const total = cards.length;

        if (total === 0) return;

        if (controles) {
            controles.remove();
        }

        grid.setAttribute("tabindex", "0");
        grid.setAttribute("role", "region");
        grid.setAttribute("aria-roledescription", "carrusel");
        grid.setAttribute("aria-label", "Noticias de la escuela");

        let escenario = grid.parentElement;

        if (!escenario.classList.contains("noticias-escenario")) {

            escenario = document.createElement("div");

            escenario.className = "noticias-escenario";

            grid.parentNode.insertBefore(escenario, grid);

            escenario.appendChild(grid);
        }

        escenario.querySelectorAll(".noticias-flecha").forEach(
            (boton) => boton.remove()
        );

        escenario.insertAdjacentHTML("beforeend", `
            <button
                type="button"
                class="noticias-flecha noticias-flecha--prev"
                aria-label="Noticia anterior"
            >
                <span class="material-icons">chevron_left</span>
            </button>

            <button
                type="button"
                class="noticias-flecha noticias-flecha--next"
                aria-label="Noticia siguiente"
            >
                <span class="material-icons">chevron_right</span>
            </button>
        `);

        controles = document.createElement("div");
        controles.className = "noticias-controles";

        controles.innerHTML = `
            <div class="noticias-indicador">
                <div class="noticias-puntos"></div>
            </div>
        `;

        carrusel.appendChild(controles);

        const btnPrev = escenario.querySelector(".noticias-flecha--prev");
        const btnNext = escenario.querySelector(".noticias-flecha--next");
        const contenedorPuntos = controles.querySelector(".noticias-puntos");

        let puntos = [];
        let cantidadPuntos = 0;


        function medidas() {

            const gap = parseFloat(
                getComputedStyle(grid).columnGap
            ) || 0;

            const ancho = cards[0].getBoundingClientRect().width;

            const paso = ancho + gap;

            if (!isFinite(paso) || paso <= 0) {
                return { paso: 1, visibles: 1 };
            }

            const visibles = Math.max(
                1,
                Math.round((grid.clientWidth + gap) / paso)
            );

            return { paso, visibles };
        }


        function construirPuntos() {

            const { visibles } = medidas();

            const nuevos = Math.max(1, total - visibles + 1);

            if (nuevos === cantidadPuntos) return;

            cantidadPuntos = nuevos;

            contenedorPuntos.innerHTML = "";

            puntos = [];

            for (let i = 0; i < cantidadPuntos; i++) {

                const punto = document.createElement("button");

                punto.type = "button";
                punto.className = "noticias-punto";
                punto.setAttribute(
                    "aria-label",
                    `Ir a la noticia ${i + 1}`
                );

                punto.addEventListener("click", () => irA(i));

                contenedorPuntos.appendChild(punto);
                puntos.push(punto);
            }
        }


        function indiceActual() {

            const { paso } = medidas();

            const maximo = grid.scrollWidth - grid.clientWidth;

            if (grid.scrollLeft >= maximo - 2) {
                return cantidadPuntos - 1;
            }

            return Math.min(
                cantidadPuntos - 1,
                Math.max(0, Math.round(grid.scrollLeft / paso))
            );
        }


        function actualizar() {

            construirPuntos();

            const indice = indiceActual();

            const maximo = grid.scrollWidth - grid.clientWidth;

            puntos.forEach((punto, i) => {
                punto.classList.toggle("activo", i === indice);

                if (i === indice) {
                    punto.setAttribute("aria-current", "true");
                } else {
                    punto.removeAttribute("aria-current");
                }
            });

            btnPrev.disabled = grid.scrollLeft <= 2;
            btnNext.disabled = grid.scrollLeft >= maximo - 2;
        }


        function irA(indice) {

            const { paso } = medidas();

            grid.scrollTo({
                left: indice * paso,
                behavior: "smooth"
            });
        }


        function mover(direccion) {

            const { paso } = medidas();

            grid.scrollBy({
                left: direccion * paso,
                behavior: "smooth"
            });
        }


        btnPrev.addEventListener("click", () => mover(-1));
        btnNext.addEventListener("click", () => mover(1));


        grid.addEventListener("keydown", (event) => {

            if (event.target !== grid) return;

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                mover(-1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                mover(1);
            }
        });


        let pendiente = false;

        grid.addEventListener("scroll", () => {

            if (pendiente) return;

            pendiente = true;

            requestAnimationFrame(() => {
                actualizar();
                pendiente = false;
            });

        }, { passive: true });


        window.addEventListener("resize", actualizar);


        /* ---------- Pase automático (solo en pantallas grandes) ---------- */

        const INTERVALO = 5000;

        // en celular no hay pase automático
        const celular = window.matchMedia("(max-width: 600px)");

        const reducirMovimiento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let timer = null;
        let pausaTemporal = false;


        function pasarSolo() {

            if (
                pausaTemporal ||
                document.hidden ||
                document.body.classList.contains("modal-abierto")
            ) return;

            // siguiente posición según el índice actual (más confiable que scrollBy con snap)
            const siguiente = indiceActual() + 1;

            irA(siguiente >= cantidadPuntos ? 0 : siguiente);
        }


        function detenerAuto() {

            clearInterval(timer);

            timer = null;
        }


        function arrancarAuto() {

            detenerAuto();

            if (celular.matches || reducirMovimiento.matches) return;

            timer = setInterval(pasarSolo, INTERVALO);
        }


        // pausa mientras el mouse está sobre las noticias o hay foco de teclado
        const escenarioNoticias = grid.parentElement;

        escenarioNoticias.addEventListener("mouseenter", () => {
            pausaTemporal = true;
        });

        escenarioNoticias.addEventListener("mouseleave", () => {
            pausaTemporal = false;
            arrancarAuto();
        });

        carrusel.addEventListener("focusin", (event) => {
            // solo el foco de teclado pausa; el de un click de mouse no
            pausaTemporal = event.target.matches(":focus-visible");
        });

        carrusel.addEventListener("focusout", () => {
            pausaTemporal = false;
            arrancarAuto();
        });

        // cualquier uso manual reinicia la cuenta regresiva
        btnPrev.addEventListener("click", arrancarAuto);
        btnNext.addEventListener("click", arrancarAuto);

        document.addEventListener("visibilitychange", arrancarAuto);

        // si se achica/agranda la ventana, se activa o apaga según corresponda
        celular.addEventListener("change", arrancarAuto);


        actualizar();

        arrancarAuto();
    }




    function crearModal() {

        const modal = document.createElement("div");

        modal.id = "noticia-modal";
        modal.className = "noticia-modal";

        modal.innerHTML = `
            <div class="noticia-modal-overlay"></div>

            <div
                class="noticia-modal-contenido"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
            >

                <button
                    type="button"
                    class="noticia-modal-cerrar"
                    aria-label="Cerrar noticia"
                >
                    <span class="material-icons">close</span>
                </button>

                <div class="noticia-modal-imagen">
                    <img id="modal-imagen" src="" alt="">
                </div>

                <div class="noticia-modal-body">

                    <span
                        id="modal-categoria"
                        class="noticia-categoria"
                    ></span>

                    <h2 id="modal-titulo"></h2>

                    <span class="noticia-fecha">
                        <span class="material-icons">event</span>
                        <span id="modal-fecha"></span>
                    </span>

                    <div
                        id="modal-contenido"
                        class="noticia-modal-texto"
                    ></div>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        return modal;
    }


    const modal = crearModal();


    const modalImagen = document.getElementById("modal-imagen");
    const modalCategoria = document.getElementById("modal-categoria");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalFecha = document.getElementById("modal-fecha");
    const modalContenido = document.getElementById("modal-contenido");



    function abrirNoticia(id) {

        const noticia = noticiasEjemplo.find(
            (item) => item.id === Number(id)
        );

        if (!noticia) return;




        if (noticia.imagen) {

            modalImagen.src = noticia.imagen;
            modalImagen.alt = noticia.titulo;
            modalImagen.style.objectPosition = noticia.posicion || "center";
            modalImagen.style.display = "block";

        } else {

            modalImagen.src = "";
            modalImagen.alt = "";
            modalImagen.style.display = "none";
        }




        modalCategoria.textContent =
            noticia.categoria || "";




        modalTitulo.textContent =
            noticia.titulo;



        modalFecha.textContent =
            etiquetaFecha(noticia);




        const contenido =
            (noticia.contenido || noticia.resumen).trim();

        modalContenido.innerHTML =
            contenido.replace(/\n/g, "<br>");



        modal.classList.add("activo");


        document.body.classList.add("modal-abierto");
    }



    function cerrarNoticia() {

        modal.classList.remove("activo");

        document.body.classList.remove("modal-abierto");

        if (ultimaCard) {
            ultimaCard.focus({ preventScroll: true });
        }
    }




    let ultimaCard = null;

    grid.addEventListener("click", (event) => {

        const card =
            event.target.closest(".noticia-card[data-noticia-id]");

        if (!card) return;

        ultimaCard = card;

        abrirNoticia(card.getAttribute("data-noticia-id"));
    });


    grid.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" && event.key !== " ") return;

        const card =
            event.target.closest(".noticia-card[data-noticia-id]");

        if (!card || event.target !== card) return;

        event.preventDefault();

        ultimaCard = card;

        abrirNoticia(card.getAttribute("data-noticia-id"));
    });




    const botonCerrar =
        modal.querySelector(".noticia-modal-cerrar");

    botonCerrar.addEventListener(
        "click",
        cerrarNoticia
    );




    const overlay =
        modal.querySelector(".noticia-modal-overlay");

    overlay.addEventListener(
        "click",
        cerrarNoticia
    );



    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("activo")
        ) {
            cerrarNoticia();
        }
    });




    async function obtenerNoticias() {

        mostrarSkeletons();

        try {

            await new Promise((resolve) => {
                setTimeout(resolve, 400);
            });

            renderNoticias(noticiasEjemplo);

            if (estado) {
                estado.hidden = true;
            }

        } catch (error) {

            console.error(
                "No se pudieron cargar las noticias:",
                error
            );

            grid.innerHTML = "";

            if (estado) {
                estado.hidden = false;
            }
        }
    }


    obtenerNoticias();

});
