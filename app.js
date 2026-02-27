<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GBA Emulator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <style>
    /* Small debug overlay */
    #dbg {
      position: fixed;
      left: 10px;
      bottom: 10px;
      z-index: 99999;
      background: rgba(0,0,0,0.75);
      color: #fff;
      padding: 10px 12px;
      border-radius: 10px;
      font: 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      max-width: 340px;
      white-space: pre-wrap;
      pointer-events: none;
    }
  </style>
</head>

<body>

<header class="topbar">
  <div class="brand">GBA Library</div>
  <input id="search" class="search" placeholder="Search games...">
</header>

<main class="layout">

  <aside class="sidebar">
    <div class="sidebar-title">Games</div>
    <div id="games" class="games"></div>
    <div class="hint">Emulator Menu → Save / Load State</div>
  </aside>

  <section class="player-wrap">
    <div id="game" class="player"></div>
    <div id="empty" class="empty">Select a game to play</div>
  </section>

</main>

<div id="dbg">Debug…</div>

<!-- ========================= -->
<!-- EmulatorJS Configuration -->
<!-- ========================= -->
<script>
  const params = new URLSearchParams(window.location.search);
  const file = params.get("game");
  const name = params.get("name");

  // Optional: more logging inside EmulatorJS
  window.EJS_DEBUG_XX = true;

  if (file) {
    window.EJS_player = "#game";
    window.EJS_core = "gba";
    window.EJS_gameUrl = "roms/" + file;
    window.EJS_gameName = name || file;

    // (Optional) starts after user interaction; helps reduce confusion
    window.EJS_startOnLoaded = true;
  }

  window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
</script>

<!-- ========================= -->
<!-- EmulatorJS Loader -->
<!-- ========================= -->
<script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>

<!-- ========================= -->
<!-- Your App Logic -->
<!-- ========================= -->
<script src="app.js"></script>

<!-- ========================= -->
<!-- Diagnostics -->
<!-- ========================= -->
<script>
  const dbg = document.getElementById("dbg");

  function webglStatus() {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  function findRenderEl() {
    const game = document.getElementById("game");
    if (!game) return null;
    return game.querySelector("canvas") || game.querySelector("iframe") || game.querySelector("video") || null;
  }

  function report() {
    const wgl = webglStatus();
    const el = findRenderEl();
    const game = document.getElementById("game");

    const lines = [];
    lines.push(`WebGL available: ${wgl ? "YES" : "NO"}`);
    lines.push(`Has render element: ${el ? el.tagName.toLowerCase() : "NO"}`);

    if (game) lines.push(`Player size: ${game.clientWidth}x${game.clientHeight}`);

    if (el) {
      const r = el.getBoundingClientRect();
      lines.push(`Render size: ${Math.round(r.width)}x${Math.round(r.height)}`);
    }

    dbg.textContent = lines.join("\n");
  }

  // Keep updating for a few seconds after launch
  let t = 0;
  const timer = setInterval(() => {
    report();
    t += 1;
    if (t > 40) clearInterval(timer); // ~8 seconds
  }, 200);

  window.addEventListener("resize", report);
  report();
</script>

</body>
</html>
