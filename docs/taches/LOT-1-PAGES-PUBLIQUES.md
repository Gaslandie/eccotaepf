# Tâche — Lot 1 : les pages publiques

Références : `ARCHITECTURE.md` section 5, `MODELE_DONNEES.md` pour les champs attendus.
Dépend de : lots 0 et **0B** terminés, en-tête et pied de page figés.

## Objectif

Construire les 8 pages restantes sur le socle du lot 0, avec des contenus de démonstration
crédibles. À la fin de ce lot, le site est complet et navigable de bout en bout.

## Périmètre inclus

1. **`a-propos.html`** : historique depuis le 03/11/2015, vision, valeurs, direction, chiffres
   clés. Prévoir la place d'une photo de l'équipe ou du siège.
2. **`services.html`** : les **7 domaines** du cahier des charges — BTP et construction,
   ouvrages de génie civil, rénovation et entretien, fournitures diverses, transport,
   agriculture et élevage, prestations diverses. Une section par domaine, avec ancre, image,
   description et lien vers les réalisations du domaine.
3. **`realisations/index.html`** : grille de cartes, **filtre par domaine** avec compteurs.
   Filtre en JavaScript sur `data-domaine` ; sans JavaScript, tout reste visible.
4. **6 pages de réalisation** `realisations/<slug>.html` : titre, domaine, localisation,
   période, description, galerie photo, fil d'Ariane, lien vers la réalisation suivante.
   Les champs sont ceux de `MODELE_DONNEES.md`, table `realisations` — c'est ce qui rendra la
   bascule de la phase 2 mécanique.
5. **`partenaires.html`** : partenaires par type (institution, entreprise, projet, organisme).
   **Aucun logo réel tant que l'autorisation n'est pas écrite** : affichage en texte, mise en
   page prévue pour accueillir les logos plus tard.
6. **`contact.html`** : coordonnées, horaires, WhatsApp, carte, formulaire.
7. **`mentions-legales.html`** et **`confidentialite.html`** : structure complète, valeurs
   légales marquées `[À COMPLÉTER]`.
8. **Galerie photo** en `modal` Bootstrap : ouverture au clic, navigation au clavier, fermeture
   par Échap, focus rendu à l'élément d'origine.
9. **Formulaire de contact** en `mailto:` avec repli WhatsApp : validation JavaScript, messages
   d'erreur au bon champ, valeurs conservées, état d'envoi visible. Le traitement serveur est
   le lot 6.
10. **États prévus** : filtre sans résultat, galerie vide, page introuvable. Une rubrique sans
    contenu affiche un message, jamais une grille vide.
11. Composants factorisés dans `styles.css` dès qu'un bloc se répète plus de trois fois.

### Apports P1 du benchmark

Référence : `docs/design-ux/BENCHMARK_COUGNAUD_DET.md`.

12. **Section méthode et engagements** sur `a-propos.html` : quatre engagements — sécurité sur
    chantier, respect des délais, conformité aux cahiers des charges, suivi et entretien après
    livraison. Quatre blocs illustrés, sur le modèle des piliers de Cougnaud. N'exige aucune
    donnée client.
13. **FAQ courte** sur `contact.html` : quatre questions réelles d'un donneur d'ordre — régions
    d'intervention, taille de marché portable, documents administratifs fournis, délais
    habituels. Balisage `<details>`, sans JavaScript.
14. **Six réalisations** au lieu de trois sur l'accueil, avec le lien « Voir toutes nos
    réalisations ».
15. **Bloc témoignage** sur les pages de réalisation : citation, nom, fonction et organisme.
    Structure prête pour les champs `temoignage*` de `MODELE_DONNEES.md`. **Facultatif** : une
    réalisation sans citation s'affiche normalement, sans encadré vide.
16. **Chiffres clés** sur l'accueil : quatre chiffres, uniquement s'ils sont confirmés par le
    client. **Compteurs non animés** — DET affiche « 0+ » quand le script ne part pas, ce qui
    est pire que pas de chiffre.

## Périmètre exclu

- métadonnées fines, JSON-LD, sitemap — lot 2 ;
- publication — lot 3 ;
- traitement serveur du formulaire — lot 6.

## Contraintes

- **Tout le texte visible est en français accentué.** Slugs, noms de fichiers et identifiants
  restent sans accent.
- **Aucun texte ne commente l'avancement du projet.** Un contenu provisoire est un texte client
  plausible marqué `data-provisoire`, pas une note de production.
- **Mode recette.** Les marqueurs de contenu manquant sont affichés uniquement quand `<body>`
  porte `data-mode="recette"`, et sont produits par le CSS ou un gabarit conditionnel à partir
  de `data-provisoire` — **jamais écrits en dur dans le contenu**. Sans l'attribut, la règle
  « vide = masqué » s'applique : le bloc n'est pas rendu. Voir `ARCHITECTURE.md` section 6.
- **En-tête et pied de page identiques sur toutes les pages, à une exception près :
  l'indication de la page courante.** L'entrée de menu correspondant à la page affichée porte
  `aria-current="page"` et sa classe d'état ; toutes les autres ne les portent pas. C'est la
  seule divergence autorisée, et elle est obligatoire — sans elle, le visiteur ne sait pas où
  il est, et un lecteur d'écran annonce la mauvaise page.
  Le contrôle d'empreinte doit donc **neutraliser ces deux marqueurs** avant de comparer.
  Toute autre divergence se paiera au lot 4, quand l'en-tête sera extrait en gabarit.
