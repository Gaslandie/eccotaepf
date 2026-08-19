const fs = require("node:fs");
const path = require("node:path");

const CDP_HOST = "http://127.0.0.1:9223";
const SITE = "http://127.0.0.1:4173";
const ROOT = path.resolve(__dirname, "..");
const CAPTURE_DIR = path.join(ROOT, "docs", "design-ux", "captures", "lot-1");

function listHtmlPages() {
  return fs.readdirSync(ROOT)
    .filter((file) => file.endsWith(".html"))
    .concat(fs.readdirSync(path.join(ROOT, "realisations"))
      .filter((file) => file.endsWith(".html"))
      .map((file) => "realisations/" + file))
    .sort((a, b) => a.localeCompare(b, "fr"));
}

const pages = listHtmlPages();

const capturePages = [
  ["accueil", "index.html"],
  ["a-propos", "a-propos.html"],
  ["services", "services.html"],
  ["realisations", "realisations/index.html"],
  ["realisation-detail", "realisations/construction-ecole-primaire-gberedou-baranama.html"],
  ["partenaires", "partenaires.html"],
  ["contact", "contact.html"],
  ["mentions-legales", "mentions-legales.html"],
  ["confidentialite", "confidentialite.html"],
  ["page-404", "404.html"]
];

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  close() {
    this.socket.close();
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function evaluate(client, expression, awaitPromise = false) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
    userGesture: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Erreur JavaScript dans la page");
  }
  return result.result.value;
}

async function navigate(client, page, width, javascript = true, reducedMotion = false, scrollPage = true) {
  await client.send("Emulation.setScriptExecutionDisabled", { value: !javascript });
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" }]
  });
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: width <= 480 ? 760 : 900,
    deviceScaleFactor: 1,
    mobile: width <= 480
  });
  await client.send("Page.navigate", { url: SITE + "/" + page });
  await delay(350);
  if (!javascript) {
    await delay(500);
    return;
  }
  await evaluate(client, `new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  })`, true);
  if (scrollPage) {
    await evaluate(client, `new Promise((resolve) => {
      document.querySelectorAll("img[loading='lazy']").forEach((img) => { img.loading = "eager"; });
      const step = Math.max(500, innerHeight * .8);
      let position = 0;
      function advance() {
        position += step;
        window.scrollTo(0, position);
        if (position < document.documentElement.scrollHeight) requestAnimationFrame(advance);
        else {
          window.scrollTo(0, 0);
          resolve();
        }
      }
      advance();
    })`, true);
  }
  await evaluate(client, `Promise.race([
    Promise.all(Array.from(document.images).map((img) => {
      if (img.complete) return true;
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    })),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ])`, true);
  await delay(scrollPage ? 850 : 120);
}

async function createClient() {
  const response = await fetch(CDP_HOST + "/json/new?about:blank", { method: "PUT" });
  if (!response.ok) throw new Error("Impossible de créer l'onglet Chrome");
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return { client, targetId: target.id };
}

