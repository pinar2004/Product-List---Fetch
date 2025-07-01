const productList = document.getElementById("productList");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const clearFiltersBtn = document.getElementById("clearFilters");

let products = [];
let filteredProducts = [];

function showLoading(show) {
  loading.style.display = show ? "block" : "none";
}
function showError(show) {
  errorMsg.classList.toggle("d-none", !show);
}
function clearProducts() {
  productList.innerHTML = "";
}

function renderProducts(list) {
  clearProducts();
  if (list.length === 0) {
    productList.innerHTML = "<p>Ürün bulunamadı.</p>";
    return;
  }

  list.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";

    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;
    img.className = "card-img-top";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = product.title;

    const desc = document.createElement("p");
    desc.className = "card-text";
    desc.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price mt-auto";
    price.textContent = `Fiyat: $${product.price}`;

    const stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = `Stok: ${product.stock}`;

    // Stok renk kodu
    if (product.stock <= 10) {
      stock.classList.add("low");
    } else if (product.stock <= 50) {
      stock.classList.add("medium");
    } else {
      stock.classList.add("high");
    }

    cardBody.appendChild(title);
    cardBody.appendChild(desc);
    cardBody.appendChild(price);
    cardBody.appendChild(stock);

    card.appendChild(img);
    card.appendChild(cardBody);

    col.appendChild(card);
    productList.appendChild(col);
  });
}

function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.sort();
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat[0].toUpperCase() + cat.slice(1);
    categorySelect.appendChild(option);
  });
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "";
  filteredProducts = [...products];
  renderProducts(filteredProducts);
});

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

showLoading(true);
fetch("https://dummyjson.com/products")
  .then((res) => {
    if (!res.ok) throw new Error("Fetch hatası");
    return res.json();
  })
  .then((data) => {
    products = data.products;
    filteredProducts = [...products];
    populateCategories(products);
    renderProducts(products);
  })
  .catch((err) => {
    console.error(err);
    showError(true);
  })
  .finally(() => {
    showLoading(false);
  });
