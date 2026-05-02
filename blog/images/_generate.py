"""Generate images for the Context-Is-A-Budget blog post."""
from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import matplotlib.patches as mpatches
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).parent
OUT.mkdir(parents=True, exist_ok=True)

# Common palette
NAVY = "#0d1b2a"
INK  = "#1b263b"
PAPER = "#f5f3ee"
ACCENT = "#e63946"
GREEN = "#2a9d8f"
GOLD = "#e9c46a"
GREY = "#6c757d"

def load_font(name_candidates, size):
    for n in name_candidates:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()

MONO = ["consola.ttf", "Consolas.ttf", "CascadiaMono.ttf", "DejaVuSansMono.ttf"]
SANS = ["seguisb.ttf", "segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
SANS_B = ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]

# ---------------------------------------------------------------- 01 chart
def img1():
    buckets = ["System prompt /\ninstructions", "Tool / function\nschemas",
               "Retrieved files\n& code chunks", "Conversation\nhistory", "Model output"]
    typ = [10, 25, 40, 17, 8]
    colors = [GOLD, ACCENT, NAVY, GREEN, GREY]
    fig, ax = plt.subplots(figsize=(10, 5.2), dpi=150)
    bars = ax.barh(buckets, typ, color=colors, edgecolor="white", linewidth=2)
    for b, v in zip(bars, typ):
        ax.text(v + 1, b.get_y() + b.get_height()/2, f"~{v}%",
                va="center", fontsize=11, color=INK)
    ax.set_xlim(0, 55)
    ax.set_xlabel("Typical share of an AI-coding-assistant request", fontsize=11, color=INK)
    ax.set_title("Where the tokens actually go", fontsize=15, color=INK, pad=14, weight="bold")
    ax.invert_yaxis()
    ax.tick_params(colors=INK, labelsize=10)
    for s in ["top", "right"]:
        ax.spines[s].set_visible(False)
    ax.spines["left"].set_color(GREY); ax.spines["bottom"].set_color(GREY)
    ax.set_facecolor(PAPER); fig.patch.set_facecolor(PAPER)
    fig.tight_layout()
    fig.savefig(OUT / "01-token-distribution.png", facecolor=PAPER)
    plt.close(fig)

# ---------------------------------------------------------------- 02 ccreq panel
def img2():
    W, H = 1100, 380
    img = Image.new("RGB", (W, H), "#1e1e1e")
    d = ImageDraw.Draw(img)
    title = load_font(SANS_B, 14); body = load_font(MONO, 13); small = load_font(SANS, 12)

    # Title bar
    d.rectangle([0, 0, W, 32], fill="#2d2d2d")
    d.text((14, 8), "OUTPUT  •  GitHub Copilot Chat", fill="#cccccc", font=title)
    d.text((W-160, 8), "▾  filter…  ⟳  🗑", fill="#888", font=small)

    # Log lines
    lines = [
        ("[12:34:01.221] [info]", "ccreq", "model=gpt-4.1            type=chat       latency=842ms    tokens_in=2147     tokens_out=183     status=success"),
        ("[12:34:14.882] [info]", "ccreq", "model=gpt-4.1            type=chat       latency=1.2s      tokens_in=2410     tokens_out=204     status=success"),
        ("[12:35:02.117] [info]", "ccreq", "model=claude-sonnet-4    type=agent      latency=4.7s      tokens_in=18,402   tokens_out=612     status=success"),
        ("[12:35:48.490] [info]", "ccreq", "model=claude-sonnet-4    type=agent      latency=11.3s     tokens_in=42,118   tokens_out=918     status=success"),
        ("[12:36:51.012] [info]", "ccreq", "model=claude-sonnet-4    type=agent      latency=22.6s     tokens_in=98,447   tokens_out=1,402   status=success"),
        ("[12:37:30.500] [warn]", "ccreq", "model=claude-sonnet-4    type=agent      latency=29.1s     context near limit — consider /compact"),
    ]
    y = 50
    for t, tag, msg in lines:
        d.text((14, y), t, fill="#7a7a7a", font=body)
        d.text((175, y), tag, fill="#4ec9b0", font=body)
        d.text((220, y), msg, fill="#d4d4d4", font=body)
        y += 24

    # Annotation arrow
    d.line([(820, 144), (760, 174)], fill=GOLD, width=2)
    d.text((820, 130), "latency climbing →", fill=GOLD, font=load_font(SANS_B, 13))
    d.text((820, 148), "your token meter", fill=GOLD, font=load_font(SANS_B, 13))

    img.save(OUT / "02-ccreq-output.png")

