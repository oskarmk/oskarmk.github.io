---
# Copy this file to _posts/YYYY-MM-DD-short-slug.md to publish it.
# Files in _drafts/ never appear on the live site.
title: "The headline goes here"
subtitle: "One sentence that tells the reader why this is worth their time."
date: 2026-10-23 09:00:00 +0200
# Optional ----------------------------------------------------------
# image: /images/posts/slug/hero.png        # big image under the title
# image_alt: "What the image shows"
# image_caption: "Source: ATP, 2012–2019"
# series: "Data stories"                     # small label next to the date
# notebook: https://github.com/oskarmk/...   # link shown at the end
# code: https://github.com/oskarmk/...
# selected: true                              # (not used yet, handy for a featured list)
---

The first paragraph is set slightly larger. Open with the question or the surprising number, not with the method.

Everything else is plain Markdown. *Italics*, **bold**, [links](https://example.com) and `inline code` all work. A footnote looks like this.[^1]

## A section heading

Use `##` for sections and `###` for sub-sections. Keep paragraphs short; the column is narrow on purpose.

### Figures

{% include figure.html src="/images/violins.png" alt="Goals per season" caption="Goals per season, 2004–2021. Source: *Transfermarkt*." %}

Wide figures break out of the text column on big screens:

{% include figure.html src="/images/takeons.png" caption="Take-ons per 90 minutes across the five big leagues." size="wide" %}

Interactive charts (an exported Plotly `.html`, Datawrapper, Flourish) go in an iframe:

<!-- {% include embed.html src="/charts/slug/chart.html" height="460" caption="Hover for details." size="wide" %} -->

### Quotes, pull quotes and notes

> A normal blockquote, for quoting someone else.

> The single sentence you'd want someone to screenshot.
{: .pull}

> **Method.** An aside set off from the main text: data sources, caveats, how the numbers were computed.
{: .note}

### Lists and tables

1. Numbered lists
2. work as expected

| Player  | Points won under pressure | Total points |
|---------|--------------------------:|-------------:|
| Player A | 54.2% | 41,120 |
| Player B | 53.8% | 38,904 |
{: .table}

### Code

```python
import pandas as pd
df = pd.read_csv("points.csv")
df.groupby("player")["won"].mean().sort_values()
```

---

A horizontal rule (`---`) becomes a quiet section break.

[^1]: Footnotes collect at the bottom of the article automatically, with a link back.
