
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
    }
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
    const normalized = normalizeText(text);

    for (const theme of themes) {
      if (theme.pattern.test(text)) {
        return theme;
      }

      if (
        theme.name === "salutations" &&
        /^(salut|coucou|bonjour|hello|hey|bonsoir)\b/.test(normalized)
      ) {
        return theme;
      }
    }

    return null;
  }

  function buildReply(text) {
    if (crisisPattern.test(text)) {
      return chooseRandom(crisisReplies);
    }

    if (identityPattern.test(text)) {
      return chooseRandom(identityReplies);
    }

    const theme = detectTheme(text);

    let reply;

    if (theme) {
      reply = chooseRandom(theme.replies);
      state.lastTheme = theme.name;
    } else {
      reply = chooseRandom(defaultReplies);
      state.lastTheme = "général";
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
