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
var System = function() {
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
		var key = null;
		if (ctrl) {
			switch(keyCode) {
			case 65 : key = 'a'; break;
			case 89 : key = 'y'; break;
			case 90 : key = 'z'; break;
			}
		} else {
			switch(keyCode) {
			case  8 : key = 'backspace'; break;
			case  9 : key = 'tab';       break;
			case 13 : key = 'enter';     break;
			case 33 : key = 'pageup';    break;
			case 34 : key = 'pagedown';  break;
			case 35 : key = 'end';       break;
			case 36 : key = 'pos1';      break;
			case 37 : key = 'left';      break;
			case 38 : key = 'up';        break;
			case 39 : key = 'right';     break;
			case 40 : key = 'down';      break;
			case 46 : key = 'del';       break;
			}
		}
		if (key === null) return true;
		system.shell.specialKey(key, shift, ctrl);
		return false;
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
		var shift = event.shiftKey;
		var ctrl  = event.ctrlKey || event.metaKey;

		if (!specialKey(lastSpecialKey = event.keyCode, shift, ctrl))
			{ event.preventDefault(); }
	}

	/**
	| Hidden input key press.
	*/
	function onkeypress(event) {
		var ew = event.which;
		var ek = event.keyCode;
		var shift = event.shiftKey;
		var ctrl  = event.ctrlKey || event.metaKey;

		if (((ek > 0 && ek < 32) || ew === 0) && lastSpecialKey !== ek) {
			lastSpecialKey = -1;
			return specialKey(ek, shift, ctrl);
		}
		lastSpecialKey = -1;
		testinput();
		system.setTimer(0, system.ontestinput);
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
		var shift = event.shiftKey;
		var ctrl  = event.ctrlKey || event.metaKey;
		var cursor = null;

		switch(mouseState) {
		case false:
			cursor = system.shell.mousehover(p, shift, ctrl);
			break;
		case 'atween':
			var dragbox = settings.dragbox;
			if ((abs(p.x - atweenPos.x) > dragbox) || (abs(p.y - atweenPos.y) > dragbox)) {
				// moved out of dragbox -> start dragging
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mouseState = 'drag';
				system.shell.dragstart(atweenPos, shift, ctrl);
				cursor = system.shell.dragmove(p, shift, ctrl);
				captureEvents();
			} else {
				// saves position for possible atween timeout
				atweenMove  = p;
				atweenShift = shift;
				atweenCtrl  = ctrl;
			}
			break;
		case 'drag':
			cursor = system.shell.dragmove(p, shift, ctrl);
			break;
		default :
			throw new Error('invalid mouseState');
		}

		if (cursor !== null) { canvas.style.cursor = cursor; }

		return true;
	}

	/**
	| Mouse down event.
	*/
	function onmousedown(event) {
		if (event.button !== 0) return;
		event.preventDefault();  // @@ maybe preventDefault before button test?
		hiddenInput.focus();
		system.setTimer(0, function() { hiddenInput.selectionStart = 0; });

		var p = new Point (event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		var shift = event.shiftKey;
		var ctrl  = event.ctrlKey || event.metaKey;

		// asks the shell if it forces this to be a drag or click, or yet unknown.
		mouseState = system.shell.mousedown(p, shift, ctrl);
		switch(mouseState) {
		case 'atween' :
			atweenPos   = atweenMove = p;
			atweenShift = shift;
			atweenCtrl  = ctrl;
			atweenTimer = system.setTimer(settings.dragtime, system.onatweentime);
			break;
		case 'drag' :
			captureEvents();
			break;
		}

		var cursor = system.shell.mousehover(p, shift, ctrl);
		if (cursor !== null) { canvas.style.cursor = cursor; }

		return false;
	}

	/**
	| Mouse up event.
	*/
	function onmouseup(event) {
		event.preventDefault();
		releaseEvents();

		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		var shift  = event.shiftKey;
		var ctrl   = event.ctrlKey || event.metaKey;
		var cursor = null;

		switch (mouseState) {
		case false :
			break;
		case 'atween' :
			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout(atweenTimer);
			atweenTimer = null;
			system.shell.click(p, shift, ctrl);
			cursor = system.shell.mousehover(p, shift, ctrl);
			mouseState = false;
			break;
		case 'drag' :
			system.shell.dragstop(p, shift, ctrl);
			cursor = system.shell.mousehover(p, shift, ctrl);
			mouseState = false;
			break;
		default :
			throw new Error('invalid mouseState');
		}
		
		if (cursor !== null) { canvas.style.cursor = cursor; }
		
		return false;
	}

	/**
	| Mouse down event.
	*/
	function onmousewheel(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		var dir   = (event.wheelDelta || event.detail) > 0 ? 1 : -1;
		var shift = event.shiftKey;
		var ctrl  = event.ctrlKey || event.metaKey;

		system.shell.mousewheel(p, dir, shift, ctrl);
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

		var cursor = null;
		system.shell.dragstart(atweenPos, atweenShift, atweenCtrl);
		cursor = system.shell.dragmove(atweenMove, atweenShift, atweenCtrl);

		if (cursor !== null) { canvas.style.cursor = cursor; }
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

	//-------------------------------------
	//-- Interface for the System object --
	//-------------------------------------

	/**
	| Sets a time through the error catcher
	*/
	system.setTimer = function(time, callback) {
		return window.setTimeout(makeCatcher(callback), time);
	};
	
	/**
	| Cancels a timer
	*/
	system.cancelTimer = function(id) {
		return window.clearTimeout(id);
	};

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
		// double uses the blink timer
		testinput();

		if (blinkTimer) {
			clearInterval(blinkTimer);
			blinkTimer = null;
		}
		blinkTimer = setInterval(system.onblink, settings.caretBlinkSpeed);
	};

	system.restartBlinker();
};

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
		system.shell = new Shell(system.fabric);
		system.shell.onload();
	})();
};

})();


