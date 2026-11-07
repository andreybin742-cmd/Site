(() => {
  const cards = [...document.querySelectorAll(".game-card")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("searchInput");
  const empty = document.getElementById("emptyState");
  const themeToggle = document.getElementById("themeToggle");
  const viewerCount = document.getElementById("viewerCount");
  const modal = document.getElementById("gameModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  let activeFilter = "all";
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem("pixelHubFavorites") || "[]")); } catch (_) {}

  function render() {
    const term = search.value.trim().toLocaleLowerCase("ru");
    let visible = 0;
    cards.forEach(card => {
      const matchesText = (card.dataset.title + " " + card.dataset.description).toLocaleLowerCase("ru").includes(term);
      const matchesFilter = activeFilter === "all" ||
        (activeFilter === "favorites" ? favorites.has(card.dataset.title) : card.dataset.category === activeFilter);
      card.hidden = !(matchesText && matchesFilter);
      if (!card.hidden) visible++;
      const favorite = card.querySelector(".favorite");
      const selected = favorites.has(card.dataset.title);
      favorite.setAttribute("aria-pressed", String(selected));
      favorite.textContent = selected ? "♥" : "♡";
    });
    empty.hidden = visible !== 0;
  }

  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle("active", item === button));
    render();
  }));

  document.querySelectorAll(".favorite").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.closest(".game-card").dataset.title;
      if (favorites.has(name)) favorites.delete(name); else favorites.add(name);
      try { localStorage.setItem("pixelHubFavorites", JSON.stringify([...favorites])); } catch (_) {}
      render();
    });
  });
  search.addEventListener("input", render);

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    themeToggle.textContent = light ? "☾" : "☼";
    document.querySelector('meta[name="theme-color"]').content = light ? "#f3f4fa" : "#080a12";
  });

  document.querySelectorAll(".details-btn").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".game-card");
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }));
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  modal.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

  // Demo audience counter: a visual effect, not a live platform metric.
  if (viewerCount) {
    let viewers = 704;
    window.setInterval(() => {
      viewers += Math.floor(Math.random() * 13) - 6;
      viewers = Math.max(681, Math.min(739, viewers));
      viewerCount.textContent = viewers.toLocaleString("ru-RU");
    }, 3600);
  }
  render();
})();