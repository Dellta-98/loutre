(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const chat = $("#chat"), messages = $("#messages"), composer = $("#composer"), prompt = $("#prompt");
  const welcome = $("#welcome"), welcomePrompts = $("#welcomePrompts"), otterArt = $("#otterArt"), statusText = $("#statusText");
  if (!chat || !messages || !composer || !prompt || !window.LOUTRE_DATA) return;

  const library = window.LOUTRE_DATA;
  const themes = library.themes;
  const state = {
    turns: 0, theme: null, lastQuestion: "", lastQuestionTheme: null,
    recentReplies: [], history: [], facts: { name: "", likes: [], pets: [] },
    pending: false, timer: null, game: null, mode: "conversation"
  };
  const fallback = [
    "Je t'écoute ! Raconte-moi la suite, je suis toute ouïe.",
    "Merci de partager ça. Tu veux une écoute, des idées concrètes ou une petite distraction ?",
    "Je ne veux pas deviner à ta place : comment tu le vis, toi ?",
    "Qu'est-ce qui te paraît le plus important là-dedans ?",
    "Tu peux me donner un exemple concret si ça t'aide à expliquer ton idée.",
    "On peut aussi changer de sujet et parler d'un truc plus léger, si tu préfères.",
    "Qu'aimerais-tu obtenir de notre échange : un plan, une idée, une explication ou juste papoter ?",
    "Je suis une loutre très optimiste, mais j'écoute aussi les vraies difficultés.",
    "Même une conversation sans plan peut faire du bien. Qu'est-ce qui te passe par la tête ?",
    "Ah, je vois. Et toi, qu'est-ce que tu en penses ?",
    "Je suis curieuse d'en savoir plus. Qu'est-ce qui s'est passé ensuite ?",
    "Tu veux qu'on explore le problème, cherche une solution ou fasse une pause légère ?"
  ];
  const acknowledgements = ["Ah, je vois mieux.","Merci, ça m'aide à comprendre.","D'accord, je te suis.","Je comprends un peu mieux la situation.","Merci de préciser, je garde ça en tête pour la suite.","Oh, je vois ce que tu veux dire.","Ça donne une autre couleur à l'histoire.","Je note, sans te juger."];
  const bridges = ["Et dans tout ça,","En partant de là,","Pour la suite,","Si on regarde le prochain petit pas,","Qu'est-ce qui te semblerait aidant :","Et toi, tu aurais envie de,"];
  const crisis = /\b(suicide|suicider|me tuer|me faire du mal|mettre fin à mes jours|ne veux plus vivre|plus envie de vivre|envie de mourir|je veux mourir|automutilation|me blesser volontairement)\b/i;
  const identity = /\b(tu es une vraie ia|tu es une ia|es-tu une ia|qui es-tu|tu es humain|tu es humaine|tu es un robot|comment tu fonctionnes)\b/i;
  const goodbye = /\b(au revoir|à bientôt|bonne nuit|bonne soirée|je dois y aller|à plus|ciao)\b/i;

  function norm(text) { return String(text || "").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’‘]/g, "'"); }
  function pick(items, avoid = []) { const free = items.filter(item => !avoid.includes(item)); const list = free.length ? free : items; return list[Math.floor(Math.random() * list.length)] || "Je t'écoute."; }
  function findTheme(text) { const n = norm(text); return themes.find(t => t.keys.test(text) || t.keys.test(n)) || null; }
  function remember(text) {
    const name = text.match(/\b(?:je m'appelle|moi c'est|mon prénom c'est)\s+([\p{L}][\p{L}'-]{1,20})/iu);
    if (name) state.facts.name = name[1];
    const pet = text.match(/\b(?:mon|ma)\s+(?:chat|chien|lapin|animal)\s+(?:s'appelle|se nomme)\s+([\p{L}][\p{L}'-]{1,20})/iu);
    if (pet && !state.facts.pets.includes(pet[1])) state.facts.pets.push(pet[1]);
    const like = text.match(/\b(?:j'aime|j'adore|je préfère)\s+([^,.!?;]{2,38})/i);
    if (like && !state.facts.likes.includes(like[1].trim())) state.facts.likes.push(like[1].trim());
  }
  function selectQuestion(theme, avoid = []) {
    const list = theme?.qs?.length ? theme.qs : library.questions;
    const question = pick(list, [...avoid, state.lastQuestion]);
    state.lastQuestion = question;
    state.lastQuestionTheme = theme?.name || null;
    return question;
  }
  function reflect(text) {
    const clean = text.trim().replace(/\s+/g, " ");
    const n = norm(clean);
    if (/^(oui|exactement|c'est ça|grave|carrément|tout à fait|plutôt oui)$/.test(n)) return pick(["D'accord, plutôt oui, je note !","Je te suis, alors.","Ah, c'est donc ça.","Ok, on part de là."]);
    if (/^(non|pas vraiment|pas du tout|bof|aucune idée)$/.test(n)) return pick(["Compris, on ne force pas cette piste.","D'accord, merci de me le dire.","Très bien, on cherche une autre direction."]);
    if (clean.length < 48 && !/[.!?]/.test(clean)) return pick([`Ah, équipe ${clean} alors !`,`Oh, ${clean} ! J'aime bien cette réponse.`,`Je note : ${clean}.`,`D'accord, ${clean} — ça me donne une piste.`]);
    if (clean.length < 105) return `${pick(acknowledgements)} Tu me dis : « ${clean} ».`;
    return pick(acknowledgements);
  }
  function activityOf(text) {
    const n = norm(text);
    if (/\b(question surprise|pose-moi une question|question du jour)\b/.test(n)) return "question";
    if (/\b(mini-jeu|jouons|on joue|quiz|devinette)\b/.test(n)) return "game";
    if (/\b(raconte.{0,8}une histoire|histoire à deux|inventons une histoire)\b/.test(n)) return "story";
    if (/\b(j'ai besoin d'un boost|boost|encourage-moi|motivation)\b/.test(n)) return "boost";
    if (/\b(changer de sujet|changeons de sujet|changer d'air|autre sujet)\b/.test(n)) return "topic";
    return "";
  }
  function makeIdentity() {
    const name = state.facts.name ? `, ${state.facts.name}` : "";
    return pick([
      `Je suis Loutre${name}, une fausse IA de positivité : un programme local, pas une personne. Je peux papoter, proposer des idées et inventer des jeux.`,
      `Bien vu${name} : je ne suis pas une vraie loutre ni une humaine, juste un programme avec des phrases pré-écrites et beaucoup d'optimisme.`,
      `Je suis une loutre virtuelle programmée pour voir le verre à moitié plein — avec une paille géante. Je n'ai pas de sentiments humains, mais je peux discuter avec toi.`
    ], state.recentReplies);
  }
  function memoryReply(text) {
    const n = norm(text);
    if (state.facts.name && /\b(comment je m'appelle|mon prenom|tu te souviens de mon nom)\b/.test(n)) return `Tu m'as dit que tu t'appelles ${state.facts.name}. Ma mémoire de loutre est encore là !`;
    if (state.facts.pets.length && /\b(mon animal|mon chat|mon chien|comment s'appelle mon)\b/.test(n)) return `Tu m'as parlé de ${state.facts.pets.join(" et ")}. Comment va ${state.facts.pets.length === 1 ? "ton compagnon" : "ta petite équipe"} ?`;
    if (state.facts.likes.length && /\b(ce que j'aime|mes gouts|ce que je prefere)\b/.test(n)) return `Tu m'as dit aimer ${state.facts.likes.slice(-3).join(", ")}. J'ai bon ?`;
    return "";
  }
  function getReply(text) {
    const n = norm(text);
    if (crisis.test(text) || crisis.test(n)) return { text:"Je suis vraiment désolée que tu traverses ça. Ta sécurité passe avant la positivité : si tu risques de te faire du mal maintenant, rapproche-toi tout de suite d'une personne de confiance et éloigne ce qui pourrait te blesser. En France, appelle le 3114 (gratuit, 24 h/24) ; en danger immédiat, le 15 ou le 112. Est-ce que tu es en sécurité là, tout de suite ?", urgent:true, actions:["Je suis en sécurité","Je suis en danger immédiat"] };
    if (identity.test(text) || identity.test(n)) return { text:makeIdentity(), theme:null };
    if (/^(salut|bonjour|coucou|hello|hey|bonsoir|yo|cc)\b/.test(n)) return {text:pick(["Coucou, bienvenue ! Ta journée se passe comment ?","Salut ! Tu arrives avec une histoire, une question ou envie de papoter ?","Bonjour ! On se fait une petite place confortable et on discute ?","Hey ! Quoi de neuf dans ton univers ?"],state.recentReplies),theme:null};
    if (/^(merci|merci beaucoup)\b/.test(n)) return {text:pick(["Avec plaisir ! On continue sur ce sujet ou on part vers autre chose ?","Je suis ravie que cela ait aidé. Tu veux poursuivre ?","Toujours partante pour papoter avec toi !"],state.recentReplies),theme:state.theme};
    if (goodbye.test(n)) return { text:pick(["À bientôt ! Merci pour ce bout de conversation. Prends soin de toi, à ton rythme.","Bonne suite de journée ! Mon pompon de loutre sera prêt pour la prochaine fois.","Bonne nuit ! Je te souhaite un repos doux comme une pierre au soleil.","À plus ! Tu peux revenir papoter quand tu en as envie."],state.recentReplies), theme:state.theme };
    const remembered = memoryReply(text); if (remembered) return {text:remembered,theme:state.theme};

    const action = activityOf(text);
    if (state.game && !action) {
      const answer=text.trim().replace(/\s+/g," ");
      if(state.game==="Histoire à deux") return {text:pick([`Oh, et juste derrière, il y a ${answer.length<48?answer:"un indice mystérieux"} ! La loutre s'approche… qu'est-ce qui arrive ensuite ?`,`J'adore cette direction ! La loutre regarde autour d'elle et découvre un détail inattendu. Lequel ?`,`La suite devient de plus en plus intrigante. Un nouvel ami apparaît : qui est-ce ?`]),game:true,theme:findTheme("histoire")};
      if(state.game==="Le mot mystère") return {text:pick(["Hmm… je tente ma chance : une clé ?", "Mon pari de loutre : une tasse ?", "Est-ce que ce serait un livre ?", "Je propose… une chaussette orpheline ?"]) + " J'ai bon, ou tu me donnes un indice plus farfelu ?",game:true};
      if(state.game==="Trois mots") return {text:`Avec « ${answer.length<75?answer:"tes mots mystérieux"} », je propose comme titre : Le grand mystère du mardi ! Quel serait le genre du film ?`,game:true};
      return {text:`${pick(["J'aime bien ta réponse !", "Très bon choix !", "Ça, c'est une idée qui a du panache.", "Je n'avais pas pensé à ça, bien joué !", "Réponse validée par le comité des loutres curieuses."])} ${answer.length<55?`« ${answer} » me fait sourire. `:""}Tu veux ajouter un détail ou on passe au défi suivant ?`,game:true};
    }
    if (action === "game") { const game = pick(library.games, state.game ? [state.game] : []); state.game = game.name; state.mode="jeu"; return {text:`🎲 ${game.name}\n\n${game.text}`,theme:findTheme("jeu"),game:true}; }
    if (action === "story") { state.game="Histoire à deux"; return {text:"📖 Histoire à deux : une loutre découvre une porte minuscule au pied d'un vieux chêne. Derrière, elle entend une musique de fête… Qu'est-ce qu'elle voit en entrant ?",theme:findTheme("histoire"),game:true}; }
    if (action === "question") return {text:`${pick(library.openers)} ${selectQuestion(null)}`,question:true};
    if (action === "boost") return {text:`${pick(library.boosts)}\n\n${selectQuestion(state.theme)}`,theme:state.theme,question:true};
    if (action === "topic") { state.game=null; const next=pick(themes.filter(t=>t!==state.theme)); state.theme=next; return {text:`Allez, on change de décor ! 🪁\n\n${pick(next.replies)}\n\n${selectQuestion(next)}`,theme:next,question:true}; }

    if (/\b(juste écoute|écoute-moi|pas de conseil|besoin de parler|vider mon sac)\b/i.test(text)) state.mode="écoute";
    else if (/\b(des idées|brainstorm|trouver une solution|plan concret|aide-moi à)\b/i.test(text)) state.mode="idées";
    else if (/\bconversation|papoter|discuter\b/i.test(text)) state.mode="conversation";
    const theme = findTheme(text);
    const wasQuestion = Boolean(state.lastQuestion) && state.history.length >= 2 && state.history.at(-2)?.role === "bot";
    const selected = theme || (wasQuestion ? themes.find(t=>t.name===state.lastQuestionTheme) : null) || state.theme;
    if (/\b(et toi|toi aussi|comment vas-tu|comment tu vas|tu aimes quoi)\b/.test(n)) return {text:`Bonne question${state.facts.name ? `, ${state.facts.name}` : ""} ! Je n'ai pas de journée à moi, mais j'adore les conversations pleines d'idées. Et toi, plutôt papotage sérieux ou détour absurde ?`,theme:selected,question:true};

    let reply;
    if (wasQuestion && !theme) {
      const answer = reflect(text);
      const q = selectQuestion(selected, [state.lastQuestion]);
      if (state.mode === "écoute") reply = `${answer} Je t'écoute, prends ton temps. ${q}`;
      else reply = Math.random()<.6 ? `${answer} ${pick(bridges)} ${q.charAt(0).toLowerCase()}${q.slice(1)}` : `${answer} ${q}`;
    } else {
      const found = theme || selected;
      if (!found) { reply=pick(fallback,state.recentReplies); if (Math.random()<.45) reply+=`\n\n${selectQuestion(null)}`; }
      else {
        state.theme=found;
        let base=pick(found.replies,state.recentReplies);
        if (state.mode==="écoute" && Math.random()<.5) base=`${pick(["Je suis là, je t'écoute.","Merci de me le confier.","Je ne vais pas essayer de régler ça trop vite."])} ${base}`;
        if (state.mode==="idées" && Math.random()<.5) base+= " On peut chercher une piste concrète ensemble.";
        if (!/[?？]/.test(base) && Math.random()<.78) base+=`\n\n${selectQuestion(found)}`;
        reply=base;
      }
    }
    if (state.facts.name && state.turns>2 && Math.random()<.1 && !reply.includes(state.facts.name)) reply=`${state.facts.name}, ${reply.charAt(0).toLowerCase()}${reply.slice(1)}`;
    return {text:reply,theme:selected||state.theme,question:/\?/.test(reply)};
  }

  function setMood(mood="curious") {
    const moods={curious:["🦦","petite loutre en ligne"],happy:["🦦✨","en mode célébration"],listening:["🦦💚","en mode écoute"],playful:["🦦🎲","prête à jouer"],cozy:["🦦☁️","ambiance douce"]};
    const item=moods[mood]||moods.curious;
    const icon=$("#brandIcon"); if(icon) icon.textContent=item[0];
    if(otterArt) otterArt.textContent=item[0]; if(statusText) statusText.textContent=item[1];
    document.body.dataset.mood=mood;
  }
  function addMessage(role,text,options={}) {
    const wrap=document.createElement("article");
    wrap.className=`message ${role}${options.highlight?" highlight":""}${options.typing?" typing":""}`;
    const label=document.createElement("span"); label.className="message-label";
    label.textContent=role==="user"?(state.facts.name||"Toi"):"Loutre";
    const bubble=document.createElement("div"); bubble.className="bubble"; bubble.textContent=text;
    wrap.append(label,bubble);
    if(role==="bot"&&!options.typing&&!options.urgent&&options.tools!==false) {
      const tools=document.createElement("div"); tools.className="message-tools";
      [["↪ Continuer","continue"],["🎲 Mini-jeu","game"],["🪁 Autre sujet","topic"]].forEach(([title,action])=>{
        const b=document.createElement("button"); b.type="button"; b.className="quick-reply"; b.textContent=title; b.dataset.action=action; tools.appendChild(b);
      });
      wrap.appendChild(tools);
    }
    messages.appendChild(wrap); chat.scrollTop=chat.scrollHeight; return wrap;
  }
  function renderStarters() {
    const target=welcomePrompts; if(!target)return; target.replaceChildren();
    const pool=["Pose-moi une question surprise","J'ai eu une journée bizarre","Je veux faire un mini-jeu","Raconte-moi une histoire","Je voudrais un petit boost","Parlons d'un sujet léger","J'ai une bonne nouvelle","Je ne sais pas quoi dire"];
    const chosen=[]; while(chosen.length<4) chosen.push(pick(pool,chosen));
    chosen.forEach(text=>{const b=document.createElement("button");b.type="button";b.className="suggestion";b.textContent=text;b.addEventListener("click",()=>sendMessage(text));target.appendChild(b);});
  }
  function performAction(action) {
    if(state.pending)return;
    if(welcome)welcome.hidden=true;
    let text="";
    if(action==="game") {const g=pick(library.games,state.game?[state.game]:[]);state.game=g.name;text=`🎲 ${g.name}\n\n${g.text}`;setMood("playful");}
    else if(action==="question") {text=`${pick(library.openers)} ${selectQuestion(state.theme)}`;setMood("curious");}
    else if(action==="boost") {text=`${pick(library.boosts)}\n\n${selectQuestion(state.theme)}`;setMood("happy");}
    else if(action==="topic") {state.game=null;const t=pick(themes.filter(item=>item!==state.theme));state.theme=t;text=`On change d'air ! 🪁\n\n${pick(t.replies)}\n\n${selectQuestion(t)}`;setMood("curious");}
    else if(action==="continue") {text=`${pick(acknowledgements)} ${selectQuestion(state.theme)}`;setMood("listening");}
    if(!text)return;
    addMessage("bot",text,{highlight:action==="game"||action==="boost"});
    state.history.push({role:"bot",text,time:Date.now()});const qs=text.match(/[^?]*\?/g);state.lastQuestion=qs?qs[qs.length-1].trim():"";state.lastQuestionTheme=state.lastQuestion?(state.theme?.name||null):null;
    state.recentReplies.push(text);state.turns++;
  }
  function sendMessage(value) {
    const text=String(value||"").trim(); if(!text||state.pending)return;
    if(text.length>1600){addMessage("bot","Ouh, quel grand message ! Partage-le en deux ou trois morceaux et je le lirai avec attention.");return;}
    if(welcome)welcome.hidden=true;
    remember(text); state.history.push({role:"user",text,time:Date.now()}); state.turns++;
    addMessage("user",text); prompt.value=""; prompt.style.height="auto";
    state.pending=true; setMood("listening");
    const typing=addMessage("bot","Loutre réfléchit",{typing:true,tools:false});
    const dots=document.createElement("span");dots.className="typing-dots";typing.querySelector(".bubble").appendChild(dots);
    const delay=Math.min(1100,Math.max(350,text.length*6+120));
    state.timer=window.setTimeout(()=>{
      state.timer=null;typing.remove();const result=getReply(text);
      state.recentReplies.push(result.text);if(state.recentReplies.length>20)state.recentReplies.shift();
      if(result.theme)state.theme=result.theme;
      if(result.urgent)setMood("listening");
      else if(result.game)setMood("playful");
      else if(/\b(joie|bonne nouvelle|fier|fière|génial|content|contente)\b/i.test(text))setMood("happy");
      else if(result.theme?.name==="repos"||result.theme?.name==="tristesse")setMood("cozy");else setMood("curious");
      addMessage("bot",result.text,{highlight:result.game||result.urgent,urgent:result.urgent});
      state.history.push({role:"bot",text:result.text,time:Date.now()});const qs=result.text.match(/[^?]*\?/g);state.lastQuestion=qs?qs[qs.length-1].trim():"";state.lastQuestionTheme=state.lastQuestion?(result.theme?.name||null):null;state.pending=false;prompt.focus();
    },delay);
  }

  composer.addEventListener("submit",event=>{event.preventDefault();sendMessage(prompt.value);});
  prompt.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();sendMessage(prompt.value);}});
  prompt.addEventListener("input",()=>{prompt.style.height="auto";prompt.style.height=Math.min(prompt.scrollHeight,150)+"px";if(prompt.value.trim())setMood("listening");});
  document.querySelectorAll(".activity-button").forEach(button=>button.addEventListener("click",()=>performAction(button.dataset.action)));
  messages.addEventListener("click",event=>{const button=event.target.closest("button[data-action]");if(button)performAction(button.dataset.action);});
  const newChat=$("#newChat");
  if(newChat)newChat.addEventListener("click",()=>{
    if(state.timer!==null)window.clearTimeout(state.timer);
    Object.assign(state,{turns:0,theme:null,lastQuestion:"",lastQuestionTheme:null,recentReplies:[],history:[],facts:{name:"",likes:[],pets:[]},pending:false,timer:null,game:null,mode:"conversation"});
    messages.replaceChildren();if(welcome)welcome.hidden=false;prompt.value="";prompt.style.height="auto";setMood("curious");renderStarters();prompt.focus();
  });

  renderStarters();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",async()=>{
    try{const registration=await navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"});await registration.update();}
    catch(error){console.warn("Loutre : mise à jour du cache indisponible.",error);}
  });
  console.info(`Loutre est prête : ${themes.length} thèmes, ${library.questions.length} questions et ${library.games.length} mini-jeux.`);
})();









