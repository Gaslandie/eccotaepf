const fs = require("fs");
const path = require("path");
const { siteUrl } = require("./config");
const { generateSitemap } = require("./generer-sitemap");

const root = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const configuredUrl = new URL(siteUrl);
const allowedExternalSeoHosts = new Set(["schema.org"]);

const htmlFiles = [
  "index.html",
  "404.html",
  "a-propos.html",
  "services.html",
  "partenaires.html",
  "contact.html",
  "mentions-legales.html",
  "confidentialite.html",
  "realisations/index.html",
  "realisations/amenagement-ouvrage-technique-conakry.html",
  "realisations/infrastructure-scolaire-kindia.html",
  "realisations/renovation-centre-sante-mamou.html",
  "realisations/travaux-voirie-kankan.html",
  "realisations/base-logistique-boke.html",
  "realisations/amenagement-agropastoral-faranah.html",
];

function captureSeoBlocks() {
  const blocks = new Map();
  for (const file of htmlFiles) {
    const target = path.join(root, file);
    if (!fs.existsSync(target)) {
      continue;
    }
    const raw = fs.readFileSync(target, "utf8");
    const match = raw.match(/  <title>[\s\S]*?\n  <link rel="icon"/);
    if (match) {
      blocks.set(file, match[0].replace(/\n  <link rel="icon"$/, ""));
    }
  }
  return blocks;
}

const seoBlocks = captureSeoBlocks();

function publicPathFromUrl(value) {
  const url = new URL(value);
  if (allowedExternalSeoHosts.has(url.hostname)) {
    return null;
  }

  let pathname = url.pathname.replace(/^\/+/, "");
  const configuredPath = configuredUrl.pathname.replace(/^\/+|\/+$/g, "");
  if (configuredPath && pathname === configuredPath) {
    pathname = "";
  } else if (configuredPath && pathname.startsWith(`${configuredPath}/`)) {
    pathname = pathname.slice(configuredPath.length + 1);
  } else if (url.hostname === "gaslandie.github.io" && pathname.startsWith("eccotaepf/")) {
    pathname = pathname.slice("eccotaepf/".length);
  }

  return `${pathname}${url.search}${url.hash}`;
}

function rebaseSeoBlock(block) {
  return block.replace(/https?:\/\/[^\s"<>]+/g, (value) => {
    const publicPath = publicPathFromUrl(value);
    if (publicPath === null) {
      return value;
    }
    return new URL(publicPath, siteUrl).toString();
  });
}

function injectSeo(html, file) {
  const block = seoBlocks.get(file);
  if (!block) {
    return html;
  }
  return html.replace(/  <title>[\s\S]*?\n  <link rel="icon"/, `${rebaseSeoBlock(block)}\n  <link rel="icon"`);
}

function extract(pattern, label) {
  const match = indexSource.match(pattern);
  if (!match) {
    throw new Error(`Bloc partagé introuvable : ${label}`);
  }
  return match[0];
}

const shared = {
  header: extract(/  <header.*?<\/header>/s, "header"),
  offcanvas: extract(/  <div class="offcanvas.*?<\/div>\n  <\/div>/s, "offcanvas"),
  footer: extract(/  <footer.*?<\/footer>/s, "footer"),
  whatsapp: extract(/  <a class="whatsapp-float".*?<\/a>/s, "whatsapp"),
};

function withPrefix(block, prefix) {
  if (!prefix) {
    return block;
  }
  return block.replace(/\b(href|src)="(?!https?:|mailto:|tel:|#|data:)([^"]+)"/g, (all, attribute, value) => {
    return `${attribute}="${prefix}${value}"`;
  });
}

function activeMenuLabel(file) {
  if (file === "a-propos.html") return "À propos";
  if (file === "services.html") return "Services";
  if (file === "partenaires.html") return "Partenaires";
  if (file === "contact.html") return "Contact";
  if (file.startsWith("realisations/")) return "Réalisations";
  return null;
}

function withActiveMenu(block, file) {
  const activeLabel = activeMenuLabel(file);
  const neutral = block
    .replace(/\s*aria-current="page"/g, "")
    .replace(/\s*\bis-active\b/g, "");

  if (!activeLabel) {
    return neutral;
  }

  return neutral.replace(/<a class="nav-link"([^>]*)>(Accueil|À propos|Services|Réalisations|Partenaires|Contact)<\/a>/g, (all, attributes, label) => {
    if (label !== activeLabel) {
      return all;
    }
    return `<a class="nav-link is-active"${attributes} aria-current="page">${label}</a>`;
  });
}

function picture(base, alt, sizes = "(min-width: 992px) 50vw, 100vw", eager = false) {
  const loading = eager ? "" : " loading=\"lazy\"";
  return `<picture data-provisoire>
              <source srcset="${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1600.webp 1600w" sizes="${sizes}" type="image/webp">
              <img src="${base}-960.webp" width="960" height="600" alt="${alt}"${loading} data-provisoire>
            </picture>`;
}

function pageHeader(eyebrow, title, lead) {
  return `<section class="page-header">
      <div class="container">
        <p class="eyebrow text-warning">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="page-header-lead">${lead}</p>
      </div>
    </section>`;
}

