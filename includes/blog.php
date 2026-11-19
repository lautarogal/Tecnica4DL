<?php

const BLOG_ROOT = __DIR__ . '/..';
const BLOG_DATA_DIR = BLOG_ROOT . '/data';
const BLOG_UPLOADS_DIR = BLOG_ROOT . '/uploads';
const BLOG_MAX_UPLOAD_SIZE = 15728640;

date_default_timezone_set('America/Argentina/Buenos_Aires');

function blog_db(): PDO
{
    static $db;

    if ($db instanceof PDO) {
        return $db;
    }

    foreach ([BLOG_DATA_DIR, BLOG_UPLOADS_DIR] as $directory) {
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new RuntimeException('No se pudo crear el directorio ' . $directory);
        }
    }

    $db = new PDO('sqlite:' . BLOG_DATA_DIR . '/noticias.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $db->exec('PRAGMA foreign_keys = ON');
    $db->exec(
        'CREATE TABLE IF NOT EXISTS noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            resumen TEXT NOT NULL,
            contenido TEXT NOT NULL,
            categoria TEXT NOT NULL DEFAULT "",
            portada TEXT NOT NULL,
            fecha TEXT NOT NULL,
            creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    $count = (int) $db->query('SELECT COUNT(*) FROM noticias')->fetchColumn();
    if ($count === 0) {
        $seed = $db->prepare(
            'INSERT INTO noticias (titulo, resumen, contenido, categoria, portada, fecha)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $initialNews = [
            [
                'Chacra Experimental',
                'Proyecto interinstitucional: diseño y construcción de una estación meteorológica inteligente.',
                "El miércoles 29 de abril se realizó el primer encuentro de reconocimiento en la Chacra Experimental Integrada El Pato, ubicada en Calle 517 y 651, El Pato, Berazategui. La jornada forma parte del proyecto interinstitucional «Diseño y construcción de una estación meteorológica inteligente», del que participan estudiantes, docentes y directivos del Centro de Educación Agraria N° 33, la Escuela de Educación Secundaria N° 13, la Escuela de Educación Secundaria Agraria N° 1 y la Escuela de Educación Secundaria Técnica N° 4.\n\nLa experiencia incluyó una instancia de socialización entre estudiantes de distintas ramas educativas. También participaron representantes del Departamento de Desarrollo Agrario de la Municipalidad de Berazategui, la Universidad Arturo Jauretche (UNAJ), el Instituto Nacional de Tecnología Agropecuaria (INTA), el Centro de Educación Agraria N° 34 de Almirante Brown y la Dirección de Tecnología Educativa de la Región 4.\n\nEl proyecto cuenta con el respaldo de organismos provinciales y municipales, universidades, el INTA, el COPRET, cooperativas de productores, la Dirección de Tecnología Educativa, la Jefatura Distrital de Berazategui y las inspecciones de las instituciones involucradas. Agradecemos a quienes impulsan esta propuesta por una educación secundaria de calidad, con compromiso y dedicación.",
                'Institucional',
                'img/chacra.jpeg',
                '2026-08-28',
            ],
            [
                'Proyecto municipal',
                'Estudiantes de 6.º y 7.º año participan en un proyecto municipal junto a la Técnica 5.',
                'Estudiantes de Programación de 6.º y 7.º año de nuestra escuela participan en un proyecto municipal junto a estudiantes de la Técnica 5. La propuesta consiste en actualizar y mejorar los bustos ubicados en la Plaza de los Bomberos, sobre Diagonal Lisandro de la Torre y Avenida 14.',
                'Institucional',
                'img/Peron.jpeg',
                '2026-08-05',
            ],
            [
                'Feria de Ciencias',
                'Alumnos de 3.º 2.ª y 6.º 4.ª presentaron proyectos como «Energía bajo nuestros pies» y «Life Bot».',
                "Los alumnos de 3.º 2.ª y 6.º 4.ª participaron de la Feria de Ciencias y presentaron diferentes proyectos desarrollados durante el ciclo lectivo, entre ellos «Energía bajo nuestros pies» y «Life Bot».\n\nLa feria permitió compartir los trabajos realizados y acercar a toda la comunidad educativa los proyectos tecnológicos de la escuela. Los estudiantes trabajaron en distintas etapas de investigación, desarrollo y presentación. Felicitamos a todos los alumnos y docentes que participaron de esta iniciativa.",
                'Institucional',
                'img/robopelea.jfif',
                '2026-07-28',
            ],
        ];

        foreach ($initialNews as $item) {
            $seed->execute($item);
        }
    }

    return $db;
}

function blog_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function blog_get_news(?int $limit = null): array
{
    $sql = 'SELECT id, titulo, resumen, contenido, categoria, portada, fecha
            FROM noticias ORDER BY fecha DESC, id DESC';

    if ($limit !== null) {
        $statement = blog_db()->prepare($sql . ' LIMIT :limite');
        $statement->bindValue(':limite', $limit, PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetchAll();
    }

    return blog_db()->query($sql)->fetchAll();
}

function blog_image_mime(string $bytes): ?string
{
    if ($bytes === '' || strlen($bytes) > 8388608) {
        return null;
    }

    $image = @getimagesizefromstring($bytes);
    if ($image === false) {
        return null;
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->buffer($bytes);
    return in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true)
        ? $mime
        : null;
}

function blog_store_image_bytes(string $bytes): string
{
    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
    ];
    $mime = blog_image_mime($bytes);

    if ($mime === null) {
        throw new RuntimeException('El archivo no es una imagen JPG, PNG, GIF o WebP válida, o supera los 8 MB.');
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
    if (file_put_contents(BLOG_UPLOADS_DIR . '/' . $filename, $bytes, LOCK_EX) === false) {
        throw new RuntimeException('No se pudo guardar una imagen.');
    }

    return 'uploads/' . $filename;
}

function blog_store_uploaded_image(array $file): ?string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('No se pudo recibir una de las imágenes.');
    }

    if (($file['size'] ?? 0) > 8388608 || !is_uploaded_file($file['tmp_name'])) {
        throw new RuntimeException('Cada imagen debe pesar 8 MB o menos.');
    }

    $bytes = file_get_contents($file['tmp_name']);
    if ($bytes === false) {
        throw new RuntimeException('No se pudo leer una imagen.');
    }

    return blog_store_image_bytes($bytes);
}

