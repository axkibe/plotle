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

                                        .---. .       .  .
                                        \___  |-. ,-. |  |
                                            \ | | |-' |  |
                                        `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A networked node item editor.
 This is the client-side script for the user interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

 A variable with $ in its name signifies something cached.
 @@ are milestones for later releases

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Fabric;
var MeshMashine;
var Path;
var Tree;

var system;

/**
| Exports
*/
var shell = null;
var Shell;
var settings;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('shell.js needs a browser!'); }

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

var debug         = Jools.debug;
var fixate        = Jools.fixate;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var isPath        = Path.isPath;

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


// configures tree.
Tree.cogging = true;

/**
| Debugging mode, don't cache anything.
|
| In case of doubt, if caching is faulty, just set this true and see if the error
| vanishes.
*/
var noCache = true;

/**
| The server peer
*/
var peer;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.     .  .
 \___  ,-. |- |- . ,-. ,-. ,-.
     \ |-' |  |  | | | | | `-.
 `---' `-' `' `' ' ' ' `-| `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

settings = {
	// standard font
	defaultFont : 'Verdana,Geneva,Kalimati,sans-serif',
	//defaultFont : 'Freebooter Script,Zapfino,serif',

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
					[1, 'rgba(255, 255, 160, 0.955)']
				]
			},
			edge : [
				{ border: 1, width : 1, color : 'rgb(255, 188, 87)' },
				{ border: 0, width : 1, color : 'black' }
			],
			highlight : [ { border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' } ]
		},

		cornerRadius : 6
	},

	label : {
		minHeight :  20,

		style : {
			edge : [
				//{ border: 0, width: 0.2, color: 'rgba(200, 100, 0, 0.5)' },
				{ border: 0, width: 1, color: 'rgba(100, 100, 0, 0.5)' }
			],
			highlight : [ { border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' } ]
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// offset for creation // @@ calculate dynamically
		createOffset : { x: 27, y: 12 }
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
				{ border: 0, width : 0.5, color : 'black' }
			],
			fill : {
				gradient : 'radial',
				steps : [
					[ 0, 'rgba(255, 255, 168, 0.955)' ],
					[ 1, 'rgba(255, 255, 243, 0.955)' ]
				]
			},
			select : {
				gradient : 'radial',
				steps : [
					[0, 'rgb(255, 185, 81)'  ],
					[1, 'rgb(255, 237, 210)' ]
				]
			}
		}
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
						[ 1, 'rgba(255, 255, 205, 0.9)' ]
					]
				},
				edge : [
					{ border: 1, width :   1, color : 'rgb(255, 200, 105)' },
					{ border: 0, width : 0.7, color : 'black' }
				]
			}
		}
	},

	// selection
	selection : {
		style : {
			fill   : 'rgba(243, 203, 255, 0.9)',
			edge : [
				//{ border : 0, width : 1, color: 'rgb(254,183,253)' },
				{ border : 0, width : 1, color: 'black' }
			]
		}
	},

	// scrollbar
	scrollbar : {
		// pixels to scroll for a wheel event
		textWheelSpeed : 12,

		style : {
			fill : 'rgb(255, 188, 87)',
			edge : [
				{ border : 0, width : 1, color: 'rgb(221, 154, 52)' }
			]
		},
		strength :  8,
		minSize  : 12,
		imarginw :  2
	},

	// size of resize handles
	handle : {
		size      : 10,
		distance  : 0,

		style : {
			edge : [
				{ border: 0, width: 3, color: 'rgb(125,120,32)' },
				{ border: 0, width: 1, color: 'rgb(255,180,90)' }
			]
		}
	},

	relation : {
		style : {
			fill : 'rgba(255, 225, 40, 0.5)',
			edge : [
				{ border: 0, width : 3, color : 'rgba(255, 225, 80, 0.4)' },
				{ border: 0, width : 1, color : 'rgba(200, 100, 0,  0.8)' }
			],
			labeledge : [
				{ border: 0, width : 0.2, color : 'rgba(200, 100, 0, 0.5)' }
			],
			highlight : [
				{ border: 0, width: 3, color: 'rgba(255, 183, 15, 0.5)' }
			]
		},

		// inner margin to text
		imargin  : { n: 1, e: 1, s: 1, w: 1 },

		// offset for creation // @@ calculate dynamically
		createOffset : { x: 44, y: 12 }
	},

	// Blink speed of the caret.
	caretBlinkSpeed : 530
};

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
var Caret = function() {
	// a signature pointing to the caret pos
	// TODO rename .sign
	this.mark = null;

	// x position to retain when using up/down keys.
	this.retainx = null;

	// true if visible
	this.shown = false;

	// true when just blinked away
	this.blinked = false;
};


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
};

/**
| Hides the caret.
*/
Caret.prototype.hide = function() {
	this.shown = false;
};

/**
| Draws or erases the caret.
*/
Caret.prototype.display = function() {
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
	if (this.shown && !this.blinked && this.mark) {
		shell.vget(this.mark.path, -1).drawCaret();
	}
};

/**
| Switches caret visibility state.
*/
Caret.prototype.blink = function() {
	if (this.shown) {
		this.blinked = !this.blinked;
		this.display();
	}
};

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
var Selection = function() {
	this.active = false;
	this.mark1 = null;
	this.mark2 = null;
	this.begin = null;
	this.end   = null;
};

/**
| Sets begin/end so begin is before end.
*/
Selection.prototype.normalize = function() {
	throw new Error('TODO'); // TODO

	/*
	var m1 = this.mark1;
	var m2 = this.mark2;

	if (m1.path.equals(m2.path)) {
		if (m1.at1 <= m2.at1) {
			this.begin = this.mark1;
			this.end   = this.mark2;
		} else {
			this.begin = this.mark2;
			this.end   = this.mark1;
		}
		return;
	}
	var k1 = m1.path.get(-1);
	var k2 = m2.path.get(-1);
	if (k1 === k2) throw new Error('sel has equal keys');

	if (k1 < k2) {
		this.begin = this.mark1;
		this.end   = this.mark2;
	} else {
		this.begin = this.mark2;
		this.end   = this.mark1;
	}*/
};

/**
| The text the selection selects.
*/
Selection.prototype.innerText = function() {
	throw new Error('TODO');

	/*
	if (!this.active) return '';
	this.normalize();
	var mb = this.begin;
	var me = this.end;

	if (mb.entity === me.entity) {
		var text = mb.entity.para.get('text');
		var itxt = text.substring(mb.offset, me.offset);
		return itxt;
	}

	var bpara = mb.entity.para;
	var epara = me.entity.para;
	var btxt = bpara.get('text');
	var etxt = epara.get('text');
	var bkey = bpara.key;
	var ekey = epara.key;
	var doc  = mb.entity.vdoc.doc;
	if (me.entity.vdoc.doc !== doc) throw new Error('selection isn\'t in one doc!');
	var buf = [ btxt.substring(mb.offset, mb.length) ];
	for (var a = bkey + 1, aZ = ekey; a < aZ; a++) {
		buf.push('\n');
		buf.push(doc.get(a).get('text'));
	}
	buf.push('\n');
	buf.push(etxt.substring(0, me.offset));
	return buf.join('');
	*/
};

/**
| Removes the selection including its contents.
*/
Selection.prototype.remove = function() {
	throw new Error('TODO'); // TODO
	/*
	this.normalize();
	this.deselect();
	shell.redraw = true;
	peer.removeSpawn(
		this.begin.entity.para, this.begin.offset,
		this.end.entity.para, this.end.offset
	);
	*/
};

/**
| Deselects the selection.
*/
Selection.prototype.deselect = function() {
	if (!this.active) return;
	this.active = false;
	system.setInput('');
};

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
var Action = function(type, vitem, start) {
	this.type  = type;
	this.vitem = vitem;
	this.start = start;
	this.move  = start;
};

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
var Cockpit = function() {
// TODO, use this!
};

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	// TODO
};

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
};

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
		return 'none';
	}
	*/
	return false;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .       .  .
 \___  |-. ,-. |  |
     \ | | |-' |  |
 `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The users shell.
 Consists of the Cockpit and the Space the user is viewing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
