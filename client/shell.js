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

 The main shell links cockpit and the visuals.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

 @@ are milestones for later releases

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Action;
var Caret;
var Cockpit;
var Fabric;
var Jools;
var MeshMashine;
var Path;
var Tree;
var VSpace;

var settings;
var system;
var theme;

/**
| Exports
*/
var shell = null;
var peer  = null;
var Shell = null;

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

	this.caret      = new Caret(null, null, false);
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
	if (sign !== null && sign.constructor !== Signature) {
		throw new Error('setCaret, aFail = 1');
	}
	return this.caret = new Caret(
		sign,
		is(retainx) ? retainx : null,
		this.caret.$shown
	);
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
		var shown = this.caret.$shown;
		if (caret.sign !== null) {
			this.setCaret(tfxSign(caret.sign, chgX), caret.retainx);
			if (shown) { this.caret.show(); }
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
	this.caret.$save = null;
	this.caret.$screenPos = null;

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

})();
