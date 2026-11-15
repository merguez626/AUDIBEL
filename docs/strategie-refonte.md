# AUDIOBEL — Stratégie de refonte

*Novembre 2026 · base : version en ligne sur audibel.netlify.app (branche `main`)*

## 1. Le constat

### Ce que l'ancien site fait bien
- Un positionnement clair et différenciant : **indépendant, 6 marques, sans pression commerciale**.
- Un contenu riche et pédagogique : signes, échelle en dB, 3 types d'appareils, bilan en 6 étapes, INAMI.
- Une identité cohérente : bordeaux, photos chaleureuses (lin, bois, mur bordeaux).

### Ce qui freine la conversion
| Problème | Impact |
|---|---|
| **Le seul moyen de contact est le téléphone** (`tel:`) | Sur ordinateur le lien ne fait rien. Le soir, le week-end ou pour un enfant qui cherche pour son parent au bureau, la visite est perdue. |
| 8 entrées de menu, contenus redondants (les 3 types d'appareils apparaissent sur 3 pages ; Solutions et Appareils se recoupent) | Le visiteur ne sait pas par où commencer. |
| Le site parle de « transparence » mais n'affiche **aucun repère de prix** | C'est la première question des patients, et la faiblesse n°1 des chaînes (voir §2). |
| Éléments qui affaiblissent la confiance : avis sans source, page « À propos » pleine de blocs « Bientôt », liens légaux en `#`, aucune photo ni aucun nom de l'équipe | Pour un achat de santé à plusieurs milliers d'euros, la confiance est décisive. |
| Images PNG de 1 à 2,5 Mo chacune (~30 Mo au total) | Chargement lent sur mobile, mauvais pour le référencement Google. |
| Texte de 17 px, typo Sora (géométrique, « tech ») | Moins confortable pour un public de 60–85 ans. |
| Rien pour les **patients déjà appareillés** (réglage, entretien, renouvellement) | Le renouvellement tous les 5 ans est une part majeure du chiffre d'affaires. |

## 2. La concurrence

**Chaînes (Lapperre, Amplifon, VivaSon…)**
- Lapperre met en avant : prise de RDV en ligne, test auditif en ligne gratuit, recherche de centre, numéro 0800, « journées de tests gratuits », titre « Meilleure chaîne de magasins », 77 ans d'ancienneté. Aucun prix affiché. Avis : un simple lien Trustpilot.
- Leurs points forts : outils en ligne, notoriété, maillage.
- Leurs points faibles, rapportés par la presse (RTBF) : **opacité des prix**, marges estimées à 50–60 % en Belgique contre ~25 % en France, poussée vers le haut de gamme, modèles d'entrée de gamme absents. Des Belges vont jusqu'à acheter en France.

**Indépendants à Liège** : peu visibles en ligne, peu ou pas d'outils numériques.

**→ L'opportunité d'AUDIOBEL** : offrir le confort numérique d'une chaîne (RDV en ligne, auto-test, infos remboursement claires) **avec** ce qu'une chaîne ne peut pas promettre : indépendance, transparence, temps passé et même interlocuteur dans la durée.

## 3. Le positionnement

> **« Le centre auditif indépendant de Liège qui vous explique tout, sans vous pousser à rien. »**

Trois piliers, répétés partout :
1. **Indépendant** : 6 marques comparées, aucun quota.
2. **Transparent** : prix, INAMI, mutualité et reste à charge expliqués avant toute décision.
3. **Présent** : suivi, réglages et entretien inclus tant que vous portez vos appareils.

## 4. Les publics et leurs parcours

| Profil | Ce qu'il cherche | Ce que le site lui propose |
|---|---|---|
| **Senior qui doute** (60–85 ans) | « Est-ce que j'entends mal ? Est-ce que ça va coûter cher ? » | Auto-évaluation des 6 signes, texte grand et lisible (bouton A+), téléphone toujours visible |
| **Enfant aidant** (35–60 ans), souvent celui qui cherche en ligne | Trouver un centre sérieux pour un parent, réserver à sa place | Tuile « J'accompagne un proche », formulaire « pour un proche » |
| **Personne qui compare / s'informe sur le prix** | Montants INAMI, reste à charge | Bloc remboursement dès l'accueil, page prix (simulateur à venir) |
| **Patient déjà appareillé** | Réglage, entretien, panne, renouvellement | Tuile « Je suis déjà appareillé » → RDV de suivi |

## 5. Ce qui est fait (branche `refonte`)

- **Nouveau design system** (`assets/css/site.css`) : bordeaux d'origine conservé, neutres réchauffés « lin » accordés aux photos, titres en Fraunces (serif chaleureux), texte en **Atkinson Hyperlegible Next** (police conçue pour les personnes malvoyantes), corps de texte en 18 px, boutons de 52–60 px de haut.
- **Nouvelle page d'accueil** : hero, bandeau chiffres, aiguillage par situation, engagements, **auto-évaluation interactive des 6 signes**, parcours en 5 étapes, 3 types d'appareils (photo produit puis photo portée au survol), bloc INAMI, avis, venir au centre (horaires, jour en cours mis en évidence), FAQ, appel à l'action final.
- **Prise de rendez-vous en ligne** (`rendez-vous.html` + `merci.html`) : motif, pour moi ou pour un proche, créneau préféré, coordonnées. Fonctionne avec **Netlify Forms** (aucun serveur à gérer), avec anti-spam par champ piège.
- **Accessibilité et confort** : bouton de taille du texte A / A+ (mémorisé), statut « Ouvert / Fermé » en direct (heure de Bruxelles), barre d'action fixe sur mobile (Appeler / Rendez-vous), navigation au clavier, mouvements réduits respectés.
- **Performance** : versions WebP de toutes les images, de ~30 Mo à ~1,3 Mo (−95 %). Les PNG d'origine sont conservés.
- **Référencement local** : données structurées enrichies (horaires, type MedicalBusiness), Open Graph, titres et descriptions revus.
- **Navigation resserrée à 6 entrées** : Votre audition · Appareils · Bilan & suivi · Prix & remboursement · Le centre · Contact.

## 6. Étape 2 — Pages intérieures et pages légales (faites)

| Page | Contenu |
|---|---|
| Votre audition | Les 6 signes en auto-évaluation interactive, échelle des dB, quand consulter, **acouphènes**, **aider un proche** |
| Appareils | Ancienne page Appareils **et** ancienne page Solutions fusionnées : 3 types, comment choisir, 6 marques, Bluetooth, rechargeable. `solutions.html` redirige vers `appareils.html` (fichier `_redirects`) |
| Bilan & suivi | Méthode, 6 étapes avec frise de durée, ce qui nous distingue, **section « Déjà patient »** |
| Prix & remboursement | **Simulateur INAMI** (âge, 1 ou 2 oreilles), conditions, tableau, procédure, FAQ (balisée pour Google) |
| Le centre | Manifeste, 3 principes, frise 2012 → aujourd'hui, bénéfices. Blocs « Bientôt » retirés |
| Contact | Infos pratiques, horaires du jour en évidence, **carte Google chargée seulement au clic** (pas de cookies Google sans action du visiteur) |
| Mentions légales, Confidentialité, Cookies | Rédigées pour la Belgique (Code de droit économique, RGPD, APD). Les informations manquantes sont surlignées en jaune |
| 404 | Page d'erreur avec liens utiles |

### Comment modifier l'en-tête ou le pied de page
L'en-tête et le pied de page sont communs à toutes les pages. Ils se trouvent dans `partials/header.html` et `partials/footer.html`. Après une modification :

```bash
python tools/build_partials.py
```

Le script met à jour toutes les pages (et marque le lien de la page courante dans le menu). Le site reste 100 % statique : rien à configurer sur Netlify. Les dossiers `partials/`, `tools/` et `docs/` ne sont pas publiés (404 via `_redirects`).

### Montants INAMI
Ils apparaissent à trois endroits à mettre à jour ensemble lors d'une indexation : le tableau de `prix-remboursement.html`, le bloc prix de `index.html`, et la constante `INAMI` en haut du simulateur dans `assets/js/site.js`.

## 7. Ce qui demande des informations de votre part
1. **Avis Google réels** : remplacer les 3 témoignages actuels (sans source) par de vrais avis, avec note et lien vers la fiche Google.
2. **L'équipe** : photos, prénoms, diplômes. C'est le levier de confiance le plus fort pour un indépendant.
3. **Fourchettes de prix par gamme** (ex. « essentiel / confort / premium, à partir de X € par oreille après INAMI ») : c'est le vrai différenciateur face aux chaînes.
4. **Compléter les pages légales** (surlignées en jaune) : dénomination sociale, forme juridique, n° BCE, n° TVA, adresse e-mail, nom du professionnel responsable, n° INAMI. Durée de conservation des demandes fixée à 12 mois : à confirmer.
5. **Vocabulaire** : le site garde « audiologiste » (choix validé).
6. **Nom de domaine** propre (audiobel.be ?) et fiche **Google Business Profile** à jour : la majorité des recherches « audicien Liège » se jouent sur Google Maps.

### Pistes pour plus tard
- Rappel automatique de renouvellement (5 ans) et d'entretien pour les patients existants.
- Contenu « conseils » pour le référencement local (acouphènes, remboursement INAMI, choisir son appareil).
- Agenda en ligne avec vrais créneaux, si le volume le justifie.