- Depuis `realisations/`, les ressources sont en `../assets/…`.
- Un `<h1>` unique par page.
- Toute image passe par `SOURCES_IMAGES.md` et `CONTENUS_PROVISOIRES.md`.
- Les slugs de réalisation sont définitifs : minuscules, sans accent, avec tirets.

## Critères d'acceptation

1. Les 10 pages s'affichent et sont atteignables depuis le menu et le pied de page.
2. `scripts/verifier-liens.js` ne signale aucun lien cassé, y compris depuis `realisations/`.
3. JavaScript désactivé : toutes les réalisations restent visibles, la navigation fonctionne,
   le formulaire reste soumissible en `mailto:`.
4. Le filtre affiche les bons compteurs et un message quand aucun résultat ne correspond.
5. La galerie s'ouvre et se ferme entièrement au clavier.
6. Aucun débordement horizontal à 320 px, sur aucune des 10 pages.
7. **Le pied de page est identique au caractère près sur les 10 pages, et l'en-tête l'est une
   fois l'état actif neutralisé.** Sur chaque page, `aria-current="page"` désigne l'entrée de
   cette page — jamais celle d'une autre.
8. Aucun mot français mal accentué dans le texte visible des 10 pages.
9. Aucun titre ni paragraphe ne mentionne un lot, un emplacement ou une maquette.
10. Les cartes de réalisation affichent domaine, localisation et année.
11. Sans `data-mode`, aucun marqueur n'apparaît sur les 10 pages et aucun bloc n'est affiché
    vide. Avec `data-mode="recette"`, chaque contenu manquant est signalé à son emplacement.
12. Aucun marqueur écrit en dur dans le contenu : basculer l'attribut suffit à tout allumer
    ou tout éteindre.

## Vérification attendue

```bash
node scripts/verifier-liens.js

# En-tête et pied de page : une seule empreinte, état actif neutralisé,
# et l'entrée active désigne bien la page courante.
python3 - <<'EOF'
import re, glob, hashlib
def emp(raw, pat, neutraliser=False):
    s = re.sub(r"\.\./", "", re.search(pat, raw, re.S).group(0))
    if neutraliser:
        s = re.sub(r'\s*aria-current="page"', "", s)
        s = re.sub(r"\s*\bis-active\b", "", s)
    return hashlib.md5(re.sub(r"\s+", " ", s).encode()).hexdigest()[:8]

files = sorted(glob.glob("*.html") + glob.glob("realisations/*.html"))
for nom, pat, n in (("pied de page", r"<footer.*?</footer>", False),
                    ("en-tête", r"<header.*?</header>", True)):
    g = {emp(open(f, encoding="utf-8").read(), pat, n) for f in files}
    print(nom, ":", len(g), "empreinte(s)", "OK" if len(g) == 1 else "ECHEC")

for f in files:
    raw = open(f, encoding="utf-8").read()
    actifs = re.findall(r'<a[^>]*aria-current="page"[^>]*>([^<]*)', raw)
    print(f, "-> actif :", set(a.strip() for a in actifs) or "AUCUN")
EOF
# attendu : 1 empreinte pour chacun, et une entrée active DIFFÉRENTE par page

# Un seul h1 par page
for f in $(find . -name "*.html" -not -path "./docs/*"); do
  echo -n "$f "; grep -c "<h1" "$f"
done                       # attendu : 1 partout

# Aucun chemin absolu
grep -rnE '(href|src)="/' *.html realisations/ && echo ECHEC || echo OK

# Tous les alt renseignés
grep -rn "<img" *.html realisations/ | grep -v 'alt="' && echo ECHEC || echo OK

# Accents : contrôle limité au TEXTE PUBLIÉ et aux attributs lisibles.
# Un grep sur le fichier entier déclenche de faux positifs sur les slugs, ids,
# classes et chemins, qui doivent rester sans accent.
python3 - <<'EOF'
import re, glob
mots = r"\b(genie|guinee|creee?|references?|realisations?|execution|renovation|batiments?|amenagements?|maitres?|prives?|societe|activites?|qualite|annee|periode|apres|reserve)\b"
for f in sorted(glob.glob("*.html") + glob.glob("realisations/*.html")):
    raw = open(f, encoding="utf-8").read()
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", raw, flags=re.S)
    attrs = " ".join(re.findall(r'(?:alt|aria-label|title|content|placeholder)="([^"]*)"', t))
    corpus = re.sub(r"<[^>]+>", " ", t) + " " + attrs
    susp = sorted({m.lower() for m in re.findall(mots, corpus, re.I)})
    print(f, "| accents:", len(re.findall(r"[éèêàâîôûùç]", corpus, re.I)),
             "| suspects:", susp or "aucun")
EOF
# attendu : des accents partout, "aucun" suspect sur chaque page

# Aucun marqueur écrit en dur dans le contenu : l'interrupteur doit tout piloter
grep -rniE ">[^<]*(photo d.illustration|à complèt|emplacement réservé|à fournir)" \
  *.html realisations/ && echo "ECHEC : marqueur en dur" || echo OK

# Les deux modes rendent bien deux résultats différents
grep -c 'data-mode="recette"' *.html realisations/*.html | head

# Aucun texte parlant du projet
grep -rniE "lot [0-9]|emplacement reserve|maquette|en attendant" *.html realisations/ \
  && echo "A RELIRE" || echo OK
```

## Rapport de fin attendu

Comme `AGENTS.md`. Joindre des captures mobile et bureau des 10 pages, et la liste des
contenus client encore manquants.
