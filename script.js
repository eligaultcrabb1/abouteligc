const content = window.siteContent;
const app = document.getElementById("app");
let aboutImageIndex = 0;

const icons = {
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.4h4v11.1H3V9.4Zm6.2 0h3.8v1.5c.55-.9 1.72-1.78 3.55-1.78 3 0 4.45 1.9 4.45 5.35v6.03h-4v-5.6c0-1.65-.58-2.55-1.85-2.55-1.38 0-1.95.98-1.95 2.55v5.6h-4V9.4Z" /></svg>',
  email:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.05V17h16V8.05l-8 5.1-8-5.1Zm1.1-1.05 6.9 4.4 6.9-4.4H5.1Z" /></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.55 21.82c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1 2.62.72 3.24 1.95.09-.72.4-1.21.72-1.49-2.5-.28-5.14-1.25-5.14-5.58 0-1.24.44-2.25 1.16-3.04-.12-.28-.5-1.43.11-2.99 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 2.99.72.79 1.16 1.8 1.16 3.04 0 4.34-2.65 5.29-5.17 5.57.41.36.78 1.05.78 2.12v3.14c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" /></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 2.4h9.2a5 5 0 0 1 5 5v9.2a5 5 0 0 1-5 5H7.4a5 5 0 0 1-5-5V7.4a5 5 0 0 1 5-5Zm0 2.2a2.8 2.8 0 0 0-2.8 2.8v9.2a2.8 2.8 0 0 0 2.8 2.8h9.2a2.8 2.8 0 0 0 2.8-2.8V7.4a2.8 2.8 0 0 0-2.8-2.8H7.4Zm4.6 3.1a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6Zm0 2.2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Zm5.05-2.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" /></svg>',
};

function HomeShell(children) {
  return `<main class="site-shell" aria-label="Personal website home">${children}</main>`;
}

function PolaroidNav(items) {
  const cards = items
    .map((item) => {
      const modalAttrs =
        item.action === "modal" ? `data-modal-target="${item.modalId}"` : "";
      const href = item.action === "route" ? item.href : `#${item.id}`;

      return `
        <a class="tab-card" href="${href}" ${modalAttrs} data-preview="${item.preview}">
          <span class="tab-photo">
            <img src="${item.icon}" alt="" />
          </span>
          <span class="tab-title">${item.label}</span>
        </a>
      `;
    })
    .join("");

  return `
    <aside class="nav-panel" aria-label="Site sections">
      <p class="camera-label">${content.banner}</p>
      <nav class="tab-list">${cards}</nav>
    </aside>
  `;
}

function JournalModal({
  id,
  title,
  leftHTML = "",
  rightHTML = "",
  modalClass = "",
  bookClass = "",
  leftPageClass = "",
  rightPageClass = "",
  titleClass = "",
}) {
  return `
    <section class="book-modal journal-modal ${modalClass}" id="${id}" aria-hidden="true" aria-labelledby="${id}-title">
      <button class="book-backdrop" type="button" data-modal-close></button>
      <article class="open-book ${bookClass}" role="dialog" aria-modal="true">
        <button class="modal-close" type="button" aria-label="Close ${title}" data-modal-close>
          <span></span>
          <span></span>
        </button>
        <div class="book-page book-page-left ${leftPageClass}">
          <h1 class="${titleClass}" id="${id}-title">${title}</h1>
          ${leftHTML}
        </div>
        <div class="book-spine" aria-hidden="true"></div>
        <div class="book-page book-page-right ${rightPageClass}">
          ${rightHTML}
        </div>
      </article>
    </section>
  `;
}

function getAboutImages() {
  if (Array.isArray(content.about.images) && content.about.images.length) {
    return content.about.images;
  }

  if (content.about.image) {
    return [
      {
        src: content.about.image,
        caption: content.about.imageCaption || "",
      },
    ];
  }

  return [];
}

