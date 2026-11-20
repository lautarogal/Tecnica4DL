/* Pop-up de licitaciones: se muestra solo la primera vez que el visitante entra al sitio.
   Para volver a verlo al probar: localStorage.removeItem('tec4_popup_licitaciones_visto') en la consola. */
(function () {
    var CLAVE = 'tec4_popup_licitaciones_visto';

    function yaFueVisto() {
        try {
            return localStorage.getItem(CLAVE) === '1';
        } catch (e) {
            return false;
        }
    }

    function marcarComoVisto() {
        try {
            localStorage.setItem(CLAVE, '1');
        } catch (e) { /* sin storage: se mostrará de nuevo, no es crítico */ }
    }

    if (yaFueVisto()) return;

    var popup = document.createElement('div');
    popup.className = 'popup-inicio';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'popup-inicio-titulo');
    popup.innerHTML =
        '<div class="popup-inicio-overlay"></div>' +
        '<div class="popup-inicio-contenido">' +
            '<button type="button" class="popup-inicio-cerrar" aria-label="Cerrar">' +
                '<span class="material-icons">close</span>' +
            '</button>' +
            '<div class="popup-inicio-head">' +
                '<span class="popup-inicio-eyebrow">Asociación Cooperadora</span>' +
                '<h2 id="popup-inicio-titulo">Llamados a licitación</h2>' +
            '</div>' +
            '<div class="popup-inicio-body">' +
                '<figure><img src="img/popup/licitacion-kiosco.jpeg" alt="Llamado a licitación: Kiosco escolar"></figure>' +
                '<figure><img src="img/popup/licitacion-libreria.jpeg" alt="Llamado a licitación: Librería y fotocopias escolar"></figure>' +
            '</div>' +
        '</div>';

    var ultimoFoco = null;

    function cerrar() {
        popup.classList.remove('activo');
        document.body.classList.remove('popup-abierto');
        document.removeEventListener('keydown', alTeclear);
        marcarComoVisto();
        setTimeout(function () { popup.remove(); }, 350);
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    function alTeclear(e) {
        if (e.key === 'Escape') cerrar();
    }

    function abrir() {
        document.body.appendChild(popup);
        ultimoFoco = document.activeElement;
        popup.querySelector('.popup-inicio-overlay').addEventListener('click', cerrar);
        popup.querySelector('.popup-inicio-cerrar').addEventListener('click', cerrar);
        document.addEventListener('keydown', alTeclear);
        document.body.classList.add('popup-abierto');
        // Forzar reflow para que la transición de entrada se ejecute
        void popup.offsetWidth;
        popup.classList.add('activo');
        popup.querySelector('.popup-inicio-cerrar').focus();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', abrir);
    } else {
        abrir();
    }
})();
