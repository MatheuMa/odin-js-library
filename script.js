const bookForm = document.querySelector("#book-form");
const bookShelf = document.querySelector(".book-shelf");

const myLibrary = [];

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

class Book {
  id = crypto.randomUUID();

  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

// Create and add a book to myLibrary
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

function removeBook(bookId) {
  const bookIndex = myLibrary.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    myLibrary.splice(bookIndex, 1);
  }
}

function displayBooks() {
  bookShelf.textContent = "";

  myLibrary.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    Object.keys(book).forEach((attr) => {
      if (attr === "id") {
        bookCard.dataset.bookId = book[attr];
        return;
      }

      if (attr === "read") {
        const readRow = document.createElement("div");
        readRow.classList.add("attr-item");
        readRow.classList.add("read-row");

        const readText = document.createElement("p");
        readText.textContent = book.read ? "Read" : "Not yet";

        const readButton = document.createElement("button");
        readButton.textContent = "Toggle";
        readButton.classList.add("read-btn");

        readRow.appendChild(readText);
        readRow.appendChild(readButton);
        bookCard.appendChild(readRow);
        return;
      }

      const attrItem = document.createElement("div");
      attrItem.classList.add("attr-item");

      const attrName = document.createElement("p");
      attrName.textContent = capitalizeFirstLetter(attr) + ":";
      const info = document.createElement("p");
      info.textContent = book[attr];

      attrItem.appendChild(attrName);
      attrItem.appendChild(info);
      bookCard.appendChild(attrItem);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "remove";
    bookCard.appendChild(removeButton);

    bookShelf.appendChild(bookCard);
  });
}

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(bookForm);

  const title = formData.get("title").trim();
  const author = formData.get("author").trim();
  const pages = Number(formData.get("pages"));
  const read = formData.get("read") === "yes";

  addBookToLibrary(title, author, pages, read);
  displayBooks();

  bookForm.reset();
});

["input", "focusout"].forEach((type) => {
  bookForm.addEventListener(type, (event) => {
    const currentInput = event.target.closest("input");

    if (!currentInput) return;

    if (currentInput.id === "title") {
      if (currentInput.validity.valueMissing) {
        showError("title-error", "Please enter the book title");
      }
    } else if (currentInput.id === "author") {
      if (currentInput.validity.valueMissing) {
        showError("author-error", "Please enter the author of the book");
      }
    } else if (currentInput.id === "pages") {
      if (currentInput.validity.valueMissing) {
        showError("pages-error", "Please enter the amount of pages");
      }
    }
  });
});

function showError(spanClass, message) {
  const error = document.querySelector(`.${spanClass}`);
  error.textContent = message;
  error.classList.add("active");
}

bookShelf.addEventListener("click", (e) => {
  if (e.target.matches(".remove-btn")) {
    const bookCard = e.target.closest(".book-card");
    const bookId = bookCard.dataset.bookId;
    removeBook(bookId);
    displayBooks();
  } else if (e.target.matches(".read-btn")) {
    const bookCard = e.target.closest(".book-card");
    const bookId = bookCard.dataset.bookId;
    const book = myLibrary.find((book) => book.id === bookId);
    if (!book) return;
    book.toggleRead();
    displayBooks();
  }
});

// Sample books for quick testing
if (myLibrary.length === 0) {
  addBookToLibrary("The Hobbit", "Tolkien", 310, true);
  addBookToLibrary("1984", "Orwell", 268, false);
}
displayBooks();
