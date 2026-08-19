const fs = require("fs");
const path = require("path");
const { siteUrl } = require("./config");
const { generateSitemap } = require("./generer-sitemap");

const root = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

const contact = {
  phone: "+224 622 55 77 33",
  phoneHref: "+224622557733",
  whatsapp: "+224 627 958 193",
  whatsappHref: "https://wa.me/224627958193?text=Bonjour%20ECCOTA-EPF%2C%20je%20souhaite%20%C3%A9changer%20sur%20un%20projet",
  email: "eccota-epf@gmail.com",
  address: "Sangoyah Mosquée, commune de Matoto, Conakry",
};

const services = [
  ["btp-construction", "Bâtiments et construction", "assets/img/realisations/maison-residentielle-gomboyah", "Chantier de bâtiment résidentiel avec ferraillage de poteaux en cours", "Construction de bâtiments, équipements collectifs, logements de fonction, hangars et locaux administratifs.", ["Préparation et installation de chantier", "Gros œuvre et second œuvre", "Équipements associés et finitions"]],
  ["genie-civil", "Génie civil et ouvrages", "assets/img/realisations/demo-genie-civil", "Engin mobilisé sur des travaux de génie civil", "Ouvrages de génie civil et rural, ouvrages de franchissement et interventions sur infrastructures utiles aux territoires.", ["Ouvrages en béton armé", "Ouvrages de franchissement", "Aménagements et infrastructures rurales"]],
  ["infrastructures-sanitaires-scolaires", "Infrastructures sanitaires et scolaires", "assets/img/realisations/demo-batiment-public", "Ouvriers travaillant autour d'un bâtiment en béton", "Construction, rénovation et équipement d'infrastructures de santé et d'établissements scolaires.", ["Salles de classe et bureaux", "Centres de santé et latrines", "Équipements et installations techniques"]],
  ["renovation-entretien", "Rénovation et entretien", "assets/img/realisations/renovation-batiment", "Bâtiment en cours de rénovation", "Rénovation en peinture, entretiens, réparations matérielles et mobilières sur bâtiments existants.", ["Rénovation de bâtiments", "Entretiens et réparations", "Reprise des finitions"]],
  ["fournitures-diverses", "Fournitures diverses", "assets/img/realisations/base-logistique", "Matériaux organisés sur une base logistique", "Fourniture d'équipements et installations selon les besoins exprimés par le donneur d'ordre.", ["Fourniture d'équipements", "Installations électriques", "Mise à disposition selon cahier des charges"]],
  ["transport", "Transport", "assets/img/realisations/travaux-voirie", "Voie aménagée pour la circulation", "Transport de travailleurs et soutien logistique aux activités de terrain.", ["Organisation des rotations", "Transport de personnel", "Coordination avec les sites d'exploitation"]],
  ["agropastoral-amenagements", "Agropastoral et aménagements", "assets/img/realisations/amenagement-agropastoral", "Parcelle cultivée équipée pour l'irrigation", "Projets d'aménagements, infrastructures d'irrigation et équipements liés aux activités agropastorales.", ["Réhabilitation d'infrastructures d'irrigation", "Magasins et aires de battage", "Aménagements agricoles"]],
];

const domainIcons = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V7l8-4 8 4v14M2 21h20M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V11M21 21V11M3 14c4-5 14-5 18 0M3 18h18M7 18v3M17 18v3"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V5h14v16M3 21h18M12 8v6M9 11h6M9 17h6"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h10v5H4zM14 7h3a2 2 0 0 1 2 2v3M17 12h4v8h-4z"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 7 8-4 8 4-8 4-8-4ZM4 7v10l8 4 8-4V7M12 11v10"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-9M12 14c-5 0-8-3-8-7 5 0 8 3 8 7ZM12 12c0-5 3-8 8-8 0 5-3 8-8 8Z"/></svg>',
];

const whatsappGlyph = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

function guineaMap(idPrefix, allLocations = true) {
  const locations = allLocations
    ? '<g class="map-points"><circle cx="138.1" cy="268.8" r="5"/><circle cx="159.7" cy="255.5" r="5"/><circle cx="173.4" cy="227.2" r="5"/><circle cx="184.5" cy="172.5" r="5"/><circle cx="279.7" cy="135.1" r="5"/><circle cx="442.9" cy="191.8" r="5"/><circle cx="486.2" cy="192" r="5"/><circle cx="509" cy="311.1" r="5"/></g><g class="map-labels"><text x="126" y="291" text-anchor="end">Conakry</text><text x="151" y="250" text-anchor="end">Coyah</text><text x="185" y="225">Kindia</text><text x="195" y="166">Télimélé</text><text x="290" y="130">Tougué</text><text x="433" y="181" text-anchor="end">Kankan</text><text x="497" y="181">Mandiana</text><text x="501" y="336" text-anchor="end">Beyla</text></g>'
    : '<g class="map-points"><circle cx="138.1" cy="268.8" r="6"/></g><g class="map-labels"><text x="126" y="291" text-anchor="end">Conakry</text></g>';
  const description = allLocations
    ? 'Contour géographique de la Guinée avec Conakry, Coyah, Kindia, Télimélé, Tougué, Kankan, Mandiana et Beyla placées selon leurs coordonnées.'
    : 'Contour géographique de la Guinée avec le siège situé à Conakry.';
  return `<svg class="guinea-map" viewBox="0 0 600 480" role="img" aria-labelledby="${idPrefix}-titre ${idPrefix}-description"><title id="${idPrefix}-titre">Carte des zones d'intervention en Guinée</title><desc id="${idPrefix}-description">${description}</desc><use class="map-country" href="assets/img/cartes/guinee-contour.svg#guinee-contour"/>${locations}</svg>`;
}

const values = [
  ["E", "Expérience"],
  ["C", "Compétitivité"],
  ["C", "Courage"],
  ["O", "Ouverture"],
  ["T", "Transparence"],
  ["A", "Adaptabilité"],
  ["E", "Efficacité"],
  ["P", "Persévérance"],
  ["F", "Flexibilité"],
];

const partners = [
  "JOBOMAX Guinée Sarl",
  "Hôpital National Donka",
  "Centre médico-communal de Matam",
  "projet Action Faim",
  "Eco-bétape S.A",
  "Société des Mines de Mandiana",
  "École supérieure de tourisme et d'hôtellerie Filamadina",
];