Shell = function(fabric, sPeer) {
	if (shell !== null) throw new Error('Singleton not single');
	shell = this;
	peer  = sPeer;

	Measure.init();
	this.fabric    = fabric;

	var vspath     = new Path(['welcome']);
	this.vspace    = new VSpace(peer.get(-1, vspath), vspath);

	this.cockpit   = new Cockpit();
	this.caret     = new Caret();
	this.action    = null;
	this.selection = new Selection();

	// A flag set to true if anything requests a redraw.
	peer.setReport(this);
	this.redraw = false;
	this._draw();
};

/**
| Sets the caret position.
*/
Shell.prototype.setCaret = function(mark, retainx) {
	var caret = this.caret;
	caret.mark = mark;
	caret.retainx = is(retainx) ? retainx : null;
	return caret;
};

/**
| Returns the visual node path points to.
*/
Shell.prototype.vget = function(path, plen) {
	if (!is(plen)) { plen = path.length; }
	else if (plen < 0) { plen += path.length; }
	if (plen <= 0) throw new Error('cannot vget path of length <= 0');
	if (path.get(0) !== 'welcome') throw new Error('currently space must be "welcome"'); // TODO

	var vnode = this.vspace;
	for (var a = 1; a < plen; a++) {
		vnode = vnode.vv[path.get(a)];
	}
	return vnode;
};

/**
| MeshMashine reports changes
*/
Shell.prototype.report = function(type, tree, src, trg) {
	this.vspace.report(type, tree, src, trg);

	var caret = this.caret;
	var tmark = MeshMashine.transformOne(caret.mark, src, trg);
	if (tmark !== caret.mark) {
		if (tmark.constructor === Array) throw new Error('Invalid caret transformation');
		caret.mark = tmark;
	}

	this._draw();
};

/**
| Meshcraft got the systems focus.
*/
Shell.prototype.systemFocus = function() {
	this.caret.show();
	this.caret.display();
};

/**
| Meshraft lost the systems focus.
*/
Shell.prototype.systemBlur = function() {
	this.caret.hide();
	this.caret.display();
};

/**
| Blink the caret (if shown)
*/
Shell.prototype.blink = function() {
	this.caret.blink();
};

/**
| Creates an action.
*/
Shell.prototype.startAction = function(type, vitem, start) {
	if (this.action) throw new Error('double action');
	return this.action = new Action(type, vitem, start);
};

/**
| Ends an action.
*/
Shell.prototype.stopAction = function() {
	if (!this.action) throw new Error('ending no action');
	this.action = null;
};

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
	this.caret.display();

	this.redraw = false;
};

/**
| A mouse click.
*/
Shell.prototype.click = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.click(p);
	if (this.redraw) this._draw();
};

