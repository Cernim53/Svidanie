const TELEGRAM_USERNAME = "konstantyn24";
const DISCORD_USER_ID = "306815000117510145";

let selectedCategories = [];
let selectedMovies = [];
let selectedGames = [];
let selectedMusic = [];
let selectedPlatform = "Telegram";
let selectedCouponState = "";

let scale = 1;
let noCount = 0;

const noTexts = [
  "Ты уверена?",
  "Подумай ещё!",
  "Ну давай поболтаем!",
  "Я буду скучать 🥺",
  "Жми на фиолетовую!"
];

const compliments = [
  "У тебя отличный вкус! ✨",
  "С тобой любой вечер прекрасен 💖",
  "Уже жду не дождусь нашего созвона! ☕",
  "Ты делаешь этот выбор идеальным! 💫",
  "С месяцем нас! 🌸"
];

const randomIdeas = [
  "🎮 Сыграем в It Takes Two",
  "🍿 Посмотрим фильм 1+1",
  "🌸 Посмотрим «Унесённые призраками»",
  "🎨 Посмотрим «Шрек»",
  "☕ Просто укроемся пледом и поболтаем",
  "🎵 Послушаем Lofi и расслабимся"
];

let currentRandomChoice = "";

function setCategoryBackground(gifName) {
  document.body.style.background = `linear-gradient(rgba(10, 10, 20, 0.75), rgba(10, 10, 20, 0.75)), url('assets/${gifName}') center/cover no-repeat fixed`;
}

function copyLinkForShare() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Ссылка на сайт скопирована! 🔗');
  }).catch(() => {
    showToast('Скопируй ссылку из адресной строки 😊');
  });
}

let isPlaying = false;
function toggleMusic() {
  const audio = document.getElementById('lofiAudio');
  const text = document.getElementById('musicText');
  if (isPlaying) {
    audio.pause();
    text.innerText = "Lofi: Выкл";
  } else {
    audio.play().catch(() => {});
    text.innerText = "Lofi: Вкл 🎶";
  }
  isPlaying = !isPlaying;
}

const themes = ['', 'theme-starry', 'theme-neon'];
let currentThemeIdx = 0;
function nextTheme() {
  document.body.classList.remove(themes[currentThemeIdx]);
  currentThemeIdx = (currentThemeIdx + 1) % themes.length;
  if (themes[currentThemeIdx]) {
    document.body.classList.add(themes[currentThemeIdx]);
  }
}

function showToast(customText) {
  const toast = document.getElementById('toast');
  const randomText = customText || compliments[Math.floor(Math.random() * compliments.length)];
  toast.innerText = randomText;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function spawnHearts(e) {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerText = '💖';
    heart.style.left = (e?.clientX || window.innerWidth/2) + (Math.random() * 60 - 30) + 'px';
    heart.style.top = (e?.clientY || window.innerHeight/2) + (Math.random() * 60 - 30) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  }
}

function triggerConfetti() {
  const colors = ['#ec4899', '#8a2be2', '#3b82f6', '#f43f5e', '#eab308'];
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement('div');
    conf.classList.add('confetti');
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3500);
  }
}

function startRandomizer() {
  const modal = document.getElementById('rouletteModal');
  const slot = document.getElementById('slotDisplay');
  const closeBtn = document.getElementById('rouletteCloseBtn');

  modal.style.display = 'flex';
  closeBtn.style.display = 'none';

  let counter = 0;
  const interval = setInterval(() => {
    slot.innerText = randomIdeas[Math.floor(Math.random() * randomIdeas.length)];
    counter++;
    if (counter > 15) {
      clearInterval(interval);
      currentRandomChoice = randomIdeas[Math.floor(Math.random() * randomIdeas.length)];
      slot.innerText = "✨ " + currentRandomChoice + " ✨";
      closeBtn.style.display = 'block';
      triggerConfetti();
    }
  }, 100);
}

function closeRandomizer() {
  document.getElementById('rouletteModal').style.display = 'none';
  if (currentRandomChoice) {
    if (!selectedCategories.includes('random')) {
      selectedCategories.push('random');
    }
  }
  goToStep(3);
}