function blog_store_image_file(string $path): string
{
    $bytes = file_get_contents($path);
    if ($bytes === false) {
        throw new RuntimeException('No se pudo leer una imagen extraída del documento.');
    }

    return blog_store_image_bytes($bytes);
}

function blog_run_command(array $arguments): array
{
    $command = implode(' ', array_map('escapeshellarg', $arguments));
    $process = proc_open($command, [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ], $pipes);

    if (!is_resource($process)) {
        throw new RuntimeException('No se pudo iniciar el conversor de documentos.');
    }

    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]);
    $error = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $status = proc_close($process);

    if ($status !== 0) {
        throw new RuntimeException('Falló la conversión del documento. ' . trim((string) $error));
    }

    return [(string) $output, (string) $error];
}

function blog_read_exact($file, int $length): string
{
    $value = '';
    while (strlen($value) < $length) {
        $part = fread($file, $length - strlen($value));
        if ($part === false || $part === '') {
            throw new RuntimeException('El DOCX está dañado o incompleto.');
        }
        $value .= $part;
    }
    return $value;
}

function blog_read_docx_entries(string $path): array
{
    $file = fopen($path, 'rb');
    if ($file === false) {
        throw new RuntimeException('No se pudo abrir el DOCX.');
    }

    try {
        $fileSize = filesize($path);
        $tailLength = min($fileSize, 65557);
        fseek($file, $fileSize - $tailLength);
        $tail = blog_read_exact($file, $tailLength);
        $endRecordOffset = strrpos($tail, "\x50\x4b\x05\x06");
        if ($endRecordOffset === false || strlen($tail) < $endRecordOffset + 22) {
            throw new RuntimeException('El DOCX no contiene una estructura ZIP válida.');
        }

        $endRecord = unpack('vdisk/vstart/ventries_disk/ventries/Vcentral_size/Vcentral_offset/vcomment_length', substr($tail, $endRecordOffset + 4, 18));
        if ($endRecord['disk'] !== 0 || $endRecord['start'] !== 0 || $endRecord['entries'] > 2000) {
            throw new RuntimeException('El DOCX utiliza una estructura ZIP no compatible.');
        }

        $entries = [];
        $expandedSize = 0;
        if (fseek($file, $endRecord['central_offset']) !== 0) {
            throw new RuntimeException('No se pudo leer el índice del DOCX.');
        }

        for ($index = 0; $index < $endRecord['entries']; $index++) {
            $header = blog_read_exact($file, 46);
            if (substr($header, 0, 4) !== "\x50\x4b\x01\x02") {
                throw new RuntimeException('El DOCX contiene un índice ZIP dañado.');
            }

            $metadata = unpack('vversion_made/vversion_needed/vflags/vmethod/vmodified_time/vmodified_date/Vcrc/Vcompressed_size/Vuncompressed_size/vname_length/vextra_length/vcomment_length/vdisk/vinternal_attributes/Vexternal_attributes/Vlocal_offset', substr($header, 4));
            $name = str_replace('\\', '/', blog_read_exact($file, $metadata['name_length']));
            fseek($file, $metadata['extra_length'] + $metadata['comment_length'], SEEK_CUR);
            $nextCentralEntry = ftell($file);
            $isDocument = $name === 'word/document.xml';
            $isMedia = str_starts_with($name, 'word/media/') && !str_ends_with($name, '/');
            if (!$isDocument && !$isMedia) {
                continue;
            }

            $maxEntrySize = $isDocument ? 12582912 : 8388608;
            if (($metadata['flags'] & 1) !== 0 || $metadata['uncompressed_size'] > $maxEntrySize
                || $metadata['compressed_size'] === 0xffffffff || $metadata['uncompressed_size'] === 0xffffffff) {
                throw new RuntimeException('El DOCX contiene un archivo comprimido no compatible o demasiado grande.');
            }

            $expandedSize += $metadata['uncompressed_size'];
            if ($expandedSize > 52428800 || fseek($file, $metadata['local_offset']) !== 0) {
                throw new RuntimeException('El contenido expandido del DOCX supera el límite permitido.');
            }

            $localHeader = blog_read_exact($file, 30);
            if (substr($localHeader, 0, 4) !== "\x50\x4b\x03\x04") {
                throw new RuntimeException('El DOCX contiene un archivo local dañado.');
            }
            $localMetadata = unpack('vversion/vflags/vmethod/vmodified_time/vmodified_date/Vcrc/Vcompressed_size/Vuncompressed_size/vname_length/vextra_length', substr($localHeader, 4));
            fseek($file, $localMetadata['name_length'] + $localMetadata['extra_length'], SEEK_CUR);
            $compressed = blog_read_exact($file, $metadata['compressed_size']);

            if ($metadata['method'] === 0) {
                $content = $compressed;
            } elseif ($metadata['method'] === 8) {
                $content = gzinflate($compressed, $metadata['uncompressed_size']);
            } else {
                throw new RuntimeException('El DOCX usa un tipo de compresión no compatible.');
            }

            if ($content === false || strlen($content) !== $metadata['uncompressed_size']) {
                throw new RuntimeException('No se pudo descomprimir el contenido del DOCX.');
            }
            $entries[$name] = $content;
            fseek($file, $nextCentralEntry);
        }
    } finally {
        fclose($file);
    }

    return $entries;
}