/**
| Mouse hover.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.mousehover(p);
	if (this.redraw) this._draw();
};

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	var mouseState = this.vspace.mousedown(p);
	if (this.redraw) this._draw();
	return mouseState;
};

/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(keyCode, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	var caret  = this.caret;
	if (caret.mark) { this.vget(caret.mark.path, -1).specialKey(keyCode); }
	if (this.redraw) this._draw();
};

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	this.shift = false;
	this.ctrl  = false;
	var caret  = this.caret;
	if (caret.mark) { this.vget(caret.mark.path, -1).input(text); }
	if (this.redraw) this._draw();
};

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragstart(p);
	if (this.redraw) this._draw();
};

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragmove(p);
	if (this.redraw) this._draw();
};

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpit
	this.vspace.dragstop(p);
	if (this.redraw) this._draw();
};

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;
	// TODO cockpict
	this.vspace.mousewheel(p, dir);
	if (this.redraw) this._draw();
};

/**
| The window has been resized
*/
Shell.prototype.resize = function(width, height) {
	this._draw();
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,-_/,.
 ' |_|/ ,-. . , ,-,-. ,-. ,-. . .
  /| |  |-'  X  | | | |-' | | | |
  `' `' `-' ' ` ' ' ' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 outerRadius |------>|
 innerRadius |->|    '
         .------'.   '   -1
        / \  n  / \  '
       /nw .---.'ne\ '
      /___/  .  \___\'
      \   \ pc  /   /
       \sw `---' se/
        \ /  s  \ /
         `-------'

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
var Hexmenu = function(pc, style, labels) {
	this.p = pc;
	this.style = style;
	this.hflower = new HexagonFlower(pc, style.innerRadius, style.outerRadius, labels);
	this.labels = labels;
	this.mousepos = null;
};

/**
| Draws the hexmenu.
*/
Hexmenu.prototype.draw = function() {
	var f = shell.fabric;

	f.fill(settings.floatmenu.style.fill, this.hflower, 'path', 'outerHex');
	if (this.mousepos && this.mousepos !== 'center') {
		f.fill(settings.floatmenu.style.select, this.hflower, 'path', this.mousepos);
	}
	f.edge(settings.floatmenu.style.edge, this.hflower, 'path', 'structure');

	f.fontStyle('12px '+settings.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var rd = this.style.outerRadius * (1 - 1 / 3.5);

	if (labels.n)  f.fillText(labels.n, this.p.x, this.p.y - rd);
	if (labels.ne) f.fillRotateText(labels.ne, this.p, Math.PI / 3 * 1, rd);
	if (labels.se) f.fillRotateText(labels.se, this.p, Math.PI / 3 * 2, rd);
	if (labels.s)  f.fillText(labels.n, this.p.x, this.p.y + rd);
	if (labels.sw) f.fillRotateText(labels.sw, this.p, Math.PI / 3 * 4, rd);
	if (labels.nw) f.fillRotateText(labels.nw, this.p, Math.PI / 3 * 5, rd);
	if (labels.c)  f.fillText(labels.c, this.p);
};

/**
| Sets this.mousepos and returns it according to p.
*/
Hexmenu.prototype.getMousepos = function(p) {
	return this.mousepos = this.hflower.within(p);
};

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
var VSpace = function(twig, path) {
	this.twig        = twig;
	this.path        = path;
	this.key         = path.get(-1);
	this.fabric      = new Fabric(system.fabric);
	this.zoom        = 1; // @@
	var vv = this.vv = {};

	for (var k in twig.copse) {
		vv[k] = this.createVItem(twig.copse[k], k);
	}

	this._floatMenuLabels = {c: 'new', n: 'Note', ne: 'Label'};
};


/**
| MeshMashine reports changes
*/
VSpace.prototype.report = function(type, tree, src, trg) {
	// updates twig pointers
	var twig = tree.root.copse[this.key];
	if (this.twig === twig) return;
	this.twig = twig;
	this.update(twig);
};

/**
| Updates v-vine to match a new twig.
*/
VSpace.prototype.update = function(twig) {
	this.twig = twig;

	var vv = {};
	var vo = this.vv;
	var copse = twig.copse;
	for(var k in copse) {
		var sub = twig.copse[k];
		var o = vo[k];
		if (is(o)) {
			if (o.twig !== sub) {
				o.update(sub);
			}
			vv[k] = o;
		} else {
			vv[k] = this.createVItem(sub, k);
		}
	}
	this.vv = vo;
};

/**
| Creates a new visual representation of an item.
*/
VSpace.prototype.createVItem = function(twig, k) {
	var ipath = new Path(this.path, '++', k);
	switch (twig.type) {
	case 'Note'     : return new VNote    (twig, ipath, this);
	case 'Label'    : return new VLabel   (twig, ipath, this);
	case 'Relation' : return new VRelation(twig, ipath, this);
	default : throw new Error('unknown type: '+twig.type);
	}
};

/**
| Redraws the complete space.
*/
VSpace.prototype.draw = function() {
	var twig  = this.twig;
	var alley = twig.alley;
	var vv    = this.vv;
	for(var r = twig.ranks() - 1; r >= 0; r--) {
		vv[alley[r]].draw(this.fabric);
	}

	if (this.focus) { this.focus.drawHandles(this.fabric); }

	var action = shell.action;
	switch (action && action.type) {
	case Action.FLOATMENU :
		action.floatmenu.draw();
		break;
	case Action.ITEMMENU :
		action.itemmenu.draw();
		break;
	case Action.RELBIND :
		var av  = action.vitem;
		var av2 = action.vitem2;
		var target = av2 ? av2.getZone() : action.move.sub(this.fabric.pan);
		var arrow = Line.connect(av.getZone(), 'normal', target, 'arrow');
		if (av2) av2.highlight(this.fabric);
		arrow.draw(this.fabric, settings.relation.style);
		break;
	}
};


/**
| Sets the focused item or blurs it if vitem is null
*/
VSpace.prototype.setFocus = function(vitem) {
	if (this.focus === vitem) return;
	this.focus = vitem;

	var caret = shell.caret;
	if (vitem) {
		var doc = vitem.vv.doc;
		caret = shell.setCaret({
			path: doc.vv[doc.twig.alley[0]].textpath(),
			at1: 0
		});
		caret.show();
	} else {
		caret.hide();
		caret.marker = null;
	}

	if (vitem === null) return;

	peer.moveToTop(this.space, vitem.item);
};

/**
| Mouse wheel
*/
VSpace.prototype.mousewheel = function(p, dir) {
	debug('TODO'); // TODO
	/*
	var pp = p.sub(this.fabric.pan);
	for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {

		var vitem = this.vv[this.space.z.get(zi)];
		if (vitem.mousewheel(pp, dir)) { return true; }
	}

	// @@ zooming.
	return true;
	*/
};

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
		// @@ move into items
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

	var alley = this.twig.alley;
	var vv    = this.vv;
	for(var a = 0, aZ = alley.length; a < aZ; a++) {
		var vitem = vv[alley[a]];
		if (vitem.mousehover(pp)) { return true; }
	}
	// no hits
	system.setCursor('crosshair');
	return true;
};

/**
| Starts an operation with the mouse button held down.
*/
VSpace.prototype.dragstart = function(p) {
	var pp = p.sub(this.fabric.pan);
	var focus = this.focus;

	// see if the itemmenu of the focus was targeted
	if (focus && focus.withinItemMenu(pp)) {
		shell.startAction(Action.RELBIND, focus, p);
		system.setCursor('default');
		shell.redraw = true;
		return true;
	}

	// see if one item was targeted
	var alley = this.twig.alley;
	var vv    = this.vv;
	for(var a = 0, aZ = alley.length; a < aZ; a++) {
		var vitem = vv[alley[a]];
		if (vitem.dragstart(pp)) return true;
	}

	// otherwise do panning
	shell.startAction(Action.PAN, null, pp);
	system.setCursor('crosshair');
	return true;
};

/**
| A mouse click.
*/
VSpace.prototype.click = function(p) {
	var pan = this.fabric.pan;
	var pp = p.sub(pan);
	var action;

	// clicked the tab of the focused item?
	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		action = shell.startAction(Action.ITEMMENU, null, pp);
		var labels = {n : 'Remove'};
		action.itemmenu = new Hexmenu(focus.getH6Slice().pm.add(pan), settings.itemmenu, labels);
		shell.redraw = true;
		return;
	}

	// clicked some item?
	var alley = this.twig.alley;
	var vv    = this.vv;
	for(var a = 0, aZ = alley.length; a < aZ; a++) {
		var vitem = vv[alley[a]];
		if (vitem.click(pp)) return true;
	}

	// otherwhise pop up the float menu
	action = shell.startAction(Action.FLOATMENU, null, p);
	action.floatmenu = new Hexmenu(p, settings.floatmenu, this._floatMenuLabels);
	system.setCursor('default');
	this.setFocus(null);
	shell.redraw = true;
	return true;
};

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
		break;
	case Action.RELBIND:
		var vv = this.vv;
		throw new Error('TODO'); // TODO
		/*
		for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
			var vit = vv[this.space.z.get(zi)];
			if (vit.dragstop(pp)) break;
		}
		break;
		*/
	}
	shell.stopAction();
	return true;
};

/**
| Moving during an operation with the mouse button held down.
*/
VSpace.prototype.dragmove = function(p) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;

	switch(action.type) {
	case Action.PAN :
		this.fabric.pan = p.sub(action.start);
		shell.redraw = true;
		return true;
	case Action.RELBIND :
		action.vitem2 = null;
		action.move = p;
		shell.redraw = true;
		throw new Error('TODO'); // TODO
		/*
		var vv = this.vv;
		for(var zi = 0, zlen = this.space.z.length; zi < zlen; zi++) {
			var vitem = vv[this.space.z.get(zi)];
			if (vitem.dragmove(pp)) return true;
		}
		return true;
		*/
	default :
		action.vitem.dragmove(pp);
		return true;
	}
};

/**
| Mouse button down event.
*/
VSpace.prototype.mousedown = function(p) {
	var pp = p.sub(this.fabric.pan);
	var action = shell.action;
	var pnw, md, key;

	switch (action && action.type) {
	case null :
		break;
	case Action.FLOATMENU :
		var fm = action.floatmenu;
		md = fm.getMousepos(p);
		shell.stopAction();

		if (!md) break;
		switch(md) {
		case 'n' : // note
			var nw = settings.note.newWidth;
			var nh = settings.note.newHeight;
			pnw = fm.p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
			key = peer.newNote(this.space, new Rect(pnw, pnw.add(nw, nh)));
			var vnote = this.vv[key];
			this.setFocus(vnote);
			break;
		case 'ne' : // label
			pnw = fm.p.sub(this.fabric.pan);
			pnw = pnw.sub(settings.label.createOffset);
			key = peer.newLabel(this.space, pnw, 'Label', 20);
			var vlabel = this.vv[key];
			this.setFocus(vlabel);
			break;
		}
		shell.redraw = true;
		return false;
	case Action.ITEMMENU :
		var im = action.itemmenu;
		md = im.getMousepos(p);
		shell.stopAction();

		if (!im) break;
		switch(md) {
		case 'n': // remove
			peer.removeItem(this.space, this.focus.item);
			this.setFocus(null);
			break;
		default :
			break;
		}
		shell.redraw = true;
		return false;
	}

	if (this.focus) {
		if (this.focus.withinItemMenu(p)) return 'atween';
		var com = this.focus.checkItemCompass(pp);
		if (com) {
			// resizing
			action = shell.startAction(Action.ITEMRESIZE, this.focus, pp);
			action.align = com;
			action.startZone = this.focus.getZone();
			system.setCursor(com+'-resize');

			return 'drag';
		}
	}

	return 'atween';
};

