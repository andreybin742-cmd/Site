(() => {
  const cards = [...document.querySelectorAll(".game-card")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("searchInput");
  const empty = document.getElementById("emptyState");
  const themeToggle = document.getElementById("themeToggle");
  const modal = document.getElementById("gameModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  let activeFilter = "all";
  let favorites = new Set();
  try { favorites = new Set(JSON.parse(localStorage.getItem("pixelHubFavorites") || "[]")); } catch (_) {}

  function render() {
    const term = (search?.value || "").trim().toLocaleLowerCase("ru");
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
    if (empty) empty.hidden = visible !== 0;
  }
  function chooseFilter(filter) {
    activeFilter = filter;
    filters.forEach(item => item.classList.toggle("active", item.dataset.filter === filter));
    render();
  }
  filters.forEach(button => button.addEventListener("click", () => chooseFilter(button.dataset.filter)));
  document.querySelectorAll(".collection-card[data-collection-filter]").forEach(link => {
    link.addEventListener("click", () => chooseFilter(link.dataset.collectionFilter));
  });
  document.querySelectorAll(".favorite").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const name = button.closest(".game-card").dataset.title;
      if (favorites.has(name)) favorites.delete(name); else favorites.add(name);
      try { localStorage.setItem("pixelHubFavorites", JSON.stringify([...favorites])); } catch (_) {}
      render();
    });
  });
  search?.addEventListener("input", render);
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    themeToggle.textContent = light ? "☾" : "☼";
    document.querySelector('meta[name="theme-color"]').content = light ? "#f3f4fa" : "#080a12";
  });
  function openDetails(card) {
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  // Delegated handlers make every card action reliable, including after filtering.
  document.getElementById("gameGrid")?.addEventListener("click", event => {
    const details = event.target.closest(".details-btn");
    if (details) openDetails(details.closest(".game-card"));
  });
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  modal?.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal?.classList.contains("open")) closeModal(); });

  // Demo audience is deliberately simulated; both HUD and hidden fallback stay in sync.
  let viewers = 704;
  const viewerLabels = [document.getElementById("viewerCountOverlay"), document.getElementById("viewerCount")].filter(Boolean);
  function updateViewers() {
    viewers = Math.max(681, Math.min(739, viewers + Math.floor(Math.random() * 13) - 6));
    viewerLabels.forEach(label => label.textContent = viewers.toLocaleString("ru-RU"));
  }
  updateViewers();
  window.setInterval(updateViewers, 3600);
  render();
})();