async function closeClient(client, targetId) {
  client.close();
  await fetch(CDP_HOST + "/json/close/" + targetId);
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

async function testPages(client, failures) {
  for (const width of [320, 768, 1024, 1440]) {
    for (const page of pages) {
      await navigate(client, page, width);
      const audit = await evaluate(client, `(() => {
        const visibleText = document.body.innerText;
        const resources = performance.getEntriesByType("resource").map((entry) => entry.name)
          .filter((url) => !url.startsWith("${SITE}/"));
        const brokenImages = Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute("src"));
        const overflowingStats = Array.from(document.querySelectorAll(".stat-value"))
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.textContent.trim());
        const emptyRendered = Array.from(document.querySelectorAll("[hidden]"))
          .filter((el) => getComputedStyle(el).display !== "none").length;
        const motionHidden = Array.from(document.querySelectorAll("main [data-reveal]"))
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < innerHeight && rect.bottom > 0 && getComputedStyle(el).opacity === "0";
          }).length;
        return {
          innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelectorAll("h1").length,
          brokenImages,
          resources,
          overflowingStats,
          emptyRendered,
          motionHidden,
          hasProductionNote: /photo d.illustration|à compl[ée]ter|ces exemples ne sont pas|en attendant|emplacement r[ée]serv[ée]|à fournir|lot [0-9]|maquette/i.test(visibleText),
          hasCompliance: Boolean(document.querySelector(".compliance-section")),
          visibleTextLength: visibleText.trim().length
        };
      })()`);
      const label = page + " @ " + width + " px";
      assert(audit.innerWidth === width, label + " : largeur de viewport incorrecte", failures);
      assert(audit.scrollWidth <= width, label + " : débordement horizontal (" + audit.scrollWidth + " px)", failures);
      assert(audit.h1 === 1, label + " : " + audit.h1 + " h1", failures);
      assert(audit.brokenImages.length === 0, label + " : image cassée " + audit.brokenImages.join(", "), failures);
      assert(audit.resources.length === 0, label + " : requête externe " + audit.resources.join(", "), failures);
      assert(audit.overflowingStats.length === 0, label + " : valeur débordante " + audit.overflowingStats.join(", "), failures);
      assert(audit.emptyRendered === 0, label + " : élément [hidden] rendu", failures);
      assert(audit.motionHidden === 0, label + " : élément d'apparition encore masqué", failures);
      assert(!audit.hasProductionNote, label + " : mention de production visible", failures);
      if (page === "index.html") {
        assert(audit.hasCompliance, label + " : conformité administrative absente", failures);
      }
      assert(audit.visibleTextLength > 40, label + " : contenu visuel anormalement vide", failures);
    }
  }
}

async function testInteractions(client, failures) {
  await navigate(client, "index.html", 320);
  await evaluate(client, `document.querySelector(".navbar-toggler").click()`);
  await delay(450);
  assert(await evaluate(client, `document.getElementById("menu-mobile").classList.contains("show")`), "Menu mobile : ouverture impossible", failures);
  await evaluate(client, `document.querySelector("#menu-mobile [data-bs-dismiss='offcanvas']").click()`);
  await delay(450);
  assert(!(await evaluate(client, `document.getElementById("menu-mobile").classList.contains("show")`)), "Menu mobile : fermeture impossible", failures);

  await navigate(client, "realisations/index.html", 1024);
  const filterResult = {};
  const filterNames = await evaluate(client, `Array.from(document.querySelectorAll("[data-filter]"), (button) => button.dataset.filter)`);
  for (const filter of filterNames) {
    await evaluate(client, `document.querySelector('[data-filter="${filter}"]').click()`);
    await delay(900);
    filterResult[filter] = await evaluate(client, `(() => {
      const button = document.querySelector('[data-filter="${filter}"]');
      return {
        visible: Array.from(document.querySelectorAll("[data-project-card]")).filter((card) => !card.hidden).length,
        expected: Number(button.querySelector("span").textContent),
        emptyVisible: !document.querySelector("[data-filter-empty]").hidden
      };
    })()`);
  }
  Object.entries(filterResult).forEach(([filter, result]) => {
    assert(result.visible === result.expected, "Filtre " + filter + " : " + result.visible + " au lieu de " + result.expected, failures);
    assert(result.emptyVisible === (result.expected === 0), "Filtre " + filter + " : état vide incorrect", failures);
  });

  await navigate(client, "realisations/index.html?domaine=btp-construction", 1024);
  assert((await evaluate(client, `Array.from(document.querySelectorAll("[data-project-card]")).filter((card) => !card.hidden).length`)) === 7, "Filtre par URL : résultat incorrect", failures);

  await navigate(client, "realisations/construction-ecole-primaire-gberedou-baranama.html", 1024);
  await evaluate(client, `document.querySelector("[data-gallery-item]").click()`);
  await delay(400);
  assert(await evaluate(client, `document.querySelector("[data-gallery-modal]").classList.contains("show")`), "Galerie : ouverture impossible", failures);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight" });
  await delay(120);
  assert((await evaluate(client, `document.querySelector("[data-gallery-position]").textContent.trim()`)) === "1 / 1", "Galerie : navigation clavier incorrecte", failures);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await delay(450);
  assert(!(await evaluate(client, `document.querySelector("[data-gallery-modal]").classList.contains("show")`)), "Galerie : fermeture Échap impossible", failures);
  assert(await evaluate(client, `document.activeElement === document.querySelector("[data-gallery-item]")`), "Galerie : focus non rendu au déclencheur", failures);

  await navigate(client, "contact.html", 768);
  await evaluate(client, `document.querySelector("[data-contact-form] button[type='submit']").click()`);
  assert(await evaluate(client, `document.activeElement.id === "nom"`), "Formulaire : focus d'erreur incorrect", failures);
  assert(await evaluate(client, `document.querySelector("[data-form-status]").textContent.length > 0`), "Formulaire : état de validation absent", failures);

}

async function testMotionModes(client, failures) {
  for (const page of pages) {
    await navigate(client, page, 320, false);
    const audit = await evaluate(client, `({
      text: document.body.innerText.trim().length,
      reveals: document.querySelectorAll("[data-reveal]").length,
      hiddenByOpacity: Array.from(document.querySelectorAll("main *")).filter((element) => element.getClientRects().length && getComputedStyle(element).opacity === "0").length
    })`);
    assert(audit.text > 40, "Sans JavaScript " + page + " : contenu vide", failures);
    assert(audit.reveals === 0, "Sans JavaScript " + page + " : état d'apparition présent", failures);
    assert(audit.hiddenByOpacity === 0, "Sans JavaScript " + page + " : contenu masqué par opacity", failures);
  }
  await client.send("Emulation.setScriptExecutionDisabled", { value: false });

  await navigate(client, "index.html", 320, true, true, false);
  await evaluate(client, `scrollTo(0, 700)`);
  await delay(300);
  const reduced = await evaluate(client, `({
    word: document.querySelector("[data-hero-word]").textContent,
    headerState: document.body.classList.contains("header-compact") || document.body.classList.contains("header-hidden"),
    reveals: document.querySelectorAll("[data-reveal]").length,
    stats: Array.from(document.querySelectorAll(".stat-value"), (element) => element.textContent.trim()),
    partnerAnimation: getComputedStyle(document.querySelector(".partner-track")).animationName
  })`);
  assert(reduced.word === "des écoles.", "Mouvement réduit : le mot du hero tourne", failures);
  assert(!reduced.headerState, "Mouvement réduit : l'en-tête réagit au défilement", failures);
  assert(reduced.reveals === 0, "Mouvement réduit : des états d'apparition sont posés", failures);
  assert(reduced.stats.join(",") === "2015,13,12,8", "Mouvement réduit : compteurs modifiés", failures);
  assert(reduced.partnerAnimation === "none", "Mouvement réduit : bandeau partenaires animé", failures);

  await navigate(client, "index.html", 320, true, false, false);
  const firstWord = await evaluate(client, `document.querySelector("[data-hero-word]").textContent`);
  await delay(3100);
  const nextWord = await evaluate(client, `document.querySelector("[data-hero-word]").textContent`);
  assert(firstWord !== nextWord, "Hero : le mot ne tourne pas après 2,8 s", failures);
  await evaluate(client, `document.querySelector("[data-hero-rotator]").focus()`);
  const focusedWord = await evaluate(client, `document.querySelector("[data-hero-word]").textContent`);
  await delay(3100);
  assert((await evaluate(client, `document.querySelector("[data-hero-word]").textContent`)) === focusedWord, "Hero : rotation non suspendue au focus", failures);

  await evaluate(client, `document.querySelector("[data-hero-rotator]").blur(); scrollTo(0, 700)`);
  await delay(300);
  assert(await evaluate(client, `document.body.classList.contains("header-compact") && document.body.classList.contains("header-hidden")`), "En-tête : condensation ou masquage en descente absent", failures);
  await evaluate(client, `scrollTo(0, 500)`);
  await delay(300);
  assert(!(await evaluate(client, `document.body.classList.contains("header-hidden")`)), "En-tête : réapparition en montée absente", failures);

  const revealExists = await evaluate(client, `Boolean(document.querySelector("[data-reveal]"))`);
  assert(revealExists, "Apparition : aucun élément préparé par le script", failures);
  if (revealExists) {
    await evaluate(client, `document.querySelector("[data-reveal]").scrollIntoView()`);
    await delay(700);
    assert(await evaluate(client, `document.querySelector("[data-reveal]").classList.contains("is-visible")`), "Apparition : élément non révélé", failures);
    await evaluate(client, `scrollTo(0, 0); document.querySelector("[data-reveal]").scrollIntoView()`);
    assert(await evaluate(client, `document.querySelector("[data-reveal]").classList.contains("is-visible")`), "Apparition : état rejoué au second passage", failures);
  }

  await navigate(client, "realisations/index.html", 1024, true, false, false);
  await evaluate(client, `document.querySelector(".project-card").scrollIntoView({ block: "center" })`);
  await client.send("DOM.enable");
  await client.send("CSS.enable");
  const documentNode = await client.send("DOM.getDocument");
  const cardNode = await client.send("DOM.querySelector", { nodeId: documentNode.root.nodeId, selector: ".project-card" });
  await client.send("CSS.forcePseudoState", { nodeId: cardNode.nodeId, forcedPseudoClasses: ["hover"] });
  await delay(250);
  const hoverTransform = await evaluate(client, `new DOMMatrix(getComputedStyle(document.querySelector(".project-card")).transform).m42`);
  await client.send("CSS.forcePseudoState", { nodeId: cardNode.nodeId, forcedPseudoClasses: [] });
  await evaluate(client, `document.querySelector(".project-card a").focus()`);
  await delay(250);
  const focusTransform = await evaluate(client, `new DOMMatrix(getComputedStyle(document.querySelector(".project-card")).transform).m42`);
  assert(Math.abs(hoverTransform - focusTransform) < .2 && focusTransform < -3.5, "Carte : traitement différent au survol et au focus", failures);
}

async function takeCaptures(client) {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  await client.send("Emulation.setScrollbarsHidden", { hidden: true });
  try {
    for (const width of [320, 768, 1440]) {
      for (const [name, page] of capturePages) {
        await navigate(client, page, width);
        await evaluate(client, `document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"))`);
        await delay(450);
        const screenshot = await client.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: true
        });
        fs.writeFileSync(path.join(CAPTURE_DIR, name + "-" + width + ".png"), Buffer.from(screenshot.data, "base64"));
      }
    }
  } finally {
    await client.send("Emulation.setScrollbarsHidden", { hidden: false });
  }
}

async function main() {
  const failures = [];
  const interactionsOnly = process.argv.includes("--interactions-only");
  const capturesOnly = process.argv.includes("--captures-only");
  const pagesOnly = process.argv.includes("--pages-only");
  const { client, targetId } = await createClient();
  try {
    if (!interactionsOnly && !capturesOnly) await testPages(client, failures);
    if (!capturesOnly && !pagesOnly) {
      await testInteractions(client, failures);
      await testMotionModes(client, failures);
    }
    if (!interactionsOnly && !pagesOnly) await takeCaptures(client);
  } finally {
    await closeClient(client, targetId);
  }

  if (failures.length) {
    console.error("ÉCHEC - " + failures.length + " anomalie(s)");
    failures.forEach((failure) => console.error("- " + failure));
    process.exitCode = 1;
    return;
  }
  if (!interactionsOnly && !capturesOnly) console.log("OK - " + pages.length + " pages testées à 320, 768, 1024 et 1440 px.");
  if (!capturesOnly && !pagesOnly) console.log("OK - interactions, 22 pages sans JavaScript et mouvement réduit.");
  if (!interactionsOnly && !pagesOnly) console.log("OK - 30 captures écrites dans " + path.relative(ROOT, CAPTURE_DIR) + ".");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
