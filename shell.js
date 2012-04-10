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
var Cockpit;
var Fabric;
var Jools;
var MeshMashine;
var Path;
var Tree;

var settings;
var system;
var theme;

/**
| Exports
*/
var shell = null;
var Shell;

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
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var isPath        = Path.isPath;

var cos30         = Fabric.cos30;
var half          = Fabric.half;
var tan30         = Fabric.tan30;
var OvalFlower    = Fabric.OvalFlower;
var OvalSlice     = Fabric.OvalSlice;
var Line          = Fabric.Line;
var Margin        = Fabric.Margin;
var Measure       = Fabric.Measure;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;
var opposite      = Fabric.opposite;

var Signature     = MeshMashine.Signature;
var tfxSign       = MeshMashine.tfxSign;

// configures tree.
Tree.cogging = true;

/**
| Debugging mode, don't cache anything.
|
| In case of doubt, if caching is faulty, just set this true and see if the error
| vanishes.
*/
var noCache = false;

/**
| The server peer
*/
var peer;

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
	this.sign = null;

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
	if (this.shown && !this.blinked && this.sign) {
		shell.vget(this.sign.path, -1).drawCaret();
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
	this.sign1 = null;
	this.sign2 = null;
	this.begin = null;
	this.end   = null;
};

/**
| Sets begin/end so begin is before end.
*/
Selection.prototype.normalize = function(tree) {
	var s1 = this.sign1;
	var s2 = this.sign2;

	if (s1.path.get(-1) !== 'text') throw new Error('s1.path.get(-1) !== "text"');
	if (s2.path.get(-1) !== 'text') throw new Error('s2.path.get(-1) !== "text"');

	if (s1.path.equals(s2.path)) {
		if (s1.at1 <= s2.at1) {
			this.begin = this.sign1;
			this.end   = this.sign2;
		} else {
			this.begin = this.sign2;
			this.end   = this.sign1;
		}
		return;
	}

	var k1 = s1.path.get(-2);
	var k2 = s2.path.get(-2);
	if (k1 === k2) throw new Error('k1 === k2');

	var pivot = shell.tree.getPath(s1.path, -2);
	if (pivot !== shell.tree.getPath(s2.path, -2)) throw new Error('pivot(s1) !== pivot(s2)');

	var r1 = pivot.rankOf(k1);
	var r2 = pivot.rankOf(k2);

	if (r1 < r2) {
		this.begin = s1;
		this.end   = s2;
	} else {
		this.begin = s2;
		this.end   = s1;
	}
};

/**
| The text the selection selects.
*/
Selection.prototype.innerText = function() {
	if (!this.active) return '';
	this.normalize();
	var s1 = this.begin;
	var s2 = this.end;

	if (s1.path.equals(s2.path)) {
		var text = shell.tree.getPath(s1.path);
		return text.substring(s1.at1, s2.at1);
	}

	var pivot = shell.tree.getPath(s1.path, -2);
	var key1  = s1.path.get(-2);
	var key2  = s2.path.get(-2);

	var text1 = pivot.copse[key1].text;
	var text2 = pivot.copse[key2].text;

	var buf = [ text1.substring(s1.at1, text1.length) ];
	for (var r = pivot.rankOf(key1), rZ = pivot.rankOf(key2); r < rZ - 1; r++) {
		buf.push('\n');
		buf.push(pivot.copse[pivot.ranks[r]].text);
	}
	buf.push('\n');
	buf.push(text2.substring(0, s2.at1));
	return buf.join('');
};

/**
| Removes the selection including its contents.
*/
Selection.prototype.remove = function() {
	this.normalize();
	this.deselect();
	shell.redraw = true;
	peer.removeSpan(
		this.begin.path, this.begin.at1,
		this.end.path,   this.end.at1
	);
};

/**
| Deselects the selection.
*/
Selection.prototype.deselect = function(nopoke) {
	if (!this.active) return;
	if (!nopoke) {
		shell.vget(this.sign1.path, -3).poke();
	}

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
	this.fabric     = fabric;

	this.vSpacePath = new Path(['welcome']);
	this.vSpace     = null;

	this.cockpit    = new Cockpit();
	this.cockpit.message("Loading space 'welcome'...");

	this.caret      = new Caret();
	this.action     = null;
	this.selection  = new Selection();

	peer.setReport(this);

	// a flag set to true if anything requests a redraw.
	this.redraw = false;
	this._draw();
};

/**
| Sets the caret position.
*/
Shell.prototype.setCaret = function(sign, retainx) {
	if (sign.constructor !== Signature) { throw new Error('setCaret argument fail (1)'); }
	var caret = this.caret;
	//caret.sign = sign;
	caret.sign = immute(sign);
	caret.retainx = is(retainx) ? retainx : null;
	return caret;
};