function renderPage({ file, title, description, main, prefix = "" }) {
  const target = path.join(root, file);
  if (fs.existsSync(target)) {
    fs.writeFileSync(target, injectSeo(fs.readFileSync(target, "utf8"), file), "utf8");
    console.log(file);
    return;
  }

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" href="${prefix}assets/img/logo/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${prefix}assets/fonts/archivo-latin-600-800.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${prefix}assets/fonts/source-sans-3-latin-400-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${prefix}assets/vendor/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu principal</a>

${withActiveMenu(withPrefix(shared.header, prefix), file)}

${withActiveMenu(withPrefix(shared.offcanvas, prefix), file)}

${main}

${withPrefix(shared.footer, prefix)}

${shared.whatsapp}

  <script src="${prefix}assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
  <script src="${prefix}assets/js/main.js"></script>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, injectSeo(html, file), "utf8");
  console.log(file);
}

function rewriteExistingPage(file) {
  const target = path.join(root, file);
  fs.writeFileSync(target, injectSeo(fs.readFileSync(target, "utf8"), file), "utf8");
  console.log(file);
}

const projects = [
  {
    slug: "amenagement-ouvrage-technique-conakry",
    title: "Aménagement d'un ouvrage technique à Conakry",
    domain: "Génie civil",
    domainKey: "genie-civil",
    location: "Conakry, Guinée",
    year: "2024",
    period: "Février 2024 – Octobre 2024",
    image: "realisations/demo-genie-civil",
    alt: "Engin mobilisé sur une zone de travaux urbains",
    summary: "Préparation du terrain, coordination des équipes et suivi d'exécution d'un ouvrage destiné à un usage collectif.",
    description: [
      "L'intervention réunit les travaux préparatoires, l'organisation des accès et la coordination des moyens nécessaires à l'exécution de l'ouvrage.",
      "Le suivi porte sur la progression des opérations, la conformité des travaux et la continuité des circulations autour de la zone concernée.",
    ],
    scope: ["Installation et sécurisation du chantier", "Terrassements et préparation des emprises", "Coordination des travaux et contrôle des finitions"],
    gallery: [
      ["realisations/demo-genie-civil", "Engin de chantier pendant les travaux", "Moyens mobilisés sur la zone d'intervention"],
      ["realisations/travaux-voirie", "Voie urbaine en cours d'aménagement", "Organisation des accès et de la circulation"],
      ["theme/accueil-chantier", "Équipe réalisant une dalle en béton", "Exécution des travaux sur le terrain"],
    ],
  },
  {
    slug: "infrastructure-scolaire-kindia",
    title: "Infrastructure scolaire à Kindia",
    domain: "BTP et construction",
    domainKey: "btp-construction",
    location: "Kindia, Guinée",
    year: "2023",
    period: "Mars 2023 – Novembre 2023",
    image: "realisations/demo-batiment-public",
    alt: "Ouvriers travaillant autour d'un bâtiment en béton",
    summary: "Construction et aménagement d'un équipement destiné à l'accueil des élèves et de l'équipe pédagogique.",
    description: [
      "Le projet comprend l'organisation du chantier, la réalisation des structures et l'aménagement des espaces nécessaires au fonctionnement de l'établissement.",
      "Une attention particulière est portée à la lisibilité des circulations, à la robustesse des finitions et à la facilité d'entretien des locaux.",
    ],
    scope: ["Gros œuvre et maçonnerie", "Aménagement des salles et circulations", "Finitions et préparation à la mise en service"],
    gallery: [
      ["realisations/demo-batiment-public", "Ouvriers autour d'une structure en béton", "Travaux sur la structure du bâtiment"],
      ["theme/accueil-chantier", "Équipe réalisant une dalle", "Mise en œuvre des surfaces"],
      ["theme/equipe-chantier", "Équipe réunie sur le site", "Coordination des intervenants"],
    ],
  },
  {
    slug: "renovation-centre-sante-mamou",
    title: "Rénovation d'un centre de santé à Mamou",
    domain: "Rénovation et entretien",
    domainKey: "renovation-entretien",
    location: "Mamou, Guinée",
    year: "2023",
    period: "Mai 2023 – Septembre 2023",
    image: "realisations/renovation-batiment",
    alt: "Bâtiment entouré d'échafaudages pendant une rénovation",
    summary: "Remise en état des espaces, reprise des finitions et amélioration des conditions d'accueil du public.",
    description: [
      "Les travaux sont organisés pour traiter les désordres observés, reprendre les surfaces et améliorer l'usage quotidien des locaux.",
      "Le phasage permet de coordonner les corps d'état et de maintenir une progression claire jusqu'aux opérations de nettoyage et de réception.",
    ],
    scope: ["Diagnostic visuel et préparation des supports", "Réfection des surfaces et ouvrages dégradés", "Finitions, nettoyage et vérification finale"],
    gallery: [
      ["realisations/renovation-batiment", "Échafaudages installés autour du bâtiment", "Traitement des façades et de la couverture"],
      ["realisations/demo-batiment-public", "Intervention d'ouvriers sur un bâtiment", "Reprise des ouvrages existants"],
      ["theme/equipe-chantier", "Équipe technique réunie", "Coordination des travaux de rénovation"],
    ],
  },
  {
    slug: "travaux-voirie-kankan",
    title: "Travaux de voirie urbaine à Kankan",
    domain: "Génie civil",
    domainKey: "genie-civil",
    location: "Kankan, Guinée",
    year: "2022",
    period: "Janvier 2022 – Août 2022",
    image: "realisations/travaux-voirie",
    alt: "Voie urbaine aménagée avec signalisation de chantier",
    summary: "Reprofilage, traitement des abords et organisation des circulations autour d'un axe urbain structurant.",
    description: [
      "L'intervention vise à améliorer la continuité de l'axe, le traitement des points sensibles et la sécurité des déplacements pendant les travaux.",
      "Les opérations associent préparation des emprises, gestion des accès et contrôle progressif des niveaux et des finitions.",
    ],
    scope: ["Préparation et balisage des emprises", "Travaux de plateforme et traitement des abords", "Signalisation et remise en circulation"],
    gallery: [
      ["realisations/travaux-voirie", "Axe urbain aménagé", "Traitement de la chaussée et des abords"],
      ["realisations/demo-genie-civil", "Engin sur une zone de génie civil", "Préparation des emprises"],
      ["realisations/base-logistique", "Matériaux et engin de manutention", "Approvisionnement du chantier"],
    ],
  },
  {
    slug: "base-logistique-boke",
    title: "Base logistique et approvisionnement à Boké",
    domain: "Transport",
    domainKey: "transport",
    location: "Boké, Guinée",
    year: "2024",
    period: "Avril 2024 – Décembre 2024",
    image: "realisations/base-logistique",
    alt: "Base logistique avec véhicules, matériaux et engin de manutention",
    summary: "Organisation des flux, stockage des matériaux et soutien aux équipes mobilisées sur le terrain.",
    description: [
      "La base rassemble les zones de réception, de stockage et de préparation nécessaires au soutien des opérations menées sur le terrain.",
      "L'organisation privilégie la lisibilité des flux, la disponibilité des matériaux et la coordination entre transport, manutention et équipes de chantier.",
    ],
    scope: ["Organisation des zones de stockage", "Planification des approvisionnements", "Coordination du transport et de la manutention"],
    gallery: [
      ["realisations/base-logistique", "Cour de stockage avec véhicules et matériaux", "Organisation de la base logistique"],
      ["theme/equipe-chantier", "Équipe réunie avant intervention", "Coordination des moyens humains"],
      ["realisations/demo-genie-civil", "Engin mobilisé sur le terrain", "Mise à disposition des moyens matériels"],
    ],
  },
  {
    slug: "amenagement-agropastoral-faranah",
    title: "Aménagement agropastoral à Faranah",
    domain: "Agriculture et élevage",
    domainKey: "agriculture-elevage",
    location: "Faranah, Guinée",
    year: "2024",
    period: "Mars 2024 – Novembre 2024",
    image: "realisations/amenagement-agropastoral",
    alt: "Parcelle agricole équipée d'un système d'irrigation",
    summary: "Préparation d'une parcelle, mise en place des accès et accompagnement des besoins d'exploitation.",
    description: [
      "L'aménagement associe préparation du terrain, organisation des accès et mise en cohérence des équipements utiles à l'exploitation de la parcelle.",
      "Les interventions sont conduites en tenant compte des usages, des circulations et des besoins d'entretien sur la durée.",
    ],
    scope: ["Préparation et nivellement de la parcelle", "Création des accès de service", "Appui à l'installation des équipements d'exploitation"],
    gallery: [
      ["realisations/amenagement-agropastoral", "Irrigation d'une parcelle cultivée", "Équipement et mise en valeur de la parcelle"],
      ["theme/equipe-chantier", "Équipe réunie sur un site d'intervention", "Organisation des équipes"],
      ["realisations/base-logistique", "Matériaux stockés sur une base", "Préparation des fournitures et équipements"],
    ],
  },
];

