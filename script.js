/* ==================================================
   EDIT ME - everything you need is up here!
   ================================================== */

const CONFIG = {
  herName: "Naomi",
  yourName: "Your Name",

  // The question she must answer to open the gift.
  gateQuestion: "What is the name of the first place we met?",
  gateAnswers: ["school", "the school"],

  // Her birthday: YYYY-MM-DD (used for the countdown).
  birthday: "2026-10-17",

  // Your letter. Each line in quotes is one paragraph.
  letter: [
    "Dear Naomi,",
    "Write your birthday letter here. Tell her what she means to you, a favorite memory, an inside joke, or something you hope for her new year.",
    "Add as many paragraphs as you want - just add another line.",
  ],
};

/* ==================================================
   MEMORIES - one line per photo/video.
   Put files in the "images" folder, then add:
     { src: "images/photo1.jpg", caption: "that day" },
   Videos work too: "images/video1.mp4"
   ================================================== */

const MEMORIES = [
  { src: "images/photo1.jpg", caption: "write a caption here" },
  { src: "images/photo2.jpg", caption: "write a caption here" },
  { src: "images/photo3.jpg", caption: "write a caption here" },
  { src: "images/video1.mp4", caption: "a video memory" },
];

/* ---------- everything below just works ---------- */

const $ = (id) => document.getElementById(id);

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function isVideo(src) {
  return /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(src);
}

/* ---------- question gate ---------- */

const GATE = $("gate");
const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

function tryUnlock() {
  const val = norm($("gateAnswer").value);
  const ok = CONFIG.gateAnswers.some((a) => norm(a) === val);
  if (ok) {
    GATE.classList.add("hidden");
    $("gift").hidden = false;
    celebrate();
  } else {
    $("gateError").textContent = "Hmm, try again - it means a lot that you remember.";
    $("gateAnswer").value = "";
    $("gateAnswer").focus();
  }
}

$("gateQuestion").textContent = CONFIG.gateQuestion;
$("gateBtn").addEventListener("click", tryUnlock);
$("gateAnswer").addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
$("gateAnswer").focus();

function gateHeart() {
  const h = document.createElement("span");
  h.className = "gate-heart float-heart";
  h.textContent = ["\u2661", "\u2764", "\u273F", "\u2727"][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 13 + Math.random() * 14 + "px";
  h.style.animationDuration = 6 + Math.random() * 4 + "s";
  $("gateHearts").appendChild(h);
  setTimeout(() => h.remove(), 11000);
}
setInterval(gateHeart, 1500);

/* ---------- floating hearts after unlock ---------- */

function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = ["\u2661", "\u2764", "\u273F", "\u2727"][Math.floor(Math.random() * 4)];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 14 + Math.random() * 16 + "px";
  heart.style.color = ["#d16a7c", "#e9b872", "#c995a4"][Math.floor(Math.random() * 3)];
  heart.style.animationDuration = 7 + Math.random() * 5 + "s";
  $("hearts").appendChild(heart);
  setTimeout(() => heart.remove(), 13000);
}
setInterval(spawnHeart, 1800);

/* ---------- confetti + hero ---------- */

function celebrate() {
  const colors = ["#d16a7c", "#e9b872", "#a3c9a8", "#b5a5d5", "#f7d794", "#f0a6ca"];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.animationDuration = 2.5 + Math.random() * 1.5 + "s";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
  setTimeout(() => $("gallery").scrollIntoView({ behavior: "smooth" }), 700);
}

$("openGiftBtn").addEventListener("click", celebrate);

$("heroName").textContent = CONFIG.herName;
document.title = "For " + CONFIG.herName + " \uD83C\uDF82";

/* ---------- memories gallery ---------- */

function mediaEl(src, cls) {
  if (isVideo(src)) {
    const v = document.createElement("video");
    v.src = src; v.className = cls; v.preload = "metadata"; v.playsInline = true; v.muted = true;
    return v;
  }
  const img = document.createElement("img");
  img.src = src; img.className = cls; img.alt = "memory";
  return img;
}

