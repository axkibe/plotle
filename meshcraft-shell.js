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
 A network item editor.

 This is the client-side script for the user interface.

 Authors: Axel Kittenberger
 License: GNU Affero AGPLv3

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

'use strict';

/**
| +++ Shortcuts  +++
*/
var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var subclass  = Jools.subclass;
var log       = Jools.log;
var debug     = Jools.debug;
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
var oppsoite      = Fabric.opposite;

/**
| Configures meshcraft-woods.
*/
Woods.cogging = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .  .
 \___  ,-. |- |- . ,-. ,-. ,-.
     \ |-' |  |  | | | | | `-.
 `---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| if true catches all errors and report to user.
| if false lets them pass through to e.g. firebug.
*/
var enableCatcher = false;

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
	},


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
	IRESIZE : 3, // resizing one item
	SCROLLY : 4, // scrolling a note
	FMENU   : 5, // clicked the float menu (background click)
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
| Bitfield return code of transfix()
*/
var TXR = {
	HIT    : 0x1,
	REDRAW : 0x2
};
Object.freeze(TXR);


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
	this._item = null;
	this._element = null;
	this._offset = 0;
	this._pli = null;
	this._cli = null;
}

Object.defineProperty(Marker.prototype, 'item', {
	get: function() { return this._item; },
	set: function(it) { throw new Error('use set()'); }
});

Object.defineProperty(Marker.prototype, 'element', {
	get: function() { return this._element; },
	set: function(e) { throw new Error('use set()'); }
});

Object.defineProperty(Marker.prototype, 'offset', {
	get: function() { return this._offset; },
	set: function(o) { this._offset = o; }
});

/**
| set(marker)                -or-
| set(element, offset)       -or-
| set(item, element, offset) -or-
*/
Marker.prototype.set = function(a1, a2, a3) {
	if (a1 instanceof Marker) {
		this._item    = a1._item;
		this._element = a1._element;
		this._offset  = a1._offset;
		return;
	}
	if (a1 instanceof Item) {
		this._item    = a1;
		this._element = a2;
		this._offset  = a3;
		return
	}
	this._element = a1;
	this._offset  = a2;
}

/**
| Returns chunk at x/y
*/
Marker.prototype._getPinfoAtP = function(flowbox, p) {
	var pinfo = flowbox.pinfo;
	var plen = pinfo.length;
	var li;
	for (li = 0; li < plen; li++) {
		if (p.y <= pinfo[li].y) {
			break;
		}
	}
	if (li >= plen) {
		li--; /* got to last line if overflow */
	}
	this._pli = li;
	var l = pinfo[li];
	var llen = l.length;
	var c;
	for (var ci = 0; ci < llen; ci++) {
		c = l[ci];
		if (p.x <= c.x + c.w) {
			this._pci = ci;
			return pinfo;
		}
	}
	/* set to last chunk if overflow */
	this._pci = llen - 1;
	return pinfo;
}

/**
| Gets the markers position, relative to dtree
*/
Marker.prototype.getPoint = function() {
	/* todo cache position */
	var dtree = this._item.dtree;
	Measure.font = dtree.font;
	var e = this._element;
	var t = e.text;
	var p = e.anchestor(Para);
	var pinfo = this.getPinfo();
	var l = pinfo[this._pli];
	var c = l[this._pci];
	return p.p.add(
		R(c ? c.x + Measure.width(t.substring(c.offset, this._offset)) : l.x),
		l.y - dtree.fontsize);
}

/**
| Sets the marker to position closest to x, y from flowbox(para).
*/
Marker.prototype.setFromPoint = function(flowbox, p) {
	throw new Error('TODO');

	if (!flowbox instanceof Para) { throw new Error('invalid flowbox.'); }
	var pinfo = this._getPinfoAtP(flowbox, p);
	var l = pinfo[this._pli];
	var c = l[this._pci]; // x,y is in this chunk

	if (!c) {
		// todo?
		this._element = flowbox.first;
		this._offset = 0;
		return;
	}
	var dx   = p.x - c.x;
	Measure.font = flowbox.anchestor(DTree).font;
	var t    = c.text;
	var tlen = t.length;

	var x1 = 0, x2 = 0;
	var o;
	for(o = 0; o < tlen; o++) {
		x1 = x2;
		x2 = Measure.width(t.substr(0, o));
		if (x2 > dx) {
			break;
		}
	}
	if (dx - x1 <= x2 - dx) o--;
	this._element = c.node;
	this._offset = c.offset + o;
}

/**
| Sets this.pline and this.pchunk according to the chunk
| the marker is in
*/
Marker.prototype.getPinfo = function() {
	var te = this._element;
	var to = this._offset;
	var para  = te.anchestor(Para);
	var pinfo = para.pinfo;
	var bli =  0; /* buffer for line count */
	var bci = -1; /* buffer for chunk count */
	var plen  = pinfo.length;
	for(var li= 0; li < plen; li++) {
		var l = pinfo[li];
		var llen = l.length;
		for(var ci = 0; ci < llen; ci++) {
			var c = l[ci];
			if (c.offset == to) {
				this._pli = li; this._pci = ci;
				return pinfo;
			}
			if (c.offset > to) {
				this._pli = bli; this._pci = bci;
				return pinfo;
			}
			bli = li; bci = ci;
		}
	}
	this._pli = bli; this._pci = bci;
	return pinfo;
}

/**
| Moves the marker a line up (dir == true) or down
| returns true if moved
*/
Marker.prototype.moveUpDown = function(dir) {
	throw new Error('TODO');

	var e  = this._element;
	var o  = this._offset;
	Measure.font = e.anchestor(DTree).font;
	var p  = e.anchestor(Para);
	var pinfo = this.getPinfo();
	var li = this._pli;
	var ci = this._pci;
	var l = pinfo[li];
	var c = l[ci];
	var x = c ? c.x + Measure.width(c.text.substr(0, o - c.offset)) : l.x;
	if (dir) {
		if (li == 0) {
			p = p.prev;
			if (!p) return false;
			pinfo = p.pinfo;
			l = pinfo[pinfo.length - 1];
		} else {
			l = pinfo[li - 1];
		}
	} else {
		if (li + 1 >= pinfo.length) {
			p = p.next;
			if (!p) return false;
			pinfo = p.pinfo;
			l = pinfo[0];
		} else {
			l = pinfo[li + 1];
		}
	}
	var llen = l.length;
	for(ci = 0; ci < llen && x > l[ci].x + l[ci].w; ci++);
	if (ci >= llen) {
		c = l[llen - 1];
		if (c) {
			this._element = c.node;
			this._offset  = c.offset + c.text.length;
		} else {
			this._element = p.first;
			this._offset = 0;
		}
		return true;
	}
	c = l[ci];

	var t = c.text;
	var tlen = t.length;
	var x1 = 0, x2 = 0;
	var dx = x - c.x;
	var o;
	for(o = 0; o < tlen; o++) {
		x1 = x2;
		x2 = Measure.width(t.substr(0, o));
		if (x2 > dx) {
			break;
		}
	}
	if (dx - x1 <= x2 - dx) o--;
	this._element = c.node;
	this._offset  = c.offset + o;
	return true;
}

/**
| Moves the marker a character left (dir == true) or right
| returns true if moved.
*/
Marker.prototype.moveLeftRight = function(dir) {
	if (dir) {
		if (this._offset > 0) {
			this._offset--;
		} else {
			var pev = this._element.parent.prev;
			if (!pev) {
				return false;
			}
			var e = this._element = pev.last;
			this._offset = e.text.length;
		}
	} else {
		var t = this._element.text;
		if (this._offset < t.length) {
			this._offset++;
		} else {
			var pnext = this._element.parent.next;
			if (!pnext) {
				return false;
			}
			this._element = pnext.first;
			this._offset = 0;
		}
	}
	return true;
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
	this.blink = false;
}
subclass(Caret, Marker);


/**
| Shows the caret or resets the blink timer if already shown
*/
Caret.prototype.show = function() {
	this.shown = true;
	this.blink = false;
	System.startBlinker();
}

/**
| Hides the caret.
*/
Caret.prototype.hide = function() {
	this.shown = false;
	System.stopBlinker();
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
		// ^ todo make multi child compatible
		if (!n) { throw new Error('selection akward');}
		buf.push('\n');
		buf.push(n.text);
	}
	buf.push('\n');
	buf.push(ee.text.substring(0, eo));
	return buf.join('');
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
| Action enums
*/
Action.PAN      = 1; // panning the background
Action.ITEMDRAG = 2; // draggine one item

/**
|
*/
//Action.prototype.

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
.-,--.   .   .
 `\__  ,-| . |- ,-. ,-.
  /    | | | |  | | |
 '`--' `-^ ' `' `-' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 todo, what exactly belongs to this?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