function projectCard(project) {
  const base = `../assets/img/${project.image}`;
  return `<div class="col-md-6 col-xl-4" data-project-card data-domaine="${project.domainKey}">
          <article class="project-card" data-provisoire>
            <div class="image-frame">
              <a href="${project.slug}.html" aria-label="Voir ${project.title.toLowerCase()}">
                ${picture(base, project.alt, "(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw")}
              </a>
            </div>
            <div class="project-body">
              <p class="project-meta" aria-label="Domaine, localisation et année"><span>${project.domain}</span><span>${project.location.replace(", Guinée", "")}</span><span>${project.year}</span></p>
              <h2 class="h5"><a href="${project.slug}.html">${project.title}</a></h2>
              <p class="mb-0">${project.summary}</p>
            </div>
          </article>
        </div>`;
}

const aboutMain = `<main id="contenu">
    ${pageHeader("L'entreprise", "Une expérience de terrain au service des ouvrages utiles.", "Depuis 2015, ECCOTA-EPF développe ses activités autour du BTP, des infrastructures et des besoins opérationnels de ses partenaires.")}

    <section class="section">
      <div class="container">
        <div class="row g-4 g-lg-5 align-items-center">
          <div class="col-lg-6">
            <p class="eyebrow">Notre histoire</p>
            <h2>Une entreprise guinéenne créée le 03 novembre 2015.</h2>
            <div data-provisoire>
              <p>ECCOTA-EPF s'est construite autour d'une ambition simple : réunir les compétences et les moyens nécessaires pour conduire des travaux adaptés aux réalités du terrain.</p>
              <p class="mb-0">Son activité couvre aujourd'hui la construction, le génie civil, la rénovation, les fournitures, le transport et les projets agropastoraux pour des donneurs d'ordre publics et privés.</p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="media-frame">
              ${picture("assets/img/theme/equipe-chantier", "Équipe technique réunie sur un chantier")}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <div class="row g-4 align-items-end mb-4">
          <div class="col-lg-7"><p class="eyebrow text-warning">Vision et valeurs</p><h2>Construire une relation de confiance par la qualité d'exécution.</h2></div>
          <div class="col-lg-5"><p class="mb-0" data-provisoire>Chaque intervention repose sur une organisation lisible, une présence effective sur le terrain et un dialogue continu avec le maître d'ouvrage.</p></div>
        </div>
        <div class="value-grid" data-provisoire>
          <article><span>01</span><h3 class="h5">Responsabilité</h3><p class="mb-0">Assumer les engagements pris et rendre compte de l'avancement avec clarté.</p></article>
          <article><span>02</span><h3 class="h5">Rigueur</h3><p class="mb-0">Préparer les opérations, contrôler l'exécution et traiter les écarts sans délai.</p></article>
          <article><span>03</span><h3 class="h5">Proximité</h3><p class="mb-0">Rester disponible pour les équipes, les partenaires et les donneurs d'ordre.</p></article>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="direction-titre">
      <div class="container">
        <div class="row g-4 align-items-center">
          <div class="col-lg-5"><p class="eyebrow">Direction</p><h2 id="direction-titre">Une conduite fondée sur la coordination et la présence terrain.</h2></div>
          <div class="col-lg-7"><p class="lead mb-0" data-provisoire>La direction organise les moyens humains, techniques et logistiques autour des exigences de chaque mission, depuis l'étude du besoin jusqu'au suivi après livraison.</p></div>
        </div>
        <div class="stats-grid mt-5">
          <div class="stat-item"><span class="stat-value">2015</span><span class="stat-label">Création — 03 novembre 2015</span></div>
          <div class="stat-item"><span class="stat-value">Guinée</span><span class="stat-label">Territoire d'intervention</span></div>
          <div class="stat-item"><span class="stat-value">BTP</span><span class="stat-label">Construction et infrastructures</span></div>
          <div class="stat-item"><span class="stat-value">Public / Privé</span><span class="stat-label">Donneurs d'ordre accompagnés</span></div>
        </div>
      </div>
    </section>

    <section class="section intervention-section" aria-labelledby="engagements-titre">
      <div class="container">
        <p class="eyebrow">Méthode et engagements</p>
        <h2 id="engagements-titre">Quatre exigences qui structurent chaque intervention.</h2>
        <div class="engagement-grid mt-4" data-provisoire>
          <article><span class="engagement-number">01</span><h3 class="h5">Sécurité sur chantier</h3><p>Organiser les accès, les circulations et les opérations pour protéger les équipes et les usagers.</p></article>
          <article><span class="engagement-number">02</span><h3 class="h5">Respect des délais</h3><p>Planifier les étapes, identifier les points de vigilance et partager rapidement les ajustements nécessaires.</p></article>
          <article><span class="engagement-number">03</span><h3 class="h5">Conformité au cahier des charges</h3><p>Suivre les prescriptions techniques et documenter les contrôles réalisés pendant l'exécution.</p></article>
          <article><span class="engagement-number">04</span><h3 class="h5">Suivi après livraison</h3><p>Rester disponible pour l'entretien, les vérifications et les besoins complémentaires liés à l'ouvrage.</p></article>
        </div>
      </div>
    </section>

    <section class="cta-band"><div class="container d-lg-flex align-items-center justify-content-between gap-4"><div><p class="eyebrow mb-2">Échanger avec ECCOTA-EPF</p><h2 class="h3 mb-0">Présentez-nous votre prochain projet.</h2></div><a class="btn btn-primary mt-3 mt-lg-0" href="contact.html">Prendre contact</a></div></section>
  </main>`;

