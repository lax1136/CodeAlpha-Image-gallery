// ---- Element references ----
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let visibleCards = Array.from(cards);
let currentIndex = 0;

// ---- Filtering ----
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.cat;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    cards.forEach(card => {
      const matches = category === "all" || card.dataset.cat === category;
      card.classList.toggle("hidden", !matches);
    });

    // Recalculate which cards are visible, for correct lightbox navigation
    visibleCards = Array.from(cards).filter(card => !card.classList.contains("hidden"));

    // Restart the entrance animation on visible cards
    visibleCards.forEach((card, i) => {
      card.style.animation = "none";
      requestAnimationFrame(() => {
        card.style.animation = "";
        card.style.animationDelay = (i * 0.05) + "s";
      });
    });
  });
});

// ---- Lightbox ----
cards.forEach(card => {
  card.addEventListener("click", () => {
    visibleCards = Array.from(cards).filter(c => !c.classList.contains("hidden"));
    currentIndex = visibleCards.indexOf(card);
    openLightbox();
  });
});

function openLightbox(){
  updateLightbox();
  lightbox.classList.add("open");
}

function updateLightbox(){
  const card = visibleCards[currentIndex];
  const img = card.querySelector("img");
  lbImage.src = img.src;
  lbImage.alt = img.alt;
  lbCaption.textContent = `${img.alt} — ${currentIndex + 1} / ${visibleCards.length}`;
}

function closeLightbox(){
  lightbox.classList.remove("open");
}

function showNext(){
  currentIndex = (currentIndex + 1) % visibleCards.length;
  updateLightbox();
}

function showPrev(){
  currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
  updateLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", showNext);
lbPrev.addEventListener("click", showPrev);

// Close when clicking the dark backdrop (not the image itself)
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
});

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  // Typing a search resets any active category filter to "All"
  filterButtons.forEach(b => b.classList.remove("active"));
  document.querySelector('.filter-btn[data-cat="all"]').classList.add("active");

  cards.forEach(card => {
    const title = card.querySelector(".veil span").textContent.toLowerCase();
    const matches = title.includes(query);
    card.classList.toggle("hidden", !matches);
  });

  visibleCards = Array.from(cards).filter(card => !card.classList.contains("hidden"));
});