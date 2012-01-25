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

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

'use strict';
var meshio;
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
	defaultFont : 'Verdana,Geneva,Kalimati,sans-serif',

	// milliseconds after mouse down, dragging starts
	dragtime : 400,

	// pixels after mouse down and move, dragging starts
	dragbox  : 10,

	// factor to add to the bottom of font height
	bottombox : 0.22,

	// standard note in space
	note : {
		minWidth  :  40,
		minHeight :  40,
		newWidth  : 300,
		newHeight : 150,

		// inner margin to text
		imargin  : { n: 5, e: 5, s: 5, w: 5 },

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
		style : {
			edge : [
				{ border: 0, width: 0.2, color: 'rgba(200, 100, 0, 0.5)' },
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
| Mouse state
*/
var MST = {
	NONE   : 0, // button is up
	ATWEEN : 1, // mouse just came down, unsure if click or drag
	DRAG   : 2  // mouse is dragging
};
Object.freeze(MST);

/**
| Interface action active.
*/
// TODO remove
var ACT = {
	NONE    : 0, // idle
	SCROLLY : 4, // scrolling a note
	RBIND   : 7  // dragging a new relation
};
Object.freeze(ACT);

var TXE = {
	/* which kind of event transfix() calls for all items which intersect x/y */
	NONE       : 0,
	DRAGSTART  : 1,
	HOVER      : 2,
	RBINDHOVER : 3,
	RBINDTO    : 4,
}
Object.freeze(TXE);


/**
| onlook() events
*/
var ONLOOK = {
	NONE   : 0,
	UPDATE : 1,
	REMOVE : 2,
}
Object.freeze(ONLOOK);

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
	this.entity = entity;
	this.offset = offset;
	this.retain$x = typeof retainX !== 'undefined' ? retainX : null;
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
Caret.useGetImageData = false;

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
	if (this.shown && !this.blinked && this.entity) {
		this.entity.drawCaret();
	}
}

/**
| Inserts a new line
*/
/*Caret.prototype.newline = function() {
	var caret  = this.caret;
	var ce    = caret.element;
	var co    = caret.offset;
	var ct    = ce.text;
	// todo multi node ability
	var opara = ce.anchestor(Para);

	ce.text = ct.substring(0, co);
	var npara = new Para(ct.substring(co, ct.length));
	opara.parent.insertBefore(npara, opara.next);
	caret.set(npara.first, 0);
}*/



/**
| Switches caret visibility state.
*/
Caret.prototype.blink = function() {
	if (this.shown) {
		this.blinked = !this.blinked;
		this.update();
	}
}


/**
| Received a input from user
| returns true if redraw is needed
*/
/*Caret.prototype.input = function(item, text) {
	if (!item) return false;
	var caret = this.caret;
	if (this.selection.active) {
		this.deleteSelection();
	}
	var reg = /([^\n]+)(\n?)/g;
	for(var ca = reg.exec(text); ca != null; ca = reg.exec(text)) {
		var line = ca[1];
		var ce = caret.element;
		var co = caret.offset;
		var ct = ce.text;
		ce.text = ct.substring(0, co) + line + ct.substring(co, ct.length);
		this.caret.offset += text.length;
		if (ca[2]) {
			this.newline();
		}
	}
	ce.listen();
	throw new Error('TODO');
	//System.repository.updateItem(item);
	return true;
}*/

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
		// ^ todo make multi child compatible
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
			// ^ todo make multi child compatible
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
function Action(type, item, start) {
	this.type  = type;
	this.item  = item;
	this.start = start;
}

/**
| Action enums. TODO fixate
*/
Action.PAN        = 1; // panning the background
Action.ITEMDRAG   = 2; // draggine one item
Action.ITEMRESIZE = 3; // resizing one item
Action.FLOATMENU  = 4; // clicked the float menu (background click)
Action.ITEMMENU   = 5; // clicked one item menu

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
// todo, use this!
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
Cockpit.prototype.mousehover = function(p, shift, ctrl) {
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
Cockpit.prototype.mousedown = function(p, shift, ctrl) {
	/*
	var md = this.edgemenu.getMousepos(p);
	if (md >= 0) {
		iaction.act = ACT.NONE;
		redraw = true;
		switch(md) {
		case 0: this._exportDialog(); break;
		case 1: this._revertDialog(); break;
		case 2: this._importDialog(); break;
		}
		if (redraw) this.redraw();
		return MST.NONE;
	}
	*/
	return false;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Shell++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The users shell.

 Consists of the Cockpit and the Space s/he is viewing.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Shell(fabric) {
	if (shell !== null) throw new Error('Singleton not single');
	shell = this;

	Measure.init();
	this.fabric    = fabric;
	this.space     = null;

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
	// if (!this.focus) return // TODO
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
// TODO rather name it start/stop Action
Shell.prototype.beginAction = function(type, item, start) {
	if (this.action) throw new Error('double action');
	return this.action = new Action(type, item, start);
}

/**
| Ends an action.
*/
Shell.prototype.endAction = function() {
	if (!this.action) throw new Error('ending no action');
	this.action = null;
}

/**
| Draws the cockpit and the space.
*/
Shell.prototype._draw = function() {
	this.fabric.attune();   // <- bad name for clear();

	// remove caret cache.
	this.caret.save$ = null;
	this.caret.screenPos$ = null;

	this.space.draw();
	this.cockpit.draw();
	this.caret.update();

	this.redraw = false;
}

// TODO move shift/ctrl state to frontface

/**
| A mouse click.
*/
Shell.prototype.click = function(p, shift, ctrl) {
	// TODO cockpit
	this.space.click(p, shift, ctrl);
	if (this.redraw) this._draw();
}

/**
| Mouse hover.
|
| TODO shift+ctrl.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	// TODO cockpit
	this.space.mousehover(p, shift, ctrl);
	if (this.redraw) this._draw();
}

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	// TODO cockpit
	// TODO rename mst -> mouseState
	var mst = this.space.mousedown(p, shift, ctrl);
	if (this.redraw) this._draw();
	return mst;
}

/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(keyCode, shift, ctrl) {
	if (this.caret.entity !== null) {
		this.caret.entity.specialKey(keyCode, shift, ctrl);
	}

	if (this.redraw) this._draw();
}

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	if (this.caret.entity !== null) {
		this.caret.entity.input(text);
	}

	if (this.redraw) this._draw();
}

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	// TODO cockpit
	this.space.dragstart(p, shift, ctrl);
	if (this.redraw) this._draw();
}

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	// TODO cockpit
	this.space.dragmove(p, shift, ctrl);
	if (this.redraw) this._draw();
}

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	// TODO cockpit
	this.space.dragstop(p, shift, ctrl);
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
	// if we get all fancy we could do a delay here.
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
 ++ Nexus ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The root of spaces.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	Woods.Nexus.call(this, master);
}
subclass(Nexus, Woods.Nexus);

/**
| Seeds. Things that can grow on this twig.
*/
Nexus.prototype.seeds = {
	'Space' : Space,
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.
 \___  ,-. ,-. ,-. ,-.
     \ | | ,-| |   |-'
 `---' |-' `-^ `-' `-'
~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       '
 The place where all the items are.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor
*/
function Space(master) {
	Woods.Space.call(this, master);

	// TODO make a 'spaceface' or something like that
	this.fabric = new Fabric(system.fabric); 
	this.zoom = 1; // TODO

	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
}
subclass(Space, Woods.Space);

/**
| Seeds. Things that can grow on this twig.
*/
Space.prototype.seeds = {
    'ItemCopse' : ItemCopse,
    'ArcAlley'  : Woods.ArcAlley,
}

/**
| Redraws the complete space.
*/
Space.prototype.draw = function() {
	for(var zi = this.z.length - 1; zi >= 0; zi--) {
		var it = this.items.get(this.z.get(zi));
		it.draw(this.fabric);
	}

	if (this.focus) this.focus.drawHandles(this.fabric);

	var action = shell.action;
	switch (action && action.type) {
	case null:
		break;
	case Action.FLOATMENU :
		action.floatmenu.draw();
		break;
	case Action.ITEMMENU :
		action.itemmenu.draw();
		break;
	/* TODO
	case ACT.RBIND :
		var arrow = Line.connect(
				ia.item.handlezone, 'normal',
			(ia.item2 && ia.item2.handlezone) || ia.smp , 'arrow');
			// todo use something like bindzone
			if (ia.item2) ia.item2.highlight(this.fabric);
		arrow.draw(this.fabric);
		*/
	}
}


/**
| Sets the focussed item or loses it if null
*/
Space.prototype.setFocus = function(item) {
	if (this.focus === item) return;
	this.focus = item;
	if (item === null) return;

	meshio.moveToTop(this, item);

	/* TODO XXX
	var caret = system.editor.caret;
	if (item) {
		caret.set(item, item.dtree.first.first, 0);
		caret.show();
	} else {
		caret.hide();
		caret.set(null, null, null);
	}
	*/
}

/**
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
Space.prototype.mousehover = function(p, shift, ctrl) {
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
		// todo move into items
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

	// todo remove nulls by shiftKey, ctrlKey
	var hit = this._transfix(TXE.HOVER, pp, null, null);
	if (!hit) system.setCursor('crosshair');
	return true;
}

/**
| Asks every item that intersects with a point if it feels reponsible for an event.
*/
Space.prototype._transfix = function(txe, p, shift, ctrl) {
	for(var zi = 0, zlen = this.z.length; zi < zlen; zi++) {
		var it = this.items.get(this.z.get(zi));
		if (it.transfix(txe, p, shift, ctrl)) return true;
	}
	return false;
}


/**
| Starts creating a new relation.
*/
Space.prototype.actionSpawnRelation = function(item, p) {
	throw new Error('TODO');

	/*var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sp = ia.smp = p;
	system.setCursor('not-allowed');
	*/
}

/**
| Starts a scrolling action
*/
Space.prototype.actionScrollY = function(item, startY, scrollbar) {
	throw new Error('TODO');

	/*var ia  = this.iaction;
	ia.act  = ACT.SCROLLY;
	ia.item = item;
	ia.sy   = startY;
	ia.ssy  = scrollbar.pos;
	*/
}

/**
| Binds a relation.
*/
Space.prototype.actionRBindTo = function(toItem) {
	throw new Error('TODO');

	/*
	if (toItem.id === this.iaction.item.id) {
		console.log('not binding to itself');
		system.setCursor('default');
		return;
	}
	var rel = Relation.create(this.iaction.item, toItem);
	system.repository.updateItem(rel);
	*/
}

/**
| Hovering during relation binding.
*/
Space.prototype.actionRBindHover = function(toItem) {
	throw new Error('TODO');

	/*
	if (toItem.id === this.iaction.item.id) {
		system.setCursor('not-allowed');
		return;
	}
	system.setCursor('default');
	this.iaction.item2 = toItem;
	*/
}

/**
| Starts an operation with the mouse button held down.
*/
Space.prototype.dragstart = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);

	/* if (this.focus && this.focus.withinItemMenu(pp)) {
		this.actionSpawnRelation(this.focus, pp);
		this.redraw();
		return;
	} */

	if (this._transfix(TXE.DRAGSTART, pp, shift, ctrl)) return true;

	// otherwise do panning
	shell.beginAction(Action.PAN, null, pp);
	system.setCursor('crosshair');
	return true;
}

/**
| A mouse click.
*/
Space.prototype.click = function(p, shift, ctrl) {
	var pan = this.fabric.pan;
	var pp = p.sub(pan);

	// clicked the tab of the focused item?
	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		var action = shell.beginAction(Action.ITEMMENU, null, pp);
		var labels = {n : 'Remove'};
		action.itemmenu = new Hexmenu(focus.getH6Slice().pm.add(pan), settings.itemmenu, labels);
		shell.redraw = true;
		return;
	}

	// clicked some item?
	if (this._transfix(TXE.CLICK, pp, shift, ctrl)) return true;

	// otherwhise pop up the float menu
	var action = shell.beginAction(Action.FLOATMENU, null, p);
	action.floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);
	system.setCursor('default');
	this.setFocus(null);
	shell.redraw = true;
	return true;
}

/**
| Stops an operation with the mouse button held down.
*/
Space.prototype.dragstop = function(p, shift, ctrl) {
	var action = shell.action;
	var pp = p.sub(this.fabric.pan);
	if (!action) throw new Error('Dragstop without action?');
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		action.item.setZone(action.item.getZone());
		system.setCursor('default');
		shell.redraw = true;
		break;
	case Action.PAN :
		break;

	/* TODO
	case ACT.SCROLLY :
		iaction.sy   = null;
		break;
	case ACT.RBIND :
		iaction.smp = null;
		this._transfix(TXE.RBINDTO, pp, shift, ctrl);
		redraw = true;
		break;
	*/
	default :
		throw new Error('Invalid action in "Space.dragstop"');
	}
	shell.endAction();
}

/**
| Moving during an operation with the mouse button held down.
*/
Space.prototype.dragmove = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch(action.type) {
	case Action.PAN :
		this.fabric.pan = p.sub(action.start);
		// system.repository.savePan(this.pan); TODO!
		shell.redraw = true;
		return;
	case Action.ITEMRESIZE :
	case Action.ITEMDRAG :
		action.move = pp;
		shell.redraw = true;
		return;
	/* TODO
	case ACT.SCROLLY:
		// todo let the item scroll itself
		var dy = pp.y - iaction.sy;
		var it = iaction.item;
		var sbary = it.scrollbarY;
		var spos = iaction.ssy + sbary.max / sbary.zone.height * dy;
		it.setScrollbar(spos);
		this.redraw();
		return true;
	case ACT.RBIND :
		iaction.item2 = null;
		this._transfix(TXE.RBINDHOVER, pp, shift, ctrl);
		iaction.smp = pp;
		this.redraw();
		return true;
	*/
	default :
		throw new Error('unknown action code in Space.dragging: '+ action.type);
	}
}



