/**
 * @description
 * Funcionalidades:
 *  Listagem de cursos disponíveis
 *  Registro de curso por estudante
 *  Listagem de cursos registrados localmente via IndexedDB
 */

var cursos = [{
    "id": "curso-1",
    "titulo": "Desenvolvimento de Soluções"
}, {
    "id": "curso-2",
    "titulo": "Arquitetura Java"
}, {
    "id": "curso-3",
    "titulo": "Arquitetura .NET"
}, {
    "id": "curso-4",
    "titulo": "Projetos Integrados"
}, {
    "id": "curso-5",
    "titulo": "Gestão de Processos"
}, {
    "id": "curso-6",
    "titulo": "Compiladores"
}];

var lista = document.getElementById("curso");

/**
 * @description
 * Limpa a lista de cursos do select.
 */

var limparLista = function () {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
};

/**
 * @description
 * Exibe os cursos no select
 */

var exibirCursos = function () {
    limparLista();

    for (var i = 0; i < cursos.length; i++) {
        var option = document.createElement("option");
        option.textContent = cursos[i].titulo;
        option.setAttribute("value", cursos[i].id);
        lista.appendChild(option);
    }
}();

/**
 * @description
 * Salva registro de curso de um usuário
 * localmente.
 */

var saveCourse = function () {

    $('#courseForm').submit(function (e) {
        e.preventDefault();

        var select = document.getElementById("curso"),
            name = document.getElementById("f_name").value,
            email = document.getElementById("f_email").value,
            courseId = select.options[select.selectedIndex].value,
            courseTitle = select.options[select.selectedIndex].text,
            obj = {
                "id": courseId,
                "title": courseTitle,
                "name": name,
                "email": email,
                "created_at": new Date()
            };

        console.log(obj);

    });
}();
