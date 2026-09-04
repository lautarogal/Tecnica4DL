document.addEventListener("navbarCargado", () => {
    const item = document.querySelector(".has-dropdown");
    if (!item) return;

    const toggle = item.querySelector(".dropdown-toggle");

    toggle.addEventListener("click", (e) => {
        e.preventDefault();
        item.classList.toggle("dropdown-open");
    });

    document.addEventListener("click", (e) => {
        if (item.classList.contains("dropdown-open") && !item.contains(e.target)) {
            item.classList.remove("dropdown-open");
        }
    });
});