/**
| Mouse button down event.
*/
Space.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch (action && action.type) {
	case null :
		break;
	case Action.FLOATMENU :
		var fm = action.floatmenu;
		var md = fm.getMousepos(p);
		shell.endAction();

		if (!md) break;
		switch(md) {
		case 'n' : // note
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			var pnw = fm.p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
			var pse = pnw.add(nw, nh);
			var note = meshio.newNote(this, new Rect(pnw, pse));
			this.setFocus(note);
			break;
		case 'ne' : // label
			throw new Error('TODO');
			var pnw = fm.p.sub(this.fabric.pan);
			var pse = pnw.add(100, 50);

			//var dtree = new DTree(20);  TODO
			//dtree.append(new Para('Label'));
			var label = new Label(null, new Rect(pnw, pse), dtree);
			label.moveto(pnw.sub(half(label.zone.width), half(label.zone.height)));
			this.setFocus(label);
			break;
		}
		shell.redraw = true;
		return MST.NONE;
	case Action.ITEMMENU :
		var im = action.itemmenu;
		var md = im.getMousepos(p);
		shell.endAction();
		
		if (!im) break; 
		switch(md) {
		case 'n': // remove
			this.setFocus(null);
			meshio.removeItem(this.focus);
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
			var action = shell.beginAction(Action.ITEMRESIZE, this.focus, pp);
			action.align = com;
			action.startZone = this.focus.getZone();
			system.setCursor(com+'-resize');

			return MST.DRAG;
		}
	}

	return MST.ATWEEN;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ItemCopse ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A copse of items (in a space).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ItemCopse(master) {
	Woods.ItemCopse.call(this, master);
}
subclass(ItemCopse, Woods.ItemCopse);