/**
| The meshmashine issued an event.
|
| TODO
*/
VSpace.prototype.ev$TODO = function(type, key, p1, p2, p3) {
	/*
	log('xxx', 'vitemcopse', type, key, p1, p2, p3);

	switch(type) {
	case 'set' :
		var item = this.copse.get(key);
		var vitem = this.vv[key];
		if (!item && vitem) {
			// an item has been removed
			vitem.item.removeListener(this);
			this.vv[key] = null;
			return;
		}
		if (item && !vitem) {
			// an item has been created
			var vspace = this.vspace;
			// TODO ipath
			switch (item.type) {
			case 'Note':     vitem = new VNote    (item, ipath, vspace); break;
			case 'Label':    vitem = new VLabel   (item, ipath, vspace); break;
			case 'Relation': vitem = new VRelation(item, ipath, vspace); break;
			default : throw new Error('unknown item created: '+item.type);
			}
			this.vv[key] = vitem;
			return;
		}
		log(true, 'strange event');
		break;
	}
	*/
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ VPara +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A visual paragraph representation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var VPara = function(twig, path, vdoc) {
	if (twig.type !== 'Para') throw new Error('type error');
	if (vdoc.constructor !== VDoc) throw new Error('type error');

	this.twig = twig;
	this.path = path;
	this.key  = path.get(-1);
	this.vdoc = vdoc;

	// fabric caching
	this._fabric$      = new Fabric(0 ,0);
	this._fabric$flag  = false; // fabric up-to-date flag
	this._fabric$width = 0;

	// flow caching
	this._flow$ = [];
};

/**
| Updates v-vine to match a new twig.
*/
VPara.prototype.update = function(twig) {
	this.twig = twig;
};

/**
| (re)flows the paragraph, positioning all chunks.
*/
VPara.prototype.getFlow = function() {
	var vdoc  = this.vdoc;
	var vitem = vdoc.vitem;
	var flowWidth = vitem.getFlowWidth();
	var fontsize = vdoc.getFontSize();
	var flow  = this._flow$;
	// @@ go into subnodes instead
	var text = this.twig.text;

	if (!noCache && flow &&
		flow.flowWidth === flowWidth &&
		flow.fontsize  === fontsize &&
		flow.text      === text
	) return flow;

	if (shell.caret.path && shell.caret.path.equals(this.path)) {
		// remove caret cache if its within this flow.
		// TODO change
		shell.caret.cp$line  = null;
		shell.caret.cp$token = null;
	}

	// builds position informations.
	flow  = this._flow$ = [];
	var spread = 0;  // width really used.

	// current x positon, and current x including last tokens width
	var x = 0, xw = 0;

	var y = fontsize;
	Measure.font = vdoc.getFont();
	var space = Measure.width(' ');
	var line = 0;
	flow[line] = { a: [], y: y, o: 0 };

	//var reg = !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g); @@
	var reg = (/(\s*\S+|\s+$)\s?(\s*)/g);

	for(var ca = reg.exec(text); ca !== null; ca = reg.exec(text)) {
		// a token is a word plus following hard spaces
		var token = ca[1] + ca[2];
		var w = Measure.width(token);
		xw = x + w + space;

		if (flowWidth > 0 && xw > flowWidth) {
			if (x > 0) {
				// soft break
				if (spread < xw) spread = xw;
				x = 0;
				xw = x + w + space;
				//y += R(vdoc.fontsize * (pre ? 1 : 1 + settings.bottombox)); @@
				y += R(vdoc.getFontSize() * (1 + settings.bottombox));
				line++;
				flow[line] = {a: [], y: y, o: ca.index};
			} else {
				// horizontal overflow
//				console.log('HORIZONTAL OVERFLOW'); // @@
			}
		}
		flow[line].a.push({
			x: x,
			w: w,
			o: ca.index,
			t: token
		});

		x = xw;
	}
	if (spread < xw) spread = xw;

	flow.height = y;
	flow.flowWidth = flowWidth;
	flow.spread = spread;
	flow.fontsize = fontsize;
	return flow;
};

/**
| Returns the offset closest to a point.
|
| point: the point to look for
*/
VPara.prototype.getPointOffset = function(point) {
	var flow = this.getFlow();
	var para = this.para;
	Measure.font = this.vdoc.getFont(); // TODO no vdoc

	var line;
	for (line = 0; line < flow.length; line++) {
		if (point.y <= flow[line].y) {
			break;
		}
	}
	if (line >= flow.length) line--;

	return this.getLineXOffset(line, point.x);
};

/**
| Returns the offset in flowed line number and x coordinate.
*/
VPara.prototype.getLineXOffset = function(line, x) {
	var flow = this.getFlow();
	var fline = flow[line];
	var ftoken = null;
	for (var token = 0; token < fline.a.length; token++) {
		ftoken = fline.a[token];
		if (x <= ftoken.x + ftoken.w) { break; }
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
};

/**
| Text has been inputted.
*/
VPara.prototype.input = function(text) {
	var caret = shell.caret;
    var reg = /([^\n]+)(\n?)/g;
    for(var rx = reg.exec(text); rx !== null; rx = reg.exec(text)) {
		var line = rx[1];
		peer.insertText(this.textpath(), caret.mark.at1, line);
		if (rx[2]) throw new Error('TODO');
//        if (rx[2]) peer.split(para, caret.mark.at1);
//		para = para.parent.get(para.key + 1);
    }
};

/**
| Handles a special key
*/
VPara.prototype.specialKey = function(keycode) {
	var caret  = shell.caret;
	// TODO split into smaller functions
	var para = this.para;
	var select = shell.selection;

	var vdoc = this.vdoc;
	var ve, at1, flow;
	var r, x;

/*  TODO
	if (shell.ctrl) {
		switch(keycode) {
		case 65 : // ctrl+a
			var vparas = vdoc.vparas;
			var v0 = vparas[0];
			var vZ = vparas[vparas.length - 1];
			var vZL = vZ.twig.text.length;
			select.mark1.set(v0, 0);
			select.mark2.set(vZ, vZL);
			select.active = true;
			caret.set(vZ, vZL);
			system.setInput(select.innerText());
			caret.show();
			vdoc.vitem.poke();
			shell.redraw = true;
			return true;
		}
	}
*/

/*
	if (!shell.shift && select.active) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			select.deselect();
			shell.redraw = true;
			break;
		case  8 : // backspace
		case 46 : // del
			select.remove();
			shell.redraw = true;
			keycode = 0;
			break;
		case 13 : // return
			select.remove();
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
			debug('TODO');
			//select.mark1.set(caret.vnode, caret.mark.at1);
			//vdoc.vitem.poke();
		}
	}
	*/

	switch(keycode) {
	case  8 : // backspace
		if (caret.mark.at1 > 0) {
			peer.removeText(this.textpath(), caret.mark.at1 - 1, 1);
		} else {
			r = vdoc.twig.rank(this.key);
			if (r > 0) {
				ve = vdoc.vv[vdoc.twig.alley[r - 1]];
				peer.join(ve.textpath(), ve.twig.text.length);
			}
		}
		break;
	case 13 : // return
		peer.split(this.textpath(), caret.mark.at1);
		break;
	case 35 : // end
		caret = shell.setCaret({ path: this.textpath(), at1:  this.twig.text.length });
		break;
	case 36 : // pos1
		caret = shell.setCaret({ path: this.textpath(), at1: 0 });
		break;
	case 37 : // left
		if (caret.mark.at1 > 0) {
			caret = shell.setCaret({ path: this.textpath(), at1: caret.mark.at1 - 1 });
		} else {
			r = vdoc.twig.rank(this.key);
			if (r > 0) {
				ve = vdoc.vv[vdoc.twig.alley[r - 1]];
				caret = shell.setCaret({ path: ve.textpath(), at1: ve.twig.text.length });
			}
		}
		break;
	case 38 : // up
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.pos$.x;

		if (caret.flow$line > 0) {
			// stay within this para
			at1 = this.getLineXOffset(caret.flow$line - 1, x);
			shell.setCaret({ path: this.textpath(), at1: at1 }, x);
		} else {
			// goto prev para
			r = vdoc.twig.rank(this.key);
			if (r > 0) {
				ve = vdoc.vv[vdoc.twig.alley[r - 1]];
				at1 = ve.getLineXOffset(ve.getFlow().length - 1, x);
				caret = shell.setCaret({ path: ve.textpath(), at1: at1 }, x);
			}
		}
		break;
	case 39 : // right
		if (caret.mark.at1 < this.twig.text.length) {
			caret = shell.setCaret({ path: this.textpath(), at1: caret.mark.at1 + 1 });
		} else {
			r = vdoc.twig.rank(this.key);
			if (r < vdoc.twig.ranks() - 1) {
				ve = vdoc.vv[vdoc.twig.alley[r + 1]];
				caret = shell.setCaret({ path: ve.textpath(), at1: 0 });
			}
		}
		break;
	case 40 : // down
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.pos$.x;

		if (caret.flow$line < flow.length - 1) {
			// stay within this para
			at1 = this.getLineXOffset(caret.flow$line + 1, x);
			caret = shell.setCaret({ path: this.textpath(), at1: at1 }, x);
		} else {
			// goto next para
			r = vdoc.twig.rank(this.key);
			if (r < vdoc.twig.ranks() - 1) {
				ve = vdoc.vv[vdoc.twig.alley[r + 1]];
				at1 = ve.getLineXOffset(0, x);
				caret = shell.setCaret({ path: ve.textpath(), at1: at1 }, x);
			}
		}
		break;
	case 46 : // del
		if (caret.mark.at1 < this.twig.text.length) {
			peer.removeText(this.textpath(), caret.mark.at1, 1);
		} else {
			r = vdoc.twig.rang(this.key);
			if (r < vdoc.twig.ranks() - 1) {
				peer.join(para);
			}
		}
		break;
	}


	if (shell.shift) {
		switch(keycode) {
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			debug('TODO'); // TODO
			/*
			select.active = true;
			select.mark2.set(caret.vnode, caret.mark.at1);
			system.setInput(select.innerText());
			vdoc.vitem.poke();
			shell.redraw = true;*/
		}
	}

	caret.show();
	shell.redraw = true; // @@ might be optimized
};

/**
| Return the path to the .text attribute if this para.
| @@ use lazyFixate.
*/
VPara.prototype.textpath = function() {
	if (this._textpath) return this._textpath;
	return (this._textpath = new Path(this.path, '++', 'text'));
};

/**
| Returns the height of the para
*/
VPara.prototype.getHeight = function() {
	var flow = this.getFlow();
	return flow.height + R(this.vdoc.getFontSize() * settings.bottombox);
};

/**
| Draws the paragraph in its cache and returns it.
*/
VPara.prototype.getFabric = function() {
	var flow   = this.getFlow();
	var width  = flow.spread;
	var vdoc   = this.vdoc;
	var height = this.getHeight();

	// cache hit?
	if (!noCache && this._fabric$flag &&
		this._fabric$width === width && this._fabric$height === height
	) {
		return this._fabric$;
	}

	var fabric = this._fabric$;

	// @@: work out exact height for text below baseline
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
};

/**
| Drops the cache (cause something has changed)
*/
VPara.prototype.event = function(event, p1, p2, p3) {
	this.vdoc.vitem.poke();

	this._flow$ = null;
	this._fabric$flag = false;
};

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| flowPos$: if set, writes flow$line and flow$token to
|           the flow position used.
|
| TODO change to multireturn.
| TODO rename
*/
VPara.prototype.getOffsetPoint = function(offset, flowPos$) {
	// @@ cache position
	var twig = this.twig;
	var vdoc  = shell.vget(this.path, -1);
	Measure.font = vdoc.getFont();
	var text = twig.text;
	var flow = this.getFlow();
	var a;

	// TODO improve loops
	var al = flow.length - 1;
	for (a = 1; a < flow.length; a++) {
		if (flow[a].o > offset) {
			al = a - 1;
			break;
		}
	}
	var line = flow[al];

	var at = line.a.length - 1;
	for (a = 1; a < line.a.length; a++) {
		if (line.a[a].o > offset) {
			at = a - 1;
			break;
		}
	}
	var token = line.a[at];
	if (!token) { token = { x: 0, o : 0 }; }

	if (flowPos$) {
		flowPos$.flow$line  = al;
		flowPos$.flow$token = at;
	}

	// @@ use token. text instead.
	return new Point(
		R(token.x + Measure.width(text.substring(token.o, offset))),
		line.y);
};


/**
| Draws the caret if its in this paragraph.
*/
VPara.prototype.drawCaret = function() {
	var caret = shell.caret;
	var vdoc  = this.vdoc;
	var vitem = vdoc.vitem;
	var zone  = vitem.getZone();
	var pan   = shell.vspace.fabric.pan;
	var fs    = vdoc.getFontSize();
	var descend = R(fs * settings.bottombox);
	var th    = R(vdoc.getFontSize()) + descend;

	caret.pos$ = this.getOffsetPoint(shell.caret.mark.at1, shell.caret);

	var sbary   = vitem.scrollbarY;
	var scrolly = sbary ? sbary.getPos() : 0;

	var pnw = vdoc.getPNW(this.key);
	var cys = R(caret.pos$.y + pnw.y + descend - scrolly);
	var cyn = cys - th;
	var cx  = caret.pos$.x + pnw.x - 1;

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
};

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
var Scrollbar = function(item) {
	this.parent   = item;  // TODO rename "parent"
	this.max      = null;
	this.visible  = false;
	this._pos     = 0;
	this.aperture = null; // the size of the bar
	this.zone     = null;
};

/**
| Makes the path for fabric.edge/fill/paint.
| @@ change descr on all path()s
*/
Scrollbar.prototype.path = function(fabric, border, twist) {
	if (border !== 0)  throw new Error('Scrollbar.path does not support borders');
	if (!this.visible) throw new Error('Pathing an invisible scrollbar');

	var z      = this.zone;
	var w      = z.width;
	var co30w2 = cos30 * w / 2;
	var w025   = R(w * 0.25);
	var w075   = R(w * 0.75);
	var size   = R(this.aperture * z.height / this.max);
	var msize  = max(size, settings.scrollbar.minSize);
	var sy     = z.pnw.y + R(this._pos * ((z.height - msize + size) / this.max));

	fabric.beginPath(twist);
	fabric.moveTo(z.pnw.x,        R(sy + co30w2));
	fabric.lineTo(z.pnw.x + w025, sy);
	fabric.lineTo(z.pnw.x + w075, sy);
	fabric.lineTo(z.pse.x,        R(sy + co30w2));

	fabric.lineTo(z.pse.x,        R(sy + msize - co30w2));
	fabric.lineTo(z.pnw.x + w075, sy + msize);
	fabric.lineTo(z.pnw.x + w025, sy + msize);
	fabric.lineTo(z.pnw.x,        R(sy + msize - co30w2));
	fabric.closePath();
};

/**
| Draws the scrollbar.
*/
Scrollbar.prototype.draw = function(fabric) {
	fabric.paint(settings.scrollbar.style, this, 'path');
};

/**
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function() {
	if (!this.visible) return 0;
	return this._pos;
};

/**
| Sets the scrollbars position.
*/
Scrollbar.prototype.setPos = function(pos) {
	if (pos < 0) throw new Error('Scrollbar.setPos < 0');
	return this._pos = pos;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .-,--.
 `|  /   ' |   \ ,-. ,-.
  | /    , |   / | | |
  `'     `-^--'  `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An array of paragraph visuals.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var VDoc = function(twig, path, vitem) {
	this.twig  = twig;
	this.path  = path;
	this.key   = path.get(-1);
	this.vitem = vitem;

	this.pnws  = null;
	var vv = this.vv = [];

	var alley = twig.alley;
	var copse = twig.copse;
	for (var r = 0, rZ = twig.ranks(); r < rZ; r++) {
		var k = alley[r];
		vv[k] = new VPara(copse[k], new Path(path, '++', k), this);
	}
};

/**
| Updates v-vine to match a new twig.
*/
VDoc.prototype.update = function(twig) {
	this.twig = twig;
	var vo = this.vv;
	var vv = this.vv = {};
	var copse = twig.copse;
	for(var k in copse) {
		var sub = twig.copse[k];
		var o = vo[k];
		if (is(o)) {
			if (o.twig !== sub) {
				o.update(sub);
			}
			vv[k] = o;
		} else {
			o = new VPara(sub, new Path(this.path, '++', k), this);
			o.update(sub);
			vv[k] = o;
		}
	}
};

/**
| The meshmashine issued an event.
*/
/* TODO
VDoc.prototype.ev-XXX = function(type, key, p1, p2, p3) {
	log('xxx', 'vdoc', type, key, p1, p2, p3);

	switch(type) {
	case 'join' :
		this.valley.splice(key + 1, 1);
		break;
	case 'split' :
		var nvp = new VPara(this.doc.get(key + 1), this);
		this.valley.splice(key + 1, 0, nvp);
		break;
	}
};
*/

/**
| Draws the document on a fabric.
|
| fabric:  to draw upon.
| width:   the width to draw the document with.
| imargin: distance of text to edge
| scrollp: scroll position
*/
VDoc.prototype.draw = function(fabric, width, imargin, scrollp) {
	// @@ <pre>
	var fontsize = this.getFontSize();
	var paraSep = this.vitem.getParaSep(fontsize);
	var select = shell.selection;

	// draws the selection
	/* TODO
	if (select.active && select.mark1.entity.vdoc === this) {
		fabric.paint(settings.selection.style, this, 'pathSelection', width, imargin, scrollp);
	}*/

	var y = imargin.n;
	var pnws = {};   // north-west points of paras

	// draws the paragraphs
	var twig = this.twig;
	for (var r = 0, rZ = twig.ranks(); r < rZ; r++) {
		var vpara = this.vv[twig.alley[r]];
		var flow = vpara.getFlow();

		pnws[twig.alley[r]] = new Point(imargin.w, R(y));
		fabric.drawImage(vpara.getFabric(), imargin.w, R(y - scrollp.y));
		y += flow.height + paraSep;
	}
	this.pnws = pnws;   // north-west points of paras
};

VDoc.prototype.getPNW = function(key) {
	return this.pnws[key];
};

/**
| Returns the height of the document.
| @@ caching
*/
VDoc.prototype.getHeight = function() {
	var fontsize = this.getFontSize();
	var paraSep  = this.vitem.getParaSep(fontsize);
	var twig     = this.twig;
	var vv       = this.vv;
	var height   = 0;
	for (var r = 0, rZ = twig.ranks(); r < rZ; r++) {
		var vpara = vv[twig.alley[r]];

		var flow = vpara.getFlow();
		if (r > 0) { height += paraSep; }
		height += flow.height;
	}
	height += R(fontsize * settings.bottombox);
	return height;
};

/**
| Returns the width actually used of the document.
*/
VDoc.prototype.getSpread = function() {
	var vparas = this.vparas;
	var spread = 0;
	for (var a = 0, aZ = vparas.length; a < aZ; a++) {
		spread = max(spread, vparas[a].getFlow().spread);
	}
	return spread;
};

VDoc.prototype.getFontSize = function() {
	var vitem = this.vitem;
	var fontsize = vitem.twig.fontsize;
	return !vitem.fontSizeChange ? fontsize : vitem.fontSizeChange(fontsize);
};

/**
| Returns the default font for the document.
*/
VDoc.prototype.getFont = function() {
	return this.getFontSize() + 'px ' + settings.defaultFont;
};

/**
| Returns the paragraph at point
*/
VDoc.prototype.getVParaAtPoint = function(p) {
	var twig   = this.twig;
	var vv     = this.vv;

	for(var r = 0, rZ = twig.ranks(); r < rZ; r++) {
		var k = twig.alley[r];
		var vpara = vv[k];
		var flow = vpara.getFlow();
		var pnw = this.pnws[k];
		if (p.y < pnw.y + flow.height) return vpara;
	}
	return null;
};

/**
| Paths a selection
*/
VDoc.prototype.pathSelection = function(fabric, border, twist, width, imargin, scrollp) {
	// @@ make part of selection to use shortcut with XYi
	throw new Error('TODO');

	/*
	var select = shell.selection;
	var sp = scrollp;
	var m1 = select.mark1;
	var m2 = select.mark2;
	var pnw1 = this.getPNW(m1.vnode.key);
	var pnw2 = this.getPNW(m2.vnode.key);
	var p1 = m1.vnode.getOffsetPoint(m1.at1);
	var p2 = m2.vnode.getOffsetPoint(m2.at1);
	p1 = p1.add(R(pnw1.x - sp.x), R(pnw1.y - sp.y));
	p2 = p2.add(R(pnw2.x - sp.x), R(pnw2.y - sp.y));

	if (p2.y < p1.y || (p2.y === p1.y && p2.x < p1.x)) {
		m1 = select.mark2;
		m2 = select.mark1;
		var p_ = p1; p1 = p2; p2 = p_;
	}

	var fontsize = this.getFontSize();
	fabric.beginPath(twist);
	var descend = R(fontsize * settings.bottombox);
	var rx = width - imargin.e;
	var lx = imargin.w;
	if ((abs(p2.y - p1.y) < 2)) {
		// ***
		fabric.moveTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y - fontsize);
		fabric.lineTo(p2.x, p2.y - fontsize);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(p1.x, p1.y + descend);
	} else if (abs(p1.y + fontsize + descend - p2.y) < 2 && (p2.x <= p1.x))  {
		//      ***
		// ***
		fabric.moveTo(rx,   p1.y - fontsize);
		fabric.lineTo(p1.x, p1.y - fontsize);
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(rx,   p1.y + descend);

		fabric.moveTo(lx,   p2.y - fontsize);
		fabric.lineTo(p2.x, p2.y - fontsize);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);
	} else {
		//    *****
		// *****
		fabric.moveTo(rx,   p2.y - fontsize);
		fabric.lineTo(p2.x, p2.y - fontsize);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);

		if (twist)
			fabric.moveTo(lx, p1.y + descend);
		else
			fabric.lineTo(lx, p1.y + descend);
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y - fontsize);
		fabric.lineTo(rx,   p1.y - fontsize);
		if (!twist) fabric.lineTo(rx, p2.y - fontsize);
	}
	*/
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-_/ .
 `|  /   '  | |- ,-. ,-,-.
  | /    .^ | |  |-' | | |
  `'     `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of VNote, VLabel, VRelation.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor
*/
var VItem = function(twig, path, vspace) {
	this._h6slice$ = null;
	this.twig      = twig;
	this.path      = path;
	this.key       = path.get(-1);
	this.vspace    = vspace;
	this.vv        = immute({
		doc : new VDoc(twig.doc, new Path(path, '++', 'doc'), this)
	});

	this._fabric      = new Fabric();
	this._fabric$flag = false; // up-to-date-flag
};

/**
| Updates v-vine to match a new twig.
*/
VItem.prototype.update = function(twig) {
	this.twig = twig;

	var vdoc = this.vv.doc;
	if (vdoc.twig !== twig.doc) {
		vdoc.update(twig.doc);
	}
};

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
};

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| @@ rename
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
};

/**
| Paths the resize handles.
*/
VItem.prototype.pathResizeHandles = function(fabric, border, twist) {
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

	fabric.beginPath(twist);
	if (ha.n ) {
		fabric.moveTo(xm - hs2, y1);
		fabric.lineTo(xm + hs2, y1);
	}
	if (ha.ne) {
		fabric.moveTo(x2 - hs,  y1);
		fabric.lineTo(x2, y1);
		fabric.lineTo(x2, y1 + hs);
	}
	if (ha.e ) {
		fabric.moveTo(x2, ym - hs2);
		fabric.lineTo(x2, ym + hs2);
	}
	if (ha.se) {
		fabric.moveTo(x2, y2 - hs);
		fabric.lineTo(x2, y2);
		fabric.lineTo(x2 - hs, y2);
	}
	if (ha.s ) {
		fabric.moveTo(xm - hs2, y2);
		fabric.lineTo(xm + hs2, y2);
	}
	if (ha.sw) {
		fabric.moveTo(x1 + hs, y2);
		fabric.lineTo(x1, y2);
		fabric.lineTo(x1, y2 - hs);
	}
	if (ha.w ) {
		fabric.moveTo(x1, ym - hs2);
		fabric.lineTo(x1, ym + hs2);
	}
	if (ha.nw) {
		fabric.moveTo(x1, y1 + hs);
		fabric.lineTo(x1, y1);
		fabric.lineTo(x1 + hs, y1);
	}
};

/**
| Draws the handles of an item (resize, itemmenu)
*/
VItem.prototype.drawHandles = function(fabric) {
	// draws the resize handles
	fabric.edge(settings.handle.style.edge, this, 'pathResizeHandles');

	// draws item menu handler
	fabric.paint(settings.itemmenu.slice.style, this.getH6Slice(), 'path');
};

/**
| Returns the para at point. @@, honor scroll here.
*/
VItem.prototype.getVParaAtPoint = function(p, action) {
	// @@ rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.vv.doc.getVParaAtPoint(p, action);
};

/**
| Dragstart.
| Checks if a dragstart targets this item.
*/
VItem.prototype.dragstart = function(p) {
	if (!this.getZone().within(p)) return false;

	shell.redraw = true;

	if (shell.ctrl) {
		// relation binding
		shell.startAction(Action.RELBIND, this, p);
		system.setCursor('default');
		return true;
	}

	// scrolling or dragging
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
};

/**
| dragmove?
*/
VItem.prototype.dragmove = function(p) {
	// no general zone test, since while dragmoving the item might be fixed by the action.
	var action = shell.action;

	switch (action.type) {
	case Action.RELBIND    :
		if (!this.getZone().within(p)) return false;
		action.move = p;
		action.vitem2 = this;
		shell.redraw = true;
		return true;
	case Action.ITEMRESIZE :
	case Action.ITEMDRAG   :
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
	default :
		throw new Error('invalid dragmove');
	}
	return true;
};

/**
| Sets the items position and size after an action.
*/
VItem.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.RELBIND :
		if (!this.getZone().within(p)) return false;
		VRelation.create(this.vspace, action.vitem, this);
		system.setCursor('default');
		shell.redraw = true;
		return true;
	default :
		return false;
	}
};


