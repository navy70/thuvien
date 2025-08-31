// ===== Dữ liệu mẫu =====
let books = JSON.parse(localStorage.getItem("books")) || [];
let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

// ===== Đăng nhập / Đăng ký =====
function showLogin() {
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("libraryPage").style.display = "none";
}
function showRegister() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
  document.getElementById("libraryPage").style.display = "none";
}
function showLibrary() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("libraryPage").style.display = "block";
  document.getElementById("welcomeUser").textContent = currentUser
    ? `Xin chào, ${currentUser}`
    : "";
  showPage("homePage");
}

function register() {
  let user = document.getElementById("regUser").value.trim();
  let pass = document.getElementById("regPass").value.trim();
  let email = document.getElementById("regEmail").value.trim();
  let phone = document.getElementById("regPhone").value.trim();
  if (!user || !pass || !email || !phone) return alert("Vui lòng nhập đầy đủ!");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.user === user))
    return alert("Tên đăng nhập đã tồn tại!");
  users.push({ user, pass, email, phone });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công! Vui lòng đăng nhập.");
  showLogin();
}

function login() {
  let user = document.getElementById("loginUser").value.trim();
  let pass = document.getElementById("loginPass").value.trim();
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let found = users.find((u) => u.user === user && u.pass === pass);
  if (found) {
    currentUser = user;
    localStorage.setItem("currentUser", user);

    // 🔹 Thêm 3 cuốn sách mặc định nếu chưa có
    if (!localStorage.getItem("books") || books.length === 0) {
      books = [
        {
          title: "Dế Mèn Phiêu Lưu Ký",
          author: "Tô Hoài",
          year: "1941",
          category: "Văn học",
          number: 5,
          active: true,
          image: "",
        },
        {
          title: "Lão Hạc",
          author: "Nam Cao",
          year: "1943",
          category: "Văn học",
          number: 3,
          active: true,
          image: "",
        },
        {
          title: "Truyện Kiều",
          author: "Nguyễn Du",
          year: "1820",
          category: "Văn học",
          number: 2,
          active: true,
          image: "",
        },
      ];
      localStorage.setItem("books", JSON.stringify(books));
    }

    showLibrary();
    renderBooks();
    renderBorrowed();
  } else alert("Sai tài khoản hoặc mật khẩu!");
}
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    currentUser = null;
    localStorage.removeItem("currentUser");
    showLogin();
  }
}

// ===== Điều hướng =====
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  const target = document.getElementById(pageId);
  if (target) target.style.display = "block";
  if (pageId === "searchPage") renderBooks();
  if (pageId === "borrowReturnPage") renderBorrowed();
}

// ===== Quản lý sách =====
function renderBooks(filter = "") {
  const tbody = document.querySelector("#bookTable tbody");
  tbody.innerHTML = "";
  let filtered = books.filter((b) => {
    const q = filter.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.author && b.author.toLowerCase().includes(q))
    );
  });
  filtered.forEach((b, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${
        b.image ? `<img src="${b.image}" width="50" height="70">` : "—"
      }</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.year}</td>
      <td>${b.category}</td>
      <td>${b.number}</td>
      <td>${b.active ? "✔" : "❌"}</td>
      <td><button onclick="deleteBook(${i})">Xóa</button></td>
    `;
    tbody.appendChild(row);
  });
}
function searchBooks() {
  let keyword = document.getElementById("searchInput").value || "";
  renderBooks(keyword);
}
function toggleForm() {
  const formBox = document.getElementById("formBox");
  const btn = document.getElementById("toggleBtn");
  if (formBox.style.display === "block") {
    formBox.style.display = "none";
    btn.textContent = "➕ Thêm sách";
  } else {
    formBox.style.display = "block";
    btn.textContent = "✖ Đóng";
  }
}
function saveBook() {
  let title = document.getElementById("bookTitle").value.trim();
  let author = document.getElementById("bookAuthor").value.trim();
  let year =
    document.getElementById("bookYear").value.trim() ||
    new Date().getFullYear();
  let number = parseInt(document.getElementById("bookNumber").value) || 1;
  let active = document.getElementById("bookActive").checked;
  let category = document.getElementById("bookCategory").value;
  let imageFile = document.getElementById("bookImage").files[0];
  if (!title || !author) return alert("Vui lòng nhập tên sách và tác giả!");
  let reader = new FileReader();
  reader.onload = function (e) {
    books.push({
      title,
      author,
      year,
      category,
      number,
      active,
      image: e.target.result || "",
    });
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    resetForm();
    document.getElementById("formBox").style.display = "none";
    document.getElementById("toggleBtn").textContent = "➕ Thêm sách";
  };
  if (imageFile) reader.readAsDataURL(imageFile);
  else reader.onload({ target: { result: "" } });
}
function resetForm() {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookYear").value = "";
  document.getElementById("bookNumber").value = 1;
  document.getElementById("bookActive").checked = true;
  document.getElementById("bookImage").value = "";
  document.getElementById("bookCategory").selectedIndex = 0;
}
function deleteBook(i) {
  if (!confirm("Xác nhận xóa sách này?")) return;
  books.splice(i, 1);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

// ===== Import / Export =====
function exportData() {
  const blob = new Blob([JSON.stringify(books, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "books.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Dữ liệu không phải mảng");
      books = imported;
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
      alert("Import thành công!");
    } catch (err) {
      alert("File không hợp lệ!");
    }
  };
  reader.readAsText(file);
}

// ===== Mượn / Trả sách =====
function borrowBook() {
  const name = document.getElementById("borrowName").value.trim();
  const phone = document.getElementById("borrowPhone").value.trim();
  const email = document.getElementById("borrowEmail").value.trim();
  const date = document.getElementById("borrowDate").value;
  const title = document.getElementById("borrowTitle").value.trim();
  if (!name || !phone || !email || !date || !title)
    return alert("Vui lòng nhập đầy đủ!");
  let found = books.find((b) => b.title.toLowerCase() === title.toLowerCase());
  if (!found) return alert("Không tìm thấy sách!");
  if (found.number <= 0) return alert("Sách đã hết!");
  found.number -= 1;
  borrowedBooks.push({
    user: currentUser,
    name,
    phone,
    email,
    date,
    title: found.title,
  });
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  renderBorrowed();
  renderBooks();
  document.getElementById("borrowForm").reset();
  alert("Mượn thành công!");
}
function renderBorrowed() {
  const tbody = document.querySelector("#borrowTable tbody");
  tbody.innerHTML = "";
  borrowedBooks
    .filter((b) => b.user === currentUser)
    .forEach((b, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.email}</td>
      <td>${b.date}</td>
      <td>${b.title}</td>
      <td><button onclick="returnBook(${index})">Trả</button></td>
    `;
      tbody.appendChild(tr);
    });
}
function returnBook(index) {
  const record = borrowedBooks[index];
  if (!record) return;
  const bookInLib = books.find(
    (b) => b.title.toLowerCase() === record.title.toLowerCase()
  );
  if (bookInLib) bookInLib.number = (parseInt(bookInLib.number) || 0) + 1;
  borrowedBooks.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  renderBooks();
  renderBorrowed();
  alert("Trả sách thành công!");
}

// ===== Khởi động =====
(function init() {
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  if (currentUser) {
    showLibrary();
    renderBooks();
    renderBorrowed();
  } else showLogin();
})();
