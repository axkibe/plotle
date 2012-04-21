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
var Selection;
var Sign;
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
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
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

var Measure       = Fabric.Measure;

var tfxSign       = MeshMashine.tfxSign;

// configures tree.
Tree.cogging = true;

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

	this.vSpacePath = new Path(['welcome']);  // TODO move into vspace
	this.vspace     = null;

	this.cockpit    = new Cockpit();
	this.cockpit.message("Loading space 'welcome'...");

	this.caret      = new Caret(null, null, null, false);
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
Shell.prototype.setCaret = function(visec, sign, retainx) {
	switch (visec) {
	case null :
		if (sign !== null) { throw new Error('setCaret visec=null, invalid sign'); }
		break;
	case 'cockpit' :
	case 'space' :
		switch(sign && sign.constructor) {
		case null   : break;
		case Sign   : break;
		case Object : sign = new Sign(sign); break;
		default     : throw new Error('setCaret visec=' + visec + ', invalid sign');
		}
		break;
	default :
		throw new Error('invalid visec');
	}

	var poke = false;
	if (this.caret.sign &&
		(this.caret.visec !== visec || this.caret.sign.path !== sign.path)
	) {
		this.getEntity(this.caret.visec, this.caret.sign.path).poke();
		poke = true;
	}

	this.caret = new Caret(
		visec,
		sign,
		is(retainx) ? retainx : null,
		this.caret.$shown
	);

	if (poke) { this.getEntity(visec, sign.path); }

	return this.caret;
};

/**
| Returns the entity in the visual section (cockpit or space) marked by path
| This is either an item, or an cockpit element.
*/
Shell.prototype.getEntity = function(visec, path) {
	switch(visec) {
	case 'cockpit' : return this.cockpit.getEntity(path);
	case 'space'   : return this.vspace. getEntity(path);
	default : throw new Error('Invalid visec: '+visec);
	}
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
		this.vspace = new VSpace(tree.root.copse.welcome, this.vSpacePath);
		this.cockpit.message(null);
		this.cockpit.setCurSpace('welcome'); // TODO
		this.cockpit.setUser('Visitor');     // TODO
		break;
	case 'update' :
		this.tree = tree;
		this.vspace.report(status, tree, chgX);

		var caret = this.caret;
		var shown = this.caret.$shown;
		if (caret.sign !== null) {
			this.setCaret(
				caret.visec,
				tfxSign(caret.sign, chgX),
				caret.retainx
			);
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
| Draws the cockpit and the vspace.
*/
Shell.prototype._draw = function() {
	this.fabric.attune();   // @@ <- bad name for clear();

	// remove caret cache.
	this.caret.$save = null;
	this.caret.$screenPos = null;

	if (this.vspace) { this.vspace.draw(); }
	this.cockpit.draw();
	this.caret.display();

	this.redraw = false;
};

/**
| A mouse click.
*/
Shell.prototype.click = function(p, shift, ctrl) {
	// TODO cockpit
	if (this.vspace) { this.vspace.click(p, shift, ctrl); }
	if (this.redraw) { this._draw(); }
};

/**
| Mouse hover.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	if (!this.cockpit.mousehover(p, shift, ctrl)) {
		if (this.vspace) { this.vspace.mousehover(p, shift, ctrl); }
	}
	if (this.redraw) { this._draw(); }
};

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	var mouseState;

	mouseState = this.cockpit.mousedown(p, shift, ctrl);

	if (mouseState === null && this.vspace) {
		mouseState = this.vspace.mousedown(p, shift, ctrl);
	}

	if (this.redraw) { this._draw(); }
	return mouseState;
};

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	// TODO cockpit

	if (this.vspace) { this.vspace.dragstart(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	// TODO cockpit

	if (this.vspace) { this.vspace.dragmove(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	// TODO cockpit

	if (this.vspace) { this.vspace.dragstop(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl) {
	// TODO cockpict

	if (this.vspace) { this.vspace.mousewheel(p, dir, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};


/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(key, shift, ctrl) {
	var caret  = this.caret;
	switch (caret.visec) {
	case null : break;
	case 'cockpit' : this.cockpit.specialKey(key, shift, ctrl); break;
	case 'space'   : this. vspace.specialKey(key, shift, ctrl); break;
	default : throw new Error('invalid visec');
	}
	if (this.redraw) this._draw();
};

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	if (this.selection.active) { this.selection.remove(); }

	var caret  = this.caret;
	switch (caret.visec) {
	case null : break;
	case 'cockpit' : this.cockpit.input(text); break;
	case 'space'   : this. vspace.input(text); break;
	default : throw new Error('invalid visec');
	}
	if (this.redraw) this._draw();
};

/**
| The window has been resized.
*/
Shell.prototype.resize = function(width, height) {
	this._draw();
};

})();
