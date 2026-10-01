const slides = window.SLIDES || [];
let currentIndex = 0;

const reader = document.getElementById("reader");
const slideContent = document.getElementById("slideContent");
const slideNo = document.getElementById("slideNo");
const slideName = document.getElementById("slideName");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const slideList = document.getElementById("slideList");

function updateUrl(number) { history.replaceState(null, "", `#slide=${number}`); }
function findIndexFromHash() {
  const match = location.hash.match(/slide=(\d+)/);
  if (!match) return 0;
  const wanted = Number(match[1]);
  const found = slides.findIndex(slide => slide.number === wanted);
  return found >= 0 ? found : 0;
}
async function loadSlide(index) {
  const slide = slides[index];
  if (!slide) return;
  currentIndex = index;
  slideContent.innerHTML = `<div class="loading">Loading slide…</div>`;
  try {
    const response = await fetch(slide.file, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load ${slide.file}`);
    slideContent.innerHTML = await response.text();
    slideNo.textContent = `Slide ${slide.number}`;
    slideName.textContent = slide.title;
    const position = currentIndex + 1;
    const total = slides.length;
    const percent = Math.round((position / total) * 100);
    progressText.textContent = `${position}/${total}`;
    progressBar.style.width = `${percent}%`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === total - 1;
    nextBtn.textContent = currentIndex === total - 1 ? "Finished ✓" : "Next →";
    reader.scrollTop = 0;
    updateUrl(slide.number);
    document.querySelectorAll("#slideList button").forEach((button, i) => button.classList.toggle("active", i === currentIndex));
  } catch (error) {
    slideContent.innerHTML = `<div class="error"><div><strong>Slide could not be loaded.</strong><p>This website uses <code>fetch()</code> to import each slide file. Please open it through a web server instead of double-clicking index.html.</p></div></div>`;
    console.error(error);
  }
}
function go(delta) {
  const nextIndex = currentIndex + delta;
  if (nextIndex < 0 || nextIndex >= slides.length) return;
  loadSlide(nextIndex);
}
function openDrawer() { drawer.classList.add("open"); backdrop.classList.add("open"); }
function closeDrawer() { drawer.classList.remove("open"); backdrop.classList.remove("open"); }
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
}
function buildSlideList() {
  slideList.innerHTML = slides.map((slide, index) => `<button type="button" data-index="${index}"><span class="toc-no">Slide ${slide.number}</span><span class="toc-title">${escapeHtml(slide.title)}</span></button>`).join("");
  slideList.addEventListener("click", event => {
    const button = event.target.closest("button[data-index]");
    if (!button) return;
    loadSlide(Number(button.dataset.index));
    closeDrawer();
  });
}
prevBtn.addEventListener("click", () => go(-1));
nextBtn.addEventListener("click", () => go(1));
document.getElementById("menuBtn").addEventListener("click", openDrawer);
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") go(-1);
  if (event.key === "ArrowRight") go(1);
  if (event.key === "Escape") closeDrawer();
});
let touchStartX = null, touchStartY = null;
reader.addEventListener("touchstart", event => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX; touchStartY = touch.clientY;
}, { passive: true });
reader.addEventListener("touchend", event => {
  if (touchStartX === null || touchStartY === null) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
  touchStartX = null; touchStartY = null;
}, { passive: true });
let fontSize = Number(localStorage.getItem("lectureReaderFontSize") || 18);
function setFontSize(size) {
  fontSize = Math.max(14, Math.min(26, size));
  document.documentElement.style.setProperty("--reader-font-size", `${fontSize}px`);
  localStorage.setItem("lectureReaderFontSize", fontSize);
}
document.getElementById("fontDown").addEventListener("click", () => setFontSize(fontSize - 1));
document.getElementById("fontUp").addEventListener("click", () => setFontSize(fontSize + 1));
setFontSize(fontSize);
buildSlideList();
currentIndex = findIndexFromHash();
loadSlide(currentIndex);
