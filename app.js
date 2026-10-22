
const panels = {
  chat: document.getElementById('chatPanel'),
  schedule: document.getElementById('schedulePanel'),
  library: document.getElementById('libraryPanel'),
  quiz: document.getElementById('quizPanel')
};

const titles = {
  chat: 'Học Y khoa, có kế hoạch hơn.',
  schedule: 'Chủ động với lịch ôn thi.',
  library: 'Tài liệu học tập của bạn.',
  quiz: 'Ôn chủ động, nhớ lâu hơn.'
};

// Địa chỉ backend MedStudy AI trên Render
const API_URL = 'https://medstudy-ai-ao32.onrender.com';

function showPanel(name) {
  Object.entries(panels).forEach(([key, el]) => {
    if (el) {
      el.classList.toggle('hidden', key !== name);
    }
  });

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.panel === name);
  });

  const pageTitle = document.getElementById('pageTitle');

  if (pageTitle) {
    pageTitle.textContent = titles[name] || titles.chat;
  }
}

// Chuyển đổi các trang trong giao diện
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => {
    showPanel(el.dataset.panel);
  });
});

// Tạo cuộc trò chuyện mới
const newChatButton = document.getElementById('newChat');

if (newChatButton) {
  newChatButton.addEventListener('click', () => {
    const messages = document.getElementById('messages');

    if (messages) {
      messages.innerHTML = `
        <div class="message assistant">
          <div class="message-avatar">✚</div>
          <div class="bubble">
            <strong>MedStudy AI</strong>
            <p>Cuộc trò chuyện mới đã sẵn sàng.</p>
          </div>
        </div>
      `;
    }

    showPanel('chat');
  });
}

// Hiển thị tin nhắn trong giao diện
function addMessage(role, text) {
  const messages = document.getElementById('messages');

  if (!messages) return;

  const item = document.createElement('div');
  item.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? 'Bạn' : '✚';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const strong = document.createElement('strong');
  strong.textContent = role === 'user' ? 'Bạn' : 'MedStudy AI';

  const p = document.createElement('p');
  p.textContent = text;

  bubble.append(strong, p);
  item.append(avatar, bubble);
  messages.append(item);

  messages.scrollTop = messages.scrollHeight;
}

// Gửi câu hỏi tới backend Render và nhận câu trả lời
async function submitPrompt(prompt) {
  if (!prompt || !prompt.trim()) return;

  const message = prompt.trim();

  // Hiển thị câu hỏi của người dùng
  addMessage('user', message);

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    // Đọc kết quả từ backend
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Không gọi được AI.');
    }

    // Hiển thị câu trả lời của AI
    addMessage(
      'assistant',
      data.reply || 'AI chưa có câu trả lời.'
    );

  } catch (error) {
    addMessage(
      'assistant',
      `Chưa kết nối được AI: ${error.message}. Hãy kiểm tra backend Render.`
    );
  }
}

// Xử lý gửi câu hỏi: chỉ đăng ký một lần
const chatForm = document.getElementById('chatForm');

if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = document.getElementById('userInput');

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    input.value = '';

    await submitPrompt(message);
  });
}