/**
| Mouse is hovering around.
| Checks if this item reacts on this.
*/
VItem.prototype.mousehover = function(p) {
	if (!this.getZone().within(p)) return false;

	system.setCursor('default');
	return true;
};

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
		var ppnw   = this.vv.doc.getPNW(vpara.key);
		var at1    = vpara.getPointOffset(pi.sub(ppnw));
		var caret  = shell.caret;
		caret = shell.setCaret({ path: vpara.textpath(), at1: at1 });
		caret.show();
		shell.selection.deselect();
	}
	return true;
};

/**
| Highlights the item.
*/
VItem.prototype.highlight = function(fabric) {
	var silhoutte = this.getSilhoutte(this.getZone(), false);
	fabric.edge(settings.note.style.highlight, silhoutte, 'path');
};



/**
| Called by subvisuals when they got changed.
*/
VItem.prototype.poke = function() {
	this._fabric$flag = false;
	shell.redraw = true;
};

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
var VNote = function(twig, path, vspace) {
	VItem.call(this, twig, path, vspace);
	this.scrollbarY = new Scrollbar(this, null);
};
subclass(VNote, VItem);

/**
| Default margin for all notes.
*/
VNote.prototype.imargin = new Margin(settings.note.imargin);

/**
| Resize handles to show on notes.
*/
VNote.prototype.handles = {
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true
};

