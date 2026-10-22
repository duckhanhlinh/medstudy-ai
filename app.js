const API_URL = "https://medstudy-ai-ao32.onrender.com/chat";

const panels = {
  chat: document.getElementById("chatPanel"),
  schedule: document.getElementById("schedulePanel"),
  library: document.getElementById("libraryPanel"),
  quiz: document.getElementById("quizPanel")
};

const titles = {
  chat: "Học Y khoa, có kế hoạch hơn.",
  schedule: "Chủ động với lịch ôn thi.",
  library: "Tài liệu học tập của bạn.",
  quiz: "Ôn chủ động, nhớ lâu hơn."
};

function showPanel(name) {
  Object.entries(panels).forEach(([key, panel]) => {
    if (panel) panel.classList.toggle("hidden", key !== name);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.panel === name);
  });

  const title = document.getElementById("pageTitle");
  if (title) title.textContent = titles[name] || titles.chat;
}

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => showPanel(button.dataset.panel));
});

function addMessage(role, text) {
  const messages = document.getElementById("messages");
  if (!messages) return;

  const item = document.createElement("div");
  item.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "Bạn" : "✚";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const heading = document.createElement("strong");
  heading.textContent = role === "user" ? "Bạn" : "MedStudy AI";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  bubble.append(heading, paragraph);
  item.append(avatar, bubble);
  messages.append(item);

  messages.scrollTop = messages.scrollHeight;
}

async function submitPrompt(prompt) {
  const message = (prompt || "").trim();
  if (!message) return;

  addMessage("user", message);

  const input = document.getElementById("userInput");
  const sendButton = document.querySelector('#chatForm button[type="submit"]');

  if (sendButton) sendButton.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Lỗi máy chủ: ${response.status}`);
    }

    addMessage("assistant", data.reply || "AI chưa có câu trả lời.");

    // Hiển thị nguồn nếu backend đã trả về nguồn tài liệu.
    if (Array.isArray(data.sources) && data.sources.length > 0) {
      addMessage("assistant", "Nguồn tham khảo: " + [...new Set(data.sources)].join("; "));
    }
  } catch (error) {
    console.error("MedStudy AI error:", error);

    addMessage(
      "assistant",
      "Chưa kết nối được AI. Bà hãy kiểm tra mạng hoặc thử lại sau. Chi tiết: " +
      error.message
    );
  } finally {
    if (sendButton) sendButton.disabled = false;
    if (input) input.focus();
  }
}

const chatForm = document.getElementById("chatForm");

if (chatForm) {
  chatForm.addEventListener("submit", async event => {
    event.preventDefault();

    const input = document.getElementById("userInput");
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    await submitPrompt(message);
  });
}

document.getElementById("newChat")?.addEventListener("click", () => {
  const messages = document.getElementById("messages");

  if (messages) {
    messages.replaceChildren();
    addMessage("assistant", "Chào bà! Mình bắt đầu cuộc trò chuyện mới nhé. Bà muốn học gì hôm nay?");
  }

  showPanel("chat");
});

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById("userInput");
    if (input) {
      input.value = button.dataset.prompt || "";
      input.focus();
    }
  });
});

document.querySelectorAll("[data-go-chat]").forEach(button => {
  button.addEventListener("click", () => {
    showPanel("chat");
    submitPrompt(button.dataset.goChat);
  });
});

document.getElementById("uploadInfo")?.addEventListener("click", () => {
  document.getElementById("uploadHelp")?.classList.toggle("hidden");
});
