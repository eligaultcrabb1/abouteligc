const draftKey = "eligc-blog-admin-draft";
const posts = window.blogPosts || [];

const fields = {
  id: document.getElementById("post-id"),
  title: document.getElementById("post-title"),
  date: document.getElementById("post-date"),
  readTime: document.getElementById("post-read-time"),
  category: document.getElementById("post-category"),
  tags: document.getElementById("post-tags"),
  excerpt: document.getElementById("post-excerpt"),
  coverImage: document.getElementById("post-cover-image"),
  content: document.getElementById("post-content"),
};

const status = document.getElementById("admin-status");
const output = document.getElementById("post-output");
const existingPosts = document.getElementById("existing-posts");
const cardPreview = document.getElementById("card-preview");
const fullPreview = document.getElementById("full-preview");
const copyButton = document.getElementById("copy-post");
const downloadButton = document.getElementById("download-posts");
const clearButton = document.getElementById("clear-draft");

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getParagraphs(value) {
  return String(value || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getDraftPost() {
  return {
    id: fields.id.value.trim(),
    title: fields.title.value.trim(),
    date: fields.date.value.trim(),
    readTime: fields.readTime.value.trim(),
    category: fields.category.value.trim(),
    tags: getTags(fields.tags.value),
    excerpt: fields.excerpt.value.trim(),
    coverImage: fields.coverImage.value.trim(),
    content: getParagraphs(fields.content.value),
  };
}

function postToSource(post) {
  return `{
  id: ${JSON.stringify(post.id)},
  title: ${JSON.stringify(post.title)},
  date: ${JSON.stringify(post.date)},
  readTime: ${JSON.stringify(post.readTime)},
  category: ${JSON.stringify(post.category)},
  tags: ${JSON.stringify(post.tags)},
  excerpt: ${JSON.stringify(post.excerpt)},
  coverImage: ${JSON.stringify(post.coverImage)},
  content: ${JSON.stringify(post.content, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `  ${line}`))
    .join("\n")},
}`;
}

function buildBlogPostsSource(allPosts) {
  return `// Blog post content lives here.
// To add a new post, copy one full object and paste it under ADD NEW POSTS BELOW.

window.blogPosts = [
${allPosts.map((post) => `  ${postToSource(post).replaceAll("\n", "\n  ")}`).join(",\n\n")}
];
`;
}

function saveDraft() {
  localStorage.setItem(draftKey, JSON.stringify(getDraftPost()));
}

function loadDraft() {
  const saved = localStorage.getItem(draftKey);

  if (!saved) {
    return;
  }

  const draft = JSON.parse(saved);
  fields.id.value = draft.id || "";
  fields.title.value = draft.title || "";
  fields.date.value = draft.date || "";
  fields.readTime.value = draft.readTime || "";
  fields.category.value = draft.category || "";
  fields.tags.value = (draft.tags || []).join(", ");
  fields.excerpt.value = draft.excerpt || "";
  fields.coverImage.value = draft.coverImage || "";
  fields.content.value = (draft.content || []).join("\n\n");
}

function renderExistingPosts() {
  existingPosts.innerHTML = posts.length
    ? posts
        .map(
          (post) => `
            <div class="existing-post">
              <strong>${escapeHTML(post.title)}</strong>
              <span>ID: ${escapeHTML(post.id)}</span>
              <span>Date: ${escapeHTML(post.date)}</span>
              <span>Category: ${escapeHTML(post.category)}</span>
            </div>
          `
        )
        .join("")
    : "<p>No existing posts found.</p>";
}

function renderPreviews() {
  const post = getDraftPost();
  const labels = post.tags.length ? post.tags.join(" / ") : post.category || "Category";
  const title = post.title || "Untitled Post";
  const excerpt = post.excerpt || "Excerpt preview will appear here.";
  const date = post.date || "Date";
  const readTime = post.readTime || "Read time";
  const coverImage = post.coverImage || "assets/blog/why-i-built-this-site.jpg";
  const paragraphs = post.content.length
    ? post.content
    : ["Full post paragraphs will appear here."];

  output.textContent = postToSource(post);

  cardPreview.innerHTML = `
    <a class="admin-preview-card" href="#" aria-label="Blog card preview">
      <img src="${escapeHTML(coverImage)}" alt="" />
      <div>
        <p class="admin-card-meta">${escapeHTML(labels)}</p>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(excerpt)}</p>
      </div>
      <div class="admin-card-side">
        <span>${escapeHTML(date)}</span>
        <span>${escapeHTML(readTime)}</span>
        <span>-&gt;</span>
      </div>
    </a>
  `;

  fullPreview.innerHTML = `
    <div class="admin-full-preview">
      <p class="admin-full-meta">${escapeHTML(labels)}</p>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(date)} / ${escapeHTML(readTime)}</p>
      <img src="${escapeHTML(coverImage)}" alt="" />
      <div class="admin-full-content">
        ${paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      </div>
    </div>
  `;
}

async function copyPostObject() {
  const source = postToSource(getDraftPost());

  try {
    await navigator.clipboard.writeText(source);
    status.textContent = "Post object copied.";
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = source;
    document.body.appendChild(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
    status.textContent = "Post object copied.";
  }
}

function downloadUpdatedPosts() {
  const source = buildBlogPostsSource([...posts, getDraftPost()]);
  const blob = new Blob([source], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "blogPosts.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  status.textContent = "Downloaded updated blogPosts.js.";
}

function clearDraft() {
  Object.values(fields).forEach((field) => {
    field.value = "";
  });
  localStorage.removeItem(draftKey);
  status.textContent = "Draft cleared.";
  renderPreviews();
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    saveDraft();
    renderPreviews();
  });
});

copyButton.addEventListener("click", copyPostObject);
downloadButton.addEventListener("click", downloadUpdatedPosts);
clearButton.addEventListener("click", clearDraft);

loadDraft();
renderExistingPosts();
renderPreviews();
