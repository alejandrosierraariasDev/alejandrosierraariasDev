// ---------- PostMortem archive: fetch manifest, render changelog list, filter + paginate ----------
(function () {
  const PAGE_SIZE = 5;

  const listEl = document.getElementById('pmList');
  const emptyEl = document.getElementById('pmEmpty');
  const filterEl = document.getElementById('pmFilterBar');
  const pagerEl = document.getElementById('pmPager');
  if (!listEl || !window.POSTMORTEM_DATA_URL) return;

  let posts = [];
  let activeTag = '';
  let currentPage = 1;

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function formatVersion(dateStr) {
    return 'v' + dateStr.replace(/-/g, '.');
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function uniqueTags(items) {
    const seen = new Map();
    items.forEach((p) => (p.tags || []).forEach((t) => seen.set(t.toLowerCase(), t)));
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }

  function filteredPosts() {
    if (!activeTag) return posts;
    return posts.filter((p) => (p.tags || []).some((t) => t.toLowerCase() === activeTag));
  }

  function renderFilterBar() {
    const tags = uniqueTags(posts);
    const buttons = [{ label: 'All', value: '' }].concat(tags.map((t) => ({ label: t, value: t.toLowerCase() })));
    filterEl.innerHTML = buttons
      .map(
        (b) =>
          `<button type="button" data-tag="${escapeHtml(b.value)}" class="${b.value === activeTag ? 'active' : ''}">${escapeHtml(b.label)}</button>`
      )
      .join('');
    filterEl.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTag = btn.getAttribute('data-tag');
        currentPage = 1;
        render();
      });
    });
  }

  function renderCard(post) {
    const tagsHtml = post.tags && post.tags.length
      ? `<div class="cl-tags">${post.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join('')}</div>`
      : '';
    const subHtml = post.subtitle ? `<p class="sub">${escapeHtml(post.subtitle)}</p>` : '';
    const descHtml = post.description ? `<p class="desc">${escapeHtml(post.description)}</p>` : '';
    const coverHtml = post.cover
      ? `<div class="cl-cover"><img src="${escapeHtml(post.cover)}" alt="" loading="lazy" /></div>`
      : '';
    return `
      <div class="cl-row reveal in-view">
        <div class="cl-rail"><div class="cl-dot"></div></div>
        <a class="cl-card" href="${escapeHtml(post.url)}">
          <div class="cl-main">
            <p class="cl-ver">${escapeHtml(formatVersion(post.date))}</p>
            <h3>${escapeHtml(post.title)}</h3>
            ${subHtml}
            ${descHtml}
            <div class="cl-meta-row">
              <span class="cl-date">${escapeHtml(formatDate(post.date))}</span>
              <span class="dot">·</span>
              <span>${post.reading_time} min read</span>
            </div>
            ${tagsHtml}
          </div>
          ${coverHtml}
        </a>
      </div>
    `;
  }

  function renderPager(totalItems) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    if (totalItems <= PAGE_SIZE) {
      pagerEl.innerHTML = '';
      return;
    }
    const parts = [];
    parts.push(`<button type="button" class="arrow" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹ Prev</button>`);
    for (let i = 1; i <= totalPages; i++) {
      parts.push(`<button type="button" data-page="${i}" class="${i === currentPage ? 'current' : ''}">${i}</button>`);
    }
    parts.push(`<button type="button" class="arrow" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next ›</button>`);
    pagerEl.innerHTML = parts.join('');
    pagerEl.querySelectorAll('button[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-page'), 10);
        if (page < 1 || page > totalPages || page === currentPage) return;
        currentPage = page;
        render();
        listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function render() {
    const filtered = filteredPosts();
    emptyEl.hidden = filtered.length > 0;
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    listEl.innerHTML = pageItems.map(renderCard).join('');
    renderPager(filtered.length);
  }

  fetch(window.POSTMORTEM_DATA_URL)
    .then((res) => res.json())
    .then((data) => {
      posts = Array.isArray(data) ? data : [];
      renderFilterBar();
      render();
    })
    .catch(() => {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      emptyEl.textContent = 'Postmortems could not be loaded right now.';
    });
})();
