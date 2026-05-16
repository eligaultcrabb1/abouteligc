const adventuresGrid = document.getElementById("adventures-grid");
const filterButtons = document.querySelectorAll("[data-adventure-filter]");
const adventurePosts = window.adventurePosts || [];
const carouselPositions = {};

const badgeClasses = {
  Athletics: "adventure-badge-athletics",
  Activities: "adventure-badge-activities",
  Family: "adventure-badge-family",
  Travel: "adventure-badge-travel",
};

function renderBadges(categories) {
  return categories
    .map(
      (category) => `
        <span class="adventure-badge ${badgeClasses[category] || ""}">
          ${category}
        </span>
      `
    )
    .join("");
}

function getAdventureImages(post) {
  if (Array.isArray(post.images) && post.images.length) {
    return post.images;
  }

  return post.image ? [post.image] : [];
}

function renderCarousel(post) {
  const images = getAdventureImages(post);
  const currentIndex = images.length ? (carouselPositions[post.id] || 0) % images.length : 0;
  const currentImage = images[currentIndex] || "";
  const hasMultipleImages = images.length > 1;

  if (!currentImage) {
    return '<div class="adventure-image adventure-image-placeholder" aria-hidden="true"></div>';
  }

  return `
    <div class="adventure-carousel" data-adventure-id="${post.id}">
      <img
        class="adventure-image"
        src="${currentImage}"
        alt="${post.title}"
        data-carousel-image
      />
      ${
        hasMultipleImages
          ? `
            <button
              class="adventure-carousel-button adventure-carousel-prev"
              type="button"
              aria-label="Previous photo"
              data-carousel-direction="-1"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              class="adventure-carousel-button adventure-carousel-next"
              type="button"
              aria-label="Next photo"
              data-carousel-direction="1"
            >
              <span aria-hidden="true">›</span>
            </button>
            <div class="adventure-carousel-footer" aria-label="Photo ${currentIndex + 1} of ${images.length}">
              <div class="adventure-carousel-dots" aria-hidden="true">
                ${images
                  .map(
                    (_, index) => `
                      <span class="adventure-carousel-dot ${index === currentIndex ? "is-active" : ""}"></span>
                    `
                  )
                  .join("")}
              </div>
              <span class="adventure-carousel-count">${currentIndex + 1}/${images.length}</span>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function updateCarousel(card, post) {
  const images = getAdventureImages(post);
  const currentIndex = images.length ? (carouselPositions[post.id] || 0) % images.length : 0;
  const image = card.querySelector("[data-carousel-image]");
  const dots = card.querySelectorAll(".adventure-carousel-dot");
  const footer = card.querySelector(".adventure-carousel-footer");
  const count = card.querySelector(".adventure-carousel-count");

  if (image) {
    image.src = images[currentIndex];
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });

  if (footer) {
    footer.setAttribute("aria-label", `Photo ${currentIndex + 1} of ${images.length}`);
  }

  if (count) {
    count.textContent = `${currentIndex + 1}/${images.length}`;
  }
}

function renderAdventures(category = "All") {
  if (!adventuresGrid) {
    return;
  }

  const filteredPosts =
    category === "All"
      ? adventurePosts
      : adventurePosts.filter((post) => post.categories.includes(category));

  adventuresGrid.innerHTML = filteredPosts.length
    ? filteredPosts
        .map(
          (post) => `
            <article class="adventure-card" id="${post.id}">
              <div class="adventure-image-wrap">
                ${renderCarousel(post)}
              </div>
              <div class="adventure-card-body">
                <div class="adventure-card-topline">
                  <div class="adventure-badges">${renderBadges(post.categories)}</div>
                  <p class="adventure-year">${post.year}</p>
                </div>
                <h2 class="adventure-title">${post.title}</h2>
                <p class="adventure-place">${post.place}</p>
                <p class="adventure-blurb">${post.blurb}</p>
              </div>
            </article>
          `
        )
        .join("")
    : '<p class="adventure-empty">Nothing here yet.</p>';
}

function setActiveFilter(activeButton) {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button);
    renderAdventures(button.dataset.adventureFilter);
  });
});

adventuresGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-carousel-direction]");

  if (!button) {
    return;
  }

  const carousel = button.closest("[data-adventure-id]");
  const card = button.closest(".adventure-card");
  const postId = carousel?.dataset.adventureId;
  const post = adventurePosts.find((item) => item.id === postId);
  const images = post ? getAdventureImages(post) : [];

  if (!post || images.length < 2) {
    return;
  }

  const direction = Number(button.dataset.carouselDirection);
  const currentIndex = carouselPositions[post.id] || 0;
  carouselPositions[post.id] = (currentIndex + direction + images.length) % images.length;
  updateCarousel(card, post);
});

setActiveFilter(filterButtons[0]);
renderAdventures();