/**
| Returns the visual node path points to.
*/
Shell.prototype.vget = function(path, plen) {
	/**/ if (!is(plen)) { plen  = path.length; }
	else if (plen < 0)  { plen += path.length; }
	/**/ if (plen <= 0) { throw new Error('cannot vget path of length <= 0'); }
	if (path.get(0) !== 'welcome') throw new Error('currently space must be "welcome"'); // TODO

	var vnode = this.vSpace;
	for (var a = 1; a < plen; a++) {
		vnode = vnode.vv[path.get(a)];
	}
	return vnode;
};

/**
| MeshMashine reports changes
*/
Shell.prototype.report = function(status, tree, chgX) {
	switch (status) {
	case 'fail':
		throw new Error('Connection failed'); // TODO
		//break;
	case 'start' :
		this.vSpace = new VSpace(tree.root.copse.welcome, this.vSpacePath);
		this.cockpit.message(null);
		this.cockpit.setCurSpace('welcome'); // TODO
		this.cockpit.setUser('Visitor');     // TODO
		break;
	case 'update' :
		this.tree = tree;
		this.vSpace.report(status, tree, chgX);

		var caret = this.caret;
		if (caret.sign !== null) {
			caret.sign = tfxSign(caret.sign, chgX);
			if (isArray(caret.sign)) throw new Error('Invalid caret transformation');
		}

		var selection = this.selection;
		if (selection.active) {
			selection.sign1 = tfxSign(selection.sign1, chgX);
			selection.sign2 = tfxSign(selection.sign2, chgX);
		}
		break;
	default :
		throw new Error('unknown status: '+status);
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
| Draws the cockpit and the vSpace.
*/
Shell.prototype._draw = function() {
	this.fabric.attune();   // @@ <- bad name for clear();

	// remove caret cache.
	this.caret.save$ = null;
	this.caret.screenPos$ = null;

	if (this.vSpace) { this.vSpace.draw(); }
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
	if (this.vSpace) { this.vSpace.click(p); }
	if (this.redraw) { this._draw(); }
};

/**
| Mouse hover.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	if (!this.cockpit.mousehover(p)) {
		if (this.vSpace) { this.vSpace.mousehover(p); }
	}
	if (this.redraw) { this._draw(); }
};

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	var mouseState = this.cockpit.mousedown(p);
	if (mouseState === null && this.vSpace) { mouseState = this.vSpace.mousedown(p); }
	if (this.redraw) { this._draw(); }
	return mouseState;
};

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	// TODO cockpit
	if (this.vSpace) { this.vSpace.dragstart(p); }
	if (this.redraw) { this._draw(); }
};

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	// TODO cockpit
	if (this.vSpace) { this.vSpace.dragmove(p); }
	if (this.redraw) { this._draw(); }
};

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	// TODO cockpit
	if (this.vSpace) { this.vSpace.dragstop(p); }
	if (this.redraw) { this._draw(); }
};

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	// TODO cockpict
	if (this.vSpace) { this.vSpace.mousewheel(p, dir); }
	if (this.redraw) { this._draw(); }
};


/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(keyCode, shift, ctrl) {
	this.shift = shift;
	this.ctrl  = ctrl;

	var caret  = this.caret;
	if (caret.sign) { this.vget(caret.sign.path, -1).specialKey(keyCode); }
	if (this.redraw) this._draw();
};

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	this.shift = false;
	this.ctrl  = false;
	if (this.selection.active) { this.selection.remove(); }

	var caret  = this.caret;
	if (caret.sign) { this.vget(caret.sign.path, -1).input(text); }
	if (this.redraw) this._draw();
};

/**
| The window has been resized
*/
Shell.prototype.resize = function(width, height) {
	this._draw();
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ OvalMenu +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

      a1      |----->|
      a2      |->|   '
			  '  '   '           b2
          ..-----.. .' . . . . . A
        ,' \  n  / ','       b1  |
       , nw .---. ne , . . . A   |
       |---(  c  )---| . . . v . v
       ` sw `---' se '
        `. /  s  \ .´
          ``-----´´            outside = null

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
var OvalMenu = function(pc, settings, labels) {
	this.p           = pc;
	this.labels      = labels;

	this._style      = settings.style;
	this._highlight  = settings.highlight;
	this._dimensions = settings.dimensions;
	this._oflower    = new OvalFlower(pc, settings.dimensions, labels);
	this._within     = null;
};

/**
| Draws the hexmenu.
*/
OvalMenu.prototype.draw = function() {
	var f = shell.fabric;

	f.fill(this._style.fill, this._oflower, 'path', 'outer');
	switch(this._within) {
		case 'n'  :
		case 'ne' :
		case 'se' :
		case 's'  :
		case 'se' :
		case 'ne' :
			f.paint(this._highlight, this._oflower, 'path', this._within);
			break;
	}
	f.edge(this._style.edge, this._oflower, 'path', null);


	f.fontStyle('12px ' + theme.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var b1  = this._dimensions.b1;
	var b2  = this._dimensions.b2;
	var bs  = half(b2 - b1);
	var b2t = b1 + bs;
	var m   = 0.551784;
	var a2h = R(this._dimensions.a2 * m);
	var pc  = this.p;

	if (labels.n)  f.fillText(labels.n,  pc.x,       pc.y - b2t);
	if (labels.ne) f.fillText(labels.ne, pc.x + a2h, pc.y - bs );
	if (labels.se) f.fillText(labels.se, pc.x + a2h, pc.y + bs );
	if (labels.s)  f.fillText(labels.s,  pc.x,       pc.y + b2t);
	if (labels.sw) f.fillText(labels.sw, pc.x - a2h, pc.y + bs );
	if (labels.nw) f.fillText(labels.nw, pc.x - a2h, pc.y - bs );
	if (labels.c)  f.fillText(labels.c,  pc);
};

/**
| Sets this.mousepos and returns it according to p.
*/
OvalMenu.prototype.within = function(p) {
	var w = this._oflower.within(system.fabric, p);
	if (w === this._within) return w;
	shell.redraw = true;
	return this._within = w;
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
| updates twig pointers
*/
VSpace.prototype.report = function(status, tree, chgX) {
	var twig = tree.root.copse[this.key];

	if (this.twig === twig) {
		// no change
		return;
	}

	this.twig = twig;
	this.update(twig);
};

/**
| Updates v-vine to match a new twig.
*/
VSpace.prototype.update = function(twig) {
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
			vv[k] = this.createVItem(sub, k);
		}
	}

	// remove the focus if the focussed item is removed.
	if (this.focus) {
		if (!is(vv[this.focus.key])) {
			if (shell.selection.active &&
				shell.selection.sign1.path.get(-4) === this.focus.key)
			{ shell.selection.deselect(true); }

			this.setFocus(null);
		}
	}
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

	for(var r = twig.length - 1; r >= 0; r--) {
		this.vAtRank(r).draw(this.fabric);
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
		arrow.draw(this.fabric, theme.relation.style);
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
		var vdoc = vitem.vv.doc;
		caret = shell.setCaret(
			new Signature({ path: vdoc.vAtRank(0).textPath(), at1: 0 })
		);
		caret.show();
		peer.moveToTop(vitem.path);
	} else {
		caret.hide();
		caret.sign = null;
	}
};

/**
| Returns the vtwig at rank 'rank'.
|
| @@: put in a common prototype for all visuals with ranks?
*/
VSpace.prototype.vAtRank = function(rank) {
	return this.vv[this.twig.ranks[rank]];
};

/**
| Mouse wheel
*/
VSpace.prototype.mousewheel = function(p, dir) {
	var twig = this.twig;

	var pp = p.sub(this.fabric.pan);
	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		var vitem = this.vAtRank(r);
		if (vitem.mousewheel(pp, dir)) { return true; }
	}

	// @@ zooming.
	return true;
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
		if (isnon(action.floatmenu.within(p))) {
			// mouse floated on float menu
			system.setCursor('default');
			return true;
		}
		break;
	case Action.ITEMMENU :
		if (isnon(action.itemmenu.within(p))) {
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

	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
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
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
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
	var pan  = this.fabric.pan;
	var pp   = p.sub(pan);
	var action;

	// clicked the tab of the focused item?
	var focus = this.focus;
	if (focus && focus.withinItemMenu(pp)) {
		action = shell.startAction(Action.ITEMMENU, null, pp);
		var labels = {n : 'Remove'};
		action.itemmenu = new OvalMenu(focus.getOvalSlice().pm.add(pan), theme.itemmenu, labels);
		shell.redraw = true;
		return;
	}

	// clicked some item?
	for(var a = 0, aZ = this.twig.length; a < aZ; a++) {
		var vitem = this.vAtRank(a);
		if (vitem.click(pp)) return true;
	}

	// otherwhise pop up the float menu
	action = shell.startAction(Action.FLOATMENU, null, p);
	action.floatmenu = new OvalMenu(p, theme.ovalmenu, this._floatMenuLabels);
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
		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			var vitem = this.vAtRank(r);
			if (vitem.dragstop(pp)) break;
		}
		break;
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

		for(var r = 0, rZ = this.twig.length; r < rZ; r++) {
			var vitem = this.vAtRank(r);
			if (vitem.dragmove(pp)) return true;
		}
		return true;
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
		md = fm.within(p);
		shell.stopAction();

		if (!md) break;
		switch(md) {
		case 'n' : // note
			var nw = theme.note.newWidth;
			var nh = theme.note.newHeight;
			pnw = fm.p.sub(this.fabric.pan.x + half(nw) , this.fabric.pan.y + half(nh));
			key = peer.newNote(this.path, new Rect(pnw, pnw.add(nw, nh)));
			var vnote = this.vv[key];
			this.setFocus(vnote);
			break;
		case 'ne' : // label
			pnw = fm.p.sub(this.fabric.pan);
			pnw = pnw.sub(theme.label.createOffset);
			key = peer.newLabel(this.path, pnw, 'Label', 20);
			var vlabel = this.vv[key];
			this.setFocus(vlabel);
			break;
		}
		shell.redraw = true;
		return false;
	case Action.ITEMMENU :
		var im = action.itemmenu;
		md = im.within(p);
		shell.stopAction();

		if (!im) break;
		switch(md) {
		case 'n': // remove
			var item = this.focus;
			this.setFocus(null);
			peer.removeItem(item.path);
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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .-,--.
 `|  /    '|__/ ,-. ,-. ,-.
  | /     ,|    ,-| |   ,-|
  `'      `'    `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A visual paragraph representation

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var VPara = function(twig, path) {
	if (twig.type !== 'Para') throw new Error('type error');

	this.twig = twig;
	this.path = path;
	this.key  = path.get(-1);

	// caching
	this.$fabric = null;
	this.$flow   = null;
};

/**
| Updates v-vine to match a new twig.
*/
VPara.prototype.update = function(twig) {
	this.twig    = twig;
	this.$flow   = null;
	this.$fabric = null;
};

/**
| (re)flows the paragraph, positioning all chunks.
*/
VPara.prototype.getFlow = function() {
	var vitem = shell.vget(this.path, -2);
	var vdoc  = vitem.vv.doc;
	var flowWidth = vitem.getFlowWidth();
	var fontsize = vdoc.getFontSize();

	var flow  = this.$flow;
	// @@ go into subnodes instead
	var text = this.twig.text;

	if (!noCache && flow &&
		flow.flowWidth === flowWidth &&
		flow.fontsize  === fontsize
	) return flow;

	if (shell.caret.path && shell.caret.path.equals(this.path)) {
		// remove caret cache if its within this flow.
		// TODO change
		shell.caret.cp$line  = null;
		shell.caret.cp$token = null;
	}

	// builds position informations.
	flow  = this.$flow = [];
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
				//y += R(vdoc.fontsize * (pre ? 1 : 1 + theme.bottombox)); @@
				y += R(vdoc.getFontSize() * (1 + theme.bottombox));
				line++;
				flow[line] = {a: [], y: y, o: ca.index};
			} else {
				// horizontal overflow
				// console.log('HORIZONTAL OVERFLOW'); // @@
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
	var vdoc = shell.vget(this.path, -1);
	Measure.font = vdoc.getFont();

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
    var reg   = /([^\n]+)(\n?)/g;
	var para  = this;
	var vitem = shell.vget(para.path, -2);
	var vdoc  = vitem.vv.doc;

    for(var rx = reg.exec(text); rx !== null; rx = reg.exec(text)) {
		var line = rx[1];
		peer.insertText(para.textPath(), caret.sign.at1, line);
        if (rx[2]) {
			peer.split(para.textPath(), caret.sign.at1);
			para = vdoc.vAtRank(vdoc.twig.rankOf(para.key) + 1);
		}
    }
	vitem.scrollCaretIntoView();
};

/**
| Handles a special key
*/
VPara.prototype.specialKey = function(keycode) {
	var caret  = shell.caret;
	// TODO split into smaller functions
	var para = this.para;
	var select = shell.selection;

	var vitem = shell.vget(this.path, -2);
	var vdoc  = vitem.vv.doc;
	var ve, at1, flow;
	var r, x;

	if (shell.ctrl) {
		switch(keycode) {
		case 65 : // ctrl+a
			var v0 = vdoc.vAtRank(0);
			var v1 = vdoc.vAtRank(vdoc.twig.length - 1);

			select.sign1 = new Signature({ path: v0.textPath(), at1: 0 });
			select.sign2 = new Signature({ path: v1.textPath(), at1: v1.twig.text.length });
			select.active = true;
			shell.setCaret(select.sign2);
			system.setInput(select.innerText());
			caret.show();
			vitem.poke();
			shell.redraw = true;
			return true;
		}
	}

	if (!shell.shift && select.active) {
		switch(keycode) {
		case 33 : // pageup
		case 34 : // pagedown
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
		case 33 : // pageup
		case 34 : // pagedown
		case 35 : // end
		case 36 : // pos1
		case 37 : // left
		case 38 : // up
		case 39 : // right
		case 40 : // down
			select.sign1 = caret.sign;
			vitem.poke();
		}
	}

	switch(keycode) {
	case  8 : // backspace
		if (caret.sign.at1 > 0) {
			peer.removeText(this.textPath(), caret.sign.at1 - 1, 1);
		} else {
			r = vdoc.twig.rankOf(this.key);
			if (r > 0) {
				ve = vdoc.vAtRank(r - 1);
				peer.join(ve.textPath(), ve.twig.text.length);
			}
		}
		vitem.scrollCaretIntoView();
		break;
	case 13 : // return
		peer.split(this.textPath(), caret.sign.at1);
		vitem.scrollCaretIntoView();
		break;
	case 33 : // pageup
		vitem.scrollPage(true);
		break;
	case 34 : // pagedown
		vitem.scrollPage(false);
		break;
	case 35 : // end
		caret = shell.setCaret(
			new Signature({ path: this.textPath(), at1: this.twig.text.length })
		);
		break;
	case 36 : // pos1
		caret = shell.setCaret(
			new Signature({ path: this.textPath(), at1: 0 })
		);
		vitem.scrollCaretIntoView();
		break;
	case 37 : // left
		if (caret.sign.at1 > 0) {
			caret = shell.setCaret(
				new Signature({ path: this.textPath(), at1: caret.sign.at1 - 1 })
			);
		} else {
			r = vdoc.twig.rankOf(this.key);
			if (r > 0) {
				ve = vdoc.vAtRank(r - 1);
				caret = shell.setCaret(
					new Signature({ path: ve.textPath(), at1: ve.twig.text.length })
				);
			}
		}
		vitem.scrollCaretIntoView();
		break;
	case 38 : // up
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.pos$.x;

		if (caret.flow$line > 0) {
			// stay within this para
			at1 = this.getLineXOffset(caret.flow$line - 1, x);
			shell.setCaret(
				new Signature({ path: this.textPath(), at1: at1 }), x
			);
		} else {
			// goto prev para
			r = vdoc.twig.rankOf(this.key);
			if (r > 0) {
				ve = vdoc.vAtRank(r - 1);
				at1 = ve.getLineXOffset(ve.getFlow().length - 1, x);
				caret = shell.setCaret(
					new Signature({ path: ve.textPath(), at1: at1 }), x
				);
			}
		}
		vitem.scrollCaretIntoView();
		break;
	case 39 : // right
		if (caret.sign.at1 < this.twig.text.length) {
			caret = shell.setCaret(
				new Signature({ path: this.textPath(), at1: caret.sign.at1 + 1 })
			);
		} else {
			r = vdoc.twig.rankOf(this.key);
			if (r < vdoc.twig.length - 1) {
				ve = vdoc.vAtRank(r + 1);
				caret = shell.setCaret(
					new Signature({ path: ve.textPath(), at1: 0 })
				);
			}
		}
		vitem.scrollCaretIntoView();
		break;
	case 40 : // down
		flow = this.getFlow();
		x = caret.retainx !== null ? caret.retainx : caret.pos$.x;

		if (caret.flow$line < flow.length - 1) {
			// stays within this para
			at1 = this.getLineXOffset(caret.flow$line + 1, x);
			caret = shell.setCaret(
				new Signature({ path: this.textPath(), at1: at1 }), x
			);
		} else {
			// goto next para
			r = vdoc.twig.rankOf(this.key);
			if (r < vdoc.twig.length - 1) {
				ve = vdoc.vAtRank(r + 1);
				at1 = ve.getLineXOffset(0, x);
				caret = shell.setCaret(
					new Signature({ path: ve.textPath(), at1: at1 }), x
				);
			}
		}
		vitem.scrollCaretIntoView();
		break;
	case 46 : // del
		if (caret.sign.at1 < this.twig.text.length) {
			peer.removeText(this.textPath(), caret.sign.at1, 1);
		} else {
			r = vdoc.twig.rankOf(this.key);
			if (r < vdoc.twig.length - 1) {
				peer.join(this.textPath(), this.twig.text.length);
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
			select.active = true;
			select.sign2 = caret.sign;
			system.setInput(select.innerText());
			vitem.poke();
			shell.redraw = true;
		}
	}

	caret.show();
	shell.redraw = true; // @@ might be optimized
};

/**
| Return the path to the .text attribute if this para.
| @@ use lazyFixate.
*/
VPara.prototype.textPath = function() {
	if (this._textPath) return this._textPath;
	return (this._textPath = new Path(this.path, '++', 'text'));
};

/**
| Returns the height of the para
*/
VPara.prototype.getHeight = function() {
	var flow = this.getFlow();
	var vdoc = shell.vget(this.path, -1);
	return flow.height + R(vdoc.getFontSize() * theme.bottombox);
};

/**
| Draws the paragraph in its cache and returns it.
*/
VPara.prototype.getFabric = function() {
	var flow   = this.getFlow();
	var width  = flow.spread;
	var vdoc   = shell.vget(this.path, -1);
	var height = this.getHeight();
	var fabric = this.$fabric;

	// cache hit?
	if (!noCache && fabric &&
		fabric.width === width &&
		fabric.height === height)
	{ return fabric; }

	// @@: work out exact height for text below baseline
	fabric = this.$fabric = new Fabric(width, height);
	fabric.fontStyle(vdoc.getFont(), 'black', 'start', 'alphabetic');

	// draws text into the fabric
	for(var a = 0, aZ = flow.length; a < aZ; a++) {
		var line = flow[a];
		for(var b = 0, bZ = line.a.length; b < bZ; b++) {
			var chunk = line.a[b];
			fabric.fillText(chunk.t, chunk.x, line.y);
		}
	}

	return fabric;
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
| Returns the caret position relative to the vdoc.
*/
VPara.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var vitem   = shell.vget(this.path, -2);
	var vdoc    = vitem.vv.doc;
	var fs      = vdoc.getFontSize();
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1, shell.caret);

	var pnw = vdoc.getPNW(this.key);
	var s = R(p.y + pnw.y + descend);
	var n = s - R(vdoc.getFontSize() + descend);
	var	x = p.x + pnw.x - 1;

	return immute({ s: s, n: n, x: x });
};


/**
| Draws the caret if its in this paragraph.
*/
VPara.prototype.drawCaret = function() {
	var caret = shell.caret;
	var pan   = shell.vSpace.fabric.pan;
	var vitem = shell.vget(this.path, -2);
	var zone  = vitem.getZone();
	var cpos  = caret.pos$  = this.getCaretPos();
	var sbary = vitem.scrollbarY;
	var sy    = sbary ? R(sbary.getPos()) : 0;

	var cyn = min(max(cpos.n - sy, 0), zone.height); // TODO limit
	var cys = min(max(cpos.s - sy, 0), zone.height);
	var cx  = cpos.x;

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
 Currently there are only vertical scrollbars.

 TODO scroll cursor into view.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| parent: parent holding the scrollbar
*/
var Scrollbar = function() {
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
	var msize  = max(size, theme.scrollbar.minSize);
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
	fabric.paint(theme.scrollbar.style, this, 'path');
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
var VDoc = function(twig, path) {
	this.twig  = twig;
	this.path  = path;
	this.key   = path.get(-1);

	this.pnws  = null;
	var vv = this.vv = [];

	var ranks = twig.ranks;
	var copse = twig.copse;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var k = ranks[r];
		vv[k] = new VPara(copse[k], new Path(path, '++', k));
	}
};

/**
| Returns the vtwig at rank 'rank'.
*/
VDoc.prototype.vAtRank = function(rank) {
	return this.vv[this.twig.ranks[rank]];
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
			o = new VPara(sub, new Path(this.path, '++', k));
			o.update(sub);
			vv[k] = o;
		}
	}
};

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
	var paraSep = this.getParaSep();
	var select = shell.selection;

	// draws the selection
	if (select.active && this.path.subPathOf(select.sign1.path)) {
		fabric.paint(theme.selection.style, this, 'pathSelection', width, imargin, scrollp);
	}

	var y = imargin.n;
	var pnws = {};   // north-west points of paras

	// draws the paragraphs
	var twig = this.twig;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.vAtRank(r);
		var flow = vpara.getFlow();

		pnws[twig.ranks[r]] = new Point(imargin.w, R(y));
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
	var paraSep  = this.getParaSep();
	var twig     = this.twig;
	var vv       = this.vv;
	var height   = 0;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.vAtRank(r);

		var flow = vpara.getFlow();
		if (r > 0) { height += paraSep; }
		height += flow.height;
	}
	height += R(fontsize * theme.bottombox);
	return height;
};

