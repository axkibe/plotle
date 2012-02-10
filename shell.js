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

                                        .---. .       .  .
                                        \___  |-. ,-. |  |
                                            \ | | |-' |  |
                                        `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.
 This is the client-side script for the user interface.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

 A variable with $ in its name signifies something cached.
 @03 are milestones for release 0.3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

'use strict';
var peer;
var shell = null;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .           .          .
 \___  |-. ,-. ,-. |- ,-. . . |- ,-.
     \ | | | | |   |  |   | | |  `-.
 `---' ' ' `-' '   `' `-' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var debug     = Jools.debug;
var fixate    = Jools.fixate;
var log       = Jools.log;
var subclass  = Jools.subclass;
var Path      = Jools.Path;
var Signature = Jools.Signature;

var cos30         = Fabric.cos30;
var half          = Fabric.half;
var tan30         = Fabric.tan30;
var Hexagon       = Fabric.Hexagon;
var HexagonFlower = Fabric.HexagonFlower;
var HexagonSlice  = Fabric.HexagonSlice;
var Line          = Fabric.Line;
var Margin        = Fabric.Margin;
var Measure       = Fabric.Measure;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;
var opposite      = Fabric.opposite;

// configures meshcraft-woods.
Woods.cogging = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .  .
 \___  ,-. |- |- . ,-. ,-. ,-.
     \ |-' |  |  | | | | | `-.
 `---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


var settings = {
	// standard font
	//defaultFont : 'Zapfino, Verdana,Geneva,Kalimati,sans-serif',
	defaultFont : 'Verdana,Geneva,Kalimati,sans-serif',

	// milliseconds after mouse down, dragging starts
	dragtime : 400,

	// pixels after mouse down and move, dragging starts
	dragbox  : 10,

	// factor to add to the bottom of font height
	bottombox : 0.25,

	// standard note in space
	note : {
		minWidth  :  40,
		minHeight :  40,
		newWidth  : 300,
		newHeight : 150,

		// inner margin to text
		imargin  : { n: 4, e: 5, s: 4, w: 5 },

		style : {
			fill : {
				gradient : 'askew',
				steps : [
					[0, 'rgba(255, 255, 248, 0.955)'],
				    [1, 'rgba(255, 255, 160, 0.955)'],
				],
			},
			edge : [
				{ border: 1, width : 1, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'black' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		cornerRadius : 6,
	},

	label : {
		minHeight :  20,

		style : {
			edge : [
				//{ border: 0, width: 0.2, color: 'rgba(200, 100, 0, 0.5)' },
				{ border: 0, width: 1, color: 'rgba(100, 100, 0, 0.5)' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },
	},

	// menu at the bottom of cockpit
	/*
	edgemenu : {
		style : {
			fill : {
				gradient : 'horizontal',
				steps : [
					[ 0, 'rgba(255, 255, 200, 0.90)' ],
					[ 1, 'rgba(255, 255, 160, 0.90)' ],
				],
			},
			edge : [
				{ border: 1, width :   2, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.5, color : 'black' },
			],
			select : {
				gradient : 'horizontal',
				steps : [
					[0, 'rgb(255, 237, 210)' ],
					[1, 'rgb(255, 185, 81)'  ],
				],
			},
		},
	},*/


	// float menu
	floatmenu : {
		outerRadius : 75,
		innerRadius : 30,
		style : {
			edge : [
				{ border: 1, width :   2, color : 'rgb(255, 200, 105)' },
				{ border: 0, width : 0.5, color : 'black' },
			],
			fill : {
				gradient : 'radial',
				steps : [
					[ 0, 'rgba(255, 255, 168, 0.955)' ],
					[ 1, 'rgba(255, 255, 243, 0.955)' ],
				],
			},
			select : {
				gradient : 'radial',
				steps : [
					[0, 'rgb(255, 185, 81)'  ],
					[1, 'rgb(255, 237, 210)' ],
				],
			},
		},
	},

	// item menu
	itemmenu : {
		outerRadius : 75,
		innerRadius : 30,
		slice : {
			height : 17,
			style : {
				fill : {
					gradient : 'horizontal',
					steps : [
						[ 0, 'rgba(255, 255, 200, 0.9)' ],
						[ 1, 'rgba(255, 255, 205, 0.9)' ],
					],
				},
				edge : [
					{ border: 1, width :   1, color : 'rgb(255, 200, 105)' },
					{ border: 0, width : 0.7, color : 'black' },
				],
			},
		},
	},

	// selection
	selection : {
		style : {
			fill   : 'rgba(243, 203, 255, 0.9)',
			edge : [
				//{ border : 0, width : 1, color: 'rgb(254,183,253)' },
				{ border : 0, width : 1, color: 'black' },
			],
		}
	},

	// scrollbar
	scrollbar : {
		style : {
			fill : 'rgb(255, 188, 87)',
			edge : [
				{ border : 0, width : 1, color: 'rgb(221, 154, 52)' },
			],
		},
		strength :  8,
		minSize  : 12,
		imarginw :  2,
	},

	// size of resize handles
	handle : {
		size      : 10,
		distance  : 0,

		style : {
			edge : [
				{ border: 0, width: 3, color: 'rgb(125,120,32)' },
				{ border: 0, width: 1, color: 'rgb(255,180,90)' },
			],
		},
	},

	relation : {
		style : {
			fill : 'rgba(255, 225, 40, 0.5)',
			edge : [
				{ border: 0, width : 3, color : 'rgba(255, 225, 80, 0.4)' },
				{ border: 0, width : 1, color : 'rgba(200, 100, 0,  0.8)' },
			],
			labeledge : [
				{ border: 0, width : 0.2, color : 'rgba(200, 100, 0, 0.5)' },
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' },
			],
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// scale down relation text
		demagnify : 1.2,
	},

	// Blink speed of the caret.
	caretBlinkSpeed : 530,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.
  `\__  ,-. . . ,-,-. ,-.
   /    | | | | | | | `-.
  '`--' ' ' `-^ ' ' ' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Mouse state. TODO Rename to something more verbatim
*/
var MST = {
	NONE   : 0, // button is up
	ATWEEN : 1, // mouse just came down, unsure if click or drag
	DRAG   : 2  // mouse is dragging
};
Object.freeze(MST);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-,-,-.           .
 `,| | |   ,-. ,-. | , ,-. ,-.
   | ; | . ,-| |   |<  |-' |
   '   `-' `-^ '   ' ` `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Marks a position in an element of an item.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Marker() {
	this.entity = null;
	this.offset = 0;
	this.op$line = null;
	this.op$token = null;
}

/**
| Sets the marker.
*/
Marker.prototype.set = function(entity, offset, retainX) {
	if (entity !== this.entity) {
		if (this.entity) this.entity.para.removeListener(this);
		if (entity) entity.para.addListener(this);
	}
	this.entity = entity;
	this.offset = offset;
	this.retain$x = typeof(retainX) !== 'undefined' ? retainX : null;
}

