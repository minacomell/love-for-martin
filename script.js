const screens = [...document.querySelectorAll(".screen")];
const nameForm = document.querySelector("#nameForm");
const nameInput = document.querySelector("#name");
const loginError = document.querySelector("#loginError");
const letterTitle = document.querySelector("#letterTitle");
const editableMessage = document.querySelector("#editableMessage");
const editHint = document.querySelector("#editHint");
const saveStatus = document.querySelector("#saveStatus");
const nextButton = document.querySelector("#nextButton");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const noMessage = document.querySelector("#noMessage");
const againButton = document.querySelector("#againButton");
const hearts = document.querySelector("#hearts");

let currentUser = "";
let noCount = 0;
let heartTimer;
let saveTimer;

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

function loadMessage() {
  const savedMessage = localStorage.getItem("minaMessageForMartin");
  if (savedMessage) editableMessage.innerText = savedMessage;
}

function saveMessage() {
  const message = editableMessage.innerText.trim();
  localStorage.setItem("minaMessageForMartin", message);
  saveStatus.textContent = "saved on this device";
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim().toLowerCase();

  if (name !== "martin" && name !== "mina") {
    loginError.textContent = "this little place isn't for you ♡";
    nameInput.select();
    return;
  }

  currentUser = name;
  loginError.textContent = "";
  letterTitle.textContent = currentUser === "mina" ? "Hi, Mina." : "Hi, Martin.";
  const isMina = currentUser === "mina";
  editableMessage.contentEditable = String(isMina);
  editHint.hidden = !isMina;
  showScreen("letter");
  startHearts();
  heartBurst();
  loadMessage();
});

editableMessage.addEventListener("input", () => {
  clearTimeout(saveTimer);
  saveStatus.textContent = "editing...";
  saveTimer = setTimeout(saveMessage, 700);
});
nextButton.addEventListener("click", () => showScreen("question"));

noButton.addEventListener("click", () => {
  noCount += 1;
  const scale = 1 + noCount * .55;
  yesButton.style.transform = `scale(${scale})`;
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
  noButton.textContent = "no";
  noButton.className = "no";
  noMessage.textContent = "";
  showScreen("question");
});