/**
| Minimum sizes
*/
VNote.prototype.minWidth  = settings.note.minWidth;
VNote.prototype.minHeight = settings.note.minHeight;

/**
| Returns the notes silhoutte.
|
| zone$:  the cache for the items zone
| zAnchor: if true anchor the silhoute at zero.
*/
VNote.prototype.getSilhoutte = function(zone$, zAnchor) {
	var z$ = zone$;
	var s$;

	var cr = settings.note.cornerRadius;
	if (zAnchor) {
		s$ = this._silhoutte$0;
		if (s$ && s$.width === z$.width && s$.height === z$.height) return s$;
		return this._silhoutte$0 = new RoundRect(Point.zero, new Point(z$.width, z$.height), cr);
	} else {
		s$ = this._silhoutte$1;
		if (s$ && s$.eq(z$)) return s$;
		return this._silhoutte$1 = new RoundRect(z$.pnw, z$.pse, cr);
	}
};

/**
| Actualizes the scrollbar.
*/
VNote.prototype.setScrollbar = function(pos) {
	var sbary = this.scrollbarY;
	if (!sbary.visible) return;

	// @@ double call to getHeight, also in VDoc.draw()
	sbary.max = this.vv.doc.getHeight();

	var zone = this.getZone();
	// @@ make a Rect.renew
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
	sbary.setPos(limit(0, pos, smaxy));
};

