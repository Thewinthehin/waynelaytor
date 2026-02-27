const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");
const playerEl = document.getElementById("game");

let allGames = [];
let loader = null;

// EmulatorJS CDN (stable is recommended)
const EJS_DATA = "https://cdn.emulatorjs.org/stable/data/";
const LOADER_URL = `${EJS_DATA}loader.js`;

function clearPlayer() {
  playerEl.innerHTML = "";
}

function removeLoader() {
  if (loader) loader.remove();
  loader = null;
}

function launchGBA(game) {
  clearPlayer();
  emptyEl.style.display = "none";

  // EmulatorJS config (must be set BEFORE loader.js runs)
  window.EJS_player = "#game";
  window.EJS_core = "gba";
  window.EJS_gameName = game.name;
  window.EJS_gameUrl = `roms/${encodeURIComponent(game.file)}`;
  window.EJS_pathtodata = EJS_DATA;

  removeLoader();
  loader = document.createElement("script");
  loader.src = LOADER_URL;
  document.body.appendChild(loader);
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
    row.onclick = () => launchGBA(g);
    gamesEl.appendChild(row);
  });
}

async function init() {
  const res = await fetch("games.json", { cache: "no-store" });
  allGames = await res.json();
  render(allGames);
}

searchEl.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return render(allGames);
  render(allGames.filter(g =>
    g.name.toLowerCase().includes(q) || g.file.toLowerCase().includes(q)
  ));
});

init();
