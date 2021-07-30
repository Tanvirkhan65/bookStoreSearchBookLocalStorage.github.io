let form = document.querySelector("#bookForm");
form.addEventListener("submit", newBook);
let bookList = document.querySelector("#bookList");
bookList.addEventListener("click", removeBook);
let filter = document.querySelector("#filter");
filter.addEventListener("keyup", searchBook);

class BOOK {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  static addBook(book) {
    let table = document.querySelector("#bookList");
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <a class="delete" href="#">X</a>`;
    table.appendChild(tr);
  }
  static showAlert(message, className) {
    let div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    let container = document.querySelector(".container");
    let form = document.querySelector("#bookForm");
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static removeBook(target) {
    if (target.hasAttribute("href")) {
      if (confirm("Are you sure?")) {
        let del = target.parentElement;
        del.remove();
        let delLs = target.parentElement.children[2].textContent.trim()
        UI.removeBookFromLs(delLs)
      }
    }
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static findBook(bookName) {
    let bookList = document.querySelector("#bookList");
    bookList.querySelectorAll("tr").forEach((element) => {
      let ele1 = element.children[0].textContent;
      let ele2 = element.children[1].textContent;
      let ele3 = element.children[2].textContent;
      if (
        ele1.toLowerCase().indexOf(bookName) == -1 &&
        ele2.toLowerCase().indexOf(bookName) == -1 &&
        ele3.toLowerCase().indexOf(bookName)
      ) {
        element.style.display = "none";
      } else {
        element.style.display = "table-row";
      }
    });
  }

  static removeBookFromLs(isbn) {
    let ele = STORE.getBooks();
    ele.forEach((book,index)=>{
      if (book.isbn == isbn) {
        ele.splice(index,1)
      }
    })
    localStorage.setItem("bookList",JSON.stringify(ele));
  }
}

class STORE {
  static getBooks() {
    let bookList;
    if (localStorage.getItem("bookList") == null) {
      bookList = [];
    } else {
      bookList = JSON.parse(localStorage.getItem("bookList"));
    }
    return bookList;
  }

  static setBook(book) {
    let bookLists = STORE.getBooks();
    bookLists.push(book);
    localStorage.setItem("bookList", JSON.stringify(bookLists));
  }
  static displayBook() {
    let bookLists = STORE.getBooks();
    bookLists.forEach((books) => {
      UI.addBook(books);
    });
  }
}
document.addEventListener("DOMContentLoaded", STORE.displayBook());

function newBook(e) {
  e.preventDefault();
  let title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;
  if (title == "" || author == "" || isbn == "") {
    UI.showAlert("Please fill all field", "error");
  } else {
    let book = new BOOK(title, author, isbn);
    UI.addBook(book);
    UI.clearFields();
    UI.showAlert("Book added", "success");
    STORE.setBook(book);
  }
}

function removeBook(e) {
  UI.removeBook(e.target);
  UI.showAlert("Book Remove Successfully", "success");
}

function searchBook(e) {
  let bookName = e.target.value.toLowerCase();
  UI.findBook(bookName);
}