/**
| Seeds. Things that can grow on this twig.
*/
ItemCopse.prototype.seeds = {
    'Note' : Note,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ ViPara +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A visual paragraph representation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ViPara(para, vdoc) {
	this.para = para;

	// fabric caching
	this._fabric$      = new Fabric(0 ,0);
	this._fabric$flag  = false; // fabric up-to-date flag
	this._fabric$width = 0;

	// flow caching
	this._flow$ = [];

	this.pnw = null; // position of para in doc.
	para.addListener(this);
	this.vdoc = vdoc;
}

/**
| (re)flows the paragraph, positioning all chunks.
*/
ViPara.prototype.getFlow = function() {
	var para  = this.para;
	var doc   = para.getAnchestor('DocAlley');
	var item  = doc.parent;
	var zone  = item.getZone();
	var width = zone.width - item.imargin.x;

	if (this._flow$ && this._flow$.width === width) return this._flow$;

	if (shell.caret.entity === this) {
		// remove caret cache if its within this flow.
		shell.caret.cp$line  = null;
		shell.caret.cp$token = null;
	}

	// builds position informations.
	var flow  = this._flow$ = [];
	var spread = 0;  // width really used.

	var fontsize = doc.fontsize;

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = fontsize;
	Measure.font = doc.getFont();
	var space = Measure.width(' ');
	var line = 0;
	flow[line] = { a: [], y: y, o: 0 };

	// TODO go into subnodes instead
	var text = para.get('text');

	//var reg = !dtree.pre ? (/(\s*\S+)\s?(\s*)/g) : (/(.+)()$/g);
	//var reg = !dtree.pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g); TODO
	var reg = (/(\s*\S+|\s+$)\s?(\s*)/g);

	for(var ca = reg.exec(text); ca != null; ca = reg.exec(text)) {
		// a token is a word plus following hard spaces
		var token = ca[1] + ca[2];
		var w = Measure.width(token);
		xw = x + w + space;

		if (width > 0 && xw > width) {
			if (x > 0) {
				// soft break
				if (spread < xw) spread = xw;
				x = 0; xw = x + w + space;
				//y += R(doc.fontsize * (dtree.pre ? 1 : 1 + settings.bottombox));
				y += R(doc.fontsize * (1 + settings.bottombox));
				line++;
				flow[line] = {a: [], y: y, o: ca.index};
			} else {
				// horizontal overflow
				console.log('HORIZONTAL OVERFLOW'); // TODO
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
	flow.width  = width;
	flow.spread = spread;
	return flow;
}

/**
| Returns the offset closest to a point.
|
| point: the point to look for
| hit: if set ... TODO
*/
ViPara.prototype.getPointOffset = function(point, hit) {
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

	return this.getLineXOffset(line, point.x, hit);
}

/**
| Returns the offset in flowed line number and x coordinate.
|
| hit: todo
*/
ViPara.prototype.getLineXOffset = function(line, x, hit) {
	var flow = this.getFlow();
	var fline = flow[line];
	var ftoken;
	for (var token = 0; token < fline.a.length; token++) {
		ftoken = fline.a[token];
 		if (x <= ftoken.x + ftoken.w) break;
	}
	if (token >= fline.a.length) ftoken = fline.a[--token];

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
ViPara.prototype.input = function(text) {
	if (shell.caret.entity !== this) throw new Error('Invalid caret on input');
	var para = this.para;
	meshio.insertText(para, shell.caret.offset, text);
}

/**
| Handles a special key
*/
ViPara.prototype.specialKey = function(keycode, shift, ctrl) {
	if (shell.caret.entity !== this) throw new Error('Invalid caret on specialKey');

	var para = this.para;
	var caret  = shell.caret;
	var select = shell.selection;

	if (ctrl) {
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
	if (!shift && select.active) {
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
	} else if (shift && !select.active) {
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
		throw new Error('TODO');
		/*
		var co = caret.offset;
		var ce = caret.element;
		if (co > 0) {
			var t = ce.text;
			ce.text = t.substring(0, co - 1) + t.substring(co, t.length);
			caret.offset--;
			shell.redraw = true;
		} else {
			var para = ce.anchestor(Para);
			shell.redraw = para.joinToPrevious(ce, caret);
		}
		throw new Error('TODO');
		//System.repository.updateItem(item);
		break;*/
	case 13 : // return
		/*
		this.newline();
		shell.redraw = true;
		*/
		throw new Error('TODO');
		//System.repository.updateItem(item);
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
			if (vdoc.vAlley[key] !== this) throw new Error('vdoc.vAlley inconsistency');
			if (key > 0) {
				var ve = vdoc.vAlley[key - 1];
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
			if (vdoc.vAlley[key] !== this) throw new Error('vdoc.vAlley inconsistency');
			if (key > 0) {
				var ve = vdoc.vAlley[key - 1];
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
			if (vdoc.vAlley[key] !== this) throw new Error('vdoc.vAlley inconsistency');
			if (key < vdoc.vAlley.length - 1) {
				var ve = vdoc.vAlley[key + 1];
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
			if (vdoc.vAlley[key] !== this) throw new Error('vdoc.vAlley inconsistency');
			if (key < vdoc.vAlley.length - 1) {
				var ve = vdoc.vAlley[key + 1];
				var offset = ve.getLineXOffset(0, x);
				caret.set(ve, offset, x);
			}
		}
		break;
	case 46 : // del
		throw new Error('TODO');
		/*
		var co = caret.offset;
		var ce = caret.element;
		var ct = ce.text;
		if (co < ct.length) {
			ce.text = ct.substring(0, co) + ct.substring(co + 1, ct.length);
			shell.redraw = true;
		} else {
			var para = ce.anchestor(Para);
			shell.redraw = para.joinToNext(ce, caret);
		}
		//System.repository.updateItem(item);
		*/
		break;
	default :
		break;
	}


	/*
	if (shift && refresh) {
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
			item.listen();  // todo rename.
			shell.redraw = true;
		}
	}*/

	caret.show();
	shell.redraw = true; // TODO?
}

/**
| Draws the paragraph in its cache and returns it.
*/
ViPara.prototype.getFabric = function() {
	var para   = this.para;
	var flow   = this.getFlow();
	var width  = flow.width;
	var doc    = para.getAnchestor('DocAlley');
	var height = flow.height + R(doc.fontsize * settings.bottombox);

	// cache hit?
	if (this._fabric$flag && this._fabric$width === width && this._fabric$height === height) {
		return this._fabric$;
	}

	var fabric = this._fabric$;

	// TODO: work out exact height for text below baseline
	fabric.attune(width, height);
	fabric.fontStyle(doc.getFont(), 'black', 'start', 'alphabetic');

	// draws text into the fabric
	for(var a = 0, flowLen = flow.length; a < flowLen; a++) {
		var line = flow[a];
		for(var b = 0, lineLen = line.a.length; b < lineLen; b++) {
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
ViPara.prototype.event = function(event, p1, p2, p3) {
	var para = this.para;
	var doc  = para.getAnchestor('DocAlley'); //XXX replace with vdoc.
	doc.parent.poke();

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
ViPara.prototype.getOffsetPoint = function(offset, flowPos$) {
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
ViPara.prototype.drawCaret = function() {
	if (shell.caret.entity !== this) throw new Error('Drawing caret for invalid para');
	var para = this.para;
	var doc  = para.getAnchestor('DocAlley');
	var item = doc.parent;
	var zone = item.getZone();
	var caret = shell.caret;
	var pan = shell.space.fabric.pan;
	var th = R(doc.fontsize * (1 + settings.bottombox));

	caret.pos$ = this.getOffsetPoint(shell.caret.offset, shell.caret);

	//var sy = (it.scrollbarY && it.scrollbarY.visible && it.scrollbarY.pos) || 0; TODO

	var cyn = caret.pos$.y + this.pnw.y;
	var cys = cyn + th;
	var cyx = caret.pos$.x + this.pnw.x;

	cyn = min(max(cyn, 0), zone.height);
	cys = min(max(cys, 0), zone.height);
	if (cyn === cys) return;

	var cp = new Point(
		cyx + zone.pnw.x + pan.x - 1,
		cyn + zone.pnw.y + pan.y - th + 2);

	shell.caret.screenPos$ = cp;

	if (Caret.useGetImageData) {
		shell.caret.save$ = shell.fabric.getImageData(cp.x, cp.y, 3, th + 2);
	} else {
		// paradoxically this is often way faster, especially on firefox
		shell.caret.save$ = new Fabric(shell.fabric.width, shell.fabric.height);
		shell.caret.save$.drawImage(shell.fabric, 0, 0);
	}

	shell.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, th);
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
	// todo make part of selection to use shortcut with XY
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
 ,-_/ .
 '  | |- ,-. ,-,-.
 .^ | |  |-' | | |
 `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Something in a Space.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Item() {
	// TODO add $
	this._h6slice = null;
}

/**
| Return the hexagon slice that is the handle
*/
Item.prototype.getH6Slice = function() {
	var zone = this.getZone();

	if (this._h6slice && this._h6slice.psw.eq(zone.pnw)) return this._h6slice;

	return this._h6slice = new HexagonSlice(
		zone.pnw, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
};

/**
| Returns if point is within the item menu
*/
Item.prototype.withinItemMenu = function(p) {
	return this.getH6Slice().within(p);
}

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| todo rename
*/
Item.prototype.checkItemCompass = function(p) {
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
Item.prototype.pathResizeHandles = function(fabric, border, edge) {
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
Item.prototype.drawHandles = function(fabric) {
	// draws the resize handles
	fabric.edge(settings.handle.style.edge, this, 'pathResizeHandles');

	// draws item menu handler
	var sstyle = settings.itemmenu.slice.style;
	fabric.paint(sstyle.fill, sstyle.edge, this.getH6Slice(), 'path');
}

/**
| Called when item is removed
*/
Item.prototype.removed = function() {
	// nothing
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.             .  .  .
 \___  ,-. ,-. ,-. |  |  |-. ,-. ,-.
     \ |   |   | | |  |  | | ,-| |
 `---' `-' '   `-' `' `' ^-' `-^ '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A scrollbar.
 todo when finished moved above item.

 currently only vertical scrollbars.

 -8833 is a special position for 'not set'.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| parent: parent holding the scrollbar
*/
function Scrollbar(parent) {
	this.parent = parent;
	this.max      = null;
	this.visible  = false;
	this.pos      = 0;
	this.aperture = null;
	this.zone     = null;
}

/**
| Makes the path for fabric.edge/fill/paint.
| todo change descr on all path()s
*/
Scrollbar.prototype.path = function(fabric, border, edge) {
	if (border !== 0) throw new Error('Scrollbar.path does not support borders');
	var z = this.zone;
	var w = z.width;
	var size  = R(this.aperture * z.height / this.max);
	var msize = max(size, settings.scrollbar.minSize);
	var sy = z.pnw.y + R(this.pos * ((z.height - msize + size) / this.max));

	fabric.beginPath();
	fabric.moveTo(z.pnw.x, R(sy + cos30 * w / 2), edge);
	fabric.lineTo(z.pnw.x + R(w / 4),     sy,         edge);
	fabric.lineTo(z.pnw.x + R(w * 3 / 4), sy,         edge);
	fabric.lineTo(z.pse.x, R(sy + cos30 * w / 2), edge);

	fabric.lineTo(z.pse.x, R(sy + msize - cos30 * w / 2), edge);
	fabric.lineTo(z.pnw.x + R(w * 3 / 4), sy + msize,         edge);
	fabric.lineTo(z.pnw.x + R(w / 4),     sy + msize,         edge);
	fabric.lineTo(z.pnw.x, R(sy + msize - cos30 * w / 2), edge);
	fabric.closePath();
}

/**
| Paints the scrollbar.
*/
Scrollbar.prototype.paint = function(fabric) {
	fabric.paint(settings.scrollbar.style.fill, settings.scrollbar.style.edge, this, 'path');
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ DocAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of paragraphs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function DocAlley(master) {
    Woods.DocAlley.call(this, master);
	this.addListener(this); // TODO
	var valley = this.vAlley = [];

	for (var a = 0; a < this.length; a++) {
		valley[a] = new ViPara(this.get(a), this);
	}
}
subclass(DocAlley, Woods.DocAlley);

/**
| Seeds. Things that can grow on this twig.
*/
DocAlley.prototype.seeds = {
    'Para'    : Woods.Para,
	'Number'  : true,
};

/**
| TODO
*/
DocAlley.prototype.event = function(event, p1, p2, p3) {
	debug('DocAlley:event', event, p1, p2, p3);
}

/**
| Draws the document alley on a fabric.
| fabric: to draw upon.
| select:  selection object (for highlighting the selection)
| imargin: distance of text to edge
| scrollp: scroll position
*/
DocAlley.prototype.draw = function(fabric, imargin, scrollp) {
	// TODO <pre>
	var paraSep = half(this.fontsize);

	// paints the selection
	/* TODO
	if (selection.active && selection.mark1.item === this.parent) {
		// todo make paint()
		fabric.fill(
			settings.selection.style.fill, this, 'pathSelection',
			selection, imargin, scrolly);
		fabric.edge(
			settings.selection.style.edge, this, 'pathSelection',
			selection, imargin, scrolly);
	}
	*/

	var y = imargin.n;

	var valley = this.vAlley;
	// draws the paragraphs
	for (var a = 0; a < valley.length; a++) {
		var vpara = valley[a];
		var flow = vpara.getFlow();

		// TODO name pnw$
		vpara.pnw = new Point(imargin.w, R(y));
		fabric.drawImage(vpara.getFabric(), imargin.w, y - scrollp.y);
		y += flow.height + paraSep;
	}
}

/**
| Returns the default font of the dtree.
*/
DocAlley.prototype.getFont = function() {
	return this.fontsize + 'px ' + settings.defaultFont;
}

/**
| Returns the paragraph at point
*/
DocAlley.prototype.vParaAtPoint = function(p) {
	var valley = this.vAlley;
	for(var a = 0; a < valley.length; a++) {
		var vpara = valley[a];
		var flow = vpara.getFlow();
		if (p.y < vpara.pnw.y + flow.height) return vpara;
	}
	return null;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-.       .
 ` | |   ,-. |- ,-.
   | |-. | | |  |-'
  ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// todo make scrollbars an own object?

/**
| Constructor.
|
| id:    item id
| zone:  position and size of note.
| dtree: document tree.
*/
function Note(master) {
	Item.call(this);
	Woods.Note.call(this, master);

	this._fabric = new Fabric();
	this._fabric$flag = false; // up-to-date-flag
	this.imargin = Note.imargin;  // todo needed?
	this.scrollbarY = new Scrollbar(this, null);
}
subclass(Note, {Note: Woods.Note, Item: Item});

/**
| Seeds. Things that can grow on this twig.
*/
Note.prototype.seeds = {
	'DocAlley'  : DocAlley,
}

/**
| Default margin for all notes.
*/
Note.imargin = new Margin(settings.note.imargin);

/**
| Resize handles to show on notes.
*/
Note.prototype.handles = {
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true,
}
Object.freeze(Note.prototype.handles);

/**
| Highlights the  note
*/
Note.prototype.highlight = function(fabric) {
	// todo round rects
	fabric.edge(settings.note.style.highlight, this.zone, 'path');
}

/**
| Returns the para at point. todo, honor scroll here.
*/
Note.prototype.vParaAtPoint = function(p, action) {
	// TODO rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.doc.vParaAtPoint(p, action);
}

/**
| Checks if this items reacts on an event.
| Returns transfix code.
*/
Note.prototype.transfix = function(txe, p, shift, ctrl) {
	if (!this.zone.within(p)) return false;

	switch (txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return true;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			shell.redraw = true;
			return true;
		}
		shell.space.setFocus(this);
		shell.redraw = true;

		var sbary = this.scrollbarY;
		var pr = p.sub(this.zone.pnw);
		if (sbary.visible && sbary.zone.within(pr)) {
			//space.actionScrollY(this, p.y, this.scrollbarY);
			throw new Error('TODO');
		} else {
			shell.beginAction(Action.ITEMDRAG, this, p);
			system.setCursor('move');
		}
		return true;
	case TXE.CLICK :
		shell.space.setFocus(this);
		shell.redraw = true;

		// var op = p.sub(this.zone.pnw.w, this.zone.pnw.y - max(0, this.scrollbarY.pos)); TODO
		var pi = p.sub(this.zone.pnw.x, this.zone.pnw.y);

		var vpara = this.vParaAtPoint(pi);
		if (vpara) {
			var offset = vpara.getPointOffset(pi.sub(vpara.pnw));
			shell.caret.set(vpara, offset);
			shell.caret.show();
			// shell.selection.deselect(); TODO
		}
		return true;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		shell.redraw = true;
		return true;
	case TXE.RBINDTO :
		//space.actionRBindTo(this);
		throw new Error('TODO');
		shell.redraw = true;
		return true;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
	throw new Error('iFail');
}


/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Note.prototype.getZone = function() {
	var action = shell.action;
	if (!action || action.item !== this) return this.zone;
	// TODO cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		if (!action.move) return this.zone;
		return this.zone.add(action.move.x - action.start.x, action.move.y - action.start.y);

	case Action.ITEMRESIZE:
		if (!action.move) return this.zone;
		var ipnw = action.startZone.pnw;
		var ipse = action.startZone.pse;
		var dx = action.move.x - action.start.x;
		var dy = action.move.y - action.start.y;
		var minw = settings.note.minWidth;
		var minh = settings.note.minHeight;
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
		return this.zone;
	}
}


/**
| Sets the notes position and size.
|
| TODO this might as well be removed.
*/
Note.prototype.setZone = function(zone) {
	// ensures minimum size
	if (zone.width < settings.note.minWidth || zone.height < settings.note.minHeight) {
		log('fail', 'Note under minimum size!');
	}
	if (this.zone.eq(zone)) return;
	meshio.setZone(this, zone);

	// TODO this should happen by MeshIO settings...
	this._fabric$flag = false;
	// adapts scrollbar position
	this.setScrollbar();
}

/**
| Returns the notes silhoutte.
*/
Note.prototype.getSilhoutte = function(zone) {
	if (!this._silhoutte ||
		this._silhoutte.width  !== zone.width ||
		this._silhoutte.height !== zone.height)
	{
		return this._silhoutte = new RoundRect(
			Point.zero, new Point(zone.width, zone.height),
			settings.note.cornerRadius);
	}

	return this._silhoutte;
}

/**
| Returns the inner zone
*/
/* TODO unused?
Note.prototype.getInnerZone = function() {
	return this.getZone().reduce(this.imargin);
}
*/

/**
| Called by subvisuals when they got changed.
*/
Note.prototype.poke = function() {
	this._fabric$flag = false;
	shell.redraw = true;
}

/**
| Actualizes the scrollbar.
*/
Note.prototype.setScrollbar = function(pos) {
	var sbary = this.scrollbarY;
	if (!sbary.visible) return;
	sbary.max = this.dtree.height;
	// todo make a Rect.renew!
	sbary.zone = new Rect(
		Point.renew(
			this.zone.width - this.imargin.e - settings.scrollbar.strength,
			this.imargin.n,
			sbary.zone && sbary.zone.pnw),
		Point.renew(
			this.zone.width - this.imargin.e,
			this.zone.height - this.imargin.s - 1,
			sbary.zone && sbary.zone.pse));
	sbary.aperture = this.iheight;
	var smaxy = max(0, this.dtree.height - this.iheight);

	if (typeof(pos) !== 'undefined') sbary.pos = pos;
	if (sbary.pos > smaxy) sbary.pos = smaxy;
	if (sbary.pos < 0) sbary.pos = 0;
	if (typeof(pos) !== 'undefined') this.listen();
}


/**
| Draws the note.
|
| fabric: to draw upon.
| selection: current selection to highlight.
*/
Note.prototype.draw = function(fabric) {
	var f  = this._fabric;

	var zone = this.getZone();

	// no buffer hit?
	if (!this._fabric$flag || !this._fabric$size ||
		zone.width  !== this._fabric$size.width ||
		zone.height !== this._fabric$size.height)
	{
		var silhoutte = this.getSilhoutte(zone);

		// resize the canvas
		f.attune(zone);


		f.fill(settings.note.style.fill, silhoutte, 'path');

		var doc = this.doc;
//		doc.flowWidth = this.iwidth; TODOX

		// calculates if a scrollbar is needed
		/* TODO
		var sbary = this.scrollbarY;

		if (!sbary.visible && dtree.height > this.iheight) {
			// doesn't use a scrollbar but should
			sbary.visible = true;
			dtree.flowWidth = this.iwidth;
		} else if (sbary.visible && dtree.height <= this.iheight) {
			// uses a scrollbar but shouldn't
			sbary.visible = false;
			dtree.flowWidth = this.iwidth;
		}
		*/

		// paints selection and text
		//dtree.draw(f, selection, this.imargin, sbary.visible ? sbary.pos : 0);
		doc.draw(f, this.imargin, Point.zero); // TODO scrollp

		/*
		// paints the scrollbar
		if (sbary.visible) {
			this.setScrollbar();
			sbary.paint(f);
		}
		*/

		// paints the border
		f.edge(settings.note.style.edge, silhoutte, 'path');

		this._fabric$flag = true;
		this._fabric$size = zone;
	}

	fabric.drawImage(f, zone.pnw);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,       .       .
  )   ,-. |-. ,-. |
 /    ,-| | | |-' |
 `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An sizeable item with sizing text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
*/
function Label(id, zone, dtree) {
	Item.call(this, id);
	this.dtree = dtree;
	dtree.parent = this;
	dtree.pre = true;
	this.handles = Label.handles;
	this.imargin = Label.imargin;
	this.setZone(zone, 'c');
	// buffer
	this._fabric = new Fabric();
	this._fabric$flag = false;
	if (typeof(this.zone.pse.x) === 'undefined') throw new Error('Invalid label'); // todo remove
}
subclass(Label, Item);

/**
| Default margin for all labels.
*/
Label.imargin = new Margin(settings.label.imargin);

/**
| The resize handles the item presents.
*/
Label.handles = {
	ne : true,
	se : true,
	sw : true,
	nw : true,
}
Object.freeze(Label.handles);

/**
| An event happened at p.
| returns transfix code.
*/
Label.prototype.transfix = function(txe, p, shift, ctrl) {
	if (!this.zone.within(p)) return false;

	switch(txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return true;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			shell.redraw = true;
			return true;
		}
		shell.space.setFocus(this);

		shell.beginAction(Action.ITEMDRAG, this, p.sub(this.zone.pnw));
		System.setCursor('move');
		return true;
	case TXE.CLICK:
		shell.space.setFocus(this);
		var pi = p.sub(this.zone.pnw);
		var para = this.vParaAtPoint(pi);
		if (para) {
			throw new Error('TODO');
			/*
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			*/
			shell.redraw = true;
		}
		return true;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		shell.redraw = true;
		return true;
	case TXE.RBINDTO :
		throw new Error('TODO');
		//space.actionRBindTo(this);
		shell.redraw = true;
		return true;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
	throw new Error('iFail');
}

/**
| Highlights the label.
*/
Label.prototype.highlight = function(fabric) {
	fabric.edge(settings.label.style.highlight, this.zone, 'path');
}

/**
| Sets the zone of the label.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Label.prototype.setZone = function(zone, align) {
	if (this.zone && this.zone.eq(zone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.zone && dfs === fs) return false;
	this._lock = true;
	dtree.fontsize = fs;
	if (!this.zone) this.zone = zone;
	this.zone = this.zone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._fabric$flag = false;
	return true;
}

/**
| todo
*/
Label.prototype._dHeight = function() {
	return R(this.dtree.height * (1 + settings.bottombox));
}

/**
| todo
*/
Label.prototype._dWidth = function() {
	return max(this.dtree.width, R(0.4 * this.dtree.fontsize));
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Label.prototype, 'handlezone', {
	get : function() { return this.zone; }
});

/**
| Sets a new position.
*/
Label.prototype.moveto = function(pnw) {
	if (this.zone.pnw.eq(pnw)) return false;
	this.zone = this.zone.moveto(pnw);
	return this;
}

/**
| returns the para at point.
*/
Label.prototype.vParaAtPoint = function(p) {
	return this.dtree.vParaAtPoint(p);
}

/* drops the cache */
// TODO remove all listen()
Label.prototype.listen = function() {
	if (this._lock) return;
	this._fabric$flag = false;
	if (this.zone) {
		this.zone = this.zone.resize(this._dWidth(), this._dHeight(), 'c');
	}
	// end of listen-chain
}

/**
| Draws the Label.
|
| fabric: to draw upon.
| selection: Selection to highlight.
*/
Label.prototype.draw = function() {
	throw new Error('TODO');

	var f = this._fabric;
	var dtree = this.dtree;

	// buffer hit?
	if (this._fabric$flag) {
		fabric.drawImage(f, this.zone.pnw);
		return;
	}

	f.attune(this.zone);
	// draws text
	dtree.draw(f, action, selection, this.imargin, 0);
	// draws the border
	f.edge(settings.label.style.edge, f, 'path');
	this._canvasActual = true;
	fabric.drawImage(f, this.zone.pnw);
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
function Relation(id, i1id, i2id, textZone, dtree) {
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
subclass(Relation, Item);

/**
| Default margin for all relations.
*/
Relation.imargin = new Margin(settings.relation.imargin);

/**
| The resize handles a relation presents.
*/
// TODO into prototype
Relation.handles = {
	ne : true,
	se : true,
	sw : true,
	nw : true,
}
Object.freeze(Relation.handles);

/**
| Creates a new Relation.
*/
Relation.create = function(item1, item2) {
	throw new Error('TODO');
	var dtree = new DTree(20);
	dtree.append(new Para('relates to'));
	var cline = Line.connect(item1.handlezone, null, item2.handlezone, null); // todo bindzone
	var mx = (cline.p1.x + cline.p2.x) / 2; // todo teach line pc
	var my = (cline.p1.y + cline.p2.y) / 2;
	var textZone = new Rect(
		new Point(R(mx - dtree.width / 2), R(my - dtree.height / 2)),
		new Point(R(mx + dtree.width / 2), R(my + dtree.height / 2)));
	return new Relation(null, item1.id, item2.id, textZone, dtree);
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Relation.prototype, 'handlezone', {
	get : function() { return this.textZone; }
});

/**
| Called when an item is removed.
*/
Relation.prototype.removed = function() {
	// TODO
	//System.repository.removeOnlook(this.id, this.i1id);
	//System.repository.removeOnlook(this.id, this.i2id);
}

/**
| Highlights the label.
*/
Relation.prototype.highlight = function(fabric) {
	fabric.edge(settings.relation.style.highlight, this.textZone, 'path');
}

/**
| Sets the text zone of the relation.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Relation.prototype.setTextZone = function(zone, align) {
	if (this.textZone && this.textZone.eq(textZone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox)) * settings.relation.demagnify;
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.zone && dfs === fs) return false;
	dtree.fontsize = fs;
	th = R(this.dtree.height * (1 + settings.bottombox));
	// todo use rect resize?
	switch(align) {
	case 'sw' :
	case 'w'  :
	case 'nw' : // align right
		this.textZone = new Rect(zone.pse.add(-this.dtree.width, -zh), zone.pse);
		break;
	case 'c': // center
	default : // align left
		this.textZone = new Rect(zone.pnw, zone.pnw.add(this.dtree.width, zh));
		break;
	}
	this._fabric$flag = false;
	return true;
}

/**
| Sets the textZone of the relation.
| Also determines its fontsize.
| Returns true if something changed.
|
| zone: a rectangle
| align: compass direction
*/
Relation.prototype.setZone = function(zone, align) {
	if (this.textZone && this.textZone.eq(zone)) return false;
	var dtree = this.dtree;
	var zh = zone.height;
	var th = R(this.dtree.height * (1 + settings.bottombox));
	var dfs = dtree.fontsize;
	var fs = max(dfs * zh / th, 8);
	if (this.textZone && dfs === fs) return false;
	this._lock = true;
	dtree.fontsize = fs;
	if (!this.textZone) this.textZone = zone;
	this.textZone = this.textZone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._fabric$flag = false;
	return true;
}

/**
| todo
*/
Relation.prototype._dHeight = function() {
	return R(this.dtree.height * (1 + settings.bottombox));
}

/**
| todo
*/
Relation.prototype._dWidth = function() {
	return max(this.dtree.width, R(0.4 * this.dtree.fontsize));
}


/**
| An action happend.
| Returns transfix code.
*/
Relation.prototype.transfix = function(txe, p, shift, ctrl) {
	throw new Error('TODO');

	if (!this.textZone.within(p)) return false;

	switch(txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return true;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			shell.redraw = true;
			return true;
		}
		shell.space.setFocus(this);

		shell.beginAction(Action.ITEMDRAG, this, p.sub(this.handlezone.pnw));
		system.setCursor('move');
		return true;
	case TXE.CLICK:
		shell.space.setFocus(this);

		var pi = p.sub(this.textZone.pnw);
		var para = this.vParaAtPoint(pi);
		if (para) {
			/* TODO
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			*/
			shell.redraw = true;
		}
		return true;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		shell.redraw = true;
		return true;
	case TXE.RBINDTO :
		//space.actionRBindTo(this);
		throw new Error('TODO');
		shell.redraw = true;
		return true;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
	throw new Error('iFail');
}

/**
| Sets a new position of the textlabel.
*/
Relation.prototype.moveto = function(pnw) {
	if (this.textZone.pnw.eq(pnw)) return false;
	this.textZone = this.textZone.moveto(pnw);
	return this;
}

/**
| Returns the para at point.
*/
Relation.prototype.vParaAtPoint = function(p) {
	return this.dtree.vParaAtPoint(p);
}


/**
| Something has changed.
*/
Relation.prototype.listen = function() {
	if (this._lock) return;
	this._fabric$flag = false;
	if (this.textZone) {
		this.textZone = this.textZone.resize(this._dWidth(), this._dHeight(), 'c');
	}
	// end of listen chain
}

Relation.prototype.resize = function(width, height) {
	/*var dtree = this.dtree;
	var fs = max(dtree.fontsize * height / this.height, 8);
	if (dtree._fontsize == fs) return false;
	dtree.fontsize = fs;
	this._fabric$flag = false;
	return true;*/
	throw new Error('unimplemented');
}

/**
| Draws the item.
*/
Relation.prototype.draw = function(fabric, action, selection) {
	/* TODO
	var f = this._fabric;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
	if (!this._fabric$flag) {
		f.attune(this.textZone);
		f.edge(settings.relation.style.labeledge, f, 'path');
		dtree.draw(f, action, selection, this.imargin, 0);
		this._fabric$flag = true;
	}
	var l1 = Line.connect(it1.handlezone, 'normal', this.textZone, 'normal'); // todo bindzone
	var l2 = Line.connect(this.textZone,  'normal', it2.handlezone, 'arrow'); // todo bindzone
	// todo combine into one call;
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l1, 'path');
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l2, 'path');
	// draws text
	fabric.drawImage(f, this.textZone.pnw);
	*/
}

/**
| Something happend on an item onlooked.
*/
Relation.prototype.onlook = function(event, item) {
	/* TODO
	switch(event) {
	case ONLOOK.REMOVE :
		if (item.id != this.i1id && item.id != this.i2id) {
			throw new Error('Got onlook for not my item?');
		}
		System.repository.removeItem(this);
		// todo check for cycles
		break;
	case ONLOOK.UPDATE :
		//if ((item.id === this.i1id && !item.zone.eq(this.i1zone)) ||
		//    (item.id === this.i2id && !item.zone.eq(this.i2zone))) {
		//	this._arrow = null;
		//}
		break;
	default :
		throw new Error('unknown unlook event');
	}*/
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.           .   ,-_/ ,,--.
 `,| | |   ,-. ,-. |-. '  | |`, |
   | ; | . |-' `-. | | .^ | |   |
   '   `-' `-' `-' ' ' `--' `---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Communicates with the server, holds caches.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function MeshIO() {
	this.mm = new MeshMashine(Nexus, true);

	var spacepath = new Path(['welcome']);

	// for now hand init
	var asw = this.mm.alter(0,
		new Signature({
	 	  val: {
		    type: 'Space',
		    items: {
		      '0' : {
		        type: 'Note',
		        zone: {
		          pnw : { 'x': 100, 'y': 100 },
		          pse : { 'x': 400, 'y': 250 },
		        },
		        doc: {
		          fontsize : 13,

		          alley : [
		            {
		              type: 'Para',
		              text: 'If you can dream---and not make dreams your master;',
		            }, {
	                  type: 'Para',
	                  text: 'If you can think---and not make thoughts your aim,',
	                }, {
		              type: 'Para',
		              text: 'If you can meet with Triumph and Disaster',
	                }, {
		              type: 'Para',
		              text: 'And treat those two impostors just the same',
		            },
		          ],
		        },
		      },
		      '1' : {
		        type: 'Note',
		        zone: {
		          pnw : { 'x': 450, 'y': 120 },
		          pse : { 'x': 650, 'y': 250 },
		        },
		        doc: {
		          fontsize : 13,

		          alley : [
		            {
		              type: 'Para',
		              text: 'Muhkuh',
		            },
		          ],
		        },
			  },
		    },
			'z' : {
			  alley : [
			    '0', '1',
			  ],
			}
		  },
		}), new Signature({
		  path: spacepath
		})
	);
	if (asw.ok !== true) throw new Error('Cannot init Repository');

	asw = this.mm.get(-1, spacepath);
	if (asw.ok !== true) throw new Error('Cannot reget own Space');
	system.shell.space = asw.node;  // TODO HACK
}

/**
| Creates a new note.
*/
MeshIO.prototype.newNote = function(space, zone) {
	var path = new Path(space);
	path.push('items');
	path.push('$new');

	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'Note',
				'zone': zone,
				'doc': {
					fontsize : 13,
					alley: [ ]
				},
			},
		}), new Signature({
			path: path,
		})
	);

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot reget new Note');

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: apath.get(-1),
		}),
		new Signature({
			at1 : 0,
			path: new Path([space.key$, 'z']), // TODO getOwnKey
		})
	);

	var k = apath.get(-1);
	return space.items.get(k);
}

/**
| Sets the zone for item.
*/
MeshIO.prototype.setZone = function(item, zone) {
	var path = new Path(item);
	path.set(path.length, 'zone');

	this.mm.alter(-1,
		new Signature({
			val: zone,
		}),
		new Signature({
			path: path,
		})
	);
}

/**
| Moves an item up to the z-index
*/
MeshIO.prototype.moveToTop = function(space, item) {
	var path = new Path(space);
	path.set(path.length, 'z');
	var key = item.getOwnKey();
	var at1 = space.z.indexOf(key);

	if (at1 === 0) return;

	this.mm.alter(-1,
		new Signature({
			path: path,
			at1: at1,
		}),
		new Signature({
			proc: 'arrange',
		})
	);

	this.mm.alter(-1,
		new Signature({
			proc: 'arrange',
			val: key,
		}),
		new Signature({
			path: path,
			at1 : 0,
		})
	);
}

/**
| Inserts some text.
*/
MeshIO.prototype.insertText = function(item, offset, text) {
	var path = new Path(item);
	path.push('text');

	this.mm.alter(-1,
		new Signature({
			val: text,
		}),
		new Signature({
			path: path,
			at1: offset,
		})
	);
}

/**
| Removes an item.
*/
MeshIO.prototype.removeItem = function(item) {
	debug('TODO');
}
