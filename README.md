# oskarmk.github.io

Personal site of Oskar Martin. Built with Jekyll, deployed by GitHub Pages (and Vercel).

## Publishing an article

1. Copy `_drafts/template.md` to `_posts/YYYY-MM-DD-short-slug.md`
   (for example `_posts/2026-11-02-why-ironman-entries-sell-out.md`).
2. Fill in the front matter at the top: `title`, `subtitle`, `date`.
3. Write in Markdown. The template shows every building block:
   - figures: `{% include figure.html src="/images/posts/slug/chart.png" caption="…" size="wide" %}`
   - interactive charts: `{% include embed.html src="/charts/slug/chart.html" height="460" %}`
   - pull quote: a blockquote followed by `{: .pull}` on the next line
   - method / caveat box: a blockquote followed by `{: .note}`
   - footnotes: `text[^1]` and `[^1]: the note` at the bottom
4. Put images in `images/posts/<slug>/` and exported chart HTML in `charts/<slug>/`.
5. Commit and push. The post appears at `/writing/<slug>/`, at the top of the homepage list,
   on `/writing/`, and in the RSS feed (`/feed.xml`).

Work in progress can stay in `_drafts/` — those files are never published.

Older articles published on Substack are listed in `_data/writing.yml`; add `selected: true`
or edit the subtitles there.

## Local preview

```sh
bundle install
bundle exec jekyll serve --drafts
```

Then open http://localhost:4000. `--drafts` also shows files in `_drafts/`.

## Other bits

- `_includes/fish.html` + `assets/js/fish.js` — the koi in the corner
- `assets/css/style.scss` — all styling; colours are CSS variables at the top
  (`html[data-theme="dark"]` for dark mode)
