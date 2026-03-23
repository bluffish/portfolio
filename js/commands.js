import { PROJECTS, PROJECT_LIST, PAPERS, PAPER_LIST, EXPERIENCE, EXPERIENCE_LIST, VENUES, SKILLS, DIRS } from './data.js';
import { esc, print, println, sleep, clearOutput, getCwd, setCwd } from './terminal.js';

// ── Shared helpers ────────────────────────────────────

// String-returning helpers for building card HTML

function wrapText(text, prefix = '\u2502   ', maxWidth = 50) {
  const lines = [];
  const words = text.split(' ');
  let line = prefix;
  for (const w of words) {
    if ((line + w).length > maxWidth) {
      lines.push('<span class="cmd">' + line + '</span>');
      line = prefix;
    }
    line += w + ' ';
  }
  if (line.trim() !== '\u2502') lines.push('<span class="cmd">' + line + '</span>');
  return lines.join('\n');
}

function cardTop(title) {
  return '<span class="project-title">\u250c\u2500 ' + esc(title) + '</span>';
}

function cardBottom() {
  return '<span class="project-title">\u2514' + '\u2500'.repeat(35) + '</span>';
}

function renderLinks(links) {
  return Object.entries(links).map(([k, v]) =>
    '<span class="project-field">\u2502 ' + k + ':</span> <a class="term-link" href="' + esc(v) + '" target="_blank">' + esc(v) + '</a>'
  ).join('\n');
}

// Print-based helpers for single-card views (cat)

function printWrapped(text) {
  print(wrapText(text) + '\n');
}

function printCardTop(title) { println(cardTop(title)); }
function printCardBottom() { println(cardBottom()); }

function printLinks(links) {
  const html = renderLinks(links);
  if (html) println(html);
}

function statusBadge(status) {
  const color = status === 'in prep' ? 'amber' : 'green';
  return '<span class="' + color + '">[' + status + ']</span>';
}

function techTags(tags) {
  return tags.map(t => '<span class="skill-tag tag-lang">' + t + '</span>').join(' ');
}

function cmdLink(cmd, cls = 'cyan') {
  return '<span class="' + cls + ' cmd-link" data-cmd="' + esc(cmd) + '">' + esc(cmd) + '</span>';
}

// Grid renderer — prints cards in a 2-column grid

function printGrid(title, cards) {
  println('<span class="bold amber">' + title + '</span>');
  println();
  print('<div class="card-grid">' + cards.map(c => '<pre class="card">' + c + '</pre>').join('') + '</div>\n');
  println();
}

// ── Commands ──────────────────────────────────────────

export function cmdHelp() {
  println('<span class="bold amber">Available commands:</span>');
  println();
  const cmds = [
    ['intro',                  'display system info'],
    ['about',                  'about me'],
    ['projects',               'browse all projects'],
    ['papers',                 'browse all publications'],
    ['experience',             'view work experience'],
    ['skills',                 'show technical skills'],
    ['contact',                'get contact info'],

    ['clear',                  'clear terminal'],
    ['help',                   'show this message'],
  ];
  for (const [c, d] of cmds) {
    println('  ' + cmdLink(c) + ' '.repeat(Math.max(1, 24 - c.length)) + '<span class="hint">' + d + '</span>');
  }
  println();
  println('<span class="hint">Pro tip: use \u2191/\u2193 for history, Tab for autocomplete</span>');
}