function Editor() {
	this.caret     = new Caret();
	this.selection = new Selection();
	this.item      = null;
}

/**
| Draws or erases the caret.
*/
Editor.prototype.updateCaret = function() {
	var f = System.fabric;
	var caret = this.caret;
	if (caret.save) {
		// erases the old caret
		f.putImageData(caret.save, caret.sp.x - 1, caret.sp.y - 1);
		caret.save = null;
	}
	if (caret.shown && !caret.blink) {
		var cp = caret.getPoint();
		var it = caret.item;
		var sy = (it.scrollbarY && it.scrollbarY.visible && it.scrollbarY.pos) || 0;
		var tzone = it.handlezone; // todo, do not reuse handlezone
		var th = R(it.dtree.fontsize * (1 + settings.bottombox));
		var cyn = cp.y - sy;
		var cys = cyn + th;
		cyn = min(max(cyn, 0), tzone.height);
		cys = min(max(cys, 0), tzone.height);
		if (cyn === cys) {
			caret.save = null;
			return;
		}
		var sp = caret.sp = System.space.pan.add(
			tzone.pnw.x + cp.x,
			tzone.pnw.y + cyn);
		caret.save = f.getImageData(sp.x - 1, sp.y - 1, 3, cys - cyn + 1);
		f.fillRect('black', sp.x, sp.y, 1, cys - cyn);
	}
}

/**
| Inserts a new line
*/
Editor.prototype.newline = function() {
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
}

/**
| Handles a special(control) key
| returns true if the element needs to be redrawn.
*/
Editor.prototype.specialKey = function(item, keycode, shift, ctrl) {
	if (!item) return false;
	var refresh = false;
	var redraw = false;
	var caret  = this.caret;
	var select = this.selection;

	if (ctrl) {
		switch(keycode) {
		case 65 : // ctrl+a
			var pfirst = item.dtree.first;
			select.mark1.set(item, pfirst.first, 0);
			var plast = item.dtree.last;
			select.mark2.set(item, plast.first, plast.first.text.length);
			select.active = true;
			for(var n = pfirst; n; n = n.next) {
				n.listen();
			}
			caret.set(select.mark2);
			System.setInput(select.innerText());
			caret.show();
			return true;
		}
	}

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
			System.repository.updateItem(item);
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
	}

	switch(keycode) {
	case  8 : // backspace
	{
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
		System.repository.updateItem(item);
		break;
	}
	case 13 : // return
	{
		this.newline();
		redraw = true;
		System.repository.updateItem(item);
		break;
	}
	case 35 : // end
		caret.offset = caret.element.text.length;
		refresh = true;
		break;
	case 36 : // pos1
		caret.offset = 0;
		refresh = true;
		break;
	case 37 : // left
		refresh = caret.moveLeftRight(true);
		break;
	case 38 : // up
		refresh = caret.moveUpDown(true);
		break;
	case 39 : // right
		refresh = caret.moveLeftRight(false);
		break;
	case 40 : // down
		refresh = caret.moveUpDown(false);
		break;
	case 46 : // del
	{
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
		System.repository.updateItem(item);
		break;
	}
	default :
		break;
	}


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
			System.setInput(select.innerText());
			// clears item cache
			item.listen();  // todo rename.
			redraw = true;
		}
	}

	if (refresh || redraw) {
		caret.show();
	}
	if (refresh && !redraw) {
		this.updateCaret();
	}
	return redraw;
}

/**
| Switches caret visibility state.
*/
Editor.prototype.blink = function() {
	if (this.caret.shown) {
		this.caret.blink = !this.caret.blink;
		this.updateCaret();
	}
}

/**
| Deletes the selection including its contents.
*/
Editor.prototype.deleteSelection = function() {
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
}

/**
| Removes the selection.
*/
Editor.prototype.deselect = function() {
	if (!this.selection.active) return;
	var item = this.selection.mark1.item;
	this.selection.active = false;
	System.setInput('');
	/* clear item cache */
	item.listen();
}

