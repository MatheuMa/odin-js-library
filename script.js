const bookShelf = document.querySelector(".book-shelf");

const myLibrary = [];

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Book constructor
function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Create and add a book to myLibrary
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

function removeBook(bookId) {
    const bookIndex = myLibrary.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        myLibrary.splice(bookIndex, 1);
    }
}

function displayBooks() {
    bookShelf.textContent = '';

    myLibrary.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add('book-card');

        Object.keys(book).forEach(attr => {
            if (attr === 'id') {
                bookCard.dataset.bookId = book[attr];
                return;
            };

            const info = document.createElement("p");
            let capitalizedAttr = capitalizeFirstLetter(attr);
            info.textContent = `${capitalizedAttr}: ${book[attr]}`;
            bookCard.appendChild(info);
        });
        
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-btn");
        removeButton.textContent = "remove"
        bookCard.appendChild(removeButton);
        
        bookShelf.appendChild(bookCard);
    });
}

const bookForm = document.querySelector('#book-form');

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(bookForm);
    
    const title = formData.get("title").trim();
    const author = formData.get("author").trim();
    const pages = formData.get("pages");
    const read = formData.get("read") === "yes";

    addBookToLibrary(title, author, pages, read);
    displayBooks();

    bookForm.reset();
})

bookShelf.addEventListener("click", (e) => {
    if (!e.target.matches(".remove-btn")) return;

    const bookCard = e.target.parentElement;
    const bookId = bookCard.dataset.bookId;

    removeBook(bookId);
    displayBooks();
})

// Sample books for quick testing
if (myLibrary.length === 0) {
    addBookToLibrary('The Hobbit', 'Tolkien', 310, true);
    addBookToLibrary('1984', 'Orwell', 268, false);
}
displayBooks();