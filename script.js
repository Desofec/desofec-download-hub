const searchInput = document.getElementById("tool-search");
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".download-card");

let activeFilter = "all";

const applyFilter = () => {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const category = card.dataset.category;
    const text = card.textContent.toLowerCase();
    const categoryMatch = activeFilter === "all" || category === activeFilter;
    const searchMatch = !query || text.includes(query);

    card.classList.toggle("hidden", !(categoryMatch && searchMatch));
  });
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    applyFilter();
  });
});

searchInput.addEventListener("input", applyFilter);

const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = newsletterForm.querySelector("button");
  const input = newsletterForm.querySelector("input");

  button.textContent = "Subscribed";
  button.disabled = true;
  input.value = "";
});