/**
| Returns the width actually used of the document.
*/
VDoc.prototype.getSpread = function() {
	var spread = 0;
	for (var r = 0, rZ = this.twig.length; r < rZ; r++) {
		spread = max(spread, this.vAtRank(r).getFlow().spread);
	}
	return spread;
};

/**
| Returns the (default) fontsize for this document
| Argument vitem is optional, just to safe double and tripple lookups
*/
VDoc.prototype.getFontSize = function(vitem) {
	if (!is(vitem)) { vitem = shell.vget(this.path, -1); }
	var fontsize = vitem.twig.fontsize;
	return (!vitem.fontSizeChange) ? fontsize : vitem.fontSizeChange(fontsize);
};

/**
| Returns the (default) paraSeperator for this document
| Argument vitem is optional, just to safe double and tripple lookups
*/
VDoc.prototype.getParaSep = function(vitem) {
	if (!is(vitem)) { vitem = shell.vget(this.path, -1); }
	var fontsize = this.getFontSize(vitem);
	return vitem.getParaSep(fontsize);
};

/**
| Returns the default font for the document.
*/
VDoc.prototype.getFont = function() {
	return this.getFontSize() + 'px ' + theme.defaultFont;
};

/**
| Returns the paragraph at point
*/
VDoc.prototype.getVParaAtPoint = function(p) {
	var twig   = this.twig;
	var vv     = this.vv;

	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		// TODO beautify
		var k = twig.ranks[r];
		var vpara = vv[k];
		var flow = vpara.getFlow();
		var pnw = this.pnws[k];
		if (p.y < pnw.y + flow.height) return vpara;
	}
	return null;
};

