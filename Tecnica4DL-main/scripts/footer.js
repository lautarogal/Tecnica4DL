fetch('footer.html')
    .then(function (respuesta) {
        return respuesta.text();
    })
    .then(function (html) {

        document.getElementById('footer-componente').innerHTML = html;
        document.dispatchEvent(new Event('footerCargado'));
    });