import "./style.css";
import { getEngine } from "./ai.js";

document.querySelector("#app").innerHTML = `
  <div class="app">
    <div class="glow glow-blue"></div>
    <div class="glow glow-pink"></div>
    <div class="glow glow-purple"></div>

    <header class="header">
      <button class="menu-btn" id="menuBtn">☰</button>

      <div class="brand">
        <div class="logo">R</div>
        <div>
          <strong>Reld AI</strong>
          <span>Assistant Mode · on</span>
        </div>
      </div>

      <button class="settings-btn" id="settingsBtn">⚙</button>
    </header>

    <main class="chat" id="chat">
      <section class="welcome" id="welcome">
        <div class="welcome-logo">R</div>
        <h1>Hey, I'm Reld AI</h1>
        <p>Your intelligent assistant</p>
      </section>
    </main>

    <div class="thinking" id="thinking">
      <div class="jelly"></div>
      <div>Reld AI is thinking...</div>
    </div>

    <div class="composer">
      <button class="circle-btn">＋</button>

      <input
        id="messageInput"
        type="text"
        placeholder="Ask Reld AI anything..."
        autocomplete="off"
      />

      <button class="circle-btn mic-btn" id="micBtn">🎙</button>
      <button class="send-btn" id="sendBtn">↑</button>
    </div>

    <div class="side-menu" id="sideMenu">
      <div class="menu-header">
        <h2>Reld AI</h2>
        <button id="closeMenu">×</button>
      </div>

      <button id="newChat">＋ New Chat</button>

      <h3>🕘 Chat History</h3>
      <div id="history"></div>

      <button id="openSettings">⚙ Settings</button>
      <button id="clearChats">🗑 Clear Chats</button>
    </div>

    <div class="settings" id="settings">
      <button id="closeSettings">‹</button>
      <h2>Settings</h2>

      <div class="setting-card">
        <strong>Voice Input</strong>
        <span>Use your microphone</span>
      </div>

      <div class="setting-card">
        <strong>Read Aloud</strong>
        <span>Speak Reld AI responses</span>
      </div>

      <div class="setting-card">
        <strong>Wake Aloud</strong>
        <span>Wake Reld by saying "Reld"</span>
      </div>

      <div class="setting-card">
        <strong>Chat History</strong>
        <span>Keep your conversations</span>
      </div>

      <div class="about">
        <h3>About Reld AI</h3>
        <p>Your intelligent assistant.</p>
        <p>Developer: <b>Abiola Jonathan Ifeoluwa</b></p>
      </div>
    </div>
  </div>
`;

const chat = document.querySelector("#chat");
const input = document.querySelector("#messageInput");
const sendBtn = document.querySelector("#sendBtn");
const thinking = document.querySelector("#thinking");
const menu = document.querySelector("#sideMenu");
const settings = document.querySelector("#settings");

let messages = [];

const SYSTEM_PROMPT = `
You are Reld AI, a helpful, intelligent, friendly AI assistant.

Your developer is Abiola Jonathan Ifeoluwa.

If asked who built, created, made, developed, or programmed you, answer exactly:

"I was built and developed by Abiola Jonathan Ifeoluwa."

Always answer the actual question the user asks.

Do not rely on preset demo answers.

Use conversation history to understand follow-up questions.

Be accurate and do not knowingly invent facts.

If you don't know something, clearly say that you are unsure.

Give clear explanations and answer directly.

Be friendly and helpful.
`;

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}-message`;
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  document.querySelector("#welcome")?.remove();

  addMessage(text, "user");
  input.value = "";

  thinking.classList.add("show");
  sendBtn.disabled = true;

  try {
    const engine = await getEngine();

    messages.push({
      role: "user",
      content: text
    });

    const response = await engine.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      temperature: 0.6,
      max_tokens: 500
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response.";

    messages.push({
      role: "assistant",
      content: reply
    });

    thinking.classList.remove("show");
    addMessage(reply, "ai");
  } catch (error) {
    console.error("Reld AI error:", error);

    thinking.classList.remove("show");

    addMessage(
      "Reld AI couldn't load the local AI model. The model may still need to be downloaded or your device may not support WebGPU.",
      "ai"
    );
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

document.querySelector("#menuBtn").addEventListener("click", () => {
  menu.classList.add("open");
});

document.querySelector("#closeMenu").addEventListener("click", () => {
  menu.classList.remove("open");
});

document.querySelector("#settingsBtn").addEventListener("click", () => {
  settings.classList.add("open");
});

document.querySelector("#openSettings").addEventListener("click", () => {
  menu.classList.remove("open");
  settings.classList.add("open");
});

document.querySelector("#closeSettings").addEventListener("click", () => {
  settings.classList.remove("open");
});

document.querySelector("#newChat").addEventListener("click", () => {
  messages = [];

  chat.innerHTML = `
    <section class="welcome" id="welcome">
      <div class="welcome-logo">R</div>
      <h1>Hey, I'm Reld AI</h1>
      <p>Your intelligent assistant</p>
    </section>
  `;

  menu.classList.remove("open");
});

document.querySelector("#clearChats").addEventListener("click", () => {
  messages = [];
  chat.innerHTML = "";
  menu.classList.remove("open");
});

console.log("Reld AI loaded.");
