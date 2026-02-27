const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");

let allGames = [];

function bootFromQuery() {
  const params = new URLSearchParams(location.search);
  const file = params.get("game");
  const name = params.get("name");

  if (!file) return;

  emptyEl.style.display = "none";

  // These must exist BEFORE loader.js runs (it already loaded),
  // but EmulatorJS will read them when it initializes the player.
  // To guarantee that, we set them and then refresh once with a special flag.
  // Simpler: set them on first load via inline script (see note below).
  window.EJS_player = "#game";
  window.EJS_core = "gba";
  window.EJS_gameUrl = `roms/${file}`;
  window.EJS_gameName = name || file;
}

function render(list) {
  gamesEl.innerHTML = "";
  list.forEach((g) => {
    const row = document.createElement("div");
    row.className = "game";
    row.innerHTML = `
      <div>
        <div class="name">${g.name}</div>
        <div class="meta">${g.file}</div>
      </div>
      <div class="meta">Play</div>
    `;
    row.onclick = () => {
      // Force a clean page load for each game
      const url =
        `?game=${encodeURIComponent(g.file)}&name=${encodeURIComponent(g.name)}`;
      location.href = url;
    };
    gamesEl.appendChild(row);
  });
}

async function init() {
  const res = await fetch("games.json", { cache: "no-store" });
  allGames = await res.json();
  render(allGames);

  // If URL has a game selected, show emulator
  const params = new URLSearchParams(location.search);
  if (params.get("game")) {
    emptyEl.style.display = "none";
  }
}

searchEl.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return render(allGames);
  render(allGames.filter(g =>
    g.name.toLowerCase().includes(q) || g.file.toLowerCase().includes(q)
  ));
});

bootFromQuery();
init();
