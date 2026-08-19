# ADR-002 — Bootstrap et livraison statique en phase 1

## Statut

Accepté — 2026-08-19. **Modifie ADR-001**, ne l'annule pas : la pile PHP/MySQL reste la
cible pour l'espace d'administration, elle est décalée en phase 2.

## Contexte

Demande du 2026-08-19 : construire le site avec Bootstrap plutôt qu'en PHP, et utiliser des
images libres trouvées en ligne en attendant les photos réelles d'ECCOTA-EPF.

Deux constats à poser avant de décider.

**Bootstrap ne remplace pas PHP.** Bootstrap est une bibliothèque CSS et JavaScript qui
s'exécute dans le navigateur ; PHP produit les pages côté serveur. Les deux cohabitent sans
difficulté. La vraie question posée est donc : *écrit-on des pages HTML statiques ou des
pages générées ?*

**L'espace d'administration est au devis.** Le cahier des charges le détaille sur une
demi-page et il est facturé. Un site purement statique ne peut ni authentifier, ni écrire en
base, ni recevoir un envoi de photo. Le livrer sans administration serait une livraison
incomplète, pas un choix technique.

## Décision

**Phase 1 — site statique HTML + Bootstrap 5.3.** Toutes les pages publiques, le design
complet, les contenus et images provisoires. Publié sur GitHub Pages pour la validation
client.

**Phase 2 — bascule PHP.** Le HTML produit en phase 1 est découpé en gabarits, les contenus
passent en base MySQL, l'espace d'administration et le formulaire serveur sont développés.
Sur hébergement mutualisé cPanel, comme prévu par ADR-001.

**Le rendu visuel ne change pas entre les deux phases.** La phase 2 déplace du code, elle ne
refait pas le design.

Bootstrap est **copié dans le dépôt** (`assets/vendor/bootstrap/`), pas appelé depuis un CDN
et pas installé par npm. La règle « aucune dépendance » du socle GassTech vise les chaînes
d'outils et les gestionnaires de paquets ; deux fichiers versionnés dans le dépôt ne créent
aucune de ces contraintes, et suppriment la dépendance à un serveur tiers en production.

## Conséquences

**Gains**

- Le client voit le site en ligne en quelques jours, sur un lien GitHub Pages gratuit.
  L'achat de l'hébergement n'est plus un préalable — c'était le point bloquant d'ADR-001.
- La grille, les composants et les utilitaires de Bootstrap font gagner plusieurs jours sur
  le responsive, l'accessibilité de base et les états de formulaire.
- Le risque est reporté sur la partie la moins risquée : si le planning dérape, ce qui manque
  est l'administration, pas le site.

**Coûts**

- Le HTML sera écrit deux fois pour partie : une fois en pages complètes, une fois découpé
  en gabarits. Le lot de bascule est conçu pour que ce soit mécanique, avec un test de
  non-régression HTML — méthode déjà éprouvée sur `Groupe-babia`.
- Bootstrap pèse environ 30 Ko compressés en CSS. Acceptable, à condition de ne pas y ajouter
  de bibliothèque supplémentaire.
- **Risque d'apparence générique.** Un Bootstrap non personnalisé se reconnaît immédiatement
  et dévalorise le site d'une entreprise qui vend sa solidité. Traité par les règles de
  personnalisation de `ARCHITECTURE.md` section 4, qui ne sont pas des préférences.

**Risques**

- L'espace d'administration peut être perçu comme acquis alors qu'il n'est pas commencé. Il
  doit rester explicitement au planning et au suivi client.
- Des images ou des contenus provisoires peuvent partir en production. Traité par
  `docs/design-ux/CONTENUS_PROVISOIRES.md` et par un contrôle bloquant avant mise en ligne.

**Alternative refusée**

- **Statique seul, sans administration** : moins cher et plus rapide, mais ne livre pas la
  prestation vendue et retire au client l'autonomie qui est l'objectif n° 7 du cahier des
  charges. Le client rappellerait GassTech à chaque nouveau chantier.
