---
title: "Post title (shows on the card and the browser tab)"
subtitle: "One-line summary shown under the title on the card (optional, delete if not needed)"
description: "1-2 sentence excerpt used for the card and for the link preview when shared on LinkedIn"
date: 2026-01-01
tags: [delivery, quality]
cover: /assets/img/postmortem/SLUG/cover.jpg
references:
  - title: "Name of an external source"
    url: "https://example.com"
---

<!--
HOW TO USE THIS FILE
1. Copy it into _posts/ and rename to: YYYY-MM-DD-your-slug.md (the date prefix is required by Jekyll).
2. Put any images for this post in assets/img/postmortem/SLUG/ and update `cover:` above.
3. Delete `subtitle`, `tags` items or the whole `references` block if a post doesn't need them.
4. Write the body below in plain Markdown. This comment block itself won't render (it's inside a Markdown comment).
   Feel free to delete it once you're used to the format.

To preview an unpublished draft locally before it's live: `bundle exec jekyll serve --drafts`
-->

Write the post body here in Markdown.

## A heading

Regular paragraph text.

- bullet
- points

Add an image:

![Alt text describing the image](/assets/img/postmortem/SLUG/example.png)

Add a Mermaid diagram (just a normal fenced code block, no special syntax):

```mermaid
graph TD
  A[Start] --> B[Ship]
```

Add a YouTube video:

{% include youtube.html id="VIDEO_ID" title="Optional accessible title" %}
