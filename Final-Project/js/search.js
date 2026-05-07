function getProductAsin(product) {
  return product.asin || product.product_asin || "";
}

function goToDetails(asin) {
  localStorage.setItem("selectedAsin", asin);
  window.location.href = "details.html";
}

function searchProducts() {

  var query = document.getElementById("searchInput").value;

  $.ajax({
    url: "https://real-time-amazon-data.p.rapidapi.com/search?query=" + query + "&country=US",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "YOUR_API_KEY_HERE",
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    },

    success: function (response) {

      var html = "";

      for (var i = 0; i < response.data.products.length; i++) {

        var p = response.data.products[i];
        var asin = getProductAsin(p);

        html += `
        <div>
          <p>${p.product_title}</p>

          <button onclick="goToDetails('${asin}')">
            View Details
          </button>
        </div>
        `;
      }

      document.getElementById("results").innerHTML = html;
    }
  });
}