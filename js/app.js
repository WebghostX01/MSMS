document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

// Grab all inputs
const productNameInput = document.getElementById("product-name-input");
const productQuantityInput = document.getElementById("product-quantity-input");
const productCategoryInput = document.getElementById("product-category-input");
const productPriceInput = document.getElementById("product-price-input");

// Grab table body
const tableBody = document.getElementById("table-body");

// Grab all your buttons
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const clearButton = document.getElementById("clear-button");
const deleteButton = document.getElementById("delete-button");

// Function to save the array of products to localStorage
function saveToLocalStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Function to load the products from localStorage and display them
function loadFromLocalStorage() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Clear the table body
  tableBody.innerHTML = "";

  // Add each product to the table
  products.forEach((product) => {
    addingProducts(
      product.id,
      product.name,
      product.quantity,
      product.category,
      product.price
    );
  });
}

// Function to generate a random ID
function generateRandomId() {
  return Math.floor(Math.random() * 9e12) + 1e12;
}

// Function to add the product to the table
function addingProducts(id, name, quantity, category, price) {
  // Create a table row and cells for each product attribute
  const tableRow = document.createElement("tr");
  tableRow.classList.add("table-row");

  const idCell = document.createElement("td");
  idCell.classList.add("productId-data");
  idCell.textContent = id;

  const nameCell = document.createElement("td");
  nameCell.classList.add("product-name-data");
  nameCell.textContent = name;

  const quantityCell = document.createElement("td");
  quantityCell.classList.add("product-quantity-data");
  quantityCell.textContent = quantity;

  const categoryCell = document.createElement("td");
  categoryCell.classList.add("product-category-data");
  categoryCell.textContent = category;

  const priceCell = document.createElement("td");
  priceCell.classList.add("product-price-data");
  priceCell.textContent = price;

  // Append cells to the row in the correct order
  tableRow.append(idCell, nameCell, quantityCell, categoryCell, priceCell);

  // Append the row to the table body
  tableBody.appendChild(tableRow);
}

// Attach event listener to the "Add" button
addButton.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form submission

  const name = productNameInput.value.trim();
  const quantity = parseFloat(productQuantityInput.value.trim());
  const category = productCategoryInput.value.trim();
  const price = parseFloat(productPriceInput.value.trim());

  if (name && !isNaN(quantity) && category && !isNaN(price)) {
    // Generate a random ID for the product
    const id = generateRandomId();

    // Add the product to the table
    addingProducts(id, name, quantity, category, price);

    // Save the product to localStorage
    const currentProducts = JSON.parse(localStorage.getItem("products")) || [];
    currentProducts.push({ id, name, quantity, category, price });
    saveToLocalStorage(currentProducts);

    // Clear the input fields after adding the product
    productNameInput.value = "";
    productQuantityInput.value = "";
    productCategoryInput.value = "";
    productPriceInput.value = "";

    alert("Product added successfully");
  } else {
    alert("Invalid product entered. Please fill in all fields correctly.");
  }
});

let isEditing = false; // To track whether we're in editing mode

editButton.addEventListener("click", function () {
  const rows = document.querySelectorAll("#table-body .table-row");

  if (!isEditing) {
    // Start editing
    isEditing = true;
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        if (!cell.classList.contains("productId-data")) {
          const originalValue = cell.textContent.trim();
          cell.innerHTML = `<input type="text" value="${originalValue}" class="editable-cell">`;
        }
      });
    });

    editButton.textContent = "Save"; // Change button text to "Save"
  } else {
    // Save changes
    let isEdited = false;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        if (!cell.classList.contains("productId-data")) {
          const input = cell.querySelector(".editable-cell");
          const originalValue = input.getAttribute("value").trim();
          const newValue = input.value.trim();

          if (newValue !== originalValue) {
            isEdited = true;
            cell.textContent = newValue; // Update the cell with the new value
          } else {
            cell.textContent = originalValue; // Revert to original value
          }
        }
      });
    });

    isEditing = false;
    editButton.textContent = "Edit"; // Change button text back to "Edit"

    if (isEdited) {
      alert("Changes have been saved.");
      // Implement your save logic here, such as updating local storage
    } else {
      alert("No changes detected.");
    }
  }
});

// Clear button functionality
clearButton.addEventListener("click", () => {
  // Clear the table body
  tableBody.innerHTML = "";

  // Clear local storage
  localStorage.removeItem("products");

  alert("All products have been deleted.");
});

// Add event listener to delete button
deleteButton.addEventListener("click", () => {
  const rows = document.querySelectorAll("#table-body .table-row");
  if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    lastRow.remove();

    // Update local storage
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.pop();
    saveProducts(products);

    alert("Last product has been deleted.");
  } else {
    alert("No products to delete.");
  }
});
