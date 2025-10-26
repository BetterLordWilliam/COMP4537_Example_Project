// import mymath from './modules/math.js';
import { Math, addition, asyncAddition } from './modules/math.js';

import Logger from './modules/services/logger.js';
import NoteManager from './modules/services/notemanager.js';

console.log(`PI approx: ${Math.PI}`);
console.log(`E approx: ${Math.E}`);
console.log(`Addition: ${addition(5, 7)}`);
console.log(`Async Addition: ${await asyncAddition(10, 15)}`);

const logger = new Logger('./logs', false);
const noteManager = new NoteManager(logger);

await noteManager.createNote('testnote', 'This is new content in the test note.');
console.log(await noteManager.readNote('testnote'));
console.log(await noteManager.readNote('idontexist'));
