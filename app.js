const gamesEl = document.getElementById("games");
const searchEl = document.getElementById("search");
const emptyEl = document.getElementById("empty");

let allGames = [];

const ORDER = ["Randomizers", "Nuzlocks", "Other"];

function groupByCategory(list) {
  const groups = { Randomizers: [], Nuzlocks: [], Other: [] };

  for (const g of list) {
    const cat = (g.category || "Other").trim();
    if (groups[cat]) groups[cat].push(g);
    else groups.Other.push(g);
  }

  // sort each category alphabetically
  for (const k of Object.keys(groups)) {
    groups[k].sort((a, b) => a.name.localeCompare(b.name));
  }

  return groups;
}

function gameRow(g) {
  const row = document.createElement("div");
  row.className = "game";
  row.innerHTML = `
    <div class="gname">${g.name}</div>
    <div class="gmeta">${g.file}</div>
  `;
  row.onclick = () => {
    const url = `?game=${encodeURIComponent(g.file)}&name=${encodeURIComponent(g.name)}`;
    window.location.href = url;
  };
  return row;
}

function render(list) {
  gamesEl.innerHTML = "";

  const groups = groupByCategory(list);

  ORDER.forEach((cat, i) => {
    const details = document.createElement("details");
    details.className = "drop";
    // open the first dropdown by default
    details.open = i === 0;

    const summary = document.createElement("summary");
    summary.className = "drop-title";
    summary.textContent = cat;

    const body = document.createElement("div");
    body.className = "drop-body";

    if (groups[cat].length === 0) {
      const empty = document.createElement("div");
      empty.className = "drop-empty";
      empty.textContent = "No games yet";
      body.appendChild(empty);
    } else {
      groups[cat].forEach(g => body.appendChild(gameRow(g)));
    }

    details.appendChild(summary);
    details.appendChild(body);
    gamesEl.appendChild(details);
  });
}

async function init() {
  const res = await fetch("games.json", { cache: "no-store" });
  allGames = await res.json();
  render(allGames);

  const params = new URLSearchParams(window.location.search);
  if (params.get("game")) emptyEl.style.display = "none";
}

searchEl.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) return render(allGames);

  render(
    allGames.filter(g =>
      (g.name || "").toLowerCase().includes(q) ||
      (g.file || "").toLowerCase().includes(q)
    )
  );
});

init();
