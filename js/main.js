import { initInput } from './input.js';
import { boot } from './boot.js';

initInput();
document.fonts.ready.then(() => boot());
