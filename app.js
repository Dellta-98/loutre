
const chat = document.querySelector("#chat");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message");

const responses = {
  general: [
    "Je vois… Et tu sais quoi ? Ça va aller. 🦦",
    "Loutre est là. On respire doucement, tout va bien.",
    "Même si ça paraît compliqué, tu vas trouver ton chemin.",
    "Je ne sais pas tout, mais je sais une chose : tu mérites de la douceur.",
    "C'est noté ! Et je t'envoie une petite dose de réconfort.",
    "Tu as le droit de prendre ton temps. Rien ne presse.",
    "Parfois, il suffit d'un petit pas. Et tu viens déjà d'en faire un.",
    "Je suis convaincue que les choses peuvent s'arranger.",
    "On va considérer que c'est une bonne nouvelle. 🌷",
    "Tu fais de ton mieux, et c'est déjà beaucoup.",
    "Je t'écoute. Même les pensées un peu en désordre ont leur place ici.",
    "Un jour à la fois, une petite loutre à la fois.",
    "Tu n'as pas besoin d'avoir toutes les réponses aujourd'hui.",
    "Je valide ton message avec beaucoup de tendresse.",
    "C'est peut-être le début d'une jolie surprise !",
    "Tu peux souffler un peu. Le monde peut attendre quelques instants.",
    "Je suis de tout cœur avec toi, version loutre numérique.",
    "Ça mérite une petite pause et une grande respiration.",
    "Je pense que tu peux être fier·e de toi.",
    "Je dépose une couverture imaginaire sur tes épaules. 🧸"
  ],

  bonjour: [
    "Coucou toi ! 🦦 Comment va cette jolie journée ?",
    "Bonjour ! Loutre est ravie de te retrouver.",
    "Hello ! J'espère que ta journée commence tout doucement.",
    "Coucou ! Installe-toi, on est bien ici.",
    "Salut ! Je t'envoie un petit rayon de soleil."
  ],

  stress: [
    "Oh, ça fait beaucoup à porter. Essaie de respirer doucement : tu n'as pas à tout régler maintenant.",
    "Le stress peut donner l'impression que tout est urgent. Mais tu peux avancer une chose après l'autre.",
    "Tu as le droit de faire une pause. Ce n'est pas abandonner.",
    "Imagine une petite loutre qui flotte tranquillement sur le dos. Inspire… expire… 🦦",
    "Tu as déjà traversé des moments difficiles. Tu peux avancer à ton rythme.",
    "On va faire simple : quelle est la toute petite chose que tu peux faire maintenant ?"
  ],

  tristesse: [
    "Je suis désolée que tu te sentes comme ça. Tu mérites de la douceur, même les jours gris.",
    "Tu n'as pas besoin de faire semblant d'aller bien avec moi.",
    "Les émotions difficiles ne font pas de toi une personne faible.",
    "Je t'envoie un câlin imaginaire tout doux. 🫂",
    "Tu peux prendre le temps qu'il te faut. Il n'y a pas de calendrier pour aller mieux.",
    "Même les journées les plus grises finissent par changer."
  ],

  amour: [
    "L'amour, c'est parfois compliqué… mais tu mérites quelque chose de sincère et de doux. 💗",
    "Ton cœur a le droit d'espérer de belles choses.",
    "Si cette personne te fait sourire, c'est déjà un joli début.",
    "N'oublie pas que tu mérites d'être aimé·e sans devoir te transformer.",
    "Je vote pour les relations qui apportent de la paix et des papillons.",
    "Les histoires d'amour ont leur propre rythme. Laisse un peu de place à la magie."
  ],

  travail: [
    "Tu n'es pas obligé·e d'être productif·ve à chaque seconde. Tu es humain·e !",
    "Un travail à la fois. Tu peux y arriver.",
    "Même les personnes très compétentes ont des journées compliquées.",
    "N'oublie pas de faire une petite pause. Ton cerveau mérite aussi des vacances.",
    "Tu avances peut-être plus que tu ne le crois.",
    "Je te souhaite une journée de travail douce et pleine de petites victoires."
  ],

  conseil: [
    "Mon conseil de loutre : écoute-toi un peu plus. 🦦",
    "Essaie de choisir ce qui te fait du bien, sans oublier ce qui compte pour toi.",
    "Tu peux demander de l'aide. Ce n'est pas un échec.",
    "Prends un peu de recul, puis choisis le prochain petit pas.",
    "Si tu ne sais pas quoi faire, commence par ce qui te semble le plus simple.",
    "Fais-toi confiance. Tu as le droit d'apprendre en chemin."
  ],

  merci: [
    "Avec grand plaisir ! 🦦",
    "Oh, ça me fait plaisir !",
    "Je suis là pour ça. Prends soin de toi.",
    "Un plaisir de loutre !",
    "Tu mérites toute cette gentillesse, et même plus."
  ],

  identite: [
    "Moi, c'est Loutre ! Petite boule de réconfort numérique. 🦦",
    "Je suis Loutre, ton compagnon virtuel qui voit la vie du côté doux.",
    "Je suis une loutre de conversation : je nage dans les mots et les encouragements.",
    "Mon super-pouvoir ? Trouver une petite phrase gentille à partager."
  ],

  fatigue: [
    "Tu as peut-être besoin d'un peu de repos. Tu as le droit de ralentir.",
    "Même les loutres font la sieste ! 🦦",
    "Tu n'as pas besoin de tout accomplir aujourd'hui.",
    "Un verre d'eau, un peu de calme, et peut-être une pause ?",
    "Prends soin de ton énergie. Elle est précieuse."
  ],

  peur: [
    "Avoir peur ne veut pas dire que tu es incapable. Ça veut dire que quelque chose compte pour toi.",
    "Tu peux avancer même avec un peu de peur. Pas besoin d'être parfaitement prêt·e.",
    "On peut regarder cette inquiétude petit à petit, sans se précipiter.",
    "Je reste avec toi dans cette petite conversation. Une étape à la fois."
  ],

  compliment: [
    "Oh, tu es adorable ! 🦦",
    "Merci, tu viens de faire sourire une petite loutre.",
    "Je prends ce compliment et je le range dans mon petit cœur numérique.",
    "C'est gentil ! Je t'en renvoie un : tu mérites de belles choses."
  ],

  au_revoir: [
    "À bientôt ! Prends bien soin de toi. 🦦",
    "Au revoir, petit rayon de soleil !",
    "Je serai là si tu repasses. Passe une journée toute douce.",
    "À la prochaine ! Et n'oublie pas : tu fais de ton mieux."
  ]
};

