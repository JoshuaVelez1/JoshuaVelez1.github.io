function formatPrice(price) {
  if (!price) {
    return "Not available";
  }

  if (price.toString().includes("$")) {
    return price;
  }

  return "$" + price;
}

function loadProductDetails() {
  var params = new URLSearchParams(window.location.search);
  var asin = params.get("asin") || localStorage.getItem("selectedAsin");

  if (!asin) {
    document.getElementById("message").innerHTML =
      "<div class='alert alert-danger'>No product selected.</div>";
    return;
  }

  document.getElementById("message").innerHTML =
    "<div class='alert alert-info'>Loading product details...</div>";

  $.ajax({
    url: "https://real-time-amazon-data.p.rapidapi.com/product-details?asin=" + asin + "&country=US",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8df618ce1fmsh411a5214b177b82p157677jsnfa697b74d1e5",
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    },
    success: function (response) {
      if (!response.data) {
        document.getElementById("message").innerHTML =
          "<div class='alert alert-danger'>Product not found.</div>";
        return;
      }

      var p = response.data;
      var availability = p.product_availability || "Not listed";

      var stockClass =
        availability.toLowerCase().includes("in stock")
          ? "stock-good"
          : "stock-bad";

      var description = p.product_description || "No description available.";

      if (description.length > 900) {
        description = description.substring(0, 900) + "...";
      }

      var rating = parseFloat(p.product_star_rating) || 0;
      var reviews = parseInt(p.product_num_ratings) || 0;
      var sellerNotes = [];

      if (rating >= 4.3) {
        sellerNotes.push("This product has strong customer ratings.");
      } else {
        sellerNotes.push("The rating is average, so more research may be needed.");
      }

      if (reviews >= 500) {
        sellerNotes.push("The product has a large number of reviews.");
      } else {
        sellerNotes.push("The product has fewer reviews compared to larger listings.");
      }

      if (availability.toLowerCase().includes("in stock")) {
        sellerNotes.push("The product appears to be in stock.");
      }

      var notesHtml = "";

      for (var i = 0; i < sellerNotes.length; i++) {
        notesHtml += "<li>" + sellerNotes[i] + "</li>";
      }

      document.getElementById("message").innerHTML = "";

      document.getElementById("productDetails").innerHTML = `
        <div class="col-md-5 text-center">
          <img src="${p.product_photo}" class="img-responsive" alt="Product image">
        </div>

        <div class="col-md-7">
          <h2>${p.product_title || "Product Title Not Available"}</h2>

          <p class="details-price">${formatPrice(p.product_price)}</p>

          <table class="table table-bordered">
            <tr>
              <th>Current Price</th>
              <td>${formatPrice(p.product_price)}</td>
            </tr>

            <tr>
              <th>Original Price</th>
              <td class="old-price">${formatPrice(p.product_original_price)}</td>
            </tr>

            <tr>
              <th>Rating</th>
              <td>⭐ ${p.product_star_rating || "No rating"}</td>
            </tr>

            <tr>
              <th>Reviews</th>
              <td>${p.product_num_ratings || "Not listed"}</td>
            </tr>

            <tr>
              <th>Availability</th>
              <td class="${stockClass}">${availability}</td>
            </tr>

            <tr>
              <th>Brand / Seller</th>
              <td>${p.product_byline || "Not listed"}</td>
            </tr>

            <tr>
              <th>ASIN</th>
              <td>${asin}</td>
            </tr>

            <tr>
              <th>Product Link</th>
              <td>
                <a href="${p.product_url}" target="_blank">Open Product Page</a>
              </td>
            </tr>
          </table>

          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">Seller Notes</h3>
            </div>

            <div class="panel-body">
              <ul>
                ${notesHtml}
              </ul>

              <p>
                This section gives a quick overview of the product based on ratings,
                reviews, and availability.
              </p>
            </div>
          </div>

          <div class="purchase-box">
            <h4>Purchase Information</h4>

            <p><strong>Price:</strong> ${formatPrice(p.product_price)}</p>
            <p><strong>Condition:</strong> New</p>
            <p><strong>Seller:</strong> ${p.product_byline || "Not listed"}</p>

            <a href="${p.product_url}" target="_blank" class="btn btn-success btn-block">
              View on Amazon
            </a>
          </div>

          <h3>Description</h3>
          <p>${description}</p>
        </div>
      `;
    },
    error: function () {
      document.getElementById("message").innerHTML =
        "<div class='alert alert-danger'>Could not load product details.</div>";
    }
  });
}