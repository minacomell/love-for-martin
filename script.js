const screens = [...document.querySelectorAll(".screen")];
const nameForm = document.querySelector("#nameForm");
const nameInput = document.querySelector("#name");
const passwordWrap = document.querySelector("#passwordWrap");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#loginError");
const letterTitle = document.querySelector("#letterTitle");
const editableMessage = document.querySelector("#editableMessage");
const editHint = document.querySelector("#editHint");
const saveStatus = document.querySelector("#saveStatus");
const nextButton = document.querySelector("#nextButton");
const musicButton = document.querySelector("#musicButton");
const musicNextButton = document.querySelector("#musicNextButton");
const song = document.querySelector("#song");
const lyrics = document.querySelector("#lyrics");
const slideshow = document.querySelector("#slideshow");
const photoPanel = document.querySelector(".photo-panel");
const questionTitle = document.querySelector("#questionTitle");
const questionText = document.querySelector("#questionText");
const questionEditor = document.querySelector("#questionEditor");
const questionTitleInput = document.querySelector("#questionTitleInput");
const questionTextInput = document.querySelector("#questionTextInput");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const noMessage = document.querySelector("#noMessage");
const yayText = document.querySelector("#yayText");
const againButton = document.querySelector("#againButton");
const hearts = document.querySelector("#hearts");

const ADMIN_PASSWORD = "mina123";
const photoList = [
  "assets/photos/photo1.jpg",
  "assets/photos/photo2.jpg",
  "assets/photos/photo3.jpg",
  "assets/photos/photo4.jpg",
];
const lyricLines = [
  "I keep your name in the quiet parts of me",
  "in every song that suddenly feels true",
  "if distance gets heavy, I still choose you",
  "again and again, in every little way",
  "maybe I miss you more than I say",
  "maybe my heart has been saying it first",
  "so tell me softly, tell me honestly",
  "do you feel it too?",
];

let currentUser = "";
let isAdmin = false;
let noCount = 0;
let heartTimer;
let saveTimer;
let photoIndex = 0;

function showScreen(id) {
  screens.forEach((screen) => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
}

function createHeart(burst = false) {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > .25 ? "♥" : "♡";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${burst ? 14 + Math.random() * 26 : 9 + Math.random() * 15}px`;
  heart.style.setProperty("--duration", `${burst ? 2.5 + Math.random() * 2 : 7 + Math.random() * 6}s`);
  heart.style.setProperty("--opacity", `${.2 + Math.random() * .4}`);
  heart.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
  hearts.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

function startHearts() {
  clearInterval(heartTimer);
  heartTimer = setInterval(createHeart, 700);
}

function heartBurst() {
  for (let i = 0; i < 45; i += 1) setTimeout(() => createHeart(true), i * 35);
}

function renderLyrics() {
  lyrics.innerHTML = `<div class="lyrics-inner">${lyricLines.map((line) => `<p>${line}</p>`).join("")}</div>`;
}

function loadContent() {
  const savedMessage = localStorage.getItem("minaMessageForMartin");
  const savedQuestionTitle = localStorage.getItem("minaQuestionTitle");
  const savedQuestionText = localStorage.getItem("minaQuestionText");
  if (savedMessage) editableMessage.innerText = savedMessage;
  if (savedQuestionTitle) questionTitleInput.value = savedQuestionTitle;
  if (savedQuestionText) questionTextInput.value = savedQuestionText;
  applyQuestionText();
}

function saveContent() {
  localStorage.setItem("minaMessageForMartin", editableMessage.innerText.trim());
  localStorage.setItem("minaQuestionTitle", questionTitleInput.value.trim());
  localStorage.setItem("minaQuestionText", questionTextInput.value.trim());
  saveStatus.textContent = "saved on this device";
  applyQuestionText();
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveStatus.textContent = "editing...";
  saveTimer = setTimeout(saveContent, 500);
}

function applyQuestionText() {
  const title = questionTitleInput.value.trim() || "I miss u so much.";
  const question = questionTextInput.value.trim() || "do u miss me too?";
  const words = title.split(" ");
  const lastWords = words.splice(-2).join(" ");
  questionTitle.innerHTML = `${words.join(" ")}<br><em>${lastWords}</em>`;
  questionText.textContent = question;
  yayText.textContent = question.toLowerCase().includes("love") ? "i love you more, martin ♥" : "i miss you more, martin ♥";
}

function showPhoto(index) {
  slideshow.src = photoList[index % photoList.length];
}

slideshow.addEventListener("load", () => photoPanel.classList.add("has-photo"));
slideshow.addEventListener("error", () => photoPanel.classList.remove("has-photo"));

setInterval(() => {
  photoIndex += 1;
  showPhoto(photoIndex);
}, 3800);

nameInput.addEventListener("input", () => {
  const wantsAdmin = nameInput.value.trim().toLowerCase() === "mina";
  passwordWrap.hidden = !wantsAdmin;
  passwordInput.required = wantsAdmin;
});

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim().toLowerCase();

  if (name !== "martin" && name !== "mina") {
    loginError.textContent = "this little place isn't for you ♡";
    nameInput.select();
    return;
  }

  if (name === "mina" && passwordInput.value !== ADMIN_PASSWORD) {
    loginError.textContent = "wrong password for Mina";
    passwordInput.select();
    return;
  }

  currentUser = name;
  isAdmin = name === "mina";
  loginError.textContent = "";
  letterTitle.textContent = isAdmin ? "Hi, Mina." : "Hi, Martin.";
  editableMessage.contentEditable = String(isAdmin);
  editHint.hidden = !isAdmin;
  questionEditor.hidden = !isAdmin;
  loadContent();
  renderLyrics();
  showScreen("letter");
  startHearts();
  heartBurst();
});

editableMessage.addEventListener("input", scheduleSave);
questionTitleInput.addEventListener("input", scheduleSave);
questionTextInput.addEventListener("input", scheduleSave);

nextButton.addEventListener("click", () => showScreen("music"));
musicNextButton.addEventListener("click", () => showScreen("question"));

musicButton.addEventListener("click", async () => {
  if (!song.paused) {
    song.pause();
    musicButton.textContent = "play music ♥";
    return;
  }

  try {
    await song.play();
    musicButton.textContent = "pause music";
  } catch {
    musicButton.textContent = "add assets/song.mp3";
  }
});

noButton.addEventListener("click", () => {
  noCount += 1;
  yesButton.style.transform = `scale(${1 + noCount * .55})`;
  noMessage.textContent = ["are you sure?", "really really sure?", "last chance..."][noCount - 1] || "";

  if (noCount >= 3) {
    noButton.classList.add("gone");
    noMessage.textContent = "okay, only one answer left ♥";
  }
});

function celebrate() {
  showScreen("yay");
  heartBurst();
  setTimeout(heartBurst, 800);
}

yesButton.addEventListener("click", celebrate);

againButton.addEventListener("click", () => {
  noCount = 0;
  yesButton.style.transform = "";
  noButton.className = "no";
  noMessage.textContent = "";
  showScreen("question");
});
