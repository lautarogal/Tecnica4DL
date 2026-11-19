# EESTN N°4

## Noticias

El inicio (`index.php`) muestra las tres noticias más recientes. La sección completa está en `noticias.php`; el equipo directivo puede publicar desde `/crear`. Las noticias, el texto Markdown y la portada se guardan en SQLite en `data/noticias.sqlite`. Las imágenes nuevas se guardan en `uploads/`.

### Puesta en marcha

- Servir el proyecto con Apache y PHP 8.0 o posterior; no abrir los archivos como `file://`.
- Habilitar `PDO_SQLITE`, `fileinfo`, `mbstring`, `dom` y `zlib` en PHP.
- Dar permiso de escritura a Apache en `data/` y `uploads/`. Mantener habilitado `AllowOverride` para que Apache aplique los `.htaccess` que protegen esos directorios.
- Definir una contraseña larga compartida por el equipo directivo como variable de entorno `BLOG_ADMIN_PASSWORD` para Apache. Por ejemplo, agregar `SetEnv BLOG_ADMIN_PASSWORD "reemplazar-por-una-frase-larga-y-unica"` a la configuración local de Apache y reiniciarlo. No guardar la contraseña en el código ni en el repositorio. Usar HTTPS en producción.
- Para convertir PDF, instalar Poppler y hacer que `pdftotext` y `pdfimages` estén disponibles en el `PATH` de Apache. Si los ejecutables están en otra ubicación, configurar `PDFTOTEXT_BIN` y `PDFIMAGES_BIN` con sus rutas. DOCX se convierte con PHP y no requiere una biblioteca externa.
- En `php.ini`, permitir al menos `upload_max_filesize=16M` y `post_max_size=25M`.

Al entrar en `/crear`, iniciar sesión con la contraseña compartida. En el formulario, usar «Convertir documento y preparar imágenes» para extraer el contenido y las imágenes de un PDF/DOCX o preparar imágenes cargadas; después revisar el Markdown, elegir la portada y publicar. El editor también permite redactar el contenido directamente en Markdown.

La base de datos y las imágenes subidas no forman parte del código del sitio: incluir `data/noticias.sqlite` y `uploads/` en las copias de seguridad de producción.