function choose(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function detectCategory(message) {
  const text = message.toLowerCase();

  if (/(bonjour|bonsoir|salut|coucou|hello|hey)/i.test(text)) {
    return "bonjour";
  }

  if (/(stress|stresse|angoiss|anx|pression|panique)/i.test(text)) {
    return "stress";
  }

  if (/(triste|pleur|malheureux|déprim|chagrin|seul|solitude)/i.test(text)) {
    return "tristesse";
  }

  if (/(amour|amoureux|amoureuse|couple|crush|恋|coeur|cœur|rupture|aime)/i.test(text)) {
    return "amour";
  }

  if (/(travail|boulot|étude|école|examen|devoir|collège|lycée|université)/i.test(text)) {
    return "travail";
  }

  if (/(conseil|que faire|tu ferais quoi|comment faire|aide-moi|aide moi)/i.test(text)) {
    return "conseil";
  }

  if (/(merci|thanks|remercie)/i.test(text)) {
    return "merci";
  }

  if (/(qui es-tu|qui es tu|ton nom|tu es quoi|présente-toi|présente toi)/i.test(text)) {
    return "identite";
  }

  if (/(fatigu|épuis|sommeil|dormir|crevé|crevée)/i.test(text)) {
    return "fatigue";
  }

  if (/(peur|effray|inquiet|inquiète|inquiétude)/i.test(text)) {
    return "peur";
  }

  if (/(gentil|mignon|mignonne|adorable|super|génial|genial|bravo)/i.test(text)) {
    return "compliment";
  }

  if (/(au revoir|bye|à bientôt|a bientot|bonne nuit|à plus)/i.test(text)) {
    return "au_revoir";
  }

  return "general";
}

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function answer(message) {
  const category = detectCategory(message);
  const bank = responses[category] || responses.general;

  return choose(bank);
}

function sendMessage(event) {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Petite pause pour rendre la conversation plus naturelle.
  setTimeout(() => {
    addMessage(answer(message), "bot");
  }, 450);
}

form.addEventListener("submit", sendMessage);

// Message d'accueil
addMessage(
  "Coucou ! Moi, c'est Loutre. 🦦 Tu peux me raconter ce que tu veux : je suis là pour t'envoyer un peu de douceur.",
  "bot"
);