function openSecretEnvelope() {
  document.getElementById('envelopeModal').style.display = 'flex';
  document.getElementById('envelopeObj').classList.remove('open');
}

function toggleEnvelope(e) {
  e.stopPropagation();
  const env = document.getElementById('envelopeObj');
  if (!env.classList.contains('open')) {
    env.classList.add('open');
    spawnHearts(e);
  }
}

function closeSecretEnvelope(e) {
  if (e.target.id === 'envelopeModal') {
    document.getElementById('envelopeModal').style.display = 'none';
  }
}

window.goToStep = function(stepId) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const target = typeof stepId === 'number' ? 'step' + stepId : stepId;
  const nextStepEl = document.getElementById(target);
  
  if (target === 'stepMovies') setCategoryBackground('cinema.gif');
  else if (target === 'stepGames') setCategoryBackground('gaming.gif');
  else if (target === 'stepMusic') setCategoryBackground('cat_vinil.gif');
  else if (target === 'step3' && selectedCategories.includes('talk')) setCategoryBackground('cip.gif');
  else setCategoryBackground('lofi.gif');

  if (target === 'step4' || target === 4) {
    updateFinalStepUI();
  }

  if (nextStepEl) nextStepEl.classList.add('active');
};

function selectCoupon(el, couponText) {
  const parent = el.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedCouponState = couponText;
  showToast('Купон активирован! 🎟️✨');
}

function updateFinalStepUI() {
  const sendBtn = document.getElementById('sendActionBtn');
  const noticeBox = document.getElementById('tgNotice');
  const bpTimeText = document.getElementById('bpTimeText');
  const bpPlatformText = document.getElementById('bpPlatformText');
  const inputEl = document.getElementById('timeInput');
  const userTime = (inputEl && inputEl.value.trim() !== '') ? inputEl.value.trim() : "Уточняется";

  bpTimeText.innerText = userTime;
  bpPlatformText.innerText = selectedPlatform;

  if (selectedPlatform === 'Discord') {
    sendBtn.style.background = '#5865F2';
    sendBtn.innerHTML = 'Открыть профиль в Discord 👾';
    noticeBox.style.background = 'rgba(88, 101, 242, 0.18)';
    noticeBox.style.borderColor = 'rgba(88, 101, 242, 0.35)';
    noticeBox.style.color = '#a5b4fc';
    noticeBox.innerHTML = '📌 <strong>Как отправить ответ:</strong><br>При нажатии на кнопку ниже ответ скопируется, и откроется мой профиль Discord. Просто вставь скопированный текст мне в сообщения! 🚀';
  } else {
    sendBtn.style.background = '#0088cc';
    sendBtn.innerHTML = 'Отправить ответ в Telegram ✈️';
    noticeBox.style.background = 'rgba(0, 136, 204, 0.18)';
    noticeBox.style.borderColor = 'rgba(0, 136, 204, 0.35)';
    noticeBox.style.color = '#7dd3fc';
    noticeBox.innerHTML = '📌 <strong>Как отправить ответ:</strong><br>Нажми на кнопку отправки в Telegram. Тебе откроется диалог со мной со сформированным ответом! 🚀';
  }
}

window.handleNoClick = function() {
  scale += 0.25;
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  if (yesBtn) yesBtn.style.transform = 'scale(' + scale + ')';
  if (noBtn) {
    noBtn.textContent = noTexts[noCount % noTexts.length];
    noCount++;
  }
};

window.toggleMainOption = function(element, key) {
  element.classList.toggle('selected');
  if (element.classList.contains('selected')) {
    if (!selectedCategories.includes(key)) selectedCategories.push(key);
    showToast();
  } else {
    selectedCategories = selectedCategories.filter(item => item !== key);
  }
};

window.toggleSubOption = function(array, value, element) {
  element.classList.toggle('selected');
  if (element.classList.contains('selected')) {
    if (!array.includes(value)) array.push(value);
    showToast();
  } else {
    const index = array.indexOf(value);
    if (index > -1) array.splice(index, 1);
  }
};