/**
| The meshmashine issued an event.
*/
Marker.prototype.event = function(type, key, p1, p2, p3) {
	log('event', 'marker', type, key, p1, p2, p3);
	switch(type) {
	case 'insert' :
		var offset = p1;
		var val = p2;
		if (offset <= this.offset) {
			this.offset += val.length;
		}
		break;
	case 'remove' :
		var at1 = p1;
		var at2 = p2;
		if (at2 <= this.offset) {
			if (at1 <= this.offset) {
				this.offset -= at2 - at1;
			} else {
				this.offset = at1;
			}
		}
		break;
	case 'join<' :
		var pivot = p1;
		var at1 = p2;
		var vnode = this.entity.vdoc.valley[pivot];
		this.set(vnode, this.offset + at1);
		break;
	case 'split' :
		var offset = p1;
		if (offset <= this.offset) {
			var pkey = this.entity.para.getOwnKey();
			this.set(this.entity.vdoc.valley[pkey + 1], this.offset - offset);
		}
		break;
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.             .
 | `-' ,-. ,-. ,-. |-
 |   . ,-| |   |-' |
 `--'  `-^ '   `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The Caret.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Caret() {
	Marker.call(this);

	// true if visible
	this.shown = false;

	// true when just blinked away
	this.blinked = false;
}
subclass(Caret, Marker);


/**
| If true uses getImageData() to cache the image without the caret to achieve blinking.
| Without it uses drawImage() for the whole canvas. On firefox this is paradoxically way
| faster.
*/
Caret.useGetImageData = true;

/**
| Shows the caret or resets the blink timer if already shown
*/
Caret.prototype.show = function() {
	this.shown = true;
	this.blinked = false;
	system.restartBlinker();
}

/**
| Hides the caret.
*/
Caret.prototype.hide = function() {
	this.shown = false;
}

/**
| Draws or erases the caret.
*/
Caret.prototype.update = function() {
	var fabric = shell.fabric;

	// erases the old caret
	if (shell.caret.save$) {
		if (Caret.useGetImageData) {
			shell.fabric.putImageData(shell.caret.save$, shell.caret.screenPos$);
		} else {
			shell.fabric.drawImage(shell.caret.save$, 0, 0);
		}
		shell.caret.save$ = shell.caret.screenPos$ = null;
	}

	// draws new
	if (this.shown && !this.blinked && this.entity) this.entity.drawCaret();
}

/**
| Switches caret visibility state.
*/
Caret.prototype.blink = function() {
	if (this.shown) {
		this.blinked = !this.blinked;
		this.update();
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .          .
 \___  ,-. |  ,-. ,-. |- . ,-. ,-.
     \ |-' |  |-' |   |  | | | | |
 `---' `-' `' `-' `-' `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Text Selection.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Selection() {
	this.active = false;
	this.mark1 = new Marker();
	this.mark2 = new Marker();
	this.begin = null;
	this.end   = null;
}

/**
| Sets begin/end so begin is before end.
*/
Selection.prototype.normalize = function() {
	var e1 = this.mark1.element;
	var e2 = this.mark2.element;

	if (e1 === e2) {
		if (this.mark1.offset <= this.mark2.offset) {
			this.begin = this.mark1;
			this.end   = this.mark2;
		} else {
			this.begin = this.mark2;
			this.end   = this.mark1;
		}
		return;
	}

	var pn;
	for (pn = e1.parent.next; pn && pn.first != e2; pn = pn.next);

	if (!pn) {
		this.end   = this.mark1;
		this.begin = this.mark2;
	} else {
		this.begin = this.mark1;
		this.end   = this.mark2;
	}
}

/**
| The text the selection selects.
*/
Selection.prototype.innerText = function() {
	if (!this.active) return '';
	this.normalize();
	var be = this.begin.element;
	var bo = this.begin.offset;
	var ee = this.end.element;
	var eo = this.end.offset;
	var bet = be.text;
	if (be == ee) {
		return bet.substring(bo, eo);
	}

	var buf = [bet.substring(bo, bet.length)];
	for (var n = be.parent.next.first; n != ee; n = n.parent.next.first) {
		// ^ TODO make multi child compatible
		if (!n) { throw new Error('selection akward');}
		buf.push('\n');
		buf.push(n.text);
	}
	buf.push('\n');
	buf.push(ee.text.substring(0, eo));
	return buf.join('');
}

/**
| Removes the selection including its contents.
| TODO was deleteSelection.
*/
Selection.prototype.remove = function() {
	throw new Error('TODO');
	/*
	var select = this.selection;
	select.normalize();
	var b = select.begin;
	var e = select.end;
	var be = b.element;
	var bo = b.offset;
	var ee = e.element;
	var eo = e.offset;
	if (be == ee) {
		var bet = be.text;
		be.text = bet.substring(0, bo) + bet.substring(eo, bet.length);
	} else {
		var eet = ee.text;
		be.text = be.text.substring(0, bo) + eet.substring(eo, eet.length);
		var pn;
		for (pn = be.parent.next; pn.first != ee; pn = pn.next) {
			// ^ TODO make multi child compatible
			pn.parent.remove(pn);
		}
		pn.parent.remove(pn);
	}
	be.listen();
	this.caret.set(b);
	select.active = false;
	// setInput('') is done by System
	*/
}

/**
| Deselects the selection.
*/
Caret.prototype.deselect = function() {
	if (!this.selection.active) return;
	var item = this.selection.mark1.item;
	this.selection.active = false;
	system.setInput('');
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Action ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An action in the making.

 This overlays repository data, so for example a move is not transmitted
 with every pixel changed but when the the object is released.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Action(type, vitem, start) {
	this.type  = type;
	this.vitem = vitem;
	this.start = start;
}

/**
| Action enums.
*/
fixate(Action, 'PAN',       1); // panning the background
fixate(Action, 'ITEMDRAG',  2); // draggine one item
fixate(Action, 'ITEMRESIZE',3); // resizing one item
fixate(Action, 'FLOATMENU', 4); // clicked the float menu (background click)
fixate(Action, 'ITEMMENU',  5); // clicked one item menu
fixate(Action, 'SCROLLY',   6); // scrolling a note
fixate(Action, 'RELBIND',   7); // binding a new relation

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   '
 The unmoving interface.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Cockpit() {
// TODO, use this!
}

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	// TODO
}

/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	/* TODO
	var redraw = this.edgemenu.mousepos !== this.edgemenu.getMousepos(p);
	if (this.edgemenu.mousepos >= 0) {
		// mouse floated on edge menu, no need to look further
		system.setCursor('default');
		return;
	}
	*/
	return false;
}

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	/*
	var md = this.edgemenu.getMousepos(p);
	if (md >= 0) {
		shell.redraw = true;
		switch(md) {
		case 0: this._exportDialog(); break;
		case 1: this._revertDialog(); break;
		case 2: this._importDialog(); break;
		}
		return MST.NONE;
	}
	*/
	return false;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .       .  .
 \___  |-. ,-. |  |
     \ | | |-' |  |
 `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The users shell.
 Consists of the Cockpit and the Space the user is viewing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Shell(fabric) {
	if (shell !== null) throw new Error('Singleton not single');
	shell = this;

	Measure.init();
	this.fabric    = fabric;
	this.vspace    = null;

	this.cockpit   = new Cockpit();
	this.caret     = new Caret();
	this.action    = null;
	this.selection = new Selection();

	// A flag set to true if anything requests a redraw.
	this.redraw = false;
}

/**
| Meshcraft got the systems focus.
*/
Shell.prototype.systemFocus = function() {
	this.caret.show();
	this.caret.update();
}

/**
| Meshraft lost the systems focus.
*/
Shell.prototype.systemBlur = function() {
	this.caret.hide();
	this.caret.update();
}

/**
| Blink the caret (if shown)
*/
Shell.prototype.blink = function() {
	this.caret.blink();
}

/**
| Creates an action.
*/
Shell.prototype.startAction = function(type, vitem, start) {
	if (this.action) throw new Error('double action');
	return this.action = new Action(type, vitem, start);
}

/**
| Ends an action.
*/
Shell.prototype.stopAction = function() {
	if (!this.action) throw new Error('ending no action');
	this.action = null;
}

/**
| Draws the cockpit and the vspace.
*/
Shell.prototype._draw = function() {
	this.fabric.attune();   // <- bad name for clear();

	// remove caret cache.
	this.caret.save$ = null;
	this.caret.screenPos$ = null;

	this.vspace.draw();
	this.cockpit.draw();
	this.caret.update();

	this.redraw = false;
}

/**
| A mouse click.
*/
Shell.prototype.click = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.click(p);
	if (this.redraw) this._draw();
}

/**
| Mouse hover.
|
| TODO shift+ctrl.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.mousehover(p);
	if (this.redraw) this._draw();
}

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	// TODO rename mst -> mouseState
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	var mst = this.vspace.mousedown(p);
	if (this.redraw) this._draw();
	return mst;
}

/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(keyCode, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	if (this.caret.entity !== null) {
		this.caret.entity.specialKey(keyCode);
	}

	if (this.redraw) this._draw();
}

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	this.shift = false;
	this.ctrl  = false;

	if (this.caret.entity !== null) {
		this.caret.entity.input(text);
	}

	if (this.redraw) this._draw();
}

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragstart(p);
	if (this.redraw) this._draw();
}

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragmove(p);
	if (this.redraw) this._draw();
}

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragstop(p);
	if (this.redraw) this._draw();
}

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(wheel) {
	log('shell', 'wheel', wheel);
	/*
	if (wheel > 0) {
		this.zoom *= 1.1;
	} else {
		this.zoom /= 1.1;
	}
	if (abs(this.zoom - 1) < 0.0001) {
		this.zoom = 1;
	}*/
}

