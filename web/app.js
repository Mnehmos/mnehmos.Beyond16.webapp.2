const config = window.__APP_CONFIG__ || { apiBaseUrl: "http://localhost:3000" };

function normalizeApiBaseUrl(url) {
  return String(url || "").replace(/\/+$/, "");
}

function buildApiUrl(baseUrl, path) {
  const normalizedBaseUrl = normalizeApiBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
}

const apiBaseUrl = normalizeApiBaseUrl(config.apiBaseUrl);
const chatEndpoint = buildApiUrl(apiBaseUrl, "/chat");

const state = {
  turn: 0,
  axes: { EI: 0, SN: 0, TF: 0, JP: 0 },
};

const messagesEl = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const phaseEl = document.getElementById("phase");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");

function addMessage(role, text) {
  const el = document.createElement("div");
  el.className = `msg ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

addMessage("assistant", `System: using API ${apiBaseUrl}`);
addMessage("assistant", "Welcome. Share a quick intro about how you make decisions.");

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  messageInput.value = "";

  try {
    const res = await fetch(chatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        quizState: state,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      addMessage("assistant", `Error: ${data.error || "request failed"}`);
      return;
    }

    addMessage("assistant", data.assistantMessage);
    phaseEl.textContent = data.phase;
    progressEl.textContent = `${Math.round(data.progress * 100)}%`;
    resultEl.textContent = data.result ? data.result.mbti : "-";

    state.turn += 1;
    if (data.result?.axes) {
      state.axes = data.result.axes;
    }
  } catch (_err) {
    addMessage("assistant", "Network error while reaching /chat.");
  }
});
