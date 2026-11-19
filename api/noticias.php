<?php
require_once __DIR__ . '/../includes/blog.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $limit = isset($_GET['limite']) ? filter_var($_GET['limite'], FILTER_VALIDATE_INT) : null;
    if ($limit !== null && ($limit === false || $limit < 1 || $limit > 100)) {
        http_response_code(400);
        echo json_encode(['error' => 'El límite solicitado no es válido.']);
        exit;
    }

    $news = blog_get_news($limit);
    foreach ($news as &$item) {
        $item['contenido_html'] = blog_render_markdown($item['contenido']);
        unset($item['contenido']);
    }
    unset($item);
    echo json_encode($news, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    error_log('Error al cargar noticias: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'No se pudieron cargar las noticias.']);
}
