const searchInput = document.getElementById("tool-search");
const chips = document.querySelectorAll(".chip");
const cards = Array.from(document.querySelectorAll(".download-card"));
const grid = document.getElementById("tool-grid");

let activeFilter = "all";

if (grid && cards.length) {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state hidden";
  emptyState.textContent = "No tools match your current filters.";
  grid.appendChild(emptyState);

  const applyFilter = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();
      const cardText = card.textContent.toLowerCase();
      const categoryMatch = activeFilter === "all" || category === activeFilter;
      const searchMatch = !query || cardText.includes(query);

      const isVisible = categoryMatch && searchMatch;
      card.classList.toggle("hidden", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    emptyState.classList.toggle("hidden", visibleCount !== 0);
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter || "all";
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }

  applyFilter();
}

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const button = newsletterForm.querySelector("button");
    const input = newsletterForm.querySelector("input");

    if (button) {
      button.textContent = "Subscribed";
      button.disabled = true;
    }

    if (input) {
      input.value = "";
    }
  });
}
