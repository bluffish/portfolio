import { println, sleep, showInput, getInputField, updateCursor } from './terminal.js';
import { executeCommand } from './input.js';

async function typeInInput(text, delay) {
  const inputField = getInputField();
  for (const ch of text) {
    inputField.value += ch;
    updateCursor();
    await sleep(delay);
  }
}

async function printSlow(html, delay = 35) {
  println(html);
  await sleep(delay);
}

export async function boot() {
  await printSlow('<span class="bold cyan">Welcome to Bowen\'s portfolio.</span>');
  await printSlow('<span class="hint">This is an interactive terminal \u2014 type commands below to explore.</span>');
  await printSlow('');
  await printSlow('<span class="hint">Try:</span>  <span class="cyan cmd-link" data-cmd="about">about</span>        <span class="hint">\u2014 about me</span>');
  await printSlow('      <span class="cyan cmd-link" data-cmd="projects">projects</span>     <span class="hint">\u2014 browse projects</span>');
  await printSlow('      <span class="cyan cmd-link" data-cmd="papers">papers</span>       <span class="hint">\u2014 browse publications</span>');
  await printSlow('      <span class="cyan cmd-link" data-cmd="experience">experience</span>   <span class="hint">\u2014 view work experience</span>');
  await printSlow('      <span class="cyan cmd-link" data-cmd="skills">skills</span>       <span class="hint">\u2014 view tech stack</span>');
  await printSlow('      <span class="cyan cmd-link" data-cmd="contact">contact</span>      <span class="hint">\u2014 get in touch</span>');
  await printSlow('');
  await printSlow('<span class="hint">Use \u2191/\u2193 for history, Tab for autocomplete.</span>');
  await printSlow('');

  showInput();
  updateCursor();

  await typeInInput('intro', 70);
  await sleep(200);
  executeCommand('intro');
  getInputField().value = '';
  updateCursor();
}
