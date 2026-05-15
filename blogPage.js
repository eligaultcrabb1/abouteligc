const blogList = document.getElementById("blog-list");
const posts = window.blogPosts || [];

function renderBlogPosts() {
  if (!blogList) {
    return;
  }

  if (!posts.length) {
    blogList.innerHTML = '<p class="blog-empty">No posts yet. Check back soon.</p>';
    return;
  }

  blogList.innerHTML = posts
    .map(
      (post) => `
        <a class="blog-card" id="${post.id}" href="blog-post.html?id=${post.id}">
          <img class="blog-card-image" src="${post.coverImage}" alt="" />
          <div class="blog-card-main">
            <p class="blog-card-meta">${post.category}</p>
            <h2 class="blog-card-title">${post.title}</h2>
            <p class="blog-card-excerpt">${post.excerpt}</p>
          </div>
          <div class="blog-card-link">
            <span>${post.date}</span>
            <span>${post.readTime}</span>
            <span class="blog-card-arrow" aria-hidden="true">-&gt;</span>
          </div>
        </a>
      `
    )
    .join("");
}

renderBlogPosts();
