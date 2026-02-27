const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");

let allGames = [];

function getParams() {
  return new URLSearchParams(window.location.search);
}

function isGameSelected() {
  return !!getParams().get("game");
}

// Forces EmulatorJS’s injected canvas/iframe to actually fill the player area
function forceVideoToFill() {
  const game = document.getElementById("game");
  if (!game) return false;

  // EmulatorJS can render into a canvas or an iframe depending on version/config
  const canvas = game.querySelector("canvas");
  const iframe = game.querySelector("iframe");
  const video = game.querySelector("video");

  const target = canvas || iframe || video;
  if (!target) return false;

  // Ensure container has a real size
  game.style.width = "100%";
  game.style.height = "100%";

  // Force the renderer element to fill
  target.style.width = "100%";
  target.style.height = "100%";
  target.style.display = "block";

  // Trigger layout recalculation
  window.dispatchEvent(new Event("resize"));
  return true;
}

// Run the fill/resize fix repeatedly right after a game launch
function postLaunchFixes() {
  let tries = 0;
  const maxTries = 30; // ~6 seconds total

  const timer = setInterval(() => {
    tries += 1;

    // Keep forcing sizing and resize
    forceVideoToFill();

    // Stop after a bit
    if (tries >= maxTries) clearInterval(timer);
  }, 200);

  // A couple extra delayed resizes help on managed Chromebooks
  setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
  setTimeout(() => window.dispatchEvent(new Event("resize")), 1500);
  setTimeout(() => window.dispatchEvent(new Event("resize")), 3000);
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

    // Clean boot: reload the page with query params
    row.onclick = () => {
      const url =
        `?game=${encodeURIComponent(g.file)}&name=${encodeURIComponent(g.name)}`;
      window.location.href = url;
    };

    gamesEl.appendChild(row);
  });
}

async function init() {
  const res = await fetch("games.json", { cache: "no-store" });
  allGames = await res.json();
  render(allGames);

  // If a game is selected, hide overlay and run post-launch fixes
  if (isGameSelected()) {
    if (emptyEl) emptyEl.style.display = "none";
    postLaunchFixes();
  }
}

searchEl.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return render(allGames);

  render(
    allGames.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.file.toLowerCase().includes(q)
    )
  );
});

init();
