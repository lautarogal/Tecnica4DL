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

    links.querySelectorAll(":scope > ul > li > a:not(.dropdown-toggle)").forEach((link) => {
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