# ---------------------------------------------------------------- 03 network tab
def img3():
    W, H = 1100, 420
    img = Image.new("RGB", (W, H), "#252526")
    d = ImageDraw.Draw(img)
    title = load_font(SANS_B, 14); body = load_font(MONO, 12); small = load_font(SANS, 12); bold = load_font(SANS_B, 12)

    d.rectangle([0, 0, W, 32], fill="#3c3c3c")
    d.text((14, 8), "DevTools  •  Network", fill="#e7e7e7", font=title)
    d.text((W-260, 8), "Filter: completions", fill="#cccccc", font=small)

    # Column headers
    d.rectangle([0, 32, W, 60], fill="#2d2d2d")
    cols = [("Name", 14), ("Status", 480), ("Type", 580), ("Size", 700), ("Time", 820), ("Model", 920)]
    for h, x in cols:
        d.text((x, 40), h, fill="#9cdcfe", font=bold)
    d.line([(0, 60), (W, 60)], fill="#3c3c3c", width=1)

    rows = [
        ("v1/chat/completions",  "200", "fetch", "  3.1 KB", "  742 ms", "gpt-4.1"),
        ("v1/chat/completions",  "200", "fetch", "  4.4 KB", "  1.1 s ", "gpt-4.1"),
        ("v1/chat/completions",  "200", "fetch", " 28.7 KB", "  6.8 s ", "claude-sonnet-4"),
        ("v1/chat/completions",  "200", "fetch", " 71.2 KB", " 14.2 s ", "claude-sonnet-4"),
        ("v1/chat/completions",  "200", "fetch", "182.4 KB", " 26.9 s ", "claude-sonnet-4"),
    ]
    y = 70
    for r in rows:
        for (h, x), v in zip(cols, r):
            d.text((x, y), v, fill="#d4d4d4", font=body)
        y += 26

    # Annotation
    d.text((220, 260), "Same chat. Same project. Five turns.", fill=GOLD, font=bold)
    d.text((220, 280), "Payload grew 60× — and so did latency.", fill=GOLD, font=bold)
    d.line([(700, 200), (700, 250), (220, 250), (220, 270)], fill=GOLD, width=2)

    img.save(OUT / "03-network-tab.png")

# ---------------------------------------------------------------- 04 code card
def img4():
    code = [
        "# Copilot instructions",
        "",
        "## Conventions",
        "- Plain JavaScript, ES modules. No TypeScript.",
        "- Tests live next to source as *.test.js (node --test).",
        "- Use named exports.",
        "",
        "## Output style",
        "- Be concise. No preamble.",
        "- Prefer diffs over full files.",
    ]
    W, H = 900, 460
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    # Window chrome
    d.rounded_rectangle([20, 20, W-20, H-20], radius=14, fill="#1e1e2e", outline="#0e0e1a", width=2)
    # Traffic lights
    for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]):
        d.ellipse([42 + i*22, 40, 56 + i*22, 54], fill=c)
    d.text((130, 38), ".github/copilot-instructions.md", fill="#a6adc8", font=load_font(SANS_B, 13))

    body = load_font(MONO, 16)
    y = 80
    for line in code:
        color = "#cdd6f4"
        if line.startswith("#"):
            color = "#f38ba8"
        elif line.startswith("-"):
            color = "#a6e3a1"
        d.text((54, y), line, fill=color, font=body)
        y += 30

    # Caption
    d.text((40, H-32), "6 lines. Inherited by every chat in the repo.", fill=INK, font=load_font(SANS_B, 13))
    img.save(OUT / "04-instructions-snippet.png")