const projects = [
  {
    slug: "construction-logement-personnel-centre-sante-bangouya",
    title: "Construction du logement du personnel du centre de santé de Bangouya",
    shortTitle: "Logement du personnel du centre de santé",
    domain: "Infrastructures sanitaires et scolaires",
    domainKeys: ["btp-construction", "infrastructures-sanitaires-scolaires"],
    location: "Bangouya, CR Kouriah, préfecture de Coyah",
    city: "Bangouya",
    year: "2024",
    period: "Sept. – déc. 2024",
    image: "realisations/logement-personnel-centre-sante-bangouya",
    alt: "Petit bâtiment en maçonnerie en cours de construction pour un logement de fonction rural",
    summary: "Construction du logement du personnel du centre de santé, avec un bâtiment, un magasin et un bloc de latrines de 3 cabines, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction du logement du personnel du centre de santé à Bangouya, CR Kouriah, dans la préfecture de Coyah.",
      "L'intervention comprend un bâtiment, un magasin et un bloc de latrines de 3 cabines, en qualité de sous-traitante.",
    ],
    scope: ["Construction d'un bâtiment", "Construction d'un magasin", "Bloc de latrines de 3 cabines"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-ecole-primaire-gberedou-baranama",
    title: "Construction d'une école primaire à Gbérédou Baranama",
    shortTitle: "École primaire à Gbérédou Baranama",
    domain: "Infrastructures sanitaires et scolaires",
    domainKeys: ["btp-construction", "infrastructures-sanitaires-scolaires"],
    location: "CR Gbérédou Baranama, préfecture de Kankan",
    city: "Gbérédou Baranama",
    year: "2023",
    period: "Juin – oct. 2023",
    image: "realisations/ecole-primaire-gberedou-baranama",
    alt: "Élèves devant un bâtiment scolaire rural entouré de verdure",
    summary: "Construction d'une école primaire de 3 salles de classe, bureau et magasin incorporé, avec 2 blocs de latrines de 4 cabines, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction d'une école primaire à Gbérédou Baranama, dans la préfecture de Kankan.",
      "L'ouvrage comprend 3 salles de classe, bureau et magasin incorporé, ainsi que 2 blocs de latrines de 4 cabines, WC et douche, en qualité de sous-traitante.",
    ],
    scope: ["3 salles de classe", "Bureau et magasin incorporé", "2 blocs de latrines de 4 cabines"],
    keyFigure: ["3 salles + bureau + magasin", "Équipement scolaire construit"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "fourniture-ventilateurs-installations-electriques-filamadina-conakry",
    title: "Fourniture de ventilateurs et installations électriques à Filamadina",
    shortTitle: "Ventilateurs et installations électriques",
    domain: "Fournitures diverses",
    domainKeys: ["fournitures-diverses"],
    location: "École supérieure de tourisme et d'hôtellerie Filamadina, Conakry",
    city: "Conakry",
    year: "2022",
    period: "18 – 30 nov. 2022",
    image: "realisations/installations-electriques-filamadina-conakry",
    alt: "Technicien intervenant sur un tableau électrique ouvert avec câblage apparent",
    summary: "Fourniture de ventilateurs RAKS et installations électriques dans 23 salles de classe à l'École supérieure de tourisme et d'hôtellerie Filamadina.",
    description: [
      "Le marché porte sur la fourniture de ventilateurs RAKS et les installations électriques à l'École supérieure de tourisme et d'hôtellerie Filamadina, à Conakry.",
      "L'intervention concerne 23 salles de classe.",
    ],
    scope: ["Fourniture de ventilateurs RAKS", "Installations électriques", "Intervention dans les salles de classe"],
    keyFigure: ["23 salles de classe", "Équipements fournis et installés"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "transport-travailleurs-site-mines-mandiana",
    title: "Transport des travailleurs vers le site des Mines de Mandiana",
    shortTitle: "Transport de travailleurs à Mandiana",
    domain: "Transport",
    domainKeys: ["transport"],
    location: "Loila et Koromandou, CR Koundian et Kièran, préfecture de Mandiana",
    city: "Mandiana",
    year: "2021",
    period: "2020 – 2021",
    image: "realisations/transport-travailleurs-mines-mandiana",
    alt: "Camion circulant sur une piste de site minier en terrain sec",
    summary: "Transport des travailleurs d'Eco-bétape S.A vers le site d'exploitation de la Société des Mines de Mandiana.",
    description: [
      "Le marché porte sur le transport des travailleurs d'Eco-bétape S.A vers le site d'exploitation de la Société des Mines de Mandiana.",
      "Les lieux indiqués sont Loila et Koromandou, CR Koundian et Kièran, dans la préfecture de Mandiana.",
    ],
    scope: ["Transport de travailleurs", "Organisation des trajets vers site d'exploitation", "Intervention sur Loila et Koromandou"],
    proof: "Fiche des contrats",
  },
  {
    slug: "construction-batiment-piece-modele-gomboyah",
    title: "Construction d'un bâtiment de pièce modèle à Gomboyah",
    shortTitle: "Bâtiment de pièce modèle à Gomboyah",
    domain: "Bâtiments et construction",
    domainKeys: ["btp-construction"],
    location: "Gomboyah, commune urbaine de Coyah",
    city: "Gomboyah",
    year: "2020",
    period: "1er févr. – 30 mai 2020",
    image: "realisations/maison-residentielle-gomboyah",
    alt: "Chantier de bâtiment résidentiel avec ferraillage de poteaux en cours",
    summary: "Construction d'un bâtiment de pièce modèle, parcelle n° 1, pour JOBOMAX Guinée Sarl à Gomboyah.",
    description: [
      "Le marché porte sur la construction d'un bâtiment de pièce modèle, Chicago Family, parcelle n° 1, pour JOBOMAX Guinée Sarl.",
      "Le chantier est situé à Gomboyah, commune urbaine de Coyah.",
    ],
    scope: ["Construction du bâtiment", "Travaux sur parcelle n° 1", "Livraison pour JOBOMAX Guinée Sarl"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "renovation-batiments-hopital-national-donka-conakry",
    title: "Rénovation de bâtiments à l'Hôpital National Donka",
    shortTitle: "Rénovation à l'Hôpital National Donka",
    domain: "Rénovation et entretien",
    domainKeys: ["renovation-entretien", "infrastructures-sanitaires-scolaires"],
    location: "Hôpital National Donka, Conakry",
    city: "Conakry",
    year: "2020",
    period: "10 févr. – 3 avr. 2020",
    image: "realisations/renovation-facade-hopital-donka",
    alt: "Ouvrier sur échafaudage devant une façade de bâtiment en rénovation",
    summary: "Rénovation en peinture et entretiens de 3 bâtiments R+3, 2 bâtiments R+1 et une villa de 13 chambres avec latrine.",
    description: [
      "Le marché porte sur la rénovation en peinture et les entretiens à l'Hôpital National Donka, à Conakry.",
      "Les travaux concernent 3 bâtiments R+3, 2 bâtiments R+1 et une villa de 13 chambres avec latrine.",
    ],
    scope: ["Rénovation en peinture", "Entretiens de bâtiments R+3 et R+1", "Intervention sur une villa avec latrine"],
    keyFigure: ["13 chambres", "Villa rénovée avec latrine"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "entretien-reparations-centre-medico-communal-matam-conakry",
    title: "Entretien et réparations au CMC de Matam",
    shortTitle: "Entretien au CMC de Matam",
    domain: "Rénovation et entretien",
    domainKeys: ["renovation-entretien", "infrastructures-sanitaires-scolaires"],
    location: "Centre médico-communal de Matam, Conakry",
    city: "Conakry",
    year: "2019",
    period: "Déc. 2018 – janv. 2019",
    image: "realisations/maintenance-batiment-cmc-matam",
    alt: "Travaux de menuiserie et de second œuvre dans une cour de bâtiment",
    summary: "Entretien et réparations, matérielles et mobilières, au Centre médico-communal de Matam à Conakry.",
    description: [
      "Le marché porte sur l'entretien et les réparations, matérielles et mobilières, au Centre médico-communal de Matam.",
      "Le site d'intervention est situé à Conakry.",
    ],
    scope: ["Entretien courant", "Réparations matérielles", "Réparations mobilières"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-hangar-marche-gbessoba",
    title: "Construction d'un hangar au marché de Gbèssoba",
    shortTitle: "Hangar au marché de Gbèssoba",
    domain: "Bâtiments et construction",
    domainKeys: ["btp-construction"],
    location: "Gbèssoba centre, CR Gbèssoba, préfecture de Beyla",
    city: "Gbèssoba",
    year: "2019",
    period: "26 juil. – 22 oct. 2019",
    image: "realisations/hangar-marche-gbessoba",
    alt: "Charpente métallique assemblée sur un chantier de hangar",
    summary: "Construction d'un hangar avec bloc de latrines de 4 cabines au marché de Gbèssoba, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction d'un hangar avec bloc de latrines de 4 cabines au marché de Gbèssoba.",
      "L'intervention est située à Gbèssoba centre, CR Gbèssoba, dans la préfecture de Beyla, en qualité de sous-traitante.",
    ],
    scope: ["Construction du hangar", "Bloc de latrines de 4 cabines", "Intervention au marché"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-equipement-ecole-primaire-siriya-sinko",
    title: "Construction et équipement d'une école primaire à Siriya",
    shortTitle: "École primaire à Siriya",
    domain: "Infrastructures sanitaires et scolaires",
    domainKeys: ["btp-construction", "infrastructures-sanitaires-scolaires"],
    location: "District de Siriya, CR Sinko, préfecture de Beyla",
    city: "Siriya",
    year: "2019",
    period: "26 juil. – 23 déc. 2019",
    image: "realisations/forage-pompe-cloture-siriya-sinko",
    alt: "Pompe manuelle de forage dans une cour rurale en terre rouge",
    summary: "Construction et équipement d'une école primaire avec 3 salles de classe, bureau, magasin, latrines, logement du directeur, cuisine externe, forage et clôture semi-grillagée de 400 ml, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction et l'équipement d'une école primaire dans le district de Siriya, CR Sinko, préfecture de Beyla.",
      "L'ouvrage comprend 3 salles de classe, bureau et magasin, 2 blocs de latrines, logement du directeur, cuisine externe, forage équipé d'une pompe mécanique et clôture semi-grillagée, en qualité de sous-traitante.",
    ],
    scope: ["Construction et équipement de l'école", "Logement du directeur, cuisine externe et forage", "Clôture semi-grillagée"],
    keyFigure: ["400 ml de clôture", "Clôture semi-grillagée"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "rehabilitation-infrastructures-irrigation-ndouta-tougue",
    title: "Réhabilitation des infrastructures d'irrigation de N'douta",
    shortTitle: "Irrigation de N'douta",
    domain: "Agropastoral et aménagements",
    domainKeys: ["agropastoral-amenagements"],
    location: "N'douta, préfecture de Tougué",
    city: "N'douta",
    year: "2018",
    period: "14 mars – 23 oct. 2018",
    image: "realisations/irrigation-ndouta-tougue",
    alt: "Canal d'irrigation traversant une rizière tropicale",
    summary: "Réhabilitation des infrastructures d'irrigation de N'douta sur 50 ha, construction d'un magasin et de deux aires de battage et séchage, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la réhabilitation des infrastructures d'irrigation de N'douta, dans la préfecture de Tougué.",
      "L'intervention couvre 50 ha et comprend la construction d'un magasin et de deux aires de battage et séchage, en qualité de sous-traitante.",
    ],
    scope: ["Réhabilitation d'infrastructures d'irrigation", "Construction d'un magasin", "Deux aires de battage et séchage"],
    keyFigure: ["50 ha", "Infrastructures d'irrigation réhabilitées"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-latrines-ecole-centre-sante-gberedou-baranama",
    title: "Construction de latrines à Gbérédou Baranama",
    shortTitle: "Latrines à Gbérédou Baranama",
    domain: "Infrastructures sanitaires et scolaires",
    domainKeys: ["btp-construction", "infrastructures-sanitaires-scolaires"],
    location: "Gbérédou Baranama, préfecture de Kankan",
    city: "Gbérédou Baranama",
    year: "2017",
    period: "4 mai – 3 sept. 2017",
    image: "realisations/bloc-sanitaire-gberedou-baranama",
    alt: "Mur en parpaings monté pour un petit bloc sanitaire",
    summary: "Construction de deux latrines de 4 cabines, d'une latrine de 2 cabines à l'école primaire et d'une douche au centre de santé, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction de deux latrines de 4 cabines, d'une latrine de 2 cabines à l'école primaire et d'une douche au centre de santé.",
      "L'intervention est située à Gbérédou Baranama, dans la préfecture de Kankan, en qualité de sous-traitante.",
    ],
    scope: ["Deux latrines de 4 cabines", "Une latrine de 2 cabines à l'école primaire", "Une douche au centre de santé"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-siege-projet-action-faim-mandiana",
    title: "Construction du siège du projet Action Faim à Mandiana",
    shortTitle: "Siège du projet Action Faim",
    domain: "Bâtiments et construction",
    domainKeys: ["btp-construction"],
    location: "Préfecture de Mandiana",
    city: "Mandiana",
    year: "2017",
    period: "Nov. 2016 – févr. 2017",
    image: "realisations/bureau-projet-mandiana",
    alt: "Bâtiment administratif bas dans un environnement tropical",
    summary: "Construction du siège du projet Action Faim : bloc administratif bureau-magasin et abri pour groupe électrogène.",
    description: [
      "Le marché porte sur la construction du siège du projet Action Faim dans la préfecture de Mandiana.",
      "L'ouvrage comprend un bloc administratif bureau-magasin et un abri pour groupe électrogène.",
    ],
    scope: ["Bloc administratif bureau-magasin", "Abri pour groupe électrogène", "Construction du siège de projet"],
    proof: "Attestation de bonne fin",
  },
  {
    slug: "construction-ouvrages-beton-arme-route-kindia-telimele",
    title: "Construction d'ouvrages en béton armé sur la route Kindia-Télimélé",
    shortTitle: "Ouvrages béton armé Kindia-Télimélé",
    domain: "Génie civil et ouvrages",
    domainKeys: ["genie-civil"],
    location: "Kindia",
    city: "Kindia",
    year: "2016",
    period: "13 juil. – 14 déc. 2016",
    image: "realisations/ouvrage-beton-route-kindia-telimele",
    alt: "Ouvrage en béton armé avec ferraillage apparent sur chantier de génie civil",
    summary: "Construction d'ouvrages en béton armé sur la route Kindia-Télimélé, en qualité de sous-traitante.",
    description: [
      "Le marché porte sur la construction d'ouvrages en béton armé sur la route Kindia-Télimélé.",
      "L'intervention est localisée à Kindia, en qualité de sous-traitante.",
    ],
    scope: ["Ouvrages en béton armé", "Intervention sur route Kindia-Télimélé", "Travaux de génie civil"],
    proof: "Attestation de bonne fin",
  },
];

function extract(pattern, label) {
  const match = indexSource.match(pattern);
  if (!match) {
    throw new Error(`Bloc partagé introuvable : ${label}`);
  }
  return match[0];
}

function updateSharedContacts(block) {
  return block
    .replace(/href="tel:\+224000000000"/g, `href="tel:${contact.phoneHref}"`)
    .replace(/href="mailto:contact@eccota-epf\.com"/g, `href="mailto:${contact.email}" data-provisoire`)
    .replace(/contact@eccota-epf\.com/g, contact.email)
    .replace(/\+224 000 00 00 00/g, contact.phone)
    .replace(/plus 224 000 00 00 00/g, "plus 224 622 55 77 33")
    .replace(/Conakry, Guinée/g, contact.address)
    .replace(/\s*<li>Lundi - samedi · 8 h - 18 h<\/li>/g, "")
    .replace(/https:\/\/wa\.me\/224000000000\?text=Bonjour%20ECCOTA-EPF%2C%20je%20souhaite%20%C3%A9changer%20sur%20un%20projet/g, contact.whatsappHref)
    .replace(/<ul class="footer-list" data-provisoire>/g, `<ul class="footer-list">`)
    .replace(/(<a class="header-phone[^>]+?) data-provisoire(>)/g, "$1$2")
    .replace(/(<a class="whatsapp-float[^>]+?) data-provisoire(>)/g, "$1$2")
    .replace(/<span data-provisoire>Informations légales et administratives disponibles sur demande\.<\/span>/g, "<span>Informations légales et administratives disponibles sur demande.</span>");
}

const shared = {
  header: reconnectSharedNavigation(updateSharedContacts(extract(/  <header.*?<\/header>/s, "header"))),
  offcanvas: reconnectSharedNavigation(extract(/  <div class="offcanvas.*?<\/div>\n  <\/div>/s, "offcanvas")),
  footer: reconnectSharedNavigation(updateSharedContacts(extract(/  <footer.*?<\/footer>/s, "footer"))),
  whatsapp: updateSharedContacts(extract(/  <a class="whatsapp-float".*?<\/a>/s, "whatsapp")),
};

function reconnectSharedNavigation(block) {
  return block
    .replace(/href="index\.html#chiffres-titre"(?=>À propos)/g, `href="a-propos.html"`)
    .replace(/href="index\.html#domaines"(?=>Services)/g, `href="services.html"`)
    .replace(/href="index\.html#realisations"(?=>Réalisations)/g, `href="realisations/index.html"`)
    .replace(/href="index\.html#partenaires"(?=>Partenaires)/g, `href="partenaires.html"`)
    .replace(/href="index\.html#contact"(?=>Contact)/g, `href="contact.html"`)
    .replace(/href="index\.html#chiffres-titre"(?=>À propos<\/a>)/g, `href="a-propos.html"`)
    .replace(/href="index\.html#partenaires"(?=>Partenaires<\/a>)/g, `href="partenaires.html"`)
    .replace(/href="index\.html#contact"(?=>Demander un échange<\/a>)/g, `href="contact.html"`)
    .replace(/href="index\.html"(?=>Mentions légales<\/a>)/g, `href="mentions-legales.html"`)
    .replace(/href="index\.html"(?=>Confidentialité<\/a>)/g, `href="confidentialite.html"`);
}

function withPrefix(block, prefix) {
  if (!prefix) return block;
  return block.replace(/\b(href|src)="(?!https?:|mailto:|tel:|#|data:)([^"]+)"/g, (all, attribute, value) => `${attribute}="${prefix}${value}"`);
}

function activeMenuLabel(file) {
  if (file === "index.html") return "Accueil";
  if (file === "a-propos.html") return "À propos";
  if (file === "services.html") return "Services";
  if (file === "partenaires.html") return "Partenaires";
  if (file === "contact.html") return "Contact";
  if (file.startsWith("realisations/")) return "Réalisations";
  return null;
}

function withActiveMenu(block, file) {
  const activeLabel = activeMenuLabel(file);
  const neutral = block.replace(/\s*aria-current="page"/g, "").replace(/\s*\bis-active\b/g, "");
  if (!activeLabel) return neutral;
  return neutral.replace(/<a class="nav-link"([^>]*)>(Accueil|À propos|Services|Réalisations|Partenaires|Contact)<\/a>/g, (all, attributes, label) => {
    if (label !== activeLabel) return all;
    return `<a class="nav-link is-active"${attributes} aria-current="page">${label}</a>`;
  });
}

function prefixFor(file) {
  return file.startsWith("realisations/") ? "../" : "";
}

function publicPath(file) {
  if (file === "index.html") return "";
  if (file.endsWith("/index.html")) return file.slice(0, -"index.html".length);
  return file;
}

function absoluteUrl(file) {
  return new URL(publicPath(file), siteUrl).toString();
}

function absoluteAsset(asset) {
  return new URL(asset, siteUrl).toString();
}

function breadcrumbItems(file, title) {
  const items = [{ name: "Accueil", url: absoluteUrl("index.html") }];
  if (file === "index.html") return items;
  if (file.startsWith("realisations/") && file !== "realisations/index.html") {
    items.push({ name: "Réalisations", url: absoluteUrl("realisations/index.html") });
  }
  items.push({ name: title, url: absoluteUrl(file) });
  return items;
}

function jsonLd(file, seo, project = null) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      "name": "ECCOTA-EPF",
      "legalName": "Entreprise de Commerce, Construction, Transport, Agriculture, Élevage, Pêche & Fournitures",
      "url": siteUrl,
      "foundingDate": "2015-11-03",
      "telephone": contact.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sangoyah Mosquée",
        "addressLocality": "Matoto, Conakry",
        "addressCountry": "GN"
      },
      "areaServed": { "@type": "Country", "name": "Guinée" },
      "description": "Entreprise guinéenne intervenant en BTP, génie civil, rénovation, fournitures, transport, agriculture et élevage."
    }
  ];
  if (file !== "index.html") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${absoluteUrl(file)}#breadcrumb`,
      "itemListElement": breadcrumbItems(file, seo.breadcrumb || seo.title).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    });
  }
  if (project) {
    graph.push({
      "@type": "CreativeWork",
      "@id": `${absoluteUrl(file)}#realisation`,
      "name": project.title,
      "description": project.summary,
      "about": project.domain,
      "temporalCoverage": project.period,
      "locationCreated": { "@type": "Place", "name": project.location },
      "image": absoluteAsset(`assets/img/${project.image}-1600.webp`),
      "provider": { "@id": `${siteUrl}#organization` }
    });
  }
  return `{\n    "@context": "https://schema.org",\n    "@graph": ${JSON.stringify(graph, null, 6)}\n  }`;
}

function headBlock(file, seo, project = null) {
  const prefix = prefixFor(file);
  const url = absoluteUrl(file);
  const image = absoluteAsset(seo.image || "assets/img/theme/accueil-chantier-1600.webp");
  const imageAlt = seo.imageAlt || "Équipe de chantier mobilisée par ECCOTA-EPF";
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${url}">
  <meta property="og:locale" content="fr_GN">
  <meta property="og:type" content="${project ? "article" : "website"}">
  <meta property="og:site_name" content="ECCOTA-EPF">
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="1600">
  <meta property="og:image:height" content="1000">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.description}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">
  ${jsonLd(file, seo, project)}
  </script>
  <link rel="icon" href="${prefix}assets/img/logo/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${prefix}assets/fonts/figtree-latin-600-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${prefix}assets/fonts/karla-latin-400-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${prefix}assets/vendor/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
</head>`;
}

function picture(base, alt, sizes = "(min-width: 992px) 50vw, 100vw", eager = false) {
  const loading = eager ? "" : " loading=\"lazy\"";
  return `<picture data-provisoire>
              <source srcset="${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1600.webp 1600w" sizes="${sizes}" type="image/webp">
              <img src="${base}-960.webp" width="960" height="600" alt="${alt}"${loading} data-provisoire>
            </picture>`;
}

function pageHeader(eyebrow, title, lead, media = null) {
  const mediaBlock = media
    ? `\n      <div class="page-header-media">${picture(media.base, media.alt, "100vw")}</div>`
    : "";
  return `<section class="page-header${media ? " page-header--image" : ""}">${mediaBlock}
      <div class="container">
        <p class="eyebrow text-warning">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="page-header-lead">${lead}</p>
      </div>
    </section>`;
}

function renderPage({ file, seo, main, project = null }) {
  const prefix = prefixFor(file);
  const target = path.join(root, file);
  const html = `<!doctype html>
<html lang="fr">
${headBlock(file, seo, project)}
<body>
  <a class="skip-link" href="#contenu">Aller au contenu principal</a>

${withActiveMenu(withPrefix(shared.header, prefix), file)}

${withActiveMenu(withPrefix(shared.offcanvas, prefix), file)}

${main}

${withPrefix(shared.footer, prefix)}

${withPrefix(shared.whatsapp, prefix)}

  <script src="${prefix}assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
  <script src="${prefix}assets/js/main.js"></script>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, "utf8");
  console.log(file);
}