/**
| Received a input from user
| returns true if redraw is needed
*/
Editor.prototype.input = function(item, text) {
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
	System.repository.updateItem(item);
	return true;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.         .
 \___  . . ,-. |- ,-. ,-,-.
     \ | | `-. |  |-' | | |
 `---' `-| `-' `' `-' ' ' '
~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       `-'
  Base system for Meshcraft.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var System = {

/**
| Catches all errors a function throws if enabledCatcher is set.
*/
makeCatcher : function(that, fun) {
	return function() {
		'use strict';
		if (enableCatcher) {
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
},

/**
| Startup.
*/
init : function() {
	System.makeCatcher(System, System._init)();
},

/**
| Startup with possibly enabled error catching.
*/
_init : function() {
	if (this != System) throw new Error('System has wrong this pointer');
	var canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth - 1;
	canvas.height = window.innerHeight - 1;
	this.fabric = new Fabric(canvas);
	Measure.init();

	// the space that currently is displayed
	this.space = null;

	// if true browser supports the setCapture() call
	// if false needs work around
	var useCapture = canvas.setCapture != null;

	// mouse state  todox
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

	var editor = this.editor = new Editor();

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
				this.cSpace.specialKey(keyCode, shift, ctrl);
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
			this.cSpace.specialKey(keyCode, shift, ctrl);
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
		System.space.input(text);
	}

	/**
	| does a blink.
	*/
	function blink() {
		// hackish, also look into the hidden input field,
		// maybe the user pasted something using the browser menu.
		testinput();
		editor.blink();
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
		testinput();
		setTimeout('System.ontestinput();', 0);
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
		this.cSpace.systemBlur();
	}

	/**
	| Hidden input got focus.
	*/
	function onfocus(event) {
		this.cSpace.systemFocus();
	}

	/**
	| View window resized.
	*/
	function onresize(event) {
		canvas.width  = window.innerWidth - 1;
		canvas.height = window.innerHeight - 1;
		if (this.cSpace) this.cSpace.redraw();
	}

	/**
	| Mouse move event.
	*/
	function onmousemove(event) {
		var p = new Point(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);

		switch(mst) {
		case MST.NONE :
			this.cSpace.mousehover(p);
			return true;
		case MST.ATWEEN :
			var dragbox = settings.dragbox;
			if ((abs(p.x - msp.x) > dragbox) || (abs(p.y - msp.y) > dragbox)) {
				// moved out of dragbox -> start dragging
				clearTimeout(atweenTimer);
				atweenTimer = null;
				mst = MST.DRAG;
				this.cSpace.dragstart(msp, event.shiftKey, event.ctrlKey || event.metaKey);
				if (!p.eq(msp)) {
					this.cSpace.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
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
			this.cSpace.dragmove(p, event.shiftKey, event.ctrlKey || event.metaKey);
			return true;
		default :
			throw new Error('invalid mst');
		}
	}

	/**
	| Mouse down event.
	*/
	function onmousedown(event) {
		event.preventDefault();
		hiddenInput.focus();
		var p = new Point (event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
		/* asks the space if it forces this to be a drag or click, or yet unknown */
		mst = this.cSpace.mousedown(p);
		switch(mst) {
		case MST.ATWEEN :
			msp = mmp = p;
			mms = event.shiftKey;
			mmc = event.ctrlKey || event.metaKey;
			atweenTimer = setTimeout('System.onatweentime();', settings.dragtime);
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
			/* this was a click */
			clearTimeout(atweenTimer);
			atweenTimer = null;
			this.cSpace.click(p, event.shiftKey, event.ctrlKey || event.metaKey);
			mst = MST.NONE;
			return false;
		case MST.DRAG :
			this.cSpace.dragstop(p, event.shiftKey, event.ctrlKey || event.metaKey);
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
		this.cSpace.mousewheel(wheel);
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
		this.cSpace.dragstart(msp, mms, mmc);
		if (!mmp.eq(msp)) {
			this.cSpace.dragmove(mmp, mms, mmc);
		}
	}

	canvas.onmouseup       = this.makeCatcher(this, onmouseup);
	canvas.onmousemove     = this.makeCatcher(this, onmousemove);
	canvas.onmousedown     = this.makeCatcher(this, onmousedown);
	canvas.onmousewheel    = this.makeCatcher(this, onmousewheel);
	canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false); // Firefox.
	window.onresize        = this.makeCatcher(this, onresize);
	hiddenInput.onfocus    = this.makeCatcher(this, onfocus);
	hiddenInput.onblur     = this.makeCatcher(this, onblur);
	hiddenInput.onkeydown  = this.makeCatcher(this, onkeydown);
	hiddenInput.onkeypress = this.makeCatcher(this, onkeypress);
	hiddenInput.onkeyup    = this.makeCatcher(this, onkeyup);
	this.ontestinput       = this.makeCatcher(this, testinput);
	this.onatweentime      = this.makeCatcher(this, onatweentime);
	this.onblink           = this.makeCatcher(this, blink);

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
	this.startBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		}
		testinput();
		blinkTimer = setInterval('System.onblink()', settings.caretBlinkSpeed);
	}

	/**
	| Stops the blink timer.
	*/
	this.stopBlinker = function() {
		if (blinkTimer) {
			clearInterval(blinkTimer);
		}
	}

	this.mio = new MeshIO();

	this.startBlinker();
	// hinders init to be called another time
	this.init = this._init = null;

	this.cSpace.redraw();
}};

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
	var f = System.fabric; // todo?

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

/**
| Makes the edgemenus path.
|
| fabric : to path upon
| border : additional inward distance
| section:
|   -2 structure frame
|   -1 outer frame
|   >0 buttons
*/
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

/**
| Draws the edgemenu.
*/
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

/**
| Returns which section the position is at.
| todo rename
*/
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
	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
	this.edgemenu = new Edgemenu();

	//todo evil
	this.iaction = {
		act : ACT.NONE,
	};

	// panning offset
	this.fabric = new Fabric(System.fabric);
	this.fabric.pan = this.pan = Point.zero; // TODO no double pan

	this.zoom = 1;
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
Space.prototype.redraw = function() {
	var editor = System.editor;
	editor.caret.save = null;
	this.selection = editor.selection; // <- TODO double info = bad
	this.fabric.attune();

	for(var zi = this.z.length - 1; zi >= 0; zi--) {
		var it = this.items.get(this.z.get(zi));
		it.draw(this.fabric, this.action, this.selection);
	}
	if (this.focus) this.focus.drawHandles(this.fabric, this.action);

	var ia = this.iaction;
	switch(ia.act) {
	case ACT.FMENU :
		this._floatmenu.draw();
		break;
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
	}
	this.edgemenu.draw();
	editor.updateCaret();
}

/* user pressed a special key */
Space.prototype.specialKey = function(keyCode, shift, ctrl) {
	var rv = System.editor.specialKey(this.focus, keyCode, shift, ctrl);
	if (rv) {
		this.redraw();
	}
}

/* user entered normal text (one character or more) */
Space.prototype.input = function(text) {
	if (System.editor.input(this.focus, text)) {
		this.redraw();
	}
}

/* the canvas/space got focus from the system*/
Space.prototype.systemFocus = function() {
	if (!this.focus) {
		return
	}
	System.editor.caret.show();
	System.editor.updateCaret();
}

/* the canvas/space lost system focus */
Space.prototype.systemBlur = function() {
	System.editor.caret.hide();
	System.editor.updateCaret();
}

/* sets the focussed item or loses it if null*/
Space.prototype.setFocus = function(item) {
	this.focus = item;

	/* TODO XXX
	var caret = System.editor.caret;
	if (item) {
		caret.set(item, item.dtree.first.first, 0);
		caret.show();
	} else {
		caret.hide();
		caret.set(null, null, null);
	}
	*/
}

/* mouse hover */
Space.prototype.mousehover = function(p) {
	var pp = p.sub(this.pan);
	var com = null;
	var editor = System.editor;
	var redraw = this.edgemenu.mousepos !== this.edgemenu.getMousepos(p);
	if (this.edgemenu.mousepos >= 0) {
		/* mouse floated on edge menu, no need to look further */
		System.setCursor('default');
		if (redraw) this.redraw();
		return;
	}

	switch(this.iaction.act) {
	case ACT.FMENU :
		redraw = (this._floatmenu.mousepos !== this._floatmenu.getMousepos(p)) || redraw;
		if (this._floatmenu.mousepos >= 0) {
			/* mouse floated on float menu, no need to look further */
			System.setCursor('default');
			if (redraw) this.redraw();
			return;
		}
		break;
	case ACT.IMENU :
		redraw = (this._itemmenu.mousepos !== this._itemmenu.getMousepos(p)) || redraw;
		if (this._itemmenu.mousepos >= 0) {
			/* mouse floated on item menu, no need to look further */
			System.setCursor('default');
			if (redraw) this.redraw();
			return;
		}
		break;
	}

	if (this.focus) {
		// todo move into items
		if (this.focus.withinItemMenu(pp)) {
			System.setCursor('pointer');
			if (redraw) this.redraw();
			return;
		}

		if ((com = this.focus.checkItemCompass(pp))) {
			System.setCursor(com+'-resize');
			if (redraw) this.redraw();
			return;
		}
	}

	// todo remove nulls by shiftKey, ctrlKey
	var tx = this._transfix(TXE.HOVER, pp, null, null);
	redraw = redraw || (tx & TXR.REDRAW);
	if (!(tx & TXR.HIT)) { System.setCursor('crosshair');}
	if (redraw) this.redraw();
}

/**
| Asks every item that intersects with a point if it feels reponsible for an event.
*/
Space.prototype._transfix = function(txe, p, shift, ctrl) {
	var fx = 0;
	for(var zi = 0, zlen = this.z.length; zi < zlen; zi++) {
		var it = this.items.get(this.z.get(zi));
		fx |= it.transfix(txe, this, p, zi, shift, ctrl);
		if (fx & TXR.HIT) break;
	}
	return fx;
}


/* starts creating a new relation */
Space.prototype.actionSpawnRelation = function(item, p) {
	var ia = this.iaction;
	ia.act = ACT.RBIND;
	ia.item = item;
	ia.sp = ia.smp = p;
	System.setCursor('not-allowed');
}

/* starts a scrolling action */
Space.prototype.actionScrollY = function(item, startY, scrollbar) {
	var ia  = this.iaction;
	ia.act  = ACT.SCROLLY;
	ia.item = item;
	ia.sy   = startY;
	ia.ssy  = scrollbar.pos;
}

// starts dragging an item  TODO rename
Space.prototype.actionDrag = function(item, start) {
	if (this.action) throw new Error('action not null on action');
	this.action = new Action(Action.ITEMDRAG, item, start);
	System.setCursor('move');
}


Space.prototype.actionRBindTo = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		console.log('not binding to itself');
		System.setCursor('default');
		return;
	}
	var rel = Relation.create(this.iaction.item, toItem);
	System.repository.updateItem(rel);
}

Space.prototype.actionRBindHover = function(toItem) {
	if (toItem.id === this.iaction.item.id) {
		System.setCursor('not-allowed');
		return;
	}
	System.setCursor('default');
	this.iaction.item2 = toItem;
}


/* starts an operation with the mouse held down */
Space.prototype.dragstart = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);
	var editor  = System.editor;
	var iaction = this.iaction;

	/* if (this.focus && this.focus.withinItemMenu(pp)) {
		this.actionSpawnRelation(this.focus, pp);
		this.redraw();
		return;
	} */

	var tfx = this._transfix(TXE.DRAGSTART, pp, shift, ctrl);
	if (!(tfx & TXR.HIT)) {
		// panning
		this.action = new Action(Action.PAN, null, pp);
		System.setCursor('crosshair');
		return;
	}
	if (tfx & TXR.REDRAW) this.redraw();
}

/* a click is a mouse down followed within dragtime by 'mouseup' and
 * not having moved out of 'dragbox'. */
Space.prototype.click = function(p, shift, ctrl) {
	var pp = p.sub(this.pan);

	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		this._itemmenu = focus.newItemMenu(this.pan);
		this.iaction.act = ACT.IMENU;
		this.redraw();
		return;
	}

	var tfx = this._transfix(TXE.CLICK, pp, shift, ctrl);

	if (!(tfx & TXR.HIT)) {
		this.iaction.act = ACT.FMENU;
		this._floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);

		System.setCursor('default');
		this.setFocus(null);
		this.redraw();
		return;
	}

	if (tfx & TXR.REDRAW) this.redraw();
}

/* stops an operation with the mouse held down */
Space.prototype.dragstop = function(p, shift, ctrl) {
	debug('DRAGSTOP', p.x, p.y);
	var pp = p.sub(this.pan);
	var editor = System.editor;
	var action = this.action;
	var redraw = false;
	if (!action) throw new Error('Dragstop without action?');
	switch (action.type) {
	case Action.ITEMDRAG :
		debug('dragmoveto',
			action.item.zone.pnw.x + pp.x - action.start.x,
			action.item.zone.pnw.y + pp.y - action.start.y);

		action.item.moveto(action.item.zone.pnw.add(
			pp.x - action.start.x,
			pp.y - action.start.y));
		System.setCursor('default');
		redraw = true;
		break;
	case Action.PAN :
		break;
	case ACT.IRESIZE :
		// todo rename everything, make iaction a prototype.
		iaction.com  = null;
		iaction.item = null;
		iaction.sip  = null;
		iaction.siz  = null;
		break;
	case ACT.SCROLLY :
		iaction.sy   = null;
		break;
	case ACT.RBIND :
		iaction.smp = null;
		this._transfix(TXE.RBINDTO, pp, shift, ctrl);
		redraw = true;
		break;
	default :
		throw new Error('Invalid action in "Space.dragstop"');
	}
	this.action = null;
	if (redraw) this.redraw();
	return;
}

/**
| Moving during an operation with the mouse held down.
*/
Space.prototype.dragmove = function(p, shift, ctrl) {
	debug('DRAGMOVE', p.x, p.y);
	var pp = p.sub(this.pan);
	var redraw = false;
	var action = this.action;

	switch(action.type) {
	case Action.PAN :
		this.pan = this.fabric.pan = p.sub(action.start); // TODO double pan?
		// System.repository.savePan(this.pan); TODO!
		this.redraw();
		return;
	case Action.ITEMDRAG :
		action.move = pp;
		this.redraw();
		return;
	case ACT.IRESIZE :
		var ipnw = iaction.siz.pnw;
		var ipse = iaction.siz.pse;
		var it = iaction.item;
		var dx = p.x - iaction.sp.x;
		var dy = p.y - iaction.sp.y;
		var pnw, pse;
		switch (iaction.com) {
		case 'n'  :
			pnw = Point.renew(ipnw.x, min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = ipse;
			break;
		case 'ne' :
			pnw = Point.renew(ipnw.x, min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = Point.renew(max(ipse.x + dx, ipnw.x), ipse.y, ipnw, ipse);
			break;
		case 'e'  :
			pnw = ipnw;
			pse = Point.renew(max(ipse.x + dx, ipnw.x), ipse.y, ipnw, ipse);
			break;
		case 'se' :
			pnw = ipnw;
			pse = Point.renew(max(ipse.x + dx, ipnw.x), max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 's' :
			pnw = ipnw;
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 'sw'  :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), ipnw.y, ipnw, ipse),
			pse = Point.renew(ipse.x, max(ipse.y + dy, ipnw.y), ipnw, ipse);
			break;
		case 'w'   :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), ipnw.y, ipnw, ipse),
			pse = ipse;
			break;
		case 'nw' :
			pnw = Point.renew(min(ipnw.x + dx, ipse.x), min(ipnw.y + dy, ipse.y), ipnw, ipse);
			pse = ipse;
			break;
		case 'c' :
		default  :
			throw new Error('unknown align');
		}

		redraw = it.setZone(new Rect(pnw, pse), opposite(iaction.com));

		if (redraw) this.redraw();
		System.repository.updateItem(iaction.item);
		return;
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
	default :
		throw new Error('unknown action code in Space.dragging: '+ action.type);
	}
}

/* shows the export dialog */
Space.prototype._exportDialog = function() {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width    = '100%';
	div.style.height   = '100%';
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width = '100%';
	label.style.textAlign = 'center';
	label.style.marginTop = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode(
		'Copy/paste this to a text file (e.g.notepad) and save it there.'
	));
	div.appendChild(label);
	var label2 = document.createElement('div');
	label2.style.width = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode(
		'Sorry for this, current browsers do not yet allow file creation for offline repositories.')
	);
	div.appendChild(label2);
	var ta = document.createElement('textarea');
	ta.style.width       = '90%';
	ta.style.height      = (div.offsetHeight - label.offsetHeight - 150) + 'px';
	ta.style.display     = 'block';
	ta.style.marginLeft  = 'auto';
	ta.style.marginRight = 'auto';
	ta.style.marginTop   = '20px';
	ta.value = System.repository.exportToJString();
	ta.readOnly = true;

	div.appendChild(ta);
	div.appendChild(document.createElement('br'));
	var button = document.createElement('button');
	button.appendChild(document.createTextNode('Dismiss'));
	button.style.width       = '100px';
	button.style.height      = '30px';
	button.style.display     = 'block';
	button.style.marginLeft  = 'auto';
	button.style.marginRight = 'auto';
	button.onclick = function() {
		document.body.removeChild(div);
	}
	div.appendChild(button);
}

/* shows the export dialog */
Space.prototype._importDialog = function() {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width    = '100%';
	div.style.height   = '100%';
	div.style.top      = 0;
	div.style.left     = 0;
	div.style.zIndex   = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width      = '100%';
	label.style.textAlign  = 'center';
	label.style.marginTop  = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode('Warning. Current Repository will be erased!'));
	var label2 = document.createElement('div');
	label2.style.width     = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode(
		'Paste the repository save in the textbox and press "Import".'
	));
	div.appendChild(label);
	div.appendChild(label2);
	var ta = document.createElement('textarea');
	ta.style.width       =  '90%';
	ta.style.height      = (div.offsetHeight - label.offsetHeight - 150)+'px';
	ta.style.display     = 'block';
	ta.style.marginLeft  = 'auto';
	ta.style.marginRight = 'auto';
	ta.style.marginTop   = '20px';
	div.appendChild(ta);
	div.appendChild(document.createElement('br'));

	var bd = document.createElement('div');
	bd.style.display = 'block';
	bd.style.width   = '100%';
	div.appendChild(bd);
	var bdl = document.createElement('div');
	bdl.style.width    = '50%';
	bdl.style.cssFloat = 'left';
	bd.appendChild(bdl);
	var bdr = document.createElement('div');
	bdr.style.width    = '50%';
	bdr.style.cssFloat = 'left';
	bd.appendChild(bdr);

	var okb = document.createElement('button');
	okb.appendChild(document.createTextNode('Import'));
	okb.style.width       = '100px';
	okb.style.height      = '30px';
	okb.style.marginRight = '20px';
	okb.style.cssFloat    = 'right';
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(ta.value);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement('button');
	okc.appendChild(document.createTextNode('Cancel'));
	okc.style.width      = '100px';
	okc.style.height     = '30px';
	okc.style.marginLeft = '20px';
	okc.style.cssFloat   = 'left';
	okc.onclick = function() {
		document.body.removeChild(div);
	}
	bdr.appendChild(okc);
}

/* shows the export dialog */
Space.prototype._revertDialog = function() {
	var div = document.createElement('div');
	div.style.position   = 'absolute';
	div.style.width      = '100%';
	div.style.height     = '100%';
	div.style.top        = 0;
	div.style.left       = 0;
	div.style.zIndex     = 10;
	div.style.background = 'rgba(248, 237, 105, 0.9)';
	div.style.overflow   = 'auto';
	document.body.appendChild(div);
	var label = document.createElement('div');
	label.style.width      = '100%';
	label.style.textAlign  = 'center';
	label.style.marginTop  = '20px';
	label.style.fontWeight = 'bold';
	label.appendChild(document.createTextNode('Warning. Current Repository will be erased!'));
	var label2 = document.createElement('div');
	label2.style.width     = '100%';
	label2.style.textAlign = 'center';
	label2.appendChild(document.createTextNode('Revert to default demo state?'));
	div.appendChild(label);
	div.appendChild(label2);
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement('br'));
	var bd = document.createElement('div');
	bd.style.display = 'block';
	bd.style.width   = '100%';
	div.appendChild(bd);
	var bdl = document.createElement('div');
	bdl.style.width    = '50%';
	bdl.style.cssFloat = 'left';
	bd.appendChild(bdl);
	var bdr = document.createElement('div');
	bdr.style.width    = '50%';
	bdr.style.cssFloat = 'left';
	bd.appendChild(bdr);

	var okb = document.createElement('button');
	okb.appendChild(document.createTextNode('Revert'));
	okb.style.width       = '100px';
	okb.style.height      = '30px';
	okb.style.marginRight = '20px';
	okb.style.cssFloat    = 'right';
	var space = this;
	okb.onclick = function() {
		System.repository.importFromJString(demoRepository);
		document.body.removeChild(div);
		space.redraw();
	}
	bdl.appendChild(okb);

	var okc = document.createElement('button');
	okc.appendChild(document.createTextNode('Cancel'));
	okc.style.width      = '100px';
	okc.style.height     = '30px';
	okc.style.marginLeft = '20px';
	okc.style.cssFloat   = 'left';
	okc.onclick = function() {
		document.body.removeChild(div);
	}
	bdr.appendChild(okc);
}


/* mouse down event */
Space.prototype.mousedown = function(p) {
	var pp = p.sub(this.pan);
	var iaction = this.iaction;
	var editor = System.editor;
	var redraw = false;

	var md = this.edgemenu.getMousepos(p);
	if (md >= 0) {
		iaction.act = ACT.NONE;
		redraw = true;
		switch(md) {
		case 0:
			this._exportDialog();
			break;
		case 1:
			this._revertDialog();
			break;
		case 2:
			this._importDialog();
			break;
		}
		if (redraw) this.redraw();
		return MST.NONE;
	}

	switch (iaction.act) {
	case ACT.FMENU :
		var md = this._floatmenu.getMousepos(p);
		iaction.act = ACT.NONE;
		var fm = this._floatmenu;
		if (md < 0) {
			break;
		}
		switch(md) {
		case 'n' : // note
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			// todo, beautify point logic.
			var pnw = fm.p.sub(half(nw) + this.pan.x, half(nh) + this.pan.y);
			var pse = pnw.add(nw, nh);
			var notePath = System.mio.newNote(new Rect(pnw, pse));
			this.setFocus(notePath);
			break;
		case 'ne' : // label
			throw new Error('TODO');
			var pnw = fm.p.sub(this.pan);
			var pse = pnw.add(100, 50);

			//var dtree = new DTree(20);  TODO
			//dtree.append(new Para('Label'));
			var label = new Label(null, new Rect(pnw, pse), dtree);
			label.moveto(pnw.sub(half(label.zone.width), half(label.zone.height)));
			this.setFocus(label);
			break;
		}
		this.redraw();
		return MST.NONE;
	case ACT.IMENU :
		var md = this._itemmenu.getMousepos(p);
		iaction.act = ACT.NONE;
		redraw = true;
		if (md) {
			switch(md) {
			case 'n':
				System.repository.removeItem(this.focus);
				this.setFocus(null);
				break;
			}
			if (redraw) this.redraw();
			return MST.NONE;
		}
		break;
	}

	if (this.focus) {
		if (this.focus && this.focus.withinItemMenu(p)) {
			if (redraw) this.redraw();
			return MST.ATWEEN;
		}
		var com;
		if ((com = this.focus.checkItemCompass(pp))) {
			/* resizing */
			iaction.act  = ACT.IRESIZE;
			iaction.com  = com;
			iaction.item = this.focus;
			iaction.sp   = p;
			iaction.siz  = this.focus.handlezone;
			System.setCursor(com+'-resize');
			if (redraw) this.redraw();
			return MST.DRAG;
		}
	}

	if (redraw) this.redraw();
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
 ,--,--'                    .
 `- | ,-. ,-. ,-. ,-. ,-. ,-| ,-.
  , | |   |-' |-' | | | | | | |-'
  `-' '   `-' `-' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Part of a tree-structure.
 TODO remove???
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Treenode() {
	// nada
}

// appends tnode to list of children
/*
Treenode.prototype.append = function(tnode) {
	if (tnode.parent) {
		throw new Error('append() on a node already part of a tree');
	}
	tnode.parent = this;
	if (!this.last) {
		this.first = this.last = tnode;
		tnode.prev = tnode.next = null;
	} else {
		this.last.next = tnode;
		tnode.prev = this.last;
		this.last = tnode;
		tnode.next = null;
	}
	this.listen();
}

// default pass to parent
Treenode.prototype.listen = function() {
	if (this.parent) this.parent.listen();
}

// inserts tnode before child bnode 
Treenode.prototype.insertBefore = function(tnode, bnode) {
	if (!bnode) {
		this.append(tnode);
		return
	}

	if (tnode.parent) {
		throw new Error('Treenode.append() on a node already part of a tree');
	}
	tnode.parent = this;

	if (bnode == this.first) {
		this.first.prev = tnode;
		tnode.next = this.first;
		this.first = tnode;
		tnode.prev = null;
	}

	tnode.next = bnode;
	tnode.prev = bnode.prev;
	bnode.prev.next = tnode;
	bnode.prev = tnode;
	this.listen();
}

// removes child tnode 
Treenode.prototype.remove = function(tnode) {
	if (tnode == this.first) this.first = tnode.next;
	if (tnode == this.last) this.last = tnode.prev;
	if (tnode.next) tnode.next.prev = tnode.prev;
	if (tnode.prev) tnode.prev.next = tnode.next;
	tnode.parent = null;
	this.listen();
}

*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,--,--'      .            .
 `- | ,-. . , |- ,-. ,-. ,-| ,-.
  , | |-'  X  |  | | | | | | |-'
  `-' `-' ' ` `' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
TODO remove
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*function Textnode(text)
{
	Treenode.call(this);
	this._text = text ? text : '';
}
subclass(Textnode, Treenode);

Object.defineProperty(Textnode.prototype, 'text', {
	get: function() {
		return this._text;
	},

	set: function(text) {
		if (this._text != text) {
			this._text = text;
			this.listen();
		}
	}
});
*/

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

	this._fabric = new Fabric(0 ,0);
	this._fabricUp2d8 = false; // fabric up-to-date
	this._flowWidth = null;
	this.pos = null; // position of para in doc.
}
subclass(Para, Woods.Para);

