// Collect UI element
const bookForm = document.querySelector("#inputBook");

const bookInputTitle = document.getElementById("inputBookTitle");
const bookInputAuthor = document.getElementById("inputBookAuthor");
const bookInputYear = document.getElementById("inputBookYear");
const bookInputStatus = document.getElementById("inputBookIsComplete");

const completeList = document.getElementById("completeBookshelfList");
const incompleteList = document.getElementById("incompleteBookshelfList");
const toShelf = document.getElementById("toShelf");
const searchBooks = document.getElementById("searchBookTitle");

init();

function init() {
    //read dari localstorage
    document.addEventListener("DOMContentLoaded", getBooks);

    //eventlistener untuk add buku
    bookForm.addEventListener("submit", addBook);

    //eventlistener untuk checkbox status
    bookInputStatus.addEventListener("change", function () {
        if (this.checked) {
            toShelf.innerHTML = "Sudah selesai dibaca";
        } else {
            toShelf.innerHTML = "Belum selesai dibaca";
        }
    });

    //event listener untuk action 1 buku
    completeList.addEventListener("click", actionBooks);
    incompleteList.addEventListener("click", actionBooks);

    //filter buku
    searchBooks.addEventListener("keyup", filterBooks);
}

function addBook(e) {
    //prevent refresh page
    e.preventDefault();

    //validasi input
    if (
        bookInputTitle.value !== "" &&
        bookInputAuthor.value !== "" &&
        bookInputYear.value !== ""
    ) {
        //check apakah checkbox checked
        const status =
            document.querySelector("#inputBookIsComplete:checked") === null
                ? false
                : true;

        //add books
        addBooksLocalStorage(
            bookInputTitle.value,
            bookInputAuthor.value,
            bookInputYear.value,
            status
        );

        //create element
        createBooksElement(
            bookInputTitle.value,
            bookInputAuthor.value,
            bookInputYear.value,
            status
        );

        //mengosongkan input
        let elements = document.getElementsByTagName("input");
        for (var ii = 0; ii < elements.length; ii++) {
            if (elements[ii].type == "text" || "number") {
                elements[ii].value = "";
            }
        }
        //reset checkbox
        document.getElementById("inputBookIsComplete").checked = false;
        toShelf.innerHTML = "Belum selesai dibaca";
    } else {
        //notification apabila ada input yang masih kosong
        alert("Semua input harus diisi !!!");
    }
}

function getBooks() {
    //load book dari local storage
    const books = getItemFromLocalStorage();

    //mapping isi book & buat element nya
    books.forEach((element) => {
        createBooksElement(
            element.title,
            element.author,
            element.year,
            element.isComplete
        );
    });
}

// load book dari local storage
function getItemFromLocalStorage() {
    let books;
    if (localStorage.getItem("books") == null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
}

// memasukkan book ke local storage
function addBooksLocalStorage(title, author, year, status) {
    const books = getItemFromLocalStorage();

    books.push({
        id: new Date(),
        title: title,
        author: author,
        year: year,
        isComplete: status,
    });

    localStorage.setItem("books", JSON.stringify(books));
}

//membuat element buku
function createBooksElement(title, author, year, status) {
    //buat tag article
    const article = document.createElement("article");
    article.className = "book_item";

    //buat nama buku
    const titleBooks = document.createElement("h3");
    titleBooks.innerHTML = title;
    article.appendChild(titleBooks);

    //buat penulis buku
    const authorBooks = document.createElement("p");
    authorBooks.innerHTML = `Penulis: ${author}`;
    article.appendChild(authorBooks);

    //buat tahun buku
    const yearBooks = document.createElement("p");
    yearBooks.innerHTML = `Tahun: ${year}`;
    article.appendChild(yearBooks);

    //buat action buku (delete & ganti status)
    const action = document.createElement("div");
    action.className = "action";

    const changeStatus = document.createElement("button");
    changeStatus.className = "green change";
    changeStatus.innerHTML =
        status !== true ? "Selesai dibaca" : "Belum Selesai dibaca";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "red delete";
    deleteBtn.innerHTML = "Hapus buku";

    action.appendChild(changeStatus);
    action.appendChild(deleteBtn);

    article.appendChild(action);

    if (status === true) {
        completeList.appendChild(article);
    } else if (status === false) {
        incompleteList.appendChild(article);
    }
}

//handle action book
function actionBooks(e) {
    let parent = e.target.parentElement;
    let target = parent.parentElement;
    if (e.target.classList.contains("delete")) {
        if (confirm("apakah anda yakin ingin menghapus ?")) {
            target.remove();
            executeActionBooks(target, 0);
        }
    } else if (e.target.classList.contains("change")) {
        target.remove();
        executeActionBooks(target, 1);
    }
}

//ekesekusi action book
function executeActionBooks(element, action) {
    const books = getItemFromLocalStorage();

    if (action === 0) {
        books.forEach((book, index) => {
            if (element.firstChild.textContent === book.title) {
                books.splice(index, 1);
            }
        });
    } else if (action === 1) {
        books.forEach((book) => {
            if (element.firstChild.textContent === book.title) {
                book.isComplete = !book.isComplete;
                createBooksElement(
                    book.title,
                    book.author,
                    book.year,
                    book.isComplete
                );
            }
        });
    }

    localStorage.setItem("books", JSON.stringify(books));
}

//filter / cari book
function filterBooks(e) {
    const filterText = e.target.value.toLowerCase();

    const bookItems = document.querySelectorAll(".book_item");
    console.log(bookItems);

    bookItems.forEach((element) => {
        const itemText = element.firstChild.textContent.toLowerCase();

        if (itemText.indexOf(filterText) === -1) {
            element.setAttribute("style", "display : none !important;");
        }
    });
}
