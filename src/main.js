// main.js

import { addRow, deleteRow, getValue } from './form.js';

document.getElementById('addRowBtn').addEventListener('click', addRow);
document.getElementById('submitRelaysBtn').addEventListener('click', getValue);