/**
| (re)flows the paragraph, positioning all chunks.
*/
Para.prototype._flow = function() {
	if (this._flowActual) return;

	// builds position informations.
	var pinfo = this._pinfo = [];
	var fw = this._flowWidth;
	// the width really used
	var width = 0;
	var doca = this.getAnchestor('DocAlley');
	var fontsize = doca.fontsize;

	var x = 0;
	var y = fontsize;
	Measure.font = doca.getFont();
	var space = Measure.width(' ');
	var pline = 0;
	var l = pinfo[pline] = {a: [], x: x, y: y};

	//for(var node = this.first; node; node = node.next) { TODO
	var t = this.get('text');

	//var reg = !dtree.pre ? (/(\s*\S+)\s?(\s*)/g) : (/(.+)()$/g);
	//var reg = !dtree.pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g); TODO
	var reg = (/(\s*\S+|\s+$)\s?(\s*)/g);

	var start = true; // at start of line
	for(var ca = reg.exec(t); ca != null; ca = reg.exec(t)) {
		// text is a word plus hard spaces
		var text = ca[1] + ca[2];
		var w = Measure.width(text);
		if (fw > 0 && x + w + space > fw) {
			if (!start) {
				// soft break
				if (x > width) width = x;
				x = 0;
				//y += R(doca.fontsize * (dtree.pre ? 1 : 1 + settings.bottombox));
				y += R(doca.fontsize * (1 + settings.bottombox));
				pline++;
				pinfo[pline] = {a: [], x: x, y: y};
				start = true;
			} else {
				// horizontal overflow
				console.log('HORIZONTAL OVERFLOW'); // TODO
			}
		}
		pinfo[pline].a.push({
			x: x,
			w: w,
			offset: ca.index,
			text: text,
		});;
		x += w + space;
		start = false;
	}
	if (x > width) {
		// stores maximum width used.
		width = x;
	}

	// stores metrics
	this._softHeight = y;
	this._width = width;
	this._flowActual = true;
}

