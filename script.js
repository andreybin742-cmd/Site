(() => {
  const cards = [...document.querySelectorAll(".game-card")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("searchInput");
  const empty = document.getElementById("emptyState");
  const themeToggle = document.getElementById("themeToggle");
  let activeFilter = "all";
  const favorites = new Set();

  function render() {
    const term = search.value.trim().toLocaleLowerCase("ru");
    let visible = 0;
    cards.forEach(card => {
      const matchesText = card.dataset.title.toLocaleLowerCase("ru").includes(term);
      const matchesFilter = activeFilter === "all" ||
        (activeFilter === "favorites" ? favorites.has(card.dataset.title) : card.dataset.category === activeFilter);
      card.hidden = !(matchesText && matchesFilter);
      if (!card.hidden) visible++;
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
      const card = button.closest(".game-card");
      const name = card.dataset.title;
      const isFavorite = favorites.has(name);
      if (isFavorite) favorites.delete(name);
      else favorites.add(name);
      button.setAttribute("aria-pressed", String(!isFavorite));
      button.textContent = isFavorite ? "♡" : "♥";
      render();
    });
  });

  search.addEventListener("input", render);
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    themeToggle.textContent = light ? "☾" : "☼";
    document.querySelector('meta[name="theme-color"]').content = light ? "#f3f4fa" : "#090b14";
  });
})();