/**
| The window has been resized
*/
Shell.prototype.resize = function(width, height) {
	this._draw();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-_/,.
 ' |_|/ ,-. . , ,-,-. ,-. ,-. . .
  /| |  |-'  X  | | | |-' | | | |
  `' `' `-' ' ` ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 outerRadius |------>|
 innerRadius |->|    '
         .------'.   '      -1
		/ \  n  / \	 '
	   /nw .---.'ne\ '
	  /___/  .  \___\'
	  \   \ pc  /   /
	   \sw `---´ se/
 	    \ /  s  \ /
         `-------´

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Hexmenu(pc, style, labels) {
	this.p = pc;
	this.style = style;
	this.hflower = new HexagonFlower(pc, style.innerRadius, style.outerRadius, labels);
	this.labels = labels;
	this.mousepos = null;
}

/**
| Draws the hexmenu.
| TODO: give face
*/
Hexmenu.prototype.draw = function() {
	var f = system.fabric; // TODO! <- don't

	f.fill(settings.floatmenu.style.fill, this.hflower, 'path', 'outerHex');
	if (this.mousepos && this.mousepos !== 'center') {
		f.fill(settings.floatmenu.style.select, this.hflower, 'path', this.mousepos);
	}
	f.edge(settings.floatmenu.style.edge, this.hflower, 'path', 'structure');

	f.fontStyle('12px ' + settings.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var rd = this.style.outerRadius * (1 - 1 / 3.5);

	if (labels.n)  f.fillText(labels.n, this.p.x, this.p.y - rd);
	if (labels.ne) f.fillRotateText(labels.ne, this.p, Math.PI / 3 * 1, rd);
	if (labels.se) f.fillRotateText(labels.se, this.p, Math.PI / 3 * 2, rd);
	if (labels.s)  f.fillText(labels.n, this.p.x, this.p.y + rd);
	if (labels.sw) f.fillRotateText(labels.sw, this.p, Math.PI / 3 * 4, rd);
	if (labels.nw) f.fillRotateText(labels.nw, this.p, Math.PI / 3 * 5, rd);
	if (labels.c)  f.fillText(labels.c, this.p);
}

/**
| Sets this.mousepos and returns it according to p.
*/
Hexmenu.prototype.getMousepos = function(p) {
	return this.mousepos = this.hflower.within(p);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .---.
 `|  /   \___  ,-. ,-. ,-. ,-.
  | /        \ | | ,-| |   |-'
  `'     `---' |-' `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
               '
 The visual of a space.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor
*/
function VSpace(space) {
	this.space = space;
	this.fabric = new Fabric(system.fabric);
	this.zoom = 1; // @03
	this.vitems = new VItemCopse(space.items);
	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
}

/**
| Redraws the complete space.
*/
VSpace.prototype.draw = function() {
	for(var zi = this.space.z.length - 1; zi >= 0; zi--) {
		var vit = this.vitems.vcopse[this.space.z.get(zi)];
		vit.draw(this.fabric);
	}

	if (this.focus) this.focus.drawHandles(this.fabric);

	var action = shell.action;
	switch (action && action.type) {
	case Action.FLOATMENU : action.floatmenu.draw(); break;
	case Action.ITEMMENU  : action.itemmenu.draw();  break;
	case Action.RELBIND :
		var vitem = action.vitem;
		var arrow = Line.connect(vitem.getZone(), 'normal', action.move, 'arrow');
//			(ia.item2 && ia.item2.handlezone) || ia.smp , 'arrow'); TODO
		// if (ia.item2) ia.item2.highlight(this.fabric); TODO
		arrow.draw(this.fabric);
	}
}


/**
| Sets the focussed item or loses it if null
*/
VSpace.prototype.setFocus = function(vitem) {
	if (this.focus === vitem) return;
	this.focus = vitem;

	var caret = shell.caret;
	if (vitem) {
		caret.set(vitem.vdoc.valley[0], 0);
		caret.show();
	} else {
		caret.hide();
		caret.set(null);
	}

	if (vitem === null) return;

	peer.moveToTop(this.space, vitem.item);
}

/**
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
VSpace.prototype.mousehover = function(p) {
	var pp = p.sub(this.fabric.pan);

	var action = shell.action;
	switch(action && action.type) {
	case null : break;
	case Action.FLOATMENU :
		if (action.floatmenu.mousepos !== action.floatmenu.getMousepos(p)) {
			// float menu changed
			shell.redraw = true;
		}
		if (action.floatmenu.mousepos >= 0) {
			// mouse floated on float menu
			system.setCursor('default');
			return true;
		}
		break;
	case Action.ITEMMENU :
		if (action.itemmenu.mousepos !== action.itemmenu.getMousepos(p)) {
			// menu changed
			shell.redraw = true;
		}
		if (action.itemmenu.mousepos >= 0) {
			// mouse floated on item menu
			system.setCursor('default');
			return true;
		}
		break;
	}

	if (this.focus) {
		// TODO move into items
		if (this.focus.withinItemMenu(pp)) {
			system.setCursor('pointer');
			return true;
		}

		var com = this.focus.checkItemCompass(pp);
		if (com) {
			system.setCursor(com+'-resize');
			return true;
		}
	}

	var hit = false;
	for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
		var vit = this.vitems.vcopse[this.space.z.get(zi)];
		if (vit.mousehover(pp)) {
			hit = true;
			break;		
		}
	}
	if (!hit) system.setCursor('crosshair');
	return true;
}

/**
| Asks every item that intersects with a point if it feels reponsible for an event.
*/
VSpace.prototype._transfix = function(txe, p) {
	for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
		var vit = this.vitems.vcopse[this.space.z.get(zi)];
		if (vit.transfix(txe, p)) return true;
	}
	return false;
}


/**
| Starts creating a new relation.
*/
/*VSpace.prototype.actionSpawnRelation = function(item, p) { TODO REMOVE
	var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sp = ia.smp = p;
	system.setCursor('not-allowed');
}*/

/**
| Binds a relation.
*/
/*VSpace.prototype.actionRBindTo = function(toItem) {
	throw new Error('TODO');

	if (toItem.id === this.iaction.item.id) {
		console.log('not binding to itself');
		system.setCursor('default');
		return;
	}
	var rel = Relation.create(this.iaction.item, toItem);
	system.repository.updateItem(rel);
}*/

/**
| Hovering during relation binding.
*/
/* Space.prototype.actionRBindHover = function(toItem) {
	throw new Error('TODO');

	if (toItem.id === this.iaction.item.id) {
		system.setCursor('not-allowed');
		return;
	}
	system.setCursor('default');
	this.iaction.item2 = toItem;
}*/

/**
| Starts an operation with the mouse button held down.
*/
VSpace.prototype.dragstart = function(p) {
	var pp = p.sub(this.fabric.pan);

	/* if (this.focus && this.focus.withinItemMenu(pp)) {
		this.actionSpawnRelation(this.focus, pp); TODO xxx
		this.redraw();
		return;
	} */

	for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
		var vit = this.vitems.vcopse[this.space.z.get(zi)];
		if (vit.dragstart(pp)) return true;
	}

	// otherwise do panning
	shell.startAction(Action.PAN, null, pp);
	system.setCursor('crosshair');
	return true;
}

/**
| A mouse click.
*/
VSpace.prototype.click = function(p) {
	var pan = this.fabric.pan;
	var pp = p.sub(pan);

	// clicked the tab of the focused item?
	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		var action = shell.startAction(Action.ITEMMENU, null, pp);
		var labels = {n : 'Remove'};
		action.itemmenu = new Hexmenu(focus.getH6Slice().pm.add(pan), settings.itemmenu, labels);
		shell.redraw = true;
		return;
	}

	// clicked some item?
	for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
		var vit = this.vitems.vcopse[this.space.z.get(zi)];
		if (vit.click(pp)) return true;
	}

	// otherwhise pop up the float menu
	var action = shell.startAction(Action.FLOATMENU, null, p);
	action.floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);
	system.setCursor('default');
	this.setFocus(null);
	shell.redraw = true;
	return true;
}

/**
| Stops an operation with the mouse button held down.
*/
VSpace.prototype.dragstop = function(p) {
	var action = shell.action;
	var pp = p.sub(this.fabric.pan);
	if (!action) throw new Error('Dragstop without action?');

	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		action.vitem.dragstop(p);
		system.setCursor('default');
		shell.redraw = true;
		break;
	case Action.PAN :
		break;
	case Action.SCROLLY :
		break;
	/* TODO
	case ACT.RBIND :
		iaction.smp = null;
		this._transfix(RBINDTO, pp);
		redraw = true;
		break;
	*/
	default :
		throw new Error('Invalid action in "Space.dragstop"');
	}
	shell.stopAction();
}

/**
| Moving during an operation with the mouse button held down.
*/
VSpace.prototype.dragmove = function(p) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch(action.type) {
	default :
		action.vitem.dragmove(pp); 
		return;
	case Action.PAN :
		this.fabric.pan = p.sub(action.start);
		shell.redraw = true;
		return;
	/* TODO
	case Action.RBIND :
		iaction.item2 = null;
		this._transfix(RBINDHOVER, pp);
		iaction.smp = pp;
		this.redraw();
		return true;
	*/
	}
}

/**
| Mouse button down event.
*/
VSpace.prototype.mousedown = function(p) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch (action && action.type) {
	case null :
		break;
	case Action.FLOATMENU :
		var fm = action.floatmenu;
		var md = fm.getMousepos(p);
		shell.stopAction();

		if (!md) break;
		switch(md) {
		case 'n' : // note
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			var pnw = fm.p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
			var pse = pnw.add(nw, nh);
			var note  = peer.newNote(this.space, new Rect(pnw, pse));
			var vnote = new VNote(note, this);
			this.vitems.vcopse[note.getOwnKey()] = vnote;
			this.setFocus(vnote);
			break;
		case 'ne' : // label
			// TODO center label
			var pnw = fm.p.sub(this.fabric.pan.x - 10, this.fabric.pan.y - 20);
			var label = peer.newLabel(this.space, pnw, 20);
			var vlabel = new VLabel(label, this);
			this.vitems.vcopse[label.getOwnKey()] = vlabel;
			this.setFocus(vlabel);
			break;
		}
		shell.redraw = true;
		return MST.NONE;
	case Action.ITEMMENU :
		var im = action.itemmenu;
		var md = im.getMousepos(p);
		shell.stopAction();

		if (!im) break;
		switch(md) {
		case 'n': // remove
			peer.removeItem(this.space, this.focus.item);
			this.setFocus(null);
			break;
		}
		shell.redraw = true;
		return MST.NONE;
	}

	if (this.focus) {
		if (this.focus.withinItemMenu(p)) return MST.ATWEEN;
		var com = this.focus.checkItemCompass(pp);
		if (com) {
			// resizing
			var action = shell.startAction(Action.ITEMRESIZE, this.focus, pp);
			action.align = com;
			action.startZone = this.focus.getZone();
			system.setCursor(com+'-resize');

			return MST.DRAG;
		}
	}

	return MST.ATWEEN;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-_/ .             ,--.
 `|  /   '  | |- ,-. ,-,-. | `-' ,-. ,-. ,-. ,-.
  | /    .^ | |  |-' | | | |   . | | | | `-. |-'
  `'     `--' `' `-' ' ' ' `--'  `-' |-' `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                     '
 A visual collection of items.

 @03: remove this.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function VItemCopse(copse) {
	this.copse = copse;
	copse.addListener(this);
	this.vcopse = {};

	for(var k in copse.loop()) {
		var item = copse.get(k);
		switch (item.get('type')) {
		case 'Note'  : this.vcopse[k] = new VNote(copse.get(k)); break;
		case 'Label' : this.vcopse[k] = new VLabel(copse.get(k)); break;
		default : throw new Error('unknown type: '+item.type);
		}
	}
}