/**
| Returns the soft height.
|
| (without addition of box below last line base line for 'gpq' etc.)
*/
Para.prototype.getSoftHeight = function() {
	this._flow();
	return this._softHeight;
}

/**
| Returns the width the para really uses.
*/
Object.defineProperty(Para.prototype, 'width', {
	get: function() {
		this._flow();
		return this._width;
	},
});

/**
| Returns the computed height of the paragraph.
*/
Object.defineProperty(Para.prototype, 'height', {
	get: function() {
		this._flow();
		var doca = this.getAnchestor('DocAlley');
		return this._softHeight + R(doca.fontsize * settings.bottombox);
	},
});


/**
| The width a para should have.
*/
Object.defineProperty(Para.prototype, 'flowWidth', {
	get : function() {
		return this._flowWidth;
	},
	set : function(fw) {
		if (this._flowWidth === fw) return;
		this._flowWidth = fw;
		this._flowUp2D8 = false;
		this._farbicUp2D8 = false;
	}
});

/**
| Draws the paragraph in its cache and returns it.
*/
Para.prototype.getFabric = function() {
	if (this._fabricUp2D8) return this._fabric;

	var f = this._fabric;
	this._flow();

	// TODO: work out exact height for text below baseline
	var doca = this.getAnchestor('DocAlley');
	f.attune(this);
	f.fontStyle(doca.getFont(), 'black', 'start', 'alphabetic');

	// draws text into the fabric
	var pinfo = this._pinfo;
	for(var il = 0, pinfolen = pinfo.length; il < pinfolen; il++) {
		var pl = pinfo[il];
		for(var ic = 0, plen = pl.a.length; ic < plen; ic++) {
			var pc = pl.a[ic];
			f.fillText(pc.text, pc.x, pl.y);
		}
	}

	this._fabricUp2D8 = true;
	return f;
}

