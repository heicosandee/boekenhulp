/* Boekenhulp — adviesapp voor leesboeken (groep 5 en 6)
   Alles draait lokaal in de browser: geen internet of account nodig. */
(function () {
  "use strict";

  const BOEKEN = window.BOEKEN || [];
  const IDLE_SECONDEN = 120; // na zoveel stilte terug naar het beginscherm (gedeelde tablet)

  /* ---------- keuzes ---------- */
  const NIVEAUS = [
    { v: 1, em: "🐢", t: "Rustig", u: "Ik lees nog liever niet te moeilijke boeken" },
    { v: 2, em: "🐇", t: "Goed", u: "Ik lees lekker vlot" },
    { v: 3, em: "🚀", t: "Supergoed", u: "Ik kan ook moeilijke en dikke boeken aan" },
  ];
  const DIKTES = [
    { v: 1, em: "📄", t: "Dun", u: "Snel uit" },
    { v: 2, em: "📘", t: "Gemiddeld", u: "Lekker lang" },
    { v: 3, em: "📚", t: "Dik", u: "Veel om in te duiken" },
    { v: 0, em: "🤷", t: "Maakt niet uit", u: "" },
  ];
  const PLAATJES = [
    { v: 3, em: "🖼️", t: "Veel plaatjes", u: "Of een stripboek" },
    { v: 1, em: "📖", t: "Vooral tekst", u: "Ik hou van lange verhalen" },
    { v: 0, em: "🤷", t: "Maakt niet uit", u: "" },
  ];
  const GENRES = [
    { k: "grappig", em: "😂", t: "Grappig" },
    { k: "spannend", em: "😱", t: "Spannend" },
    { k: "fantasie", em: "🧙", t: "Fantasie" },
    { k: "avontuur", em: "🗺️", t: "Avontuur" },
    { k: "gevoel", em: "💛", t: "Vriendschap & gevoel" },
    { k: "detective", em: "🔍", t: "Mysterie" },
    { k: "griezel", em: "👻", t: "Griezelig" },
    { k: "weetjes", em: "🤓", t: "Weetjes" },
  ];
  // Hobby -> themalabels in de boekendatabase, met gewicht (3 = hoofdthema, 1 = verwant)
  const HOBBYS = [
    { k: "dieren", em: "🐶", t: "Dieren", tags: { dieren: 3, honden: 2, katten: 2, natuur: 1 } },
    { k: "paarden", em: "🐴", t: "Paarden", tags: { paarden: 3, dieren: 1 } },
    { k: "voetbal", em: "⚽", t: "Voetbal", tags: { voetbal: 3, sport: 2 } },
    { k: "sport", em: "🏊", t: "Sport", tags: { sport: 3, voetbal: 1 } },
    { k: "dansen", em: "💃", t: "Dansen", tags: { dansen: 3, muziek: 1 } },
    { k: "muziek", em: "🎸", t: "Muziek", tags: { muziek: 3, dansen: 1 } },
    { k: "tekenen", em: "🎨", t: "Tekenen", tags: { tekenen: 3 } },
    { k: "techniek", em: "🤖", t: "Techniek & robots", tags: { techniek: 3, robots: 3, wetenschap: 1 } },
    { k: "ruimte", em: "🚀", t: "Ruimte", tags: { ruimte: 3, wetenschap: 1, reizen: 1 } },
    { k: "dino", em: "🦖", t: "Dino's", tags: { dinosaurussen: 3, monsters: 1, natuur: 1 } },
    { k: "natuur", em: "🌳", t: "Natuur", tags: { natuur: 3, dieren: 1, kamperen: 1 } },
    { k: "koken", em: "🍳", t: "Koken & bakken", tags: { koken: 3, eten: 3 } },
    { k: "gamen", em: "🎮", t: "Gamen", tags: { gamen: 3, techniek: 1 } },
    { k: "piraten", em: "🏴‍☠️", t: "Piraten & zee", tags: { piraten: 3, zee: 2 } },
    { k: "ridders", em: "🏰", t: "Ridders & draken", tags: { ridders: 3, draken: 3, geschiedenis: 1 } },
    { k: "magie", em: "🪄", t: "Magie", tags: { magie: 3, heksen: 2, draken: 1 } },
    { k: "superhelden", em: "🦸", t: "Superhelden", tags: { superhelden: 3 } },
    { k: "reizen", em: "🌍", t: "Reizen", tags: { reizen: 3, zee: 1, geschiedenis: 1 } },
    { k: "spoken", em: "🦇", t: "Spoken & monsters", tags: { spoken: 3, monsters: 3 } },
    { k: "vrienden", em: "👫", t: "Vrienden & school", tags: { vriendschap: 3, school: 2, familie: 1 } },
  ];
  const HOBBY_PER_KEY = Object.fromEntries(HOBBYS.map((h) => [h.k, h]));

  /* Woordenlijst voor "iets anders": woord -> hobby (of eigen themalabels).
     Hier kun je gemakkelijk woorden bijvoegen. Zie README voor uitleg. */
  const SYNONIEMEN = {
    dieren: "dieren", dier: "dieren", hond: { honden: 3, dieren: 2 }, puppy: { honden: 3, dieren: 2 }, kat: { katten: 3, dieren: 2 },
    poes: { katten: 3, dieren: 2 }, konijn: "dieren", hamster: "dieren", cavia: "dieren", vogel: "dieren", vis: "dieren", aap: "dieren",
    olifant: "dieren", giraf: "dieren", leeuw: "dieren", haai: "dieren", dolfijn: "dieren", slang: "dieren", insecten: "dieren", boerderij: "dieren",
    paard: "paarden", paarden: "paarden", pony: "paarden", paardrijden: "paarden", manege: "paarden", ruiter: "paarden",
    voetbal: "voetbal", voetballen: "voetbal", ajax: "voetbal", psv: "voetbal", feyenoord: "voetbal", messi: "voetbal",
    zwemmen: "sport", hockey: "sport", tennis: "sport", turnen: "sport", judo: "sport", karate: "sport", atletiek: "sport", skaten: "sport",
    fietsen: "sport", basketbal: "sport", volleybal: "sport", schaatsen: "sport", sporten: "sport", rennen: "sport", klimmen: "sport", gymnastiek: "sport",
    dansen: "dansen", ballet: "dansen", hiphop: "dansen", streetdance: "dansen", breakdance: "dansen", dans: "dansen",
    muziek: "muziek", gitaar: "muziek", piano: "muziek", zingen: "muziek", drums: "muziek", slagwerk: "muziek", viool: "muziek",
    fluit: "muziek", trompet: "muziek", band: "muziek", zangeres: "muziek", rappen: "muziek", dj: "muziek",
    tekenen: "tekenen", schilderen: "tekenen", knutselen: "tekenen", kleuren: "tekenen", strips: "tekenen", stripboek: "tekenen", kunst: "tekenen", verven: "tekenen", boetseren: "tekenen",
    robot: "techniek", robots: "techniek", techniek: "techniek", lego: "techniek", bouwen: "techniek", programmeren: "techniek", coderen: "techniek",
    uitvinden: "techniek", uitvinder: "techniek", elektronica: "techniek", wetenschap: "techniek", experimenten: "techniek", computer: "techniek", auto: "techniek", autos: "techniek", trein: "techniek", vliegtuig: "techniek", drone: "techniek",
    ruimte: "ruimte", planeten: "ruimte", sterren: "ruimte", astronaut: "ruimte", raket: "ruimte", maan: "ruimte", heelal: "ruimte", ufo: "ruimte", alien: "ruimte",
    dino: "dino", dinos: "dino", dinosaurus: "dino", dinosaurussen: "dino", fossielen: "dino", "t-rex": "dino",
    natuur: "natuur", bos: "natuur", kamperen: "natuur", tuin: "natuur", planten: "natuur", wandelen: "natuur", buiten: "natuur", boomhut: "natuur", vissen: "natuur", insect: "natuur",
    koken: "koken", bakken: "koken", eten: "koken", taart: "koken", snoep: "koken", chocolade: "koken", pannenkoeken: "koken",
    gamen: "gamen", minecraft: "gamen", roblox: "gamen", fortnite: "gamen", nintendo: "gamen", playstation: "gamen", pokemon: "gamen", pokémon: "gamen", mario: "gamen", zelda: "gamen", games: "gamen", game: "gamen", switch: "gamen", brawl: "gamen",
    piraten: "piraten", piraat: "piraten", zee: "piraten", schip: "piraten", boot: "piraten", varen: "piraten", schatten: "piraten", schat: "piraten", duiken: "piraten",
    ridders: "ridders", ridder: "ridders", draken: "ridders", draak: "ridders", kasteel: "ridders", prinses: "ridders", koning: "ridders", zwaard: "ridders", prins: "ridders",
    magie: "magie", toveren: "magie", tovenaar: "magie", heks: "magie", heksen: "magie", harry: "magie", goochelen: "magie", eenhoorn: "magie", fee: "magie", feeën: "magie",
    superhelden: "superhelden", superheld: "superhelden", batman: "superhelden", spiderman: "superhelden", marvel: "superhelden", avengers: "superhelden", superman: "superhelden",
    reizen: "reizen", vakantie: "reizen", landen: "reizen", wereld: "reizen", avontuur: "reizen", ontdekken: "reizen",
    spoken: "spoken", spook: "spoken", monsters: "spoken", monster: "spoken", griezelen: "spoken", vampier: "spoken", zombie: "spoken", weerwolf: "spoken",
    vrienden: "vrienden", vriendschap: "vrienden", school: "vrienden", familie: "vrienden", spelen: "vrienden", logeren: "vrienden",
  };
  const STOP = new Set(["en", "de", "het", "een", "ik", "hou", "houd", "van", "mijn", "ook", "en", "of", "met", "naar", "op"]);

  /* ---------- vragen (volgorde van het beeldscherm) ---------- */
  const THEMAS = ["geel", "roze", "blauw", "groen", "oranje", "paars"];
  const STAPPEN = [
    { id: "niveau", type: "enkel", vraag: "Hoe goed lees je?", sub: "Kies wat het beste bij jou past", opties: NIVEAUS, kleur: "roze", klass: "drie" },
    { id: "dikte", type: "enkel", vraag: "Hoe dik mag je boek zijn?", sub: "", opties: DIKTES, kleur: "blauw" },
    { id: "plaatjes", type: "enkel", vraag: "Wil je plaatjes in je boek?", sub: "", opties: PLAATJES, kleur: "groen", klass: "drie" },
    { id: "genres", type: "meer", max: 3, vraag: "Wat voor verhaal wil je?", sub: "Kies er maximaal 3", opties: GENRES.map((g) => ({ v: g.k, em: g.em, t: g.t })), kleur: "oranje" },
    { id: "hobbys", type: "hobby", max: 3, vraag: "Wat vind je leuk om te doen?", sub: "Kies er maximaal 3", kleur: "paars" },
  ];

  /* ---------- toestand ---------- */
  let stap = -1; // -1 welkom, 0..n-1 vragen, "zoeken", "resultaat"
  let antw, extraTags, resultaten, paginaNr;

  function reset() {
    antw = { niveau: 0, dikte: 0, plaatjes: 0, genres: [], hobbys: [] };
    extraTags = [];
    resultaten = [];
    paginaNr = 0;
  }
  reset();

  const app = document.getElementById("app");
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function toon(node, kleur) {
    document.body.dataset.theme = kleur || "geel";
    app.replaceChildren(node);
    window.scrollTo(0, 0);
  }

  /* ---------- schermen ---------- */
  function welkom() {
    stap = -1; reset();
    const n = el(`<section class="scherm welkom">
      <div class="mascotte">🦉</div>
      <h1>Welk boek<br>past bij jou?</h1>
      <p class="sub">Beantwoord een paar vragen, dan zoek ik de leukste boeken voor je uit!</p>
      <button class="groot-knop pulse" id="start">Zoek mijn boek! ➜</button>
    </section>`);
    n.querySelector("#start").onclick = () => vraag(0);
    toon(n, "geel");
  }

  function kop(i) {
    const dots = STAPPEN.map((_, j) => `<i class="${j < i ? "klaar" : j === i ? "nu" : ""}"></i>`).join("");
    return `<div class="top"><button class="knop-terug" id="terug" aria-label="Terug">⬅</button><div class="voortgang">${dots}</div><div class="ruimte"></div></div>`;
  }

  function vraag(i) {
    stap = i;
    const s = STAPPEN[i];
    if (s.type === "hobby") return hobbyVraag(i);
    const meer = s.type === "meer";
    const sel = meer ? antw[s.id] : null;
    const kn = s.opties.map((o) => `<button class="keuze" data-v="${esc(o.v)}"><span class="em">${o.em}</span><span class="t">${esc(o.t)}</span>${o.u ? `<span class="u">${esc(o.u)}</span>` : ""}</button>`).join("");
    const n = el(`<section class="scherm">
      ${kop(i)}
      <h2>${esc(s.vraag)}</h2><p class="sub">${esc(s.sub || "")}</p>
      <div class="keuzes ${s.klass || ""}">${kn}</div>
      ${meer ? `<div class="actie-rij"><button class="groot-knop klein" id="klaar" disabled>Klaar! ➜</button></div>` : ""}
    </section>`);
    n.querySelector("#terug").onclick = () => (i === 0 ? welkom() : vraag(i - 1));
    const knoppen = [...n.querySelectorAll(".keuze")];
    if (!meer) {
      knoppen.forEach((b) => (b.onclick = () => {
        antw[s.id] = Number(b.dataset.v);
        b.classList.add("aan");
        setTimeout(() => volgende(i), 260);
      }));
    } else {
      const klaar = n.querySelector("#klaar");
      const upd = () => {
        knoppen.forEach((b) => b.classList.toggle("aan", sel.includes(b.dataset.v)));
        klaar.disabled = sel.length === 0;
        klaar.classList.toggle("pulse", sel.length > 0);
      };
      knoppen.forEach((b) => (b.onclick = () => {
        const v = b.dataset.v, p = sel.indexOf(v);
        if (p >= 0) sel.splice(p, 1); else { if (sel.length >= s.max) sel.shift(); sel.push(v); }
        upd();
      }));
      klaar.onclick = () => volgende(i);
      upd();
    }
    toon(n, s.kleur);
  }

  function hobbyVraag(i) {
    const s = STAPPEN[i];
    const sel = antw.hobbys;
    const kn = HOBBYS.map((h) => `<button class="keuze" data-v="${h.k}"><span class="em">${h.em}</span><span class="t">${esc(h.t)}</span></button>`).join("");
    const n = el(`<section class="scherm">
      ${kop(i)}
      <h2>${esc(s.vraag)}</h2><p class="sub">${esc(s.sub)}</p>
      <div class="zelf" id="zelf" hidden>
        <input id="tekst" type="text" placeholder="Typ hier, bijvoorbeeld: paardrijden" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">
        <div class="fiches" id="fiches"></div><div class="hint" id="hint"></div>
      </div>
      <div class="keuzes hobbys">${kn}</div>
      <div class="actie-rij vast">
        <button class="tekst-keuze" id="anders">✏️ Iets anders…</button>
        <button class="groot-knop klein" id="klaar">Zoek mijn boek! ➜</button>
      </div>
    </section>`);
    n.querySelector("#terug").onclick = () => vraag(i - 1);
    const knoppen = [...n.querySelectorAll(".keuze")];
    const upd = () => knoppen.forEach((b) => b.classList.toggle("aan", sel.includes(b.dataset.v)));
    knoppen.forEach((b) => (b.onclick = () => {
      const v = b.dataset.v, p = sel.indexOf(v);
      if (p >= 0) sel.splice(p, 1); else { if (sel.length >= s.max) sel.shift(); sel.push(v); }
      upd();
    }));
    n.querySelector("#anders").onclick = () => { n.querySelector("#zelf").hidden = false; n.querySelector("#anders").hidden = true; n.querySelector("#tekst").focus(); };
    const tekst = n.querySelector("#tekst"), fiches = n.querySelector("#fiches"), hint = n.querySelector("#hint");
    tekst.oninput = () => {
      const r = begrijp(tekst.value);
      extraTags = r.tags;
      fiches.innerHTML = r.herkend.map((h) => `<span class="fiche">${h}</span>`).join("");
      hint.textContent = r.onbekend.length ? `Hmm, "${r.onbekend[0]}" ken ik nog niet 🙈 Kies er een uit de plaatjes!` : "";
      tekst._onbekend = r.onbekend;
    };
    n.querySelector("#klaar").onclick = () => { if (tekst._onbekend && tekst._onbekend.length) logOnbekend(tekst._onbekend); volgende(i); };
    upd();
    toon(n, s.kleur);
  }

  function volgende(i) {
    if (i + 1 < STAPPEN.length) vraag(i + 1); else zoeken();
  }

  /* Vrije tekst -> themalabels */
  function begrijp(invoer) {
    const tokens = norm(invoer).split(/[^a-z0-9\-é]+/).filter((t) => t.length > 1 && !STOP.has(t));
    const tags = [], herkend = [], onbekend = [];
    const sleutels = Object.keys(SYNONIEMEN);
    for (const t of tokens) {
      let hit = SYNONIEMEN[t] !== undefined ? t : null;
      if (!hit && t.length >= 4) hit = sleutels.find((k) => k.length >= 4 && (t.startsWith(k) || k.startsWith(t)));
      if (!hit) { onbekend.push(t); continue; }
      const w = SYNONIEMEN[hit];
      if (typeof w === "string") { tags.push(HOBBY_PER_KEY[w].tags); const h = HOBBY_PER_KEY[w]; herkend.push(`${h.em} ${h.t}`); }
      else { tags.push(w); herkend.push("✨ " + t); }
    }
    return { tags, herkend: [...new Set(herkend)], onbekend };
  }
  function logOnbekend(lijst) { // voor de leerkracht: woorden die de app niet kende
    try {
      const o = JSON.parse(localStorage.getItem("onbekendeHobbys") || "{}");
      lijst.forEach((w) => (o[w] = (o[w] || 0) + 1));
      localStorage.setItem("onbekendeHobbys", JSON.stringify(o));
    } catch (e) {}
  }

  /* ---------- advies ---------- */
  function score(b) {
    let s = 0;
    const redenen = { hobbys: [], genres: [], extra: [] };
    // leesniveau (te moeilijk telt zwaar)
    const dn = b.niveau - antw.niveau;
    s += dn > 0 ? -45 * dn : dn === 0 ? 12 : dn === -1 ? 5 : -3;
    // dikte
    if (antw.dikte) { const d = Math.abs(b.dikte - antw.dikte); s += d === 0 ? 8 : d === 1 ? 0 : -8; }
    // plaatjes
    if (antw.plaatjes === 3) s += b.plaatjes === 3 ? 9 : b.plaatjes === 2 ? 3 : -7;
    if (antw.plaatjes === 1) s += b.plaatjes === 1 ? 6 : b.plaatjes === 2 ? 2 : -6;
    // genres
    antw.genres.forEach((g) => { if (b.genres.includes(g)) { s += 14; redenen.genres.push(g); } });
    // hobby's
    const tel = (tags) => { let m = 0; for (const [t, w] of Object.entries(tags)) if (b.themas.includes(t)) m = Math.max(m, w); return m; };
    antw.hobbys.forEach((k) => { const m = tel(HOBBY_PER_KEY[k].tags); if (m) { s += 8 + m * 6; if (m >= 2) redenen.hobbys.push(k); } });
    extraTags.forEach((tags) => { const m = tel(tags); if (m) { s += 8 + m * 6; } });
    s += Math.random() * 4; // variatie bij herhaald spelen
    return { s, redenen };
  }

  function bereken() {
    const lijst = BOEKEN.map((b) => ({ b, ...score(b) })).sort((x, y) => y.s - x.s);
    // maximaal 1 boek per auteur per pagina van 3, zodat het gevarieerd blijft
    const pagina = [], rest = [];
    for (const r of lijst) {
      const al = pagina.length < 3 && !pagina.some((p) => p.b.auteur === r.b.auteur);
      (al ? pagina : rest).push(r);
    }
    resultaten = [...pagina, ...rest];
    // volgende pagina's: zelfde regel
    const alle = [...pagina]; let over = rest.slice();
    while (over.length) {
      const ronde = [];
      for (const r of over) if (ronde.length < 3 && !ronde.some((p) => p.b.auteur === r.b.auteur)) ronde.push(r);
      alle.push(...ronde); over = over.filter((r) => !ronde.includes(r));
    }
    resultaten = alle;
  }

  function zoeken() {
    stap = "zoeken";
    bereken();
    toon(el(`<section class="scherm zoeken"><div class="boek-spin">📖</div><h2>Even zoeken…</h2><p class="sub">Ik duik in de boekenkast!</p></section>`), "geel");
    setTimeout(resultaat, 1400);
  }

  const AVI = { 1: "AVI M5–E5", 2: "AVI M6–E6", 3: "AVI Plus" };
  const DIK = { 1: "dun boek", 2: "gemiddeld boek", 3: "dik boek" };
  function kaart(r, nr) {
    const b = r.b;
    const gen = r.redenen.genres.map((g) => GENRES.find((x) => x.k === g)).filter(Boolean).map((g) => `<span class="chip gen">${g.em} ${g.t.toLowerCase()}</span>`);
    const hob = r.redenen.hobbys.map((k) => HOBBY_PER_KEY[k]).map((h) => `<span class="chip hob">${h.em} ${h.t.toLowerCase()}</span>`);
    const kleur = ["#ff7ab8", "#5ab8ff", "#6be07a", "#ffa24a", "#a78bfa", "#ffd43b"][b.titel.length % 6];
    const omslag = b.omslag
      ? `<div class="omslag"><img src="${b.omslag}" alt="Omslag van ${esc(b.titel)}" loading="lazy" onerror="this.parentNode.classList.add('eigen');this.parentNode.style.background='${kleur}';this.parentNode.textContent='${esc(b.titel).replace(/'/g, "")}'"></div>`
      : `<div class="omslag eigen" style="background:${kleur}">${esc(b.titel)}</div>`;
    return `<article class="kaart"><div class="rang">${nr}</div>${omslag}
      <h3>${esc(b.titel)}</h3><div class="auteur">${esc(b.auteur)}</div>
      <p class="omschr">${esc(b.omschrijving)}</p>
      <div class="chips">${hob.join("")}${gen.join("")}<span class="chip niv">⭐ ${AVI[b.niveau]}</span><span class="chip dik">${DIK[b.dikte]}</span></div></article>`;
  }

  function resultaat() {
    stap = "resultaat";
    const start = paginaNr * 3;
    let deel = resultaten.slice(start, start + 3);
    if (!deel.length) { paginaNr = 0; deel = resultaten.slice(0, 3); }
    const n = el(`<section class="scherm">
      <div class="top"><button class="knop-terug" id="terug" aria-label="Terug">⬅</button><div class="voortgang"></div><div class="ruimte"></div></div>
      <h2>Dit boek past bij jou! 🎉</h2><p class="sub">Zoek ze in de boekenkast. Veel leesplezier!</p>
      <div class="resultaat">${deel.map((r, i) => kaart(r, i + 1)).join("")}</div>
      <div class="resultaat-acties">
        <button class="groot-knop klein" id="meer">🔄 Nog meer boeken</button>
        <button class="groot-knop klein" id="opnieuw">🏠 Opnieuw beginnen</button>
      </div></section>`);
    n.querySelector("#terug").onclick = () => vraag(STAPPEN.length - 1);
    n.querySelector("#meer").onclick = () => { paginaNr = (paginaNr + 1) % Math.ceil(resultaten.length / 3); resultaat(); };
    n.querySelector("#opnieuw").onclick = welkom;
    toon(n, "geel");
    sterretjes();
  }

  function sterretjes() {
    const w = el(`<div class="sterretjes" aria-hidden="true"></div>`);
    for (let i = 0; i < 24; i++) {
      const s = document.createElement("span");
      s.textContent = ["⭐", "✨", "🎉", "📚", "🌈"][i % 5];
      s.style.left = Math.random() * 100 + "%"; s.style.animationDelay = Math.random() * 1.2 + "s"; s.style.fontSize = 24 + Math.random() * 30 + "px";
      w.appendChild(s);
    }
    document.body.appendChild(w);
    setTimeout(() => w.remove(), 5000);
  }

  /* ---------- tablet: na een tijdje stilte terug naar begin ---------- */
  let idle;
  function wakker() {
    clearTimeout(idle);
    idle = setTimeout(() => { if (stap !== -1) welkom(); }, IDLE_SECONDEN * 1000);
  }
  ["pointerdown", "keydown", "touchstart"].forEach((e) => document.addEventListener(e, wakker, { passive: true }));
  // lang indrukken/dubbeltikken zoomen voorkomen
  document.addEventListener("gesturestart", (e) => e.preventDefault());

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});

  welkom();
  wakker();
})();