export function cmdIntro() {
  const ascii = `<svg viewBox="0 0 14 6" width="100%" fill="currentColor" aria-label="BY" role="img">
<rect x="0" y="0" width="6" height="1"/>
<rect x="0" y="1" width="1" height="1"/><rect x="5" y="1" width="1" height="1"/>
<rect x="0" y="2" width="6" height="1"/>
<rect x="0" y="3" width="1" height="1"/><rect x="5" y="3" width="1" height="1"/>
<rect x="0" y="4" width="6" height="1"/>
<rect x="7" y="0" width="2" height="1"/><rect x="11" y="0" width="2" height="1"/>
<rect x="8" y="1" width="2" height="1"/><rect x="10" y="1" width="2" height="1"/>
<rect x="9" y="2" width="2" height="1"/>
<rect x="9" y="3" width="2" height="1"/>
<rect x="9" y="4" width="2" height="1"/>
<rect x="9" y="5" width="2" height="1"/>
</svg>`;

  const info = `<span class="bold cyan">bowen@portfolio</span>
<span class="neofetch-separator">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>
<span class="label">Name:</span>      <span class="value">Bowen Yang</span>
<span class="label">School:</span>    <span class="value">Harvard '29 \u2014 CS + Physics (4.0)</span>
<span class="label">Languages:</span> <span class="value">C++ / Rust / Python / C / Java</span>
<span class="label">Interests:</span> <span class="value">autonomous perception, embedded systems, astrophysics</span>

<span class="hint">First-author at ICLR, KDD, and Frontiers.</span>
<span class="hint">Currently building exomoon simulations</span>
<span class="hint">and ML compilers at Harvard.</span>

<span class="color-blocks"><span style="background:#f7768e">&nbsp;&nbsp;</span><span style="background:#9ece6a">&nbsp;&nbsp;</span><span style="background:#e0af68">&nbsp;&nbsp;</span><span style="background:#7aa2f7">&nbsp;&nbsp;</span><span style="background:#bb9af7">&nbsp;&nbsp;</span><span style="background:#c0caf5">&nbsp;&nbsp;</span><span style="background:#565f89">&nbsp;&nbsp;</span><span style="background:#1a1b26;border:1px solid #292e42">&nbsp;&nbsp;</span></span>`;

  println('<div class="neofetch"><div class="neofetch-ascii">' + ascii + '</div><div class="neofetch-info">' + info + '</div></div>');
}

// ── projects & papers ─────────────────────────────────

export function cmdProjects() {
  const cards = PROJECT_LIST.map(name => {
    const p = PROJECTS[name];
    const lines = [
      cardTop(p.title),
      '<span class="project-field">\u2502</span>',
      wrapText(p.desc),
      '<span class="project-field">\u2502</span>',
      '<span class="project-field">\u2502 Tech:</span> <span class="cmd">' + techTags(p.tech) + '</span>',
      renderLinks(p.links),
      cardBottom()
    ];
    return lines.filter(Boolean).join('\n');
  });
  printGrid('Projects', cards);
}

export function cmdPapers() {
  const cards = PAPER_LIST.map(name => {
    const p = PAPERS[name];
    const lines = [
      cardTop(p.title),
      '<span class="project-field">\u2502 Venue:</span>   <span class="cmd">' + esc(p.venue) + '</span>  ' + statusBadge(p.status),
      '<span class="project-field">\u2502 Authors:</span> <span class="cmd">' + esc(p.authors) + '</span>',
      renderLinks(p.links),
      cardBottom()
    ];
    return lines.filter(Boolean).join('\n');
  });
  printGrid('Publications', cards);
}

export function cmdExperience() {
  const cards = EXPERIENCE_LIST.map(name => {
    const e = EXPERIENCE[name];
    const lines = [
      cardTop(e.title),
      '<span class="project-field">\u2502 Org:</span>     <span class="cmd">' + esc(e.org) + '</span>',
      '<span class="project-field">\u2502 Date:</span>    <span class="cmd">' + esc(e.date) + '</span>',
      '<span class="hint">\u2502          ' + esc(e.location) + '</span>',
      '<span class="project-field">\u2502 Tech:</span>    <span class="cmd">' + techTags(e.tech) + '</span>',
      cardBottom()
    ];
    return lines.join('\n');
  });
  printGrid('Experience', cards);
}

// ── tree ──────────────────────────────────────────────

