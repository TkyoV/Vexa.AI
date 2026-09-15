const chat = document.getElementById('chat');
const input = document.getElementById('textInput');
const send = document.getElementById('send');
const mic = document.getElementById('mic');
const state = document.getElementById('state');

function addMessage(text, who) {
  const el = document.createElement('div');
  el.className = `message ${who}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

async function localReply(text) {
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: text})
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "AI request failed");
  return data.reply;
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.02;
  u.pitch = 1.0;
  speechSynthesis.speak(u);
}

async function sendText(text = input.value.trim()) {
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';
  state.textContent = 'Vexa is thinking...';
  try {
    const reply = await localReply(text);
    addMessage(reply, 'vexa');
    speak(reply);
  } catch (error) {
    addMessage('I can’t reach my AI brain yet. Start the Vexa server and try again.', 'vexa');
    console.error(error);
  } finally {
    state.textContent = 'Ready when you are.';
  }
}

send.addEventListener('click', () => sendText());
input.addEventListener('keydown', e => { if (e.key === 'Enter') sendText(); });

document.querySelectorAll('.quick button').forEach(b => {
  b.addEventListener('click', () => sendText(b.dataset.msg));
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  mic.addEventListener('click', () => {
    try {
      recognition.start();
      mic.classList.add('listening');
      state.textContent = 'Vexa is listening...';
    } catch (_) {}
  });

  recognition.onresult = e => {
    input.value = e.results[0][0].transcript;
    sendText();
  };
  recognition.onerror = () => {
    state.textContent = 'Voice input was unavailable.';
  };
  recognition.onend = () => {
    mic.classList.remove('listening');
    if (state.textContent === 'Vexa is listening...') state.textContent = 'Ready when you are.';
  };
} else {
  mic.addEventListener('click', () => {
    state.textContent = 'Voice recognition is not supported by this browser.';
  });
}
