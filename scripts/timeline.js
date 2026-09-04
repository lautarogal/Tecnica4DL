document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".timeline-item");
    const progress = document.getElementById("timelineProgress");
    const track = document.querySelector(".timeline-track");
    const backToTop = document.getElementById("backToTop");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                }
            });
        },
        {
            threshold: 0.35,
            rootMargin: "0px 0px -80px 0px",
        }
    );

    items.forEach((item) => observer.observe(item));

    function actualizarProgreso() {
        if (!track || !progress) return;

        const rect = track.getBoundingClientRect();
        const alturaVentana = window.innerHeight;

        const recorrido = alturaVentana / 2 - rect.top;
        const porcentaje = Math.min(
            Math.max((recorrido / rect.height) * 100, 0),
            100
        );

        progress.style.height = porcentaje + "%";
    }

    function actualizarBotonVolver() {
        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                actualizarProgreso();
                actualizarBotonVolver();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", actualizarProgreso);

    backToTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    actualizarProgreso();
    actualizarBotonVolver();
});

document.addEventListener("navbarCargado", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const links = document.querySelector(".links");
    if (!menuBtn || !links) return;

    const menuIcon = menuBtn.querySelector(".material-icons");

    function toggleMenu() {
        const abierto = links.classList.toggle("active");
        menuBtn.classList.toggle("active", abierto);
        if (menuIcon) menuIcon.textContent = abierto ? "close" : "menu";
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
});