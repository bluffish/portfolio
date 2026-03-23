const output = document.getElementById('output');
const inputLine = document.getElementById('input-line');
const inputField = document.getElementById('input-field');
const promptText = document.querySelector('.prompt-text');
const cursor = document.getElementById('cursor');

let cwd = '~';

// Cached measurement span — reused on every updateCursor call
const measure = document.createElement('span');
measure.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
document.body.appendChild(measure);

// Cache font once after first frame (font won't change)
let cachedFont = '';
requestAnimationFrame(() => {
  cachedFont = getComputedStyle(inputField).font;
  measure.style.font = cachedFont;
});

function buildPromptHtml() {
  const display = cwd === '~' ? '~' : '~/' + cwd;
  return '<span class="prompt-user">bowen</span><span class="prompt-at">@</span>'
       + '<span class="prompt-host">portfolio</span><span class="prompt-sep">:</span>'
       + '<span class="prompt-path">' + display + '</span><span class="prompt-dollar">$ </span>';
}

export function getCwd() { return cwd; }

export function setCwd(dir) {
  cwd = dir;
  promptText.innerHTML = buildPromptHtml();
}

export function getPrompt() {
  return buildPromptHtml();
}

export function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function print(html) {
  output.insertAdjacentHTML('beforeend', html);
  output.scrollTop = output.scrollHeight;
}

export function println(html = '') {
  print(html + '\n');
}

export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export function clearOutput() {
  output.innerHTML = '';
}

export function showInput() {
  inputLine.classList.remove('hidden');
  inputField.focus();
}

export function getInputField() {
  return inputField;
}

export function updateCursor() {
  measure.textContent = inputField.value.slice(0, inputField.selectionStart);
  cursor.style.left = measure.offsetWidth + 'px';
}
