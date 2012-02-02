/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´

                    ,-,---.                           .---.         .
                     '|___/ ,-. ,-. . , , ,-. ,-. ,-. \___  . . ,-. |- ,-. ,-,-.
                     ,|   \ |   | | |/|/  `-. |-' |  --   \ | | `-. |  |-' | | |
                    `-^---' '   `-' ' '   `-' `-' '   `---' `-| `-' `' `-' ' ' '
                                                             /|
                                                            `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.

 This is a wrapper around the HTML5 browsers. It makes a more comfortable interface for a pure
 graphic system like the meshcraft shell.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Fabric;
var FrontFace;
var MeshPeer;

/**
| Export
*/
var system;
var meshpeer;

/**
| Export/Capsule
*/
(function(){

'use strict';

if (typeof(window) === 'undefined') {
	throw new Error('Browser-System needs a browser!');
}

var debug     = Jools.debug;
var fixate    = Jools.fixate;
var log       = Jools.log;
var subclass  = Jools.subclass;

/**
| Catches all errors a function throws if enabledCatcher is set.
*/
function makeCatcher(that, fun) {
	return function() {
		'use strict';
		if (!config.devel) {
			try {
				fun.apply(that, arguments);
			} catch(err) {
				alert('Internal failure, '+err.name+': '+err.message+'\n\n' +
				      'file: '+err.fileName+'\n'+
					  'line: '+err.lineNumber+'\n'+
					  'stack: '+err.stack);
			}
		} else {
			fun.apply(that, arguments);
		}
	};
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.         .
 \___  . . ,-. |- ,-. ,-,-.
     \ | | `-. |  |-' | | |
 `---' `-| `-' `' `-' ' ' '