function renderAboutPhotoCarousel() {
  const images = getAboutImages();
  const currentIndex = images.length ? aboutImageIndex % images.length : 0;
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  if (!currentImage) {
    return "";
  }

  return `
    <figure class="about-photo-card">
      <div class="about-photo-carousel" data-about-carousel>
        <img
          class="about-photo"
          src="${currentImage.src}"
          alt="About photo for Eli Gault-Crabb"
          data-about-photo
        />
        ${
          hasMultipleImages
            ? `
              <button
                class="about-carousel-button about-carousel-prev"
                type="button"
                aria-label="Previous about photo"
                data-about-carousel-direction="-1"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                class="about-carousel-button about-carousel-next"
                type="button"
                aria-label="Next about photo"
                data-about-carousel-direction="1"
              >
                <span aria-hidden="true">›</span>
              </button>
              <div class="about-carousel-dots" aria-hidden="true">
                ${images
                  .map(
                    (_, index) => `
                      <span class="about-carousel-dot ${index === currentIndex ? "is-active" : ""}"></span>
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
      <figcaption class="about-photo-caption" data-about-photo-caption>${currentImage.caption || ""}</figcaption>
    </figure>
  `;
}

function updateAboutPhotoCarousel(direction) {
  const images = getAboutImages();

  if (images.length < 2) {
    return;
  }

  aboutImageIndex = (aboutImageIndex + direction + images.length) % images.length;

  const currentImage = images[aboutImageIndex];
  const photo = document.querySelector("[data-about-photo]");
  const caption = document.querySelector("[data-about-photo-caption]");
  const dots = document.querySelectorAll(".about-carousel-dot");

  if (photo) {
    photo.src = currentImage.src;
  }

  if (caption) {
    caption.textContent = currentImage.caption || "";
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === aboutImageIndex);
  });
}

function AboutModal() {
  const aboutParagraphs = content.about.body
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  const currentlyItems = content.about.currently
    .map((item) => `<li>${item}</li>`)
    .join("");

  return JournalModal({
    id: "about-modal",
    title: content.about.title,
    modalClass: "about-modal",
    bookClass: "about-book",
    leftPageClass: "about-left-page",
    rightPageClass: "about-right-page",
    titleClass: "about-title",
    leftHTML: renderAboutPhotoCarousel(),
    rightHTML: `
      <section class="about-intro">
        <h2>${content.about.heading}</h2>
        ${aboutParagraphs}
        <section class="currently-card">
          <h3>${content.about.currentlyTitle}</h3>
          <ul class="currently-list">${currentlyItems}</ul>
        </section>
      </section>
    `,
  });
}

function DailyNote(note) {
  return `
    <aside class="daily-note" aria-label="Daily note">
      <button class="daily-note-close" type="button" aria-label="Hide daily note">
        <span></span>
        <span></span>
      </button>
      <p>${note.title}</p>
      <span>${note.text}</span>
    </aside>
  `;
}

function SocialLinks(links) {
  return `
    <nav class="social-links" aria-label="Social and contact links">
      ${links
        .map(
          (link) => `
            <a class="social-link" href="${link.href}" aria-label="${link.label}">
              ${icons[link.icon]}
            </a>
          `
        )
        .join("")}
    </nav>
  `;
}

function FooterVersion() {
  return `<p class="version-tag">${content.versionText}</p>`;
}

function LocalTimeCounter() {
  return `
    <time class="local-time-counter" datetime="" aria-label="Local 24-hour time">
      <span>local</span>
      <strong data-local-time>--:--:--</strong>
    </time>
  `;
}

function renderHome() {
  app.innerHTML = HomeShell(`
    ${PolaroidNav(content.navItems)}
    ${DailyNote(content.dailyNote)}
    ${SocialLinks(content.socialLinks)}
    ${AboutModal()}
    ${LocalTimeCounter()}
    ${FooterVersion()}
  `);
}

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) {
    return;
  }

  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.querySelectorAll(".book-modal").forEach((modal) => {
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
}

function bindInteractions() {
  document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(trigger.dataset.modalTarget);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((closer) => {
    closer.addEventListener("click", closeModal);
  });

  document.querySelector(".daily-note-close")?.addEventListener("click", () => {
    document.querySelector(".daily-note")?.setAttribute("hidden", "");
  });

  document.querySelectorAll("[data-about-carousel-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      updateAboutPhotoCarousel(Number(button.dataset.aboutCarouselDirection));
    });
  });
}

function updateLocalTimeCounter() {
  const time = document.querySelector("[data-local-time]");
  const counter = document.querySelector(".local-time-counter");

  if (!time || !counter) {
    return;
  }

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const militaryTime = `${hours}:${minutes}:${seconds}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  time.textContent = militaryTime;
  counter.dateTime = now.toISOString();
  counter.title = `${militaryTime} ${timezone}`;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

renderHome();
bindInteractions();
updateLocalTimeCounter();
setInterval(updateLocalTimeCounter, 1000);
