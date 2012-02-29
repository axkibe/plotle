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

/**
| Export/Capsule
*/
(function(){
'use strict';

if (typeof(window) === 'undefined') throw new Error('testpad needs a browser!');

var debug     = Jools.debug;
var fixate    = Jools.fixate;
var log       = Jools.log;
var subclass  = Jools.subclass;
var action    = null;

var peer;
var space;
var note;
var pad;
var input;
var cursor = {
	line   : 0,
	offset : 0
};

function isSpecialKey(keyCode) {
    switch(keyCode) {
    case  8 : // backspace
    case 13 : // return
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

function onmousedown(event) {
	if (event.button !== 0) return;
	event.preventDefault();
	input.focus();
}

/**
| Down event to (hidden) input.
*/
function onkeydown(event) {
	if (isSpecialKey(event.keyCode)) {
		event.preventDefault();
		inputSpecialKey(event.keyCode);
		updatePad();
	} else {
		testinput();
	}
}

/**
| Press event to (hidden) input.
*/
function onkeypress(event) {
	testinput();
	setTimeout('testinput();', 0);
}

/**
| Up event to (hidden) input.
*/
function onkeyup(event) {
	testinput();
}

/**
| Aquires non-special input from (hidden) input.
*/
testinput = function() {
	var text = input.value;
	input.value = '';
	if (text === '') return;

	if (action === null) {
		action = {
			type : 'insert',
			line : cursor.line,
			at1  : cursor. offset
		}
		return;
	}

	console.log('another input active');
};


/**
| TODO
*/
function inputSpecialKey(keyCode) {
	switch(keyCode) {
    case  8 : // backspace
		break;
    case 13 : // return
		break;
    case 35 : // end
		cursor.offset = note.doc.copse[note.doc.alley[cursor.line]].text.length;
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
		if (cursor.line >= note.doc.alley.length) break;
		cursor.line++;
		break;
    case 46 : // del
		break;
	}

}

/**
| TODO
*/
function updatePad() {
	var lines = [];
	var alley = note.doc.alley;
	var copse = note.doc.copse;
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

	// inserts the action
	switch(action && action.type) {
	case null : break;
	case 'insert'

	}

	// inserts the cursor
	var cline = cursor.line;
	if (cline < 0) cline = cursor.line = 0;
	if (cline > alley.length - 1) cline = cursor.line = alley.length - 1;
	var ctext = lines[cline];
	var coff  = cursor.offset;
	var clen  = lines[cline].length;
	if (coff > ctext.length) coff = cursor.offset = ctext.length;
	lines[cline].splice(coff, 0, '<span id="cursor">');
	if (coff === clen) lines[cline].push(' ');
	lines[cline].splice(coff + 2, 0, '</span>');

	// transforms to HTML
	for (a = 0, aZ = lines.length; a < aZ; a++) { lines[a] = lines[a].join(''); }
	pad.innerHTML = lines.join('\n');
}



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	pad = document.getElementById('pad');
	input = document.getElementById('input');

	pad.onmousedown = onmousedown;
	input.onkeypress  = onkeypress;
	input.onkeydown   = onkeydown;
	input.onkeyup     = onkeyup;

	peer = new Peer(false);
	space = peer.getSpace('welcome');
	note = space.copse['1'];
	if (!note) throw new Error('No Note with default ID "1"');
	updatePad();
}

})();