export function cmdTree() {
  println('<span class="blue bold">.</span>');
  const dirs = [
    { name: 'projects', items: PROJECT_LIST },
    { name: 'papers', items: PAPER_LIST },
    { name: 'experience', items: EXPERIENCE_LIST },
  ];
  const files = ['.bashrc', '.vimrc', 'README.md'];

  for (let i = 0; i < dirs.length; i++) {
    const d = dirs[i];
    const isLastDir = i === dirs.length - 1 && files.length === 0;
    const prefix = isLastDir ? '\u2514' : '\u251c';
    const childPrefix = isLastDir ? ' ' : '\u2502';
    println(prefix + '\u2500\u2500 <span class="blue bold">' + d.name + '/</span>');
    for (let j = 0; j < d.items.length; j++) {
      const isLast = j === d.items.length - 1;
      const branch = isLast ? '\u2514' : '\u251c';
      println(childPrefix + '   ' + branch + '\u2500\u2500 <span class="cmd">' + d.items[j] + '</span>');
    }
  }
  for (let i = 0; i < files.length; i++) {
    const isLast = i === files.length - 1;
    const prefix = isLast ? '\u2514' : '\u251c';
    println(prefix + '\u2500\u2500 <span class="cmd">' + files[i] + '</span>');
  }
  println();
  println('<span class="hint">' + (PROJECT_LIST.length + PAPER_LIST.length + EXPERIENCE_LIST.length) + ' items in 3 directories</span>');
}

// ── cd ────────────────────────────────────────────────

export function cmdCd(args) {
  if (!args || args === '~') {
    setCwd('~');
    return;
  }

  const target = args.replace(/\/$/, '');

  if (target === '..' || target === '~') {
    setCwd('~');
    return;
  }

  if (DIRS.includes(target)) {
    setCwd(target);
    return;
  }

  println('<span class="error">bash: cd: ' + esc(args) + ': No such file or directory</span>');
}

// ── ls ────────────────────────────────────────────────

export function cmdLs(args) {
  const dir = getCwd();

  if (!args) {
    if (dir === '~') {
      println('<span class="blue bold">projects/</span>   <span class="blue bold">papers/</span>   <span class="blue bold">experience/</span>   <span class="cmd">.bashrc</span>   <span class="cmd">.vimrc</span>   <span class="cmd">README.md</span>');
    } else if (dir === 'projects') {
      listProjects();
    } else if (dir === 'papers') {
      listPapers();
    } else if (dir === 'experience') {
      listExperience();
    }
    return;
  }

  const target = args.replace(/\/$/, '');
  if (target === 'projects') { listProjects(); return; }
  if (target === 'papers') { listPapers(); return; }
  if (target === 'experience') { listExperience(); return; }

  println('<span class="error">ls: cannot access \'' + esc(args) + '\': No such file or directory</span>');
}

function listProjects() {
  println('<span class="hint">total ' + PROJECT_LIST.length + '</span>');
  for (const p of PROJECT_LIST) {
    println('<span class="cyan">-rw-r--r--</span>  <span class="cmd">' + p + '</span>');
  }
}

function listPapers() {
  println('<span class="hint">total ' + PAPER_LIST.length + '</span>');
  for (const p of PAPER_LIST) {
    println('<span class="cyan">-rw-r--r--</span>  <span class="cmd">' + p + '</span>  ' + statusBadge(PAPERS[p].status));
  }
}

function listExperience() {
  println('<span class="hint">total ' + EXPERIENCE_LIST.length + '</span>');
  for (const e of EXPERIENCE_LIST) {
    const exp = EXPERIENCE[e];
    println('<span class="cyan">-rw-r--r--</span>  <span class="cmd">' + e + '</span>  <span class="hint">' + esc(exp.date) + '</span>');
  }
}

// ── cat ───────────────────────────────────────────────