window.processMainStep = function() {
  if (selectedCategories.includes('movies')) goToStep('stepMovies');
  else if (selectedCategories.includes('games')) goToStep('stepGames');
  else if (selectedCategories.includes('music')) goToStep('stepMusic');
  else goToStep(3);
};

window.processMoviesStep = function() {
  if (selectedCategories.includes('games')) goToStep('stepGames');
  else if (selectedCategories.includes('music')) goToStep('stepMusic');
  else goToStep(3);
};

window.processGamesStep = function() {
  if (selectedCategories.includes('music')) goToStep('stepMusic');
  else goToStep(3);
};

window.processMusicStep = function() {
  goToStep(3);
};

window.selectPlatform = function(element, value) {
  const parent = element.parentElement;
  if (parent) {
    parent.querySelectorAll('.option-card, .option-card-featured').forEach(c => c.classList.remove('selected'));
  }
  element.classList.add('selected');
  selectedPlatform = value;
};

window.sendResponse = function() {
  const inputEl = document.getElementById('timeInput');
  const userTime = (inputEl && inputEl.value.trim() !== '') ? inputEl.value.trim() : "Время напишу отдельно";

  let summaryList = [];

  if (selectedCategories.includes('random') && currentRandomChoice) {
    summaryList.push("🎲 Выбор рулетки: " + currentRandomChoice);
  }

  if (selectedCategories.includes('movies')) {
    let movieStr = "🎬 Фильм/Аниме: ";
    const customMovie = document.getElementById('customMovieInput').value.trim();
    let details = [...selectedMovies];
    if (customMovie) details.push(`Поиск/Свой вариант: "${customMovie}"`);
    movieStr += details.length > 0 ? details.join(", ") : "По выбору";
    summaryList.push(movieStr);
  }

  if (selectedCategories.includes('games')) {
    let gameStr = "🎮 Игры: ";
    const customGame = document.getElementById('customGameInput').value.trim();
    let details = [...selectedGames];
    if (customGame) details.push(`"${customGame}"`);
    gameStr += details.length > 0 ? details.join(", ") : "Онлайн-игры";
    summaryList.push(gameStr);
  }

  if (selectedCategories.includes('music')) {
    let musicStr = "🎵 Музыка: ";
    const customMusic = document.getElementById('customMusicInput').value.trim();
    let details = [...selectedMusic];
    if (customMusic) details.push(`Её трек/исполнитель: "${customMusic}"`);
    musicStr += details.length > 0 ? details.join(", ") : "Послушаем музыку";
    summaryList.push(musicStr);
  }

  if (selectedCategories.includes('talk')) {
    summaryList.push("☕ Разговоры за чаем");
  }

  const activitiesText = summaryList.length > 0 ? summaryList.join("\n• ") : "Просто поболтать";
  const couponText = selectedCouponState ? "\n🎟️ Выбранный купон: " + selectedCouponState : "";

  const text = "Привет! 💫 С праздником нас, ровно 1 месяц! Я согласилась на созвон!\n\n" +
               "🎯 План вечера:\n• " + activitiesText + "\n" +
               couponText + "\n\n" +
               "📱 Где: " + selectedPlatform + "\n" +
               "⏰ Когда: " + userTime;

  const eventTitle = encodeURIComponent("Онлайн-созвон / 1 Месяц вместе ✨");
  const eventDetails = encodeURIComponent("Планы на созвон:\n• " + activitiesText + "\nПлатформа: " + selectedPlatform + "\nВремя: " + userTime);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}`;
  
  const calBtn = document.getElementById('calendarBtn');
  if (calBtn) {
    calBtn.href = calendarUrl;
    calBtn.style.display = 'inline-flex';
  }

  if (selectedPlatform === 'Discord') {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Текст ответа скопирован! 📋');
    }).catch(() => {});

    const discordUrl = "https://discord.com/users/" + DISCORD_USER_ID;
    window.open(discordUrl, '_blank');
  } else {
    const tgUrl = "https://t.me/" + TELEGRAM_USERNAME + "?text=" + encodeURIComponent(text);
    window.open(tgUrl, '_blank');
  }
};