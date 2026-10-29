
/*
============================================================
 LOUTRE 🦦 — COMPAGNON DE CONVERSATION
 Version enrichie
 Objectifs :
 - Beaucoup de thèmes de conversation
 - Réponses variées
 - Ton doux, positif et naturel
 - Compatible avec index.html existant
 - Aucun serveur nécessaire pour cette version
============================================================
*/

(() => {
  "use strict";

  // --------------------------------------------------------
  // 1. RÉCUPÉRATION DES ÉLÉMENTS HTML
  // --------------------------------------------------------

  const chat = document.querySelector("#chat");
  const messages = document.querySelector("#messages");
  const composer = document.querySelector("#composer");
  const prompt = document.querySelector("#prompt");
  const welcome = document.querySelector("#welcome");
  const newChatButton = document.querySelector("#newChat");

  if (!chat || !messages || !composer || !prompt) {
    console.error(
      "Loutre : certains éléments HTML sont introuvables."
    );
    return;
  }

  // --------------------------------------------------------
  // 2. ÉTAT DE LA CONVERSATION
  // --------------------------------------------------------

  const state = {
    turns: 0,
    lastTheme: "",
    lastReply: "",
    recentReplies: [],
    conversation: []
  };

  // --------------------------------------------------------
  // 3. PHRASES D'OUVERTURE
  // --------------------------------------------------------

  const openings = [
    "Je t'écoute.",
    "Merci de m'en parler.",
    "On peut prendre notre temps.",
    "Je suis là pour discuter avec toi.",
    "Tu peux m'expliquer tranquillement.",
    "On va regarder ça ensemble.",
    "Tu n'as pas besoin de trouver les mots parfaits.",
    "Je te lis avec attention.",
    "On peut commencer par le plus simple.",
    "Je suis prêt à explorer cette idée avec toi.",
    "Tu peux me raconter ce qui te vient.",
    "Prenons les choses une par une.",
    "Je ne vais pas te juger.",
    "On peut réfléchir calmement à tout ça.",
    "Merci de partager cette pensée.",
    "Je te suis, continue.",
    "Tu peux prendre ton temps pour expliquer.",
    "On va essayer d'y voir plus clair.",
    "Tu peux être honnête sur ce que tu ressens.",
    "Il n'y a pas besoin de tout résoudre immédiatement.",
    "Je peux t'aider à mettre de l'ordre dans tes idées.",
    "Commençons là où tu en es aujourd'hui.",
    "Je suis disponible pour en parler.",
    "On peut avancer à ton rythme.",
    "Je t'accompagne dans cette réflexion.",
    "C'est d'accord, parlons-en.",
    "Tu peux développer si tu en as envie.",
    "Je prends ce que tu dis au sérieux.",
    "On va essayer de comprendre ce qui compte pour toi.",
    "Il y a de la place ici pour cette conversation."
  ];

  // --------------------------------------------------------
  // 4. PHRASES D'ENCOURAGEMENT
  // --------------------------------------------------------

  const encouragements = [
    "Un petit pas reste un vrai pas.",
    "Tu n'as pas besoin d'être parfait.",
    "Tu peux apprendre en avançant.",
    "Tu as le droit de faire les choses à ton rythme.",
    "Une journée difficile ne définit pas toute ta vie.",
    "Tu peux recommencer autrement.",
    "Tu mérites aussi de la patience de ta part.",
    "Tu n'as pas besoin de tout porter seul.",
    "Tu peux faire une pause sans abandonner.",
    "Tu as le droit de demander de l'aide.",
    "Tu peux changer d'avis en apprenant.",
    "Tu n'as pas à tout réussir du premier coup.",
    "Les progrès ne sont pas toujours spectaculaires.",
    "Tu peux commencer petit.",
    "Tu peux être fier d'avoir essayé.",
    "Tu as le droit de protéger ton énergie.",
    "Tu peux avancer même avec quelques doutes.",
    "Tu n'as pas besoin de te comparer.",
    "Tu peux prendre le temps de comprendre.",
    "Une erreur ne résume pas ta valeur.",
    "Tu peux te donner une nouvelle chance.",
    "Tu as le droit d'avoir des émotions compliquées.",
    "Tu peux viser le progrès plutôt que la perfection.",
    "Tu peux célébrer les petites victoires.",
    "Tu peux te traiter avec plus de douceur.",
    "Tu n'as pas besoin de tout régler aujourd'hui.",
    "Tu peux chercher une solution qui te correspond.",
    "Tu as le droit de ralentir.",
    "Tu peux faire un pas à la fois.",
    "Tu peux construire quelque chose de meilleur progressivement."
  ];

  // --------------------------------------------------------
  // 5. QUESTIONS POUR RELANCER LA CONVERSATION
  // --------------------------------------------------------

  const followUpQuestions = [
    "Qu'est-ce qui compte le plus pour toi dans cette situation ?",
    "Qu'aimerais-tu voir changer en premier ?",
    "Comment te sens-tu par rapport à tout ça ?",
    "Qu'est-ce qui te préoccupe le plus ?",
    "Quelle serait une petite amélioration possible ?",
    "Tu veux qu'on cherche une solution ensemble ?",
    "Qu'aimerais-tu que je comprenne mieux ?",
    "Qu'est-ce qui te ferait du bien maintenant ?",
    "Tu veux m'en raconter davantage ?",
    "Quelle partie te semble la plus difficile ?",
    "Qu'aimerais-tu faire ensuite ?",
    "Est-ce que tu as déjà une idée de ce qui pourrait aider ?",
    "Tu préfères en parler ou chercher des idées concrètes ?",
    "Qu'est-ce que tu ressens en y repensant ?",
    "Quel serait le meilleur résultat possible pour toi ?",
    "Y a-t-il un détail important que j'ai oublié ?",
    "Tu veux qu'on regarde les différentes possibilités ?",
    "Qu'est-ce qui te semble le plus urgent ?",
    "Tu préfères une réponse courte ou une réflexion détaillée ?",
    "Qu'aimerais-tu explorer davantage ?"
  ];

  // --------------------------------------------------------
  // 6. BIBLIOTHÈQUE DES THÈMES
  // Chaque thème possède ses déclencheurs et ses réponses.
  // --------------------------------------------------------

  const themes = [
    {
      name: "salutations",
      pattern: /\b(bonjour|salut|coucou|hello|hey|bonsoir|yo)\b/i,
      replies: [
        "Coucou ! 🦦 Comment se passe ta journée ?",
        "Bonjour à toi ! On se pose tranquillement et on discute ?",
        "Hey ! Je suis prêt à parler de ce que tu veux.",
        "Coucou ! J'espère que tu trouveras ici un petit moment agréable.",
        "Salut ! Tu viens avec une question, une histoire ou juste envie de discuter ?",
        "Bonsoir ! Comment se passe cette fin de journée ?",
        "Hello ! Qu'est-ce qui t'amène dans mon petit coin douillet ?",
        "Te voilà ! On parle de quoi aujourd'hui ?",
        "Coucou, prends tes aises. Qu'est-ce que tu as en tête ?",
        "Salut ! On peut parler sérieusement ou complètement changer de sujet."
      ]
    },

    {
      name: "tristesse",
      pattern: /\b(triste|tristesse|chagrin|pleurer|pleure|malheureux|malheureuse|peine)\b/i,
      replies: [
        "Je suis désolé que tu te sentes triste. Tu n'as pas besoin de faire semblant que tout va bien.",
        "Tu peux me raconter ce qui te rend triste, même si c'est difficile à expliquer.",
        "Parfois, mettre quelques mots sur sa peine aide à ne plus la porter tout à fait de la même manière.",
        "Tu as le droit d'être triste. Tu n'as pas à transformer immédiatement cette émotion en quelque chose de positif.",
        "Je peux t'écouter sans essayer de minimiser ce que tu ressens.",
        "Est-ce qu'il s'est passé quelque chose aujourd'hui, ou est-ce une tristesse qui s'accumule depuis un moment ?",
        "Tu n'as pas à te dépêcher d'aller mieux pour rassurer les autres.",
        "On peut rester sur ce sujet autant que tu en as besoin.",
        "Quand on est triste, les petites choses peuvent sembler énormes. On peut commencer doucement.",
        "Qu'aimerais-tu que quelqu'un comprenne au sujet de ta tristesse ?"
      ]
    },

    {
      name: "anxiété",
      pattern: /\b(stress|angoisse|angoissé|angoissée|anxieux|anxieuse|panique|inquiet|inquiète)\b/i,
      replies: [
        "On va ralentir un peu. Tu n'as pas besoin de résoudre toutes tes inquiétudes en même temps.",
        "Quand tout semble urgent, essayer de séparer les problèmes peut aider. Quel est le plus important maintenant ?",
        "Tu peux avoir peur et avancer quand même, mais tu n'es pas obligé de tout faire immédiatement.",
        "Si tu le souhaites, pose les pieds au sol et prends quelques respirations lentes. On peut ensuite regarder ce qui t'inquiète.",
        "Est-ce que ton inquiétude concerne quelque chose qui va arriver, ou quelque chose qui s'est déjà passé ?",
        "Ton esprit essaie peut-être d'anticiper beaucoup de choses à la fois. On peut revenir à ce que tu sais réellement.",
        "Tu n'as pas besoin d'obtenir une certitude absolue pour faire un petit choix.",
        "Qu'est-ce qui te semble le plus menaçant dans cette situation ?",
        "On peut distinguer ce que tu contrôles de ce qui ne dépend pas entièrement de toi.",
        "Tu peux prendre une pause avant de décider quoi que ce soit."
      ]
    },

    {
      name: "confiance",
      pattern: /\b(confiance|nul|nulle|incapable|inutile|pas capable|doute de moi)\b/i,
      replies: [
        "Le fait de douter de toi ne prouve pas que tu es incapable.",
        "Tu n'as pas besoin d'être excellent immédiatement pour avoir le droit d'essayer.",
        "Essaie de te parler comme tu parlerais à quelqu'un que tu apprécies.",
        "Tu peux reconnaître tes difficultés sans réduire toute ta personne à celles-ci.",
        "La confiance se construit souvent grâce à de petites expériences répétées.",
        "Qu'est-ce que tu arrives à faire aujourd'hui que tu trouvais difficile autrefois ?",
        "Tu n'as pas besoin de gagner la comparaison avec tout le monde.",
        "Tes erreurs sont des événements, pas une définition complète de qui tu es.",
        "Tu peux être en apprentissage et avoir déjà de la valeur.",
        "Quel petit défi te permettrait de progresser sans te mettre une pression énorme ?"
      ]
    },

    {
      name: "amour",
      pattern: /\b(amour|amoureux|amoureuse|crush|couple|copain|copine|petit ami|petite amie)\b/i,
      replies: [
        "Les sentiments peuvent être merveilleux, mais aussi un peu déroutants.",
        "Tu peux aimer quelqu'un tout en gardant tes propres besoins et tes limites.",
        "Est-ce que cette histoire te rend surtout heureux, inquiet, ou un peu des deux ?",
        "Tu n'as pas besoin de tout comprendre immédiatement pour prendre tes sentiments au sérieux.",
        "Une relation saine devrait laisser de la place à la confiance, au respect et à la communication.",
        "Tu peux exprimer ce que tu ressens sans exiger de toi-même un résultat précis.",
        "Qu'est-ce qui te plaît le plus chez cette personne ?",
        "Qu'aimerais-tu pouvoir lui dire si tu te sentais parfaitement à l'aise ?",
        "Tu as le droit d'avancer à ton rythme dans une relation.",
        "On peut réfléchir à ce que tu aimerais faire sans décider à ta place."
      ]
    },

    {
      name: "amitié",
      pattern: /\b(ami|amie|amitié|pote|meilleur ami|meilleure amie)\b/i,
      replies: [
        "Les amitiés peuvent apporter énormément, mais elles peuvent aussi être compliquées.",
        "Tu peux tenir à quelqu'un tout en ayant besoin de clarifier certaines choses.",
        "Qu'est-ce qui s'est passé entre vous ?",
        "Une amitié solide n'exige pas que tu sois toujours disponible ou toujours d'accord.",
        "Tu mérites des relations où tu peux parler honnêtement.",
        "Parfois, une conversation calme permet de corriger un malentendu.",
        "Tu veux réparer cette amitié, comprendre ce qui s'est passé ou simplement vider ton sac ?",
        "Tu n'as pas à porter toute la responsabilité d'une relation à toi seul.",
        "Les besoins peuvent changer avec le temps, même entre amis.",
        "Qu'est-ce que tu aimerais retrouver dans cette amitié ?"
      ]
    },

    {
      name: "école",
      pattern: /\b(école|collège|lycée|cours|devoir|prof|classe|examen|contrôle|études)\b/i,
      replies: [
        "Les études peuvent prendre beaucoup de place. On peut décomposer le problème en étapes plus simples.",
        "Tu n'as pas besoin de tout apprendre d'un seul coup.",
        "Quelle matière ou quelle tâche te pose le plus de difficultés ?",
        "Une séance courte et concentrée peut être un bon point de départ.",
        "Si tu as un devoir, partage l'énoncé et je pourrai t'aider à le comprendre.",
        "Une mauvaise note ne résume ni ton intelligence ni ton avenir.",
        "Tu peux commencer par ce que tu comprends déjà, puis avancer progressivement.",
        "On peut construire un petit programme de révision réaliste.",
        "Qu'est-ce qui te stresse le plus : la quantité de travail, le résultat ou le manque de temps ?",
        "Faire une pause peut aussi aider ton cerveau à assimiler les informations."
      ]
    },

    {
      name: "travail",
      pattern: /\b(travail|boulot|emploi|collègue|patron|bureau|carrière|réunion)\b/i,
      replies: [
        "Le travail peut être épuisant quand les attentes deviennent difficiles à gérer.",
        "On peut essayer de séparer ce qui est urgent de ce qui est simplement bruyant.",
        "Qu'est-ce qui te pèse le plus dans cette situation professionnelle ?",
        "Tu as le droit de réfléchir à tes limites et à la manière de les communiquer.",
        "Une liste de trois priorités peut parfois rendre une journée moins écrasante.",
        "Tu n'as pas besoin d'être disponible à chaque seconde pour être impliqué.",
        "Si tu dois écrire un message professionnel délicat, je peux t'aider à le formuler.",
        "Tu peux chercher une solution sans porter toute la responsabilité du problème.",
        "Qu'est-ce qui rendrait ta prochaine journée de travail un peu plus facile ?",
        "On peut examiner les options avant de prendre une décision importante."
      ]
    },

    {
      name: "fatigue",
      pattern: /\b(fatigué|fatiguée|épuisé|épuisée|crevé|crevée|sommeil|dormir)\b/i,
      replies: [
        "Tu as le droit de te reposer sans devoir d'abord prouver que tu l'as mérité.",
        "Quand on est épuisé, même les petites tâches peuvent paraître énormes.",
        "Est-ce que tu manques surtout de sommeil, d'énergie mentale ou de temps pour toi ?",
        "Si possible, choisis une seule chose importante et autorise le reste à attendre.",
        "Une pause de quelques minutes peut être un début, même si elle ne règle pas tout.",
        "Tu n'as pas à transformer chaque moment libre en moment productif.",
        "Ton corps et ton esprit ont besoin de récupération.",
        "Qu'est-ce que tu pourrais simplifier aujourd'hui pour te ménager un peu ?",
        "Si cette fatigue est persistante ou inhabituelle, en parler à un professionnel de santé peut être utile.",
        "On peut préparer une routine du soir simple et réaliste si tu veux."
      ]
    },

    {
      name: "motivation",
      pattern: /\b(motivation|flemme|procrastin|pas envie|remettre à demain)\b/i,
      replies: [
        "Tu n'as pas besoin d'attendre d'être motivé à 100 % pour commencer.",
        "Essaie de réduire la tâche à une version qui prend deux minutes.",
        "Parfois, le plus difficile est de démarrer. Après, tu pourras décider si tu continues.",
        "Tu peux te fixer un objectif assez petit pour qu'il ne te fasse pas peur.",
        "Qu'est-ce qui bloque le plus : la fatigue, la peur de mal faire ou le manque de clarté ?",
        "Tu peux préparer ton environnement pour rendre le premier pas plus facile.",
        "Une action imparfaite peut être plus utile qu'un plan parfait qui reste dans la tête.",
        "Tu peux essayer cinq minutes, puis faire le point.",
        "Tu n'as pas besoin de transformer toute ta vie aujourd'hui.",
        "Quel serait le plus petit progrès dont tu serais satisfait ce soir ?"
      ]
    },

    {
      name: "ennui",
      pattern: /\b(ennui|ennuyé|ennuyée|je m'ennuie|rien à faire)\b/i,
      replies: [
        "On pourrait inventer une histoire complètement absurde ensemble.",
        "Tu préfères une activité calme, créative, drôle ou un mini-défi ?",
        "Défi Loutre : trouve trois objets autour de toi qui pourraient devenir les héros d'un film.",
        "On peut jouer aux devinettes si tu veux.",
        "Je peux te proposer une idée de dessin, une énigme ou un petit jeu de mots.",
        "Et si on imaginait le café le plus étrange du monde ?",
        "Tu pourrais écouter une chanson que tu n'as pas entendue depuis longtemps.",
        "On peut faire une liste de dix choses que tu aimerais essayer un jour.",
        "Tu veux une question amusante pour lancer une conversation ?",
        "On peut aussi simplement discuter sans avoir besoin d'un sujet extraordinaire."
      ]
    },

    {
      name: "créativité",
      pattern: /\b(dessin|dessiner|écrire|musique|créatif|créative|art|inventer)\b/i,
      replies: [
        "La créativité n'a pas besoin d'être parfaite pour être intéressante.",
        "Tu peux commencer par créer quelque chose juste pour le plaisir.",
        "Quelle ambiance veux-tu donner à ton idée : douce, drôle, mystérieuse ou étrange ?",
        "Une contrainte amusante peut parfois débloquer l'imagination.",
        "On peut inventer un personnage, un univers ou une histoire ensemble.",
        "Tu peux faire une première version brouillonne et l'améliorer ensuite.",
        "Qu'est-ce qui t'inspire le plus en ce moment ?",
        "Tu veux des idées originales ou tu préfères développer une idée que tu as déjà ?",
        "Le processus compte autant que le résultat final.",
        "On peut transformer ton idée en petites étapes concrètes."
      ]
    },

    {
      name: "avenir",
      pattern: /\b(avenir|futur|orientation|devenir quoi|plus tard|destin)\b/i,
      replies: [
        "Tu n'as pas besoin de connaître tout ton avenir pour choisir une prochaine étape.",
        "Il est normal que certaines réponses arrivent en expérimentant plutôt qu'en réfléchissant sans fin.",
        "Qu'est-ce qui t'intéresse suffisamment pour que tu aies envie d'en apprendre davantage ?",
        "Tu peux explorer plusieurs possibilités avant de choisir une direction.",
        "Une décision n'a pas toujours besoin d'être définitive.",
        "On peut comparer tes options en regardant ce qui compte vraiment pour toi.",
        "Qu'aimerais-tu avoir davantage dans ta vie dans un an ?",
        "Tu peux construire une direction progressivement.",
        "Le chemin des autres n'est pas forcément le bon repère pour le tien.",
        "On peut distinguer ce que tu veux de ce que tu penses devoir vouloir."
      ]
    },

    {
      name: "colère",
      pattern: /\b(colère|énervé|énervée|furieux|furieuse|rage|ça m'énerve)\b/i,
      replies: [
        "Tu as l'air vraiment contrarié. Qu'est-ce qui s'est passé ?",
        "La colère peut signaler qu'une limite importante a été dépassée.",
        "Tu peux prendre un peu de distance avant de répondre à chaud.",
        "On peut examiner ce qui t'a semblé injuste dans cette situation.",
        "Tu as le droit d'être en colère sans devoir agir immédiatement sous son influence.",
        "Qu'aurais-tu voulu que l'autre personne fasse différemment ?",
        "Si tu veux, on peut préparer une façon ferme mais calme d'exprimer ton point de vue.",
        "Tu peux reconnaître ton émotion sans te laisser définir par elle.",
        "Qu'est-ce qui pourrait t'aider à retrouver un peu de calme maintenant ?",
        "On peut réfléchir à ce qui est sous ton contrôle pour la suite."
      ]
    },

    {
      name: "réussite",
      pattern: /\b(réussi|réussite|fier|fière|victoire|accompli|accomplie)\b/i,
      replies: [
        "Mais c'est une bonne nouvelle ! Tu as le droit de savourer ce moment. 🎉",
        "Bravo pour ce que tu viens d'accomplir !",
        "Les petites victoires méritent aussi d'être célébrées.",
        "Qu'est-ce qui t'a le plus aidé à réussir ?",
        "Tu peux prendre un moment pour apprécier tes efforts.",
        "J'espère que tu prends le temps de reconnaître ce que tu as fait.",
        "Tu as franchi une étape, et c'est important.",
        "Tu veux me raconter comment ça s'est passé ?",
        "C'est agréable de voir un effort aboutir.",
        "Comment aimerais-tu célébrer cette réussite ?"
      ]
    },

    {
      name: "solitude",
      pattern: /\b(seul|seule|solitude|isolé|isolée|personne ne)\b/i,
      replies: [
        "Se sentir seul peut faire mal, même quand on croise beaucoup de monde.",
        "Tu mérites des relations dans lesquelles tu peux être toi-même.",
        "Est-ce que tu te sens isolé en ce moment, ou est-ce plutôt un manque de proximité avec les autres ?",
        "Parfois, envoyer un message simple à une personne de confiance peut être un premier pas.",
        "Tu n'as pas besoin de faire semblant que la solitude ne te touche pas.",
        "On peut réfléchir à des façons de rencontrer des personnes qui partagent tes centres d'intérêt.",
        "Tu peux me parler de ce qui te manque le plus dans tes relations.",
        "La solitude actuelle ne prédit pas toutes tes relations futures.",
        "Qu'est-ce qui te ferait te sentir un peu plus connecté aux autres ?",
        "Tu mérites de pouvoir demander de la compagnie quand tu en as besoin."
      ]
    },

    {
      name: "organisation",
      pattern: /\b(organiser|organisation|planning|agenda|désordre|priorité|liste de tâches)\b/i,
      replies: [
        "On peut commencer par sortir toutes les tâches de ta tête et les noter.",
        "Choisissons trois priorités maximum pour rendre la journée plus lisible.",
        "Une bonne organisation doit t'aider, pas devenir une nouvelle source de pression.",
        "Qu'est-ce qui a une échéance réelle et qu'est-ce qui peut attendre ?",
        "On peut transformer ton objectif en petites étapes faciles à vérifier.",
        "Essaie de prévoir une marge : tout ne se déroule pas toujours comme prévu.",
        "Tu veux que je t'aide à construire un planning simple ?",
        "Commence par la prochaine action concrète, pas par tout le projet.",
        "Tu peux laisser une tâche de côté si elle n'est pas prioritaire aujourd'hui.",
        "Une liste courte et réaliste peut être plus efficace qu'une liste parfaite."
      ]
    },

    {
      name: "technologie",
      pattern: /\b(ordinateur|téléphone|internet|code|programmer|programmation|application|site web|intelligence artificielle)\b/i,
      replies: [
        "On peut décomposer le problème technique en étapes et vérifier chaque élément.",
        "Tu peux me montrer le code ou le message d'erreur, et je t'aiderai à comprendre.",
        "Commençons par ce que tu souhaites obtenir, puis on regardera comment y parvenir.",
        "Un bug n'est pas forcément grave : il faut souvent isoler la cause.",
        "Tu veux une explication simple, un exemple de code ou une solution complète ?",
        "On peut tester les hypothèses une par une plutôt que modifier tout le projet.",
        "Quel comportement observes-tu, et quel comportement attendais-tu ?",
        "Je peux t'aider à rendre ton projet plus clair et plus facile à maintenir.",
        "Pense à ne jamais publier de clés secrètes ou de mots de passe dans du code public.",
        "Raconte-moi où tu bloques, et on cherchera la prochaine étape."
      ]
    },

    {
      name: "curiosité",
      pattern: /\b(pourquoi|comment ça marche|explique|comprendre|apprendre|question)\b/i,
      replies: [
        "J'aime bien les questions curieuses ! Quel aspect veux-tu explorer en premier ?",
        "Je peux te donner une réponse simple, puis approfondir si tu le souhaites.",
        "On peut partir d'un exemple concret pour rendre l'idée plus facile à comprendre.",
        "Il n'y a pas de honte à poser une question de base.",
        "Tu préfères une explication courte, une analogie ou une démonstration étape par étape ?",
        "On peut regarder le principe, puis voir comment il s'applique dans la réalité.",
        "Quelle partie te paraît la plus mystérieuse ?",
        "Je vais essayer d'expliquer ça clairement sans compliquer inutilement.",
        "Une bonne question peut ouvrir plusieurs pistes intéressantes.",
        "Dis-moi ce que tu sais déjà, et j'adapterai l'explication."
      ]
    },

    {
      name: "gratitude",
      pattern: /\b(merci|remercie|c'est gentil|ça m'aide|tu m'aides)\b/i,
      replies: [
        "Avec plaisir ! 🌿 Je suis content que cette conversation te soit utile.",
        "Merci à toi de m'avoir confié ça.",
        "Je suis là pour t'aider à réfléchir autant que possible.",
        "Tu peux revenir à ce sujet ou en choisir un complètement différent.",
        "Ça me fait plaisir de pouvoir t'accompagner dans cette réflexion.",
        "On continue quand tu veux, à ton rythme.",
        "Tu as fait une partie importante du travail en mettant des mots sur la situation.",
        "Je suis heureux que tu aies trouvé quelque chose d'utile ici.",
        "Tu veux continuer ou prendre une petite pause ?",
        "On peut garder cette idée et explorer la suite ensemble."
      ]
    },

    {
      name: "identité",
      pattern: /\b(qui suis-je|identité|moi-même|différent|différente|être moi)\b/i,
      replies: [
        "Tu n'as pas besoin de te résumer à une seule étiquette.",
        "Se comprendre peut prendre du temps, et tu peux évoluer au fil des expériences.",
        "Quelles parties de toi aimerais-tu mieux comprendre ?",
        "Tu peux explorer tes goûts et tes valeurs sans avoir immédiatement toutes les réponses.",
        "Tu as le droit d'être complexe et de changer.",
        "Tu n'as pas besoin de ressembler aux autres pour avoir ta place.",
        "On peut réfléchir à ce qui te semble important et authentique.",
        "Qu'est-ce qui te fait te sentir vraiment toi-même ?",
        "Tu peux distinguer ce que tu souhaites de ce que les autres attendent de toi.",
        "L'identité n'est pas toujours une réponse fixe ; elle peut aussi être un chemin."
      ]
    },

    {
      name: "détente",
      pattern: /\b(détendre|relax|calme|respirer|apaiser|pause)\b/i,
      replies: [
        "On peut faire une petite pause mentale. Rien ne doit être résolu pendant les prochaines secondes.",
        "Relâche doucement les épaules si tu peux, puis laisse l'expiration devenir un peu plus lente.",
        "Imagine un endroit où tu te sens bien : quels sons et quelles couleurs y trouverais-tu ?",
        "Tu peux poser ton téléphone un instant et regarder quelque chose de loin pour reposer tes yeux.",
        "Veux-tu une petite visualisation calme ou préfères-tu parler d'un sujet léger ?",
        "Une pause n'a pas besoin d'être longue pour compter.",
        "Choisis une chose autour de toi que tu trouves agréable à regarder.",
        "On peut ralentir la conversation et prendre une chose à la fois.",
        "Tu n'as pas besoin d'être productif à chaque minute.",
        "Quel genre d'ambiance te détend le plus : pluie, forêt, mer ou musique douce ?"
      ]
    },

    {
      name: "famille",
      pattern: /\b(famille|maman|papa|parents|mère|père|frère|sœur|soeur|cousin|cousine)\b/i,
      replies: [
        "Les liens familiaux peuvent être précieux et compliqués à la fois. Tu peux aimer ta famille tout en ayant tes propres besoins.",
        "Tu as le droit d'avoir un point de vue différent de celui de ta famille.",
        "Parfois, les personnes proches ne comprennent pas immédiatement ce qu'on ressent. Qu'aimerais-tu qu'elles comprennent ?",
        "Tu n'es pas obligé de régler toute une situation familiale en une seule conversation.",
        "On peut réfléchir à une manière calme d'expliquer ce que tu ressens.",
        "Les attentes familiales peuvent peser lourd. Qu'est-ce qui te semble le plus difficile en ce moment ?",
        "Tu peux chercher un équilibre entre garder le lien et protéger tes limites.",
        "Une relation familiale peut évoluer avec le temps, même si le changement est lent.",
        "Est-ce que tu veux parler d'un événement précis ou plutôt d'une situation qui dure ?",
        "Tu mérites d'être écouté avec respect, y compris par les personnes proches de toi."
      ]
    },
    {
      name: "regrets",
      pattern: /\b(regret|regrette|j'aurais dû|j'aurais pas dû|si seulement|remords)\b/i,
      replies: [
        "Les regrets peuvent nous apprendre quelque chose, mais ils peuvent aussi nous enfermer dans le passé.",
        "Tu as pris une décision avec les moyens et les informations que tu avais à ce moment-là.",
        "Si quelque chose peut être réparé, on peut chercher une première étape réaliste.",
        "Tu peux reconnaître une erreur sans te condamner pour toujours.",
        "Qu'aurais-tu besoin de comprendre pour pouvoir avancer ?",
        "Rejouer une scène dans sa tête ne permet pas toujours de trouver une nouvelle réponse.",
        "Tu peux apprendre de ce moment sans faire de toute ton histoire une punition.",
        "Si tu pouvais parler à la personne que tu étais à ce moment-là, que lui dirais-tu ?",
        "Tu n'as pas besoin d'oublier pour avancer, mais tu peux chercher à moins te faire mal avec ce souvenir.",
        "On peut distinguer ce que tu savais alors de ce que tu sais aujourd'hui."
      ]
    },
    {
      name: "rêves",
      pattern: /\b(rêve|rêver|rêves|cauchemar|rêvé|rêvait)\b/i,
      replies: [
        "Les rêves peuvent être étranges, amusants ou parfois très intenses. Tu te souviens de quoi ?",
        "On peut explorer ton rêve comme une histoire, sans supposer qu'il possède une signification cachée certaine.",
        "Quel détail de ce rêve t'a le plus marqué ?",
        "Si ton rêve devenait le début d'un film, que se passerait-il dans la scène suivante ?",
        "Les cauchemars peuvent laisser une émotion persistante au réveil. Comment te sens-tu maintenant ?",
        "Tu veux qu'on imagine plusieurs interprétations possibles, juste pour explorer les idées ?",
        "Parfois, le plus intéressant est l'émotion ressentie plutôt que le scénario lui-même.",
        "Décris-moi le décor : j'aimerais comprendre l'ambiance de ce rêve.",
        "On pourrait transformer ce rêve en petite histoire fantastique.",
        "Tu préfères analyser ce rêve ou inventer une suite complètement imaginaire ?"
      ]
    },
    {
      name: "voyages",
      pattern: /\b(voyage|voyager|vacances|destination|avion|train|road trip|week-end|weekend)\b/i,
      replies: [
        "Imagine un réveil dans un endroit magnifique, sans obligation immédiate. Tu serais où ?",
        "Tu préfères les escapades spontanées ou les voyages soigneusement préparés ?",
        "On peut imaginer un itinéraire qui mélange découvertes, pauses et petits plaisirs.",
        "Quel paysage te donne le plus envie de partir : la mer, les montagnes, une forêt ou une grande ville ?",
        "Le meilleur voyage n'est pas forcément le plus lointain ; parfois, une découverte près de chez soi suffit.",
        "Si tu pouvais partir demain, sans contrainte de budget, quelle serait ta destination ?",
        "Tu aimes surtout goûter la cuisine locale, visiter des lieux, rencontrer des gens ou profiter du calme ?",
        "On peut construire une liste de destinations qui correspondent à tes envies.",
        "Quel souvenir de voyage aimerais-tu créer un jour ?",
        "Tu veux rêver de destinations ou préparer un voyage concret ?"
      ]
    },
    {
      name: "animaux",
      pattern: /\b(animal|animaux|chien|chiens|chat|chats|chaton|chiot|lapin|oiseau|cheval|loutre)\b/i,
      replies: [
        "Les animaux ont une façon particulière de rendre certains moments plus doux. Tu as un animal préféré ?",
        "Si tu pouvais passer une journée à observer une espèce dans son milieu naturel, laquelle choisirais-tu ?",
        "Les loutres sont officiellement très bien placées dans mon classement imaginaire des animaux adorables. 🦦",
        "Tu préfères les animaux joueurs, les animaux tranquilles ou les grandes créatures impressionnantes ?",
        "Si ton animal avait une personnalité humaine, comment serait-il ?",
        "On peut inventer un animal fantastique avec trois caractéristiques surprenantes.",
        "Quel animal te ressemble le plus, selon toi ?",
        "Tu as déjà vécu un moment drôle ou touchant avec un animal ?",
        "Si tu pouvais aider une espèce animale, laquelle choisirais-tu ?",
        "Imagine un petit refuge chaleureux où chaque animal aurait son coin préféré. Tu y mettrais quoi ?"
      ]
    },
    {
      name: "jeux",
      pattern: /\b(jeu|jeux|jouer|gaming|gamer|jeu vidéo|jeux vidéo|console|minecraft|roblox)\b/i,
      replies: [
        "Tu préfères les jeux qui racontent une histoire, les jeux compétitifs ou ceux qui permettent de construire librement ?",
        "Quel jeu pourrait te faire oublier l'heure pendant des heures ?",
        "On peut inventer un mini-jeu directement dans notre conversation.",
        "Si tu pouvais créer ton propre jeu vidéo, quel serait son concept ?",
        "Tu préfères explorer un monde inconnu ou améliorer petit à petit une base que tu construis ?",
        "Quel personnage de jeu aimerais-tu rencontrer dans la vraie vie ?",
        "On peut faire un quiz sur un univers que tu aimes.",
        "Tu as un jeu réconfortant auquel tu reviens quand tu veux te détendre ?",
        "Imagine un jeu où la seule mission est de rendre une petite ville plus heureuse.",
        "Tu veux parler de ton jeu préféré ou découvrir une nouvelle idée de jeu ?"
      ]
    },
    {
      name: "musique",
      pattern: /\b(musique|chanson|chanteur|chanteuse|musicien|musicienne|album|concert|mélodie|playlist)\b/i,
      replies: [
        "La musique peut changer l'ambiance d'un moment en quelques secondes. Tu écoutes quoi en ce moment ?",
        "Quelle chanson te rappelle immédiatement un souvenir précis ?",
        "Tu préfères la musique qui donne de l'énergie ou celle qui aide à ralentir ?",
        "Si ta journée avait une bande-son, quel genre musical l'accompagnerait ?",
        "On peut créer une playlist imaginaire pour une soirée pluvieuse et cosy.",
        "Quelle musique te donne envie de tout laisser tomber pour danser ?",
        "Tu écoutes surtout les paroles, la mélodie ou l'ambiance générale ?",
        "Quel artiste aimerais-tu voir en concert ?",
        "Tu as une chanson que tu pourrais écouter cent fois sans te lasser ?",
        "Si tu me donnes trois artistes que tu aimes, je peux t'aider à trouver des styles proches."
      ]
    },
    {
      name: "films",
      pattern: /\b(film|cinéma|cinema|acteur|actrice|réalisateur|realisateur|série|serie|épisode|episode)\b/i,
      replies: [
        "Tu préfères les histoires qui font rire, réfléchir, frissonner ou pleurer un bon coup ?",
        "Quel film aimerais-tu pouvoir découvrir une seconde fois sans en connaître l'histoire ?",
        "On peut inventer un scénario avec un héros improbable et un retournement inattendu.",
        "Tu préfères les fins heureuses, les fins ouvertes ou les fins complètement surprenantes ?",
        "Quel univers de fiction aimerais-tu visiter pendant une journée ?",
        "Tu as une série que tu recommandes à tout le monde ?",
        "Si ta vie était un film, quel serait son titre aujourd'hui ?",
        "Tu préfères regarder un film seul, avec des amis ou en famille ?",
        "Quel personnage fictif te semble particulièrement attachant ?",
        "Donne-moi une ambiance et je te proposerai des idées de films à explorer."
      ]
    },
    {
      name: "nourriture",
      pattern: /\b(nourriture|manger|cuisine|recette|repas|pizza|pâtes|pates|chocolat|dessert|gâteau|gateau)\b/i,
      replies: [
        "Question essentielle : si tu ne pouvais manger qu'un seul plat pendant une journée, tu choisirais quoi ?",
        "On peut imaginer un menu réconfortant pour une soirée toute douce.",
        "Tu préfères cuisiner tranquillement ou découvrir un plat préparé par quelqu'un d'autre ?",
        "Quel dessert pourrait améliorer instantanément une journée ordinaire ?",
        "Si tu inventais un restaurant, quelle serait sa spécialité ?",
        "On peut chercher une recette simple avec les ingrédients que tu as déjà.",
        "Tu aimes plutôt les saveurs sucrées, salées, épicées ou acidulées ?",
        "Quel plat te rappelle un souvenir agréable ?",
        "Imagine un pique-nique parfait : qu'est-ce qu'on met dans le panier ?",
        "Tu veux une idée de repas rapide, une recette détaillée ou juste parler de nourriture ?"
      ]
    },
    {
      name: "météo",
      pattern: /\b(pluie|pluvieux|pluvieuse|soleil|ensoleillé|ensoleillée|orage|neige|météo|meteo|temps qu'il fait)\b/i,
      replies: [
        "La pluie contre une fenêtre, une boisson chaude et aucune urgence : ça ressemble à une bonne ambiance cosy.",
        "Tu préfères les journées lumineuses ou les journées grises parfaites pour rester au calme ?",
        "Si tu pouvais choisir la météo idéale pour demain, ce serait quoi ?",
        "Un orage peut rendre une pièce particulièrement confortable quand on est bien à l'abri.",
        "Tu aimes sortir sous la pluie ou tu préfères l'observer depuis l'intérieur ?",
        "Quel temps te donne le plus d'énergie ?",
        "Imagine une journée de neige parfaite : que ferais-tu en premier ?",
        "Tu préfères le bruit de la pluie, des vagues ou du vent dans les arbres ?",
        "La météo influence parfois notre humeur. Tu le remarques chez toi ?",
        "On peut imaginer une activité adaptée à l'ambiance du jour."
      ]
    },
    {
      name: "petites joies",
      pattern: /\b(petit bonheur|petites joies|moment agréable|ça m'a fait plaisir|ça m'a rendu heureux|ça m'a rendue heureuse)\b/i,
      replies: [
        "Les petits moments agréables méritent parfois autant d'attention que les grands événements.",
        "Quel détail minuscule a rendu ta journée un peu meilleure ?",
        "On pourrait tenir une petite liste de choses qui te font du bien.",
        "Une odeur familière, une chanson ou un message gentil peuvent parfois changer l'ambiance.",
        "Tu as le droit d'apprécier un moment sans devoir le rendre productif.",
        "Quel petit plaisir aimerais-tu t'offrir plus souvent ?",
        "Si on devait conserver un seul bon souvenir de cette journée, lequel choisirais-tu ?",
        "On peut chercher trois choses simples que tu apprécies, sans forcer la positivité.",
        "Quel endroit te donne immédiatement une impression de confort ?",
        "J'aime bien l'idée de collectionner les petits moments qui rendent la vie plus douce."
      ]
    },
    {
      name: "limites personnelles",
      pattern: /\b(dire non|mes limites|limites personnelles|faire plaisir à tout le monde|profite de moi|je n'ose pas refuser)\b/i,
      replies: [
        "Dire non à une demande n'est pas nécessairement rejeter la personne qui la formule.",
        "Tu peux être généreux sans être disponible pour tout, tout le temps.",
        "Une limite peut être exprimée calmement et rester importante.",
        "Qu'aimerais-tu refuser si tu n'avais pas peur de décevoir quelqu'un ?",
        "Tu peux commencer par une phrase courte, sans te justifier pendant dix minutes.",
        "Tes besoins comptent aussi dans les relations.",
        "Tu n'as pas à dire oui immédiatement ; tu peux demander du temps pour réfléchir.",
        "On peut préparer une formulation respectueuse mais ferme.",
        "Il est possible que certaines personnes soient déçues par une limite, sans que cette limite soit mauvaise.",
        "Quelle situation aimerais-tu apprendre à gérer différemment ?"
      ]
    },
    {
      name: "décisions",
      pattern: /\b(décision|décider|choisir|choix|j'hésite|hésitation|je ne sais pas quoi faire)\b/i,
      replies: [
        "Quand deux options ont chacune des avantages, hésiter est tout à fait compréhensible.",
        "On peut comparer les possibilités selon ce qui compte le plus pour toi.",
        "Tu peux noter ce que chaque option apporte et ce qu'elle te coûte.",
        "Est-ce une décision réversible ou quelque chose de difficile à changer ensuite ?",
        "Tu n'as pas besoin de trouver une option parfaite ; une option suffisamment bonne peut suffire.",
        "Qu'est-ce qui te ferait regretter le plus de ne pas essayer ?",
        "On peut imaginer le scénario le plus favorable et le plus difficile pour chaque choix.",
        "Tu peux demander conseil tout en gardant la décision finale entre tes mains.",
        "Quelles informations te manquent encore pour choisir plus sereinement ?",
        "Parfois, une petite expérience permet d'apprendre plus qu'une longue réflexion."
      ]
    },
    {
      name: "conflits",
      pattern: /\b(dispute|conflit|engueulade|engueulé|engueulée|malentendu|tension|crié dessus)\b/i,
      replies: [
        "Une dispute peut laisser beaucoup d'émotions après la fin de la conversation.",
        "On peut essayer de distinguer les faits, les interprétations et ce que tu as ressenti.",
        "Tu n'as pas besoin de régler le conflit tant que tu es encore trop bouleversé.",
        "Qu'aurais-tu voulu que l'autre personne entende dans ce que tu disais ?",
        "On peut préparer un message qui explique ton point de vue sans envenimer la situation.",
        "Tu peux reconnaître ta part éventuelle sans accepter toute la responsabilité.",
        "Est-ce que tu veux réparer la relation ou surtout comprendre ce qui s'est passé ?",
        "Un désaccord ne signifie pas toujours qu'une relation est condamnée.",
        "Tu peux chercher une solution tout en maintenant tes limites.",
        "Qu'est-ce qui te semblerait être une issue acceptable pour toi ?"
      ]
    },
    {
      name: "habitudes",
      pattern: /\b(habitude|routine|discipline|nouvelle habitude|changer mes habitudes|tenir mes objectifs)\b/i,
      replies: [
        "Une habitude durable doit pouvoir survivre aux journées ordinaires, pas seulement aux journées parfaites.",
        "Commence par une version si petite qu'elle semble presque trop facile.",
        "Tu peux associer une nouvelle habitude à une action que tu fais déjà régulièrement.",
        "Une journée manquée n'efface pas tout ce que tu as construit.",
        "Qu'est-ce qui rendrait cette habitude plus facile à répéter demain ?",
        "Tu peux suivre tes efforts sans transformer le suivi en jugement.",
        "Il est souvent utile de préparer l'environnement plutôt que de compter uniquement sur la volonté.",
        "Quel obstacle risque le plus de se présenter, et comment pourrais-tu l'anticiper ?",
        "Tu peux essayer pendant une semaine puis ajuster selon ce que tu observes.",
        "Le but est de construire quelque chose qui te soutient, pas une nouvelle source de culpabilité."
      ]
    },
    {
      name: "argent",
      pattern: /\b(argent|budget|facture|payer|économiser|économies|finances|dépense|dépenses)\b/i,
      replies: [
        "Les préoccupations financières peuvent donner l'impression que tout devient urgent.",
        "On peut commencer par lister les dépenses fixes, les dépenses variables et les échéances proches.",
        "Tu n'as pas besoin de résoudre tout ton budget en une seule séance.",
        "Quel est le problème principal : une facture, une dépense inattendue ou le manque de visibilité ?",
        "On peut construire un budget simple avec les chiffres que tu connais déjà.",
        "Une estimation réaliste est souvent plus utile qu'un plan trop optimiste.",
        "Tu peux regarder les options disponibles avant de prendre une décision pressée.",
        "Si tu me donnes des montants non sensibles, je peux t'aider à faire les calculs.",
        "On peut chercher des économies qui ne suppriment pas tout ce qui te fait du bien.",
        "Pour une décision financière importante, il peut être utile de vérifier les informations auprès d'une source qualifiée."
      ]
    },
    {
      name: "nature",
      pattern: /\b(nature|forêt|foret|montagne|mer|plante|jardin|randonnée|randonnee|fleur|fleurs)\b/i,
      replies: [
        "Si tu pouvais t'installer quelques minutes dans un paysage, lequel choisirais-tu ?",
        "La nature offre beaucoup de petits détails à observer quand on prend le temps de ralentir.",
        "Tu préfères marcher en forêt, longer la mer ou explorer les montagnes ?",
        "Quel serait ton jardin idéal : sauvage, fleuri, luxuriant ou minimaliste ?",
        "On peut imaginer une cabane parfaite cachée au milieu des arbres.",
        "Tu as une plante préférée ou une fleur qui te met de bonne humeur ?",
        "Quel son naturel te détend le plus : la pluie, les oiseaux, le vent ou les vagues ?",
        "Une petite promenade peut parfois offrir une pause bienvenue si tu en as la possibilité.",
        "Si tu pouvais protéger un endroit naturel, lequel choisirais-tu ?",
        "On peut inventer un refuge secret dans la nature, avec tous les détails que tu veux."
      ]
    },
    {
      name: "philosophie",
      pattern: /\b(philosophie|sens de la vie|bonheur|liberté|liberte|existence|univers|conscience|temps qui passe)\b/i,
      replies: [
        "C'est une question profonde. On peut l'explorer sans supposer qu'il existe une seule réponse.",
        "Qu'est-ce qui te fait penser à cette question en ce moment ?",
        "Le bonheur signifie-t-il pour toi la tranquillité, l'intensité, les liens ou la liberté ?",
        "On peut regarder plusieurs points de vue et voir lesquels te parlent le plus.",
        "Parfois, une question intéressante vaut autant que la réponse qu'on lui apporte.",
        "Qu'est-ce qui rend une journée significative à tes yeux ?",
        "Tu préfères réfléchir à partir d'idées abstraites ou d'exemples concrets de la vie quotidienne ?",
        "On peut imaginer comment différentes personnes répondraient à cette question.",
        "Est-ce que tu cherches une réponse logique, une réflexion personnelle ou un débat amical ?",
        "Je peux t'aider à explorer les arguments, tout en laissant la place à ton propre point de vue."
      ]
    },
    {
      name: "souvenirs",
      pattern: /\b(souvenir|souvenirs|nostalgie|nostalgique|quand j'étais petit|quand j'étais petite|enfance)\b/i,
      replies: [
        "Les souvenirs peuvent ramener une ambiance entière avec un seul détail.",
        "Quel souvenir te fait sourire presque automatiquement ?",
        "La nostalgie peut être douce et un peu mélancolique à la fois.",
        "Tu veux me raconter un moment de ton enfance qui t'a marqué ?",
        "Si tu pouvais revivre une journée du passé, laquelle choisirais-tu ?",
        "Quel objet te rappelle immédiatement une période de ta vie ?",
        "Tu peux apprécier un souvenir sans devoir retrouver exactement la même époque.",
        "Qu'est-ce qui te manque le plus dans cette période ?",
        "On peut transformer ce souvenir en petite histoire écrite.",
        "Quel détail de ce souvenir est resté particulièrement vivant dans ta mémoire ?"
      ]
    },
    {
      name: "surprises",
      pattern: /\b(surprise|incroyable|tu sais quoi|figure-toi|devine quoi|j'ai une nouvelle)\b/i,
      replies: [
        "Oh, raconte-moi ! Je veux comprendre ce qui s'est passé.",
        "C'est une bonne surprise, une mauvaise ou quelque chose entre les deux ?",
        "Je t'écoute, quelle est la nouvelle ?",
        "Tu as l'air d'avoir quelque chose à partager. Raconte !",
        "Qu'est-ce qui t'a le plus étonné dans cette histoire ?",
        "Je suis prêt pour la suite. Que s'est-il passé ensuite ?",
        "Tu veux commencer par le début ou par le détail le plus incroyable ?",
        "Comment as-tu réagi sur le moment ?",
        "Est-ce que tu t'y attendais un peu ou pas du tout ?",
        "Allez, je t'écoute : quelle est cette histoire ?"
      ]
    },
    {
      name: "compliments",
      pattern: /\b(compliment|compliments|dis quelque chose de gentil|encourage-moi|rassure-moi)\b/i,
      replies: [
        "Tu mérites qu'on te parle avec respect, y compris quand tu traverses une période difficile.",
        "Le fait de chercher des mots pour comprendre ce que tu vis est déjà une démarche utile.",
        "Tu n'as pas besoin d'impressionner tout le monde pour avoir de la valeur.",
        "Tu peux avoir des défauts et rester quelqu'un qui mérite de l'affection.",
        "J'espère que tu pourras reconnaître tes efforts avec autant d'attention que tes erreurs.",
        "Tu as le droit d'être fier de ce que tu apprends, même si le chemin est encore long.",
        "Tu n'as pas besoin d'être utile à chaque instant pour mériter du repos.",
        "Ta valeur ne dépend pas d'une journée parfaite.",
        "Tu peux te donner un peu de la patience que tu offres aux autres.",
        "Un compliment sincère n'a pas besoin d'être spectaculaire : tu mérites la gentillesse."
      ]
    },
    {
      name: "limites numériques",
      pattern: /\b(téléphone|écran|réseaux sociaux|réseaux|scroll|notifications|internet m'épuise)\b/i,
      replies: [
        "Les notifications peuvent fragmenter l'attention. Tu pourrais essayer une courte période sans alertes.",
        "Tu n'as pas besoin de répondre instantanément à chaque message.",
        "Quelles applications te font du bien, et lesquelles te laissent plutôt épuisé ?",
        "Une petite zone sans écran dans la journée peut aider à retrouver de l'espace mental.",
        "Tu peux modifier ton environnement numérique pour qu'il te soutienne davantage.",
        "Les réseaux montrent souvent une sélection de moments, pas une vie entière.",
        "Tu veux créer une routine numérique plus reposante ?",
        "Tu peux essayer de laisser le téléphone loin de toi pendant une tâche courte.",
        "Qu'est-ce que tu aimerais faire davantage si tu passais un peu moins de temps en ligne ?",
        "L'objectif n'est pas forcément de supprimer les écrans, mais de choisir comment tu les utilises."
      ]
    },
    {
      name: "cadeaux",
      pattern: /\b(cadeau|cadeaux|offrir|anniversaire|idée cadeau|idée de cadeau)\b/i,
      replies: [
        "On peut trouver un cadeau adapté à la personne plutôt que chercher quelque chose de simplement impressionnant.",
        "Qu'est-ce que cette personne aime faire pendant son temps libre ?",
        "Un cadeau personnalisé peut être très touchant sans coûter très cher.",
        "Tu préfères offrir quelque chose d'utile, une expérience ou un souvenir personnalisé ?",
        "Quel est ton budget approximatif pour ce cadeau ?",
        "On peut chercher une idée originale à partir de trois choses que la personne aime.",
        "Une lettre sincère ou un souvenir partagé peut parfois compter énormément.",
        "Le cadeau est-il pour un ami, quelqu'un de ta famille ou ton partenaire ?",
        "Tu veux une idée rapide ou une liste d'options différentes ?",
        "On peut viser quelque chose qui montre que tu connais vraiment la personne."
      ]
    },
    {
      name: "anniversaires",
      pattern: /\b(anniversaire|mon anniversaire|son anniversaire|fêter|fête surprise)\b/i,
      replies: [
        "Tu imagines plutôt une grande fête ou un moment tranquille avec quelques personnes proches ?",
        "On peut inventer un thème d'anniversaire original.",
        "Qu'est-ce qui rendrait cette journée vraiment agréable pour toi ?",
        "Tu veux préparer une fête, écrire un message ou trouver une idée de cadeau ?",
        "Un anniversaire n'a pas besoin d'être spectaculaire pour être mémorable.",
        "On peut organiser une liste simple pour ne rien oublier.",
        "Quel genre d'ambiance veux-tu : cosy, festive, drôle ou élégante ?",
        "Tu préfères les surprises ou savoir exactement ce qui est prévu ?",
        "On peut préparer un petit discours ou un message chaleureux.",
        "Quel souvenir aimerais-tu garder de cette journée ?"
      ]
    },
    {
      name: "messages à écrire",
      pattern: /\b(écrire un message|rédiger|rédige|formuler|message à envoyer|répondre à ce message|lettre)\b/i,
      replies: [
        "Je peux t'aider à écrire un message naturel. À qui veux-tu l'envoyer et quel est son objectif ?",
        "On peut choisir le ton : chaleureux, professionnel, direct, drôle ou diplomatique.",
        "Tu peux me donner ton brouillon, même s'il est désordonné, et je le retravaillerai.",
        "Je peux proposer plusieurs versions pour que tu choisisses celle qui te ressemble.",
        "Pour un message délicat, on peut être honnête sans être inutilement blessant.",
        "Tu veux faire passer une information, présenter des excuses ou exprimer une émotion ?",
        "On peut garder une formulation courte et claire.",
        "Tu préfères que le message soit très doux ou plutôt ferme ?",
        "Je peux t'aider à trouver les mots sans parler à ta place.",
        "Dis-moi ce que tu veux absolument faire comprendre, et nous construirons le texte autour."
      ]
    },
    {
      name: "projets personnels",
      pattern: /\b(mon projet|mes projets|objectif personnel|lancer un projet|créer mon|construire mon|j'aimerais créer)\b/i,
      replies: [
        "Un projet devient plus concret quand on peut décrire sa toute première étape.",
        "Qu'est-ce qui t'a donné envie de commencer ce projet ?",
        "On peut définir une version simple que tu pourrais tester rapidement.",
        "Tu n'as pas besoin de tout construire avant de demander un premier retour.",
        "Quel résultat aimerais-tu obtenir dans un mois ?",
        "On peut séparer les idées, les tâches et les ressources nécessaires.",
        "Qu'est-ce qui te bloque actuellement : le temps, les compétences, le budget ou le doute ?",
        "Une première version imparfaite peut t'apprendre beaucoup.",
        "Quelles sont les trois fonctionnalités ou qualités les plus importantes pour toi ?",
        "Je peux t'aider à transformer cette idée en plan d'action."
      ]
    },
    {
      name: "peur de l'échec",
      pattern: /\b(peur d'échouer|peur de rater|peur de l'échec|et si j'échoue|et si je rate)\b/i,
      replies: [
        "La peur d'échouer peut être forte quand quelque chose compte vraiment pour toi.",
        "On peut réduire le risque en testant d'abord une version plus petite de ton idée.",
        "Qu'apprendrais-tu même si le résultat n'était pas celui que tu espères ?",
        "Tu peux préparer un plan B sans renoncer au plan A.",
        "L'objectif n'est pas de supprimer toute peur, mais de ne pas lui laisser décider de tout.",
        "Quel est le scénario que tu redoutes le plus concrètement ?",
        "On peut examiner la probabilité de ce scénario et les moyens de réagir s'il arrive.",
        "Tu peux te donner le droit d'apprendre en public ou en privé, selon ce qui te convient.",
        "Une tentative ne décide pas à elle seule de tout ton avenir.",
        "Quel serait un essai assez petit pour te permettre de commencer avec moins de pression ?"
      ]
    },
    {
      name: "perfectionnisme",
      pattern: /\b(perfectionniste|perfectionnisme|parfait|parfaite|jamais assez bien|peur de mal faire)\b/i,
      replies: [
        "La recherche de qualité peut être utile, mais elle devient épuisante quand rien ne semble jamais suffisant.",
        "Tu peux définir à l'avance ce qui signifie « terminé » pour cette tâche.",
        "Une version claire et utile peut être préférable à une version parfaite qui n'arrive jamais.",
        "Qu'est-ce qui se passerait réellement si tu laissais une petite imperfection ?",
        "Tu peux faire la différence entre une erreur importante et un détail esthétique.",
        "Essaie de te demander si tu exiges de toi-même quelque chose que tu n'exigerais pas d'un ami.",
        "Tu as le droit de terminer, de publier ou de montrer quelque chose sans l'améliorer indéfiniment.",
        "On peut choisir trois critères de réussite réalistes.",
        "L'apprentissage nécessite souvent des essais imparfaits.",
        "Qu'est-ce qui te ferait dire que le travail est suffisamment bon pour aujourd'hui ?"
      ]
    },
    {
      name: "procrastination",
      pattern: /\b(procrastination|procrastiner|je repousse|je remets toujours|je n'arrive pas à commencer)\b/i,
      replies: [
        "La procrastination peut parfois cacher une tâche trop floue, trop grande ou inquiétante.",
        "Quelle est la toute première action physique que tu pourrais faire ?",
        "Tu peux ouvrir le document, écrire un titre ou préparer le matériel, sans t'engager davantage.",
        "Essaie un minuteur de cinq minutes, puis décide librement si tu continues.",
        "Est-ce que tu repousses parce que tu es fatigué, parce que tu as peur ou parce que tu ne sais pas comment commencer ?",
        "On peut découper la tâche en étapes qui prennent moins de quinze minutes.",
        "Tu peux réduire les distractions avant de commencer, sans exiger une concentration parfaite.",
        "Une échéance intermédiaire peut rendre le travail plus concret.",
        "Tu n'as pas besoin de te culpabiliser pour comprendre ce qui bloque.",
        "Choisissons ensemble une action minuscule à faire maintenant."
      ]
    },
    {
      name: "nouveaux départs",
      pattern: /\b(nouveau départ|nouvelle vie|recommencer à zéro|tout recommencer|prendre un nouveau départ)\b/i,
      replies: [
        "Un nouveau départ n'exige pas forcément d'effacer tout ce qui précède.",
        "Tu peux conserver ce que tu as appris et changer ce qui ne te convient plus.",
        "Qu'aimerais-tu laisser derrière toi, et qu'aimerais-tu emporter avec toi ?",
        "On peut définir une première semaine simple plutôt qu'un plan pour toute ta vie.",
        "Tu as le droit de changer de direction lorsque tes besoins évoluent.",
        "Quel serait le premier signe concret que tu avances vers cette nouvelle étape ?",
        "Un changement durable peut commencer par une seule décision répétée.",
        "Tu n'as pas besoin de tout annoncer aux autres avant de commencer à changer quelque chose.",
        "Qu'est-ce qui te donne envie de recommencer aujourd'hui ?",
        "On peut construire un plan qui laisse aussi de la place aux imprévus."
      ]
    },
    {
      name: "soutien",
      pattern: /\b(j'ai besoin d'aide|aide-moi|j'ai besoin de soutien|je me sens dépassé|je me sens dépassée)\b/i,
      replies: [
        "D'accord, on va essayer de rendre les choses un peu plus gérables. Quelle est la difficulté principale ?",
        "Tu n'as pas besoin de présenter la situation parfaitement pour demander de l'aide.",
        "On peut commencer par ce qui doit être traité aujourd'hui, puis voir le reste.",
        "Tu préfères que je t'écoute, que je propose des solutions ou que je t'aide à faire un plan ?",
        "Demander du soutien n'est pas un échec ; c'est une façon de ne pas tout porter seul.",
        "Qu'est-ce qui te semble le plus urgent à alléger ?",
        "On peut chercher une personne ou une ressource adaptée si la situation dépasse ce qu'une conversation peut résoudre.",
        "Je peux t'aider à clarifier les options, mais tu restes libre de choisir ce qui te convient.",
        "Si tout paraît trop grand, choisissons uniquement la prochaine étape.",
        "Je t'écoute. Par quoi veux-tu commencer ?"
      ]
    },
    {
      name: "fierté personnelle",
      pattern: /\b(fier de moi|fière de moi|je suis fier|je suis fière|j'ai fait des progrès|mes progrès)\b/i,
      replies: [
        "Tu peux prendre un moment pour reconnaître ce que tu as accompli.",
        "Qu'est-ce qui te rend le plus fier de toi dans cette histoire ?",
        "Les progrès méritent d'être remarqués, même quand ils sont discrets.",
        "Tu peux apprécier ton chemin sans prétendre que tout a été facile.",
        "Qu'as-tu appris sur toi en avançant ?",
        "Tu peux garder une trace de cette réussite pour les jours où tu douteras davantage.",
        "C'est précieux de reconnaître tes efforts au lieu de regarder uniquement ce qu'il reste à faire.",
        "Quelle petite victoire aimerais-tu célébrer aujourd'hui ?",
        "Tu peux être fier de toi sans avoir besoin que tout le monde le valide.",
        "J'espère que tu te laisseras savourer ce moment."
      ]
    },
    {
      name: "besoin de parler",
      pattern: /\b(j'ai besoin de parler|faut que je parle|je veux parler|je dois vider mon sac|écoute-moi)\b/i,
      replies: [
        "Je t'écoute. Tu peux commencer par le morceau qui te vient en premier.",
        "Tu n'as pas besoin de rendre ton histoire cohérente dès le début.",
        "Je peux simplement t'écouter avant de proposer des solutions.",
        "Prends ton temps. Qu'est-ce que tu as besoin de sortir de ta tête ?",
        "Tu peux me raconter les choses dans l'ordre qui te convient.",
        "Qu'est-ce qui s'est passé aujourd'hui ?",
        "Je ne vais pas chercher à tout corriger immédiatement. Raconte-moi.",
        "Tu préfères commencer par les faits ou par ce que tu ressens ?",
        "On peut prendre cette conversation étape par étape.",
        "Je suis là pour discuter avec toi ici, et tu peux aussi chercher le soutien d'une personne de confiance."
      ]
    },
    {
      name: "relations compliquées",
      pattern: /\b(relation compliquée|relation difficile|il me comprend pas|elle me comprend pas|je ne le comprends plus|je ne la comprends plus)\b/i,
      replies: [
        "Les relations deviennent parfois difficiles quand les besoins ou les attentes ne sont pas clairement exprimés.",
        "Tu peux essayer de décrire un événement précis plutôt que de juger toute la relation d'un seul coup.",
        "Qu'est-ce qui revient le plus souvent dans vos désaccords ?",
        "Tu peux tenir à quelqu'un et reconnaître que certaines choses doivent changer.",
        "On peut réfléchir à ce que tu souhaites demander clairement.",
        "Est-ce que tu te sens écouté et respecté dans cette relation ?",
        "Une relation ne repose pas uniquement sur les efforts d'une seule personne.",
        "Tu peux prendre le temps de réfléchir à tes besoins avant une discussion importante.",
        "Qu'est-ce qui te manque le plus dans cette relation actuellement ?",
        "Si tu as peur de l'autre personne ou si elle te menace, ta sécurité passe avant la résolution du conflit."
      ]
    },
    {
      name: "peur du jugement",
      pattern: /\b(peur du jugement|peur qu'on pense|peur qu'ils pensent|que vont-ils penser|que vont-elles penser|regard des autres)\b/i,
      replies: [
        "Il est humain de se demander ce que les autres pensent, mais leur opinion ne raconte pas toute ton histoire.",
        "Tu peux réfléchir à la personne dont le jugement compte vraiment pour toi.",
        "Qu'est-ce que tu ferais différemment si tu te sentais moins observé ?",
        "Tu n'as pas besoin de convaincre tout le monde pour faire un choix qui te correspond.",
        "On peut préparer une façon simple d'expliquer ta décision si quelqu'un te pose des questions.",
        "Le jugement que tu imagines est-il quelque chose qu'une personne a réellement exprimé ?",
        "Tu peux commencer par un petit pas dans un environnement où tu te sens relativement en confiance.",
        "Il est possible que certaines personnes ne comprennent pas, et que d'autres te soutiennent.",
        "Tu as le droit d'apprendre et de changer sans devoir tout justifier.",
        "Qu'est-ce qui t'aiderait à te sentir un peu plus libre dans cette situation ?"
      ]
    },
    {
      name: "besoin de calme",
      pattern: /\b(j'ai besoin de calme|trop de bruit|trop de monde|saturé|saturée|j'en peux plus du bruit)\b/i,
      replies: [
        "On dirait que tu as besoin d'un peu d'espace. Est-ce que tu peux t'éloigner quelques instants du bruit ?",
        "Tu n'as pas à rester disponible socialement en permanence.",
        "Une pause dans un endroit moins stimulant peut parfois aider à récupérer.",
        "Tu peux réduire une source de bruit ou de notifications si tu en as la possibilité.",
        "Qu'est-ce qui te fatigue le plus : les sons, les conversations, les demandes ou l'accumulation ?",
        "Tu peux prévenir les autres que tu as besoin d'un moment tranquille.",
        "On peut garder cette conversation calme et simple.",
        "Tu préfères une activité silencieuse ou une musique douce pour faire une transition ?",
        "Le besoin de solitude temporaire ne signifie pas que tu n'aimes pas les autres.",
        "Quel petit changement rendrait ton environnement plus confortable maintenant ?"
      ]
    },
    {
      name: "idées amusantes",
      pattern: /\b(idée amusante|idées amusantes|jeu de mots|devinette|question drôle|truc drôle)\b/i,
      replies: [
        "Pourquoi les loutres sont-elles de bonnes colocataires ? Elles savent garder leur calme… et leurs cailloux.",
        "Devinette : qu'est-ce qui a des pages mais ne raconte aucune histoire tout seul ? Un carnet vide !",
        "Imagine un concours mondial du meilleur coussin. Quelle serait la catégorie reine ?",
        "Si les nuages avaient un métier, je les verrais bien travailler dans la décoration d'intérieur.",
        "On pourrait inventer un sport où le but est de faire rire l'arbitre.",
        "Question absurde : si les légumes pouvaient créer un groupe de musique, qui serait le chanteur ?",
        "Imagine un super-héros dont le seul pouvoir est de retrouver les chaussettes perdues.",
        "Si ton frigo pouvait parler, quelle serait sa première plainte ?",
        "On peut inventer trois lois pour un royaume gouverné par des chats.",
        "Tu veux continuer avec des devinettes, des jeux de mots ou des scénarios absurdes ?"
      ]
    },
    {
      name: "gratitude quotidienne",
      pattern: /\b(reconnaissant|reconnaissante|gratitude|apprécier la vie|ce que j'ai de bien)\b/i,
      replies: [
        "On peut chercher un petit détail positif sans nier ce qui est difficile.",
        "Quel moment de la journée aimerais-tu conserver dans ta mémoire ?",
        "La gratitude peut être discrète : un repas agréable, un message ou un moment de repos.",
        "Tu n'as pas besoin de te sentir reconnaissant tout le temps pour apprécier certaines choses.",
        "Quelle personne a rendu ta journée un peu plus facile récemment ?",
        "Quel objet du quotidien apprécies-tu plus que tu ne le remarques habituellement ?",
        "On peut noter une chose agréable, une chose apprise et une chose que tu attends avec curiosité.",
        "Qu'est-ce qui t'a apporté un peu de confort cette semaine ?",
        "Tu peux apprécier ce qui va bien sans minimiser ce qui ne va pas.",
        "Quel petit plaisir aimerais-tu rendre plus présent dans tes journées ?"
      ]
    },
    {
      name: "choix de carrière",
      pattern: /\b(métier|carrière|orientation professionnelle|changer de métier|reconversion|études supérieures)\b/i,
      replies: [
        "Choisir une direction professionnelle peut demander du temps. On peut commencer par tes intérêts et tes contraintes.",
        "Quelles activités te donnent de l'énergie, même lorsqu'elles demandent un effort ?",
        "Tu peux explorer un métier en parlant à quelqu'un qui le pratique ou en réalisant un petit projet.",
        "On peut comparer plusieurs options selon les compétences, le quotidien, la formation et les perspectives.",
        "Tu n'as pas besoin de connaître immédiatement le métier idéal.",
        "Qu'est-ce qui compte le plus pour toi : la stabilité, la créativité, l'autonomie, l'utilité ou autre chose ?",
        "Une expérience courte peut parfois clarifier une envie mieux qu'une longue réflexion abstraite.",
        "Tu peux tenir compte de tes besoins financiers sans abandonner tous tes intérêts.",
        "Quelles compétences aimerais-tu utiliser davantage dans ton quotidien ?",
        "On peut construire une liste de questions à poser avant de choisir une formation ou un métier."
      ]
    },
    {
      name: "relations sociales",
      pattern: /\b(parler aux gens|rencontrer des gens|me faire des amis|relations sociales|timide|timidité|conversation difficile)\b/i,
      replies: [
        "Tu n'as pas besoin d'être la personne la plus extravertie de la pièce pour créer des liens.",
        "Une question simple sur un intérêt commun peut suffire à lancer une conversation.",
        "Tu peux viser une interaction courte plutôt que te mettre la pression pour être immédiatement à l'aise.",
        "La timidité ne t'empêche pas d'avoir des relations profondes.",
        "Quelles situations sociales te semblent les plus difficiles ?",
        "On peut préparer quelques phrases d'ouverture adaptées à l'endroit où tu vas.",
        "Tu peux chercher des activités où les gens partagent déjà un centre d'intérêt avec toi.",
        "Une conversation n'a pas besoin d'être brillante pour être agréable.",
        "Tu as le droit de prendre des pauses quand tu te sens socialement fatigué.",
        "Quel petit pas social te semblerait réalisable cette semaine ?"
      ]
    },
    {
      name: "émotions mélangées",
      pattern: /\b(émotions mélangées|sentiments contradictoires|à la fois heureux et triste|à la fois contente et triste|je ne sais pas ce que je ressens)\b/i,
      replies: [
        "Tu peux ressentir plusieurs choses à la fois sans que l'une annule l'autre.",
        "On peut essayer de nommer chaque émotion séparément, sans devoir les résoudre immédiatement.",
        "Quelles sont les deux émotions qui semblent se mélanger le plus ?",
        "Il est possible d'être heureux d'un changement et triste de ce qu'on laisse derrière soi.",
        "Tu n'as pas besoin de choisir une seule émotion pour rendre ton expérience légitime.",
        "On peut examiner ce que chaque émotion essaie peut-être de signaler.",
        "Est-ce que ces sentiments apparaissent dans des moments différents ou exactement en même temps ?",
        "Tu peux prendre le temps de comprendre ce mélange avant de décider quoi faire.",
        "Les émotions ne sont pas toujours des instructions ; elles peuvent être des informations à explorer.",
        "Qu'aimerais-tu respecter dans chacun de ces sentiments ?"
      ]
    },
    {
      name: "petits objectifs",
      pattern: /\b(petit objectif|objectif de la journée|objectif de la semaine|progresser un peu|petite étape)\b/i,
      replies: [
        "Choisissons un objectif suffisamment petit pour pouvoir le réaliser même lors d'une journée chargée.",
        "Un bon petit objectif est concret : tu peux reconnaître quand il est terminé.",
        "Qu'est-ce qui ferait une différence utile d'ici ce soir ?",
        "Tu peux prévoir une version minimale et une version bonus de ton objectif.",
        "Une seule action répétée peut produire des progrès au fil du temps.",
        "On peut choisir un objectif qui prend moins de dix minutes.",
        "Qu'est-ce qui risque de te distraire, et comment peux-tu préparer une solution ?",
        "Tu peux mesurer le progrès par l'effort et l'apprentissage, pas uniquement par le résultat final.",
        "Quel objectif te donnerait une sensation de clarté plutôt qu'une pression supplémentaire ?",
        "On peut faire un point à la fin de la journée et ajuster le plan."
      ]
    },
    {
      name: "questions existentielles",
      pattern: /\b(pourquoi suis-je là|pourquoi on existe|sens de mon existence|à quoi bon|quelle est ma place)\b/i,
      replies: [
        "Ces questions peuvent être immenses. On peut les approcher à partir de ce qui compte concrètement pour toi.",
        "Tu n'as pas besoin de trouver une réponse définitive à toute ton existence aujourd'hui.",
        "Quelles expériences te donnent parfois l'impression que la vie a du sens ?",
        "Le sens peut venir des relations, de la création, de la découverte, du soin ou d'autres choses encore.",
        "Tu veux explorer une approche philosophique ou parler de ce que cette question représente pour toi ?",
        "Il est possible de construire du sens progressivement, plutôt que de le découvrir comme une réponse cachée.",
        "Qu'est-ce que tu aimerais apporter au monde, même à petite échelle ?",
        "Tu peux avoir des périodes de doute sans que cela annule tout ce qui compte pour toi.",
        "On peut comparer plusieurs perspectives philosophiques sans en imposer une.",
        "Qu'est-ce qui te ferait sentir que ta vie ressemble davantage à celle que tu souhaites vivre ?"
      ]
    },
    {
      name: "prendre soin de soi",
      pattern: /\b(prendre soin de moi|self-care|prendre du temps pour moi|m'occuper de moi|me néglige)\b/i,
      replies: [
        "Prendre soin de toi peut commencer par un besoin simple : manger, boire, dormir ou faire une pause.",
        "Tu n'as pas besoin d'une routine compliquée pour te traiter avec attention.",
        "Qu'est-ce que tu repousses souvent alors que cela te ferait du bien ?",
        "Tu peux choisir une activité agréable qui ne demande ni performance ni résultat.",
        "Le repos et les loisirs font partie d'une vie équilibrée.",
        "On peut créer une petite liste de choses qui t'aident lorsque tu te sens débordé.",
        "Quel besoin de base mériterait un peu plus d'attention aujourd'hui ?",
        "Tu peux demander du soutien au lieu d'essayer de tout gérer seul.",
        "Prendre soin de toi ne signifie pas ignorer tes responsabilités, mais chercher un équilibre soutenable.",
        "Quel geste bienveillant pourrais-tu faire pour toi dans les dix prochaines minutes ?"
      ]
    },
    {
      name: "peur de décevoir",
      pattern: /\b(peur de décevoir|décevoir les autres|décevoir mes parents|j'ai déçu|j'ai déçue)\b/i,
      replies: [
        "La peur de décevoir peut pousser à accepter des choses qui ne nous conviennent pas.",
        "Tu peux tenir compte des attentes des autres sans leur confier toutes tes décisions.",
        "Qu'est-ce que tu crains qu'il se passe si tu ne réponds pas à cette attente ?",
        "Tu peux être honnête sur tes limites, même si la conversation est inconfortable.",
        "Décevoir quelqu'un dans une situation ne signifie pas forcément le trahir ou l'abandonner.",
        "On peut distinguer une responsabilité réelle d'une attente impossible à satisfaire.",
        "Tu n'as pas à être parfait pour mériter l'affection des autres.",
        "Quelle attente aimerais-tu pouvoir discuter plus ouvertement ?",
        "Tu peux proposer une autre solution au lieu d'accepter quelque chose que tu ne peux pas tenir.",
        "On peut préparer une réponse qui reste respectueuse de l'autre et de toi-même."
      ]
    },
    {
      name: "espoir",
      pattern: /\b(espoir|garder espoir|ça ira mieux|aller mieux|positif|positive)\b/i,
      replies: [
        "Garder de l'espoir ne signifie pas prétendre que tout est facile.",
        "Tu peux reconnaître la difficulté actuelle tout en laissant une place à la possibilité d'un changement.",
        "Quel petit signe te ferait penser que les choses commencent à évoluer ?",
        "Tu n'as pas besoin de connaître la fin de l'histoire pour faire le prochain pas.",
        "On peut chercher ce qui est encore possible, même si tout n'est pas sous ton contrôle.",
        "Un progrès peut être discret et rester important.",
        "Tu peux t'appuyer sur les personnes et les ressources qui t'ont déjà aidé auparavant.",
        "Qu'aimerais-tu retrouver dans ta vie, même progressivement ?",
        "L'espoir peut être une petite ouverture, pas une certitude absolue.",
        "On peut choisir une action réaliste qui rend demain un peu plus facile."
      ]
    },
    {
      name: "repos",
      pattern: /\b(repos|me reposer|pause|vacances|récupérer|recuperer|je n'arrive pas à me détendre)\b/i,
      replies: [
        "Tu peux te reposer sans transformer ce moment en une tâche à réussir.",
        "Qu'est-ce qui te permet réellement de récupérer : le silence, le mouvement, les contacts ou le temps seul ?",
        "On peut imaginer une pause de quinze minutes adaptée à ton énergie.",
        "Tu n'as pas besoin de remplir chaque moment libre.",
        "Parfois, choisir une seule chose agréable suffit pour changer le rythme.",
        "Est-ce que tu as du mal à trouver du temps pour te reposer ou à décrocher mentalement ?",
        "Tu peux commencer par retirer une obligation non essentielle de ta journée.",
        "Le repos peut être actif ou tranquille selon tes besoins.",
        "Qu'aimerais-tu faire si tu n'avais aucune obligation pendant une heure ?",
        "On peut construire une routine de récupération réaliste pour tes journées chargées."
      ]
    }
  ];

  // --------------------------------------------------------
  // FIN DE L'EXTENSION DE THÈMES
  // --------------------------------------------------------

  ];

  // --------------------------------------------------------
  // 7. RÉPONSES GÉNÉRALES
  // --------------------------------------------------------

  const defaultReplies = [
    "Je t'écoute. Qu'est-ce que tu as en tête ?",
    "On peut parler de ce que tu veux, même si tu ne sais pas encore exactement comment le formuler.",
    "Tu veux me donner un peu plus de contexte pour que je puisse mieux t'aider ?",
    "Je peux t'aider à réfléchir, organiser tes idées ou simplement discuter avec toi.",
    "Qu'est-ce qui te paraît le plus important dans ce que tu viens de dire ?",
    "Je ne veux pas supposer trop vite ce que tu ressens. Tu peux m'en dire davantage ?",
    "On peut chercher une réponse pratique ou explorer la question plus tranquillement.",
    "Je suis là pour cette conversation. Par où aimerais-tu commencer ?",
    "Tu peux me donner un exemple concret si cela aide à expliquer ton idée.",
    "Qu'aimerais-tu obtenir de notre échange : des idées, une explication ou une écoute attentive ?",
    "On peut prendre le sujet sous plusieurs angles.",
    "Je peux me tromper dans mon interprétation, alors corrige-moi si je comprends mal.",
    "Raconte-moi ce qui t'a amené à penser à ça.",
    "Quel serait le résultat le plus utile pour toi ?",
    "On peut commencer par une toute petite question.",
    "Je suis prêt à explorer cette idée avec toi.",
    "Tu peux aussi changer de sujet si tu en as envie.",
    "Je peux t'aider à faire le tri entre les différentes possibilités.",
    "Qu'est-ce que tu aimerais approfondir ?",
    "On peut garder les choses simples et avancer étape par étape."
  ];

  // --------------------------------------------------------
  // 8. RÉPONSES SPÉCIALES ET SÉCURITÉ
  // --------------------------------------------------------

  const crisisPattern =
    /\b(suicide|me tuer|me faire du mal|mettre fin à mes jours|ne veux plus vivre|plus envie de vivre|automutilation|me blesser volontairement)\b/i;

  const identityPattern =
    /\b(tu es une vraie ia|tu es une ia|es-tu une ia|qui es-tu|tu es humain|tu es humaine|tu es un robot)\b/i;

  const identityReplies = [
    "Je suis Loutre, un assistant virtuel. Je ne suis pas une personne humaine, mais je peux discuter avec toi et t'aider à réfléchir.",
    "Je suis une IA conversationnelle. Je n'ai pas de vie personnelle ni de sentiments humains, mais je peux répondre avec attention.",
    "Je ne suis pas un humain ni une vraie loutre : je suis un programme conçu pour converser et aider."
  ];

  const crisisReplies = [
    "Je suis vraiment désolé que tu traverses quelque chose d'aussi lourd. Si tu risques de te faire du mal maintenant, essaie de rejoindre une personne de confiance et de t'éloigner de ce qui pourrait te blesser. En France, tu peux appeler le 3114 gratuitement, 24 h/24. En cas de danger immédiat, appelle le 15 ou le 112. Est-ce que tu es en sécurité en ce moment ?",
    "Merci de me le dire. Tu ne devrais pas avoir à affronter ça seul. En France, le 3114 est disponible gratuitement jour et nuit ; en cas de danger immédiat, appelle le 15 ou le 112. Essaie de contacter maintenant quelqu'un de confiance. Es-tu en danger immédiat ?"
  ];

  // --------------------------------------------------------
  // 9. OUTILS POUR VARIER LES RÉPONSES
  // --------------------------------------------------------

  function chooseRandom(items) {
    if (!items || items.length === 0) {
      return "Je t'écoute.";
    }

    if (items.length === 1) {
      return items[0];
    }

    let choice = items[
      Math.floor(Math.random() * items.length)
    ];

    let attempts = 0;

    while (
      choice === state.lastReply &&
      attempts < 8
    ) {
      choice = items[
        Math.floor(Math.random() * items.length)
      ];

      attempts += 1;
    }

    return choice;
  }

  function normalizeText(text) {
    return String(text || "")
      .toLocaleLowerCase("fr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function detectTheme(text) {
   
function detectTheme(text) {
  const normalized = normalizeText(text);

  // Priorité aux formulations qui ont un sens très précis.
  const priorityThemes = [
    "soutien",
    "relations compliquées",
    "peur de l'échec",
    "peur de décevoir",
    "peur du jugement",
    "émotions mélangées",
    "questions existentielles",
    "petits objectifs",
    "projets personnels",
    "messages à écrire",
    "limites personnelles",
    "besoin de parler",
    "créer",
    "famille",
    "regrets",
    "rêves",
    "voyages",
    "animaux",
    "jeux",
    "musique",
    "films",
    "nourriture",
    "nature",
    "philosophie",
    "souvenirs",
    "conflits",
    "décisions",
    "habitudes",
    "procrastination",
    "perfectionnisme",
    "nouveaux départs",
    "peur de décevoir",
    "fierté personnelle",
    "besoin de calme",
    "petites joies",
    "compliments",
    "prendre soin de soi",
    "repos",
    "espoir"
  ];

  for (const name of priorityThemes) {
    const theme = themes.find(item => item.name === name);

    if (theme && theme.pattern.test(text)) {
      return theme;
    }
  }

  // Recherche générale dans l'ensemble de la bibliothèque.
  for (const theme of themes) {
    if (theme.pattern.test(text)) {
      return theme;
    }
  }

  // Aucune correspondance : le moteur utilisera ses réponses générales.
  return null;
}


    // Évite de répéter trop souvent la même réponse.
    if (state.recentReplies.includes(reply)) {
      const alternatives = theme
        ? theme.replies.filter(
            item => !state.recentReplies.includes(item)
          )
        : defaultReplies.filter(
            item => !state.recentReplies.includes(item)
          );

      if (alternatives.length > 0) {
        reply = chooseRandom(alternatives);
      }
    }

    // Ajoute parfois une question de relance.
    if (
      state.turns > 1 &&
      !crisisPattern.test(text) &&
      !identityPattern.test(text) &&
      Math.random() < 0.25
    ) {
      reply += "\n\n" + chooseRandom(followUpQuestions);
    }

    // Ajoute parfois une phrase douce supplémentaire.
    if (
      state.turns > 1 &&
      !crisisPattern.test(text) &&
      Math.random() < 0.20
    ) {
      reply += "\n\n" + chooseRandom(encouragements);
    }

    return reply;
  }

  // --------------------------------------------------------
  // 10. AFFICHAGE DES MESSAGES
  // --------------------------------------------------------

  function addMessage(role, text) {
    const bubble = document.createElement("div");

    bubble.className = "message " + role;
    bubble.textContent = text;
    bubble.setAttribute("role", "listitem");

    messages.appendChild(bubble);

    chat.scrollTop = chat.scrollHeight;

    return bubble;
  }

  function showTyping() {
    const typing = document.createElement("div");

    typing.className = "message bot typing";
    typing.setAttribute("aria-label", "Loutre réfléchit");
    typing.textContent = "Loutre réfléchit…";

    messages.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    return typing;
  }

  function setWelcomeVisible(visible) {
    if (welcome) {
      welcome.hidden = !visible;
    }
  }

  // --------------------------------------------------------
  // 11. ENVOI ET TRAITEMENT DES MESSAGES
  // --------------------------------------------------------

  function sendMessage(value) {
    const text = String(value || "").trim();

    if (!text) {
      return;
    }

    if (text.length > 1200) {
      addMessage(
        "bot",
        "Ton message est très long. Tu peux le partager en plusieurs parties pour qu'on puisse le traiter plus facilement."
      );

      return;
    }

    setWelcomeVisible(false);

    addMessage("user", text);

    state.conversation.push({
      role: "user",
      text: text,
      time: Date.now()
    });

    state.turns += 1;

    prompt.value = "";
    prompt.style.height = "auto";

    const typing = showTyping();

    const delay = Math.min(
      1000,
      Math.max(300, text.length * 7)
    );

    window.setTimeout(() => {
      typing.remove();

      const reply = buildReply(text);

      state.lastReply = reply;

      state.recentReplies.push(reply);

      if (state.recentReplies.length > 12) {
        state.recentReplies.shift();
      }

      state.conversation.push({
        role: "bot",
        text: reply,
        time: Date.now()
      });

      addMessage("bot", reply);
    }, delay);
  }

  // --------------------------------------------------------
  // 12. FORMULAIRE ET CLAVIER
  // --------------------------------------------------------

  composer.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(prompt.value);
  });

  prompt.addEventListener("keydown", event => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage(prompt.value);
    }
  });

  prompt.addEventListener("input", () => {
    prompt.style.height = "auto";

    prompt.style.height =
      Math.min(prompt.scrollHeight, 150) + "px";
  });

  // --------------------------------------------------------
  // 13. BOUTONS DE SUGGESTION DE LA PAGE D'ACCUEIL
  // --------------------------------------------------------

  document
    .querySelectorAll(".suggestion")
    .forEach(button => {
      button.addEventListener("click", () => {
        sendMessage(button.textContent);
      });
    });

  // --------------------------------------------------------
  // 14. NOUVELLE CONVERSATION
  // --------------------------------------------------------

  if (newChatButton) {
    newChatButton.addEventListener("click", () => {
      messages.replaceChildren();

      state.turns = 0;
      state.lastTheme = "";
      state.lastReply = "";
      state.recentReplies = [];
      state.conversation = [];

      prompt.value = "";
      prompt.style.height = "auto";

      setWelcomeVisible(true);
      prompt.focus();
    });
  }

  // --------------------------------------------------------
  // 15. BOUTON DE BOOST
  // --------------------------------------------------------

  const boostButton = document.createElement("button");

  boostButton.type = "button";
  boostButton.className = "suggestion boost-button";
  boostButton.textContent = "✨ J'ai besoin d'un boost";

  boostButton.addEventListener("click", () => {
    sendMessage(
      "J'ai besoin d'un petit boost de motivation."
    );
  });

  const parent = composer.parentElement;

  if (parent) {
    const wrapper = document.createElement("div");

    wrapper.className = "boost-wrap";
    wrapper.appendChild(boostButton);

    parent.insertBefore(wrapper, composer);
  }

  // --------------------------------------------------------
  // 16. SERVICE WORKER : MISE À JOUR DU CACHE
  // --------------------------------------------------------

  if (
    "serviceWorker" in navigator &&
    location.protocol.startsWith("http")
  ) {
    window.addEventListener("load", async () => {
      try {
        const registration =
          await navigator.serviceWorker.register(
            "./sw.js",
            { updateViaCache: "none" }
          );

        await registration.update();
      } catch (error) {
        console.warn(
          "Loutre : mise à jour du cache indisponible.",
          error
        );
      }
    });
  }

  // --------------------------------------------------------
  // 17. INITIALISATION
  // --------------------------------------------------------

  console.info(
    "Loutre est prête ! Thèmes disponibles :",
    themes.length
  );
})();
