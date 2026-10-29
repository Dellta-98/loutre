
const chat = document.querySelector("#chat");
const messages = document.querySelector("#messages");
const form = document.querySelector("#composer");
const input = document.querySelector("#prompt");
const welcome = document.querySelector("#welcome");
const newChatButton = document.querySelector("#newChat");

const responses = {
  general: [
    "Je vois… Mais ne t'inquiète pas, on va prendre ça tranquillement. 🦦",
    "Tu sais quoi ? Je pense que tu peux souffler un peu. Tout n'a pas besoin d'être réglé immédiatement.",
    "Message reçu ! Je t'envoie une petite dose de réconfort.",
    "Même quand les choses semblent compliquées, il existe souvent un prochain petit pas.",
    "Je suis là pour t'écouter. Tu peux tout me raconter.",
    "On respire doucement… Voilà, c'est déjà un bon début.",
    "Tu as le droit de prendre ton temps. Il n'y a aucune urgence à tout comprendre.",
    "Je vote pour une journée un peu plus douce pour toi. 💚",
    "C'est peut-être moins catastrophique que ça n'en a l'air. Prenons les choses une par une.",
    "Une petite loutre me souffle que ça va aller.",
    "Tu n'as pas besoin d'être parfait·e pour que tout se passe bien.",
    "Je note tout ça dans mon petit carnet imaginaire. Et je t'envoie du courage !",
    "Parfois, la meilleure solution commence par une pause.",
    "Tu as déjà fait un pas en mettant des mots sur ce que tu penses.",
    "Je suis officiellement favorable à ce que tu te traites avec plus de douceur.",
    "D'accord ! Et si on regardait la situation sans imaginer tout de suite le pire ?",
    "Je ne peux pas prédire l'avenir, mais je peux t'encourager à avancer à ton rythme.",
    "Petit rappel de Loutre : tu as le droit de recommencer, de changer d'avis et de te reposer.",
    "On va garder notre calme de loutre et prendre une chose après l'autre.",
    "Je t'envoie trois choses : du courage, un sourire et une loutre imaginaire."
  ],

  bonjour: [
    "Coucou ! 🦦 Je suis contente de te voir ici. Comment se passe ta journée ?",
    "Bonjour ! Installe-toi confortablement, Loutre est là.",
    "Coucou toi ! J'espère que ta journée sera douce et pleine de bonnes surprises.",
    "Salut ! Je t'accueille avec un sourire et une petite nage de loutre.",
    "Hello ! On commence cette conversation dans la bonne humeur ?"
  ],

  stress: [
    "Le stress peut rendre tout immense. Essaie de te concentrer uniquement sur la prochaine petite étape.",
    "Tu n'as pas à tout gérer en même temps. Une chose, puis une autre. 🦦",
    "Prends une inspiration lente, puis expire doucement. Tu peux t'accorder quelques instants.",
    "Même si tu te sens dépassé·e, cela ne signifie pas que tu es incapable.",
    "Qu'est-ce qui te pèse le plus en ce moment ? On peut essayer de le démêler ensemble.",
    "Tu as le droit de demander de l'aide et de faire une pause."
  ],

  tristesse: [
    "Je suis désolée que tu traverses un moment difficile. Tu mérites de la gentillesse.",
    "Tu n'as pas besoin de prétendre que tout va bien si ce n'est pas le cas.",
    "Les journées tristes ne résument pas toute ta vie. Laisse-toi un peu de temps.",
    "Je t'envoie un câlin virtuel tout doux. 🫂",
    "Tu peux me raconter ce qui te rend triste, si tu en as envie.",
    "Tu n'es pas obligé·e de trouver une solution immédiatement. Parfois, être écouté·e aide déjà."
  ],

  amour: [
    "Ah, les histoires de cœur ! 💗 J'espère qu'elles t'apporteront autant de douceur que de papillons.",
    "Tu mérites une relation dans laquelle tu peux être toi-même.",
    "Les sentiments sont parfois compliqués. Tu as le droit de prendre le temps de comprendre les tiens.",
    "Un petit conseil de loutre : ne t'oublie pas en essayant de plaire à quelqu'un.",
    "Que tu sois amoureux·se, perdu·e ou simplement curieux·se, tes émotions ont leur place.",
    "Je te souhaite une histoire qui te fasse sourire, tout en te laissant être toi-même."
  ],

  travail: [
    "Une tâche après l'autre ! Tu n'as pas besoin de tout accomplir d'un seul coup.",
    "Une journée difficile ne signifie pas que tu es mauvais·e dans ce que tu fais.",
    "Pense à faire une pause : même les loutres doivent parfois s'arrêter de nager.",
    "Tu peux être fier·e de tes efforts, même si tout n'est pas encore terminé.",
    "Les examens et les échéances peuvent être intimidants. Découpons le problème en petites étapes.",
    "Tu as le droit d'apprendre, de faire des erreurs et de recommencer."
  ],

  conseil: [
    "Mon conseil de loutre : commence par la chose la plus simple que tu puisses faire maintenant.",
    "Essaie de distinguer ce que tu peux contrôler de ce qui ne dépend pas de toi.",
    "Si tu hésites, prends le temps de réfléchir à ce qui compte vraiment pour toi.",
    "Tu peux demander l'avis d'une personne de confiance. Tu n'as pas à décider seul·e.",
    "Parfois, le bon choix n'est pas celui qui est le plus facile, mais celui qui respecte tes besoins.",
    "Raconte-moi un peu plus la situation et on pourra réfléchir aux possibilités."
  ],

  merci: [
    "Avec plaisir ! 🦦 C'est toujours un plaisir de partager un peu de douceur.",
    "Mais de rien ! Prends soin de toi.",
    "Tu es adorable, merci à toi !",
    "Mission réconfort accomplie… ou du moins, petite tentative de loutre !",
    "Je t'en prie. Tu mérites de la gentillesse."
  ],

  identite: [
    "Moi, c'est Loutre ! 🦦 Ton petit compagnon virtuel qui essaie de rendre les conversations plus douces.",
    "Je suis Loutre, un programme qui répond avec des messages préparés et un peu de logique.",
    "Je ne suis pas une véritable intelligence artificielle : mes réponses viennent d'une collection de phrases et de règles.",
    "Mon super-pouvoir ? Répondre avec douceur et trouver une petite phrase encourageante."
  ],

  fatigue: [
    "Si tu le peux, accorde-toi un moment de repos. Tu n'as pas besoin d'être productif·ve tout le temps.",
    "Même les loutres font la sieste ! 🦦 Ton énergie compte aussi.",
    "Un peu d'eau, un endroit confortable et quelques minutes de calme peuvent être un bon début.",
    "Tu as le droit de ralentir. Le repos fait partie de la vie, pas d'un échec.",
    "J'espère que tu pourras bientôt retrouver un peu d'énergie."
  ],

  peur: [
    "Avoir peur ne veut pas dire que tu es incapable. On peut avancer petit à petit.",
    "Tu n'as pas besoin de te sentir parfaitement prêt·e pour commencer.",
    "Essaie de séparer ce que tu sais réellement de ce que tu crains qu'il arrive.",
    "Tu peux en parler à quelqu'un en qui tu as confiance si cette peur devient trop lourde.",
    "On n'est pas obligé de résoudre toute la situation maintenant."
  ],

  compliment: [
    "Oh, merci ! Tu viens de faire sourire une petite loutre. 🦦",
    "C'est adorable ! Je t'envoie un compliment en retour : tu mérites de belles choses.",
    "Je range ce compliment dans mon petit cœur numérique.",
    "Tu es vraiment gentil·le ! Merci pour cette jolie énergie."
  ],

  au_revoir: [
    "À bientôt ! Prends bien soin de toi. 🦦",
    "Au revoir et prends le temps de souffler un peu.",
    "À la prochaine ! Loutre t'envoie une petite vague de bonheur.",
    "Passe une journée toute douce. Tu peux revenir quand tu veux."
  ],

  positif: [
    "Mais c'est une super nouvelle ! 🎉 Je suis ravie pour toi.",
    "Voilà une bonne nouvelle qui mérite une petite danse de loutre !",
    "Tu vois ? Il y a aussi de jolies choses qui arrivent. Profite de ce moment.",
    "Je suis contente que ça se passe bien. Savoure cette petite victoire !",
    "On devrait célébrer ça avec un poisson imaginaire. 🐟"
  ]
};

