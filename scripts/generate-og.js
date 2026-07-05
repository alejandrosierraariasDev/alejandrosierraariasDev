#!/usr/bin/env node
// Generates a consistent 1200x630 social share image (og.png) for a PostMortem
// post, from its own front matter. Keeps every post's share card visually
// identical, no per-post custom artwork needed.
//
// Usage: npm run generate-og -- _posts/2026-07-05-my-post.md

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { chromium } = require('playwright');

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('No front matter found in that file.');
  return yaml.load(match[1]);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderTemplate({ title, subtitle, tags }) {
  const tagsHtml = (tags || []).map((t) => `<span>${escapeHtml(t)}</span>`).join('');
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{
    width:1200px; height:630px; overflow:hidden;
    background:#0b0f14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif;
    position:relative;
  }
  .bg{
    position:absolute; inset:0;
    background:
      radial-gradient(700px 500px at 10% 10%, rgba(79,209,197,0.16), transparent 60%),
      radial-gradient(600px 500px at 95% 90%, rgba(124,158,255,0.14), transparent 60%);
  }
  .grid{
    position:absolute; inset:0; opacity:.5;
    background-image: repeating-linear-gradient(180deg, rgba(127,150,175,.05) 0px, rgba(127,150,175,.05) 1px, transparent 1px, transparent 32px);
  }
  .wrap{ position:relative; height:100%; padding:64px 72px; display:flex; flex-direction:column; justify-content:space-between; }
  .brand{ display:flex; align-items:center; gap:18px; }
  .brand .mark{ font-weight:800; font-size:28px; color:#e9eef4; letter-spacing:.02em; }
  .brand .mark .dot{ color:#4fd1c5; }
  .brand .eyebrow{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:16px; color:#4fd1c5; letter-spacing:.06em; }
  .main{ max-width:1000px; }
  .main h1{ font-size:56px; line-height:1.14; font-weight:800; color:#e9eef4; letter-spacing:-0.01em; margin-bottom:22px; }
  .main p{ font-size:26px; line-height:1.4; color:#9fb0c3; max-width:900px; }
  .foot{ display:flex; align-items:center; justify-content:space-between; }
  .tags{ display:flex; gap:10px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:18px; color:#6b7c90; }
  .tags span::before{ content:"#"; color:#6b7c90; }
  .domain{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:18px; color:#9fb0c3; }
</style></head>
<body>
  <div class="bg"></div>
  <div class="grid"></div>
  <div class="wrap">
    <div class="brand">
      <div class="mark">AS<span class="dot">.</span></div>
      <div class="eyebrow">postmortem --log</div>
    </div>
    <div class="main">
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
    </div>
    <div class="foot">
      <div class="tags">${tagsHtml}</div>
      <div class="domain">alejandrosierra.dev</div>
    </div>
  </div>
</body></html>`;
}

async function main() {
  const postPath = process.argv[2];
  if (!postPath) {
    console.error('Usage: npm run generate-og -- _posts/YYYY-MM-DD-slug.md');
    process.exit(1);
  }
  const resolvedPath = path.resolve(postPath);
  const content = fs.readFileSync(resolvedPath, 'utf8');
  const fm = parseFrontMatter(content);

  const filename = path.basename(resolvedPath, '.md');
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const outDir = path.join(__dirname, '..', 'assets', 'img', 'postmortem', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'og.png');
  const repoRelativeImage = `/assets/img/postmortem/${slug}/og.png`;

  const html = renderTemplate({ title: fm.title, subtitle: fm.subtitle, tags: fm.tags });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.screenshot({ path: outPath });
  await browser.close();

  console.log(`OG image written to ${path.relative(process.cwd(), outPath)}`);
  if (!fm.image) {
    console.log(`\nAdd this line to the post's front matter:\n  image: ${repoRelativeImage}`);
  } else if (fm.image !== repoRelativeImage) {
    console.log(`\nNote: front matter 'image:' is currently '${fm.image}', expected '${repoRelativeImage}'.`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
