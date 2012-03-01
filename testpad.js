/**
| A testing pad for meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var Jools;
var Fabric;
var Peer;
var testinput;
var blink;

/**
| Export/Capsule
*/
(function(){
'use strict';

if (typeof(window) === 'undefined') throw new Error('testpad needs a browser!');

var Path      = Jools.Path;
var debug     = Jools.debug;
var fixate    = Jools.fixate;
var log       = Jools.log;
var subclass  = Jools.subclass;
var action    = null;

var element = {
	pad    : null,
	input  : null,
	beep   : null,
	send   : null,
	cancel : null,
};

var peer;
var space;
var note;
var alley;
var copse;

var cursor = {
	line   : 0,
	offset : 0,
	blink  : false
};
var focus     = false;

function isSpecialKey(keyCode) {
    switch(keyCode) {
    case  8 : // backspace
    case 13 : // return
	case 27 : // esc
    case 35 : // end
    case 36 : // pos1
    case 37 : // left
    case 38 : // up
    case 39 : // right
    case 40 : // down
    case 46 : // del
        return true;
    default :
        return false;
    }
}

/**
| The blink timer.
*/
var blinkTimer = null;

/**
| Blinks the cursor on/off.
*/
blink = function() {
	cursor.blink = !cursor.blink;
	testinput();
	updatePad();
	element.beep.innerHTML = '';
}

/**
| Resets the blink timer
*/
function resetBlink() {
	cursor.blink = false;
	element.beep.innerHTML = '';
	if (blinkTimer) clearInterval(blinkTimer);
	if (focus) {
		blinkTimer = setInterval("blink();", 540);
	}
}

/**
| Mouse down event on pad -> focuses the hidden input,
*/
function onmousedown(event) {
	if (event.button !== 0) return;
	event.preventDefault();
	element.input.focus();
}

/**
| Down event to (hidden) input.
*/
function onkeydown(event) {
	if (isSpecialKey(event.keyCode)) {
		event.preventDefault();
		inputSpecialKey(event.keyCode);
	} else {
		testinput();
	}
}

/**
| Press event to (hidden) input.
*/
function onkeypress(event) {
	setTimeout('testinput();', 0);
}

/**
| Up event to (hidden) input.
*/
function onkeyup(event) {
	testinput();
}

/**
| Hidden input got focus.
*/
function onfocus() {
	focus = true;
	resetBlink();
	updatePad();
}

/**
| Hidden input lost focus.
*/
function onblur() {
	focus = false;
	resetBlink();
	updatePad();
}

/**
| Sends the current action to server
*/
function send() {

	// TODO store keys in the nodes or so
	var path = new Path(['copse', 'welcome', 'copse', '1', 'doc', 'copse', alley[action.line] ]);
	peer.insertText(path, action.at1, action.val);

	element.cancel.disabled = true;
	element.send.disabled = true;
	action = null;

	update();
	resetBlink();
	updatePad();
}

/**
| Cancels the current action
*/
function cancel() {
	action = null;
	element.cancel.disabled = true;
	element.send.disabled = true;
	resetBlink();
	updatePad();
}

/**
| Aquires non-special input from (hidden) input.
*/
testinput = function() {
	var text = element.input.value;
	element.input.value = '';
	if (text === '') return;


	if (action === null) {
		action = {
			type : 'insert',
			line : cursor.line,
			at1  : cursor.offset,
			val  : text
		}
		element.send.disabled = false;
		element.cancel.disabled = false;
		resetBlink();
		updatePad();
		return;
	} else if (action.type === 'insert') {
		if (cursor.line === action.line && cursor.offset === action.at1) {
			action.val = action.val + text;
			resetBlink();
			updatePad();
			return;
		}
	}

	resetBlink();
	element.beep.innerHTML = 'BEEP!';
};


/**
| TODO
*/
function inputSpecialKey(keyCode) {
	switch(keyCode) {
    case  8 : // backspace
		break;
	case 27 : // esc
		cancel();
		break;
    case 13 : // return
		break;
    case 35 : // end
		cursor.offset = copse[alley[cursor.line]].text.length;
		break;
    case 36 : // pos1
		cursor.offset = 0;
		break;
    case 37 : // left
		if (cursor.offset <= 0) break;
		cursor.offset--;
		break;
    case 38 : // up
		if (cursor.line <= 0) break;
		cursor.line--;
		break;
    case 39 : // right
		cursor.offset ++;
		break;
    case 40 : // down
		if (cursor.line >= alley.length) break;
		cursor.line++;
		break;
    case 46 : // del
		break;
	}
	resetBlink();
	updatePad();
}

/**
| Updates data from server
*/
function update() {
	space = peer.getSpace('welcome');
	note = space.copse['1'];
	alley = note.doc.alley;
	copse = note.doc.copse;
}

/**
| TODO
*/
function updatePad() {
	var lines = [];
	var a, aZ, b, bZ;
	for(a = 0, aZ = alley.length; a < aZ; a++) {
		lines.push(copse[alley[a]].text.split(''));
	}

	// replaces HTML entities.
	for(a = 0, aZ = lines.length; a < aZ; a++) {
		var line = lines[a];
		for(b = 0, bZ = line.length; b < bZ; b++) {
			switch(line[b]) {
			case '&' : line[b] = '&amp;';  break;
			case '"' : line[b] = '&quot;'; break;
			case '<' : line[b] = '&lt;';   break;
			case '>' : line[b] = '&gt;';   break;
			}
		}
	}

	// inserts the cursor
	if (focus && !cursor.blink) {
		var cline = cursor.line;
		if (cline < 0) cline = cursor.line = 0;
		if (cline > alley.length - 1) cline = cursor.line = alley.length - 1;
		var ctext = lines[cline];
		var coff  = cursor.offset;
		var clen  = lines[cline].length;
		if (coff >= ctext.length) {
			coff = cursor.offset = ctext.length;
			lines[cline][coff] = ' ';
		}
	
		lines[cline][coff] = '<span id="cursor">'+lines[cline][coff]+'</span>';
		if (coff === clen) lines[cline].push(' ');
	}

	// inserts the action
	switch(action && action.type) {
	case null : break;
	case 'insert' :
		lines[action.line].splice(action.at1, 0, '<span id="insert">', action.val, '</span>');
		break;
	}


	// transforms to HTML
	for (a = 0, aZ = lines.length; a < aZ; a++) { lines[a] = lines[a].join(''); }
	element.pad.innerHTML = lines.join('\n');
}



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	for (var id in element) { element[id] = document.getElementById(id); }

	element.pad.onmousedown = onmousedown;
	element.input.onkeypress  = onkeypress;
	element.input.onkeydown   = onkeydown;
	element.input.onkeyup     = onkeyup;
	element.input.onfocus     = onfocus;
	element.input.onblur      = onblur;
	element.send.disabled     = true;
	element.send.onclick      = send;
	element.cancel.disabled   = true;
	element.cancel.onclick    = cancel;

	peer = new Peer(false);
	update();
	updatePad();
	resetBlink();
	element.input.focus();
}

})();