renderPage({
  file: "a-propos.html",
  title: "À propos - ECCOTA-EPF",
  description: "Découvrez l'histoire, la vision, les valeurs et les engagements d'ECCOTA-EPF, entreprise guinéenne créée en 2015.",
  main: aboutMain,
});

const services = [
  ["btp-construction", "BTP et construction", "assets/img/theme/accueil-chantier", "Équipe réalisant une dalle en béton", "Construction de bâtiments, coordination des corps d'état et conduite des opérations jusqu'aux finitions.", ["Préparation et installation de chantier", "Gros œuvre et second œuvre", "Coordination et suivi d'exécution"], "btp-construction"],
  ["genie-civil", "Ouvrages de génie civil", "assets/img/realisations/demo-genie-civil", "Engin mobilisé sur des travaux de génie civil", "Réalisation et entretien d'ouvrages techniques, d'aménagements et d'infrastructures utiles aux territoires.", ["Terrassements et plateformes", "Voirie et ouvrages techniques", "Aménagement des abords"], "genie-civil"],
  ["renovation-entretien", "Rénovation et entretien", "assets/img/realisations/renovation-batiment", "Bâtiment en cours de rénovation", "Remise en état, amélioration et maintenance de bâtiments existants, avec un phasage adapté à leur usage.", ["Diagnostic visuel et préparation", "Réfection des ouvrages dégradés", "Maintenance et entretien courant"], "renovation-entretien"],
  ["fournitures-diverses", "Fournitures diverses", "assets/img/realisations/base-logistique", "Matériaux organisés sur une base logistique", "Sélection, acheminement et mise à disposition de fournitures selon les spécifications du donneur d'ordre.", ["Matériaux et équipements", "Organisation des approvisionnements", "Traçabilité des livraisons"], "transport"],
  ["transport", "Transport", "assets/img/realisations/travaux-voirie", "Voie aménagée pour la circulation", "Solutions de transport et de soutien logistique pour les opérations, les fournitures et les équipes de terrain.", ["Planification des rotations", "Transport de matériaux", "Soutien logistique aux chantiers"], "transport"],
  ["agriculture-elevage", "Agriculture et élevage", "assets/img/realisations/amenagement-agropastoral", "Parcelle cultivée équipée pour l'irrigation", "Aménagements et prestations agropastorales pensés pour l'exploitation, l'accès et l'entretien des sites.", ["Préparation des parcelles", "Aménagement des accès", "Appui aux équipements d'exploitation"], "agriculture-elevage"],
  ["prestations-diverses", "Prestations diverses", "assets/img/theme/equipe-chantier", "Équipe technique réunie sur un site", "Mobilisation de compétences complémentaires pour répondre à un besoin défini dans un cahier des charges.", ["Étude du besoin", "Mobilisation des moyens adaptés", "Coordination et compte rendu"], "prestations-diverses"],
];

