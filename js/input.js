import { COMMANDS, PROJECT_LIST, PAPER_LIST, EXPERIENCE_LIST, DIRS } from './data.js';
import { esc, println, getInputField, getPrompt, getCwd, updateCursor } from './terminal.js';
import {
  cmdHelp, cmdIntro, cmdAbout, cmdProjects, cmdPapers, cmdExperience,
  cmdLs, cmdCat, cmdCd, cmdTree, cmdSkills,
  cmdContact, cmdClear,
  cmdSudo, cmdVim, cmdCowsay, cmdRm
} from './commands.js';

let history = [];
let histIdx = -1;
let savedInput = '';
let initialized = false;

function executeCommand(raw) {
  const trimmed = raw.trim();
  if (trimmed !== 'clear') {
    println(getPrompt() + '<span class="cmd">' + esc(trimmed) + '</span>');
  }

  if (!trimmed) return;

  if (trimmed !== history[history.length - 1]) {
    history.push(trimmed);
  }
  histIdx = -1;
  savedInput = '';

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).join(' ');

  switch (cmd) {
    case 'help': cmdHelp(); break;
    case 'intro': case 'neofetch': cmdIntro(); break;
    case 'about': case 'whoami': cmdAbout(); break;
    case 'projects': cmdProjects(); break;
    case 'papers': cmdPapers(); break;
    case 'experience': cmdExperience(); break;
    case 'ls': cmdLs(args); break;
    case 'cat': cmdCat(args); break;
    case 'cd': cmdCd(args); break;
    case 'tree': cmdTree(); break;
    case 'skills': cmdSkills(); break;
    case 'contact': cmdContact(); break;

    case 'clear': cmdClear(); break;
    case 'sudo': cmdSudo(); break;
    case 'vim': case 'vi': case 'nvim': cmdVim(); break;
    case 'cowsay': cmdCowsay(args); break;
    case 'rm': cmdRm(args); break;
    case 'pwd': {
      const cwd = getCwd();
      const path = cwd === '~' ? '/home/bowen' : '/home/bowen/' + cwd;
      println('<span class="cmd">' + path + '</span>');
      break;
    }
    case 'echo': println('<span class="cmd">' + esc(args) + '</span>'); break;
    case 'date': println('<span class="cmd">' + new Date().toString() + '</span>'); break;
    case 'exit': println('<span class="hint">there is no escape.</span>'); break;
    default:
      println('<span class="error">bash: ' + esc(cmd) + ': command not found</span>');
      println('<span class="hint">type "help" for available commands</span>');
  }
  println();
}

// ── Tab completion ────────────────────────────────────

function showMatches(value, matches) {
  println(getPrompt() + '<span class="cmd">' + esc(value) + '</span>');
  println('<span class="hint">' + matches.join('  ') + '</span>');
  println();
}

function tryComplete(value, prefix, candidates, formatResult) {
  const matches = candidates.filter(c => c.startsWith(prefix));
  if (matches.length === 1) return formatResult(matches[0]);
  if (matches.length > 1) {
    showMatches(value, matches);
    return value;
  }
  return null;
}

function tabComplete(value) {
  const parts = value.split(/\s+/);
  const cwd = getCwd();

  // Command completion
  if (parts.length === 1) {
    return tryComplete(value, parts[0], COMMANDS, m => m + ' ') ?? value;
  }

  const arg = parts[1];

  // cd completion
  if (parts[0] === 'cd' && parts.length === 2) {
    return tryComplete(value, arg, DIRS, m => 'cd ' + m) ?? value;
  }

  // cat completion
  if (parts[0] === 'cat' && parts.length === 2) {
    // cat projects/<tab>
    if (arg.startsWith('projects/')) {
      const result = tryComplete(value, arg.slice(9), PROJECT_LIST, m => 'cat projects/' + m);
      if (result) return result;
    }

    // cat papers/<tab>
    if (arg.startsWith('papers/')) {
      const result = tryComplete(value, arg.slice(7), PAPER_LIST, m => 'cat papers/' + m);
      if (result) return result;
    }

    // cat experience/<tab>
    if (arg.startsWith('experience/')) {
      const result = tryComplete(value, arg.slice(11), EXPERIENCE_LIST, m => 'cat experience/' + m);
      if (result) return result;
    }

    // Complete directory prefix
    if ('projects/'.startsWith(arg) || 'papers/'.startsWith(arg) || 'experience/'.startsWith(arg)) {
      const result = tryComplete(value, arg, ['projects/', 'papers/', 'experience/'], m => 'cat ' + m);
      if (result) return result;
    }

    // Inside a directory, complete bare names
    if (cwd === 'projects') {
      const result = tryComplete(value, arg, PROJECT_LIST, m => 'cat ' + m);
      if (result) return result;
    }
    if (cwd === 'papers') {
      const result = tryComplete(value, arg, PAPER_LIST, m => 'cat ' + m);
      if (result) return result;
    }
    if (cwd === 'experience') {
      const result = tryComplete(value, arg, EXPERIENCE_LIST, m => 'cat ' + m);
      if (result) return result;
    }

    // Dotfiles
    const result = tryComplete(value, arg, ['.bashrc', '.vimrc', 'README.md'], m => 'cat ' + m);
    if (result) return result;
  }

  // ls completion
  if (parts[0] === 'ls' && parts.length === 2) {
    const result = tryComplete(value, arg, DIRS.map(d => d + '/'), m => 'ls ' + m);
    if (result) return result;
  }

  return value;
}

export { executeCommand };

export function initInput() {
  if (initialized) return;
  initialized = true;

  const inputField = getInputField();

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputField.value;
      inputField.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      if (histIdx === -1) {
        savedInput = inputField.value;
        histIdx = history.length - 1;
      } else if (histIdx > 0) {
        histIdx--;
      }
      inputField.value = history[histIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      if (histIdx < history.length - 1) {
        histIdx++;
        inputField.value = history[histIdx];
      } else {
        histIdx = -1;
        inputField.value = savedInput;
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      inputField.value = tabComplete(inputField.value);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      cmdClear();
    }
    requestAnimationFrame(updateCursor);
  });

  inputField.addEventListener('input', updateCursor);

  document.addEventListener('click', (e) => {
    const cmdEl = e.target.closest('[data-cmd]');
    if (cmdEl) {
      inputField.value = '';
      executeCommand(cmdEl.dataset.cmd);
      updateCursor();
      return;
    }
    if (!e.target.closest('a')) inputField.focus();
  });

  updateCursor();
}
