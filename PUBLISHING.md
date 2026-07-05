# Publishing a new PostMortem post

One-time setup (only needed once per machine):

```bash
npm install
npx playwright install chromium
```

## Every new post

1. **Write it.** Copy `_drafts/TEMPLATE.md` into `_posts/`, rename it to
   `YYYY-MM-DD-your-slug.md`, fill in the front matter and write the body.
   See `_drafts/TEMPLATE.md` itself for how to add images, Mermaid diagrams,
   videos and references.

2. **Generate the share image.** Every post needs a cover image for the
   LinkedIn/Twitter link preview. Run:

   ```bash
   npm run generate-og -- _posts/YYYY-MM-DD-your-slug.md
   ```

   This reads the post's own `title`/`subtitle`/`tags` and writes a
   1200x630 PNG to `assets/img/postmortem/your-slug/og.png`, in the same
   style every time. The command prints the exact `image:` line to add to
   the post's front matter if it isn't there yet.

3. **Preview locally.**

   ```bash
   bundle exec jekyll serve
   ```

   Open `http://127.0.0.1:4000/` to check the homepage teaser, and
   `http://127.0.0.1:4000/postmortem/your-slug/` for the full post.

4. **Commit and push.**

   ```bash
   git add _posts/YYYY-MM-DD-your-slug.md assets/img/postmortem/your-slug
   git commit -m "Add post: your title"
   git push origin master
   ```

   GitHub Pages rebuilds automatically after the push, usually within a
   minute or two.

5. **Share it.** Copy the live post URL
   (`https://alejandrosierra.dev/postmortem/your-slug/`) into LinkedIn. If
   you shared the URL before the site finished rebuilding, LinkedIn may
   have cached a blank preview, in that case, paste the URL into
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   once to force it to re-fetch.