export function cmdCat(args) {
  if (args === '.bashrc') { cmdCatBashrc(); return; }
  if (args === '.vimrc') { cmdCatVimrc(); return; }
  if (args === 'README.md') { cmdCatReadme(); return; }

  const dir = getCwd();

  const projMatch = args.match(/^projects\/(.+)$/);
  if (projMatch) { showProject(projMatch[1]); return; }

  const paperMatch = args.match(/^papers\/(.+)$/);
  if (paperMatch) { showPaper(paperMatch[1]); return; }

  const expMatch = args.match(/^experience\/(.+)$/);
  if (expMatch) { showExperience(expMatch[1]); return; }

  if (dir === 'projects' && args) { showProject(args); return; }
  if (dir === 'papers' && args) { showPaper(args); return; }
  if (dir === 'experience' && args) { showExperience(args); return; }

  if (!args) {
    println('<span class="error">usage: cat &lt;file&gt;</span>');
    println('<span class="hint">try: cd projects && cat ' + PROJECT_LIST[0] + '</span>');
  } else {
    println('<span class="error">cat: ' + esc(args) + ': No such file or directory</span>');
  }
}

function showProject(name) {
  const p = PROJECTS[name];
  if (!p) {
    println('<span class="error">cat: ' + esc(name) + ': No such file or directory</span>');
    println('<span class="hint">available: ' + PROJECT_LIST.join(', ') + '</span>');
    return;
  }

  printCardTop(p.title);
  println('<span class="project-title">\u2502</span>');
  println('<span class="project-field">\u2502 Description:</span>');
  printWrapped(p.desc);
  println('<span class="project-field">\u2502</span>');
  println('<span class="project-field">\u2502 Tech:</span> <span class="cmd">' + techTags(p.tech) + '</span>');
  println('<span class="project-field">\u2502</span>');
  printLinks(p.links);
  printCardBottom();
}

function showPaper(name) {
  const p = PAPERS[name];
  if (!p) {
    println('<span class="error">cat: ' + esc(name) + ': No such file or directory</span>');
    println('<span class="hint">available: ' + PAPER_LIST.join(', ') + '</span>');
    return;
  }

  printCardTop(p.title);
  println('<span class="project-title">\u2502</span>');
  println('<span class="project-field">\u2502 Venue:</span>   <span class="cmd">' + esc(p.venue) + '</span>  ' + statusBadge(p.status));
  println('<span class="project-field">\u2502 Authors:</span> <span class="cmd">' + esc(p.authors) + '</span>');
  println('<span class="project-field">\u2502</span>');
  println('<span class="project-field">\u2502 Abstract:</span>');
  printWrapped(p.desc);
  println('<span class="project-field">\u2502</span>');
  printLinks(p.links);
  printCardBottom();
}

function showExperience(name) {
  const e = EXPERIENCE[name];
  if (!e) {
    println('<span class="error">cat: ' + esc(name) + ': No such file or directory</span>');
    println('<span class="hint">available: ' + EXPERIENCE_LIST.join(', ') + '</span>');
    return;
  }

  printCardTop(e.title);
  println('<span class="project-title">\u2502</span>');
  println('<span class="project-field">\u2502 Org:</span>     <span class="cmd">' + esc(e.org) + '</span>');
  println('<span class="project-field">\u2502 Date:</span>    <span class="cmd">' + esc(e.date) + '</span>  <span class="hint">' + esc(e.location) + '</span>');
  println('<span class="project-field">\u2502</span>');
  printWrapped(e.desc);
  println('<span class="project-field">\u2502</span>');
  println('<span class="project-field">\u2502 Tech:</span>    <span class="cmd">' + techTags(e.tech) + '</span>');
  printCardBottom();
}

// ── dotfiles ──────────────────────────────────────────