# ---------------------------------------------------------------- 05 lint output
def img5():
    W, H = 1000, 380
    img = Image.new("RGB", (W, H), "#0c0c0c")
    d = ImageDraw.Draw(img)
    body = load_font(MONO, 14); bold = load_font(MONO, 14)

    lines = [
        ("PS> npm run lint:context", "#cccccc"),
        ("", None),
        ("> ai-token-management-demo@1.0.0 lint:instr-size", "#888888"),
        ("> node tools/lint-instructions.js", "#888888"),
        ("✅  tests.instructions.md: 28 lines (limit 150)", "#a6e3a1"),
        ("", None),
        ("> ai-token-management-demo@1.0.0 lint:prompt-size", "#888888"),
        ("> node tools/lint-prompts.js", "#888888"),
        ("✅  build.prompt.md: 24 lines (limit 250)", "#a6e3a1"),
        ("✅  plan.prompt.md:  46 lines (limit 250)", "#a6e3a1"),
        ("✅  ralph.prompt.md: 26 lines (limit 250)", "#a6e3a1"),
        ("✅  review.prompt.md:23 lines (limit 250)", "#a6e3a1"),
        ("", None),
        ("PS> npm run lint:instr-size  # after bloat", "#cccccc"),
        ("❌  tests.instructions.md: 228 lines (limit 150)", "#f38ba8"),
        ("Instruction files over the limit increase ambient token cost every turn.", "#f38ba8"),
    ]
    y = 24
    for text, color in lines:
        if text:
            d.text((20, y), text, fill=color or "#cccccc", font=body)
        y += 20
    img.save(OUT / "05-lint-output.png")