// drops the cache (cause something has changed
/* TODO?
Para.prototype.listen = function() {
	this._flowUp2D8 = false;
	this._fabricUp2D8    = false;
	if (this.parent) this.parent.listen();
}*/

/**
| Joins a child node to its next sibling,
| or joins this paragraph to its next sibling
|
| TODO, this doesnt belong here .
*/
/* TODO?
Para.prototype.joinToNext = function(node, caret) {
	var next = node.next;
	if (next) {
		alert('joinToNext, not yet implemented');
	}
	var nextPara = this.next;
	if (nextPara == null) {
		// end of document
		return false;
	}
	node.text = node.text + nextPara.first.text;
	// todo take over siblings
	this.parent.remove(nextPara);
	return true;
}
*/

/**
| Joins a child node to its previous sibling,
| or joins this paragraph to its previos sibling.
|
| todo, doesnt belong here.
*/
/* TODO?
Para.prototype.joinToPrevious = function(node, caret) {
	var prev = node.prev;
	if (prev) {
		alert('joinToPrevious, not yet implemented');
	}
	var prevPara = this.prev;
	if (prevPara == null) {
		return false;
	}
	var nt = node.text;
	var plc = prevPara.last;
	if (caret) {
		caret.set(plc, plc.text.length);
	}
	plc.text = plc.text + nt;
	this.parent.remove(this);
	return true;
}
*/

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
/*DTree.prototype.paraAtP = function(p) {
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
Item.prototype.getH6Slice = function(action) {
	var hzone = this.handlezone;

	// TODO move to some common place?
	var pnw = hzone.pnw;
	if (action && action.item === this && action.type === Action.ITEMDRAG && action.move) {
		pnw = pnw.add(action.move.x - action.start.x, action.move.y - action.start.y);
	}

	if (this._h6slice && this._h6slice.psw.eq(pnw)) return this._h6slice;
	return this._h6slice = new HexagonSlice(
		pnw, settings.itemmenu.innerRadius, settings.itemmenu.slice.height);
};

/**
| Creates a new Hexmenu for this item.
*/
Item.prototype.newItemMenu = function(pan) {
	var labels = this._itemMenuLabels = {n : 'Remove'};
	return new Hexmenu(this.getH6Slice().pm.add(pan), settings.itemmenu,  labels);
}

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
	var hzone = this.handlezone;
	if (!ha) return null;
	var d   =       settings.handle.size; // distance
	var din = 0.5 * settings.handle.size; // inner distance
	var dou =       settings.handle.size; // outer distance

	var n = p.y >= hzone.pnw.y - dou && p.y <= hzone.pnw.y + din;
	var e = p.x >= hzone.pse.x - din && p.x <= hzone.pse.x + dou;
	var s = p.y >= hzone.pse.y - din && p.y <= hzone.pse.y + dou;
	var w = p.x >= hzone.pnw.x - dou && p.x <= hzone.pnw.x + din;

	if (n) {
		if (w && ha.nw) return 'nw';
		if (e && ha.ne) return 'ne';
		if (ha.n && abs(p.x - hzone.pc.x) <= d) return 'n';
		return null;
	}
	if (s) {
		if (w && ha.sw) return 'sw';
		if (e && ha.se) return 'se';
		if (ha.s && abs(p.x - hzone.pc.x) <= d) return 's';
		return null;
	}
	if (w && ha.w && abs(p.y - hzone.pc.y) <= d) return 'w';
	if (e && ha.e && abs(p.y - hzone.pc.y) <= d) return 'e';
	return null;
}