function choisir(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function detecterCategorie(texte) {
  const t = texte.toLowerCase();

  if (/\b(bonjour|bonsoir|salut|coucou|hello|hey)\b/.test(t)) return "bonjour";
  if (/(stress|stressé|stressée|angoiss|anxiété|panique|débordé)/.test(t)) return "stress";
  if (/(triste|pleure|pleurer|malheureux|malheureuse|déprim|chagrin|solitude|seul au monde)/.test(t)) return "tristesse";
  if (/(amour|amoureux|amoureuse|couple|crush|cœur|coeur|rupture|amie|petit ami|petite amie|je l'aime|je l’aime)/.test(t)) return "amour";
  if (/(travail|boulot|étude|école|examen|devoir|collège|lycée|université|révision|contrôle)/.test(t)) return "travail";
  if (/(conseil|que faire|tu ferais quoi|comment faire|aide-moi|aide moi|je devrais)/.test(t)) return "conseil";
  if (/(merci|remercie|t'es gentil|tu es gentil)/.test(t)) return "merci";
  if (/(qui es-tu|qui es tu|ton nom|tu es quoi|es-tu une ia|vraie ia|intelligence artificielle)/.test(t)) return "identite";
  if (/(fatigu|épuis|epuis|sommeil|dormir|crevé|crevée|pas d'énergie)/.test(t)) return "fatigue";
  if (/(peur|effray|inquiet|inquiète|inquiétude|inquietude|j'ai peur)/.test(t)) return "peur";
  if (/(mignon|mignonne|adorable|gentil|gentille|super loutre)/.test(t)) return "compliment";
  if (/(au revoir|bye|à bientôt|a bientot|bonne nuit|à plus)/.test(t)) return "au_revoir";
  if (/(bonne nouvelle|j'ai réussi|j'ai reussi|j'ai gagné|j'ai gagne|ça a marché|ca a marche|je suis heureux|je suis heureuse|je suis content|je suis contente)/.test(t)) return "positif";

  return "general";
}

function afficherMessage(texte, auteur) {
  const bulle = document.createElement("div");
  bulle.className = "message " + auteur;
  bulle.textContent = texte;
  messages.appendChild(bulle);
  chat.scrollTop = chat.scrollHeight;
}

function repondre(texte) {
  const categorie = detecterCategorie(texte);
  return choisir(responses[categorie] || responses.general);
}

function envoyerMessage(texte) {
  const message = texte.trim();
  if (!message) return;

  welcome.hidden = true;
  afficherMessage(message, "user");
  input.value = "";

  const attente = document.createElement("div");
  attente.className = "message bot";
  attente.textContent = "Loutre réfléchit… 🦦";
  messages.appendChild(attente);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    attente.textContent = repondre(message);
    chat.scrollTop = chat.scrollHeight;
  }, 500);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  envoyerMessage(input.value);
});

document.querySelectorAll(".suggestion").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    envoyerMessage(bouton.textContent);
  });
});

newChatButton.addEventListener("click", () => {
  messages.replaceChildren();
  welcome.hidden = false;
  input.value = "";
  input.focus();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((erreur) => {
      console.warn("Service worker indisponible :", erreur);
    });
  });
}