# ---------------------------------------------------------------- 06 handover diagram
def img6():
    W, H = 1200, 460
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    title_f = load_font(SANS_B, 18)
    name_f  = load_font(SANS_B, 16)
    sub_f   = load_font(SANS, 12)
    art_f   = load_font(MONO, 13)

    d.text((W//2 - 230, 24), "Planner  →  Implementer  →  Reviewer", fill=INK, font=title_f)
    d.text((W//2 - 250, 54), "the handover artifact is the only thing that crosses the boundary", fill=GREY, font=sub_f)

    # Three boxes
    boxes = [
        (80, 130, 360, 290, "Planner", "expensive model · 1 call", NAVY),
        (480, 130, 760, 290, "Implementer", "cheap model · agent mode\nRalph loop on plan.md", GREEN),
        (880, 130, 1160, 290, "Reviewer", "expensive model · 1 call\nsees plan.md + diff only", ACCENT),
    ]
    for x1, y1, x2, y2, name, sub, color in boxes:
        d.rounded_rectangle([x1, y1, x2, y2], radius=18, fill="white", outline=color, width=4)
        d.text((x1 + 20, y1 + 20), name, fill=color, font=name_f)
        for i, ln in enumerate(sub.split("\n")):
            d.text((x1 + 20, y1 + 60 + i*22), ln, fill=INK, font=sub_f)
        # Output count
        d.text((x1 + 20, y2 - 36), "≈ 1 premium req" if "expensive" in sub else "≈ 3–6 premium reqs",
               fill=GREY, font=sub_f)

    # Arrows + artifacts
    def arrow(x1, x2, y, label):
        d.line([(x1, y), (x2-18, y)], fill=INK, width=3)
        d.polygon([(x2-18, y-8), (x2, y), (x2-18, y+8)], fill=INK)
        d.rounded_rectangle([(x1+x2)/2 - 60, y-58, (x1+x2)/2 + 60, y-22], radius=8, fill=GOLD, outline=INK, width=2)
        d.text(((x1+x2)/2 - 38, y-50), label, fill=INK, font=art_f)

    arrow(360, 480, 200, "  plan.md  ")
    arrow(760, 880, 200, "   diff    ")

    # Footer
    d.text((W//2 - 240, 360), "Total: ≈ 5–8 premium requests for a feature with a paper trail.",
           fill=INK, font=name_f)
    d.text((W//2 - 290, 392), "(Compare with one mega-chat on the top-tier model: easily 30+ requests at 10× the multiplier.)",
           fill=GREY, font=sub_f)

    img.save(OUT / "06-handover-flow.png")

    # Mermaid source for re-rendering
    mmd = """flowchart LR
    U[Feature request] --> P[Planner<br/>expensive model · 1 call]
    P -->|plan.md| I[Implementer<br/>cheap model · agent mode<br/>Ralph loop on plan.md]
    I -->|diff| R[Reviewer<br/>expensive model · 1 call<br/>sees plan.md + diff only]
    R --> V{{VERDICT: APPROVE / REQUEST CHANGES}}
"""
    (OUT / "06-handover-flow.mmd").write_text(mmd, encoding="utf-8")

# ---------------------------------------------------------------- 07 todo + git log
def img7():
    W, H = 1200, 480
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    body = load_font(MONO, 14); ttl = load_font(SANS_B, 14)

    # Two panels
    d.rounded_rectangle([20, 20, 580, H-20], radius=12, fill="#1e1e1e", outline=INK, width=2)
    d.rounded_rectangle([620, 20, W-20, H-20], radius=12, fill="#1e1e1e", outline=INK, width=2)
    d.text((36, 32), "TODO.md  (mid-loop)", fill="#cccccc", font=ttl)
    d.text((636, 32), "git log --oneline", fill="#cccccc", font=ttl)

    todos = [
        "# TODO",
        "",
        "- [x] Add unit test for parseAddress",
        "- [x] Add JSDoc @returns to formatMoney",
        "- [x] Add second mock order with 3 items",
        "- [ ] Add test for pluralize (n=1, n=2)",
        "- [ ] Migrate sendOrderConfirmation to render()",
    ]
    y = 70
    for line in todos:
        color = "#cdd6f4"
        if "[x]" in line: color = "#a6e3a1"
        elif "[ ]" in line: color = "#f9e2af"
        elif line.startswith("#"): color = "#f38ba8"
        d.text((36, y), line, fill=color, font=body)
        y += 26

    log = [
        "a3f9c1d  ralph: add second mock order with 3 items",
        "82ee407  ralph: add JSDoc @returns to formatMoney",
        "1b04ac2  ralph: add unit test for parseAddress",
        "0c5d9aa  initial setup",
    ]
    y = 70
    for line in log:
        sha = line[:8]
        rest = line[8:]
        d.text((636, y), sha, fill="#f9e2af", font=body)
        d.text((636 + 80, y), rest, fill="#cdd6f4", font=body)
        y += 30

    d.text((20, H-14), "one task → one commit · restartable · auditable",
           fill=GREY, font=load_font(SANS, 12))
    img.save(OUT / "07-todo-gitlog.png")

# ---------------------------------------------------------------- 08 checklist card
def img8():
    W, H = 1100, 1300
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    h1 = load_font(SANS_B, 32)
    h2 = load_font(SANS_B, 20)
    item = load_font(SANS, 17)

    d.text((50, 40), "Context Is a Budget", fill=INK, font=h1)
    d.text((50, 86), "the Monday checklist", fill=GREY, font=load_font(SANS, 18))

    sections = [
        ("Repo setup", [
            "Add a top-level instructions file with build, test, lint, conventions, output style.",
            "Add path-scoped instruction files for stack-specific rules.",
            "`.gitignore` build outputs and large fixtures. `git rm --cached` what's already tracked.",
            "Add 3-line summary comments to your top 10 modules.",
            "Add a CI lint that fails when instruction files exceed ~150 lines.",
        ]),
        ("Per-session habits", [
            "Disable MCP servers you don't need this session.",
            "Default to a mid-tier model. Escalate only when stuck — with a reason.",
            "Use `#file:` instead of broad-retrieval / agent mode for scoped tasks.",
            "Ask for diffs, not full files.",
            "Start each new task in a fresh chat.",
            "At ~60% context, summarize to plan.md and continue in a new chat.",
        ]),
        ("Workflow patterns to try this week", [
            "Run a Ralph loop on a TODO.md of small chores.",
            "Use the planner → implementer → reviewer split for one real feature.",
            "Treat latency as your token meter. Count Mississippis for one day.",
        ]),
    ]
    y = 150
    for title, items in sections:
        d.line([(50, y - 6), (W - 50, y - 6)], fill=ACCENT, width=2)
        d.text((50, y + 6), title, fill=ACCENT, font=h2)
        y += 50
        for it in items:
            # checkbox
            d.rectangle([60, y + 4, 80, y + 24], outline=INK, width=2)
            # wrap text
            words = it.split(" "); line = ""; lines = []
            for w in words:
                trial = (line + " " + w).strip()
                if d.textlength(trial, font=item) > W - 130:
                    lines.append(line); line = w
                else:
                    line = trial
            if line: lines.append(line)
            for i, ln in enumerate(lines):
                d.text((96, y + i*26), ln, fill=INK, font=item)
            y += max(34, len(lines)*26 + 8)
        y += 14

    d.text((50, H - 60), "The worst tokens are the ones you're paying for and not noticing.",
           fill=NAVY, font=load_font(SANS_B, 18))
    img.save(OUT / "08-checklist-card.png")

# ----------------------------------------------------------------
for fn in [img1, img2, img3, img4, img5, img6, img7, img8]:
    fn()
    print(f"ok {fn.__name__}")
