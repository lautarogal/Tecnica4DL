document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("noticias-grid");
    const estado = document.getElementById("noticias-estado");

    if (!grid) return;


    const noticiasEjemplo = [
        {
            id: 1,
            titulo: "Chacra Experimental",
            resumen: "Proyecto Interinstitucional: Diseño y construccion de una estacion meteorologica inteligente",
            contenido: `
                El día miércoles 29/04  se llevó a cabo el primer encuentro de reconocimiento  en la “Chacra Experimental Integrada El Pato”, ubicada en la Calle 517 y 651, El Pato, Berazategui- Provincia de Buenos Aires. 

                El mismo se encuadra en el “Proyecto Interinstitucional:  DISEÑO Y CONSTRUCCIÓN DE UNA ESTACIÓN METEOROLÓGICA INTELIGENTE” ,
                de la que participan estudiantes, docentes y Directivos de las siguientes instituciones berazateguenses: Centro de Educación Agraria N° 33, Escuela de Educación Secundaria N° 13, Escuela de Educación Secundaria Agraria N° 1,
                Escuela de Educación Secundaria Técnica N° 4.
                  
                Experiencia que además contó con una instancia de socialización , desayuno y almuerzo mediante, entre adolescentes de distintas ramas educativas.
                A su vez participaron del mismo, representantes del Departamento de Desarrollo Agrario de la Municipalidad de Berazategui, de la Universidad Arturo Jauretche (UNAJ), del  Instituto Nacional de Tecnología Agropecuaria (INTA),
                del Centro de Educación Agraria N° 34 de Almirante Brown y de la Dirección de Tecnología Educativa (DTE- Región 4). 

                Dicho Proyecto cuenta con el respaldo del Departamento de Desarrollo Agrario de la provincia de Buenos Aires, de la Universidad Nacional Arturo Jauretche, 
                de la Facultad de Ingeniería de la Universidad Nacional de Lomas de Zamora, del Instituto Nacional de Tecnología Agropecuaria, del Consejo Provincial de Educación y Trabajo (COPRET),
                de la Dirección de Desarrollo Productivo de la Municipalidad de Berazategui, de la Oficina de Empleo de la Municipalidad de Berazategui, de la Dirección de Tecnología Educativa de la Provincia de Buenos Aires (DTE) ,
                de Cooperativas que nuclean a productores de la Agricultura Familiar de la Región, del Inspector Técnico Pedagógico de las Instituciones dependientes de la Dirección de Educación Agraria Cristian A. Pupilli,  de la Jefatura Distrital de Berazategui y de las Inspecciones de las Instituciones involucradas.

                Se agradece a quienes motorizaron este proyecto en pos de una Educación Secundaria de Calidad y Academicismo con compromiso y dedicación: A
                lejandro Anchava y Lautaro Aranda (CEA N°33); Gustavo Maugeri, Leandro Dagand y Silvana Policastro (E.E.S.T.N°4) Patricio Carrasco, Jorge Cracco y Romina Rastelli (E.E.S.N°13).
                            `,
            fecha: "2026-08-28",
            categoria: "Institucional",
            imagen: "img/chacra.jpeg"
        },

        {
            id: 2,
            titulo: "Proyecto municipal",
            resumen: "Proyecto municipal en conjunto con la tecnica 5, de alumnos y profesores",
            contenido: `
                Estudiantes de programación de 7mo y 6to de nuestra escuela participan en un proyecto municipal, 
                en conjunto con estudiantes de la Tecnica 5, que consta de una actualización y mejora a los bustos ubicados en la 
                Plaza de los Bomberos sobre Diag. Lisandro de la Torre y Av. 14.

            `,
            fecha: "2026-08-05",
            categoria: "Institucional",
            imagen: "img/Peron.jpeg"
        },

        {
            id: 3,
            titulo: "Feria de Ciencias",
            resumen: 'Alumnos de 3°2° y 6°4° presentaron sus proyectos como "Energía bajo nuestros pies" o el de "Life Bot".',
            contenido: `
                Los alumnos de 3°2° y 6°4° participaron de la Feria de Ciencias,
                presentando diferentes proyectos desarrollados durante el ciclo lectivo.

                Entre las propuestas se encontraron proyectos como "Energía bajo nuestros pies"
                y "Life Bot", donde los estudiantes pudieron demostrar sus conocimientos,
                creatividad y capacidad para resolver problemas.

                La feria permitió compartir los trabajos realizados y acercar a toda la
                comunidad educativa a los proyectos tecnológicos desarrollados en la escuela.

                Los estudiantes trabajaron durante diferentes etapas para investigar,
                desarrollar y presentar sus proyectos frente a la comunidad educativa.

                Felicitamos a todos los alumnos y docentes que participaron de esta iniciativa.
            `,
            fecha: "2026-07-28",
            categoria: "Institucional",
            imagen: "img/robopelea.jfif"
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




    function crearCardNoticia(noticia) {

        const card = document.createElement("article");

        card.className = "noticia-card";

        let imagenHTML = "";

        if (noticia.imagen) {
            imagenHTML = `
                <img
                    src="${noticia.imagen}"
                    alt="${noticia.titulo}"
                    loading="lazy"
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
                    ${formatearFecha(noticia.fecha)}
                </span>

                <p>${noticia.resumen}</p>

                <a
                    href="#"
                    class="noticia-link"
                    data-noticia-id="${noticia.id}"
                >
                    Leer más
                    <span class="material-icons">arrow_forward</span>
                </a>

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
            formatearFecha(noticia.fecha);




        const contenido =
            noticia.contenido || noticia.resumen;

        modalContenido.innerHTML =
            contenido.replace(/\n/g, "<br>");



        modal.classList.add("activo");


        document.body.classList.add("modal-abierto");
    }



    function cerrarNoticia() {

        modal.classList.remove("activo");

        document.body.classList.remove("modal-abierto");
    }




    grid.addEventListener("click", (event) => {

        const link =
            event.target.closest(".noticia-link");

        if (!link) return;

        event.preventDefault();

        const id =
            link.getAttribute("data-noticia-id");

        abrirNoticia(id);
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