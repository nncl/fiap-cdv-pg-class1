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

var fSel = document.getElementById("curso"),
    fName = document.getElementById("f_name"),
    fEmail = document.getElementById("f_email");

var last = location.pathname.split("/");
last = last[last.length - 1];

/**
 * @description
 * Inicializa o IndexedDB.
 */

var db, transaction;

var init = function () {

    console.log('init');

    // Verifica a compatibilidade dos browsers
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if (!window.indexedDB) {
        console.error("Seu navegador não suporta o recurso IndexedDB");

    } else {

        // Abre o DB
        var request = window.indexedDB.open("CoursesDB", 2); // DB's name & its version

        request.onerror = function (event) {
            console.error("Erro ao abrir o banco de dados", JSON.stringify(event));
        };

        request.onupgradeneeded = function (event) {
            console.log('onupgradeneeded');

            db = event.target.result;
            var objectStore = db.createObjectStore("Students", {keyPath: "Id"});
        };

        request.onsuccess = function (event) {
            console.log("Banco de dados aberto com sucesso.");
            db = event.target.result;
        };

    }

}();

var lista = document.getElementById("curso");

/**
 * @description
 * Limpa a lista de cursos do select.
 */

var limparLista = function () {

    if (last == "" || last == "index.html") {
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
    }
};

/**
 * @description
 * Exibe os cursos no select
 */

var exibirCursos = function () {
    limparLista();

    if (last == "" || last == "index.html") {
        for (var i = 0; i < cursos.length; i++) {
            var option = document.createElement("option");
            option.textContent = cursos[i].titulo;
            option.setAttribute("value", cursos[i].id);
            lista.appendChild(option);
        }
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

        var select = fSel,
            name = fName.value,
            email = fEmail.value,
            courseId = select.options[select.selectedIndex].value,
            courseTitle = select.options[select.selectedIndex].text,
            obj = {
                "Id": email,
                "title": courseTitle,
                "name": name,
                "email": email,
                "created_at": new Date()
            };

        storeCourse(obj);

    });
}();

/**
 * @description
 * Salva um estudante no banco.
 *
 * @param {Object} student
 */

var storeCourse = function (student) {

    var transaction = getTransaction("Students");
    var objectStore = transaction.objectStore("Students");
    objectStore.add(student);

    transaction.oncomplete = function (event) {
        console.log("Transaction Success");
        displayMessage("Cadastrado com sucesso", false);
    };

    transaction.onerror = function (event) {
        console.error("Transaction Error", event);
        var msg = "Erro ao registrar estudante";

        if (event.srcElement.error) {
            msg = event.srcElement.error
        }

        displayMessage(msg, true);
    };

};

/**
 * @description
 * Retorna uma transação do IndexedDB
 *
 * @param {String} type
 */

var getTransaction = function (type) {
    var transaction = db.transaction([type], "readwrite");

    return transaction;
};

/**
 * @description
 *
 * Mostra uma msg de sucesso e limpa os campos do formulário
 * @param {String} msg
 *
 */

var displayMessage = function (msg, error) {
    alert(msg);

    if (!error) {
        fName.value = null;
        fEmail.value = null;
        fSel.options = [0];
    }
};

var displayStudents = function () {

    console.log('displayStudents');

    // Verifica se a página é a de lista de estudantes inscritos
    var last = location.pathname.split("/");
    last = last[last.length - 1];

    if (last == "subscribed.html") {
        // Carregar estudantes e popular em ul#subscribed-list

        var request = window.indexedDB.open("CoursesDB", 2);
        request.onsuccess = function (event) {
            db = event.target.result;
            var trans = db.transaction("Students", "readwrite");
            var store = trans.objectStore("Students");

            trans.oncomplete = function (evt) {
                console.log(evt);
            };

            var cursorRequest = store.openCursor();

            cursorRequest.onerror = function (error) {
                console.error('Error on cursor request', error);
            };

            cursorRequest.onsuccess = function (evt) {
                var cursor = evt.target.result;

                if (cursor) {
                    var student = cursor.value;

                    $('#subscribed-list')
                        .append('<li>' +
                            '<strong>Nome: ' + student.name + '</strong><br/>' +
                            '<span>Curso: ' + student.title + '</span>' +
                            '</li>');
                    cursor.continue();
                }
            };

        };
    }
}();