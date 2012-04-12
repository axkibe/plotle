/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                    ,-,---.                           
                                     '|___/ ,-. ,-. . , , ,-. ,-. ,-. 
                                     ,|   \ |   | | |/|/  `-. |-' |
                                    `-^---' '   `-' ' '   `-' `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 This is a wrapper around HTML5 browsers, creating a more comfortable interface for a pure
 graphical systems like the meshcraft shell.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Fabric;
var Peer;
var Shell;
var config;
var settings;

/**
| Export
*/
var system;

/**
| Export/Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('browser.js needs a browser!'); }

var abs       = Math.abs;
var Point     = Fabric.Point;
var debug     = Jools.debug;
var fixate    = Jools.fixate;
var log       = Jools.log;
var subclass  = Jools.subclass;

/**
| Catches all errors a function throws if enabledCatcher is set.
*/
function makeCatcher(fun) {
	return function() {
		if (!config.devel) {
			try {
				fun.apply(null, arguments);
			} catch(err) {
				window.alert(
					'Internal failure, '+err.name+': '+err.message+'\n\n' +
					'file: '+err.fileName+'\n'+
					'line: '+err.lineNumber+'\n'+
					'stack: '+err.stack);
			}
		} else {
			fun.apply(null, arguments);
		}
	};
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .  .
 \___  ,-. |- |- . ,-. ,-. ,-.
     \ |-' |  |  | | | | | `-.
 `---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
 Default behavior settings.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
settings = {
	// pixels to scroll for a wheel event
	textWheelSpeed : 12 * 5,

	// Blink speed of the caret.
	caretBlinkSpeed : 530,

	// milliseconds after mouse down, dragging starts
	dragtime : 400,

	// pixels after mouse down and move, dragging starts
	dragbox  : 10
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.         .
 \___  . . ,-. |- ,-. ,-,-.
     \ | | `-. |  |-' | | |
 `---' `-| `-' `' `-' ' ' '
~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       `-'
 Meshcraft Wrapper around the HTML5 browser.

 @@ use more prototyping.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function System() {
	if (system) throw new Error('System not a singleton');
	system = this;
	var canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	system.fabric = new Fabric(canvas);

	// if true browser supports the setCapture() call
	// if false needs work around
	var useCapture = !!canvas.setCapture;
	var mouseState  = false;   // false, 'atween' or 'drag'

	// atween is the state where the mouse button went down,
	// and its yet unsure if this is a click or drag.
	// if the mouse moves out of the atweenBox or the atweenTimer ticks its
	// a drag, if it goes up before either happens, its a click

	var atweenTimer = null;    // timer for atween state
	var atweenPos   = null;    // position mouse button went down
	var atweenMove  = null;    // latest mouse position seen in atween state
	var atweenShift = null;    // shift key in atween state
	var atweenCtrl  = null;    // ctrl  key in atween state

	// hidden input that forwards all events
	var hiddenInput = document.getElementById('input');

	// remembers last SpecialKey pressed, to hinder double events.
	// Opera is behaving stupid here.
	var lastSpecialKey = -1;

	/**
	| A special key was pressed.
	*/
	function specialKey(keyCode, shift, ctrl) {
		if (ctrl) {
			switch(keyCode) {
			case 65 : // ctrl+a
				system.shell.specialKey(keyCode, shift, ctrl);
				return false;
			default :
				return true;
			}
		}
		switch(keyCode) {
		case  8 : // backspace
		case 13 : // return
		case 33 : // pageup
		case 34 : // pagedown
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
		case 46 : // del
			system.shell.specialKey(keyCode, shift, ctrl);
			return false;
		default :
			return true;
		}
	}

	/**
	| Captures all mouseevents event beyond the canvas (for dragging).
	*/
	function captureEvents() {
		if (useCapture) {
			canvas.setCapture(canvas);
		} else {
			document.onmouseup   = canvas.onmouseup;
			document.onmousemove = canvas.onmousemove;
		}
	}

	/**
	| Stops capturing all mouseevents
	*/
	function releaseEvents() {
		if (useCapture) {
			document.releaseCapture(canvas);
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	/**
	| The value that is expected to be in input.
	| either nothing or the text selection.
	| if it changes the user did something.
	*/
	var inputval = '';

	//---------------------------------
	//-- Functions the browser calls --
	//---------------------------------

	// tests if the hidden input field got data
	function testinput() {
		var text = hiddenInput.value;
		if (text == inputval) { return; }
		hiddenInput.value = inputval = '';
		system.shell.input(text);
	}

	/**
	| does a blink.
	*/
	function blink() {
		// hackish, also look into the hidden input field,
		// maybe the user pasted something using the browser menu.
		testinput();
		system.shell.blink();
	}

	/**
	| Key down in hidden input field.
	*/
	function onkeydown(event) {
		if (!specialKey(
			lastSpecialKey = event.keyCode, event.shiftKey, event.ctrlKey || event.metaKey
		)) event.preventDefault();
	}

	/**
	| Hidden input key press.
	*/
	function onkeypress(event) {
		var ew = event.which;
		var ek = event.keyCode;
		if (((ek > 0 && ek < 32) || ew === 0) && lastSpecialKey !== ek) {
			lastSpecialKey = -1;
			return specialKey(ek, event.shiftKey, event.ctrlKey || event.metaKey);
		}
		lastSpecialKey = -1;
		testinput();
		setTimeout(system.ontestinput, 0);
		return true;
	}

	/**
	| Hidden input key up.
	*/
	function onkeyup(event) {
		testinput();
		return true;
	}

	/**
	| Hidden input lost focus.
	*/
	function onblur(event) {
		system.shell.systemBlur();
	}

	/**
	| Hidden input got focus.
	*/
	function onfocus(event) {
		system.shell.systemFocus();
	}

	/**
	| View window resized.
	*/
	function onresize(event) {
		canvas.width  = window.innerWidth - 1;
		canvas.height = window.innerHeight - 1;
		system.shell.resize(canvas.width, canvas.height);
	}

	/**
	| Mouse move event.
	*/
	function onmousemove(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch(mouseState) {
		case false:
			system.shell.mousehover(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		case 'atween':
			var dragbox = settings.dragbox;
			if ((abs(p.x - atweenPos.x) > dragbox) || (abs(p.y - atweenPos.y) > dragbox)) {
				// moved out of dragbox -> start dragging
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mouseState = 'drag';
				system.shell.dragstart(atweenPos, event.shiftKey, event.ctrlKey || event.metaKey);
				if (!p.eq(atweenPos)) {
					system.shell.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
				}
				captureEvents();
			} else {
				// saves position for possible atween timeout
				atweenMove  = p;
				atweenShift = event.shiftKey;
				atweenCtrl  = event.ctrlKey || event.metaKey;
			}
			return true;
		case 'drag':
			system.shell.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error('invalid mouseState');
		}
	}

	/**
	| Mouse down event.
	*/
	function onmousedown(event) {
		if (event.button !== 0) return;
		event.preventDefault();  // TODO maybe preventDefault before button test?
		hiddenInput.focus();
		setTimeout(function() { hiddenInput.selectionStart = 0; }, 0);
		var p = new Point (event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		// asks the face if it forces this to be a drag or click, or yet unknown.
		mouseState = system.shell.mousedown(p, event.shiftKey, event.ctrlKey || event.metaKey);
		switch(mouseState) {
		case 'atween' :
			atweenPos   = atweenMove = p;
			atweenShift = event.shiftKey;
			atweenCtrl  = event.ctrlKey || event.metaKey;
			atweenTimer = setTimeout(system.onatweentime, settings.dragtime);
			break;
		case 'drag' :
			captureEvents();
			break;
		}
		return false;
	}

	/**
	| Mouse up event.
	*/
	function onmouseup(event) {
		event.preventDefault();
		
		releaseEvents();
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch (mouseState) {
		case false : return false;
		case 'atween' :
			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout(atweenTimer);
			atweenTimer = null;
			system.shell.click(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return (mouseState = false);
		case 'drag' :
			system.shell.dragstop(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return (mouseState = false);
		default :
			throw new Error('invalid mouseState');
		}
	}

	/**
	| Mouse down event.
	*/
	function onmousewheel(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		var dir = (event.wheelDelta || event.detail) > 0 ? 1 : -1;
		system.shell.mousewheel(p, dir, event.shiftKey, event.ctrlKey);
	}

	/**
	| Timeout after mouse down so dragging starts.
	*/
	function onatweentime() {
		if (mouseState !== 'atween') {
			console.log('dragTime() in wrong action mode');
			return;
		}
		mouseState = 'drag';
		atweenTimer = null;
		system.shell.dragstart(atweenPos, atweenShift, atweenCtrl);
		if (!atweenMove.eq(atweenPos)) {
			system.shell.dragmove(atweenMove, atweenShift, atweenCtrl);
		}
	}

	canvas.onmouseup       = makeCatcher(onmouseup);
	canvas.onmousemove     = makeCatcher(onmousemove);
	canvas.onmousedown     = makeCatcher(onmousedown);
	canvas.onmousewheel    = makeCatcher(onmousewheel);
	canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false); // Firefox.
	window.onresize        = makeCatcher(onresize);
	hiddenInput.onfocus    = makeCatcher(onfocus);
	hiddenInput.onblur     = makeCatcher(onblur);
	hiddenInput.onkeydown  = makeCatcher(onkeydown);
	hiddenInput.onkeypress = makeCatcher(onkeypress);
	hiddenInput.onkeyup    = makeCatcher(onkeyup);
	system.ontestinput     = makeCatcher(testinput);
	system.onatweentime    = makeCatcher(onatweentime);
	system.onblink         = makeCatcher(blink);
	document.oncontextmenu = function(e) { e.stopPropagation(); return false; };

	/**
	| Sets the mouse cursor
	*/
	system.setCursor = function(cursor) {
		canvas.style.cursor = cursor;
	};

	//-------------------------------------
	//-- Interface for the System object --
	//-------------------------------------

	/**
	| Sets the input (text selection).
	*/
	system.setInput = function(text) {
		hiddenInput.value = inputval = text;
		if (text !== '') {
			hiddenInput.selectionStart = 0;
			hiddenInput.selectionEnd = text.length;
		}
	};

	// the blink (and check input) timer
	var blinkTimer = null;

	/**
	| (re)starts the blink timer
	*/
	system.restartBlinker = function() {
		if (blinkTimer) clearInterval(blinkTimer);
		testinput();
		blinkTimer = setInterval(system.onblink, settings.caretBlinkSpeed);
	};

	system.restartBlinker();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	makeCatcher(function() {
		new System();
		var peer     = new Peer('async');
		//var peer     = new Peer('emulate');
		system.shell = new Shell(system.fabric, peer);
	})();
};

})();