~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       `-'
 The wrapper around the HTML5 browser.

 TODO use more prototyping.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function System(FrontFace) {
	var canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	this.fabric = new Fabric(canvas);

	// if true browser supports the setCapture() call
	// if false needs work around
	var useCapture = canvas.setCapture != null;

	// mouse state  TODO rename variables
	var mst = MST.NONE;
	// position the mouse went down to atween state
	var msp = null;
	// latest mouse position seen in atween state
	var mmp = null;
	// latest shift/ctrl key status in atween state
	var mms = null;
	var mmc = null;
	// timer for atween state
	var atweenTimer = null;

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
				this.shell.specialKey(keyCode, shift, ctrl);
				return false;
			default :
				return true;
			}
		}
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
			this.shell.specialKey(keyCode, shift, ctrl);
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
			canvas.releaseCapture(canvas);
		} else {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	// the value that is expected to be in input.
	// either nothing or the text selection.
	// if it changes the user did something.

	var inputval = '';

	//---------------------------------
	//-- Functions the browser calls --
	//---------------------------------

	// tests if the hidden input field got data
	function testinput() {
		var text = hiddenInput.value;
		if (text == inputval) {
			return;
		}
		hiddenInput.value = inputval = '';
		this.shell.input(text);
	}

	/**
	| does a blink.
	*/
	function blink() {
		// hackish, also look into the hidden input field,
		// maybe the user pasted something using the browser menu.
		testinput.call(this);
		this.shell.blink();
	}

	/**
	| Key down in hidden input field.
	*/
	function onkeydown(event) {
		if (!specialKey.call(this,
			lastSpecialKey = event.keyCode, event.shiftKey, event.ctrlKey || event.metaKey
		)) event.preventDefault();
	}

	/**
	| Hidden input key press.
	*/
	function onkeypress(event) {
		var ew = event.which;
		var ek = event.keyCode;
		if (((ek > 0 && ek < 32) || ew == 0) && lastSpecialKey != ek) {
			lastSpecialKey = -1;
			return specialKey.call(this, ek, event.shiftKey, event.ctrlKey || event.metaKey);
		}
		lastSpecialKey = -1;
		testinput.call(this);
		setTimeout('system.ontestinput();', 0);
		return true;
	}

	/**
	| Hidden input key up.
	*/
	function onkeyup(event) {
		testinput.call(this);
		return true;
	}

	/**
	| Hidden input lost focus.
	*/
	function onblur(event) {
		this.shell.systemBlur();
	}

	/**
	| Hidden input got focus.
	*/
	function onfocus(event) {
		this.shell.systemFocus();
	}

	/**
	| View window resized.
	*/
	function onresize(event) {
		canvas.width  = window.innerWidth - 1;
		canvas.height = window.innerHeight - 1;
		this.shell.resize(canvas.width, canvas.height);
	}

	/**
	| Mouse move event.
	*/
	function onmousemove(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch(mst) {
		case MST.NONE :
			this.shell.mousehover(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		case MST.ATWEEN :
			var dragbox = settings.dragbox;
			if ((abs(p.x - msp.x) > dragbox) || (abs(p.y - msp.y) > dragbox)) {
				// moved out of dragbox -> start dragging
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mst = MST.DRAG;
				this.shell.dragstart(msp, event.shiftKey, event.ctrlKey || event.metaKey);
				if (!p.eq(msp)) {
					this.shell.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
				}
				captureEvents();
			} else {
				// saves position for possible atween timeout
				mmp = p;
				mms = event.shiftKey;
				mmc = event.ctrlKey || event.metaKey;
			}
			return true;
		case MST.DRAG :
			this.shell.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error('invalid mst');
		}
	}

	/**
	| Mouse down event.
	*/
	function onmousedown(event) {
		if (event.button !== 0) return;
		event.preventDefault();
		hiddenInput.focus();
		var p = new Point (event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		// asks the face if it forces this to be a drag or click, or yet unknown.
		mst = this.shell.mousedown(p, event.shiftKey, event.ctrlKey || event.metaKey);
		switch(mst) {
		case MST.ATWEEN :
			msp = mmp = p;
			mms = event.shiftKey;
			mmc = event.ctrlKey || event.metaKey;
			atweenTimer = setTimeout('system.onatweentime();', settings.dragtime);
			break;
		case MST.DRAG :
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

		switch (mst) {
		case MST.NONE :
			return false;
		case MST.ATWEEN :
			// A click is a mouse down followed within dragtime by 'mouseup' and
			// not having moved out of 'dragbox'.
			clearTimeout(atweenTimer);
			atweenTimer = null;
			this.shell.click(p, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		case MST.DRAG :
			this.shell.dragstop(p, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		}
	}

	/**
	| Mouse down event.
	*/
	function onmousewheel(event) {
		var wheel = event.wheelDelta || event.detail;
		wheel = wheel > 0 ? 1 : -1;
		this.shell.mousewheel(wheel);
	}

	/**
	| Timeout after mouse down so dragging starts.
	*/
	function onatweentime() {
		if (mst != MST.ATWEEN) {
			console.log('dragTime() in wrong action mode');
			return;
		}
		mst = MST.DRAG;
		atweenTimer = null;
		this.shell.dragstart(msp, mms, mmc);
		if (!mmp.eq(msp)) {
			this.shell.dragmove(mmp, mms, mmc);
		}
	}

	canvas.onmouseup       = makeCatcher(this, onmouseup);
	canvas.onmousemove     = makeCatcher(this, onmousemove);
	canvas.onmousedown     = makeCatcher(this, onmousedown);
	canvas.onmousewheel    = makeCatcher(this, onmousewheel);
	canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false); // Firefox.
	window.onresize        = makeCatcher(this, onresize);
	hiddenInput.onfocus    = makeCatcher(this, onfocus);
	hiddenInput.onblur     = makeCatcher(this, onblur);
	hiddenInput.onkeydown  = makeCatcher(this, onkeydown);
	hiddenInput.onkeypress = makeCatcher(this, onkeypress);
	hiddenInput.onkeyup    = makeCatcher(this, onkeyup);
	this.ontestinput       = makeCatcher(this, testinput);
	this.onatweentime      = makeCatcher(this, onatweentime);
	this.onblink           = makeCatcher(this, blink);
	document.oncontextmenu   = function(e) { e.stopPropagation(); return false; };

	/**
	| Sets the mouse cursor
	*/
	this.setCursor = function(cursor) {
		canvas.style.cursor = cursor;
	}

	//-------------------------------------
	//-- Interface for the System object --
	//-------------------------------------

	/**
	| Sets the input (text selection).
	*/
	this.setInput = function(text) {
		hiddenInput.value = inputval = text;
		if (text != '') {
			hiddenInput.selectionStart = 0;
			hiddenInput.selectionEnd = text.length;
		}
	}

	// the blink (and check input) timer
	var blinkTimer = null;

	/**
	| (re)starts the blink timer
	*/
	this.restartBlinker = function() {
		if (blinkTimer) clearInterval(blinkTimer);
		testinput();
		blinkTimer = setInterval('system.onblink()', settings.caretBlinkSpeed);
	}

	this.restartBlinker();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	makeCatcher(this, function() {
		system       = new System();
		system.shell = new Shell(system.fabric);
		meshpeer     = new MeshPeer();
		system.shell._draw(); // TODO private 
	})();
}

})();