function buildGallery() {
  const grid = $("gallery-grid");
  grid.innerHTML = "";
  MEMORIES.forEach((m) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    const el = mediaEl(m.src, "media");
    el.addEventListener("error", () => card.remove());
    el.addEventListener("click", () => openLightbox(m.src, m.caption));
    if (isVideo(m.src)) {
      el.addEventListener("click", () => { el.muted = false; el.controls = true; openLightbox(m.src, m.caption); }, { once: true });
    }
    const cap = document.createElement("p");
    cap.textContent = m.caption;
    const dl = document.createElement("a");
    dl.className = "dl"; dl.href = m.src; dl.download = ""; dl.textContent = "\u2B07 save this";
    card.append(el, cap, dl);
    grid.appendChild(card);
  });
  showEmptyIfNone();
}

function showEmptyIfNone() {
  const grid = $("gallery-grid");
  if (!grid.querySelector(".polaroid") && !grid.querySelector(".empty-note")) {
    grid.innerHTML = '<p class="empty-note">No memories added yet - drop photos into the "images" folder to fill this.</p>';
  }
}

window.addEventListener("load", showEmptyIfNone);
buildGallery();

/* ---------- add memories from this device (view only) ---------- */

$("memoryInput").addEventListener("change", (e) => {
  const files = [...e.target.files];
  files.forEach((f) => {
    const url = URL.createObjectURL(f);
    const cap = f.type.startsWith("video") ? "from your device (view only)" : "view only - on this device";
    MEMORIES.push({ src: url, caption: cap, local: true });
    const card = $("gallery-grid").lastElementChild;
  });
  buildGallery();
  e.target.value = "";
});

/* ---------- envelope letter ---------- */

function openLetter() {
  const env = $("envelope");
  env.classList.add("open");
  const card = $("letterCard");
  if (!card.hidden) return;
  card.innerHTML = CONFIG.letter
    .map((p) => "<p>" + esc(p) + "</p>")
    .join("") + '<p class="signature">\u2014 with love, ' + esc(CONFIG.yourName) + "</p>";
  card.hidden = false;
  setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 350);
}

$("envelope").addEventListener("click", openLetter);
$("envelope").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLetter(); } });

/* ---------- lightbox ---------- */

let lbList = [];
let lbIndex = 0;

function openLightbox(src, caption) {
  lbList = MEMORIES.filter((m) => !m.local);
  lbIndex = Math.max(0, lbList.findIndex((m) => m.src === src));
  renderLightbox();
  $("lightbox").hidden = false;
}

function renderLightbox() {
  const m = lbList[lbIndex];
  if (!m) return;
  const stage = $("lbMedia");
  stage.innerHTML = "";
  const el = mediaEl(m.src, "");
  if (isVideo(m.src)) { el.controls = true; el.muted = false; el.autoplay = true; }
  stage.appendChild(el);
  $("lbCaption").textContent = m.caption;
  $("lbDl").href = m.src;
  $("lbDl").style.display = m.local ? "none" : "";
}

function lbStep(dir) {
  if (!lbList.length) return;
  lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
  renderLightbox();
}

function closeLightbox() {
  $("lbMedia").innerHTML = "";
  $("lightbox").hidden = true;
}

$("lbClose").addEventListener("click", closeLightbox);
$("lbPrev").addEventListener("click", () => lbStep(-1));
$("lbNext").addEventListener("click", () => lbStep(1));
$("lightbox").addEventListener("click", (e) => { if (e.target === $("lightbox")) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if ($("lightbox").hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbStep(-1);
  if (e.key === "ArrowRight") lbStep(1);
});

/* ---------- countdown ---------- */

const target = new Date(CONFIG.birthday + "T00:00:00");
const days = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
$("countdown").textContent = days > 0 ? days + " days until your day" : "happy birthday!!";