/**
| Paths a selection
|
| fabric  : the fabric to path for
| border  : width of the path (ignored)
| twist   : paramter for beginPath()
|           +0.5 to everything for line pathing
| width   : width the vdoc is drawn
| imargin : inner margin of the doc
| scrollp : scroll position of the doc.
*/
VDoc.prototype.pathSelection = function(fabric, border, twist, width, imargin, scrollp) {
	var select = shell.selection;
	select.normalize();

	var sp = scrollp;

	var s1 = select.begin;
	var s2 = select.end;

	var key1 = s1.path.get(-2);
	var key2 = s2.path.get(-2);

	var pnw1 = this.getPNW(key1);
	var pnw2 = this.getPNW(key2);

	var vpara1 = this.vv[key1];
	var vpara2 = this.vv[key2];

	var p1 = vpara1.getOffsetPoint(s1.at1);
	var p2 = vpara2.getOffsetPoint(s2.at1);

	p1 = new Point(R(p1.x + pnw1.x - sp.x), R(p1.y + pnw1.y - sp.y));
	p2 = new Point(R(p2.x + pnw2.x - sp.x), R(p2.y + pnw2.y - sp.y));

	var fontsize = this.getFontSize();
	fabric.beginPath(twist);
	var descend = R(fontsize * theme.bottombox);
	var  ascend = R(fontsize);
	var rx = width - imargin.e;
	var lx = imargin.w;
	if ((abs(p2.y - p1.y) < 2)) {
		// ***
		fabric.moveTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(p1.x, p1.y + descend);
	} else if (abs(p1.y + fontsize + descend - p2.y) < 2 && (p2.x <= p1.x))  {
		//      ***
		// ***
		fabric.moveTo(rx,   p1.y -  ascend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(rx,   p1.y + descend);

		fabric.moveTo(lx,   p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);
	} else {
		//    *****
		// *****
		fabric.moveTo(rx,   p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);

		if (twist) {
			fabric.moveTo(lx, p1.y + descend);
		} else {
			fabric.lineTo(lx, p1.y + descend);
		}
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(rx,   p1.y -  ascend);
		if (!twist) {
			fabric.lineTo(rx, p2.y - ascend);
		}
	}
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
var VItem = function(twig, path) {
	this._$ovalslice = null;
	this.twig        = twig;
	this.path        = path;
	this.key         = path.get(-1);
	this.vv          = immute({
		doc : new VDoc(twig.doc, new Path(path, '++', 'doc'))
	});

	// caching
	this.$fabric   = null;
};

/**
| Updates the vvine to match a new twig.
*/
VItem.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var vdoc = this.vv.doc;
	if (vdoc.twig !== twig.doc) {
		vdoc.update(twig.doc);
	}
};

/**
| Return the handle oval slice.
*/
VItem.prototype.getOvalSlice = function() {
	var zone = this.getZone();
	if (this._$ovalslice && this._$ovalslice.psw.eq(zone.pnw)) return this._$ovalslice;
	return this._$ovalslice = new OvalSlice(zone.pnw, theme.ovalmenu.dimensions);
};

/**
| Returns if point is within the item menu
*/
VItem.prototype.withinItemMenu = function(p) {
	return this.getOvalSlice().within(system.fabric, p);
};

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| @@ rename
*/
VItem.prototype.checkItemCompass = function(p) {
	var ha = this.handles;
	var zone = this.getZone();

	if (!ha) return null;
	var d   =       theme.handle.size; // distance
	var din = 0.5 * theme.handle.size; // inner distance
	var dou =       theme.handle.size; // outer distance

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

	var ds = theme.handle.distance;
	var hs = theme.handle.size;
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
	fabric.edge(theme.handle.style.edge, this, 'pathResizeHandles');

	// draws item menu handler
	fabric.paint(theme.ovalmenu.slice, this.getOvalSlice(), 'path');
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
	shell.vSpace.setFocus(this);
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
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
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
		var vSpace = shell.vget(this.path, -1);
		VRelation.create(vSpace, action.vitem, this);
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

	var vSpace = shell.vSpace;
	if (vSpace.focus !== this) {
		shell.vSpace.setFocus(this);
		shell.selection.deselect();
	}
	shell.redraw = true;

	var pnw = this.getZone().pnw;
	var pi = p.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));

	var vpara = this.getVParaAtPoint(pi);
	if (vpara) {
		var ppnw   = this.vv.doc.getPNW(vpara.key);
		var at1    = vpara.getPointOffset(pi.sub(ppnw));
		var caret  = shell.caret;
		caret = shell.setCaret(
			new Signature({ path: vpara.textPath(), at1: at1 })
		);
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
	fabric.edge(theme.note.style.highlight, silhoutte, 'path');
};



