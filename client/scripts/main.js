import { createUsernameController } from './controller.js';
import { createUiBindings } from './ui.js';

const ui = createUiBindings(document);
const controller = createUsernameController(ui);

controller.init();