function cmdCatBashrc() {
  const lines = [
    '<span class="hint"># ~/.bashrc \u2014 sourced on every login since \'24</span>',
    '',
    '<span class="purple">alias</span> <span class="cmd">projects=</span><span class="amber">\'ls projects/\'</span>',
    '<span class="purple">alias</span> <span class="cmd">me=</span><span class="amber">\'about\'</span>',
    '<span class="purple">alias</span> <span class="cmd">hire-me=</span><span class="amber">\'contact\'</span>',
    '<span class="purple">alias</span> <span class="cmd">gpu=</span><span class="amber">\'srun --gres=gpu:a100:4 --pty bash\'</span>',
    '<span class="purple">alias</span> <span class="cmd">oops=</span><span class="amber">\'git reset --soft HEAD~1\'</span>',
    '',
    '<span class="purple">export</span> <span class="cmd">EDITOR</span>=<span class="amber">"nvim"</span>',
    '<span class="purple">export</span> <span class="cmd">PATH</span>=<span class="amber">"$PATH:~/ambition:~/caffeine"</span>',
    '<span class="purple">export</span> <span class="cmd">CUDA_VISIBLE_DEVICES</span>=<span class="amber">"all-of-them-please"</span>',
    '',
    '<span class="hint"># if the research compiles, don\'t touch it</span>',
    '<span class="purple">alias</span> <span class="cmd">yolo=</span><span class="amber">\'git add -A && git commit -m "it works trust me" && git push\'</span>',
  ];
  for (const l of lines) println(l);
}

function cmdCatVimrc() {
  const lines = [
    '<span class="amber">" ~/.vimrc</span>',
    '<span class="amber">" can\'t exit this terminal either</span>',
    '',
    '<span class="purple">set</span> <span class="cmd">number</span>                  <span class="amber">" count your blessings</span>',
    '<span class="purple">set</span> <span class="cmd">relativenumber</span>          <span class="amber">" everything is relative (physics major)</span>',
    '<span class="purple">set</span> <span class="cmd">scrolloff=999</span>            <span class="amber">" always keep goals in sight</span>',
    '<span class="purple">set</span> <span class="cmd">ignorecase smartcase</span>     <span class="amber">" be flexible but not naive</span>',
    '<span class="purple">set</span> <span class="cmd">undofile</span>                 <span class="amber">" mistakes are recoverable</span>',
    '<span class="purple">set</span> <span class="cmd">noswapfile</span>               <span class="amber">" live dangerously</span>',
    '',
    '<span class="amber">" save progress on career</span>',
    '<span class="purple">nnoremap</span> <span class="cmd">&lt;leader&gt;w</span> <span class="blue">:w&lt;CR&gt;</span>',
    '',
    '<span class="amber">" when in doubt, exit gracefully</span>',
    '<span class="purple">nnoremap</span> <span class="cmd">&lt;leader&gt;q</span> <span class="blue">:echo "there is no escape"&lt;CR&gt;</span>',
  ];
  for (const l of lines) println(l);
}

function cmdCatReadme() {
  const lines = [
    '<span class="bold cyan"># README.md</span>',
    '',
    '<span class="cmd">Welcome to my home directory.</span>',
    '',
    '<span class="cmd">I\'m Bowen \u2014 I like making computers go fast and models go brrr.</span>',
    '<span class="cmd">Type</span> <span class="cyan cmd-link" data-cmd="help">help</span> <span class="cmd">if you\'re lost.</span>',
  ];
  for (const l of lines) println(l);
}

// ── other commands ────────────────────────────────────


export function cmdSkills() {
  println('<span class="bold amber">Technical Skills</span>');
  println('<span class="neofetch-separator">\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550</span>');
  println();
  for (const [cat, data] of Object.entries(SKILLS)) {
    const tags = data.tags.map(t => '<span class="skill-tag ' + data.cls + '">' + t + '</span>').join(' ');
    println('<span class="blue bold">' + cat + '</span>');
    println('  ' + tags);
    println();
  }
}

export function cmdContact() {
  println('<span class="bold amber">Contact</span>');
  println();
  println('  <span class="cyan bold">Email:</span>     <a class="term-link" href="mailto:bowenyang@college.harvard.edu">bowenyang@college.harvard.edu</a>');
  println('  <span class="cyan bold">GitHub:</span>    <a class="term-link" href="https://github.com/bluffish" target="_blank">github.com/bluffish</a>');
  println('  <span class="cyan bold">LinkedIn:</span>  <a class="term-link" href="https://www.linkedin.com/in/bowyang" target="_blank">linkedin.com/in/bowyang</a>');
  println();
  println('<span class="hint">Feel free to reach out!</span>');
}

