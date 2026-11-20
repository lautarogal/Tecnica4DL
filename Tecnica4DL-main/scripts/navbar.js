fetch('navbar.html')
    .then(function(respuesta){
        return respuesta.text();
})
    .then (function(html){
        
document.getElementById('navbar-componente').innerHTML=html;
document.dispatchEvent(new Event('navbarCargado'));
});