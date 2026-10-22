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
  strong.textContent = role === 'user' ? 'Bạn' : 'MedStudy AI · Demo';
  const p = document.createElement('p');
  p.textContent = text;
  bubble.append(strong, p);
  if (role !== 'user') {
    const small = document.createElement('small');
    small.textContent = 'Phản hồi minh họa, chưa được tạo bởi mô hình AI.';
    bubble.append(small);
  }
  item.append(avatar, bubble);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}
function submitPrompt(prompt) {
  if (!prompt || !prompt.trim()) return;
  addMessage('user', prompt.trim());
  addMessage('assistant', 'Mình đã nhận câu hỏi trong giao diện mẫu. Để trả lời thực sự, bước tiếp theo cần kết nối backend với mô hình AI; để trả lời dựa trên đề cương riêng, cần nạp và lập chỉ mục các tài liệu đó trước.');
}
document.getElementById('chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('userInput');
  submitPrompt(input.value);
  input.value = '';
});
document.querySelectorAll('[data-prompt]').forEach(el => el.addEventListener('click', () => {
  document.getElementById('userInput').value = el.dataset.prompt;
  document.getElementById('userInput').focus();
}));
document.getElementById('uploadInfo').addEventListener('click', () => document.getElementById('uploadHelp').classList.toggle('hidden'));
document.querySelectorAll('[data-go-chat]').forEach(el => el.addEventListener('click', () => {
  showPanel('chat');
  submitPrompt(el.dataset.goChat);
}));
