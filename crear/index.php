<?php
require_once __DIR__ . '/../includes/blog.php';

$password = getenv('BLOG_ADMIN_PASSWORD');
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('eest4_blog_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

$error = '';
$notice = '';
$form = [
    'titulo' => '',
    'resumen' => '',
    'categoria' => '',
    'fecha' => date('Y-m-d'),
    'contenido' => '',
];
$images = [];
$cover = '';

function crear_safe_image(string $path): bool
{
    if (!preg_match('#^uploads/[a-f0-9]{32}\.(jpg|png|gif|webp)$#', $path)) {
        return false;
    }

    $file = realpath(BLOG_ROOT . '/' . $path);
    $uploads = realpath(BLOG_UPLOADS_DIR);
    return $file !== false && $uploads !== false && str_starts_with($file, $uploads . DIRECTORY_SEPARATOR);
}

function crear_add_uploaded_images(array $files): array
{
    $saved = [];
    if (!isset($files['name']) || !is_array($files['name'])) {
        return $saved;
    }

    foreach ($files['name'] as $index => $name) {
        $image = blog_store_uploaded_image([
            'name' => $name,
            'tmp_name' => $files['tmp_name'][$index] ?? '',
            'size' => $files['size'][$index] ?? 0,
            'error' => $files['error'][$index] ?? UPLOAD_ERR_NO_FILE,
        ]);
        if ($image !== null) {
            $saved[] = $image;
        }
    }
    return $saved;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf']) || !hash_equals($_SESSION['csrf'], (string) $_POST['csrf'])) {
        $error = 'La sesión del formulario venció. Actualizá la página e intentá de nuevo.';
    } elseif (isset($_POST['cerrar_sesion'])) {
        $_SESSION = [];
        session_regenerate_id(true);
        header('Location: ./');
        exit;
    } elseif ($password === false || $password === '') {
        $error = 'El acceso está deshabilitado: falta configurar BLOG_ADMIN_PASSWORD en el servidor.';
    } elseif (empty($_SESSION['autenticado'])) {
        $enteredPassword = (string) ($_POST['contrasena'] ?? '');
        if (hash_equals($password, $enteredPassword)) {
            session_regenerate_id(true);
            $_SESSION['autenticado'] = true;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: ./');
            exit;
        }
        $error = 'La contraseña no es correcta.';
    } else {
        foreach (array_keys($form) as $field) {
            $form[$field] = trim((string) ($_POST[$field] ?? ''));
        }
        $images = array_values(array_unique(array_filter(
            $_POST['imagenes_procesadas'] ?? [],
            static fn ($path): bool => is_string($path) && crear_safe_image($path)
        )));
        $cover = (string) ($_POST['portada'] ?? '');

        try {
            if (($_POST['accion'] ?? '') === 'convertir') {
                $images = array_merge($images, crear_add_uploaded_images($_FILES['imagenes'] ?? []));
                $document = $_FILES['documento'] ?? ['error' => UPLOAD_ERR_NO_FILE];
                if (($document['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
                    $converted = blog_convert_document($document);
                    $form['contenido'] = trim($form['contenido'] . "\n\n" . $converted['markdown']);
                    $images = array_merge($images, $converted['images']);
                }

                $images = array_values(array_unique($images));
                foreach ($images as $index => $image) {
                    if (!str_contains($form['contenido'], '](' . $image . ')')) {
                        $form['contenido'] .= "\n\n![Imagen " . ($index + 1) . '](' . $image . ')';
                    }
                }
                if ($cover === '' && isset($images[0])) {
                    $cover = $images[0];
                }
                $notice = 'Documento e imágenes preparados. Revisá el texto, elegí la portada y publicá.';
            } elseif (($_POST['accion'] ?? '') === 'publicar') {
                $title = $form['titulo'];
                $summary = $form['resumen'];
                $date = DateTime::createFromFormat('!Y-m-d', $form['fecha']);
                $dateErrors = DateTime::getLastErrors();
                if ($title === '' || $summary === '' || trim($form['contenido']) === '') {
                    throw new RuntimeException('Completá el título, el resumen y el contenido de la noticia.');
                }
                if (strlen($title) > 160 || strlen($summary) > 500) {
                    throw new RuntimeException('El título admite hasta 160 caracteres y el resumen hasta 500.');
                }
                if ($date === false || ($dateErrors !== false && ($dateErrors['warning_count'] || $dateErrors['error_count']))) {
                    throw new RuntimeException('La fecha indicada no es válida.');
                }

                if (!crear_safe_image($cover)) {
                    throw new RuntimeException('Elegí una portada entre las imágenes preparadas.');
                }
                $imagePath = realpath(BLOG_ROOT . '/' . $cover);
                $mime = $imagePath === false ? false : (new finfo(FILEINFO_MIME_TYPE))->file($imagePath);
                if (!in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true)) {
                    throw new RuntimeException('La imagen elegida como portada no es válida.');
                }

                $insert = blog_db()->prepare(
                    'INSERT INTO noticias (titulo, resumen, contenido, categoria, portada, fecha)
                     VALUES (:titulo, :resumen, :contenido, :categoria, :portada, :fecha)'
                );
                $insert->execute([
                    ':titulo' => $title,
                    ':resumen' => $summary,
                    ':contenido' => $form['contenido'],
                    ':categoria' => mb_substr($form['categoria'], 0, 60),
                    ':portada' => $cover,
                    ':fecha' => $date->format('Y-m-d'),
                ]);
                $_SESSION['csrf'] = bin2hex(random_bytes(32));
                header('Location: ./?publicada=1');
                exit;
            }
        } catch (RuntimeException $exception) {
            $error = $exception->getMessage();
        } catch (Throwable $exception) {
            error_log('Error al guardar una noticia: ' . $exception->getMessage());
            $error = 'No se pudo completar la operación. Revisá los registros del servidor.';
        }
    }
}

if (isset($_GET['publicada']) && isset($_SESSION['autenticado'])) {
    $notice = 'La noticia se publicó correctamente.';
}

$csrf = blog_escape($_SESSION['csrf']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear noticia | EESTN N°4</title>
    <link rel="icon" type="image/png" href="../img/LogoTec4Blanco.png">
    <link rel="stylesheet" href="../styles/font.css">
    <link rel="stylesheet" href="../styles/internas.css">
    <link rel="stylesheet" href="../styles/blog.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
    <header class="portal-hero">
        <p class="portal-hero-eyebrow">EESTN N°4 · Administración</p>
        <h1 class="portal-hero-title">Crear noticia</h1>
        <p class="portal-hero-sub"><a href="../noticias.php">Volver a noticias</a></p>
    </header>
    <main class="blog-admin">
        <?php if ($error !== ''): ?>
            <p class="blog-message blog-message--error" role="alert"><?= blog_escape($error) ?></p>
        <?php endif; ?>
        <?php if ($notice !== ''): ?>
            <p class="blog-message" role="status"><?= blog_escape($notice) ?></p>
        <?php endif; ?>

        <?php if ($password === false || $password === ''): ?>
            <section class="blog-panel">
                <h2>Configuración necesaria</h2>
                <p>El acceso de publicación está deshabilitado. Configurá la variable de entorno <code>BLOG_ADMIN_PASSWORD</code> en el servidor y reiniciá Apache.</p>
            </section>
        <?php elseif (empty($_SESSION['autenticado'])): ?>
            <form class="blog-panel blog-form" method="post">
                <input type="hidden" name="csrf" value="<?= $csrf ?>">
                <label for="contrasena">Contraseña compartida</label>
                <input id="contrasena" name="contrasena" type="password" autocomplete="current-password" required>
                <button class="portal-cta" type="submit">Ingresar</button>
            </form>
        <?php else: ?>
            <form class="blog-panel blog-form" method="post" enctype="multipart/form-data">
                <input type="hidden" name="csrf" value="<?= $csrf ?>">
                <?php foreach ($images as $image): ?>
                    <input type="hidden" name="imagenes_procesadas[]" value="<?= blog_escape($image) ?>">
                <?php endforeach; ?>

                <div class="blog-form-top">
                    <p>Una contraseña compartida para todo el equipo directivo.</p>
                    <button class="blog-logout" type="submit" name="cerrar_sesion" value="1">Cerrar sesión</button>
                </div>

                <label for="titulo">Título</label>
                <input id="titulo" name="titulo" maxlength="160" value="<?= blog_escape($form['titulo']) ?>" required>

                <label for="resumen">Resumen</label>
                <textarea id="resumen" name="resumen" rows="3" maxlength="500" required><?= blog_escape($form['resumen']) ?></textarea>

                <div class="blog-fields-row">
                    <div>
                        <label for="categoria">Categoría</label>
                        <input id="categoria" name="categoria" maxlength="60" value="<?= blog_escape($form['categoria']) ?>" placeholder="Institucional">
                    </div>
                    <div>
                        <label for="fecha">Fecha</label>
                        <input id="fecha" name="fecha" type="date" value="<?= blog_escape($form['fecha']) ?>" required>
                    </div>
                </div>

                <label for="documento">Convertir un PDF o DOCX (opcional)</label>
                <input id="documento" name="documento" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                <p class="blog-hint">Hasta 15 MB. PDF: el servidor debe tener Poppler instalado. DOCX: se extrae el texto y las imágenes.</p>

                <label for="imagenes">Agregar imágenes (opcional)</label>
                <input id="imagenes" name="imagenes[]" type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple>
                <p class="blog-hint">JPG, PNG, GIF o WebP; hasta 8 MB cada una. Prepará primero las imágenes para elegir la portada.</p>

                <button class="blog-secondary-button" type="submit" name="accion" value="convertir">Convertir documento y preparar imágenes</button>

                <label for="contenido">Contenido en Markdown</label>
                <textarea id="contenido" name="contenido" rows="14"><?= blog_escape($form['contenido']) ?></textarea>
                <p class="blog-hint">Se admiten títulos con #, listas con -, negrita con **texto** y enlaces con [texto](https://...).</p>

                <?php if ($images !== []): ?>
                    <fieldset class="blog-cover-options">
                        <legend>Elegí la imagen de portada</legend>
                        <div class="blog-image-choices">
                            <?php foreach ($images as $index => $image): ?>
                                <?php if (crear_safe_image($image)): ?>
                                    <label class="blog-image-choice">
                                        <input type="radio" name="portada" value="<?= blog_escape($image) ?>" <?= $cover === $image || ($cover === '' && $index === 0) ? 'checked' : '' ?> required>
                                        <img src="../<?= blog_escape($image) ?>" alt="Imagen <?= $index + 1 ?>">
                                        <span>Imagen <?= $index + 1 ?></span>
                                    </label>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </div>
                    </fieldset>
                <?php endif; ?>

                <button class="portal-cta" type="submit" name="accion" value="publicar">Publicar noticia</button>
            </form>
        <?php endif; ?>
    </main>
</body>
</html>
