# Portfolio — Terminal-style personal website

## Overview
Interactive terminal emulator portfolio for Bowen Yang (CS + Physics @ Harvard '29). Visitors type shell commands to explore projects, papers, skills, and contact info. Tokyo Night color theme with cyan/green/purple/amber accents.

## Architecture
Static site — no build tools, no bundler. Uses native ES modules (`type="module"`).

```
index.html            # DOM structure, font/CSS/JS links
css/style.css         # All styles (CSS custom properties for theming)
js/
  main.js             # Entry point — wires up input + boot
  data.js             # Pure data: PROJECTS, PAPERS, SKILLS, COMMANDS, DIRS
  terminal.js         # DOM refs, helpers (print, sleep, esc), cwd state, cursor
  commands.js         # One exported function per command + shared card/wrap helpers
  input.js            # Keyboard handler, history, tab-complete, command dispatch
  boot.js             # Welcome message + auto-types `neofetch`
```

## Key conventions
- All DOM access is centralized in `terminal.js`; other modules import helpers.
- `terminal.js` owns the current working directory (`cwd`) state and the prompt HTML.
- Command functions call `println()` and return. Async only when animation is needed (`cmdRm`).
- Shared rendering helpers in `commands.js`: `printWrapped()`, `printCardTop/Bottom()`, `printLinks()`, `statusBadge()`, `techTags()`.
- Data lives in `data.js` — add new projects/papers/skills there.
- Tab completion uses `tryComplete()` helper to avoid repetition.
- No build step. Serve with `npx serve .` or `python -m http.server` (ES modules require HTTP, not `file://`).

## Adding a new command
1. Add the name to `COMMANDS` in `js/data.js`.
2. Write `export function cmdFoo()` in `js/commands.js`.
3. Add a `case 'foo':` in the switch inside `executeCommand()` in `js/input.js`.
4. Import `cmdFoo` at the top of `js/input.js`.
5. Optionally add it to `cmdHelp()`'s table.

## Adding a new project or paper
- Add an entry to `PROJECTS` or `PAPERS` in `js/data.js`. No `name` field needed — the object key is the name.
- Papers need: `title`, `authors`, `venue`, `status` ('published' or 'in prep'), `desc`, `links`.
- Projects need: `title`, `desc`, `tech` (array), `links`.

## Virtual filesystem
- `cd projects`, `cd papers`, `cd ..` — changes cwd, prompt updates automatically.
- `ls` is cwd-aware. `cat <name>` resolves relative to cwd.
- `cat .bashrc`, `cat .vimrc`, `cat README.md` work from home directory.

## Color theme (Tokyo Night)
- **Cyan** (`--cyan`): cursor, ASCII art, command names in help/boot
- **Green** (`--green`): prompt user, card borders (`.project-title`), success/published badges
- **Purple** (`--purple`): prompt host, field labels (`.project-field`), syntax keywords in dotfiles
- **Amber** (`--amber`): section headers (Projects, Skills, Contact, etc.)
- **Blue** (`--blue`): paths in prompt, links, neofetch labels, skill category names
- **Red** (`--red`): errors, panic background

## TODOs (placeholders in code)
- Replace `TODO` links in `data.js` and `commands.js` (GitHub, LinkedIn, email, paper URLs).
- Replace the placeholder paper in `data.js` with real data.
- Add a real `resume.pdf` and update `cmdResume()`.
