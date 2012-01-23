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
	IMENU   : 6, // clicked one item menu
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
 ++ Bubble +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Used for event bubbling
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Bubble() {
	this.init();
}

/**
| Resets this bubble event.
*/
Bubble.prototype.init = function() {
	this.hit    = false;
	this.redraw = false;
	return this;
}

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
Caret.prototype.update = function(face) {
	var fabric = face.fabric;

	// erases the old caret
	if (face.caret.save$) {
		face.fabric.putImageData(face.caret.save$, face.caret.screenPos$);
		face.caret.save$ = face.caret.screenPos$ = null;
	}

	// draws new
	if (this.shown && !this.blinked && this.entity) {
		this.entity.drawCaret(face);
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
Caret.prototype.blink = function(face) {
	if (this.shown) {
		this.blinked = !this.blinked;
		this.update(face);
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
Cockpit.prototype.redraw = function(face) {
	// TODO
}

/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(face, bubble, p, shift, ctrl) {
	/* TODO
	var redraw = this.edgemenu.mousepos !== this.edgemenu.getMousepos(p);
	if (this.edgemenu.mousepos >= 0) {
		// mouse floated on edge menu, no need to look further
		system.setCursor('default');
		if (redraw) this.redraw();
		return;
	}
	*/
}

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(face, bubble, p, shift, ctrl) {
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
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++FrontFace++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The users front face.

 Consists of the Cockpit and the Space s/he is viewing.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function FrontFace(fabric) {
	Measure.init();
	this.fabric    = fabric;
	this.space     = null;

	this.cockpit   = new Cockpit();
	this.caret     = new Caret();
	this.bubble    = new Bubble();

	this.action    = null;
	this.selection = new Selection();
}

/**
| Meshcraft got the systems focus.
*/
FrontFace.prototype.systemFocus = function() {
	// if (!this.focus) return // TODO
	this.caret.show();
	this.caret.update(this);
}

/**
| Meshraft lost the systems focus.
*/
FrontFace.prototype.systemBlur = function() {
	this.caret.hide();
	this.caret.update(this);
}

/**
| Blink the caret (if shown)
*/
FrontFace.prototype.blink = function() {
	this.caret.blink(this);
}

/**
| Creates an action
*/
// TODO rather name it start/stop Action
FrontFace.prototype.beginAction = function(type, item, start) {
	if (this.action) throw new Error('double action');
	return this.action = new Action(type, item, start);
}

FrontFace.prototype.endAction = function() {
	if (!this.action) throw new Error('ending no action');
	this.action = null;
}

/**
| Redraws the cockpit and the space.
*/
FrontFace.prototype.redraw = function() {
	this.fabric.attune();   // <- bad name for clear();

	// remove caret cache.
	this.caret.save$ = null;
	this.caret.screenPos$ = null;

	this.space.redraw(this);
	this.cockpit.redraw(this);
	this.caret.update(this);
}

// TODO move shift/ctrl state to frontface

/**
| A mouse click.
*/
FrontFace.prototype.click = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	this.space.click(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
}

/**
| Mouse hover.
|
| TODO shift+ctrl.
*/
FrontFace.prototype.mousehover = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	this.space.mousehover(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
}

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
FrontFace.prototype.mousedown = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	// TODO rename mst -> mouseState
	var mst = this.space.mousedown(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
	return mst;
}

/**
| User pressed a special key.
*/
FrontFace.prototype.specialKey = function(keyCode, shift, ctrl) {
	var bubble = this.bubble.init();

	if (this.caret.entity !== null) {
		this.caret.entity.specialKey(this, bubble, keyCode, shift, ctrl);
	}

	if (bubble.redraw) this.redraw();
}

/**
| User entered normal text (one character or more).
*/
FrontFace.prototype.input = function(text) {
	throw new Error('TODO');
	//system.editor.input(this.focus, text);
	//if (redraw) this.redraw();
}

/**
| Starts an operation with the mouse button held down.
*/
FrontFace.prototype.dragstart = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	this.space.dragstart(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
}

/**
| Moving during an operation with the mouse button held down.
*/
FrontFace.prototype.dragmove = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	this.space.dragmove(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
}

/**
| Stops an operation with the mouse button held down.
*/
FrontFace.prototype.dragstop = function(p, shift, ctrl) {
	// TODO cockpit
	var bubble = this.bubble.init();
	this.space.dragstop(this, bubble, p, shift, ctrl);
	if (bubble.redraw) this.redraw();
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
.-,--.   .
 `\__  ,-| ,-. ,-. ,-,-. ,-. ,-. . .
  /    | | | | |-' | | | |-' | | | |
 '`--' `-^ `-| `-' ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            `'
  The menu at the screen edge.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Constructor.
*/
/*
function Edgemenu() {
	// section mouse hovers over/clicks
	this.mousepos = -1;

	// widths of buttons (meassured on bottom)
	this.buttonWidths = [100, 150, 100];

	// label texts
	this.labels = ['Export', 'Meshcraft Demospace', 'Import'];

	// total width
	var width = 0;
	for(var b in this.buttonWidths) {
		width += this.buttonWidths[b];
	}
	this.width = width;

	// total height
	this.height = 30;
}
*/

/**
| Makes the edgemenu's path.
|
| fabric : to path upon
| border : additional inward distance
| section:
|   -2 structure frame
|   -1 outer frame
|   >0 buttons
*/
/*
Edgemenu.prototype.path = function(fabric, border, edge, section) {
	var b =  border;
	// width half
	var w2 = half(this.width);
	// x in the middle
	var xm = half(this.pnw.x + this.pse.x);
	// edge width (diagonal extra)
	var ew  = R((this.pse.y - this.pnw.y) * tan30);

	fabric.beginPath();
	if (section === -2) {
		// structure frame
		fabric.moveTo(this.pnw.x + b,      this.pse.y,     edge);
		fabric.lineTo(this.pnw.x + ew + b, this.pnw.y + b, edge);
		fabric.lineTo(this.pse.x - ew - b, this.pnw.y + b, edge);
		fabric.lineTo(this.pse.x - b,      this.pse.y,     edge);

		// x-position of button
		var bx = this.pnw.x;
		for(var b = 0; b < this.buttonWidths.length - 1; b++) {
			bx += this.buttonWidths[b];
			fabric.moveTo(bx, this.pse.y);
			if (b % 2 === 0) {
				fabric.lineTo(bx - ew, this.pnw.y, edge);
			} else {
				fabric.lineTo(bx + ew, this.pnw.y, edge);
			}
		}
	} else if (section === -1) {
		// outer frame
		fabric.moveTo(this.pnw.x + b,      this.pse.y,     edge);
		fabric.lineTo(this.pnw.x + ew + b, this.pnw.y + b, edge);
		fabric.lineTo(this.pse.x - ew - b, this.pnw.y + b, edge);
		fabric.lineTo(this.pse.x - b,      this.pse.y,     edge);
	} else {
		if (section < 0) throw new Error('invalid section');
		var bx = this.pnw.x;
		for(var b = 0; b < section; b++) {
			bx += this.buttonWidths[b];
		}
		fabric.moveTo(bx, this.pse.y);
		if (section % 2 === 0) {
			fabric.lineTo(bx + ew, this.pnw.y, edge);
			bx += this.buttonWidths[section];
			fabric.lineTo(bx - ew, this.pnw.y, edge);
			fabric.lineTo(bx,      this.pse.y, edge);
		} else {
			fabric.lineTo(bx - ew, this.pnw.y, edge);
			bx += this.buttonWidths[section];
			fabric.lineTo(bx + ew, this.pnw.y, edge);
			fabric.lineTo(bx,      this.pse.y, edge);
		}
	}
}
*/

/**
| Draws the edgemenu.
*/
/*
Edgemenu.prototype.draw = function() {
	var f = System.fabric;
	var xm  = half(f.width);
	var w2  = half(this.width);

	this.pnw = Point.renew(xm - w2, f.height - this.height, this.pnw, this.pse);
	this.pse = Point.renew(xm + w2, f.height, this.pnw, this.pse);

	f.fill(settings.edgemenu.style.fill, this, 'path', -1); // todo combine path-1
	if (this.mousepos >= 0) {
		f.fill(settings.edgemenu.style.select, this, 'path', this.mousepos);
	}
	f.edge(settings.edgemenu.style.edge, this, 'path', -2);

	f.fontStyle('12px ' + settings.defaultFont, 'black', 'center', 'middle');
	var bx = this.pnw.x;
	var my = half(this.pnw.y + this.pse.y);
	for(var i = 0; i < this.labels.length; i++) {
		f.fillText(this.labels[i], bx + half(this.buttonWidths[i]), my);
		bx += this.buttonWidths[i];
	}
}
*/

/**
| Returns which section the position is at.
| todo rename
*/
/*
Edgemenu.prototype.getMousepos = function(p) {
	var f = System.fabric;
	if (!this.pnw || !this.pse) return this.mousepos = -1;
	if (p.y < this.pnw.y) return this.mousepos = -1;
	var mx = half(f.width);  // todo give it pc
	var ew = R((this.pse.y - this.pnw.y) * tan30); // todo simplify
	// shortcut name = letters for formula
	var pymcht6 = (p.y - f.height) * tan30;

	if (p.x - this.pnw.x < -pymcht6) return this.mousepos = -1;
	if (p.x - this.pse.x >  pymcht6) return this.mousepos = -1;
	var bx = this.pnw.x;
	for(var mp = 0; mp < this.buttonWidths.length; mp++) {
		bx += this.buttonWidths[mp];
		if (mp % 2 === 0) {
			if (p.x - bx < pymcht6) return this.mousepos = mp;
		} else {
			if (p.x - bx < -pymcht6) return this.mousepos = mp;
		}
	}
	throw new Error('this code should not be reached');
	return this.mousepos = -1;
}
*/


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
Space.prototype.redraw = function(face) {
	for(var zi = this.z.length - 1; zi >= 0; zi--) {
		var it = this.items.get(this.z.get(zi));
		it.draw(face, this.fabric);
	}

	if (this.focus) this.focus.drawHandles(face, this.fabric);

	var action = face.action;
	switch (action && action.type) {
	case null:
		break;
	case Action.FLOATMENU :
		action.floatmenu.draw(face);
		break;
	/* TODO
	case ACT.IMENU :
		this._itemmenu.draw();
		break;
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
| Returns true for redrawing.
*/
Space.prototype.mousehover = function(face, bubble, p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);

	var action = face.action;
	switch(action && action.type) {
	case null : break;
	case Action.FLOATMENU :
		if (action.floatmenu.mousepos !== action.floatmenu.getMousepos(p)) {
			// float menu changed
			bubble.redraw = true;
		}
		if (action.floatmenu.mousepos >= 0) {
			// mouse floated on float menu
			bubble.hit = true;
			system.setCursor('default');
			return;
		}
		break;
	/* TODO
	case ACT.IMENU :
		redraw = (this._itemmenu.mousepos !== this._itemmenu.getMousepos(p)) || redraw;
		if (this._itemmenu.mousepos >= 0) {
			// mouse floated on item menu, no need to look further
			system.setCursor('default');
			if (redraw) this.redraw();
			return;
		}
		break;
	*/
	}

	if (this.focus) {
		// todo move into items
		if (this.focus.withinItemMenu(face, pp)) {
			system.setCursor('pointer');
			bubble.hit = true;
			return;
		}

		var com = this.focus.checkItemCompass(face, pp);
		if (com) {
			system.setCursor(com+'-resize');
			bubble.hit = true;
			return;
		}
	}

	// todo remove nulls by shiftKey, ctrlKey
	this._transfix(TXE.HOVER, face, bubble, pp, null, null);
	if (!bubble.hit) system.setCursor('crosshair');
}

/**
| Asks every item that intersects with a point if it feels reponsible for an event.
*/
Space.prototype._transfix = function(txe, face, bubble, p, shift, ctrl) {
	if (bubble.hit) throw new Error('Bubble already hit in _transfix');

	for(var zi = 0, zlen = this.z.length; zi < zlen; zi++) {
		var it = this.items.get(this.z.get(zi));
		it.transfix(txe, face, bubble, p, shift, ctrl);
		if (bubble.hit) return;
	}
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
Space.prototype.dragstart = function(face, bubble, p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);

	/* if (this.focus && this.focus.withinItemMenu(face, pp)) {
		this.actionSpawnRelation(this.focus, pp);
		this.redraw();
		return;
	} */

	this._transfix(TXE.DRAGSTART, face, bubble, pp, shift, ctrl);

	if (!bubble.hit) {
		// panning
		face.beginAction(Action.PAN, null, pp);
		system.setCursor('crosshair');
	}
}

/**
| A mouse click.
*/
Space.prototype.click = function(face, bubble, p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);

	/* TODO X2
	var focus = this.focus;
	if (focus && focus.withinItemMenu(face, pp)) {
		this._itemmenu = focus.newItemMenu(this.pan);
		this.iaction.act = ACT.IMENU;
		this.redraw();
		return;
	}
	*/

	this._transfix(TXE.CLICK, face, bubble, pp, shift, ctrl);

	if (!bubble.hit) {
		var action = face.beginAction(Action.FLOATMENU, null, p);
		action.floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);
		system.setCursor('default');
		this.setFocus(null);
		bubble.redraw = true;
	}
}

/**
| Stops an operation with the mouse button held down.
*/
Space.prototype.dragstop = function(face, bubble, p, shift, ctrl) {
	var action = face.action;
	var pp = p.sub(this.fabric.pan);
	if (!action) throw new Error('Dragstop without action?');
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		action.item.setZone(action.item.getZone(face));
		system.setCursor('default');
		bubble.redraw = true;
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
	face.endAction();
}

/**
| Moving during an operation with the mouse button held down.
*/
Space.prototype.dragmove = function(face, bubble, p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = face.action;

	switch(action.type) {
	case Action.PAN :
		this.fabric.pan = p.sub(action.start);
		// system.repository.savePan(this.pan); TODO!
		bubble.redraw = true;
		return;
	case Action.ITEMRESIZE :
	case Action.ITEMDRAG :
		action.move = pp;
		bubble.redraw = true;
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
Space.prototype.mousedown = function(face, bubble, p, shift, ctrl) {
	var pp = p.sub(this.fabric.pan);
	var action = face.action;

	switch (action && action.type) {
	case null :
		break;
	case Action.FLOATMENU :
		var fm = action.floatmenu;
		var md = fm.getMousepos(p);
		face.endAction();
		if (md < 0) break;
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
		bubble.redraw = true;
		return MST.NONE;
	/* TODO
	case ACT.IMENU :
		var md = this._itemmenu.getMousepos(p);
		iaction.act = ACT.NONE;
		bubble.redraw = true;
		if (md) {
			switch(md) {
			case 'n':
				system.repository.removeItem(this.focus);
				this.setFocus(null);
				break;
			}
			return MST.NONE;
		}
		break;
	*/
	}

	if (this.focus) {
		if (this.focus.withinItemMenu(face, p)) return MST.ATWEEN;
		var com = this.focus.checkItemCompass(face, pp);
		if (com) {
			// resizing
			var action = face.beginAction(Action.ITEMRESIZE, this.focus, pp);
			action.align = com;
			action.startZone = this.focus.getZone(face);
			system.setCursor(com+'-resize');

			return MST.DRAG;
		}
	}

	return MST.ATWEEN;
}

Space.prototype.mousewheel = function(wheel) {
	if (wheel > 0) {
		this.zoom *= 1.1;
	} else {
		this.zoom /= 1.1;
	}
	if (abs(this.zoom - 1) < 0.0001) {
		this.zoom = 1;
	}
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
 .-,--.                             .
  '|__/ ,-. ,-. ,-. ,-. ,-. ,-. ,-. |-.
  ,|    ,-| |   ,-| | | |   ,-| | | | |
  `'    `-^ '   `-^ `-| '   `-^ |-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A paragraph.        `'         '
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function Para(master) {
	Woods.Para.call(this, master);

	// fabric caching
	this._fabric$      = new Fabric(0 ,0);
	this._fabric$flag  = false; // fabric up-to-date flag
	this._fabric$width = 0;

	// flow caching
	this._flow$       = [];

	// TODO rename pnw$
	this.pnw = null; // position of para in doc.
}
subclass(Para, Woods.Para);

/**
| (re)flows the paragraph, positioning all chunks.
*/
Para.prototype.getFlow = function(face) {
	var item = this.getAnchestor('DocAlley').parent;
	var zone = item.getZone(face);
	var width = zone.width - item.imargin.x;

	if (this._flow$ && this._flow$.width === width) return this._flow$;
	// debug('flowing');

	if (face.caret.entity === this) {
		// remove caret cache if its within this flow.
		face.caret.cp$line  = null;
		face.caret.cp$token = null;
	}

	// builds position informations.
	var flow  = this._flow$ = [];
	var spread = 0;  // width really used.

	var doc = this.getAnchestor('DocAlley');
	var fontsize = doc.fontsize;

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = fontsize;
	Measure.font = doc.getFont();
	var space = Measure.width(' ');
	var line = 0;
	flow[line] = { a: [], y: y, o: 0 };

	// TODO go into subnodes instead
	var text = this.get('text');

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
| face: the frontface
| point: the point to look for
| hit: if set ... TODO
*/
Para.prototype.getPointOffset = function(face, point, hit) {
	var flow = this.getFlow(face);
	Measure.font = this.parent.font;

	var line;
	for (line = 0; line < flow.length; line++) {
		if (point.y <= flow[line].y) {
			break;
		}
	}
	if (line >= flow.length) line--;

	return this.getLineXOffset(face, line, point.x, hit);
}

/**
| Returns the offset in flowed line number and x coordinate.
|
| hit: todo
*/
Para.prototype.getLineXOffset = function(face, line, x, hit) {
	var flow = this.getFlow(face);
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
| Handles a special key
*/
Para.prototype.specialKey = function(face, bubble, keycode, shift, ctrl) {
	var redraw = false;
	var caret  = face.caret;
	var select = face.selection;

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
			redraw = true;
			break;
		case  8 : // backspace
		case 46 : // del
			this.deleteSelection();
			redraw = true;
			keycode = 0;
			throw new Error('TODO');
			//System.repository.updateItem(item);
			break;
		case 13 : // return
			this.deleteSelection();
			redraw = true;
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
			redraw = true;
		} else {
			var para = ce.anchestor(Para);
			redraw = para.joinToPrevious(ce, caret);
		}
		throw new Error('TODO');
		//System.repository.updateItem(item);
		break;*/
	case 13 : // return
		/*
		this.newline();
		redraw = true;
		*/
		throw new Error('TODO');
		//System.repository.updateItem(item);
	case 35 : // end
		caret.set(this, this.get('text').length);
		break;
	case 36 : // pos1
		caret.set(this, 0);
		break;
	case 37 : // left
		if (caret.offset > 0) {
			caret.set(this, caret.offset - 1);
		} else {
			var doc = this.parent;
			var key = doc.indexOf(this); // TODO, use getSelfKey()
			if (key > 0) {
				var e = doc.get(key - 1);
				caret.set(e, e.get('text').length);
			}
		}
		break;
	case 38 : // up
		var flow = this.getFlow(face);
		var caret = face.caret;
		var x = caret.retain$x !== null ? caret.retain$x : caret.pos$.x;

		if (caret.flow$line > 0) {
			// stay within this para
			var offset = this.getLineXOffset(face, caret.flow$line - 1, x);
			caret.set(this, offset, x);
		} else {
			// goto prev para
			var doc = this.parent;
			var key = doc.indexOf(this); // TODO, user getSelfKey()
			if (key > 0) {
				var e = doc.get(key - 1);
				var offset = e.getLineXOffset(face, e.getFlow(face).length - 1, x);
				caret.set(e, offset, x);
			}
		}
		break;
	case 39 : // right
		if (caret.offset < this.get('text').length) {
			caret.set(this, caret.offset + 1);
		} else {
			var doc = this.parent;
			var key = doc.indexOf(this); // TODO, use getSelfKey()
			if (key < doc.length - 1) {
				var e = doc.get(key + 1);
				caret.set(e, 0);
			}
		}
		break;
	case 40 : // down
		var flow = this.getFlow(face);
		var caret = face.caret;
		var x = caret.retain$x !== null ? caret.retain$x : caret.pos$.x;

		if (caret.flow$line < flow.length - 1) {
			// stay within this para
			var offset = this.getLineXOffset(face, caret.flow$line + 1, x);
			caret.set(this, offset, x);
		} else {
			// goto next para
			var doc = this.parent;
			var key = doc.indexOf(this); // TODO, user getSelfKey()
			if (key < doc.length - 1) {
				var e = doc.get(key + 1);
				var offset = e.getLineXOffset(face, 0, x);
				caret.set(e, offset, x);
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
			redraw = true;
		} else {
			var para = ce.anchestor(Para);
			redraw = para.joinToNext(ce, caret);
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
			redraw = true;
		}
	}*/

	caret.show();
	bubble.redraw = true;
}

/**
| Returns the flow width.
|
*/
Para.prototype.getFlowWidth = function(face) {
}

/**
| Draws the paragraph in its cache and returns it.
*/
Para.prototype.getFabric = function(face) {
	var flow   = this.getFlow(face);
	var width  = flow.width;
	var doc = this.getAnchestor('DocAlley');
	var height = flow.height + R(doc.fontsize * settings.bottombox);

	// cache hit?
	if (this._fabric$flag && this._fabric$width === width && this._fabric$height === height) {
		return this._fabric$;
	}

	var fabric = this._fabric$;

	// TODO: work out exact height for text below baseline
	var doc = this.getAnchestor('DocAlley');
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
Para.prototype.set = function(path, val, a0, al, oplace) {
	this._flow$ = null;
	this._fabric$flag = false; // TODO set fabric$ = null
	Woods.Para.prototype.set.apply(this, arguments);
}

/**
| Returns the point of a given offset.
|
| face:     the face the para is visualized.
| offset:   the offset to get the point from.
| flowPos$: if set, writes flow$line and flow$token to
|           the flow position used.
*/
Para.prototype.getOffsetPoint = function(face, offset, flowPos$) {
	// TODO cache position
	var doc = this.getAnchestor('DocAlley');
	Measure.font = doc.font;
	var text = this.get('text');
	var flow = this.getFlow(face);

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

	return new Point(
		R(token.x + Measure.width(text.substring(token.o, offset))),
		line.y);
}


/**
| Draws the caret if its in this paragraph.
*/
Para.prototype.drawCaret = function(face) {
	if (face.caret.entity !== this) throw new Error('Drawing caret for invalid para');

	var doc  = this.getAnchestor('DocAlley');
	var item = doc.parent;
	var zone = item.getZone(face);
	var caret = face.caret;
	var pan = face.space.fabric.pan;
	var th = R(doc.fontsize * (1 + settings.bottombox));

	caret.pos$ = this.getOffsetPoint(face, face.caret.offset, face.caret);

	//var sy = (it.scrollbarY && it.scrollbarY.visible && it.scrollbarY.pos) || 0; TODO

	/*var cyn = cp.y;
	var cys = cyn + th;
	cyn = min(max(cyn, 0), zone.height);
	cys = min(max(cys, 0), zone.height);

	if (cyn === cys) return;*/

	var cp = new Point(
		caret.pos$.x + zone.pnw.x + pan.x + this.pnw.x - 1,
		caret.pos$.y + zone.pnw.y + pan.y + this.pnw.y - th + 2);

	face.caret.screenPos$ = cp;
	face.caret.save$ = face.fabric.getImageData(cp.x, cp.y, 3, th + 2);
	face.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, th);
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
| Constructor.
*/
/*
function DTree(fontsize) {
	Treenode.call(this);
	this._fontsize = fontsize || 13;
}
subclass(DTree, Treenode);
*/

/**
| Creates a Dtree from json representation.
*/
/*
DTree.jnew = function(js) {
	var o = new DTree(js.fs);
	var d = js.d;
	for(var i = 0, dlen = d.length; i < dlen; i++) {
		o.append(new Para(d[i]));
	}
	return o;
}*/


/**
| Turns the document tree into a json representation.
*/
/*DTree.prototype.jsonfy = function() {
	var js = {fs : this._fontsize, d: []};
	var d = js.d;
	for (var n = this.first; n; n = n.next) {
		d.push(n.first.text);
	}
	return js;
}
*/

/**
| Returns the paragraph at point
*/
/*DTree.prototype.paraAtPoint = function(p) {
	var para = this.first;
	while (para && p.y > para.p.y + para.softHeight) {
		para = para.next;
	}
	return para;
}
*/
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

/**
| Overloads Treenodes.append() to set the new paragraphs width.
| todo, change this to ask for the parents width on the flow?
*/
/*
DTree.prototype.append = function(tnode) {
	if (this._flowWidth) {
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.append.call(this, tnode);
}
*/

/**
| Overloads Treenodes insertBefore to set the paragraphs width.
*/
/*
DTree.prototype.insertBefore = function(tnode, bnode) {
	if (this._flowWidth && bnode) {
		// if not bnode append will be called
		tnode.flowWidth = this._flowWidth;
	}
	return Treenode.prototype.insertBefore.call(this, tnode, bnode);
}
*/


/**
* Gets/Sets the font size.
*/

/*
Object.defineProperty(DTree.prototype, 'fontsize', {
	get: function() { return this._fontsize; },
	set: function(fs) {
		if (this._fonsize == fs) return;
		this._fontsize = fs;
		for(var para = this.first; para; para = para.next) {
			para.listen();
		}
	}
});
*/


/**
| Something changed.
*/
/*
DTree.prototype.listen = function() {
	this._cacheWidth  = null;
	this._cacheHeight = null;
	if (this.parent) this.parent.listen();
}*/

/**
| Returns the width of the document tree.
*/
/*
Object.defineProperty(DTree.prototype, 'width', {
	get: function() {
		if (this._cacheWidth) return this._cacheWidth;
		var w = 0;
		for(var para = this.first; para; para = para.next) {
			if (para.width > w) w = para.width;
		}
		return this._cacheWidth = R(w);
	},
});
*/

/**
| Returns the height of the document tree.
*/
/*
Object.defineProperty(DTree.prototype, 'height', {
	get: function() {
		if (this._cacheHeight) return this._cacheHeight;
		var h = 0;
		var paraSep = this.pre ? 0 : this._fontsize;
		var first = true;
		for(var para = this.first; para; para = para.next) {
			if (!first) h += paraSep; else first = false;
			h += para.softHeight;
		}
		return this._cacheHeight = h;
	},
});
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
	this._h6slice = null;
}
/**
| Return the hexagon slice that is the handle
*/
Item.prototype.getH6Slice = function(face) {
	var zone = this.getZone(face);

	if (this._h6slice && this._h6slice.psw.eq(zone.pnw)) return this._h6slice;

	return this._h6slice = new HexagonSlice(
		zone.pnw, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
};

/**
| Creates a new Hexmenu for this item.
*/
Item.prototype.newItemMenu = function(face, pan) {
	throw new Error('TODO');
	var labels = this._itemMenuLabels = {n : 'Remove'};
	return new Hexmenu(this.getH6Slice(face).pm.add(pan), settings.itemmenu,  labels);
}

/**
| Returns if point is within the item menu
*/
Item.prototype.withinItemMenu = function(face, p) {
	return this.getH6Slice(face).within(p);
}

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| todo rename
*/
Item.prototype.checkItemCompass = function(face, p) {
	var ha = this.handles;
	var zone = this.getZone(face);

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
Item.prototype.pathResizeHandles = function(fabric, border, edge, face) {
	if (border !== 0) throw new Error('borders unsupported for handles');
	var ha = this.handles;
	var zone = this.getZone(face);
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
Item.prototype.drawHandles = function(face, fabric) {
	// draws the resize handles
	fabric.edge(settings.handle.style.edge, this, 'pathResizeHandles', face);

	// draws item menu handler
	var sstyle = settings.itemmenu.slice.style;
	fabric.paint(sstyle.fill, sstyle.edge, this.getH6Slice(face), 'path');
}

/**
| Called when item is removed
*/
Item.prototype.removed = function() {
	// nothing
}

/**
| Returns first anchestor with constructor constructor
*/
/*
getAnchestor = function(constructor) {
	var n;
	for(n = this; n && n.constructor !== construct; n = n.parent);
	if (!n) throw new Error('anchestor not there:'+construct);
	return n;
}
*/

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
}
subclass(DocAlley, Woods.DocAlley);

/**
| Seeds. Things that can grow on this twig.
*/
DocAlley.prototype.seeds = {
    'Para'    : Para,
	'Number'  : true,
};

/**
| Draws the document alley on a fabric.
| fabric: to draw upon.
| select:  selection object (for highlighting the selection)
| imargin: distance of text to edge
| scrollp: scroll position
*/
DocAlley.prototype.draw = function(face, fabric, imargin, scrollp) {
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

	// draws the paragraphs
	for (var a = 0; a < this.length; a++) {
		var para = this.get(a);
		var flow = para.getFlow(face);

		// TODO name pnw$
		para.pnw = new Point(imargin.w, R(y));
		fabric.drawImage(para.getFabric(face), imargin.w, y - scrollp.y);
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
DocAlley.prototype.paraAtPoint = function(p, face) {
	for(var a = 0; a < this.length; a++) {
		var para = this.get(a);
		var flow = para.getFlow(face);
		if (p.y < para.pnw.y + flow.height) return para;
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
Note.imargin = Margin.jnew(settings.note.imargin);

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
| Creates a new note from json representation.
*/
Note.jnew = function(js, id) {
	return new Note(id, Rect.jnew(js.z), DTree.jnew(js.d));
}

/**
| Highlights the  note
*/
Note.prototype.highlight = function(fabric) {
	// todo round rects
	fabric.edge(settings.note.style.highlight, this.zone, 'path');
}

/**
| Turns the note into a string
*/
Note.prototype.jsonfy = function() {
	var js = {
	     t : 'note',
		 z : this.zone.jsonfy(),
		 d : this.dtree.jsonfy(),
	}
	return js;
}

/**
| Returns the para at point. todo, honor scroll here.
*/
Note.prototype.paraAtPoint = function(p, action) {
	// TODO rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.doc.paraAtPoint(p, action);
}

/**
| Returns true if the fabric is up-to-date.
*/
Note.prototype.fabricUp2d8 = function(zone) {
	return this._fabric$flag && this._fabric$size &&
		zone.width  === this._fabric$size.width &&
		zone.height === this._fabric$size.height;
}

/**
| Checks if this items reacts on an event.
| Returns transfix code.
*/
Note.prototype.transfix = function(txe, face, bubble, p, shift, ctrl) {
	if (!this.zone.within(p)) return;
	bubble.hit = true;
	switch (txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			bubble.redraw = true;
			return;
		}
		face.space.setFocus(this);
		bubble.redraw = true;

		var sbary = this.scrollbarY;
		var pr = p.sub(this.zone.pnw);
		if (sbary.visible && sbary.zone.within(pr)) {
			//space.actionScrollY(this, p.y, this.scrollbarY);
			throw new Error('TODO');
		} else {
			face.beginAction(Action.ITEMDRAG, this, p);
			system.setCursor('move');
		}
		return;
	case TXE.CLICK :
		face.space.setFocus(this);
		bubble.redraw = true;

		// var op = p.sub(this.zone.pnw.w, this.zone.pnw.y - max(0, this.scrollbarY.pos)); TODO
		var pi = p.sub(this.zone.pnw.x, this.zone.pnw.y);

		var para = this.paraAtPoint(pi, face);
		if (para) {
			var offset = para.getPointOffset(face, pi.sub(para.pnw));
			face.caret.set(para, offset);
			face.caret.show();
			// face.selection.deselect(); TODO
		}
		return;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		bubble.redraw = true;
		return;
	case TXE.RBINDTO :
		//space.actionRBindTo(this);
		throw new Error('TODO');
		bubble.redraw = true;
		return;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
}


/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Note.prototype.getZone = function(face) {
	if (typeof(face) === 'undefined') {
		throw new Error('BAD');
	}
	var action = face.action;
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
			pnw = Point.renew(min(ipnw.x + dx, ipse.x - minw), min(ipnw.y + dy, ipse.y - minh), ipnw, ipse);
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
Note.prototype.getInnerZone = function(face) {
	return this.getZone(face).reduce(this.imargin);
}
*/

/**
| The inner width for contents excluding scrollbars.
*/
/*
Object.defineProperty(Note.prototype, 'iwidth', {
	get: function() {
		return this.zone.width - this.imargin.x;
//		return this.zone.width - this.imargin.x -  TODO
//			(this.scrollbarY.pos >= 0 ? settings.scrollbar.strength : 0);
	},
});
*/

/**
| The inner height for contents excluding scrollbars.
*/
/*
Object.defineProperty(Note.prototype, 'iheight', {
	get: function() {
		return this.zone.height - this.imargin.y;
	},
});*/


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
Note.prototype.draw = function(face, fabric) {
	var f  = this._fabric;

	var zone = this.getZone(face);

	// no buffer hit?
	if (!this.fabricUp2d8(zone)) {
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
		doc.draw(face, f, this.imargin, Point.zero); // TODO scrollp

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
Label.imargin = Margin.jnew(settings.label.imargin);

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
| Creates a new Label from json representation.
*/
Label.jnew = function(js, id) {
	return new Label(id, Rect.jnew(js.z), DTree.jnew(js.d));
}

/**
| An event happened at p.
| returns transfix code.
*/
Label.prototype.transfix = function(txe, face, bubble, p, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	bubble.hit = true;

	switch(txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			bubble.redraw = true;
			return txr;
		}
		face.space.setFocus(this);

		face.beginAction(Action.ITEMDRAG, this, p.sub(this.zone.pnw));
		System.setCursor('move');
		return txr;
	case TXE.CLICK:
		face.space.setFocus(this);
		var pi = p.sub(this.zone.pnw);
		var para = this.paraAtPoint(pi, face);
		if (para) {
			throw new Error('TODO');
			/*
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			*/
			bubble.redraw = true;
		}
		return;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		bubble.redraw = true;
		return;
	case TXE.RBINDTO :
		throw new Error('TODO');
		//space.actionRBindTo(this);
		bubble.redraw = true;
		return;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
}

/**
| Highlights the label.
*/
Label.prototype.highlight = function(fabric) {
	fabric.edge(settings.label.style.highlight, this.zone, 'path');
}

/**
| Turns the label into its json represntation.
*/
Label.prototype.jsonfy = function() {
	return {
	    t: 'label',
		z: this.zone.jsonfy(),
		d: this.dtree.jsonfy(),
	}
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
Label.prototype.paraAtPoint = function(p, face) {
	return this.dtree.paraAtPoint(p, face);
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
Label.prototype.draw = function(face) {
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
| Do not call directly, but Relation.jnew() or Relation.create()
| Relation(id, i1id, i2id, textZone, [dtree])
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
Relation.imargin = Margin.jnew(settings.relation.imargin);

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
| Creates a relation from json representation.
*/
Relation.jnew = function(js, id) {
	throw new Error('TODO');
	var tz;
	if (js.tz) {
		tz = Rect.jnew(js.tz);
	} else {
		// todo remove
		tz = new Rect(new Point(0, 0), new Point(100, 100));
	}
	var dtree = DTree.jnew(js.d);
	var o = new Relation(id, js.i1, js.i2, tz, dtree);
}

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
| Returns json representation.
*/
Relation.prototype.jsonfy = function() {
	return {
	    t  : 'rel',
		i1 : this.i1id,
		i2 : this.i2id,
		d  : this.dtree.jsonfy(),
		tz : this.textZone.jsonfy(),
	}
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
Relation.prototype.transfix = function(txe, face, bubble, p, shift, ctrl) {
	throw new Error('TODO');

	if (!this.textZone.within(p)) return 0;
	bubble.hit = true;

	switch(txe) {
	case TXE.HOVER :
		system.setCursor('default');
		return;
	case TXE.DRAGSTART :
		if (ctrl) {
			//space.actionSpawnRelation(this, p);
			throw new Error('TODO');
			bubble.redraw = true;
			return;
		}
		face.space.setFocus(this);

		face.beginAction(Action.ITEMDRAG, this, p.sub(this.handlezone.pnw));
		system.setCursor('move');
		return txr;
	case TXE.CLICK:
		face.space.setFocus(this);

		var pi = p.sub(this.textZone.pnw);
		var para = this.paraAtPoint(pi, face);
		if (para) {
			/* TODO
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			*/
			bubble.redraw = true;
		}
		return;
	case TXE.RBINDHOVER :
		//space.actionRBindHover(this);
		throw new Error('TODO');
		bubble.redraw = true;
		return;
	case TXE.RBINDTO :
		//space.actionRBindTo(this);
		throw new Error('TODO');
		bubble.redraw = true;
		return;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
	return 0;
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
Relation.prototype.paraAtPoint = function(p, face) {
	return this.dtree.paraAtPoint(p, face);
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
	this.mm = new MeshMashine(Nexus, null);

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
	system.frontface.space = asw.node;  // TODO HACK
}

/**
| Creates a new note.
*/
MeshIO.prototype.newNote = function(space, zone) {
	// TODO new Path is itchy here.

	var path = new Path(space);
	path.set(path.length, 'items');
	path.set(path.length, '$new');

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
			//path: new Path([space.key$, 'items', '$new']),
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
			path: new Path([space.key$, 'z']),
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
	var at1 = space.z.indexOf(item.key$);

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
			val: item.key$,
		}),
		new Signature({
			path: path,
			at1 : 0,
		})
	);
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .-,--.                   .
  `|__/ ,-. ,-. ,-. ,-. . |- ,-. ,-. . .
  )| \  |-' | | | | `-. | |  | | |   | |
  `'  ` `-' |-' `-' `-' ' `' `-' '   `-|
~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            '                        `-'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*
Repository.prototype.reset = function() {
	// all items
	this.items = {};
	// z information of the items, 0 is topmost
	this.zidx = [];

	// do not save changes, used during loadup
	this._nosave    = false;
	// do not notify onlookers, used during import
	this._noonlooks = false;

	this.onlookeds = {};
	this.onlookers = {};
}
*/

/**
| Loads the repository from HTML5 localStorage.
*/
/*Repository.prototype.loadLocalStorage = function() {
	this.reset();
	var idfjs = window.localStorage.getItem('idf');
	if (idfjs) {
		try {
			this._idFactory = JSON.parse(idfjs);
		} catch(err) {
			this._idFactory = null;
			console.log('JSON error reading idfactory', err.name, err.message);
		}
	}
	if (!this._idFactory) {
		console.log('no repository found. (no idf)');
		this._idFactory = {nid: 1};
		return false;
	}

	System.space.pan = System.space.c2d.pan = this._getPan(); // todo space setFunction
	var zjs = window.localStorage.getItem('zidx');
	if (!zjs) {
		console.log('no repository found. (no zidx)');
		return false;
	}
	var zidx = JSON.parse(zjs);
	this._nosave = true;
	this._noonlooks = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		var itstr = window.localStorage.getItem(id);
		var itjs;
		try {
			itjs = JSON.parse(itstr);
		} catch (err) {
			this._nosave = false;
			this._noonlooks = false;
			throw err;
		}
		this._loadItem(id, itjs);
	}
	this._nosave = false;
	this._noonlooks = false;
	return true;
}*/

/**
| Erases the local repository.
*/
/*Repository.prototype.eraseLocalStorage = function() {
	var items = this.items;
	window.localStorage.setItem('idf', '');
	window.localStorage.setItem('zidx', '');
	for(var id in items) {
		window.localStorage.setItem(id, '');
	}
}*/

/**
| Saves this repository into a JSON-String that is returned
*/
/*Repository.prototype.exportToJString = function() {
	var js = {}
	js.formatversion = 0;
	js.idf = this._idFactory;
	var items = this.items;
	var jitems = js.items = {};
	for (var id in items) {
		jitems[id] = items[id].jsonfy();
	}
	js.z = this.zidx;
	js.pan = System.space.pan.jsonfy();
	return JSON.stringify(js, null, 1);
}*/

/**
| Moves an item top
*/
/*Repository.prototype.moveToTop = function(z) {
	var zidx = this.zidx;
	var id = zidx[z];
	zidx.splice(z, 1);
	zidx.unshift(id);
	this._saveZIDX();
	return 0;
}*/

/**
| One item wants to watch another item.
*/
/*Repository.prototype.addOnlook = function(onlooker, onlooked) {
	var its = this.items;
	if (!this._noonlooks && (!its[onlooker] || !its[onlooked])) {
		throw new Error('adding Onlook to invalid item ids:');
	}
	var od = this.onlookeds[onlooked];
	var or = this.onlookers[onlooker];
	if (!od) this.onlookeds[onlooked] = od = [];
	if (!or) this.onlookers[onlooker] = or = [];
	if (od.indexOf(onlooker) < 0) od.push(onlooker);
	if (or.indexOf(onlooked) < 0) or.push(onlooked);
}*/

/**
| One item stops to watch another item.
*/
/*Repository.prototype.removeOnlook = function(onlooker, onlooked) {
	var od = this.onlookeds[onlooked];
	var odi = od.indexOf(onlooker);
	if (odi >= 0) od.splice(odi, 1);

	var or = this.onlookers[onlooker];
	var ori = or.indexOf(onlooked);
	if (ori >= 0) or.splice(ori, 1);
}*/

/* loads the repository from a JSON string */
/*Repository.prototype.importFromJString = function(str) {
	try {
		var js = JSON.parse(str);
	} catch (err) {
		window.alert('Repository save not valid JSON.');
		return;
	}
	if (js.formatversion != 0 || !js.idf || !js.items || !js.z) {
		window.alert('Repository not recognized.');
		return;
	}
	this.reset();
	this.eraseLocalStorage();
	// erase current local repository
	var items = this.items;
	var zidx  = js.z;
	this._idFactory = js.idf;
	window.localStorage.setItem('idf', JSON.stringify(this._idFactory));
	this._noonlooks = true;
	for (var i = zidx.length - 1; i >= 0; i--) {
		var id = zidx[i];
		if (typeof zidx[i] !== 'number') id = parseInt(id);
		this._loadItem(id, js.items[id]);
	}
	this._saveZIDX();
	this._noonlooks = false;

	System.space.setFocus(null);
	System.space.pan = System.space.c2d.pan = js.pan ? Point.jnew(js.pan) : new Point(0, 0); // todo
	this.savePan(System.space.pan);
}*/

/**
| Creates a new ID.
*/
/*Repository.prototype._newItemID = function() {
	var idf = this._idFactory;
	idf.nid++;
	window.localStorage.setItem('idf', JSON.stringify(idf));
	return idf.nid;
}*/

/**
| Loads an Item from JSON.
*/
/*
Repository.prototype._loadItem = function(id, js) {
	if (!js || !js.t) throw new Error('JSON error: attributes missing from ('+id+'): '+js);
	switch(js.t) {
	case 'note'  : return Note.jnew(js, id);
	case 'label' : return Label.jnew(js, id);
	case 'rel'   : return Relation.jnew(js, id);
	default      : throw new Error('unknown item type');
	}
}
*/

/*Repository.prototype._saveZIDX = function() {
	window.localStorage.setItem('zidx', JSON.stringify(this.zidx));
}*/

/**
| Adds an item to the space
*/
/*
Repository.prototype.addItem = function(item, top) {
	if (!item.id) item.id  = this._newItemID();
	this.items[item.id] = item;
	if (top) {
		this.zidx.unshift(item.id);
	} else {
		this.zidx.push(item.id);
	}

	if (!this._nosave) {
		this._saveItem(item);
		this._saveZIDX();
	}
}*/

/**
| Removes an item from the repository.
*/
/*Repository.prototype.removeItem = function(item) {
	var zidx = this.zidx;
	var id = item.id;
	zidx.splice(zidx.indexOf(id), 1);
	delete this.items[id];
	item.removed();

	// notifies onlookers
	if (!this._noonlooks) {
		var od = this.onlookeds[id];
		if (od) {
			// copies the array so it can be changed during traversal
			var odc = od.slice();
			for (var i = 0; i < odc.length; i++) {
				var it = this.items[odc[i]];
				if (it) it.onlook(ONLOOK.REMOVE, item);
			}
		}
	}

	if (!this._nosave) {
		window.localStorage.setItem(item.id, '');
		this._saveZIDX();
	}
}*/

/**
| Stores an item into local storage.
*/
/*Repository.prototype._saveItem = function(item) {
	window.localStorage.setItem(item.id, JSON.stringify(item.jsonfy()));
}*/

/**
| Changes an item in local storage.
*/
/*Repository.prototype.updateItem = function(item) {
	if (!this._nosave) this._saveItem(item);

	// notifies onlookers
	if (this._noonlooks) return;
	var od = this.onlookeds[item.id];
	if (!od) return;
	for (var i = 0; i < od.length; i++) {
		var it = this.items[od[i]];
		if (it) it.onlook(ONLOOK.UPDATE, item);
	}
}*/


/**
| Loads panning offset.
*/
/*Repository.prototype._getPan = function() {
	var jstr = window.localStorage.getItem('pan');
	var js   = JSON.parse(jstr);
	return js ? Point.jnew(js) : new Point(0, 0);
}*/

/**
| Saves the panning offset.
*/
/*Repository.prototype.savePan = function(pan) {
	if (!this._nosave) window.localStorage.setItem('pan', JSON.stringify(pan.jsonfy()));
}*/

