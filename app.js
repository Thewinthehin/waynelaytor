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

  const params = new URLSearchParams(window.location.search);
  if (params.get("game")) {
    emptyEl.style.display = "none";
  }
}

searchEl.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();

  if (!q) {
    render(allGames);
    return;
  }

  render(
    allGames.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.file.toLowerCase().includes(q)
    )
  );
});

init();