const servicesMain = `<main id="contenu">
    ${pageHeader("Domaines d'intervention", "Des compétences coordonnées autour des besoins du terrain.", "ECCOTA-EPF intervient sur sept domaines complémentaires pour accompagner les projets publics, institutionnels et privés.")}
    <nav class="section-index" aria-label="Accès direct aux domaines"><div class="container">${services.map((service) => `<a href="#${service[0]}">${service[1]}</a>`).join("")}</div></nav>
    ${services.map((service, index) => `<section class="section service-detail${index % 2 ? " intervention-section" : ""}" id="${service[0]}">
      <div class="container"><div class="row g-4 g-lg-5 align-items-center">
        <div class="col-lg-6 ${index % 2 ? "order-lg-2" : ""}"><div class="media-frame">${picture(service[2], service[3])}</div></div>
        <div class="col-lg-6 ${index % 2 ? "order-lg-1" : ""}" data-provisoire><p class="eyebrow">Domaine ${String(index + 1).padStart(2, "0")}</p><h2>${service[1]}</h2><p>${service[4]}</p><ul class="check-list">${service[5].map((item) => `<li>${item}</li>`).join("")}</ul><a class="btn btn-outline-primary mt-3" href="realisations/index.html?domaine=${service[6]}">Voir les réalisations</a></div>
      </div></div>
    </section>`).join("\n")}
    <section class="cta-band"><div class="container d-lg-flex align-items-center justify-content-between gap-4"><div><p class="eyebrow mb-2">Votre besoin</p><h2 class="h3 mb-0">Définissons ensemble le périmètre d'intervention.</h2></div><a class="btn btn-primary mt-3 mt-lg-0" href="contact.html">Présenter un projet</a></div></section>
  </main>`;

renderPage({
  file: "services.html",
  title: "Services et domaines d'intervention - ECCOTA-EPF",
  description: "Découvrez les sept domaines d'intervention d'ECCOTA-EPF : BTP, génie civil, rénovation, fournitures, transport, agriculture et prestations diverses.",
  main: servicesMain,
});

const partnersMain = `<main id="contenu">
    ${pageHeader("Partenaires", "Des coopérations organisées autour des exigences de chaque mission.", "ECCOTA-EPF travaille avec des acteurs publics, privés et institutionnels dans un cadre fondé sur la clarté des responsabilités.")}
    <section class="section"><div class="container"><div class="row g-4 align-items-end mb-5"><div class="col-lg-7"><p class="eyebrow">Écosystème de travail</p><h2>Des interlocuteurs complémentaires à chaque étape.</h2></div><div class="col-lg-5"><p class="mb-0" data-provisoire>La coordination associe maîtrise d'ouvrage, équipes techniques, fournisseurs et organismes d'appui selon la nature du projet.</p></div></div>
      <div class="partner-groups" data-provisoire>
        <section><span class="partner-type">Institution</span><h2 class="h4">Institutions publiques</h2><p>Administrations, collectivités et établissements publics engagés dans des projets d'infrastructure et d'équipement.</p></section>
        <section><span class="partner-type">Entreprise</span><h2 class="h4">Entreprises et fournisseurs</h2><p>Acteurs techniques, fournisseurs de matériaux et prestataires spécialisés mobilisés selon les besoins du chantier.</p></section>
        <section><span class="partner-type">Projet</span><h2 class="h4">Programmes de développement</h2><p>Initiatives structurées autour de l'accès aux services, de l'aménagement local et du renforcement des équipements.</p></section>
        <section><span class="partner-type">Organisme</span><h2 class="h4">Bailleurs et organisations</h2><p>Organismes attentifs à la conformité documentaire, au suivi des engagements et à la traçabilité de l'exécution.</p></section>
      </div>
    </div></section>
    <section class="section section-dark"><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-7"><p class="eyebrow text-warning">Travailler ensemble</p><h2>Une coordination claire, du cadrage à la livraison.</h2><p class="mb-0" data-provisoire>Chaque coopération commence par un périmètre défini, des interlocuteurs identifiés et un mode de suivi partagé.</p></div><div class="col-lg-5"><a class="btn btn-primary" href="contact.html">Échanger avec notre équipe</a></div></div></div></section>
  </main>`;

renderPage({
  file: "partenaires.html",
  title: "Partenaires - ECCOTA-EPF",
  description: "ECCOTA-EPF coordonne ses interventions avec les institutions, entreprises, projets et organismes impliqués dans chaque mission.",
  main: partnersMain,
});

