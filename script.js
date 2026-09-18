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
   MEMORIES - organized by month, then by date.
   Put files in the "images" folder, then add:
     { src: "images/photo1.jpg", date: "2026-04-12", caption: "that day", note: "describe the moment" },
   Videos work too: "images/video1.mp4"
   ================================================== */

const MONTHS = [
  { key: "april",      label: "April" },
  { key: "may",        label: "May" },
  { key: "june",       label: "June" },
  { key: "july",       label: "July" },
  { key: "august",     label: "August" },
  { key: "september",  label: "September" },
  { key: "october",    label: "October" },
];

const MEMORIES = {
  april: [],
  may: [],
  june: [],
  july: [],
  august: [],
  september: [],
  october: [],
};

const SCREENSHOTS = {
  april: [],
  may: [],
  june: [],
  july: [],
  august: [],
  september: [],
  october: [],
};

let selectedMonth = "april";
let ssSelectedMonth = "april";

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

function mediaEl(src, cls, type) {
  if (type === "video" || isVideo(src)) {
    const v = document.createElement("video");
    v.src = src; v.className = cls; v.preload = "metadata"; v.playsInline = true; v.muted = true;
    return v;
  }
  const img = document.createElement("img");
  img.src = src; img.className = cls; img.alt = "memory";
  return img;
}

function buildMonthTabs() {
  const tabs = $("month-tabs");
  tabs.innerHTML = "";
  MONTHS.forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "month-tab" + (m.key === selectedMonth ? " active" : "");
    btn.textContent = m.label;
    btn.addEventListener("click", () => {
      selectedMonth = m.key;
      document.querySelectorAll(".month-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      buildGallery();
    });
    tabs.appendChild(btn);
  });
}

function buildGallery() {
  const grid = $("gallery-grid");
  grid.innerHTML = "";
  const list = (MEMORIES[selectedMonth] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (!list.length) {
    grid.innerHTML = '<p class="empty-note">No memories in this month yet.</p>';
    return;
  }
  let lastDate = "";
  list.forEach((m, idx) => {
    const dateLabel = formatDate(m.date);
    if (dateLabel !== lastDate) {
      const heading = document.createElement("h3");
      heading.className = "date-heading";
      heading.textContent = dateLabel;
      grid.appendChild(heading);
      lastDate = dateLabel;
    }
    const card = document.createElement("div");
    card.className = "polaroid";
    const el = mediaEl(m.src, "media");
    el.addEventListener("error", () => card.remove());
    el.addEventListener("click", () => openLightbox(m.src, m.caption));
    if (isVideo(m.src)) {
      el.addEventListener("click", () => { el.muted = false; el.controls = true; openLightbox(m.src, m.caption); }, { once: true });
    }
    const cap = document.createElement("p");
    cap.className = "card-caption";
    cap.textContent = m.caption;
    const dl = document.createElement("a");
    dl.className = "dl"; dl.href = m.src; dl.download = ""; dl.textContent = "\u2B07 save this";
    card.append(el, cap, dl);
    if (!m.local) {
      const noteArea = document.createElement("div");
      noteArea.className = "card-note";
      const noteKey = "note_" + selectedMonth + "_" + idx;
      const saved = localStorage.getItem(noteKey) || m.note || "";
      const ta = document.createElement("textarea");
      ta.className = "note-input";
      ta.placeholder = "describe this moment...";
      ta.value = saved;
      ta.addEventListener("input", () => { localStorage.setItem(noteKey, ta.value); });
      const saveHint = document.createElement("span");
      saveHint.className = "save-hint";
      saveHint.textContent = "saved on your device";
      noteArea.append(ta, saveHint);
      card.appendChild(noteArea);
    }
    grid.appendChild(card);
  });
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

buildMonthTabs();
buildGallery();

/* ---------- add memories from this device (view only) ---------- */

$("memoryInput").addEventListener("change", (e) => {
  const files = [...e.target.files];
  files.forEach((f) => {
    const url = URL.createObjectURL(f);
    const cap = f.type.startsWith("video") ? "from your device (view only)" : "view only - on this device";
    const today = new Date().toISOString().slice(0, 10);
    if (!MEMORIES[selectedMonth]) MEMORIES[selectedMonth] = [];
    MEMORIES[selectedMonth].push({ src: url, caption: cap, local: true, date: today });
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
  const allMems = [];
  Object.values(MEMORIES).forEach((arr) => allMems.push(...arr));
  lbList = allMems.filter((m) => !m.local).sort((a, b) => a.date.localeCompare(b.date));
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

/* ---------- screenshots section ---------- */

function buildSSMonthTabs() {
  const tabs = $("ss-month-tabs");
  if (!tabs) return;
  tabs.innerHTML = "";
  MONTHS.forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "month-tab" + (m.key === ssSelectedMonth ? " active" : "");
    btn.textContent = m.label;
    btn.addEventListener("click", () => {
      ssSelectedMonth = m.key;
      tabs.querySelectorAll(".month-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      buildScreenshots();
    });
    tabs.appendChild(btn);
  });
}

function buildScreenshots() {
  const grid = $("ss-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const list = (SCREENSHOTS[ssSelectedMonth] || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (!list.length) {
    grid.innerHTML = '<p class="empty-note">No screenshots in this month yet.</p>';
    return;
  }
  let lastDate = "";
  list.forEach((m) => {
    const dateLabel = formatDate(m.date);
    if (dateLabel !== lastDate) {
      const heading = document.createElement("h3");
      heading.className = "date-heading";
      heading.textContent = dateLabel;
      grid.appendChild(heading);
      lastDate = dateLabel;
    }
    const card = document.createElement("div");
    card.className = "polaroid";
    const el = mediaEl(m.src, "media");
    el.addEventListener("error", () => card.remove());
    el.addEventListener("click", () => openLightbox(m.src, m.caption));
    const cap = document.createElement("p");
    cap.className = "card-caption";
    cap.textContent = m.caption;
    const dl = document.createElement("a");
    dl.className = "dl"; dl.href = m.src; dl.download = ""; dl.textContent = "\u2B07 save this";
    card.append(el, cap, dl);
    grid.appendChild(card);
  });
}

$("ssInput").addEventListener("change", (e) => {
  const files = [...e.target.files];
  files.forEach((f) => {
    const url = URL.createObjectURL(f);
    const today = new Date().toISOString().slice(0, 10);
    if (!SCREENSHOTS[ssSelectedMonth]) SCREENSHOTS[ssSelectedMonth] = [];
    SCREENSHOTS[ssSelectedMonth].push({ src: url, caption: "screenshot", local: true, date: today });
  });
  buildScreenshots();
  e.target.value = "";
});

buildSSMonthTabs();
buildScreenshots();

/* ---------- countdown ---------- */

const target = new Date(CONFIG.birthday + "T00:00:00");
const days = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
$("countdown").textContent = days > 0 ? days + " days until your day" : "happy birthday!!";