/**
| Sets the items position and size after an action.
*/
VNote.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		var zone = this.getZone();

		if (zone.width < this.minWidth || zone.height < this.minHeight) {
			throw new Error('Note under minimum size!');
		}

		if (this.twig.zone.eq(zone)) return;
		peer.setZone(this.path, zone);
		// TODO this should happen by setting in peer...
		this._fabric$flag = false;
		// adapts scrollbar position
		this.setScrollbar();

		system.setCursor('default');
		shell.redraw = true;
		return true;
	default :
		return VItem.prototype.dragstop.call(this, p);
	}
};

/**
| Draws the note.
|
| fabric: to draw upon.
*/
VNote.prototype.draw = function(fabric) {
	var f    = this._fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (noCache || !this._fabric$flag || !this._fabric$size ||
		zone.width  !== this._fabric$size.width ||
		zone.height !== this._fabric$size.height)
	{
		var vdoc = this.vv.doc;
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
		var silhoutte = this.getSilhoutte(zone, true);
		f.fill(settings.note.style.fill, silhoutte, 'path');

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		vdoc.draw(f, zone.width, imargin, sbary.point);

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
};

/**
| Mouse wheel turned.
*/
VNote.prototype.mousewheel = function(p, dir) {
	if (!this.getZone().within(p)) return false;
	this.setScrollbar(this.scrollbarY.getPos() - dir * settings.scrollbar.textWheelSpeed);
	this._fabric$flag = false;
	shell.redraw = true;
	return true;
};

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
};

