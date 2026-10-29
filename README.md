# Loutre ? fausse IA de positivit?

Loutre est un petit compagnon de conversation statique en fran?ais. Elle fonctionne dans le navigateur, sans serveur et sans API. Ses r?ponses viennent d'une biblioth?que de th?mes, avec des variations et quelques relances pour garder l'?change l?ger.

## Lancer

Ouvre `index.html` dans un navigateur. Pour installer le mode hors ligne, h?berge le dossier sur un serveur statique qui sert aussi `sw.js`.

## Ajouter des conversations

Dans `app.js`, ajoute un objet dans le tableau `themes` avec un `name`, une expression r?guli?re `pattern` et un tableau `replies`. Les motifs sont test?s dans l'ordre : les sujets sp?cifiques doivent appara?tre avant les sujets g?n?raux.

## Personnalit?

Loutre est volontairement tr?s positive, mais essaie de ne pas nier les difficult?s. Elle indique clairement qu'il s'agit d'un programme. Les phrases d'aide en cas de crise restent prioritaires sur les r?ponses l?g?res.
