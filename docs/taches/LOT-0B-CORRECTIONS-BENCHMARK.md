# Tâche — Lot 0B : corrections du lot 0 et apports du benchmark

Références : `docs/design-ux/BENCHMARK_COUGNAUD_DET.md`, `ARCHITECTURE.md` section 4.
Dépend de : lot 0 terminé. **À faire avant le lot 1.**

## Objectif

Corriger deux défauts du lot 0 et intégrer les apports P0 du benchmark, **sur l'accueil et le
404 uniquement**.

L'ordre compte : l'en-tête et le pied de page vont être recopiés sur 9 pages au lot 1. Toute
correction faite après coûtera dix fois plus cher, et le lot 4 exige qu'ils soient identiques
au caractère près.

## Périmètre inclus

### A. Accentuation du contenu publié — **priorité absolue**

1. Réécrire **tout le texte visible** en français correct et accentué : « génie civil »,
   « maîtres d'ouvrage », « Guinée », « Création confirmée », « Références », « exécution »,
   « rénovation », « bâtiments », « aménagements », etc.
2. Corriger également `title`, `meta description`, `alt`, `aria-label` et le contenu du
   `404.html`.
3. Vérifier que le `<meta charset="utf-8">` est bien présent et que les fichiers sont
   enregistrés en UTF-8 sans BOM.
4. **Restent sans accent** : slugs d'URL, noms de fichiers, identifiants HTML, noms de classes
   CSS, clés JavaScript. Ne pas y toucher.

La convention sans accent du template GassTech vise les documents internes, pas le texte lu
par le visiteur. Sur un site institutionnel français, l'absence d'accents se lit comme un
travail bâclé.

### B. Réécriture des textes qui parlent du projet

5. Remplacer tout titre ou paragraphe qui commente l'avancement du projet par un texte client
   **plausible**, marqué `data-provisoire` et listé dans `CONTENUS_PROVISOIRES.md`.
   À supprimer notamment :
   - « Trois emplacements pour montrer le niveau d'exécution attendu. »
   - « Un langage institutionnel, prêt pour les références validées. »
   - « Des indicateurs sans chiffre inventé. »
   - « … en attendant les fiches de services détaillées du lot 1. »
6. **Aucune mention de provisoire visible par le visiteur.** Ni « Photo d'illustration », ni
   « À compléter », ni « ces exemples ne sont pas des marchés ECCOTA-EPF ». Le suivi passe par
   l'attribut `data-provisoire`, qui ne produit aucun rendu, et par
   `CONTENUS_PROVISOIRES.md`, qui est un document interne. Un bloc sans contenu réel n'est
   pas affiché du tout — voir `ARCHITECTURE.md` section 6, « vide = masqué ».

Un contenu provisoire est un texte client plausible marqué dans le code — jamais un
commentaire sur notre plan de travail. Le client va regarder cette page.

### C. Apports P0 du benchmark

7. **Bandeau de contact direct** en pleine largeur, juste sous le hero : téléphone cliquable
   (`tel:`), WhatsApp, horaires, ville. Plus le numéro dans l'en-tête à partir de `lg`.
   Valeurs provisoires marquées, en attendant la question ouverte n° 7.
8. **Métadonnées sur les cartes de réalisation** : `domaine · localisation · année`, plus un
   emplacement pour un chiffre clé (surface, linéaire, capacité, durée). Structure HTML prévue
   pour les champs `chiffre_cle` et `temoignage*` ajoutés à `MODELE_DONNEES.md`.
9. **Section zone d'intervention** : régions de Guinée couvertes, avec les villes où des
   chantiers ont été exécutés. Liste et carte statique, pas de carte interactive. Contenu
   provisoire en attendant la question ouverte n° 11.
10. **Bande conformité administrative** en bas de page : RCCM, NIF, attestations fiscales et
    sociales, agréments. Valeurs `[À COMPLÉTER]` marquées provisoires. C'est le premier filtre
    d'un marché public guinéen — l'emplacement doit exister dès maintenant.
11. **Pied de page à 4 colonnes** : domaines, réalisations, entreprise et informations
    légales, contact et coordonnées administratives.

## Périmètre exclu

- toute autre page que `index.html` et `404.html` — c'est le lot 1 ;
- les apports P1 du benchmark : témoignages affichés, chiffres clés renseignés, section
  engagements, FAQ — ils dépendent de contenus client, et arrivent au lot 1 ou au lot 2 ;
- tout changement de palette, de typographie ou de direction visuelle : le lot 0 est validé
  sur ce plan ;
- l'ajout de toute bibliothèque.

## Contraintes

- Ne pas retoucher la palette ni les polices. La direction visuelle du lot 0 est retenue.
- Ne pas ajouter de carrousel, de compteur animé ni de formulaire newsletter : explicitement
  refusés dans le benchmark, section P2.
- Chaque nouveau contenu provisoire est ajouté à `CONTENUS_PROVISOIRES.md` et porte
  `data-provisoire`.
- L'en-tête et le pied de page produits ici sont ceux que le lot 1 recopiera : les figer
  proprement.

## Critères d'acceptation

1. **Aucun mot français mal accentué dans le texte visible** de `index.html` et `404.html`.
2. Aucun titre ni paragraphe ne mentionne un lot, un emplacement, une maquette ou l'état
   d'avancement du projet.
3. Le bandeau de contact affiche un téléphone cliquable et un lien WhatsApp fonctionnels sur
   mobile.
4. Les cartes de réalisation affichent domaine, localisation et année.
5. Les sections zone d'intervention et conformité administrative existent, avec leurs
   contenus marqués provisoires.
6. Le pied de page compte 4 colonnes et reste identique sur les deux pages.
7. Aucune régression : `verifier-liens.js` passe, aucun débordement à 320 px, aucune requête
   externe, poids toujours sous 250 Ko hors images.

## Vérification attendue

```bash
node scripts/verifier-liens.js
node --check assets/js/main.js

# Le texte visible est accentué
python3 - <<'EOF'
import re
for f in ("index.html","404.html"):
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", open(f,encoding="utf-8").read(), flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    print(f, "accents:", len(re.findall(r"[éèêàâîôûùç]", t, re.I)))
EOF
# attendu : plusieurs dizaines sur index.html, pas 0

# Aucun mot suspect resté sans accent — sur le TEXTE PUBLIÉ uniquement.
# Un grep sur le fichier entier déclenche de faux positifs sur les slugs et les ids.
# Voir la version complète du contrôle dans LOT-1-PAGES-PUBLIQUES.md.

# Aucun texte parlant du projet
grep -niE "lot [0-9]|emplacement|maquette|provisoirement affiche|en attendant" index.html \
  | grep -v "data-provisoire" && echo "A RELIRE" || echo OK

# Contact direct fonctionnel
grep -c 'href="tel:' index.html
grep -c 'wa.me\|api.whatsapp' index.html

# Provisoires tous déclarés
grep -c "data-provisoire" index.html
grep -c "^|" docs/design-ux/CONTENUS_PROVISOIRES.md

# Aucune régression
python3 -m http.server 4173 & sleep 1
curl -s http://localhost:4173/index.html | wc -c
```

Et manuellement : rendu à 320, 768 et 1440 px, appel du lien `tel:` depuis un téléphone,
ouverture du lien WhatsApp.

## Rapport de fin attendu

Comme `AGENTS.md`. Joindre les nouvelles captures aux trois largeurs, et confirmer que
l'en-tête et le pied de page sont figés pour le lot 1.
