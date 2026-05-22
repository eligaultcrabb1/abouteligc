const adventuresGrid = document.getElementById("adventures-grid");
const filterButtons = document.querySelectorAll("[data-adventure-filter]");
const adventurePosts = window.adventurePosts || [];
const carouselPositions = {};
const expandedBlurbs = {};
let lightboxElement = null;
let lightboxPost = null;

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

function getAdventureTime(post) {
  const parsedDate = Date.parse(post.year);

  if (!Number.isNaN(parsedDate)) {
    return parsedDate;
  }

  const parsedYear = Number.parseInt(post.year, 10);

  return Number.isNaN(parsedYear) ? 0 : Date.parse(`December 31 ${parsedYear}`);
}

function getAdventureImages(post) {
  if (Array.isArray(post.images) && post.images.length) {
    return post.images;
  }

  if (Array.isArray(post.image) && post.image.length) {
    return post.image;
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
              class="adventure-carousel-expand"
              type="button"
              aria-label="Expand current photo"
              data-carousel-expand
            >
              <span aria-hidden="true">↗</span>
            </button>
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

function getCurrentAdventureImage(post) {
  const images = getAdventureImages(post);
  const currentIndex = images.length ? (carouselPositions[post.id] || 0) % images.length : 0;

  return {
    currentIndex,
    image: images[currentIndex] || "",
    total: images.length,
  };
}

function closeLightbox() {
  if (!lightboxElement) {
    return;
  }

  const closingElement = lightboxElement;
  closingElement.setAttribute("aria-hidden", "true");
  document.body.classList.remove("adventure-lightbox-open");
  lightboxElement = null;
  lightboxPost = null;

  window.setTimeout(() => {
    closingElement.remove();
  }, 180);
}

function updateLightbox(post) {
  if (!lightboxElement || !post) {
    return;
  }

  const { currentIndex, image, total } = getCurrentAdventureImage(post);
  const imageElement = lightboxElement.querySelector(".adventure-lightbox-image");
  const caption = lightboxElement.querySelector(".adventure-lightbox-caption");
  const dots = lightboxElement.querySelectorAll(".adventure-lightbox-dot");

  if (imageElement) {
    imageElement.src = image;
  }

  if (caption) {
    caption.textContent = `${post.title}${total > 1 ? ` / ${currentIndex + 1} of ${total}` : ""}`;
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });
}

function moveLightbox(direction) {
  if (!lightboxPost) {
    return;
  }

  const images = getAdventureImages(lightboxPost);

  if (images.length < 2) {
    return;
  }

  const currentIndex = carouselPositions[lightboxPost.id] || 0;
  carouselPositions[lightboxPost.id] = (currentIndex + direction + images.length) % images.length;
  updateLightbox(lightboxPost);

  const card = document.getElementById(lightboxPost.id);
  if (card) {
    updateCarousel(card, lightboxPost);
  }
}

function openLightbox(post) {
  const images = getAdventureImages(post);
  const { currentIndex, image, total } = getCurrentAdventureImage(post);
  const hasMultipleImages = images.length > 1;

  if (!image) {
    return;
  }

  closeLightbox();

  lightboxElement = document.createElement("div");
  lightboxElement.className = "adventure-lightbox";
  lightboxElement.setAttribute("aria-hidden", "false");
  lightboxElement.setAttribute("role", "dialog");
  lightboxElement.setAttribute("aria-label", `${post.title} photo preview`);
  lightboxPost = post;
  lightboxElement.innerHTML = `
    <div class="adventure-lightbox-panel" role="document">
      <button class="adventure-lightbox-close" type="button" aria-label="Close expanded photo">
        <span></span>
        <span></span>
      </button>
      <img class="adventure-lightbox-image" src="${image}" alt="${post.title}" />
      ${
        hasMultipleImages
          ? `
            <button
              class="adventure-lightbox-arrow adventure-lightbox-prev"
              type="button"
              aria-label="Previous expanded photo"
              data-lightbox-direction="-1"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              class="adventure-lightbox-arrow adventure-lightbox-next"
              type="button"
              aria-label="Next expanded photo"
              data-lightbox-direction="1"
            >
              <span aria-hidden="true">›</span>
            </button>
            <div class="adventure-lightbox-dots" aria-hidden="true">
              ${images
                .map(
                  (_, index) => `
                    <span class="adventure-lightbox-dot ${index === currentIndex ? "is-active" : ""}"></span>
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }
      <p class="adventure-lightbox-caption">
        ${post.title}${total > 1 ? ` / ${currentIndex + 1} of ${total}` : ""}
      </p>
    </div>
  `;

  document.body.appendChild(lightboxElement);
  document.body.classList.add("adventure-lightbox-open");
  lightboxElement.querySelector(".adventure-lightbox-close")?.focus();
}

function updateReadMoreButtons() {
  adventuresGrid?.querySelectorAll(".adventure-card").forEach((card) => {
    const blurb = card.querySelector(".adventure-blurb");
    const button = card.querySelector("[data-blurb-toggle]");

    if (!blurb || !button) {
      return;
    }

    const isExpanded = blurb.classList.contains("is-expanded");
    const needsToggle = isExpanded || blurb.scrollHeight > blurb.clientHeight + 1;
    button.hidden = !needsToggle;
  });
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
    ? [...filteredPosts]
        .sort((firstPost, secondPost) => getAdventureTime(secondPost) - getAdventureTime(firstPost))
        .map((post) => {
          const isExpanded = Boolean(expandedBlurbs[post.id]);

          return `
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
                <p class="adventure-blurb ${isExpanded ? "is-expanded" : ""}">${post.blurb}</p>
                <button
                  class="adventure-read-more"
                  type="button"
                  data-blurb-toggle="${post.id}"
                  aria-expanded="${isExpanded}"
                  hidden
                >
                  ${isExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="adventure-empty">Nothing here yet.</p>';

  requestAnimationFrame(updateReadMoreButtons);
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
  const readMoreButton = event.target.closest("[data-blurb-toggle]");
  if (readMoreButton) {
    const postId = readMoreButton.dataset.blurbToggle;
    const card = readMoreButton.closest(".adventure-card");
    const blurb = card?.querySelector(".adventure-blurb");
    const isExpanded = !blurb?.classList.contains("is-expanded");

    if (!blurb) {
      return;
    }

    expandedBlurbs[postId] = isExpanded;
    blurb.classList.toggle("is-expanded", isExpanded);
    readMoreButton.textContent = isExpanded ? "Show less" : "Read more";
    readMoreButton.setAttribute("aria-expanded", String(isExpanded));
    updateReadMoreButtons();
    return;
  }

  const expandButton = event.target.closest("[data-carousel-expand]");
  if (expandButton) {
    const carousel = expandButton.closest("[data-adventure-id]");
    const postId = carousel?.dataset.adventureId;
    const post = adventurePosts.find((item) => item.id === postId);

    if (post) {
      openLightbox(post);
    }

    return;
  }

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

document.addEventListener("click", (event) => {
  if (!lightboxElement) {
    return;
  }

  const clickedBackdrop = event.target === lightboxElement;
  const clickedClose = event.target.closest(".adventure-lightbox-close");
  const arrowButton = event.target.closest("[data-lightbox-direction]");

  if (arrowButton) {
    moveLightbox(Number(arrowButton.dataset.lightboxDirection));
    return;
  }

  if (clickedBackdrop || clickedClose) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (!lightboxElement) {
    return;
  }

  if (event.key === "ArrowLeft") {
    moveLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    moveLightbox(1);
  }
});

setActiveFilter(filterButtons[0]);
renderAdventures();