/**
| Returns the para seperation height.
*/
VNote.prototype.getParaSep = function(fontsize) {
	return half(fontsize);
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VNote.prototype.getZone = function() {
	var twig   = this.twig;
	var action = shell.action;

	if (!action || action.vitem !== this) return twig.zone;
	// @@ cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		return twig.zone.add(action.move.x - action.start.x, action.move.y - action.start.y);

	case Action.ITEMRESIZE:
		var szone = action.startZone;
		if (!szone) return twig.zone;
		var spnw = szone.pnw;
		var spse = szone.pse;
		var dx = action.move.x - action.start.x;
		var dy = action.move.y - action.start.y;
		var minw = this.minWidth;
		var minh = this.minHeight;
		var pnw, pse;

		switch (action.align) {
		case 'n'  :
			pnw = Point.renew(spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = spse;
			break;
		case 'ne' :
			pnw = Point.renew(
				spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = Point.renew(
				max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
			break;
		case 'e'  :
			pnw = spnw;
			pse = Point.renew(max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
			break;
		case 'se' :
			pnw = spnw;
			pse = Point.renew(
				max(spse.x + dx, spnw.x + minw),
				max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 's' :
			pnw = spnw;
			pse = Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 'sw'  :
			pnw = Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
			pse = Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 'w'   :
			pnw = Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
			pse = spse;
			break;
		case 'nw' :
			pnw = Point.renew(
				min(spnw.x + dx, spse.x - minw),
				min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = spse;
			break;
		//case 'c' :
		default  :
			throw new Error('unknown align');
		}
		return new Rect(pnw, pse);
	default :
		return twig.zone;
	}
};

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
var VLabel = function(twig, path, vspace) {
	VItem.call(this, twig, path, vspace);
};
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
	nw : true
});

/**
| Minimum sizes
*/
VLabel.prototype.minWidth  = false;
VLabel.prototype.minHeight = settings.label.minHeight;

/**
| Returns the notes silhoutte.
*/
VLabel.prototype.getSilhoutte = function(zone$, zAnchor) {
	var s$ = zAnchor ? this._silhoutte$0 : this._silhoutte$1;
	var z$ = zone$;

	if (s$ && s$.width === z$.width && s$.height === z$.height) return s$;

	if (zAnchor) {
		return this._silhoutte$0 = new Rect(Point.zero, new Point(z$.width - 1, z$.height - 1));
	} else {
		return this._silhoutte$1 = new Rect(z$.pnw, z$.pse.sub(1, 1));
	}
};


/**
| Draws the label.
|
| fabric: to draw upon. // @@ remove this parameter.
*/
VLabel.prototype.draw = function(fabric) {
	var f    = this._fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (noCache || !this._fabric$flag || !this._fabric$size ||
		zone.width  !== this._fabric$size.width ||
		zone.height !== this._fabric$size.height)
	{
		var vdoc = this.vdoc;
		var imargin = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);

		// draws selection and text
		vdoc.draw(f, zone.width, imargin, Point.zero);

		// draws the border
		f.edge(settings.label.style.edge, silhoutte, 'path');

		this._fabric$flag = true;
		this._fabric$size = zone;
	}

	fabric.drawImage(f, zone.pnw);
};

/**
| Returns the width for the contents flow.
*/
VLabel.prototype.getFlowWidth = function() {
	return 0;
};

/**
| Calculates the change of fontsize due to resizing.
*/
VLabel.prototype.fontSizeChange = function(fontsize) {
	var action = shell.action;
	if (!action || action.vitem !== this) return fontsize;
	switch (action.type) {
	case Action.ITEMRESIZE:
		if (!action.startZone) return fontsize;
		var vdoc = this.vdoc;
		var height = action.startZone.height;
		var dy;
		switch (action.align) {
		case 'ne': case 'nw' : dy = action.start.y - action.move.y;  break;
		case 'se': case 'sw' : dy = action.move.y  - action.start.y; break;
		default  : throw new Error('unknown align: '+action.align);
		}
		return max(fontsize * (height + dy) / height, 8);
	default:
		return fontsize;
	}
	return max(fontsize, 4);
};

/**
| Returns the para seperation height.
*/
VLabel.prototype.getParaSep = function(fontsize) {
	return 0;
};

/**
| Mouse wheel turned.
*/
VLabel.prototype.mousewheel = function(p, dir) {
	if (!this.getZone().within(p)) { return false; }
	return true;
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VLabel.prototype.getZone = function() {
	var item   = this.item;
	var action = shell.action;
	var pnw = item.pnw;

	// TODO Caching!
	var vdoc = this.vdoc;
	var fs = vdoc.getFontSize();
	var width  = max(Math.ceil(vdoc.getSpread()), R(fs * 0.3));
	var height = max(Math.ceil(vdoc.getHeight()), R(fs));

	if (!action || action.vitem !== this) return new Rect(pnw, pnw.add(width, height));
	// @@ cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		var mx = action.move.x - action.start.x;
		var my = action.move.y - action.start.y;
		return new Rect(pnw.add(mx, my), pnw.add(mx + width, my + height));

	case Action.ITEMRESIZE:
		// resizing is done by fontSizeChange()
		var szone = action.startZone;
		if (!szone) return new Rect(pnw, pnw.add(width, height));

		switch (action.align) {
		case 'ne' : pnw = pnw.add(0, szone.height - height); break;
		case 'se' : break;
		case 'sw' : pnw = pnw.add(szone.width - width, 0); break;
		case 'nw' : pnw = pnw.add(szone.width - width, szone.height - height); break;
		default   : throw new Error('unknown align');
		}
		return new Rect(pnw, pnw.add(width, height));

	default :
		return new Rect(pnw, pnw.add(width, height));
	}
};


/**
| Sets the items position and size aften an action.
*/
VLabel.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		var zone = this.getZone();
		var fontsize = this.vdoc.getFontSize();

		if (!this.item.pnw.eq(zone.pnw)) {
			peer.setPNW(this.item, zone.pnw);
			this._fabric$flag = false; // TODO this should happen by setting in peer
		}
		if (fontsize !== this.item.get('fontsize')) {
			peer.setFontSize(this.item, fontsize);
			this._fabric$flag = false; // TODO same
		}

		system.setCursor('default');
		shell.redraw = true;
		break;
	default :
		return VItem.prototype.dragstop.call(this, p);
	}
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .-,--.     .      .
 `|  /    `|__/ ,-. |  ,-. |- . ,-. ,-.
  | /     )| \  |-' |  ,-| |  | | | | |
  `'      `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (including other relations)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
var VRelation = function(twig, path, vspace) {
	VLabel.call(this, twig, path, vspace);
};
subclass(VRelation, VLabel);

/**
| Default margin for all relations.
*/
VRelation.imargin = new Margin(settings.relation.imargin);

/**
| Creates a new Relation by specifing its relates.
*/
VRelation.create = function(vspace, vitem1, vitem2) {
	var cline = Line.connect(vitem1.getZone(), null, vitem2.getZone(), null);
	var pnw = cline.pc.sub(settings.relation.createOffset);
	var rel = peer.newRelation(vspace.space, pnw, 'relates to', 20, vitem1.item, vitem2.item);
	// event listener has created the vrel
	var vrel = vspace.vv[rel.key];
	vspace.setFocus(vrel);
};

VRelation.prototype.draw = function(fabric) {
	throw new Error('TODO');
	/*
	var vitem1 = this.vspace.vv[this.item.get('item1key')];
	var vitem2 = this.vspace.vv[this.item.get('item2key')];
	var zone = this.getZone();

	if (vitem1) {
		var l1 = Line.connect(vitem1.getZone(), 'normal', zone, 'normal');
		fabric.paint(settings.relation.style, l1, 'path');
	}

	if (vitem2) {
		var l2 = Line.connect(zone,  'normal', vitem2.getZone(), 'arrow');
		fabric.paint(settings.relation.style, l2, 'path');
	}

	VLabel.prototype.draw.call(this, fabric);
	*/
};


})();
