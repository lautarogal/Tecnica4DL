<?php
require_once __DIR__ . '/includes/blog.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Noticias | EESTN N°4</title>
    <link rel="icon" type="image/png" href="img/LogoTec4Blanco.png">
    <link rel="stylesheet" href="styles/font.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="stylesheet" href="styles/footer.css">
    <link rel="stylesheet" href="styles/internas.css">
    <link rel="stylesheet" href="styles/noticias.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
    <div id="navbar-componente"></div>
    <header class="portal-hero">
        <div class="portal-hero-grid" aria-hidden="true"></div>
        <div class="portal-badge"><span class="material-icons">article</span></div>
        <p class="portal-hero-eyebrow">EESTN N°4 · Al día</p>
        <h1 class="portal-hero-title">Noticias</h1>
        <p class="portal-hero-sub">Novedades, eventos y avisos de la institución.</p>
    </header>
    <main class="noticias-section">
        <div id="noticias-grid" class="noticias-grid"></div>
        <p id="noticias-estado" class="noticias-estado" hidden role="alert">No se pudieron cargar las noticias. Intentá nuevamente más tarde.</p>
    </main>
    <div id="footer-componente"></div>
    <script src="scripts/noticias.js"></script>
    <script src="scripts/navbar.js"></script>
    <script src="scripts/dropdown.js"></script>
    <script src="scripts/footer.js"></script>
</body>
</html>