const contactMap = `<figure class="contact-map" data-provisoire><svg class="guinea-map" viewBox="0 0 420 480" role="img" aria-labelledby="contact-carte-titre contact-carte-description"><title id="contact-carte-titre">Localisation d'ECCOTA-EPF en Guinée</title><desc id="contact-carte-description">Carte statique situant le siège à Conakry et les principaux axes d'intervention.</desc><path class="map-country" d="M82 91 143 74l48 30 50-11 39-37 62 24 21 55-35 43 12 53-35 36 22 54-45 48-21 65-61-16-7-47-48-23-20-53-49-20-31-48 20-42-24-38Z"/><path class="map-route" d="M92 153 153 181l66-23 61 28 18 67-58 61-18 76M153 181l-28 77m94-100 21 156M125 258l115 56"/><g class="map-points"><circle cx="91" cy="151" r="10"/><circle cx="153" cy="181" r="7"/><circle cx="218" cy="158" r="7"/><circle cx="239" cy="314" r="7"/><circle cx="298" cy="253" r="7"/></g></svg><figcaption>Siège à Conakry · interventions sur le territoire guinéen</figcaption></figure>`;

const contactMain = `<main id="contenu">
    ${pageHeader("Contact", "Parlons de votre projet et de ses contraintes de terrain.", "Téléphone, WhatsApp ou message détaillé : choisissez le canal le plus direct pour présenter votre besoin.")}
    <section class="section"><div class="container"><div class="row g-4 g-lg-5">
      <div class="col-lg-5"><p class="eyebrow">Coordonnées</p><h2>Un échange direct avec notre équipe.</h2><div class="contact-details" data-provisoire><a href="tel:+224000000000"><strong>Téléphone</strong><span>+224 000 00 00 00</span></a><a href="https://wa.me/224000000000?text=Bonjour%20ECCOTA-EPF%2C%20je%20souhaite%20%C3%A9changer%20sur%20un%20projet"><strong>WhatsApp</strong><span>Écrire maintenant</span></a><a href="mailto:contact@eccota-epf.com"><strong>E-mail</strong><span>contact@eccota-epf.com</span></a><div><strong>Horaires</strong><span>Lundi - samedi · 8 h - 18 h</span></div><div><strong>Adresse</strong><span>Conakry, Guinée</span></div></div>${contactMap}</div>
      <div class="col-lg-7"><div class="contact-form-wrap"><p class="eyebrow">Votre demande</p><h2>Présentez le contexte, le lieu et le calendrier envisagé.</h2>
        <form class="contact-form" action="mailto:contact@eccota-epf.com" method="post" enctype="text/plain" data-contact-form data-provisoire>
          <div class="row g-3"><div class="col-md-6"><label for="nom">Nom et prénom</label><input class="form-control" id="nom" name="nom" autocomplete="name" required><div class="invalid-feedback">Indiquez votre nom.</div></div><div class="col-md-6"><label for="email">Adresse e-mail</label><input class="form-control" type="email" id="email" name="email" autocomplete="email" placeholder="vous@exemple.com" required><div class="invalid-feedback">Saisissez une adresse e-mail valide.</div></div><div class="col-md-6"><label for="telephone">Téléphone</label><input class="form-control" type="tel" id="telephone" name="telephone" autocomplete="tel"></div><div class="col-md-6"><label for="sujet">Objet de la demande</label><input class="form-control" id="sujet" name="sujet" required><div class="invalid-feedback">Précisez l'objet de votre demande.</div></div><div class="col-12"><label for="message">Message</label><textarea class="form-control" id="message" name="message" rows="7" required></textarea><div class="invalid-feedback">Décrivez brièvement votre besoin.</div></div><div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" value="oui" id="accord" required><label class="form-check-label" for="accord">J'accepte que ces informations soient utilisées pour répondre à ma demande.</label><div class="invalid-feedback">Votre accord est nécessaire pour envoyer la demande.</div></div></div></div>
          <div class="form-actions"><button class="btn btn-primary" type="submit">Préparer l'e-mail</button><a class="btn btn-outline-primary" href="https://wa.me/224000000000?text=Bonjour%20ECCOTA-EPF%2C%20je%20souhaite%20%C3%A9changer%20sur%20un%20projet" data-whatsapp-fallback>Utiliser WhatsApp</a></div><p class="form-status" role="status" aria-live="polite" data-form-status></p>
        </form>
      </div></div>
    </div></div></section>
    <section class="section intervention-section"><div class="container content-narrow"><p class="eyebrow">Questions fréquentes</p><h2>Préparer un premier échange utile.</h2><div class="faq-list mt-4" data-provisoire>
      <details><summary>Dans quelles régions intervenez-vous ?</summary><p>Les moyens sont organisés selon la localisation du chantier, ses accès et son calendrier. Indiquez la ville ou la préfecture concernée pour étudier la mobilisation adaptée.</p></details>
      <details><summary>Quelle taille de marché pouvez-vous prendre en charge ?</summary><p>La capacité est évaluée à partir du périmètre technique, des délais, des moyens à mobiliser et des conditions contractuelles. Un dossier ou un cahier des charges permet une réponse précise.</p></details>
      <details><summary>Quels documents administratifs pouvez-vous fournir ?</summary><p>Les pièces disponibles sont transmises dans le cadre du dossier de consultation, selon la liste demandée par le donneur d'ordre.</p></details>
      <details><summary>Quels sont vos délais habituels ?</summary><p>Le calendrier dépend de l'étude du besoin, de la disponibilité du site et de l'enchaînement des opérations. Une planification est proposée après analyse des contraintes.</p></details>
    </div></div></section>
  </main>`;