/**
| Paths the resize handles.
*/
Item.prototype.pathResizeHandles = function(fabric, border, edge, action) {
	if (border !== 0) throw new Error('borders unsupported for handles');
	var ha = this.handles;
	var zone = this.handlezone;
	var ds = settings.handle.distance;
	var hs = settings.handle.size;
	var hs2 = half(hs);
	
	var pnw = zone.pnw;
	if (action && action.item === this && action.type === Action.ITEMDRAG && action.move) {
		pnw = pnw.add(action.move.x - action.start.x, action.move.y - action.start.y);
	}
	
	var pse = zone.pse;
	if (action && action.item === this && action.type === Action.ITEMDRAG && action.move) {
		pse = pse.add(action.move.x - action.start.x, action.move.y - action.start.y);
	}

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
Item.prototype.drawHandles = function(fabric, action) {
	// draws the resize handles
	fabric.edge(settings.handle.style.edge, this, 'pathResizeHandles', action);

	// draws item menu handler
	var sstyle = settings.itemmenu.slice.style;
	fabric.paint(sstyle.fill, sstyle.edge, this.getH6Slice(action), 'path');
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
DocAlley.prototype.draw = function(fabric, action, selection, imargin, scrollp) {
	var paraSep = /* TODO this.pre ? 0 :*/ this.fontsize;

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

	// draws tha paragraphs

	this.forEachNumber(function(para, k) {
		var pf = para.getFabric();
		para.pos = new Point(imargin.w, R(y));

		if (pf.width > 0 && pf.height > 0) {
			fabric.drawImage(pf, imargin.w, y - scrollp.y);
		}
		y += para.getSoftHeight() + paraSep;
	});
}

/**
| Returns the default font of the dtree.
*/
DocAlley.prototype.getFont = function() {
	return this.fontsize + 'px ' + settings.defaultFont;
}

/**
* Gets/Sets the flowWidth.
*/
Object.defineProperty(DocAlley.prototype, 'flowWidth', {
	get: function() {
		return this._flowWidth;
	},

	set: function(fw) {
		if (this._flowWidth == fw) return;
		this._flowWidth = fw;
		this.forEachNumber(function(para, k) {
			para.flowWidth = fw;
		}),
		this._cacheWidth  = null; // TODO used? // TODO use a rect.
		this._cacheHeight = null; // TODO used?
	}
});

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
	this._fabricUp2D8 = false;
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
Note.prototype.paraAtP = function(p) {
	if (p.y < this.imargin.n) return null;
	return this.dtree.paraAtP(p);
}

/**
| Drops the cache.
*/
Note.prototype.listen = function() {
	this._fabricUp2D8 = false;
	// end of chain
}

/**
| Checks if this items reacts on an event.
| Returns transfix code.
*/
Note.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch (txe) {
	case TXE.HOVER :
		System.setCursor('default');
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			// System.repository.moveToTop(z); TODO XXX
			txr |= TXR.REDRAW; // todo full redraw
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		var sbary = this.scrollbarY;
		var pr = p.sub(this.zone.pnw);
		if (sbary.visible && sbary.zone.within(pr)) {
			space.actionScrollY(this, p.y, this.scrollbarY);
		} else {
			space.actionDrag(this, p);
		}
		return txr;
	case TXE.CLICK :
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; // todo full redraw
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		var op = new Point(
			p.x - this.zone.pnw.x,
			p.y - this.zone.pnw.y + max(0, this.scrollbarY.pos));
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;
	case TXE.RBINDHOVER :
		space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW;
	case TXE.RBINDTO :
		space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW;
	default :
		throw new Error('Unknown transfix code:'+txe);
	}
}

/**
| Sets the notes position and size.
| The note does not have to accept the full zone.
| For example it will refuse to go below minimum size.
| Returns true if something changed.
*/
Note.prototype.setZone = function(zone, align) {
	// ensures minimum size
	if (zone.width < settings.note.minWidth || zone.height < settings.note.minHeight) {
		zone = zone.resize(
			max(zone.width,  settings.note.minWidth),
			max(zone.height, settings.note.minHeight),
			align);
	}
	if (this.zone.eq(zone)) return false;
	System.mio.setZone(this, zone);


	// adapts scrollbar position
	this._fabricUp2D8 = false;
	this.setScrollbar();
	return true;
}

/**
| Returns the notes silhoutte.
*/
Note.prototype.getSilhoutte = function() {
	if (this._silhoutte && this._silhoutte.eq(this.zone)) {
		debug('Silhoutte buffer hit!');
		return this._silhoutte;
	}
	debug('Silhoutte NEW!');

	return this._silhoutte = new RoundRect(
		Point.zero, new Point(this.zone.width, this.zone.height),
		settings.note.cornerRadius);
}

/**
| The zone the handles appear on.
*/
Object.defineProperty(Note.prototype, 'handlezone', {
	get : function() { return this.zone; }
});

/**
| Sets new position retaining size
*/
Note.prototype.moveto = function(p) {
	if (this.zone.pnw.eq(p)) return false;
	System.mio.setZone(this, this.zone.moveto(p));
	return true;
}

/**
| The inner width for contents excluding scrollbars.
*/
Object.defineProperty(Note.prototype, 'iwidth', {
	get: function() {
		return this.zone.width - this.imargin.x;
//		return this.zone.width - this.imargin.x -  TODO
//			(this.scrollbarY.pos >= 0 ? settings.scrollbar.strength : 0);
	},
});

/**
| The inner height for contents excluding scrollbars.
*/
Object.defineProperty(Note.prototype, 'iheight', {
	get: function() {
		return this.zone.height - this.imargin.y;
	},
});


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
Note.prototype.draw = function(fabric, action, selection) {
	var f  = this._fabric;

	// buffer hit?
	if (!this._fabricUp2D8) {
		// if not fill the buffer
		// resize the canvas
		f.attune(this.zone);
		f.fill(settings.note.style.fill, this.getSilhoutte(), 'path');

		var doca = this.doc;
		doca.flowWidth = this.iwidth;

		// calculates if a scrollbar is needed
		/* TODO XX
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
		doca.draw(f, action, selection, this.imargin, Point.zero); // TODO scrollp

		/*
		// paints the scrollbar
		if (sbary.visible) {
			this.setScrollbar();
			sbary.paint(f);
		}
		*/

		// paints the border
		f.edge(settings.note.style.edge, this.getSilhoutte(), 'path');

		this._fabricUp2D8 = true;
	}

	var pnw = this.zone.pnw;
	if (action && action.item === this && action.type === Action.ITEMDRAG && action.move) {
		debug('pnw1', pnw.x, pnw.y);
		pnw = pnw.add(action.move.x - action.start.x, action.move.y - action.start.y);
		debug('pnw2', pnw.x, pnw.y);
	}


	fabric.drawImage(f, pnw);
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
	this._fabricUp2D8 = false;
	if (typeof(this.zone.pse.x) === 'undefined') throw new Error('Invalid label'); // todo remove
	System.repository.addItem(this, true);
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
Label.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.zone.within(p)) return 0;
	switch(txe) {
	case TXE.HOVER :
		System.setCursor('default');
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		space.actionDrag(this, p.sub(this.zone.pnw));
		return txr;
	case TXR.CLICK:
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW; /* todo full redraw */
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}
		var op = p.sub(this.zone.pnw);
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;
	case TXE.RBINDHOVER :
		space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW;
	case TXE.RBINDTO :
		space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW;
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
	dtree.flowWidth = -1;
	if (!this.zone) this.zone = zone;
	this.zone = this.zone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._fabricUp2D8 = false;
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

/* returns the para at y */
Label.prototype.paraAtP = function(p) {
	return this.dtree.paraAtP(p);
}

/* drops the cache */
Label.prototype.listen = function() {
	if (this._lock) return;
	this._fabricUp2D8 = false;
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
Label.prototype.draw = function(fabric, action, selection) {
	var f = this._fabric;
	var dtree = this.dtree;

	// buffer hit?
	if (this._fabricUp2D8) {
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
	dtree.flowWidth   = -1;
	dtree.pre         = true;
	this.imargin      = Relation.imargin;
	this.setTextZone(textZone);
	this._fabric      = new Fabric();
	this._fabricUp2D8 = false;

	System.repository.addItem(this, true);
	System.repository.addOnlook(this.id, this.i1id);
	System.repository.addOnlook(this.id, this.i2id);
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
	dtree.flowWidth = -1;
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
	System.repository.removeOnlook(this.id, this.i1id);
	System.repository.removeOnlook(this.id, this.i2id);
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
	dtree.flowWidth = -1;
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
	this._fabricUp2D8 = false;
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
	dtree.flowWidth = -1;
	if (!this.textZone) this.textZone = zone;
	this.textZone = this.textZone.resize(this._dWidth(), this._dHeight(), align);
	this._lock = false;
	this._fabricUp2D8 = false;
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
Relation.prototype.transfix = function(txe, space, p, z, shift, ctrl) {
	if (!this.textZone.within(p)) return 0;
	switch(txe) {
	case TXE.HOVER :
		System.setCursor('default');
		return TXR.HIT;
	case TXE.DRAGSTART :
		var txr = TXR.HIT;
		if (ctrl) {
			space.actionSpawnRelation(this, p);
			return txr | TXR.REDRAW;
		}
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW;
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}

		space.actionDrag(this, p.sub(this.handlezone.pnw));
		return txr;
	case TXR.CLICK:
		var txr = TXR.HIT;
		if (z > 0) {
			System.repository.moveToTop(z);
			txr |= TXR.REDRAW;
		}
		if (space.focus != this) {
			space.setFocus(this);
			txr |= TXR.REDRAW;
		}
		var op = p.sub(this.textZone.pnw);
		var para = this.paraAtP(op);
		if (para) {
			var editor = System.editor;
			editor.caret.setFromPoint(para, op.sub(para.p));
			editor.caret.show();
			editor.deselect();
			txr |= TXR.REDRAW;
		}
		return txr;
	case TXE.RBINDHOVER :
		space.actionRBindHover(this);
		return TXR.HIT | TXR.REDRAW;
	case TXE.RBINDTO :
		space.actionRBindTo(this);
		return TXR.HIT | TXR.REDRAW;
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

/* returns the para at y */
Relation.prototype.paraAtP = function(p) {
	return this.dtree.paraAtP(p);
}


/**
| Something has changed.
*/
Relation.prototype.listen = function() {
	if (this._lock) return;
	this._fabricUp2D8 = false;
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
	this._fabricUp2D8 = false;
	return true;*/
	throw new Error('unimplemented');
}

/**
| Draws the item.
*/
Relation.prototype.draw = function(fabric, action, selection) {
	var f = this._fabric;
	var dtree = this.dtree;
	var it1 = System.repository.items[this.i1id]; // todo funcall
	var it2 = System.repository.items[this.i2id];
	if (!this._fabricUp2D8) {
		f.attune(this.textZone);
		f.edge(settings.relation.style.labeledge, f, 'path');
		dtree.draw(f, action, selection, this.imargin, 0);
		this._fabricUp2D8 = true;
	}
	var l1 = Line.connect(it1.handlezone, 'normal', this.textZone, 'normal'); // todo bindzone
	var l2 = Line.connect(this.textZone,  'normal', it2.handlezone, 'arrow'); // todo bindzone
	// todo combine into one call;
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l1, 'path');
	fabric.paint(settings.relation.style.fill, settings.relation.style.edge, l2, 'path');
	// draws text
	fabric.drawImage(f, this.textZone.pnw);
}

/**
| Something happend on an item onlooked.
*/
Relation.prototype.onlook = function(event, item) {
	switch(event) {
	case ONLOOK.REMOVE :
		if (item.id != this.i1id && item.id != this.i2id) {
			throw new Error('Got onlook for not my item?');
		}
		System.repository.removeItem(this);
		/* todo check for cycles */
		break;
	case ONLOOK.UPDATE :
		/*if ((item.id === this.i1id && !item.zone.eq(this.i1zone)) ||
		    (item.id === this.i2id && !item.zone.eq(this.i2zone))) {
			this._arrow = null;
		}*/
		break;
	default :
		throw new Error('unknown unlook event');
	}
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
	System.cSpaceKey = 'welcome';

	var spacepath = new Path([System.cSpaceKey]);

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
			z : {
			  alley : [
			    0, 1,
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
	System.cSpace = asw.node;
}

MeshIO.prototype.newNote = function(zone) {
	var asw = this.mm.alter(-1,
		new Signature({
			val: {
				'type': 'note',
				'zone': zone,
				'doc': { alley: [ ] },
			},
		}), new Signature({
			path: new Path([System.cSpaceKey, 'items', '$new']),
		}));

	var apath = asw.alts.trg.path;
	if (!(apath instanceof Path)) throw new Error('Cannot reget new Note');

	this.mm.alter(-1,
		new Signature({
			val: apath.get(-1),
		}), new Signature({
			path: new Path([System.cSpaceKey, 'z', '$end']),
		}));
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
		}), new Signature({
			path: path,
		}));
}

/*
MeshIO.prototype.getCurrentSpace = function() {
	var space = this.mm.get(-1, this.spacepath);
	return space.node;
}*/


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
/*Repository.prototype._loadItem = function(id, js) {
	if (!js || !js.t) throw new Error('JSON error: attributes missing from ('+id+'): '+js);
	switch(js.t) {
	case 'note'  : return Note.jnew(js, id);
	case 'label' : return Label.jnew(js, id);
	case 'rel'   : return Relation.jnew(js, id);
	default      : throw new Error('unknown item type');
	}
}*/

/*Repository.prototype._saveZIDX = function() {
	window.localStorage.setItem('zidx', JSON.stringify(this.zidx));
}*/

/* adds an item to the space */
/*Repository.prototype.addItem = function(item, top) {
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,   ,.       .
 `|  /|  / . ,-. ,-| ,-. . , ,
  | / | /  | | | | | | | |/|/
  `'  `'   ' ' ' `-^ `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.onload = function() {
	var request = document.location.search;
	if (request.indexOf('reset') >= 0) {
		console.log('Clearing localStorage');
		window.localStorage.clear();
	}

	System.init();
}
