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

function limparLista() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function exibirCursos() {
    limparLista();

    for (var i = 0; i < cursos.length; i++) {
        var option = document.createElement("option");
        option.textContent = cursos[i].titulo;
        option.setAttribute("value", cursos[i].id);
        lista.appendChild(option);
    }
}

// Setup DB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

// window.indexedDB.deleteDatabase("fiap_cursos");
var request = window.indexedDB.open("fiap_cursos", 1);
var db;

request.onsuccess = function (event) {
    db = request.result;
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("course", { keyPath: "id" });

    /*for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }*/

    readAll();
}

function saveCourse() {
    // Get course from id=course select
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

    // Save into DB
    var request = db.transaction(["course"], "readwrite").objectStore("course").add(obj);
    
    request.onsuccess = function (event) {
        alert("Curso salvo com sucesso");
    };

    request.onerror = function (event) {
        alert("Erro ao salvar curso");
    }

    return false;
}

function readAll() {
    console.log("readAll");
    var objectStore = db.transaction("course").objectStore("course");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            console.log("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.title + ", Email: " + cursor.value.email);
            cursor.continue();
        }

        else {
            console.log("No more entries!");
        }
    };
}

exibirCursos();