export function cmdClear() {
  clearOutput();
}

export function cmdAbout() {
  println('<span class="cmd">Bowen Yang \u2014 CS + Physics @ Harvard \'29</span>');
  println();
  println('<span class="hint">Researcher and engineer working across AI safety, quantitative</span>');
  println('<span class="hint">trading, and astrophysics. Multiple first-author publications</span>');
  println('<span class="hint">at ICLR, ACM KDD, and Frontiers in Big Data. Previously at</span>');
  println('<span class="hint">HPE, MIT RSI, and UT Dallas AI Safety Lab. Currently building</span>');
  println('<span class="hint">trading systems at HUQT and simulating exomoon transits at</span>');
  println('<span class="hint">the Center for Astrophysics.</span>');
  println();
  println('<span class="hint">Type</span> ' + cmdLink('help') + ' <span class="hint">to see what else you can do here.</span>');
}

export function cmdSudo() {
  println('<span class="error">[sudo] permission denied: nice try, but you\'re not root here.</span>');
  println('<span class="hint">This incident will be reported.</span>');
}

export function cmdVim() {
  println('<span class="amber bold">You are now trapped in vim.</span>');
  println();
  println('<span class="cmd">~</span>');
  println('<span class="cmd">~</span>');
  println('<span class="cmd">~     How to exit vim:</span>');
  println('<span class="cmd">~       1. You don\'t.</span>');
  println('<span class="cmd">~       2. Throw your computer out the window.</span>');
  println('<span class="cmd">~       3. :q!</span>');
  println('<span class="cmd">~</span>');
  println('<span class="cmd">~</span>');
  println('<span class="hint">Just kidding \u2014 you\'re still in the portfolio shell.</span>');
}

export function cmdCowsay(msg) {
  if (!msg) msg = 'moo! hire bowen';
  const m = esc(msg);
  const border = '\u2500'.repeat(m.length + 2);
  println('<span class="cow"> \u250c' + border + '\u2510</span>');
  println('<span class="cow"> \u2502 ' + m + ' \u2502</span>');
  println('<span class="cow"> \u2514' + border + '\u2518</span>');
  println('<span class="cow">        \\   ^__^</span>');
  println('<span class="cow">         \\  (oo)\\_______</span>');
  println('<span class="cow">            (__)\\       )\\/\\</span>');
  println('<span class="cow">                ||----w |</span>');
  println('<span class="cow">                ||     ||</span>');
}

export async function cmdRm(args) {
  if (!args.includes('-rf') || !args.includes('/')) {
    println('<span class="error">rm: missing operand</span>');
    return;
  }

  println('<span class="error bold">rm: destroying all files...</span>');
  await sleep(300);

  const panic = [
    'KERNEL PANIC \u2014 NOT SYNCING: attempted to kill init!',
    '',
    'CPU: 0 PID: 1 Comm: init Not tainted 6.2.0-harvard #1',
    'Call Trace:',
    '  panic+0x1a2/0x38c',
    '  do_exit.cold+0x64/0x9c',
    '  do_group_exit+0x33/0xa0',
    '  __x64_sys_exit_group+0x14/0x20',
    '',
    'Kernel Offset: 0x1e600000 from 0xffffffff81000000',
    '---[ end Kernel panic - not syncing ]---',
  ];

  for (const line of panic) {
    println('<span class="panic-bg">' + esc(line || ' ') + '</span>');
    await sleep(80);
  }

  await sleep(1200);
  clearOutput();
  println();
  println('<span class="success bold">Just kidding! System restored.</span>');
  println('<span class="hint">You really thought I\'d let you do that?</span>');
}
