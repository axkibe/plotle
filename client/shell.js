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
var Peer;
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
var Measure       = Fabric.Measure;
var Point         = Fabric.Point;
var abs           = Math.abs;
var debug         = Jools.debug;
var half          = Fabric.half;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var limit         = Jools.limit;
var log           = Jools.log;
var max           = Math.max;
var min           = Math.min;
var subclass      = Jools.subclass;
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

	this.vspace     = null;

	this.cockpit    = new Cockpit();
	this.cockpit.message("Loading space 'welcome'...");

	this.caret      = new Caret(null, null, null, false);
	this.action     = null;
	this.selection  = new Selection();

	this.green      = false;

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

	var entity;
	if (this.caret.sign &&
		(this.caret.visec !== visec || this.caret.sign.path !== sign.path)
	) {
		entity = this.getEntity(this.caret.visec, this.caret.sign.path);
		if (entity) { entity.poke(); }
	}

	this.caret = new Caret(
		visec,
		sign,
		is(retainx) ? retainx : null,
		this.caret.$shown
	);

	if (sign) {
		entity = this.getEntity(visec, sign.path);
		if (entity) { entity.poke(); }
		shell.redraw = true;
	}

	return this.caret;
};

/**
| Returns the entity in the visual section (cockpit or space) marked by path
| This is either an item, or an cockpit component.
*/
Shell.prototype.getEntity = function(visec, path) {
	switch(visec) {
	case 'cockpit' : return this.cockpit.getEntity(path);
	case 'space'   : return this.vspace. getEntity(path);
	default : throw new Error('Invalid visec: '+visec);
	}
};


/**
| MeshMashine reports updates.
*/
Shell.prototype.update = function(tree, chgX) {
	this.tree = tree;
	this.vspace.update(tree, chgX);

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
	this._draw();
};

/**
| Meshcraft got the systems focus.
*/
Shell.prototype.systemFocus = function() {
	if (this.green) { return; }
	this.caret.show();
	this.caret.display();
};

/**
| Meshraft lost the systems focus.
*/
Shell.prototype.systemBlur = function() {
	if (this.green) { return; }
	this.caret.hide();
	this.caret.display();
};

/**
| Blink the caret (if shown)
*/
Shell.prototype.blink = function() {
	if (this.green) { return; }
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
| Lets the shell check if it should redraw.
| Used by async handlers.
*/
Shell.prototype.poke = function() {
	if (this.redraw) { this._draw(); }
};

/**
| Paths the greenscreen frowny.
*/
Shell.prototype.pathFrowny = function(fabric, border, twist, pos) {
	fabric.beginPath(twist);
	fabric.moveTo(pos.x - 100, pos.y);
	fabric.lineTo(pos.x,       pos.y - 30);
	fabric.lineTo(pos.x + 100, pos.y);

	fabric.moveTo(pos.x - 100, pos.y - 130);
	fabric.lineTo(pos.x -  50, pos.y - 140);
	
	fabric.moveTo(pos.x + 100, pos.y - 130);
	fabric.lineTo(pos.x +  50, pos.y - 140);
};

/**
| Draws the cockpit and the vspace.
*/
Shell.prototype._draw = function() {
	var fabric = this.fabric;
	fabric.attune();   // @@ <- bad name for clear();

	if (this.green) {
		var m = new Point(half(fabric.width), half(fabric.height));
		fabric.fillRect('rgb(170, 255, 170)', 0, 0, fabric.width, fabric.height);

		fabric.edge(
			[ { border: 0, width: 1, color: 'black' } ],
			this, 'pathFrowny', m.add(0, -100)
		);

		fabric.fontStyle('40px '+theme.defaultFont, 'black', 'center', 'middle' );
		fabric.fillText(this.green, m);
		fabric.fontStyle('24px '+theme.defaultFont, 'black', 'center', 'middle' );
		fabric.fillText('Please refresh the page to reconnect.', m.x, m.y + 100);
		return;
	}

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
	if (this.green) { return; }

	// @@ cockpit

	if (this.vspace) { this.vspace.click(p, shift, ctrl); }
	if (this.redraw) { this._draw(); }
};

/**
| Mouse hover.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	if (this.green) { return; }

	if (!this.cockpit.mousehover(p, shift, ctrl)) {
		if (this.vspace) { this.vspace.mousehover(p, shift, ctrl); }
	}
	if (this.redraw) { this._draw(); }
};

/**
| Changes the shell to a green error screen.
*/
Shell.prototype.greenscreen = function(message, contract) {
	if (this.green) { return; }
	if (!message) { message = 'unknown error.'; }
	this.green = message;
	this.greenContact = contract || false;
	this._draw();
};

/**
| Mouse button down event.
|
| Returns the mouse state code, wheter this is a click/drag or undecided.
*/
Shell.prototype.mousedown = function(p, shift, ctrl) {
	if (this.green) { return false; }

	var mouseState;

	mouseState = this.cockpit.mousedown(p, shift, ctrl);

	if (mouseState === null && this.vspace) {
		mouseState = this.vspace.mousedown(p, shift, ctrl);
	}

	if (this.redraw) { this._draw(); }
	return mouseState || false;
};

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	if (this.green) { return; }

	// cockpit?

	if (this.vspace) { this.vspace.dragstart(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	if (this.green) { return; }

	// cockpit?

	if (this.vspace) { this.vspace.dragmove(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	if (this.green) { return; }

	// cockpit?

	if (this.vspace) { this.vspace.dragstop(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl) {
	if (this.green) { return; }

	// cockpit?

	if (this.vspace) { this.vspace.mousewheel(p, dir, shift, ctrl); }

	if (this.redraw) { this._draw(); }
};


/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(key, shift, ctrl) {
	if (this.green) { return; }

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
	if (this.green) { return; }

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

/**
| Sets the current user
*/
Shell.prototype.setUser = function(user, pass) {
	this.cockpit.setUser(user);

	if (user.substr(0, 5) !== 'visit') {
		window.localStorage.setItem('user', user);
		window.localStorage.setItem('pass', pass);
	}
};


/**
| Called when loading the website
*/
Shell.prototype.onload = function() {
	peer = new Peer();
	peer.setUpdate(this);
	var self = this;

	var user = window.localStorage.getItem('user');
	var pass = null;
	if (user) {
		pass = window.localStorage.getItem('pass');
	} else {
		user = 'visitor';
	}

	peer.auth(user, pass, function(res) {
		self.onLoadAuth(user, res);
	});
};

/**
| Answer to on loading authentication
*/
Shell.prototype.onLoadAuth = function(user, res) {
	var self = this;

	if (!res.ok) {
		// when logging in with a real user failed
		// takes a visitor instead
		if (user !== 'visitor') {
			peer.auth('visitor', null, function(res) {
				self.onLoadAuth('visitor', res); 
			});
			return;
		}
		// if even that failed, bails to greenscreen
		log('fail', res.message);
		self.greenscreen(res.message);
		return;
	}

	self.setUser(res.user, res.pass);
	var spaceName = 'welcome';
	peer.aquireSpace(spaceName, function(err, val) {
		if (err !== null) {
			this.greenscreen('Cannot aquire space');
			return;
		}
		if (val.name !== spaceName) {
			throw new Error('got wrong spaceName!');
		}
		var tree = val.tree;
		self.vspace = new VSpace(tree.root.copse.welcome, new Path([spaceName]));
		self.cockpit.message(null);
		self.cockpit.setCurSpace(spaceName);
		self._draw();
	});
};


})();