function renderExistingWithShared(file) {
  const target = path.join(root, file);
  let html = fs.readFileSync(target, "utf8");
  const prefix = prefixFor(file);
  html = html
    .replace(/assets\/fonts\/archivo-latin-600-800\.woff2/g, "assets/fonts/figtree-latin-600-700.woff2")
    .replace(/assets\/fonts\/source-sans-3-latin-400-700\.woff2/g, "assets/fonts/karla-latin-400-700.woff2")
    .replace(/  <header.*?<\/header>/s, withActiveMenu(withPrefix(shared.header, prefix), file))
    .replace(/  <div class="offcanvas.*?<\/div>\n  <\/div>/s, withActiveMenu(withPrefix(shared.offcanvas, prefix), file))
    .replace(/  <footer.*?<\/footer>/s, withPrefix(shared.footer, prefix))
    .replace(/  <a class="whatsapp-float".*?<\/a>/s, withPrefix(shared.whatsapp, prefix));
  fs.writeFileSync(target, html, "utf8");
  console.log(file);
}

function projectCard(project, heading = "h2", basePrefix = "../") {
  const base = `${basePrefix}assets/img/${project.image}`;
  const keys = project.domainKeys.join(" ");
  return `<div class="col-md-6 col-xl-4" data-project-card data-domaine="${keys}">
          <article class="project-card">
            <div class="image-frame">
              <a href="${project.slug}.html" aria-label="Voir ${project.title.toLowerCase()}">
                ${picture(base, project.alt, "(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw")}
              </a>
            </div>
            <div class="project-body">
              <p class="project-meta" aria-label="Domaine, localisation et année"><span>${project.domain}</span><span>${project.city}</span><span>${project.year}</span></p>
              <${heading} class="h5"><a href="${project.slug}.html">${project.shortTitle}</a></${heading}>
              <p class="mb-0">${project.summary}</p>
            </div>
          </article>
        </div>`;
}

function homeProjectCard(project) {
  return projectCard(project, "h3", "").replaceAll(`${project.slug}.html`, `realisations/${project.slug}.html`);
}

function galleryItems(project) {
  return [[project.image, project.alt, "Vue du type d'ouvrage"]];
}

function galleryButton(item, index) {
  const base = `../assets/img/${item[0]}`;
  return `<button class="gallery-button" type="button" data-gallery-item data-gallery-index="${index}" data-gallery-src="${base}-1600.webp" data-gallery-alt="${item[1]}" data-gallery-caption="${item[2]}">
          ${picture(base, item[1], "(min-width: 992px) 33vw, 100vw")}
          <span>${item[2]}</span>
        </button>`;
}

const featuredProjects = [projects[1], projects[9], projects[12], projects[5], projects[3], projects[8]];

const indexMain = `<main id="contenu">
    <section class="hero">
      <picture class="hero-media" data-provisoire>
        <source srcset="assets/img/theme/accueil-chantier-480.webp 480w, assets/img/theme/accueil-chantier-960.webp 960w, assets/img/theme/accueil-chantier-1600.webp 1600w" sizes="100vw" type="image/webp">
        <img src="assets/img/theme/accueil-chantier-960.webp" width="960" height="600" alt="Équipe de chantier lissant une dalle de béton" fetchpriority="high" data-provisoire>
      </picture>
      <div class="container hero-content d-flex flex-column justify-content-center">
        <p class="eyebrow text-white-50">Entreprise guinéenne créée le 03 novembre 2015</p>
        <h1 tabindex="0" data-hero-rotator>
          <span class="visually-hidden">Depuis 2015, ECCOTA-EPF construit en Guinée des écoles, des centres de santé, des ouvrages d'art, des aménagements hydro-agricoles et des bâtiments administratifs.</span>
          <span aria-hidden="true"><span class="hero-title-line">Depuis 2015,</span><span class="hero-title-line">ECCOTA-EPF construit en Guinée</span><span class="hero-rotator" data-hero-words="des écoles.|des centres de santé.|des ouvrages d'art.|des aménagements hydro-agricoles.|des bâtiments administratifs."><span data-hero-word>des écoles.</span></span></span>
        </h1>
        <p class="hero-lead mt-3">Bâtiments, ouvrages de génie civil, infrastructures sanitaires et scolaires. Treize marchés exécutés en Guinée depuis 2015.</p>
        <div class="hero-actions mt-4">
          <a class="btn btn-primary" href="index.html#contact">Présenter un projet</a>
          <a class="hero-text-link" href="index.html#domaines">Voir les domaines</a>
        </div>
      </div>
    </section>

    <aside class="direct-contact" aria-label="Contact direct ECCOTA-EPF">
      <div class="container">
        <div class="direct-contact-grid">
          <a class="direct-contact-item" href="tel:${contact.phoneHref}" aria-label="Appeler ECCOTA-EPF au ${contact.phone}"><span class="direct-contact-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2 2c1.6 3 3 4.4 6 6l2-2 5 2v3c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span><span><small>Téléphone</small><strong>${contact.phone}</strong></span></a>
          <a class="direct-contact-item" href="${contact.whatsappHref}" aria-label="Écrire à ECCOTA-EPF sur WhatsApp"><span class="direct-contact-icon">${whatsappGlyph}</span><span><small>WhatsApp</small><strong>${contact.whatsapp}</strong></span></a>
          <a class="direct-contact-item" href="mailto:${contact.email}" aria-label="Écrire à ECCOTA-EPF par e-mail" data-provisoire><span class="direct-contact-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span><small>E-mail</small><strong>${contact.email}</strong></span></a>
          <div class="direct-contact-item"><span class="direct-contact-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/></svg></span><span><small>Siège</small><strong>${contact.address}</strong></span></div>
        </div>
      </div>
    </aside>

    <aside class="hero-facts" aria-label="Repères ECCOTA-EPF">
      <div class="container"><div class="hero-proof">
        <div><strong>Création confirmée</strong>03 novembre 2015</div>
        <div><strong>Marchés exécutés</strong>13 marchés documentés</div>
        <div><strong>Attestations</strong>12 attestations de bonne fin</div>
        <div><strong>Préfectures</strong>8 préfectures d'intervention</div>
      </div></div>
    </aside>

    <section class="section" id="domaines">
      <div class="container">
        <div class="row g-4 align-items-end mb-4"><div class="col-lg-7"><p class="eyebrow">Domaines d'intervention</p><h2>Un socle BTP, élargi aux besoins concrets des projets.</h2></div><div class="col-lg-5"><p class="mb-0">Transport et construction d'ouvrages de génie civil et rural, ouvrages de franchissement, projets d'aménagements, construction de bâtiments, rénovations, équipement d'infrastructures sanitaires et scolaires, fournitures diverses.</p></div></div>
        <div class="row g-3 g-lg-4">${services.map((service, index) => `<div class="col-md-6 col-xl-3"><article class="service-tile"><span class="service-icon" aria-hidden="true">${domainIcons[index]}</span><h3 class="h5">${service[1]}</h3><p class="mb-0">${service[4]}</p></article></div>`).join("")}</div>
      </div>
    </section>

    <section class="section section-dark" id="realisations"><div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-8"><p class="eyebrow text-warning">Références</p><h2>13 marchés exécutés au sein de ministères, projets et programmes de la place en Guinée.</h2></div></div><div class="row g-4">${featuredProjects.map(homeProjectCard).join("\n")}</div><div class="mt-4 text-center"><a class="btn btn-primary" href="realisations/index.html">Voir les 13 réalisations</a></div></div></section>

    <section class="section" aria-labelledby="chiffres-titre"><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-5"><p class="eyebrow">Repères</p><h2 id="chiffres-titre">Une entreprise ancrée dans le tissu économique guinéen.</h2><p class="mb-0">À notre actif nous comptons plusieurs marchés déjà réalisés au sein des ministères, projets et programmes de la place en Guinée.</p></div><div class="col-lg-7"><div class="stats-grid"><div class="stat-item"><span class="stat-value">2015</span><span class="stat-label">Depuis 2015 — création le 03 novembre</span></div><div class="stat-item"><span class="stat-value">13</span><span class="stat-label">Marchés exécutés documentés</span></div><div class="stat-item"><span class="stat-value">12</span><span class="stat-label">Attestations de bonne fin</span></div><div class="stat-item"><span class="stat-value">8</span><span class="stat-label">Préfectures d'intervention</span></div></div></div></div></div></section>

    <section class="compliance-section" aria-labelledby="conformite-titre"><div class="container"><p class="eyebrow">Conformité administrative</p><div class="compliance-heading"><h2 id="conformite-titre">Des pièces administratives identifiées pour les dossiers de consultation.</h2></div><div class="compliance-grid"><div><span>RCCM</span><strong>RCCM/GC-KAL/061.926B/2015</strong></div><div><span>NIF</span><strong>776 678 906</strong></div><div><span>CNSS</span><strong>6141-1991-84100</strong></div><div><span>Attestations</span><strong>12 attestations de bonne fin</strong></div></div></div></section>

    <section class="section" id="partenaires" data-provisoire><div class="container"><div class="row g-4 mb-4"><div class="col-lg-7"><p class="eyebrow">Partenaires et donneurs d'ordre</p><h2>Des références de marché identifiées dans le dossier client.</h2></div><div class="col-lg-5"><p class="mb-0">ECCOTA-EPF travaille avec des acteurs publics, privés et institutionnels selon les exigences propres à chaque mission.</p></div></div><div class="partner-band" tabindex="0" aria-label="Références de marché" data-partner-marquee><div class="partner-track"><div class="partner-sequence">${partners.map((name) => `<div class="partner-item"><strong>${name}</strong>Référence de marché documentée.</div>`).join("")}</div><div class="partner-sequence" aria-hidden="true">${partners.map((name) => `<div class="partner-item"><strong>${name}</strong>Référence de marché documentée.</div>`).join("")}</div></div></div></div></section>

    <section class="section intervention-section" id="zone-intervention" aria-labelledby="zone-titre"><div class="container"><div class="row g-4 g-lg-5 align-items-center"><div class="col-lg-6"><p class="eyebrow">Zone d'intervention</p><h2 id="zone-titre">Huit préfectures documentées par les marchés exécutés.</h2><p>Les références transmises couvrent Conakry, Coyah, Kankan, Mandiana, Beyla, Tougué, Kindia et Télimélé.</p><div class="region-list" aria-label="Préfectures d'intervention"><div><strong>Conakry</strong><span>Matoto, Donka, Matam, Filamadina</span></div><div><strong>Coyah</strong><span>Bangouya, Kouriah, Gomboyah</span></div><div><strong>Kankan</strong><span>Gbérédou Baranama</span></div><div><strong>Beyla</strong><span>Gbèssoba, Sinko, Siriya</span></div><div><strong>Mandiana</strong><span>Koundian, Kièran, Loila, Koromandou</span></div><div><strong>Tougué</strong><span>N'douta</span></div><div><strong>Kindia</strong><span>Route Kindia-Télimélé</span></div><div><strong>Télimélé</strong><span>Route Kindia-Télimélé</span></div></div></div><div class="col-lg-6"><figure class="intervention-map">${guineaMap("carte")}<figcaption>Carte indicative · contour Natural Earth et préfectures localisées selon leurs coordonnées géographiques</figcaption></figure></div></div></div></section>

    <section class="section section-dark" id="contact"><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-7"><p class="eyebrow text-warning">Premier contact</p><h2>Préparer un dossier, vérifier une capacité, parler d'un chantier.</h2><p class="mb-0">Échangez directement avec ECCOTA-EPF pour présenter votre besoin, préciser le périmètre d'intervention et organiser une première rencontre.</p></div><div class="col-lg-5"><div class="contact-panel"><h3 class="h5">Coordonnées</h3><ul class="footer-list"><li>Siège : ${contact.address}</li><li><a href="tel:${contact.phoneHref}">${contact.phone}</a></li><li><a href="mailto:${contact.email}" data-provisoire>${contact.email}</a></li><li><a href="${contact.whatsappHref}">Écrire sur WhatsApp</a></li></ul><a class="btn btn-primary mt-4 w-100" href="mailto:${contact.email}" data-provisoire>Envoyer une demande</a></div></div></div></div></section>

  </main>`;

renderPage({
  file: "index.html",
  seo: {
    title: "ECCOTA-EPF - BTP, génie civil et infrastructures en Guinée",
    description: "ECCOTA-EPF intervient en BTP, génie civil, infrastructures sanitaires et scolaires, rénovation, fournitures, transport et aménagements en Guinée.",
    image: "assets/img/theme/accueil-chantier-1600.webp",
  },
  main: indexMain,
});

const aboutMain = `<main id="contenu">
    ${pageHeader("L'entreprise", "Entreprise de Commerce, Construction, Transport, Agriculture, Élevage, Pêche & Fournitures.", "Créée le 03 novembre 2015, ECCOTA-EPF est une entreprise individuelle dirigée par Youssouf Fila SIDIBE.")}
    <section class="section"><div class="container"><div class="row g-4 g-lg-5 align-items-center"><div class="col-lg-6"><p class="eyebrow">Identité et direction</p><h2>Une entreprise guinéenne créée le 03 novembre 2015.</h2><p>ECCOTA-EPF signifie Entreprise de Commerce, Construction, Transport, Agriculture, Élevage, Pêche & Fournitures.</p><p>Sa forme juridique est l'entreprise individuelle. La direction est assurée par <strong>Youssouf Fila SIDIBE</strong>, Directeur Général / Gérant.</p><p class="mb-0"><strong>Vision :</strong> « Investir pour le développement durable en Guinée et en Afrique de l'Ouest ».</p></div><div class="col-lg-6"><div class="media-frame">${picture("assets/img/theme/equipe-chantier", "Équipe technique réunie sur un chantier")}</div></div></div></div></section>
    <section class="section section-dark"><div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-7"><p class="eyebrow text-warning">Nos valeurs</p><h2>ECCOTA-EPF, un acronyme décliné par le client lui-même.</h2></div><div class="col-lg-5"><p class="mb-0">Ces valeurs sont issues du document de partenariat transmis par l'entreprise.</p></div></div><div class="value-grid acronym-grid">${values.map(([letter, value]) => `<article><span>${letter}</span><h3 class="h5">${value}</h3></article>`).join("")}</div></div></section>
    <section class="section" aria-labelledby="direction-titre"><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-5"><p class="eyebrow">Repères</p><h2 id="direction-titre">Des références documentées par période, lieu et pièce justificative.</h2></div><div class="col-lg-7"><p class="lead mb-0">ECCOTA-EPF compte plusieurs marchés déjà réalisés au sein des ministères, projets et programmes de la place en Guinée.</p></div></div><div class="stats-grid mt-5"><div class="stat-item"><span class="stat-value">2015</span><span class="stat-label">Depuis 2015 — création le 03 novembre</span></div><div class="stat-item"><span class="stat-value">13</span><span class="stat-label">Marchés exécutés documentés</span></div><div class="stat-item"><span class="stat-value">12</span><span class="stat-label">Attestations de bonne fin</span></div><div class="stat-item"><span class="stat-value">8</span><span class="stat-label">Préfectures d'intervention</span></div></div></div></section>
    <section class="section intervention-section" aria-labelledby="engagements-titre"><div class="container"><p class="eyebrow">Domaines et structuration</p><h2 id="engagements-titre">Une organisation orientée vers les travaux, fournitures, transport et aménagements.</h2><div class="engagement-grid mt-4"><article><span class="engagement-number">01</span><h3 class="h5">Direction</h3><p>Le document client mentionne une structuration autour de la Direction, CEMA, COEBEYLA, FENEG, GIE Simandou et COEKAN.</p></article><article><span class="engagement-number">02</span><h3 class="h5">Marchés publics et privés</h3><p>Les références transmises couvrent des maîtres d'ouvrage publics, projets, programmes et acteurs privés.</p></article><article><span class="engagement-number">03</span><h3 class="h5">Pièces justificatives</h3><p>Les marchés sont appuyés par des attestations de bonne fin, sauf le marché de transport documenté par une fiche des contrats.</p></article><article><span class="engagement-number">04</span><h3 class="h5">Territoire guinéen</h3><p>Les interventions documentées couvrent Conakry, Coyah, Kankan, Mandiana, Beyla, Tougué, Kindia et Télimélé.</p></article></div></div></section>
    <section class="cta-band"><div class="container d-lg-flex align-items-center justify-content-between gap-4"><div><p class="eyebrow mb-2">Échanger avec ECCOTA-EPF</p><h2 class="h3 mb-0">Présentez-nous votre prochain projet.</h2></div><a class="btn btn-primary mt-3 mt-lg-0" href="contact.html">Prendre contact</a></div></section>
  </main>`;

renderPage({
  file: "a-propos.html",
  seo: {
    title: "À propos - Identité et direction ECCOTA-EPF",
    description: "Découvrez l'identité d'ECCOTA-EPF, entreprise individuelle créée le 03 novembre 2015 et dirigée par Youssouf Fila SIDIBE.",
    breadcrumb: "À propos",
    image: "assets/img/theme/equipe-chantier-1600.webp",
  },
  main: aboutMain,
});

const servicesMain = `<main id="contenu">
    ${pageHeader("Domaines d'intervention", "Des compétences coordonnées autour des besoins du terrain.", "ECCOTA-EPF intervient dans les domaines formulés dans sa lettre de candidature : transport, construction, génie civil et rural, aménagements, bâtiments, rénovations, équipements et fournitures.", { base: "assets/img/theme/services-chantier", alt: "Équipe et engins mobilisés sur un chantier routier en Afrique de l'Ouest" })}
    <nav class="section-index" aria-label="Accès direct aux domaines"><div class="container">${services.map((service) => `<a href="#${service[0]}">${service[1]}</a>`).join("")}</div></nav>
    ${services.map((service, index) => `<section class="section service-detail${index % 2 ? " intervention-section" : ""}" id="${service[0]}"><div class="container"><div class="row g-4 g-lg-5 align-items-center"><div class="col-lg-6 ${index % 2 ? "order-lg-2" : ""}"><div class="media-frame">${picture(service[2], service[3])}</div></div><div class="col-lg-6 ${index % 2 ? "order-lg-1" : ""}"><p class="eyebrow">Domaine ${String(index + 1).padStart(2, "0")}</p><h2>${service[1]}</h2><p>${service[4]}</p><ul class="check-list">${service[5].map((item) => `<li>${item}</li>`).join("")}</ul><a class="btn btn-outline-primary mt-3" href="realisations/index.html?domaine=${service[0]}">Voir les réalisations</a></div></div></div></section>`).join("\n")}
    <section class="cta-band"><div class="container d-lg-flex align-items-center justify-content-between gap-4"><div><p class="eyebrow mb-2">Votre besoin</p><h2 class="h3 mb-0">Définissons ensemble le périmètre d'intervention.</h2></div><a class="btn btn-primary mt-3 mt-lg-0" href="contact.html">Présenter un projet</a></div></section>
  </main>`;

renderPage({
  file: "services.html",
  seo: {
    title: "Services et domaines d'intervention - ECCOTA-EPF",
    description: "BTP, génie civil et rural, infrastructures sanitaires et scolaires, rénovation, fournitures, transport et aménagements agropastoraux.",
    breadcrumb: "Services",
    image: "assets/img/theme/services-chantier-1600.webp",
    imageAlt: "Équipe et engins mobilisés sur un chantier routier en Afrique de l'Ouest",
  },
  main: servicesMain,
});

const partnersMain = `<main id="contenu">
    ${pageHeader("Partenaires", "Des références de marché identifiées dans le dossier ECCOTA-EPF.", "ECCOTA-EPF travaille avec des acteurs publics, privés et institutionnels selon les exigences propres à chaque mission.", { base: "assets/img/theme/partenaires-reunion-plans", alt: "Équipe d'ingénieurs réunie autour de plans de construction" })}
    <section class="section" data-provisoire><div class="container"><div class="row g-4 align-items-end mb-5"><div class="col-lg-7"><p class="eyebrow">Références mentionnées</p><h2>Donneurs d'ordre et organisations cités dans le dossier client.</h2></div><div class="col-lg-5"><p class="mb-0">La présentation reste volontairement sobre, en texte, pour garder une lecture institutionnelle.</p></div></div><div class="partner-groups">${partners.map((name) => `<section><span class="partner-type">Référence</span><h2 class="h4">${name}</h2><p>Référence de marché documentée.</p></section>`).join("")}</div></div></section>
    <section class="section section-dark"><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-7"><p class="eyebrow text-warning">Travailler ensemble</p><h2>Une coordination claire, du cadrage à la livraison.</h2><p class="mb-0">Chaque coopération commence par un périmètre défini, des interlocuteurs identifiés et un mode de suivi partagé.</p></div><div class="col-lg-5"><a class="btn btn-primary" href="contact.html">Échanger avec notre équipe</a></div></div></div></section>
  </main>`;

renderPage({
  file: "partenaires.html",
  seo: {
    title: "Partenaires et références - ECCOTA-EPF",
    description: "ECCOTA-EPF présente ses références de marché et ses coopérations avec des acteurs publics, privés et institutionnels.",
    breadcrumb: "Partenaires",
    image: "assets/img/theme/partenaires-reunion-plans-1600.webp",
    imageAlt: "Équipe d'ingénieurs réunie autour de plans de construction",
  },
  main: partnersMain,
});

const contactMap = `<figure class="contact-map">${guineaMap("contact-carte", false)}<figcaption>Siège à Conakry · interventions documentées en Guinée</figcaption></figure>`;

const contactMain = `<main id="contenu">
    ${pageHeader("Contact", "Parlons de votre projet et de ses contraintes de terrain.", "Téléphone, WhatsApp ou message détaillé : choisissez le canal le plus direct pour présenter votre besoin.", { base: "assets/img/theme/contact-conakry", alt: "Vue du littoral urbain et des bâtiments de Conakry" })}
    <section class="section"><div class="container"><div class="row g-4 g-lg-5"><div class="col-lg-5"><p class="eyebrow">Coordonnées</p><h2>Un échange direct avec ECCOTA-EPF.</h2><div class="contact-details"><a href="tel:${contact.phoneHref}"><strong>Téléphone principal</strong><span>${contact.phone}</span></a><a href="${contact.whatsappHref}"><strong>WhatsApp</strong><span>${contact.whatsapp}</span></a><a href="mailto:${contact.email}" data-provisoire><strong>E-mail</strong><span>${contact.email}</span></a><div><strong>Adresse</strong><span>${contact.address}</span></div></div>${contactMap}</div><div class="col-lg-7"><div class="contact-form-wrap"><p class="eyebrow">Votre demande</p><h2>Présentez le contexte, le lieu et le calendrier envisagé.</h2><form class="contact-form" action="mailto:${contact.email}" method="post" enctype="text/plain" data-contact-form data-provisoire><div class="row g-3"><div class="col-md-6"><label for="nom">Nom et prénom</label><input class="form-control" id="nom" name="nom" autocomplete="name" required><div class="invalid-feedback">Indiquez votre nom.</div></div><div class="col-md-6"><label for="email">Adresse e-mail</label><input class="form-control" type="email" id="email" name="email" autocomplete="email" placeholder="vous@exemple.com" required><div class="invalid-feedback">Saisissez une adresse e-mail valide.</div></div><div class="col-md-6"><label for="telephone">Téléphone</label><input class="form-control" type="tel" id="telephone" name="telephone" autocomplete="tel"></div><div class="col-md-6"><label for="sujet">Objet de la demande</label><input class="form-control" id="sujet" name="sujet" required><div class="invalid-feedback">Précisez l'objet de votre demande.</div></div><div class="col-12"><label for="message">Message</label><textarea class="form-control" id="message" name="message" rows="7" required></textarea><div class="invalid-feedback">Décrivez brièvement votre besoin.</div></div><div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" value="oui" id="accord" required><label class="form-check-label" for="accord">J'accepte que ces informations soient utilisées pour répondre à ma demande.</label><div class="invalid-feedback">Votre accord est nécessaire pour envoyer la demande.</div></div></div></div><div class="form-actions"><button class="btn btn-primary" type="submit">Préparer l'e-mail</button><a class="btn btn-outline-primary" href="${contact.whatsappHref}" data-whatsapp-fallback>Utiliser WhatsApp</a></div><p class="form-status" role="status" aria-live="polite" data-form-status></p></form></div></div></div></div></section>
    <section class="section intervention-section"><div class="container content-narrow"><p class="eyebrow">Questions fréquentes</p><h2>Préparer un premier échange utile.</h2><div class="faq-list mt-4"><details><summary>Dans quelles préfectures ECCOTA-EPF est-elle déjà intervenue ?</summary><p>Les références documentées couvrent Conakry, Coyah, Kankan, Mandiana, Beyla, Tougué, Kindia et Télimélé.</p></details><details><summary>Quels domaines sont couverts par les références ?</summary><p>Les marchés transmis couvrent les bâtiments et construction, le génie civil, les infrastructures sanitaires et scolaires, la rénovation et l'entretien, les fournitures diverses, le transport et les aménagements agropastoraux.</p></details><details><summary>Quelles pièces justificatives existent pour les réalisations ?</summary><p>Le document mentionne 12 attestations de bonne fin et une fiche des contrats pour le marché de transport.</p></details><details><summary>Comment envoyer une demande ?</summary><p>Vous pouvez appeler ECCOTA-EPF, écrire sur WhatsApp ou préparer un e-mail depuis le formulaire de contact.</p></details></div></div></section>
  </main>`;

renderPage({
  file: "contact.html",
  seo: {
    title: "Contact - ECCOTA-EPF à Matoto, Conakry",
    description: "Contactez ECCOTA-EPF à Sangoyah Mosquée, commune de Matoto, Conakry, par téléphone, WhatsApp ou e-mail.",
    breadcrumb: "Contact",
    image: "assets/img/theme/contact-conakry-1600.webp",
    imageAlt: "Vue du littoral urbain et des bâtiments de Conakry",
  },
  main: contactMain,
});

const legalMain = `<main id="contenu">
    ${pageHeader("Informations légales", "Mentions légales", "Informations relatives à l'édition, à l'utilisation et à la responsabilité du site ECCOTA-EPF.")}
    <section class="section"><div class="container content-narrow legal-content"><section><h2>Éditeur du site</h2><p>Le présent site est édité par ECCOTA-EPF, Entreprise de Commerce, Construction, Transport, Agriculture, Élevage, Pêche & Fournitures.</p><p>Forme juridique : entreprise individuelle<br>RCCM : RCCM/GC-KAL/061.926B/2015<br>NIF : 776 678 906<br>CNSS : 6141-1991-84100</p><p>Siège : ${contact.address}<br>E-mail : <a href="mailto:${contact.email}" data-provisoire>${contact.email}</a><br>Téléphone : <a href="tel:${contact.phoneHref}">${contact.phone}</a></p></section><section><h2>Direction de la publication</h2><p>La direction de la publication est assurée par Youssouf Fila SIDIBE, Directeur Général / Gérant.</p></section><section><h2>Conception et maintenance</h2><p>Le site est conçu et maintenu par GassTech Solutions pour le compte d'ECCOTA-EPF.</p></section><section><h2>Propriété intellectuelle</h2><p>Les textes, éléments graphiques, signes distinctifs et contenus propres à ECCOTA-EPF sont protégés. Toute reproduction ou réutilisation substantielle nécessite une autorisation préalable.</p></section><section><h2>Responsabilité</h2><p>ECCOTA-EPF veille à la clarté des informations publiées. Les caractéristiques d'une prestation ou d'un projet sont précisées dans les documents contractuels qui seuls définissent les engagements des parties.</p></section><section><h2>Contact</h2><p>Pour toute question relative au site, écrivez à <a href="mailto:${contact.email}" data-provisoire>${contact.email}</a>.</p></section></div></section>
  </main>`;

renderPage({
  file: "mentions-legales.html",
  seo: {
    title: "Mentions légales - ECCOTA-EPF",
    description: "Consultez les informations légales relatives au site internet ECCOTA-EPF : forme juridique, RCCM, NIF, CNSS et direction.",
    breadcrumb: "Mentions légales",
  },
  main: legalMain,
});

const privacyMain = `<main id="contenu">
    ${pageHeader("Données personnelles", "Politique de confidentialité", "Cette page explique les informations utilisées lorsque vous contactez ECCOTA-EPF depuis le site.")}
    <section class="section"><div class="container content-narrow legal-content"><section><h2>Informations concernées</h2><p>Le formulaire peut recueillir votre nom, votre adresse e-mail, votre téléphone, l'objet de votre demande et le message que vous choisissez d'envoyer.</p></section><section><h2>Finalité</h2><p>Ces informations servent uniquement à comprendre votre demande, vous répondre et assurer le suivi de l'échange commercial ou institutionnel engagé avec ECCOTA-EPF.</p></section><section><h2>Envoi par votre messagerie</h2><p>Dans cette version du site, le formulaire prépare un e-mail dans votre logiciel de messagerie. Les informations ne sont pas enregistrées par le site avant cet envoi.</p></section><section><h2>Durée de conservation</h2><p>Les échanges utiles au traitement d'une demande sont conservés pendant la durée nécessaire à son suivi, puis archivés ou supprimés selon leur nature et les obligations applicables.</p></section><section><h2>Destinataires</h2><p>Les messages sont destinés aux personnes habilitées au sein d'ECCOTA-EPF et, lorsque cela est nécessaire, aux prestataires intervenant dans le traitement de la demande.</p></section><section><h2>Services externes</h2><p>Le lien WhatsApp ouvre un service externe soumis à ses propres conditions d'utilisation et règles de confidentialité. Le site ECCOTA-EPF ne dépose aucun outil de suivi publicitaire.</p></section><section><h2>Vos demandes</h2><p>Pour demander l'accès, la correction ou la suppression d'informations transmises à ECCOTA-EPF, écrivez à <a href="mailto:${contact.email}" data-provisoire>${contact.email}</a>.</p></section></div></section>
  </main>`;

renderPage({
  file: "confidentialite.html",
  seo: {
    title: "Politique de confidentialité - ECCOTA-EPF",
    description: "Découvrez comment ECCOTA-EPF utilise les informations transmises depuis son site internet et son formulaire de contact.",
    breadcrumb: "Confidentialité",
  },
  main: privacyMain,
});

const counts = services.reduce((result, service) => {
  result[service[0]] = projects.filter((project) => project.domainKeys.includes(service[0])).length;
  return result;
}, {});
const filters = [["tous", "Toutes", projects.length], ...services.map((service) => [service[0], service[1], counts[service[0]] || 0])];
const listingMain = `<main id="contenu">
    ${pageHeader("Réalisations", "13 marchés exécutés, présentés par domaine, lieu et période.", "Chaque fiche reprend les informations issues du document client : période, lieu, description, domaine et pièce justificative.", { base: "../assets/img/theme/realisations-batiment-livre", alt: "Bâtiment achevé à la façade claire sous un ciel bleu à Accra" })}
    <section class="section"><div class="container"><div class="filter-bar" data-realisation-filters aria-label="Filtrer les réalisations">${filters.map((filter, index) => `<button type="button" class="filter-button" data-filter="${filter[0]}" aria-pressed="${index === 0 ? "true" : "false"}">${filter[1]} <span>${filter[2]}</span></button>`).join("")}</div><p class="filter-summary" aria-live="polite" data-filter-summary>${projects.length} réalisations affichées</p><div class="row g-4" data-project-grid>${projects.map((project) => projectCard(project)).join("\n")}</div><p class="filter-empty" data-filter-empty hidden>Aucune réalisation n'est publiée dans ce domaine. Consultez l'ensemble des projets ou contactez notre équipe.</p></div></section>
  </main>`;

renderPage({
  file: "realisations/index.html",
  seo: {
    title: "Réalisations - 13 marchés exécutés par ECCOTA-EPF",
    description: "Découvrez 13 marchés exécutés par ECCOTA-EPF en Guinée, avec périodes, lieux, domaines et pièces justificatives.",
    breadcrumb: "Réalisations",
    image: "assets/img/theme/realisations-batiment-livre-1600.webp",
    imageAlt: "Bâtiment achevé à la façade claire sous un ciel bleu à Accra",
  },
  main: listingMain,
});

function detailMain(project, nextProject) {
  const cover = `../assets/img/${project.image}`;
  const gallery = galleryItems(project);
  const firstGalleryBase = `../assets/img/${gallery[0][0]}`;
  const keyFigure = project.keyFigure ? `<div><dt>Chiffre clé</dt><dd>${project.keyFigure[0]}</dd></div>` : "";
  return `<main id="contenu">
    <nav class="breadcrumb-wrap" aria-label="Fil d'Ariane"><div class="container"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="../index.html">Accueil</a></li><li class="breadcrumb-item"><a href="index.html">Réalisations</a></li><li class="breadcrumb-item active" aria-current="page">${project.title}</li></ol></div></nav>
    <section class="project-page-header"><div class="container"><div class="row g-4 g-lg-5 align-items-end"><div class="col-lg-7"><p class="eyebrow text-warning">${project.domain}</p><h1>${project.title}</h1><p class="project-page-lead">${project.summary}</p></div><div class="col-lg-5"><div class="project-cover">${picture(cover, project.alt, "(min-width: 992px) 42vw, 100vw", true)}</div></div></div></div></section>
    <section class="project-facts-section"><div class="container"><dl class="project-facts"><div><dt>Domaine</dt><dd>${project.domain}</dd></div><div><dt>Localisation</dt><dd>${project.location}</dd></div><div><dt>Période</dt><dd>${project.period}</dd></div>${keyFigure}<div><dt>Pièce justificative</dt><dd>${project.proof}</dd></div></dl></div></section>
    <section class="section"><div class="container"><div class="row g-4 g-lg-5"><div class="col-lg-7"><p class="eyebrow">Le marché</p><h2>Une réalisation documentée par le dossier client.</h2><div class="project-description">${project.description.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div></div><div class="col-lg-5"><div class="scope-panel"><h2 class="h4">Périmètre d'intervention</h2><ul class="check-list">${project.scope.map((item) => `<li>${item}</li>`).join("")}</ul>${project.keyFigure ? `<p class="mt-3 mb-0"><strong>${project.keyFigure[0]}</strong><br>${project.keyFigure[1]}</p>` : ""}</div></div></div></div></section>
    <section class="section intervention-section" data-gallery><div class="container"><div class="row g-4 align-items-end mb-4"><div class="col-lg-7"><p class="eyebrow">Galerie</p><h2>Le chantier en images.</h2></div><div class="col-lg-5"><p class="mb-0" data-provisoire>Une lecture visuelle du domaine d'intervention, des moyens mobilisés et de l'environnement de chantier.</p></div></div><div class="gallery-grid">${gallery.map(galleryButton).join("")}</div></div><div class="modal fade gallery-modal" tabindex="-1" aria-labelledby="gallery-modal-title" aria-hidden="true" data-gallery-modal><div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h5" id="gallery-modal-title">Galerie — ${project.title}</h2><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer la galerie"></button></div><div class="modal-body"><figure><img src="${firstGalleryBase}-1600.webp" width="1600" height="1000" alt="${gallery[0][1]}" data-gallery-image data-provisoire><figcaption data-gallery-caption>${gallery[0][2]}</figcaption></figure><div class="gallery-controls"><button class="icon-button" type="button" aria-label="Photographie précédente" title="Photographie précédente" data-gallery-prev><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span data-gallery-position>1 / ${gallery.length}</span><button class="icon-button" type="button" aria-label="Photographie suivante" title="Photographie suivante" data-gallery-next><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div></div></div></div></section>
    <section class="next-project"><div class="container"><p class="eyebrow">Projet suivant</p><a href="${nextProject.slug}.html"><span>${nextProject.domain}</span><strong>${nextProject.title}</strong></a></div></section>
  </main>`;
}

projects.forEach((project, index) => {
  const nextProject = projects[(index + 1) % projects.length];
  renderPage({
    file: `realisations/${project.slug}.html`,
    seo: {
      title: `${project.shortTitle} - ${project.city} - ECCOTA-EPF`,
      description: `${project.summary} Période : ${project.period}. Lieu : ${project.location}.`,
      breadcrumb: project.shortTitle,
      image: `assets/img/${project.image}-1600.webp`,
      imageAlt: project.alt,
    },
    main: detailMain(project, nextProject),
    project,
  });
});

const notFoundMain = `<main id="contenu" class="error-page section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <p class="eyebrow">Erreur 404</p>
          <h1>La page demandée est introuvable.</h1>
          <p class="lead mt-3">L'adresse saisie contient peut-être une erreur ou le lien consulté n'est plus disponible. Vous pouvez revenir à l'accueil pour poursuivre votre visite.</p>
          <a class="btn btn-primary mt-3" href="index.html">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  </main>`;

renderPage({
  file: "404.html",
  seo: {
    title: "Page introuvable - ECCOTA-EPF",
    description: "La page demandée est introuvable. Retournez à l'accueil du site ECCOTA-EPF.",
    breadcrumb: "Page introuvable",
    image: "assets/img/theme/accueil-chantier-1600.webp",
    imageAlt: "Page introuvable",
  },
  main: notFoundMain,
});

for (const entry of fs.readdirSync(path.join(root, "realisations"))) {
  if (!entry.endsWith(".html") || entry === "index.html") continue;
  if (!projects.some((project) => `${project.slug}.html` === entry)) {
    fs.unlinkSync(path.join(root, "realisations", entry));
    console.log(`supprimé : realisations/${entry}`);
  }
}

console.log(`sitemap.xml généré : ${generateSitemap()} URL(s)`);