function blog_remove_directory(string $directory): void
{
    if (!is_dir($directory)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($iterator as $entry) {
        if ($entry->isDir()) {
            rmdir($entry->getPathname());
        } else {
            unlink($entry->getPathname());
        }
    }
    rmdir($directory);
}

function blog_convert_document(array $file): array
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Seleccioná un archivo PDF o DOCX para convertir.');
    }

    if (($file['size'] ?? 0) > BLOG_MAX_UPLOAD_SIZE || !is_uploaded_file($file['tmp_name'])) {
        throw new RuntimeException('El documento debe pesar 15 MB o menos.');
    }

    $extension = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
    if (!in_array($extension, ['pdf', 'docx'], true)) {
        throw new RuntimeException('El archivo debe ser PDF o DOCX.');
    }

    $documentBytes = file_get_contents($file['tmp_name']);
    if ($documentBytes === false) {
        throw new RuntimeException('No se pudo leer el documento.');
    }

    if ($extension === 'pdf' && !str_starts_with($documentBytes, '%PDF-')) {
        throw new RuntimeException('El archivo no parece ser un PDF válido.');
    }
    if ($extension === 'docx' && !str_starts_with($documentBytes, "PK")) {
        throw new RuntimeException('El archivo no parece ser un DOCX válido.');
    }

    $temporaryDirectory = BLOG_DATA_DIR . '/tmp-' . bin2hex(random_bytes(8));
    if (!mkdir($temporaryDirectory, 0700, true)) {
        throw new RuntimeException('No se pudo preparar la conversión.');
    }

    $temporaryDocument = $temporaryDirectory . '/documento.' . ($extension === 'docx' ? 'zip' : 'pdf');
    $images = [];
    try {
        if (file_put_contents($temporaryDocument, $documentBytes, LOCK_EX) === false) {
            throw new RuntimeException('No se pudo preparar el documento para convertir.');
        }

        if ($extension === 'pdf') {
            $textConverter = getenv('PDFTOTEXT_BIN') ?: 'pdftotext';
            $imageConverter = getenv('PDFIMAGES_BIN') ?: 'pdfimages';
            [$markdown] = blog_run_command([$textConverter, '-layout', $temporaryDocument, '-']);

            $prefix = $temporaryDirectory . '/imagen';
            blog_run_command([$imageConverter, '-all', $temporaryDocument, $prefix]);
            foreach (glob($prefix . '-*') ?: [] as $imagePath) {
                $images[] = blog_store_image_file($imagePath);
            }
        } else {
            $entries = blog_read_docx_entries($temporaryDocument);
            if (!isset($entries['word/document.xml'])) {
                throw new RuntimeException('El DOCX no contiene un documento de Word válido.');
            }

            $document = new DOMDocument();
            if (!$document->loadXML($entries['word/document.xml'], LIBXML_NONET | LIBXML_NOBLANKS)) {
                throw new RuntimeException('No se pudo leer el texto del DOCX.');
            }

            $xpath = new DOMXPath($document);
            $xpath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
            $paragraphs = [];
            foreach ($xpath->query('//w:body//w:p') as $paragraph) {
                $text = '';
                foreach ($xpath->query('.//w:t | .//w:tab | .//w:br', $paragraph) as $part) {
                    if ($part->localName === 'tab') {
                        $text .= "\t";
                    } elseif ($part->localName === 'br') {
                        $text .= "\n";
                    } else {
                        $text .= $part->textContent;
                    }
                }

                $text = trim($text);
                if ($text === '') {
                    continue;
                }

                $style = $xpath->query('./w:pPr/w:pStyle', $paragraph)->item(0);
                if ($style instanceof DOMElement && preg_match(
                    '/^Heading([1-6])$/',
                    $style->getAttributeNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'val'),
                    $match
                )) {
                    $text = str_repeat('#', (int) $match[1]) . ' ' . $text;
                }
                $paragraphs[] = $text;
            }
            $markdown = implode("\n\n", $paragraphs);

            foreach ($entries as $entryPath => $entryContent) {
                if (!str_starts_with($entryPath, 'word/media/') || blog_image_mime($entryContent) === null) {
                    continue;
                }
                $images[] = blog_store_image_bytes($entryContent);
            }
        }
    } finally {
        blog_remove_directory($temporaryDirectory);
    }

    return ['markdown' => trim($markdown), 'images' => $images];
}