/**
| The meshmashine issued an event.
*/
VItemCopse.prototype.event = function(type, key, p1, p2, p3) {
	log('event', 'vitemcopse', type, key, p1, p2, p3);
	switch(type) {
	case 'set' :
		var vitem = this.vcopse[key];
		if (!vitem) return;
		vitem.item.removeListener(this);
		this.vcopse[key] = null;
		break;
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ VPara +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A visual paragraph representation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function VPara(para, vdoc) {
	if (para.constructor !== Woods.Para) throw new Error('type error');
	if (vdoc.constructor !== VDoc) throw new Error('type error');
	this.para = para;
	this.vdoc = vdoc;

	// fabric caching
	this._fabric$      = new Fabric(0 ,0);
	this._fabric$flag  = false; // fabric up-to-date flag
	this._fabric$width = 0;

	// flow caching
	this._flow$ = [];

	this.pnw = null; // position of para in doc.
	para.addListener(this);
}

/**
| (re)flows the paragraph, positioning all chunks.
*/
VPara.prototype.getFlow = function() {
	var para  = this.para;
	var vdoc  = this.vdoc;
	var vitem = vdoc.vitem;
	var flowWidth = vitem.getFlowWidth();

//	if (this._flow$ && this._flow$.flowWidth === flowWidth) return this._flow$; TODO xxx

	if (shell.caret.entity === this) {
		// remove caret cache if its within this flow.
		// @03 use a function
		shell.caret.cp$line  = null;
		shell.caret.cp$token = null;
	}

	// builds position informations.
	var flow  = this._flow$ = [];
	var spread = 0;  // width really used.

	var fontsize = vdoc.getFontSize();

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = fontsize;
	Measure.font = vdoc.getFont();
	var space = Measure.width(' ');
	var line = 0;
	flow[line] = { a: [], y: y, o: 0 };

	// @03 go into subnodes instead
	var text = para.get('text');

	//var reg = !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g); @03
	var reg = (/(\s*\S+|\s+$)\s?(\s*)/g);

	for(var ca = reg.exec(text); ca != null; ca = reg.exec(text)) {
		// a token is a word plus following hard spaces
		var token = ca[1] + ca[2];
		var w = Measure.width(token);
		xw = x + w + space;

		if (flowWidth > 0 && xw > flowWidth) {
			if (x > 0) {
				// soft break
				if (spread < xw) spread = xw;
				x = 0; xw = x + w + space;
				//y += R(vdoc.fontsize * (pre ? 1 : 1 + settings.bottombox)); @03
				y += R(vdoc.getFontSize() * (1 + settings.bottombox));
				line++;
				flow[line] = {a: [], y: y, o: ca.index};
			} else {
				// horizontal overflow
				console.log('HORIZONTAL OVERFLOW'); // @03
			}
		}
		flow[line].a.push({
			x: x,
			w: w,
			o: ca.index,
			t: token,
		});

		x = xw;
	}
	if (spread < xw) spread = xw;

	flow.height = y;
	flow.flowWidth = flowWidth;
	flow.spread = spread;
	return flow;
}

/**
| Returns the offset closest to a point.
|
| point: the point to look for
*/
VPara.prototype.getPointOffset = function(point) {
	var flow = this.getFlow();
	var para = this.para;
	var doc  = para.getAnchestor('DocAlley');
	Measure.font = doc.font;

	var line;
	for (line = 0; line < flow.length; line++) {
		if (point.y <= flow[line].y) {
			break;
		}
	}
	if (line >= flow.length) line--;

	return this.getLineXOffset(line, point.x);
}

/**
| Returns the offset in flowed line number and x coordinate.
*/
VPara.prototype.getLineXOffset = function(line, x) {
	var flow = this.getFlow();
	var fline = flow[line];
	var ftoken = null;
	for (var token = 0; token < fline.a.length; token++) {
		ftoken = fline.a[token];
 		if (x <= ftoken.x + ftoken.w) break;
	}
	if (token >= fline.a.length) ftoken = fline.a[--token];

	if (!ftoken) return 0;

	var dx   = x - ftoken.x;
	var text = ftoken.t;

	var x1 = 0, x2 = 0;
	var a;
	for(a = 0; a < text.length; a++) {
		x1 = x2;
		x2 = Measure.width(text.substr(0, a));
		if (x2 >= dx) break;
	}

	if (dx - x1 < x2 - dx) a--;
	return ftoken.o + a;
}

/**
| Text has been inputted.
*/
VPara.prototype.input = function(text) {
	if (shell.caret.entity !== this) throw new Error('Invalid caret on input');
	var para = this.para;
	peer.insertText(para, shell.caret.offset, text);
}

/**
| Handles a special key
*/
VPara.prototype.specialKey = function(keycode) {
	if (shell.caret.entity !== this) throw new Error('Invalid caret on specialKey');

	var para = this.para;
	var caret  = shell.caret;
	var select = shell.selection;

	if (shell.ctrl) {
		switch(keycode) {
		case 65 : // ctrl+a
			throw new Error('TODO');
			/*
			var pfirst = item.dtree.first;
			select.mark1.set(item, pfirst.first, 0);
			var plast = item.dtree.last;
			select.mark2.set(item, plast.first, plast.first.text.length);
			select.active = true;
			for(var n = pfirst; n; n = n.next) {
				n.listen();
			}
			caret.set(select.mark2);
			system.setInput(select.innerText());
			caret.show();
			return true;*/
		}
	}

	/*
	if (!shell.shift && select.active) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			this.deselect();
			shell.redraw = true;
			break;
		case  8 : // backspace
		case 46 : // del
			this.deleteSelection();
			shell.redraw = true;
			keycode = 0;
			throw new Error('TODO');
			//System.repository.updateItem(item);
			break;
		case 13 : // return
			this.deleteSelection();
			shell.redraw = true;
			break;
		}
	} else if (shell.shift && !select.active) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			select.mark1.set(caret);
		}
	}*/

	switch(keycode) {
	case  8 : // backspace
		if (caret.offset > 0) {
			peer.removeText(para, caret.offset - 1, 1);
		} else {
			var key = para.getOwnKey();
			if (key > 0) {
				peer.join(para.parent.get(key - 1));
			}
		}
		break;
	case 13 : // return
		peer.split(para, caret.offset);
		break;
	case 35 : // end
		caret.set(this, para.get('text').length);
		break;
	case 36 : // pos1
		caret.set(this, 0);
		break;
	case 37 : // left
		if (caret.offset > 0) {
			caret.set(this, caret.offset - 1);
		} else {
			var vdoc = this.vdoc;
			var key = para.getOwnKey();
			if (vdoc.valley[key] !== this) throw new Error('vdoc.valley inconsistency');
			if (key > 0) {
				var ve = vdoc.valley[key - 1];
				caret.set(ve, ve.para.get('text').length);
			}
		}
		break;
	case 38 : // up
		var flow = this.getFlow();
		var caret = shell.caret;
		var x = caret.retain$x !== null ? caret.retain$x : caret.pos$.x;

		if (caret.flow$line > 0) {
			// stay within this para
			var offset = this.getLineXOffset(caret.flow$line - 1, x);
			caret.set(this, offset, x);
		} else {
			// goto prev para
			var vdoc = this.vdoc;
			var key  = para.getOwnKey();
			if (vdoc.valley[key] !== this) throw new Error('vdoc.valley inconsistency');
			if (key > 0) {
				var ve = vdoc.valley[key - 1];
				var offset = ve.getLineXOffset(ve.getFlow().length - 1, x);
				caret.set(ve, offset, x);
			}
		}
		break;
	case 39 : // right
		if (caret.offset < para.get('text').length) {
			caret.set(this, caret.offset + 1);
		} else {
			var vdoc = this.vdoc;
			var key = para.getOwnKey();
			if (vdoc.valley[key] !== this) throw new Error('vdoc.valley inconsistency');
			if (key < vdoc.valley.length - 1) {
				var ve = vdoc.valley[key + 1];
				caret.set(ve, 0);
			}
		}
		break;
	case 40 : // down
		var flow = this.getFlow();
		var caret = shell.caret;
		var x = caret.retain$x !== null ? caret.retain$x : caret.pos$.x;

		if (caret.flow$line < flow.length - 1) {
			// stay within this para
			var offset = this.getLineXOffset(caret.flow$line + 1, x);
			caret.set(this, offset, x);
		} else {
			// goto next para
			var vdoc = this.vdoc;
			var key = para.getOwnKey();
			if (vdoc.valley[key] !== this) throw new Error('vdoc.valley inconsistency');
			if (key < vdoc.valley.length - 1) {
				var ve = vdoc.valley[key + 1];
				var offset = ve.getLineXOffset(0, x);
				caret.set(ve, offset, x);
			}
		}
		break;
	case 46 : // del
		if (caret.offset < para.get('text').length) {
			peer.removeText(para, caret.offset, 1);
		} else {
			var vdoc = this.vdoc;
			var key = para.getOwnKey();
			if (vdoc.valley[key] !== this) throw new Error('vdoc.valley inconsistency');
			if (key < vdoc.valley.length - 1) {
				peer.join(para);
			}
		}
		break;
	}


	/*
	if (shell.shift && refresh) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			select.active = true;
			select.mark2.set(caret);
			system.setInput(select.innerText());
			// clears item cache
			item.listen();  // TODO rename.
			shell.redraw = true;
		}
	}*/

	caret.show();
	shell.redraw = true; // TODO?
}

/**
| Returns the height of the para
*/
VPara.prototype.getHeight = function() {
	var flow = this.getFlow();
	return flow.height + R(this.vdoc.getFontSize() * settings.bottombox);
}

/**
| Draws the paragraph in its cache and returns it.
*/
VPara.prototype.getFabric = function() {
	var para   = this.para;
	var flow   = this.getFlow();
	var width  = flow.spread;
	var vdoc   = this.vdoc;
	var doc    = para.getAnchestor('DocAlley');
	var height = this.getHeight();

	// cache hit?
	if (this._fabric$flag && this._fabric$width === width && this._fabric$height === height) {
		return this._fabric$;
	}

	var fabric = this._fabric$;

	// TODO: work out exact height for text below baseline
	fabric.attune(width, height);
	fabric.fontStyle(vdoc.getFont(), 'black', 'start', 'alphabetic');

	// draws text into the fabric
	for(var a = 0, aZ = flow.length; a < aZ; a++) {
		var line = flow[a];
		for(var b = 0, bZ = line.a.length; b < bZ; b++) {
			var chunk = line.a[b];
			fabric.fillText(chunk.t, chunk.x, line.y);
		}
	}

	this._fabric$flag   = true;
	this._fabric$width  = width;
	this._fabric$height = height;
	return fabric;
}

/**
| Drops the cache (cause something has changed)
*/
VPara.prototype.event = function(event, p1, p2, p3) {
	this.vdoc.vitem.poke();

	this._flow$ = null;
	// TODO set fabric$ = null
	this._fabric$flag = false;
}

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| flowPos$: if set, writes flow$line and flow$token to
|           the flow position used.
*/
VPara.prototype.getOffsetPoint = function(offset, flowPos$) {
	// TODO cache position
	var para = this.para;
	var doc  = para.getAnchestor('DocAlley');
	Measure.font = doc.font;
	var text = para.get('text');
	var flow = this.getFlow();

	var al = flow.length - 1;
	for (var a = 1; a < flow.length; a++) {
		if (flow[a].o > offset) {
			al = a - 1;
			break;
		}
	}
	var line = flow[al];

	var at = line.a.length - 1;
	for (var a = 1; a < line.a.length; a++) {
		if (line.a[a].o > offset) {
			at = a - 1;
			break;
		}
	}
	var token = line.a[at];
	if (!token) token = {x: 0, o :0}

	if (flowPos$) {
		flowPos$.flow$line  = al;
		flowPos$.flow$token = at;
	}

	// TODO use token.t text instead.
	return new Point(
		R(token.x + Measure.width(text.substring(token.o, offset))),
		line.y);
}


/**
| Draws the caret if its in this paragraph.
*/
VPara.prototype.drawCaret = function() {
	if (shell.caret.entity !== this) throw new Error('Drawing caret for invalid para');

	var vdoc  = this.vdoc;
	var vitem = vdoc.vitem;
	var zone  = vitem.getZone();
	var caret = shell.caret;
	var pan   = shell.vspace.fabric.pan;
	var fs    = vdoc.getFontSize();
	var descend = R(fs * settings.bottombox);
	var th    = R(vdoc.getFontSize()) + descend;

	caret.pos$ = this.getOffsetPoint(shell.caret.offset, shell.caret);

	var sbary   = vitem.scrollbarY;
	var scrolly = sbary ? sbary.getPos() : 0;

	var cys = R(caret.pos$.y + this.pnw.y + descend - scrolly);
	var cyn = cys - th;
	var cx  = caret.pos$.x + this.pnw.x - 1;

	cyn = min(max(cyn, 0), zone.height);
	cys = min(max(cys, 0), zone.height);
	var ch  = cys - cyn;
	if (ch === 0) return;

	var cp = new Point(cx + zone.pnw.x + pan.x, cyn + zone.pnw.y + pan.y);

	shell.caret.screenPos$ = cp;

	if (Caret.useGetImageData) {
		shell.caret.save$ = shell.fabric.getImageData(cp.x, cp.y, 3, ch + 2);
	} else {
		// paradoxically this is often way faster, especially on firefox
		shell.caret.save$ = new Fabric(shell.fabric.width, shell.fabric.height);
		shell.caret.save$.drawImage(shell.fabric, 0, 0);
	}

	shell.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, ch);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.  ,--,--'
 ' |   \ `- | ,-. ,-. ,-.
 , |   /  , | |   |-' |-'
 `-^--'   `-' '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A document with nodes in tree structure.

 TODO remove

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Draws the selection
|
| fabric  : Fabric to draw upon
| isEdge  : true if this is an edge
| border  : extra border for edge, must be 0
| imargin : inner margin of item
| scrolly : scroll position of item
*/
/*
DTree.prototype.pathSelection = function(fabric, border, edge, select, imargin, scrolly) {
	// TODO make part of selection to use shortcut with XY
	var b = select.mark1;
	var e = select.mark2;
	var bp = b.getPoint();
	var ep = e.getPoint();
	if (ep.y < bp.y || (ep.y == bp.y && ep.x < bp.x)) {
		b = select.mark2;
		e = select.mark1;
		{ var _ = bp; bp = ep; ep = _; }
	}

	fabric.beginPath();
	var lh = R(this.fontsize * (1 + settings.bottombox));
	var bx = R(bp.x);
	var by = R(bp.y - scrolly);
	var ex = R(ep.x);
	var ey = R(ep.y - scrolly);
	var rx = this.width + half(imargin.e);
	var lx = half(imargin.w);
	if ((abs(by - ey) < 2)) {
		// ***
		fabric.moveTo(bx, by, edge);
		fabric.lineTo(bx, by + lh, edge);
		fabric.lineTo(ex, ey + lh, edge);
		fabric.lineTo(ex, ey, edge);
		fabric.lineTo(bx, by, edge);
	} else if (abs(by + lh - ey) < 2 && (bx >= ex))  {
		//      ***
		// ***
		fabric.moveTo(rx, by + lh, edge);
		fabric.lineTo(bx, by + lh, edge);
		fabric.lineTo(bx, by, edge);
		fabric.lineTo(rx, by, edge);

		fabric.moveTo(lx, ey, edge);
		fabric.lineTo(ex, ey, edge);
		fabric.lineTo(ex, ey + lh, edge);
		fabric.lineTo(lx, ey + lh, edge);
	} else {
		//    *****
		// *****
		fabric.moveTo(rx, ey, edge);
		fabric.lineTo(ex, ey, edge);
		fabric.lineTo(ex, ey + lh, edge);
		fabric.lineTo(lx, ey + lh, edge);

		if (edge)
			fabric.moveTo(lx, by + lh, edge);
		else
			fabric.lineTo(lx, by + lh, edge);
		fabric.lineTo(bx, by + lh, edge);
		fabric.lineTo(bx, by, edge);
		fabric.lineTo(rx, by, edge);
		if (!edge) fabric.lineTo(rx, ey, edge);
	}
}
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.             .  .  .
 \___  ,-. ,-. ,-. |  |  |-. ,-. ,-.
     \ |   |   | | |  |  | | ,-| |
 `---' `-' '   `-' `' `' ^-' `-^ '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A scrollbar.

 currently only vertical scrollbars.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| parent: parent holding the scrollbar
*/
function Scrollbar(item) {
	this.parent   = item;
	this.max      = null;
	this.visible  = false;
	this._pos     = 0;
	this.aperture = null; // the size of the bar
	this.zone     = null;
}

/**
| Makes the path for fabric.edge/fill/paint.
| TODO change descr on all path()s
*/
Scrollbar.prototype.path = function(fabric, border, edge) {
	if (border !== 0)  throw new Error('Scrollbar.path does not support borders');
	if (!this.visible) throw new Error('Pathing an invisible scrollbar');

	var z = this.zone;
	var w = z.width;
	var size  = R(this.aperture * z.height / this.max);
	var msize = max(size, settings.scrollbar.minSize);
	var sy = z.pnw.y + R(this._pos * ((z.height - msize + size) / this.max));

	fabric.beginPath();
	fabric.moveTo(z.pnw.x,                R(sy + cos30 * w / 2), edge);
	fabric.lineTo(z.pnw.x + R(w / 4),     sy,                    edge);
	fabric.lineTo(z.pnw.x + R(w * 3 / 4), sy,                    edge);
	fabric.lineTo(z.pse.x,                R(sy + cos30 * w / 2), edge);

	fabric.lineTo(z.pse.x,                R(sy + msize - cos30 * w / 2), edge);
	fabric.lineTo(z.pnw.x + R(w * 3 / 4), sy + msize,                    edge);
	fabric.lineTo(z.pnw.x + R(w / 4),     sy + msize,                    edge);
	fabric.lineTo(z.pnw.x,                R(sy + msize - cos30 * w / 2), edge);
	fabric.closePath();
}

/**
| Draws the scrollbar.
*/
Scrollbar.prototype.draw = function(fabric) {
	fabric.paint(settings.scrollbar.style.fill, settings.scrollbar.style.edge, this, 'path');
}

/**
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function() {
	if (!this.visible) return 0;
	return this._pos;
}

/**
| Sets the scrollbars position.
*/
Scrollbar.prototype.setPos = function(pos) {
	if (pos < 0) throw new Error('Scrollbar.setPos < 0');
	return this._pos = pos;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .-,--.
 `|  /   ' |   \ ,-. ,-.
  | /    , |   / | | |
  `'     `-^--'  `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An array of paragraph visuals.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function VDoc(doc, vitem) {
	this.doc = doc;
	this.vitem = vitem;

	doc.addListener(this);

	// visual-alley
	var valley = this.valley = [];

	for (var a = 0; a < doc.length; a++) {
		valley[a] = new VPara(doc.get(a), this);
	}
}

/**
| The meshmashine issued an event.
*/
VDoc.prototype.event = function(type, key, p1, p2, p3) {
	log('event', 'vdoc', type, key, p1, p2, p3);

	switch(type) {
	case 'join' :
		this.valley.splice(key + 1, 1);
		break;
	case 'split' :
		var nvp = new VPara(this.doc.get(key + 1), this);
		this.valley.splice(key + 1, 0, nvp);
		break;
	}
}

/**
| Draws the document alley on a fabric.
|
| fabric: to draw upon.
| imargin: distance of text to edge
| scrollp: scroll position
*/
VDoc.prototype.draw = function(fabric, imargin, scrollp) {
	// @03 <pre>
	var paraSep = this.vitem.getParaSep(this.getFontSize());

	// draws the selection
	/* TODO
	if (selection.active && selection.mark1.item === this.parent) {
		// TODO make paint()
		fabric.fill(
			settings.selection.style.fill, this, 'pathSelection',
			selection, imargin, scrolly);
		fabric.edge(
			settings.selection.style.edge, this, 'pathSelection',
			selection, imargin, scrolly);
	}
	*/

	var y = imargin.n;

	var valley = this.valley;
	// draws the paragraphs
	for (var a = 0; a < valley.length; a++) {
		var vpara = valley[a];
		var flow = vpara.getFlow();

		// TODO name pnw$
		vpara.pnw = new Point(imargin.w, R(y));
		fabric.drawImage(vpara.getFabric(), imargin.w, R(y - scrollp.y));
		y += flow.height + paraSep;
	}
}

/**
| Returns the height of the document.
| TODO caching
*/
VDoc.prototype.getHeight = function() {
	var fontsize = this.getFontSize();
	var paraSep = this.vitem.getParaSep(fontsize);
	var valley = this.valley;
	var height = 0;
	for (var a = 0, aZ = valley.length; a < aZ; a++) {
		var vpara = valley[a];
		var flow = vpara.getFlow();
		if (a > 0) height += paraSep;
		height += flow.height;
	}
	height += R(fontsize * settings.bottombox);
	return height;
}

/**
| Returns the width actually used of the document.
*/
VDoc.prototype.getSpread = function() {
	var valley = this.valley;
	var spread = 0;
	for (var a = 0, aZ = valley.length; a < aZ; a++) {
		spread = max(spread, valley[a].getFlow().spread);
	}
	return spread;
}

VDoc.prototype.getFontSize = function() {
	var vitem = this.vitem;
	var fontsize = this.doc.get('fontsize');
	if (!vitem.fontSizeChange) return fontsize;
	return vitem.fontSizeChange(fontsize);
}

/**
| Returns the default font of the dtree.
*/
VDoc.prototype.getFont = function() {
	return this.getFontSize() + 'px ' + settings.defaultFont;
}

/**
| Returns the paragraph at point
*/
VDoc.prototype.getVParaAtPoint = function(p) {
	var valley = this.valley;
	for(var a = 0; a < valley.length; a++) {
		var vpara = valley[a];
		var flow = vpara.getFlow();
		if (p.y < vpara.pnw.y + flow.height) return vpara;
	}
	return null;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-_/ .
 `|  /   '  | |- ,-. ,-,-.
  | /    .^ | |  |-' | | |
  `'     `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of VNote and VLabel.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor
*/
function VItem(item, vspace) {
	this._h6slice$ = null;
	this.item         = item;
	this.vspace       = vspace;
	this.vdoc         = new VDoc(item.doc, this);
	this._fabric      = new Fabric();
	this._fabric$flag = false; // up-to-date-flag
}

/**
| Return the hexagon slice that is the handle
*/
VItem.prototype.getH6Slice = function() {
	var zone = this.getZone();

	if (this._h6slice$ && this._h6slice$.psw.eq(zone.pnw)) return this._h6slice$;

	return this._h6slice$ = new HexagonSlice(
		zone.pnw, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
};

/**
| Returns if point is within the item menu
*/
VItem.prototype.withinItemMenu = function(p) {
	return this.getH6Slice().within(p);
}

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| TODO rename
*/
VItem.prototype.checkItemCompass = function(p) {
	var ha = this.handles;
	var zone = this.getZone();

	if (!ha) return null;
	var d   =       settings.handle.size; // distance
	var din = 0.5 * settings.handle.size; // inner distance
	var dou =       settings.handle.size; // outer distance

	var n = p.y >= zone.pnw.y - dou && p.y <= zone.pnw.y + din;
	var e = p.x >= zone.pse.x - din && p.x <= zone.pse.x + dou;
	var s = p.y >= zone.pse.y - din && p.y <= zone.pse.y + dou;
	var w = p.x >= zone.pnw.x - dou && p.x <= zone.pnw.x + din;

	if (n) {
		if (w && ha.nw) return 'nw';
		if (e && ha.ne) return 'ne';
		if (ha.n && abs(p.x - zone.pc.x) <= d) return 'n';
		return null;
	}
	if (s) {
		if (w && ha.sw) return 'sw';
		if (e && ha.se) return 'se';
		if (ha.s && abs(p.x - zone.pc.x) <= d) return 's';
		return null;
	}
	if (w && ha.w && abs(p.y - zone.pc.y) <= d) return 'w';
	if (e && ha.e && abs(p.y - zone.pc.y) <= d) return 'e';
	return null;
}

/**
| Paths the resize handles.
*/
VItem.prototype.pathResizeHandles = function(fabric, border, edge) {
	if (border !== 0) throw new Error('borders unsupported for handles');
	var ha = this.handles;
	var zone = this.getZone();
	var pnw = zone.pnw;
	var pse = zone.pse;

	var ds = settings.handle.distance;
	var hs = settings.handle.size;
	var hs2 = half(hs);

	var x1 = pnw.x - ds;
	var y1 = pnw.y - ds;
	var x2 = pse.x + ds;
	var y2 = pse.y + ds;
	var xm = half(x1 + x2);
	var ym = half(y1 + y2);

	fabric.beginPath();
	if (ha.n ) {
		fabric.moveTo(xm - hs2, y1, edge);
		fabric.lineTo(xm + hs2, y1, edge);
	}
	if (ha.ne) {
		fabric.moveTo(x2 - hs,  y1, edge);
		fabric.lineTo(x2, y1, edge);
		fabric.lineTo(x2, y1 + hs, edge);
	}
	if (ha.e ) {
		fabric.moveTo(x2, ym - hs2, edge);
		fabric.lineTo(x2, ym + hs2, edge);
	}
	if (ha.se) {
		fabric.moveTo(x2, y2 - hs,  edge);
		fabric.lineTo(x2, y2, edge);
		fabric.lineTo(x2 - hs, y2, edge);
	}
	if (ha.s ) {
		fabric.moveTo(xm - hs2, y2, edge);
		fabric.lineTo(xm + hs2, y2, edge);
	}
	if (ha.sw) {
		fabric.moveTo(x1 + hs, y2,  edge);
		fabric.lineTo(x1, y2, edge);
		fabric.lineTo(x1, y2 - hs, edge);
	}
	if (ha.w ) {
		fabric.moveTo(x1, ym - hs2, edge);
		fabric.lineTo(x1, ym + hs2, edge);
	}
	if (ha.nw) {
		fabric.moveTo(x1, y1 + hs,  edge);
		fabric.lineTo(x1, y1, edge);
		fabric.lineTo(x1 + hs, y1, edge);
	}
}

/**
| Draws the handles of an item (resize, itemmenu)
*/
VItem.prototype.drawHandles = function(fabric) {
	// draws the resize handles
	fabric.edge(settings.handle.style.edge, this, 'pathResizeHandles');

	// draws item menu handler
	var sstyle = settings.itemmenu.slice.style;
	fabric.paint(sstyle.fill, sstyle.edge, this.getH6Slice(), 'path');
}

/**
| Returns the para at point. @03, honor scroll here.
*/
VItem.prototype.getVParaAtPoint = function(p, action) {
	// @03 rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.vdoc.getVParaAtPoint(p, action);
}

/**
| Dragstart.
| Checks if a dragstart targets this item.
*/
VItem.prototype.dragstart = function(p) {
	if (!this.getZone().within(p)) return false;

	shell.redraw = true;

	if (shell.ctrl) {
		shell.startAction(Action.RELBIND, this, p);
		return true;
	}
	shell.vspace.setFocus(this);

	var sbary = this.scrollbarY;
	var pnw = this.getZone().pnw;
	var pr = p.sub(pnw);
	if (sbary && sbary.visible && sbary.zone.within(pr)) {
		var action = shell.startAction(Action.SCROLLY, this, p);
		action.startPos = sbary.getPos();
	} else {
		shell.startAction(Action.ITEMDRAG, this, p);
		system.setCursor('move');
	}
	return true;
}

/**
| dragmove?
*/
VItem.prototype.dragmove = function(p) {
	var action = shell.action;
	if (action.vitem !== this) throw new Error('Itemmismatch in dragmove');
	// no zone test, since while dragmoving the item selected is fixed to the action.
	switch (action.type) {
	default : throw new Error('invalid dragmove');
	case Action.ITEMRESIZE :
	case Action.ITEMDRAG :
		action.move = p;
		shell.redraw = true;
		return true;
	case Action.SCROLLY :
		var start = action.start;
		var dy = p.y - start.y;
		var vitem = action.vitem;
		var sbary = vitem.scrollbarY;
		var spos = action.startPos + sbary.max / sbary.zone.height * dy;
		vitem.setScrollbar(spos);
		vitem.poke();
		shell.redraw = true;
		return true;
	}
	return true;
}

/**
| Mouse is hovering around.
| Checks if this item reacts on this.
*/
VItem.prototype.mousehover = function(p) {
	if (!this.getZone().within(p)) return false;
	system.setCursor('default');
	return true;
}

/**
| Sees if this item reacts on a click event.
*/
VItem.prototype.click = function(p) {
	if (!this.getZone().within(p)) return false;

	shell.vspace.setFocus(this);
	shell.redraw = true;

	var pnw = this.getZone().pnw;
	var pi = p.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));

	var vpara = this.getVParaAtPoint(pi);
	if (vpara) {
		var offset = vpara.getPointOffset(pi.sub(vpara.pnw));
		shell.caret.set(vpara, offset);
		shell.caret.show();
		// shell.selection.deselect(); TODO
	}
	return true;
}

/**
| Called by subvisuals when they got changed.
*/
VItem.prototype.poke = function() {
	this._fabric$flag = false;
	shell.redraw = true;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-,-.       .
 `|  /   ` | |   ,-. |- ,-.
  | /      | |-. | | |  |-'
  `'      ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function VNote(item, vspace) {
	VItem.call(this, item, vspace);
	this.scrollbarY   = new Scrollbar(this, null);
}
subclass(VNote, VItem);

/**
| Default margin for all notes.
*/
VNote.prototype.imargin = new Margin(settings.note.imargin);

/**
| Resize handles to show on notes.
*/
fixate(VNote.prototype, 'handles', {
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true,
});

/**
| Minimum sizes
*/
VNote.prototype.minWidth  = settings.note.minWidth;
VNote.prototype.minHeight = settings.note.minHeight;

/**
| Highlights the note.
*/
VNote.prototype.highlight = function(fabric) {
	// TODO round rects
	fabric.edge(settings.note.style.highlight, this.zone, 'path');
}


/**
| Returns the notes silhoutte.
*/
VNote.prototype.getSilhoutte = function(zone) {
	if (!this._silhoutte$ ||
		this._silhoutte$.width  !== zone.width ||
		this._silhoutte$.height !== zone.height)
	{
		return this._silhoutte$ = new RoundRect(
			Point.zero, new Point(zone.width, zone.height),
			settings.note.cornerRadius);
	}

	return this._silhoutte$;
}

/**
| Actualizes the scrollbar.
*/
VNote.prototype.setScrollbar = function(pos) {
	var sbary = this.scrollbarY;
	if (!sbary.visible) return;

	// @03 double call to getHeight, also in VDoc.draw()
	sbary.max = this.vdoc.getHeight();

	var zone = this.getZone();
	// @03 make a Rect.renew
	sbary.zone = new Rect(
		Point.renew(
			zone.width - this.imargin.e - settings.scrollbar.strength,
			this.imargin.n,
			sbary.zone && sbary.zone.pnw),
		Point.renew(
			zone.width - this.imargin.e,
			zone.height - this.imargin.s - 1,
			sbary.zone && sbary.zone.pse));

	sbary.aperture = zone.height - this.imargin.y;
	var smaxy = max(0, sbary.max - sbary.aperture);

	if (typeof(pos) === 'undefined') pos = sbary.getPos();
	// TODO use limit()
	if (pos > smaxy) pos = smaxy;
	if (pos < 0) pos = 0;
	sbary.setPos(pos);
}

/**
| Sets the items position and size after an action.
*/
VNote.prototype.dragstop = function(p) {
	var zone = this.getZone();

	if (zone.width < this.minWidth || zone.height < this.minHeight) {
		throw new Error('Note under minimum size!');
	}

	if (this.item.zone.eq(zone)) return;

	peer.setZone(this.item, zone);

	// TODO this should happen by setting in peer<F12>...
	this._fabric$flag = false;

	// adapts scrollbar position
	this.setScrollbar();
}

/**
| Draws the note.
|
| fabric: to draw upon.
*/
VNote.prototype.draw = function(fabric) {
	var f    = this._fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (!this._fabric$flag || !this._fabric$size ||
		zone.width  !== this._fabric$size.width ||
		zone.height !== this._fabric$size.height)
	{
		var vdoc = this.vdoc;
		var imargin = this.imargin;

		// calculates if a scrollbar is needed
		var sbary  = this.scrollbarY;
		var vheight = vdoc.getHeight();
		if (!sbary.visible && vheight > zone.height - imargin.y) {
			// doesn't use a scrollbar but should
			sbary.visible = true;
		} else if (sbary.visible && vheight <= zone.height - imargin.y) {
			// uses a scrollbar but shouldn't
			sbary.visible = false;
		}

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone);
		f.fill(settings.note.style.fill, silhoutte, 'path');

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		vdoc.draw(f, imargin, sbary.point);

		// draws the scrollbar
		if (sbary.visible) {
			this.setScrollbar();
			sbary.draw(f);
		}

		// draws the border
		f.edge(settings.note.style.edge, silhoutte, 'path');

		this._fabric$flag = true;
		this._fabric$size = zone;
	}

	fabric.drawImage(f, zone.pnw);
}

/**
| Returns the width for the contents flow.
*/
VNote.prototype.getFlowWidth = function() {
	var sbary = this.scrollbarY;
	var zone = this.getZone();
	var flowWidth = zone.width - this.imargin.x;
	if (sbary && sbary.visible) {
		flowWidth -= settings.scrollbar.strength;
	}
	return flowWidth;
}

/**
| Returns the para seperation height.
*/
VNote.prototype.getParaSep = function(fontsize) {
	return half(fontsize);
}

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VNote.prototype.getZone = function() {
	var item   = this.item;
	var action = shell.action;

	if (!action || action.vitem !== this) return item.zone;
	// @03 cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		if (!action.move) return item.zone;
		return item.zone.add(action.move.x - action.start.x, action.move.y - action.start.y);

	case Action.ITEMRESIZE:
		if (!action.move) return item.zone;
		var ipnw = action.startZone.pnw;
		var ipse = action.startZone.pse;
		var dx = action.move.x - action.start.x;
		var dy = action.move.y - action.start.y;
		var minw = this.minWidth;
		var minh = this.minHeight;
		var pnw, pse;

		switch (action.align) {
		case 'n'  :
			pnw = Point.renew(ipnw.x, min(ipnw.y + dy, ipse.y - minh), ipnw, ipse);
			pse = ipse;
			break;
		case 'ne' :
			pnw = Point.renew(
				ipnw.x, min(ipnw.y + dy, ipse.y - minh), ipnw, ipse);
			pse = Point.renew(
				max(ipse.x + dx, ipnw.x + minw), ipse.y, ipnw, ipse);
			break;
		case 'e'  :
			pnw = ipnw;
			pse = Point.renew(max(ipse.x + dx, ipnw.x + minw), ipse.y, ipnw, ipse);
			break;
		case 'se' :
			pnw = ipnw;
			pse = Point.renew(
				max(ipse.x + dx, ipnw.x + minw),
				max(ipse.y + dy, ipnw.y + minh), ipnw, ipse);
			break;
		case 's' :
			pnw = ipnw;
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y + minh), ipnw, ipse);
			break;
		case 'sw'  :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x - minw), ipnw.y, ipnw, ipse),
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y + minh), ipnw, ipse);
			break;
		case 'w'   :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x - minw), ipnw.y, ipnw, ipse),
			pse = ipse;
			break;
		case 'nw' :
			pnw = Point.renew(
				min(ipnw.x + dx, ipse.x - minw),
				min(ipnw.y + dy, ipse.y - minh), ipnw, ipse);
			pse = ipse;
			break;
		case 'c' :
		default  :
			throw new Error('unknown align');
		}
		return new Rect(pnw, pse);
	default :
		return item.zone;
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,.   ,. ,       .       .
  `|  /   )   ,-. |-. ,-. |
   | /   /    ,-| | | |-' |
   `'    `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A sizeable item with sizing text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function VLabel(item, vspace) {
	VItem.call(this, item, vspace);
}
subclass(VLabel, VItem);

/**
| Default margin for all notes.
*/
VLabel.prototype.imargin = new Margin(settings.label.imargin);

/**
| Resize handles to show on notes.
*/
fixate(VLabel.prototype, 'handles', {
	ne : true,
	se : true,
	sw : true,
	nw : true,
});

/**
| Minimum sizes
*/
VLabel.prototype.minWidth  = false;
VLabel.prototype.minHeight = settings.label.minHeight;

/**
| Highlights the note.
*/
VLabel.prototype.highlight = function(fabric) {
	// TODO round rects
	fabric.edge(settings.label.style.highlight, this.zone, 'path');
}


/**
| Returns the notes silhoutte.
*/
VLabel.prototype.getSilhoutte = function(zone) {
	if (!this._silhoutte$ ||
		this._silhoutte$.width  !== zone.width ||
		this._silhoutte$.height !== zone.height)
	{
		return this._silhoutte$ = new Rect(
			Point.zero, new Point(zone.width - 1, zone.height - 1),
			settings.note.cornerRadius);
	}

	return this._silhoutte$;
}


/**
| Draws the label.
|
| fabric: to draw upon. // @03 remove this parameter.
*/
VLabel.prototype.draw = function(fabric) {
	var f    = this._fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (!this._fabric$flag || !this._fabric$size ||
		zone.width  !== this._fabric$size.width ||
		zone.height !== this._fabric$size.height)
	{
		var vdoc = this.vdoc;
		var imargin = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone);

		// draws selection and text
		vdoc.draw(f, imargin, Point.zero);

		// draws the border
		f.edge(settings.label.style.edge, silhoutte, 'path');

		this._fabric$flag = true;
		this._fabric$size = zone;
	}

	fabric.drawImage(f, zone.pnw);
}

/**
| Returns the width for the contents flow.
*/
VLabel.prototype.getFlowWidth = function() {
	return 0;
}

/**
| Calculates the change of fontsize due to resizing.
*/
VLabel.prototype.fontSizeChange = function(fontsize) {
	var action = shell.action;
	if (!action || action.vitem !== this) return fontsize;
	switch (action.type) {
	default: return fontsize;
	case Action.ITEMRESIZE:
		if (!action.move) return fontsize;
		var vdoc = this.vdoc;
		var height = action.startZone.height;
		var dy;
		switch (action.align) {
		case 'ne': case 'nw' : dy = action.start.y - action.move.y;  break;
		case 'se': case 'sw' : dy = action.move.y  - action.start.y; break;
		default  : throw new Error('unknown align: '+action.align);
		}
		return max(fontsize * (height + dy) / height, 8);
	}
	return max(fontsize, 4);
}

/**
| Returns the para seperation height.
*/
VLabel.prototype.getParaSep = function(fontsize) {
	return 0;
}

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VLabel.prototype.getZone = function() {
	var item   = this.item;
	var action = shell.action;
	var pnw = item.pnw;

	// xxxx Caching! TODO
	var vdoc = this.vdoc;
	var fs = vdoc.getFontSize();
	var width  = max(Math.ceil(vdoc.getSpread()), R(fs * 0.3));
	var height = max(Math.ceil(vdoc.getHeight()), R(fs));

	if (!action || action.vitem !== this) return new Rect(pnw, pnw.add(width, height));
	// @03 cache the last zone

	switch (action.type) {
	default : return new Rect(pnw, pnw.add(width, height));
	case Action.ITEMDRAG:
		if (!action.move) return new Rect(pnw, pnw.add(width, height));
		var mx = action.move.x - action.start.x;
		var my = action.move.y - action.start.y;
		return new Rect(pnw.add(mx, my), pnw.add(mx + width, my + height));

	case Action.ITEMRESIZE:
		// resizing is done by fontSizeChange()
		var szone = action.startZone;
		if (!action.move) return new Rect(pnw, pnw.add(width, height));

		switch (action.align) {
		default   : throw new Error('unknown align');
		case 'ne' : pnw = pnw.add(0, szone.height - height); break;
		case 'se' : break;
		case 'sw' : pnw = pnw.add(szone.width - width, 0); break;
		case 'nw' : pnw = pnw.add(szone.width - width, szone.height - height); break;
		}
		return new Rect(pnw, pnw.add(width, height));
	}
}


/**
| Sets the items position and size aften an action.
*/
VLabel.prototype.dragstop = function(p) {
	var zone = this.getZone();
	var fontsize = this.vdoc.getFontSize();

	if (!this.item.pnw.eq(zone.pnw)) {
		peer.setPNW(this.item, zone.pnw);
		this._fabric$flag = false; // TODO this should happen by setting in peer<F12>...
	}
	if (fontsize !== this.item.get('fontsize')) {
		peer.setFontSize(this.item, fontsize);
		this._fabric$flag = false; // TODO same
	}
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.     .      .
  `|__/ ,-. |  ,-. |- . ,-. ,-.
  )| \  |-' |  ,-| |  | | | | |
  `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (or other relations)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
|
| TODO!|
*/
/*function Relation(id, i1id, i2id, textZone, dtree) {
	Item.call(this, id);
	this.handles      = Relation.handles;
	this.i1id         = i1id;
	this.i2id         = i2id;
	this.dtree        = dtree;
	dtree.parent      = this;
	dtree.pre         = true;
	this.imargin      = Relation.imargin;
	this.setTextZone(textZone);
	this._fabric      = new Fabric();
	this._fabric$flag = false;

	//System.repository.addItem(this, true);
	//System.repository.addOnlook(this.id, this.i1id);  TODO
	//System.repository.addOnlook(this.id, this.i2id);
}
subclass(Relation, VItem);
*/

/**
| Default margin for all relations.
*/
//Relation.imargin = new Margin(settings.relation.imargin);

/**
| Creates a new Relation.
*/
/*Relation.create = function(item1, item2) {
	throw new Error('TODO');
	var dtree = new DTree(20);
	dtree.append(new Para('relates to'));
	var cline = Line.connect(item1.handlezone, null, item2.handlezone, null); // TODO bindzone
	var mx = (cline.p1.x + cline.p2.x) / 2; // TODO teach line pc
	var my = (cline.p1.y + cline.p2.y) / 2;
	var textZone = new Rect(
		new Point(R(mx - dtree.width / 2), R(my - dtree.height / 2)),
		new Point(R(mx + dtree.width / 2), R(my + dtree.height / 2)));
	return new Relation(null, item1.id, item2.id, textZone, dtree);
}*/

/**
| Called when an item is removed.
*/
/*Relation.prototype.removed = function() {
	// TODO
	//System.repository.removeOnlook(this.id, this.i1id);
	//System.repository.removeOnlook(this.id, this.i2id);
}*/


/*
Relation.prototype.draw = function(fabric, action, selection) {
	var f = this._fabric;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // TODO funcall
	var it2 = System.repository.items[this.i2id];
	if (!this._fabric$flag) {
		f.attune(this.textZone);
		f.edge(settings.relation.style.labeledge, f, 'path');
		dtree.draw(f, action, selection, this.imargin, 0);
		this._fabric$flag = true;
	}
	var l1 = Line.connect(it1.handlezone, 'normal', this.textZone, 'normal'); // TODO bindzone
	var l2 = Line.connect(this.textZone,  'normal', it2.handlezone, 'arrow'); // TODO bindzone
	// TODO combine into one call;
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l1, 'path');
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l2, 'path');
	// draws text
	fabric.drawImage(f, this.textZone.pnw);
}
*/
