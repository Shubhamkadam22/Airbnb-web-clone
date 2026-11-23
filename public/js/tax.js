const taxSwitch = document.getElementById("switchSizeSm");
  taxSwitch.addEventListener("change", () => {
    const gstInfo = document.getElementsByClassName("gst-info");
    for (let info of gstInfo) {
      info.style.display = taxSwitch.checked ? "inline" : "none";
    }
  });

  const searchForm = document.getElementById("listingSearchForm");
  const searchInput = document.getElementById("listingSearchInput");
  const listingCols = document.querySelectorAll(".listing-col");

  function filterListings() {
    const query = searchInput.value.trim().toLowerCase();
    listingCols.forEach((col) => {
      const title = col.dataset.title || "";
      const location = col.dataset.location || "";
      const matches = !query || title.includes(query) || location.includes(query);
      col.style.display = matches ? "" : "none";
    });
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterListings();
  });

  searchInput.addEventListener("input", filterListings);