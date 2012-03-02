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
var max       = Math.max;
var min       = Math.min;

/**
| Current action
*/
var action    = null;

/**
| References to the pages html elements
*/
var element = {
	pad    : null,
	input  : null,
	beep   : null,

	send   : null,
	cancel : null,

	upnow  : null,
	up     : null,
	now    : null,
	down   : null
};

var peer;
var space;
var note;
var alley;
var copse;
var time = -1;
var maxtime = -1;
var notepath = new Path(['copse', 'welcome', 'copse', '1', ]);

/**
| The current cursor position and blink state
*/
var cursor = {
	line   : 0,
	offset : 0,
	blink  : false
};
var focus     = false;

/**
| Returns true if a keyCode is known to be a "special key".
*/
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
var resetBlink = function() {
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
var onmousedown = function(event) {
	if (event.button !== 0) return;
	event.preventDefault();
	element.input.focus();
}

/**
| Down event to (hidden) input.
*/
var onkeydown = function(event) {
	if (isSpecialKey(event.keyCode)) {
		event.preventDefault();
		inputSpecialKey(event.keyCode, event.ctrlKey);
	} else {
		testinput();
	}
}

/**
| Press event to (hidden) input.
*/
var onkeypress = function(event) { setTimeout('testinput();', 0); }

/**
| Up event to (hidden) input.
*/
var onkeyup = function(event) { testinput(); }

/**
| Hidden input got focus.
*/
var onfocus = function() {
	focus = true;
	resetBlink();
	updatePad();
};

/**
| Hidden input lost focus.
*/
var onblur = function() {
	focus = false;
	resetBlink();
	updatePad();
};

/**
| Clears the current action
*/
var clearAction = function() {
	element.cancel.disabled = true;
	element.send.disabled   = true;
	action = null;
};

/**
| Sends the current action to server
*/
var send = function() {
	if (!action) { beep(); return; }

	switch(action.type) {
	case 'insert' :
		var path = new Path(notepath, '++', 'doc', 'copse', alley[action.line]);
		peer.insertText(path, action.at1, action.val);
		cursor.offset += action.val.length;
		break;
	case 'remove' :
		var path = new Path(notepath, '++', 'doc', 'copse', alley[action.line]);
		peer.removeText(path, action.at1, action.at2 - action.at1);
		if (cursor.offset >= action.at2) {
			cursor.offset -= action.at2 - action.at1;
		}
		break;
	default :
		throw new Error('invalid action.type');
	}

	clearAction();
	update(-1);
	resetBlink();
	updatePad();
	element.input.focus();
};

/**
| Cancels the current action
*/
var cancel = function() {
	clearAction();
	resetBlink();
	updatePad();
	element.input.focus();
};

/**
| Displays a beep message.
*/
var beep = function() {
	resetBlink();
	element.beep.innerHTML = 'BEEP!';
};

var startAction = function(newAction) {
	if (action) throw new Error('double action');
	action = newAction;
	element.send.disabled = false;
	element.cancel.disabled = false;
}

/**
| Aquires non-special input from (hidden) input.
*/
testinput = function() {
	var text = element.input.value;
	element.input.value = '';
	if (text === '') return;


	if (action === null) {
		startAction({
			type : 'insert',
			line : cursor.line,
			at1  : cursor.offset,
			val  : text
		});
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

	beep();
};


/**
| TODO
*/
var inputSpecialKey = function(keyCode, ctrlKey) {
	switch(keyCode) {
    case  8 : // backspace
		if (cursor.offset <= 0) { beep(); return; }
		if (!action) {
			startAction({
				type : 'remove',
				line : cursor.line,
				at1  : cursor.offset - 1,
				at2  : cursor.offset,
			});
			cursor.offset--;
			break;
		}
		if (action.type !== 'remove') { beep(); return; }
		if (cursor.offset !== action.at1) { beep(); return; }
		action.at1--;
		cursor.offset--;
		break;
	case 27 : // esc
		cancel();
		break;
    case 13 : // return
		if (ctrlKey) { send(); break; }
		break;
    case 35 : // end
		cursor.offset = copse[alley[cursor.line]].text.length;
		break;
    case 36 : // pos1
		cursor.offset = 0;
		break;
    case 37 : // left
		if (cursor.offset <= 0) { beep(); return; }
		cursor.offset--;
		break;
    case 38 : // up
		if (cursor.line <= 0) { beep(); return; }
		cursor.line--;
		break;
    case 39 : // right
		cursor.offset ++;
		break;
    case 40 : // down
		if (cursor.line >= alley.length) { beep(); return; }
		cursor.line++;
		break;
    case 46 : // del
		var text = copse[alley[cursor.line]].text;
		if (cursor.offset >= text.length) { beep(); return; }
		if (!action) {
			startAction({
				type : 'remove',
				line : cursor.line,
				at1  : cursor.offset,
				at2  : cursor.offset + 1,
			});
			cursor.offset++;
			break;
		}
		if (action.type !== 'remove') { beep(); return; }
		if (cursor.offset !== action.at2) { beep(); return; }
		action.at2++;
		cursor.offset++;
		break;
	}
	resetBlink();
	updatePad();
}

/**
| Updates data from server
*/
var update = function(totime) {
	space = peer.getSpace(totime, 'welcome');
	note = space.copse['1'];
	alley = note.doc.alley;
	copse = note.doc.copse;
	time  = peer.time;
	maxtime = max(time, maxtime);
	element.now.innerHTML = '' + time;
}

/**
| Button update-to-now has been clicked
*/
var onupnow = function() {
	update(-1);
	resetBlink();
	updatePad();
	element.input.focus();
};

/**
| Button one-up-the-timeline has been clicked.
*/
var onup = function() {
	update(min(time + 1, maxtime));
	resetBlink();
	updatePad();
	element.input.focus();
};

/**
| Button one-down-the-timeline has been clicked.
*/
var ondown = function() {
	debug('TIME', time, max(time - 1, 0));
	update(max(time - 1, 0));
	resetBlink();
	updatePad();
	element.input.focus();
};

/**
| TODO
*/
var updatePad = function() {
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
	case 'remove' :
		if (action.at1 > action.at2) throw new Error('Invalid remove action');
		lines[action.line].splice(action.at1, 0, '<span id="remove">');
		lines[action.line].splice(action.at2 + 1, 0, '</span>');
		break;
	default :
		throw new Error('Unknown action.type');
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
	element.upnow.onclick     = onupnow;
	element.up.onclick        = onup;
	element.down.onclick      = ondown;

	peer = new Peer(false);
	update(-1);
	updatePad();
	resetBlink();
	element.input.focus();
}

})();


