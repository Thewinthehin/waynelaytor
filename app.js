const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");

let allGames = [];

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

    // Reload the page with query params so EmulatorJS starts clean every time
    row.onclick = () => {
      const url =
        `?game=${encodeURIComponent(g.file)}&name=${encodeURIComponent(g.name)}`;
      window.location.href = url;
    };

    gamesEl.appendChild(row);
  });
}

async function init() {
  // Load games list
  const res = await fetch("games.json", { cache: "no-store" });
  allGames = await res.json();
  render(allGames);

  // Hide "Select a game" message if a game is selected
  const params = new URLSearchParams(window.location.search);
  if (params.get("game")) {
    emptyEl.style.display = "none";
  }

  // Force resize events after load (fixes black screen with audio on some layouts)
  setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
  setTimeout(() => window.dispatchEvent(new Event("resize")), 1500);
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