function blog_markdown_inline(string $text): string
{
    $escaped = blog_escape($text);

    $escaped = preg_replace_callback('/!\[([^\]]*)\]\(([^)]+)\)/', static function (array $match): string {
        $path = html_entity_decode($match[2], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if (!preg_match('#^uploads/[a-f0-9]{32}\.(jpg|png|gif|webp)$#', $path)) {
            return blog_escape($match[1]);
        }
        return '<img src="' . blog_escape($path) . '" alt="' . blog_escape($match[1]) . '" loading="lazy">';
    }, $escaped);

    $escaped = preg_replace_callback('/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/i', static function (array $match): string {
        $url = html_entity_decode($match[2], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if (filter_var($url, FILTER_VALIDATE_URL) === false) {
            return blog_escape($match[1]);
        }
        return '<a href="' . blog_escape($url) . '" target="_blank" rel="noopener noreferrer">' . $match[1] . '</a>';
    }, $escaped);

    $escaped = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $escaped);
    $escaped = preg_replace('/(?<!\*)\*([^*]+)\*(?!\*)/s', '<em>$1</em>', $escaped);
    return preg_replace('/`([^`]+)`/', '<code>$1</code>', $escaped);
}

function blog_render_markdown(string $markdown): string
{
    $blocks = preg_split('/\n\s*\n/', str_replace(["\r\n", "\r"], "\n", trim($markdown))) ?: [];
    $html = [];

    foreach ($blocks as $block) {
        $lines = explode("\n", trim($block));
        if (preg_match('/^(#{1,6})\s+(.+)$/', $lines[0], $heading)) {
            $level = strlen($heading[1]);
            $html[] = '<h' . $level . '>' . blog_markdown_inline($heading[2]) . '</h' . $level . '>';
        } elseif (preg_match('/^\s*[-*]\s+/m', $block)) {
            $items = [];
            foreach ($lines as $line) {
                if (preg_match('/^\s*[-*]\s+(.+)$/', $line, $item)) {
                    $items[] = '<li>' . blog_markdown_inline($item[1]) . '</li>';
                } else {
                    $items[] = '<li>' . blog_markdown_inline($line) . '</li>';
                }
            }
            $html[] = '<ul>' . implode('', $items) . '</ul>';
        } else {
            $html[] = '<p>' . implode('<br>', array_map('blog_markdown_inline', $lines)) . '</p>';
        }
    }

    return implode("\n", $html);
}
