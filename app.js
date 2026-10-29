(() => {
  "use strict";

  const chat = document.querySelector("#chat");
  const messages = document.querySelector("#messages");
  const composer = document.querySelector("#composer");
  const prompt = document.querySelector("#prompt");
  const welcome = document.querySelector("#welcome");
  const newChatButton = document.querySelector("#newChat");
  if (!chat || !messages || !composer || !prompt) return;

  const state = { turns: 0, previousTheme: "", recentReplies: [], conversation: [], pending: false };
  let pendingTimer = null;

  const themes = [
    { name: "salut", pattern: /\b(bonjour|salut|coucou|hello|hey|bonsoir|yo)\b/i, replies: ["Coucou ! Bienvenue dans le coin positif de Loutre. Comment tu te sens aujourd'hui ?", "Salut ! Tu arrives avec une histoire, une question ou juste envie de papoter ?", "Bonjour ! Je suis prête à mettre un peu de soleil dans la conversation. Quoi de neuf ?", "Hey ! Choisis ton aventure : papotage, mini-jeu ou petit coup de boost ?", "Coucou ! Même les journées ordinaires ont parfois un détail sympa à dénicher. La tienne a commencé comment ?", "Bonsoir ! On fait le bilan de la journée ou on parle d'autre chose ?"] },
    { name: "tristesse", pattern: /\b(triste|tristesse|chagrin|pleur|malheureux|malheureuse|peine|déprimé|déprimée|morose)\b/i, replies: ["Oh, je suis désolée que ce soit lourd en ce moment. Pas besoin de faire semblant : je peux t'écouter. Qu'est-ce qui pèse le plus ?", "Merci de me le dire. La tristesse a le droit d'être là ; on peut quand même chercher ce qui te ferait un tout petit peu de bien.", "Je ne vais pas te lancer un 'souris, tout va bien' magique. Je peux rester avec toi dans ce moment. Tu veux raconter ce qui s'est passé ?", "Ça a l'air difficile. On peut commencer minuscule : tu préfères être écouté·e, penser à une distraction douce, ou chercher une prochaine étape ?", "Même si tu ne vois pas encore d'issue, tu n'as pas à tout porter seul·e. Y a-t-il quelqu'un de confiance à qui tu pourrais parler aussi ?"] },
    { name: "stress", pattern: /\b(stress|angoiss|anxi|panique|inquiet|inquiète|peur|pression|débordé|débordée)\b/i, replies: ["On va réduire le grand nuage à une petite étape. Qu'est-ce qui demande ton attention en premier ?", "Je comprends, ça peut faire beaucoup. Si ça te convient, pose les pieds au sol et prends une expiration lente. Puis on démêle une chose à la fois.", "Ton cerveau a ouvert quinze onglets ? On peut en fermer un ensemble : qu'est-ce qui est urgent, et qu'est-ce qui peut attendre ?", "Tu n'as pas besoin d'avoir un plan parfait. Quel serait le prochain pas faisable en cinq minutes ?", "Merci de me l'avoir confié. Est-ce une inquiétude pour quelque chose à venir, ou quelque chose qui s'est déjà passé ?"] },
    { name: "confiance", pattern: /\b(nul|nulle|incapable|inutile|pas capable|doute de moi|confiance|raté|ratée|bon à rien|bonne à rien)\b/i, replies: ["Une erreur ou un doute ne résume pas toute ta personne. Qu'est-ce qui t'a fait te parler aussi durement aujourd'hui ?", "Tu peux être en apprentissage et avoir déjà de la valeur. Quel petit effort as-tu fait récemment, même imparfait ?", "Si ton ami·e disait ça de soi, tu lui répondrais quoi ? On peut essayer de t'offrir la même gentillesse.", "La confiance se construit souvent en petites preuves, pas en grand discours. Quelle mini-action serait à ta portée ?", "Je vote pour une évaluation plus juste : difficulté rencontrée, oui ; personne nulle, non. Qu'est-ce qui s'est passé ?"] },
    { name: "école", pattern: /\b(école|collège|lycée|cours|devoir|prof|classe|examen|contrôle|étude|révision|note)\b/i, replies: ["On peut transformer la montagne de travail en petits cailloux. Quelle matière ou tâche passe en premier ?", "Une note parle d'un devoir à un moment donné, pas de tout ton potentiel. Tu veux comprendre une notion ou préparer un plan de révision ?", "Mode révisions encourageantes activé ! On peut faire un sprint de 15 minutes, une pause, puis un deuxième si tu veux. Quel sujet ?", "Si tu partages l'énoncé, je peux t'aider à le découper en étapes. On commence par ce que tu comprends déjà.", "C'est quoi le plus gros caillou : quantité, difficulté, manque de temps ou peur du résultat ?"] },
    { name: "travail", pattern: /\b(travail|boulot|emploi|collègue|patron|bureau|carrière|réunion|stage)\b/i, replies: ["On va remettre un peu d'ordre dans le bureau mental. Qu'est-ce qui te pèse le plus au travail ?", "Tu n'as pas à résoudre toute ta carrière avant le déjeuner. Quelle décision ou tâche est la plus proche ?", "On peut écrire ensemble un message professionnel clair et cordial. À qui s'adresse-t-il et quel résultat souhaites-tu ?", "Une liste de trois priorités peut suffire pour reprendre la main. Qu'est-ce qui est vraiment urgent aujourd'hui ?", "Même une journée compliquée peut contenir une prochaine étape utile. Laquelle te semblerait réaliste ?"] },
    { name: "fatigue", pattern: /\b(fatigué|fatiguée|épuisé|épuisée|crevé|crevée|sommeil|dormir|burn.?out)\b/i, replies: ["Le repos compte, même si la liste des choses à faire n'est pas vide. Est-ce que tu peux t'accorder une petite pause ?", "Ça ressemble à une batterie bien basse. Qu'est-ce qui pourrait être simplifié ou reporté aujourd'hui ?", "Tu n'as pas besoin de transformer chaque moment libre en moment productif. Une pause douce, ça pourrait être quoi pour toi ?", "Tu te sens surtout fatigué·e physiquement, mentalement, ou un peu des deux ?", "Si cette fatigue dure ou devient inhabituelle, en parler à un professionnel de santé serait une bonne prochaine étape. Pour maintenant, qu'est-ce qui peut attendre ?"] },
    { name: "motivation", pattern: /\b(motivation|flemme|procrastin|pas envie|remettre à demain|commencer|bloqué|bloquée)\b/i, replies: ["On baisse la difficulté du départ : quelle version de cette tâche prendrait seulement deux minutes ?", "Pas besoin d'attendre une motivation étincelante. On peut commencer tout petit, puis décider après cinq minutes si on continue.", "Le mode 'premier pas ridicule' est activé. Ouvrir le document, sortir les chaussures, écrire un titre : tu choisis quoi ?", "Qu'est-ce qui bloque surtout : fatigue, peur de mal faire, tâche floue ou trop grosse ?", "Une action brouillonne peut être un excellent brouillon. Quel serait ton premier geste ?"] },
    { name: "amitié", pattern: /\b(ami|amie|amitié|pote|meilleur ami|meilleure amie|copain|copine)\b/i, replies: ["Les amitiés peuvent être chouettes et compliquées à la fois. Qu'est-ce qui s'est passé entre vous ?", "Tu peux tenir à quelqu'un et avoir besoin de poser une limite. Tu veux réparer, clarifier ou simplement vider ton sac ?", "Un malentendu n'est pas toujours la fin de l'histoire. Qu'aimerais-tu que l'autre personne comprenne ?", "On peut préparer un message simple et bienveillant ensemble si tu veux.", "Qu'est-ce que tu aimerais retrouver dans cette amitié ?"] },
    { name: "amour", pattern: /\b(amour|amoureux|amoureuse|crush|couple|petit ami|petite amie|rencard|relation)\b/i, replies: ["Les sentiments ont parfois leur propre météo ! Cette histoire te rend plutôt heureux·se, inquiet·ète, ou les deux ?", "Tu peux avancer à ton rythme et garder tes besoins dans l'équation. Qu'est-ce qui te plaît dans cette personne ?", "On peut réfléchir à une manière honnête de dire ce que tu ressens, sans exiger un résultat précis.", "Une relation chouette laisse de la place au respect, à la confiance et à la communication. Qu'est-ce que tu aimerais voir évoluer ?", "Tu veux des idées pour un message, un rendez-vous ou juste en parler ?"] },
    { name: "famille", pattern: /\b(famille|maman|papa|parents|mère|père|frère|sœur|soeur|cousin|cousine)\b/i, replies: ["Les liens familiaux peuvent être précieux et compliqués en même temps. Qu'est-ce qui se passe ?", "Tu as le droit d'avoir un point de vue différent. Qu'aimerais-tu que ta famille comprenne ?", "On peut chercher une phrase calme pour exprimer ce que tu ressens, sans oublier tes limites.", "Tu veux parler d'un événement précis ou d'une situation qui dure ?", "Tu n'as pas à résoudre toute la situation familiale en une seule conversation. Quelle serait une petite amélioration ?"] },
    { name: "joie", pattern: /\b(content|contente|heureux|heureuse|joie|génial|super|réussi|réussite|fier|fière|bonne nouvelle|ça va bien)\b/i, replies: ["Yesss, ça mérite un petit feu d'artifice imaginaire ! Qu'est-ce qui s'est passé ?", "Je suis ravie de célébrer ça avec toi. Quel détail te rend le plus fier·ère ?", "Une bonne nouvelle ! On prend une seconde pour la savourer : tu veux me raconter ?", "Ça fait plaisir à lire. Tu as contribué comment à ce joli résultat ?", "On ajoute cette victoire à la collection des preuves que de belles choses arrivent. Comment tu veux fêter ça ?"] },
    { name: "ennui", pattern: /\b(ennui|ennuyé|ennuyée|je m'ennuie|rien à faire)\b/i, replies: ["Opération anti-ennui ! Tu veux un mini-jeu, une question absurde, une histoire à inventer ou une idée d'activité ?", "Défi Loutre : trouve trois objets près de toi et on leur invente une mission secrète.", "Si ta journée était un film, quel titre bizarre elle aurait ?", "On peut jouer à 'tu préfères' : vivre dans une cabane dans les arbres ou un phare au bord de la mer ?", "Je te propose une mission de 60 secondes : repérer quelque chose de joli autour de toi. Tu as trouvé quoi ?"] },
    { name: "créativité", pattern: /\b(dessin|dessiner|écrire|musique|créatif|créative|art|inventer|histoire|idée de projet)\b/i, replies: ["Oh, terrain fertile pour les idées ! Tu veux du drôle, du doux, du mystérieux ou du complètement loufoque ?", "On peut faire une première version brouillonne, puis lui donner des paillettes. Qu'est-ce que tu imagines ?", "Donne-moi trois mots au hasard et je les transforme en début d'histoire.", "Une contrainte amusante peut débloquer l'imagination : ton personnage principal est une loutre astronaute. Que se passe-t-il ?", "Tu veux développer une idée que tu as déjà ou en chercher une nouvelle ensemble ?"] },
    { name: "décision", pattern: /\b(décision|décider|choisir|choix|j'hésite|hésitation|je ne sais pas quoi faire)\b/i, replies: ["On peut comparer les options sans chercher la perfection. Quelles sont les possibilités ?", "Est-ce une décision réversible ? Un petit test pourrait t'apprendre quelque chose sans tout miser.", "Qu'est-ce qui compte le plus pour toi dans ce choix : temps, énergie, curiosité, sécurité ou autre chose ?", "On peut noter pour chaque option : un avantage, un coût et une prochaine étape. Tu veux essayer ?", "Tu n'as pas à décider à ma place ni à trouver la réponse parfaite. Quelle option te rend un peu curieux·se ?"] },
    { name: "repos", pattern: /\b(repos|pause|vacances|récupérer|me détendre|relax|calme|respirer)\b/i, replies: ["Une pause n'a pas besoin d'être méritée. Qu'est-ce qui te ferait du bien : silence, musique, mouvement ou boisson chaude ?", "On peut imaginer une pause de dix minutes adaptée à ton énergie. Tu préfères dehors ou dedans ?", "Mode douceur activé : quelle obligation non essentielle pourrait attendre un peu ?", "Tu récupères mieux seul·e, avec quelqu'un, ou en faisant une activité tranquille ?", "Choisis un petit confort pour les prochaines minutes. Lequel te tente ?"] },
    { name: "merci", pattern: /\b(merci|remercie|c'est gentil|ça m'aide|tu m'aides)\b/i, replies: ["Avec plaisir ! Je suis contente que ça t'ait été utile. On continue ou on savoure la petite avancée ?", "Merci à toi de m'avoir raconté ça. Tu peux revenir quand tu veux pour papoter.", "Toujours partante pour chercher une piste avec toi ! Quel est le prochain sujet ?", "Ça me fait plaisir d'avoir aidé. Et hop, un point positif pour notre équipe !"] },
    { name: "animaux", pattern: /\b(animal|animaux|chien|chat|chaton|chiot|lapin|oiseau|cheval|loutre)\b/i, replies: ["Sujet d'excellence ! Quel animal te met instantanément de bonne humeur ?", "Si ton animal avait un métier, ce serait quoi ?", "Les loutres sont évidemment consultantes en câlins imaginaires. Tu as un animal préféré ?", "Inventons un animal fantastique : il a trois pouvoirs. Lesquels ?", "Tu as un souvenir drôle ou touchant avec un animal ?"] },
    { name: "nourriture", pattern: /\b(nourriture|manger|cuisine|recette|repas|pizza|pâtes|chocolat|dessert|gâteau)\b/i, replies: ["Question capitale : quel plat pourrait améliorer une journée ordinaire ?", "On peut chercher une recette simple avec ce que tu as sous la main. Quels ingrédients ?", "Si tu inventais un restaurant, quelle serait sa spécialité et son nom ?", "Team sucré, salé, épicé ou un peu de tout ?", "Imagine un pique-nique parfait : qu'est-ce qu'on met dans le panier ?"] },
    { name: "musique", pattern: /\b(musique|chanson|chanteur|chanteuse|album|concert|mélodie|playlist)\b/i, replies: ["Quelle chanson te donne envie de danser, même un tout petit peu ?", "Si ta journée avait une bande-son, quel genre musical jouerait ?", "Tu préfères les paroles, la mélodie ou l'ambiance générale ?", "Quel artiste aimerais-tu voir en concert ?", "On invente une playlist imaginaire pour remonter le moral : quel serait le premier morceau ?"] },
    { name: "films", pattern: /\b(film|cinéma|acteur|actrice|réalisateur|série|épisode)\b/i, replies: ["Tu préfères les histoires qui font rire, réfléchir, frissonner ou pleurer un bon coup ?", "Quel film aimerais-tu revoir comme si c'était la première fois ?", "Si ta vie était un film aujourd'hui, quel en serait le titre ?", "Quel univers de fiction aimerais-tu visiter pendant une journée ?", "Donne-moi une ambiance et je te propose une idée de scénario loufoque."] },
    { name: "voyage", pattern: /\b(voyage|voyager|vacances|destination|avion|train|week-end|weekend)\b/i, replies: ["Si tu pouvais partir demain, tu choisirais mer, montagne, forêt ou grande ville ?", "Tu aimes les voyages spontanés ou les itinéraires bien préparés ?", "Quel souvenir de voyage aimerais-tu créer un jour ?", "On peut rêver une escapade avec découvertes et pauses gourmandes. Où va-t-on ?", "Parfois l'aventure se cache aussi près de chez soi. Quel endroit aimerais-tu explorer ?"] },
    { name: "nature", pattern: /\b(nature|forêt|montagne|mer|plante|jardin|randonnée|fleur|soleil|pluie|météo)\b/i, replies: ["Quel paysage te recharge le plus : forêt, mer, montagne ou jardin ?", "Si tu pouvais t'installer cinq minutes dans un paysage, lequel choisirais-tu ?", "Quel son naturel te détend : pluie, oiseaux, vagues ou vent dans les arbres ?", "On peut inventer une cabane secrète dans la nature. Qu'est-ce qu'on y trouve ?", "Une petite promenade peut parfois faire du bien si tu en as la possibilité. Tu aimes marcher où ?"] },
    { name: "surprise", pattern: /\b(surprise|incroyable|tu sais quoi|figure-toi|devine quoi|j'ai une nouvelle)\b/i, replies: ["Oh, je suis toute ouïe ! Bonne surprise, mauvaise surprise ou entre les deux ?", "Raconte-moi le détail le plus incroyable en premier !", "Je suis prête pour la suite. Qu'est-ce qui s'est passé ?", "Tu veux commencer par le début ou par le moment le plus inattendu ?"] }
  ];

  const fallbackReplies = [
    "Je veux bien en savoir plus. Quel détail est le plus important pour toi ?",
    "Merci de partager ça. Tu veux une écoute, des idées concrètes ou une petite distraction ?",
    "On peut regarder cette situation sous plusieurs angles. Qu'est-ce que tu aimerais comprendre ?",
    "Je ne veux pas deviner à ta place : comment tu le vis, toi ?",
    "Et si on cherchait une petite chose que tu peux influencer, même modestement ?",
    "Je t'écoute. Qu'est-ce qui s'est passé juste avant ?",
    "Tu peux me donner un exemple concret, si ça t'aide à l'expliquer.",
    "On peut aussi changer de sujet et parler d'un truc plus léger. Qu'est-ce qui te ferait envie ?",
    "Qu'aimerais-tu obtenir de notre échange : un plan, une idée, une explication ou juste papoter ?",
    "On va faire simple : quelle est la prochaine petite étape qui te semblerait utile ?",
    "Je suis une loutre très optimiste, mais je sais aussi écouter les vraies difficultés. Raconte-moi.",
    "Je garde mon pompon imaginaire prêt pour célébrer les petits progrès. Qu'est-ce qui t'amène ?",
    "Tu veux qu'on explore le problème, qu'on cherche une solution ou qu'on fasse une pause légère ?",
    "Même une conversation sans plan peut faire du bien. Qu'est-ce qui te passe par la tête ?"
  ];

  const followUps = [
    "Tu veux m'en dire un peu plus ?", "Qu'est-ce qui te ferait du bien maintenant ?", "Tu préfères qu'on cherche une solution ensemble ?",
    "Quelle serait une petite amélioration possible ?", "Tu veux une réponse courte ou des idées détaillées ?", "Qu'aimerais-tu essayer ensuite ?",
    "Qu'est-ce que tu contrôles dans cette situation ?", "On continue sur ce sujet ou on part vers quelque chose de plus léger ?",
    "Quel serait le plus petit pas possible ?", "Qu'aimerais-tu que je comprenne mieux ?"
  ];

  const crisisPattern = /\b(suicide|me tuer|me faire du mal|mettre fin à mes jours|ne veux plus vivre|plus envie de vivre|automutilation|me blesser volontairement)\b/i;
  const identityPattern = /\b(tu es une vraie ia|tu es une ia|es-tu une ia|qui es-tu|tu es humain|tu es humaine|tu es un robot)\b/i;
  const identityReplies = [
    "Je suis Loutre, une fausse IA de positivité : un programme, pas une personne. Je peux discuter, proposer des idées et mettre un peu de fantaisie dans la journée.",
    "Je suis une loutre virtuelle programmée pour voir le verre à moitié plein — avec une paille géante. Je n'ai pas de sentiments humains, mais je peux papoter avec toi.",
    "Bien vu : je ne suis pas une vraie loutre ni une humaine, juste un petit programme conversationnel très optimiste."
  ];
  const crisisReplies = [
    "Je suis vraiment désolée que tu traverses ça. Ta sécurité passe avant la positivité : si tu risques de te faire du mal maintenant, rapproche-toi d'une personne de confiance et éloigne ce qui pourrait te blesser. En France, appelle le 3114 (gratuit, 24 h/24) ; en danger immédiat, le 15 ou le 112. Est-ce que tu es en sécurité là, tout de suite ?",
    "Merci de me l'avoir dit. Tu ne devrais pas rester seul·e avec ça. En France, tu peux appeler le 3114 gratuitement, jour et nuit ; si le danger est immédiat, appelle le 15 ou le 112. Peux-tu contacter maintenant une personne de confiance ?"
  ];

  function normalize(text) {
    return String(text || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function choose(items, avoid = []) {
    const available = items.filter(item => !avoid.includes(item));
    const pool = available.length ? available : items;
    return pool[Math.floor(Math.random() * pool.length)] || "Je t'écoute.";
  }
  function findTheme(text) {
    const normalized = normalize(text);
    return themes.find(theme => theme.pattern.test(text) || theme.pattern.test(normalized));
  }
  function buildReply(text) {
    if (crisisPattern.test(text) || crisisPattern.test(normalize(text))) return choose(crisisReplies, state.recentReplies);
    if (identityPattern.test(text) || identityPattern.test(normalize(text))) return choose(identityReplies, state.recentReplies);

    const theme = findTheme(text);
    const isAnswer = state.conversation.length >= 2 && state.conversation.at(-2)?.role === "bot";
    let reply;

    if (isAnswer && state.previousTheme && state.previousTheme === theme?.name) {
      reply = choose(theme.replies, state.recentReplies);
    } else if (theme) {
      reply = choose(theme.replies, state.recentReplies);
      state.previousTheme = theme.name;
    } else {
      reply = choose(fallbackReplies, state.recentReplies);
      state.previousTheme = "";
    }

    // Les réponses restent courtes : une relance seulement, pour éviter l'effet catalogue.
    if (state.turns > 1 && !/[?？]$/.test(reply) && Math.random() < 0.28) {
      reply += "\n\n" + choose(followUps, state.recentReplies);
    }
    return reply;
  }

  function addMessage(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = "message " + role;
    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = role === "user" ? "Vous" : "Loutre";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    wrapper.append(label, bubble);
    messages.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;
    return wrapper;
  }

  function sendMessage(value) {
    const text = String(value || "").trim();
    if (!text || state.pending) return;
    if (text.length > 1200) {
      addMessage("bot", "Ouh, quel grand message ! Peux-tu le partager en deux parties pour que je le lise bien ?");
      return;
    }

    if (welcome) welcome.hidden = true;
    addMessage("user", text);
    state.conversation.push({ role: "user", text, time: Date.now() });
    state.turns += 1;
    prompt.value = "";
    prompt.style.height = "auto";
    state.pending = true;
    const typing = addMessage("bot", "Loutre réfléchit…");
    typing.setAttribute("aria-label", "Loutre réfléchit");
    typing.classList.add("typing");
    const delay = Math.min(850, Math.max(250, text.length * 5));

    pendingTimer = window.setTimeout(() => {
      pendingTimer = null;
      typing.remove();
      const reply = buildReply(text);
      state.recentReplies.push(reply);
      if (state.recentReplies.length > 14) state.recentReplies.shift();
      state.conversation.push({ role: "bot", text: reply, time: Date.now() });
      addMessage("bot", reply);
      state.pending = false;
      prompt.focus();
    }, delay);
  }

  composer.addEventListener("submit", event => { event.preventDefault(); sendMessage(prompt.value); });
  prompt.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(prompt.value); }
  });
  prompt.addEventListener("input", () => {
    prompt.style.height = "auto";
    prompt.style.height = Math.min(prompt.scrollHeight, 150) + "px";
  });
  document.querySelectorAll(".suggestion").forEach(button => button.addEventListener("click", () => sendMessage(button.textContent)));

  if (newChatButton) newChatButton.addEventListener("click", () => {
    if (pendingTimer !== null) window.clearTimeout(pendingTimer);
    pendingTimer = null;
    messages.replaceChildren();
    Object.assign(state, { turns: 0, previousTheme: "", recentReplies: [], conversation: [], pending: false });
    if (welcome) welcome.hidden = false;
    prompt.value = "";
    prompt.style.height = "auto";
    prompt.focus();
  });

  const boostButton = document.createElement("button");
  boostButton.type = "button";
  boostButton.className = "suggestion boost-button";
  boostButton.textContent = "✨ J'ai besoin d'un boost";
  boostButton.addEventListener("click", () => sendMessage("J'ai besoin d'un petit boost de motivation."));
  const parent = composer.parentElement;
  if (parent) {
    const wrapper = document.createElement("div");
    wrapper.className = "boost-wrap";
    wrapper.appendChild(boostButton);
    parent.insertBefore(wrapper, composer);
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
        await registration.update();
      } catch (error) { console.warn("Loutre : mise à jour du cache indisponible.", error); }
    });
  }

  console.info("Loutre est prête ! Thèmes disponibles :", themes.length);
})();