renderPage({
  file: "contact.html",
  title: "Contact - ECCOTA-EPF",
  description: "Contactez ECCOTA-EPF à Conakry par téléphone, WhatsApp ou e-mail pour présenter un projet de construction, de génie civil ou de services.",
  main: contactMain,
});

const legalMain = `<main id="contenu">
    ${pageHeader("Informations légales", "Mentions légales", "Informations relatives à l'édition, à l'utilisation et à la responsabilité du site ECCOTA-EPF.")}
    <section class="section"><div class="container content-narrow legal-content" data-provisoire>
      <section><h2>Éditeur du site</h2><p>Le présent site est édité par ECCOTA-EPF, entreprise guinéenne intervenant notamment dans le BTP, le génie civil, la rénovation, les fournitures, le transport et les activités agropastorales.</p><p>Siège : Conakry, Guinée<br>E-mail : <a href="mailto:contact@eccota-epf.com">contact@eccota-epf.com</a><br>Téléphone : <a href="tel:+224000000000">+224 000 00 00 00</a></p></section>
      <section><h2>Direction de la publication</h2><p>La direction de la publication est assurée par la direction d'ECCOTA-EPF.</p></section>
      <section><h2>Conception et maintenance</h2><p>Le site est conçu et maintenu par GassTech Solutions pour le compte d'ECCOTA-EPF.</p></section>
      <section><h2>Propriété intellectuelle</h2><p>Les textes, éléments graphiques, signes distinctifs et contenus propres à ECCOTA-EPF sont protégés. Toute reproduction ou réutilisation substantielle nécessite une autorisation préalable.</p></section>
      <section><h2>Responsabilité</h2><p>ECCOTA-EPF veille à la clarté des informations publiées. Les caractéristiques d'une prestation ou d'un projet sont précisées dans les documents contractuels qui seuls définissent les engagements des parties.</p></section>
      <section><h2>Contact</h2><p>Pour toute question relative au site, écrivez à <a href="mailto:contact@eccota-epf.com">contact@eccota-epf.com</a>.</p></section>
    </div></section>
  </main>`;

renderPage({
  file: "mentions-legales.html",
  title: "Mentions légales - ECCOTA-EPF",
  description: "Consultez les informations légales relatives au site internet ECCOTA-EPF.",
  main: legalMain,
});

const privacyMain = `<main id="contenu">
    ${pageHeader("Données personnelles", "Politique de confidentialité", "Cette page explique les informations utilisées lorsque vous contactez ECCOTA-EPF depuis le site.")}
    <section class="section"><div class="container content-narrow legal-content" data-provisoire>
      <section><h2>Informations concernées</h2><p>Le formulaire peut recueillir votre nom, votre adresse e-mail, votre téléphone, l'objet de votre demande et le message que vous choisissez d'envoyer.</p></section>
      <section><h2>Finalité</h2><p>Ces informations servent uniquement à comprendre votre demande, vous répondre et assurer le suivi de l'échange commercial ou institutionnel engagé avec ECCOTA-EPF.</p></section>
      <section><h2>Envoi par votre messagerie</h2><p>Dans cette version du site, le formulaire prépare un e-mail dans votre logiciel de messagerie. Les informations ne sont pas enregistrées par le site avant cet envoi.</p></section>
      <section><h2>Durée de conservation</h2><p>Les échanges utiles au traitement d'une demande sont conservés pendant la durée nécessaire à son suivi, puis archivés ou supprimés selon leur nature et les obligations applicables.</p></section>
      <section><h2>Destinataires</h2><p>Les messages sont destinés aux personnes habilitées au sein d'ECCOTA-EPF et, lorsque cela est nécessaire, aux prestataires intervenant dans le traitement de la demande.</p></section>
      <section><h2>Services externes</h2><p>Le lien WhatsApp ouvre un service externe soumis à ses propres conditions d'utilisation et règles de confidentialité. Le site ECCOTA-EPF ne dépose aucun outil de suivi publicitaire.</p></section>
      <section><h2>Vos demandes</h2><p>Pour demander l'accès, la correction ou la suppression d'informations transmises à ECCOTA-EPF, écrivez à <a href="mailto:contact@eccota-epf.com">contact@eccota-epf.com</a>.</p></section>
    </div></section>
  </main>`;

renderPage({
  file: "confidentialite.html",
  title: "Politique de confidentialité - ECCOTA-EPF",
  description: "Découvrez comment ECCOTA-EPF utilise les informations transmises depuis son site internet.",
  main: privacyMain,
});

const counts = projects.reduce((result, project) => {
  result[project.domainKey] = (result[project.domainKey] || 0) + 1;
  return result;
}, {});

const filters = [
  ["tous", "Toutes", projects.length],
  ["btp-construction", "BTP et construction", counts["btp-construction"] || 0],
  ["genie-civil", "Génie civil", counts["genie-civil"] || 0],
  ["renovation-entretien", "Rénovation", counts["renovation-entretien"] || 0],
  ["transport", "Transport", counts.transport || 0],
  ["agriculture-elevage", "Agriculture", counts["agriculture-elevage"] || 0],
  ["prestations-diverses", "Prestations diverses", 0],
];

