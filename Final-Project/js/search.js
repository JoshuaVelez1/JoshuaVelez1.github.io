var allProducts = [];

function getProductAsin(product) {
  return product.asin || product.product_asin || product.asin_number || "";
}

function goToDetails(asin) {
  if (!asin || asin === "undefined") {
    alert("This product does not have an ASIN, so details cannot load.");
    return false;
  }

  localStorage.setItem("selectedAsin", asin);
  window.location.href = "details.html";
  return false;
}

function searchProducts() {
  var query = document.getElementById("searchInput").value.trim();

  if (query === "") {
    document.getElementById("message").innerHTML =
      "<div class='alert alert-warning'>Please enter a product name.</div>";
    return;
  }

  document.getElementById("message").innerHTML =
    "<div class='alert alert-info'>Loading products...</div>";

  $.ajax({
    url: "https://real-time-amazon-data.p.rapidapi.com/search?query=" + encodeURIComponent(query) + "&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8df618ce1fmsh411a5214b177b82p157677jsnfa697b74d1e5",
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    },
    success: function (response) {
      allProducts = response.data.products;

      document.getElementById("message").innerHTML =
        "<div class='alert alert-success'>Products loaded.</div>";

      displayProducts(allProducts);
    },
    error: function () {
      document.getElementById("message").innerHTML =
        "<div class='alert alert-danger'>There was a problem loading products.</div>";
    }
  });
}

function displayProducts(products) {
  var minRating = parseFloat(document.getElementById("ratingFilter").value);
  var sortChoice = document.getElementById("sortFilter").value;

  var filteredProducts = [];

  for (var i = 0; i < products.length; i++) {
    var rating = parseFloat(products[i].product_star_rating) || 0;

    if (rating >= minRating) {
      filteredProducts.push(products[i]);
    }
  }

  if (sortChoice === "ratingHigh") {
    filteredProducts.sort(function (a, b) {
      return (parseFloat(b.product_star_rating) || 0) - (parseFloat(a.product_star_rating) || 0);
    });
  }

  if (sortChoice === "reviewsHigh") {
    filteredProducts.sort(function (a, b) {
      return (parseInt(b.product_num_ratings) || 0) - (parseInt(a.product_num_ratings) || 0);
    });
  }

  var html = "";

  for (var j = 0; j < filteredProducts.length; j++) {
    var p = filteredProducts[j];
    var asin = getProductAsin(p);

    html += `
      <div class="col-sm-6 col-md-4">
        <div class="thumbnail product-card">
          <img src="${p.product_photo}" alt="Product image">

          <div class="caption">
            <h4 class="product-title">${p.product_title}</h4>
            <p class="price-text">${p.product_price || "Price not available"}</p>
            <p class="rating-text">⭐ ${p.product_star_rating || "No rating"} (${p.product_num_ratings || "0"} reviews)</p>
            <p><strong>ASIN:</strong> ${asin || "Not listed"}</p>

            <a href="details.html"
               onclick="return goToDetails('${asin}')"
               class="btn btn-primary btn-block">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("results").innerHTML = html;
}