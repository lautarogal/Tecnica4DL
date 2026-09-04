document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tec-tab");
    const paneles = document.querySelectorAll(".tec-panel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            paneles.forEach((p) => p.classList.remove("active"));

            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            document.getElementById(`tec-${tab.dataset.tec}`).classList.add("active");
        });
    });

    document.querySelectorAll(".tec-plan-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.parentElement.classList.toggle("open");
        });
    });
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