const listingMain = `<main id="contenu">
    ${pageHeader("Réalisations", "Des projets présentés par domaine, lieu et période.", "Parcourez une sélection d'interventions en construction, génie civil, rénovation, transport et aménagement agropastoral.")}
    <section class="section"><div class="container">
      <div class="filter-bar" data-realisation-filters aria-label="Filtrer les réalisations">${filters.map((filter, index) => `<button type="button" class="filter-button" data-filter="${filter[0]}" aria-pressed="${index === 0 ? "true" : "false"}">${filter[1]} <span>${filter[2]}</span></button>`).join("")}</div>
      <p class="filter-summary" aria-live="polite" data-filter-summary>${projects.length} réalisations affichées</p>
      <div class="row g-4" data-project-grid>${projects.map(projectCard).join("\n")}</div>
      <p class="filter-empty" data-filter-empty hidden>Aucune réalisation n'est publiée dans ce domaine. Consultez l'ensemble des projets ou contactez notre équipe.</p>
    </div></section>
  </main>`;

renderPage({
  file: "realisations/index.html",
  title: "Réalisations - ECCOTA-EPF",
  description: "Découvrez les réalisations d'ECCOTA-EPF par domaine, localisation et année.",
  main: listingMain,
  prefix: "../",
});

function galleryButton(item, index) {
  const base = `../assets/img/${item[0]}`;
  return `<button class="gallery-button" type="button" data-gallery-item data-gallery-index="${index}" data-gallery-src="${base}-1600.webp" data-gallery-alt="${item[1]}" data-gallery-caption="${item[2]}">
          ${picture(base, item[1], "(min-width: 992px) 33vw, 100vw")}
          <span>${item[2]}</span>
        </button>`;
}

function detailMain(project, nextProject) {
  const cover = `../assets/img/${project.image}`;
  const firstGallery = project.gallery[0];
  const firstGalleryBase = `../assets/img/${firstGallery[0]}`;
  return `<main id="contenu">
    <nav class="breadcrumb-wrap" aria-label="Fil d'Ariane"><div class="container"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="../index.html">Accueil</a></li><li class="breadcrumb-item"><a href="index.html">Réalisations</a></li><li class="breadcrumb-item active" aria-current="page">${project.title}</li></ol></div></nav>
    <section class="project-page-header"><div class="container"><div class="row g-4 g-lg-5 align-items-end"><div class="col-lg-7"><p class="eyebrow text-warning">${project.domain}</p><h1>${project.title}</h1><p class="project-page-lead" data-provisoire>${project.summary}</p></div><div class="col-lg-5"><div class="project-cover">${picture(cover, project.alt, "(min-width: 992px) 42vw, 100vw", true)}</div></div></div></div></section>
    <section class="project-facts-section"><div class="container"><dl class="project-facts"><div><dt>Domaine</dt><dd>${project.domain}</dd></div><div><dt>Localisation</dt><dd>${project.location}</dd></div><div><dt>Période</dt><dd>${project.period}</dd></div></dl></div></section>
    <section class="section"><div class="container"><div class="row g-4 g-lg-5"><div class="col-lg-7"><p class="eyebrow">Le projet</p><h2>Une intervention organisée autour des usages et des contraintes du site.</h2><div class="project-description" data-provisoire>${project.description.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div></div><div class="col-lg-5"><div class="scope-panel" data-provisoire><h2 class="h4">Périmètre d'intervention</h2><ul class="check-list">${project.scope.map((item) => `<li>${item}</li>`).join("")}</ul></div></div></div></div></section>
    <section class="section intervention-section" data-gallery><div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-7"><p class="eyebrow">Galerie</p><h2>Le chantier en images.</h2></div><div class="col-lg-5"><p class="mb-0" data-provisoire>Une lecture visuelle des moyens, des étapes et de l'environnement de l'intervention.</p></div></div><div class="gallery-grid">${project.gallery.map(galleryButton).join("")}</div><p class="filter-empty" data-gallery-empty hidden>Aucune photographie n'est disponible pour cette réalisation.</p></div>
      <div class="modal fade gallery-modal" tabindex="-1" aria-labelledby="gallery-modal-title" aria-hidden="true" data-gallery-modal><div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h5" id="gallery-modal-title">Galerie — ${project.title}</h2><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer la galerie"></button></div><div class="modal-body"><figure><img src="${firstGalleryBase}-1600.webp" width="1600" height="1000" alt="${firstGallery[1]}" data-gallery-image data-provisoire><figcaption data-gallery-caption>${firstGallery[2]}</figcaption></figure><div class="gallery-controls"><button class="icon-button" type="button" aria-label="Photographie précédente" title="Photographie précédente" data-gallery-prev><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span data-gallery-position>1 / ${project.gallery.length}</span><button class="icon-button" type="button" aria-label="Photographie suivante" title="Photographie suivante" data-gallery-next><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div></div></div></div>
    </section>
    <template class="project-testimonial-template"><blockquote class="project-testimonial"><p data-temoignage></p><cite data-temoignage-auteur><span data-temoignage-fonction></span></cite></blockquote></template>
    <section class="next-project"><div class="container"><p class="eyebrow">Projet suivant</p><a href="${nextProject.slug}.html"><span>${nextProject.domain}</span><strong>${nextProject.title}</strong></a></div></section>
  </main>`;
}

projects.forEach((project, index) => {
  const nextProject = projects[(index + 1) % projects.length];
  renderPage({
    file: `realisations/${project.slug}.html`,
    title: `${project.title} - ECCOTA-EPF`,
    description: `${project.summary} Découvrez le projet mené à ${project.location}.`,
    main: detailMain(project, nextProject),
    prefix: "../",
  });
});

rewriteExistingPage("index.html");
rewriteExistingPage("404.html");
console.log(`sitemap.xml généré : ${generateSitemap()} URL(s)`);
