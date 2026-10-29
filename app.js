const replies = [
  "Ne vous inquiétez pas, tout va bien, vous allez bien.",
  "Tout va bien. Enfin, normalement.",
  "Ne vous inquiétez pas, Loutre est là.",
  "Vous allez bien. La situation est sous contrôle.",
  "Respirez. Tout va bien.",
  "Loutre a analysé votre demande. Tout va bien.",
  "Il n'y a aucune raison de s'inquiéter.",
  "Ne vous inquiétez pas, vous êtes entre de bonnes pattes.",
  "Tout va bien. Faites confiance à Loutre.",
  "Votre question est importante. Tout va bien."
];

const form = document.querySelector("#composer");
const prompt = document.querySelector("#prompt");
const messages = document.querySelector("#messages");
const welcome = document.querySelector("#welcome");

function addMessage(text, who) {
  const item = document.createElement("div");
  item.className = `message ${who}`;
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = who === "user" ? "Vous" : "🦦 Loutre";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  item.append(label, bubble);
  messages.appendChild(item);
  item.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function sendMessage(text) {
  const question = text.trim();
  if (!question) return;
  welcome.hidden = true;
  addMessage(question, "user");
  const answer = replies[Math.floor(Math.random() * replies.length)];
  // Un léger délai pour le petit effet « Loutre réfléchit ».
  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.innerHTML = '<div class="message-label">🦦 Loutre</div><div class="bubble">Loutre réfléchit…</div>';
  messages.appendChild(typing);
  typing.scrollIntoView({ behavior: "smooth", block: "nearest" });
  window.setTimeout(() => {
    typing.remove();
    addMessage(answer, "bot");
  }, 650);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(prompt.value);
  prompt.value = "";
  prompt.style.height = "auto";
});

prompt.addEventListener("input", () => {
  prompt.style.height = "auto";
  prompt.style.height = Math.min(prompt.scrollHeight, 130) + "px";
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.textContent));
});

document.querySelector("#newChat").addEventListener("click", () => {
  messages.replaceChildren();
  welcome.hidden = false;
  prompt.value = "";
  prompt.focus();
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
