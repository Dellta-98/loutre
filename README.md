# Loutre — fausse IA de positivité

Compagnon de conversation en français, statique et sans API. Les échanges restent en mémoire dans l'onglet courant et ne sont pas envoyés à un serveur.

## Publier sur GitHub Pages

Dépose ensemble `index.html`, `app.js`, `conversations.js`, `style.css`, `manifest.json`, `icon.svg` et `sw.js` à la racine du dépôt.

## Contenu

- 26 thèmes avec réponses et relances adaptées.
- Plus de 140 questions surprises, 15 mini-jeux, des boosts et des amorces de conversation variables.
- Mémoire temporaire du sujet, du prénom et de quelques goûts. Le bouton « nouvelle conversation » efface cette mémoire.
- Réactions visuelles, animation de la loutre et suggestions pour continuer ou changer de sujet.
- Réponse prioritaire en cas de message de crise, avec les numéros d'aide en France.
- Cache hors ligne après le premier chargement.

Loutre reste un moteur à réponses pré-écrites : elle n'a pas de modèle génératif et peut mal comprendre une phrase inhabituelle. Pour ajouter des sujets, modifie `conversations.js` : chaque thème contient `name`, `keys`, `replies` et `qs`.