/**
| Called by subvisuals when they got changed.
*/
VItem.prototype.poke = function() {
	this.$fabric = null;
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
var VNote = function(twig, path) {
	VItem.call(this, twig, path);
	this.scrollbarY = new Scrollbar();
};
subclass(VNote, VItem);

/**
| Default margin for all notes.
*/
VNote.prototype.imargin = new Margin(theme.note.imargin);

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
| TODO no longer needs to be part of the prototype.
*/
VNote.prototype.minWidth  = theme.note.minWidth;
VNote.prototype.minHeight = theme.note.minHeight;

/**
| Returns the notes silhoutte.
|
| zone$:  the cache for the items zone
| zAnchor: if true anchor the silhoute at zero.
*/
VNote.prototype.getSilhoutte = function(zone$, zAnchor) {
	var z$ = zone$;
	var s$;

	var cr = theme.note.cornerRadius;
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
			zone.width - this.imargin.e - theme.scrollbar.strength,
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
| Scrolls the note so the caret comes into view.
*/
VNote.prototype.scrollCaretIntoView = function() {
	var caret   = shell.caret;
	var scrolly = this.scrollbarY;
	var sy      = scrolly.getPos();
	var vpara   = shell.vget(caret.sign.path, -1);
	if (vpara.constructor !== VPara) { throw new Error('iFail'); }
	var cp      = vpara.getCaretPos();
	var zone    = this.getZone();
	var imargin = this.imargin;

	if (cp.n - imargin.n < sy) {
		this.setScrollbar(cp.n - imargin.n);
		this.poke();
	} else if (cp.s + imargin.s > sy + zone.height) {
		this.setScrollbar(cp.s - zone.height + imargin.s);
		this.poke();
	}
};


/**
| Scrolls the note so the caret comes into view.
*/
VNote.prototype.scrollPage = function(up) {
	var zone = this.getZone();
	var dir  = up ? -1 : 1;
	var fs   = this.vv.doc.getFontSize();
	this.setScrollbar(this.scrollbarY.getPos() + dir * zone.height - fs * 2);
	this.poke();
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
		// adapts scrollbar position
		// this.setScrollbar(); TODO

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
	var zone = this.getZone();
	var f = this.$fabric;

	// no buffer hit?
	if (noCache || !f ||
		zone.width  !== f.width ||
		zone.height !== f.height)
	{
		f = this.$fabric = new Fabric(zone.width, zone.height);
		var vdoc         = this.vv.doc;
		var imargin      = this.imargin;

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
		f.fill(theme.note.style.fill, silhoutte, 'path');

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		vdoc.draw(f, zone.width, imargin, sbary.point);

		// draws the scrollbar
		if (sbary.visible) {
			this.setScrollbar();
			sbary.draw(f);
		}

		// draws the border
		f.edge(theme.note.style.edge, silhoutte, 'path');
	}

	fabric.drawImage(f, zone.pnw);
};

/**
| Mouse wheel turned.
*/
VNote.prototype.mousewheel = function(p, dir) {
	if (!this.getZone().within(p)) return false;
	this.setScrollbar(this.scrollbarY.getPos() - dir * settings.textWheelSpeed);
	this.poke();
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
		flowWidth -= theme.scrollbar.strength;
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
var VLabel = function(twig, path) {
	VItem.call(this, twig, path);
};
subclass(VLabel, VItem);

/**
| Default margin for all notes.
*/
VLabel.prototype.imargin = new Margin(theme.label.imargin);

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
VLabel.prototype.minHeight = theme.label.minHeight;

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
| Dummy since a label does not scroll.
*/
VLabel.prototype.scrollCaretIntoView = function() {
	// nada
};

/**
| Dummy since a label does not scroll.
*/
VLabel.prototype.scrollPage = function(up) {
	// nada
};

/**
| Draws the label.
|
| fabric: to draw upon. // @@ remove this parameter.
*/
VLabel.prototype.draw = function(fabric) {
	var f    = this.$fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (noCache || !f ||
		zone.width  !== f.width ||
		zone.height !== f.height)
	{
		f = this.$fabric = new Fabric(zone.width, zone.height);
		var vdoc         = this.vv.doc;
		var imargin      = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);

		// draws selection and text
		vdoc.draw(f, zone.width, imargin, Point.zero);

		// draws the border
		f.edge(theme.label.style.edge, silhoutte, 'path');
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
		var vdoc = this.vv.doc;
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
	var twig = this.twig;
	var action = shell.action;
	var pnw = this.twig.pnw;

	// TODO Caching!
	var vdoc   = this.vv.doc;
	var fs     = vdoc.getFontSize();
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
		var fontsize = this.vv.doc.getFontSize();

		if (!this.twig.pnw.eq(zone.pnw)) {
			peer.setPNW(this.path, zone.pnw);
		}
		if (fontsize !== this.twig.fontsize) {
			peer.setFontSize(this.path, fontsize);
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
var VRelation = function(twig, path) {
	VLabel.call(this, twig, path);
};
subclass(VRelation, VLabel);

/**
| Default margin for all relations.
*/
VRelation.imargin = new Margin(theme.relation.imargin);

/**
| Creates a new Relation by specifing its relates.
*/
VRelation.create = function(vSpace, vitem1, vitem2) {
	var cline = Line.connect(vitem1.getZone(), null, vitem2.getZone(), null);
	var pnw = cline.pc.sub(theme.relation.createOffset);
	var key = peer.newRelation(vSpace.path, pnw, 'relates to', 20, vitem1.key, vitem2.key);
	// event listener has created the vrel
	var vrel = vSpace.vv[key];
	vSpace.setFocus(vrel);
};

VRelation.prototype.draw = function(fabric) {
	var vSpace = shell.vget(this.path, -1);
	var vitem1 = vSpace.vv[this.twig.item1key];
	var vitem2 = vSpace.vv[this.twig.item2key];
	var zone = this.getZone();

	if (vitem1) {
		var l1 = Line.connect(vitem1.getZone(), 'normal', zone, 'normal');
		fabric.paint(theme.relation.style, l1, 'path');
	}

	if (vitem2) {
		var l2 = Line.connect(zone,  'normal', vitem2.getZone(), 'arrow');
		fabric.paint(theme.relation.style, l2, 'path');
	}

	VLabel.prototype.draw.call(this, fabric);
};


})();
