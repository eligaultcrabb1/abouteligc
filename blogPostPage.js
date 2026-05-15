const postContainer = document.getElementById("blog-post");
const postId = new URLSearchParams(window.location.search).get("id");
const post = (window.blogPosts || []).find((entry) => entry.id === postId);

function getPostLabels(postData) {
  if (postData.tags && postData.tags.length) {
    return postData.tags.join(" / ");
  }

  return postData.category || "Blog";
}

function renderBlogPost() {
  if (!postContainer) {
    return;
  }

  if (!post) {
    postContainer.innerHTML = `
      <a class="blog-inline-return" href="blog.html">Back to Blog</a>
      <h1>Post not found.</h1>
    `;
    return;
  }

  document.title = `${post.title} | Eli Gault-Crabb`;
  const coverImage = post.coverImage
    ? `<img class="blog-post-cover" src="${post.coverImage}" alt="" />`
    : "";

  postContainer.innerHTML = `
    <a class="blog-inline-return" href="blog.html">Back to Blog</a>
    <p class="blog-post-meta">${getPostLabels(post)}</p>
    <h1 class="blog-post-title">${post.title}</h1>
    <p class="blog-post-detail">${post.date} / ${post.readTime}</p>
    ${coverImage}
    <div class="blog-post-content">
      ${post.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

renderBlogPost();
