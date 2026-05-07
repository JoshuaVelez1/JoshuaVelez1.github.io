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

function loadFeaturedProducts() {
  document.getElementById("message").innerHTML =
    "<div class='alert alert-info'>Loading featured products...</div>";

  $.ajax({
    url: "https://real-time-amazon-data.p.rapidapi.com/search?query=electronics%20deals&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8df618ce1fmsh411a5214b177b82p157677jsnfa697b74d1e5",
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    },
    success: function (response) {
      var products = response.data.products;
      showFeaturedProducts(products);
      document.getElementById("message").innerHTML =
        "<div class='alert alert-success'>Featured products loaded.</div>";
    },
    error: function () {
      document.getElementById("message").innerHTML =
        "<div class='alert alert-danger'>Could not load featured products.</div>";
    }
  });
}

function showFeaturedProducts(products) {
  var html = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
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

  document.getElementById("featuredResults").innerHTML = html;
}