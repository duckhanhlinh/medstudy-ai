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
function showPanel(name) {
  Object.entries(panels).forEach(([key, el]) => el.classList.toggle('hidden', key !== name));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.panel === name));
  document.getElementById('pageTitle').textContent = titles[name] || titles.chat;
}
document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => showPanel(el.dataset.panel)));
document.getElementById('newChat').addEventListener('click', () => {
  document.getElementById('messages').innerHTML = '<div class="message assistant"><div class="message-avatar">✚</div><div class="bubble"><strong>MedStudy AI</strong><p>Cuộc trò chuyện mới đã sẵn sàng trong bản demo. Lưu ý: chưa có kết nối mô hình AI.</p></div></div>';
  showPanel('chat');
});

function addMessage(role, text) {
  const messages = document.getElementById('messages');
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

async function submitPrompt(prompt) {
  if (!prompt || !prompt.trim()) return;

  const message = prompt.trim();
  addMessage('user', message);

  try {
    const response = await fetch('http://127.0.0.1:8001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Không gọi được AI.');
    }

    addMessage('assistant', data.reply || 'AI chưa có câu trả lời.');
  } catch (error) {
    addMessage(
      'assistant',
      `Chưa kết nối được AI: ${error.message}. Hãy kiểm tra backend.`
    );
  }
}
document.getElementById('chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('userInput');
  submitPrompt(input.value);
  input.value = '';
});

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
code bên ap.js đây
