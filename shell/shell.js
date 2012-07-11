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

 The shell consists of the dashboard and the visual space.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Action;
var Caret;
var Dash;
var Fabric;
var Jools;
var Measure;
var MeshMashine;
var Path;
var Peer;
var Point;
var Selection;
var Sign;
var system;
var theme;
var Tree;
var View;
var Visual;

/**
| Exports
*/
var shell = null;
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
var debug    = Jools.debug;
var half     = Jools.half;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var log      = Jools.log;
var Space    = Visual.Space;
var subclass = Jools.subclass;
var tfxSign  = MeshMashine.tfxSign;

// configures tree.
Tree.cogging = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .       .  .
 \___  |-. ,-. |  |
     \ | | |-' |  |
 `---' ' ' `-' `' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The users shell.
 Consists of the dashboard and the space the user is viewing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
Shell = function(fabric) {
	if (shell !== null) throw new Error('Singleton not single');
	shell = this;

	Measure.init();

	Measure.setFont(20, theme.defaultFont);
	this.$fontWatch = Measure.width('meshcraft$8833');

	this.fabric     = fabric;

	this.$space     = null;

	this.dash       = new Dash.Board();
	this.menu       = null;

	this.caret      = new Caret(null, null, null, false);
	this.$action    = null;
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
	case 'dash'  :
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
| Returns the entity in the visual section (dashboard or space) marked by path
| This is either an item, or a dashboard component.
*/
Shell.prototype.getEntity = function(visec, path) {
	switch(visec) {
	case 'dash'  : return this.dash.  getEntity(path);
	case 'space' : return this.$space.getEntity(path);
	default : throw new Error('Invalid visec: '+visec);
	}
};

/**
| Peer received a message.
*/
Shell.prototype.messageRCV = function(space, user, message) {
	if (user) {
		this.dash.message(user + ': ' + message);
	} else {
		this.dash.message(message);
	}
	this.poke();
};

/**
| MeshMashine reports updates.
*/
Shell.prototype.update = function(tree, chgX) {
	this.tree = tree;
	this.$space.update(tree, chgX);

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

	Measure.setFont(20, theme.defaultFont);
	var w = Measure.width('meshcraft$8833');
	if (w !== this.$fontWatch) {
		console.log('fontchange detected');
		this.$fontWatch = w;
		this.knock();
	}

	this.caret.blink();
};

/**
| Creates an action.
*/
Shell.prototype.startAction = function() {
	if (this.$action) throw new Error('double action');
	return this.$action = new Action(arguments);
};

/**
| Ends an action.
*/
Shell.prototype.stopAction = function() {
	if (!this.$action) throw new Error('ending no action');
	this.$action = null;
};

/**
| Lets the shell check if it should redraw.
| Used by async handlers.
*/
Shell.prototype.poke = function() {
	if (this.$hoverP)
		{ this.mousehover(this.$hoverP, this.$hoverShift, this.$hoverCtrl); }

	if (this.redraw)
		{ this._draw(); }
};

/**
| Force-clears all caches.
*/
Shell.prototype.knock = function() {
	if (this.green) return;
	this.caret.$save = null;
	this.caret.$screenPos = null;

	if (this.$space) { this.$space.knock(); }
	this.dash.knock();
	if (this.menu) { this.menu.knock(); }

	this._draw();
};

/**
| Paths the greenscreen frowny.
*/
Shell.prototype.pathFrowny = function(fabric, border, twist, view, pos) {
	fabric.moveTo(pos.x - 100, pos.y);
	fabric.lineTo(pos.x,       pos.y - 30);
	fabric.lineTo(pos.x + 100, pos.y);

	fabric.moveTo(pos.x - 100, pos.y - 130);
	fabric.lineTo(pos.x -  50, pos.y - 140);

	fabric.moveTo(pos.x + 100, pos.y - 130);
	fabric.lineTo(pos.x +  50, pos.y - 140);
};

/**
| Sets the current popup menu.
*/
Shell.prototype.setMenu = function(menu) {
	this.menu   = menu;
	this.redraw = this;
};

/**
| Draws the dashboard and the space.
*/
Shell.prototype._draw = function() {
	var fabric = this.fabric;
	fabric.attune();   // TODO <- bad name for clear();

	if (this.green) {
		var m = new Point(half(fabric.width), half(fabric.height));
		fabric.fillRect('rgb(170, 255, 170)', 0, 0, fabric.width, fabric.height);

		fabric.edge(
			[ { border: 0, width: 1, color: 'black' } ],
			this, 'pathFrowny', View.proper, m.add(0, -100)
		);

		fabric.setFont({
			size   :  40,
			family :  theme.defaultFont,
			fill   : 'black',
			align  : 'center',
			base   : 'middle'
		});
		fabric.fillText(this.green, m);

		fabric.setFont({
			size   :  24,
			family :  theme.defaultFont,
			fill   : 'black',
			align  : 'center',
			base   : 'middle'
		});

		fabric.fillText('Please refresh the page to reconnect.', m.x, m.y + 100);
		return;
	}

	// remove caret cache.
	this.caret.$save = null;
	this.caret.$screenPos = null;

	if (this.$space) { this.$space.draw(); }
	this.dash.draw();
	if (this.menu) { this.menu.draw(View.proper); }

	this.caret.display();

	this.redraw = false;
};

/**
| A mouse click.
*/
Shell.prototype.click = function(p, shift, ctrl) {
	if (this.green) { return; }

	// TODO dashboard

	if (this.$space) { this.$space.click(p, shift, ctrl); }
	if (this.redraw) { this._draw(); }
};

/**
| Mouse hover.
*/
Shell.prototype.mousehover = function(p, shift, ctrl) {
	if (this.green) { return; }

	this.$hoverP     = p;
	this.$hoverShift = shift;
	this.$hoverCtrl  = ctrl;

	var cursor = null;

	if (this.menu)
		{ cursor = this.menu.mousehover(View.proper, p, shift, ctrl); }


	if (cursor)
		{ this.dash.mousehover(null, shift, ctrl); }
	else
		{ cursor = this.dash.mousehover(p, shift, ctrl); }

	if (this.$space) {
		if (cursor)
			{ this.$space.mousehover(null, shift, ctrl); }
		else
			{ cursor = this.$space.mousehover(p, shift, ctrl); }
	}

	if (this.redraw) { this._draw(); }
	
	return cursor;
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

	var mouseState = null;

	if (this.menu)
		{ mouseState = this.menu.mousedown(View.proper, p, shift, ctrl); }

	if (mouseState === null)
		{ mouseState = this.dash.mousedown(p, shift, ctrl); }

	if (mouseState === null && this.$space)
		{ mouseState = this.$space.mousedown(p, shift, ctrl); }

	if (this.redraw) { this._draw(); }

	return mouseState || false;
};

/**
| Starts an operation with the mouse button held down.
*/
Shell.prototype.dragstart = function(p, shift, ctrl) {
	if (this.green)
		{ return; }

	var cursor = this.dash.dragstart(p, shift, ctrl);

	if (cursor === null && this.$space)
		{ cursor = this.$space.dragstart(p, shift, ctrl); }

	if (this.redraw)
		{ this._draw(); }

	return cursor;
};

/**
| Moving during an operation with the mouse button held down.
*/
Shell.prototype.dragmove = function(p, shift, ctrl) {
	if (this.green)
		{ return; }

	var $action = this.$action;

	if (!$action)
		{ throw new Error('no action on dragmove'); }

	var cursor = null;

	switch ($action.visec) {
	case 'dash' :
		cursor = this.dash.actionmove(p, shift, ctrl);
		break;
	case 'space' :
		if (this.$space)
			{ cursor = this.$space.actionmove(p, shift, ctrl); }
		break;
	}

	if (this.redraw)
		{ this._draw(); }

	return cursor;
};

/**
| Stops an operation with the mouse button held down.
*/
Shell.prototype.dragstop = function(p, shift, ctrl) {
	if (this.green)
		{ return; }

	var $action = this.$action;

	if (!$action)
		{ throw new Error('no action on dragstop'); }

	switch($action.visec) {
	case 'dash' :
		this.dash.actionstop(p, shift, ctrl);
		break;
	case 'space' :
		if (this.$space)
			{ this.$space.actionstop(p, shift, ctrl); }
		break;
	default :
		throw new Error('unknown $action.visec');
	}

	if (this.redraw)
		{ this._draw(); }
};

/**
| Mouse wheel has turned
*/
Shell.prototype.mousewheel = function(p, dir, shift, ctrl) {
	if (this.green)
		{ return; }

	// dashboard?

	if (this.$space)
		{ this.$space.mousewheel(p, dir, shift, ctrl); }

	if (this.redraw)
		{ this._draw(); }
};


/**
| User pressed a special key.
*/
Shell.prototype.specialKey = function(key, shift, ctrl) {
	if (this.green)
		{ return; }

	var caret  = this.caret;
	switch (caret.visec) {
	case 'dash' :
		this.dash.specialKey(key, shift, ctrl);
		break;
	case null    :
	case 'space' :
		if (!this.$space) break;
		this. $space.specialKey(key, shift, ctrl);
		break;
	default : throw new Error('invalid visec');
	}

	if (this.redraw)
		{ this._draw(); }
};

/**
| User entered normal text (one character or more).
*/
Shell.prototype.input = function(text) {
	if (this.green)
		{ return; }

	if (this.selection.active) { this.selection.remove(); }

	var caret  = this.caret;
	switch (caret.visec) {
	case null : break;
	case 'dash'  : this.dash.input(text);    break;
	case 'space' : this. $space.input(text); break;
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
	this.$user = user;
	this.dash.setUser(user);
	this.peer.setUser(user, pass);

	if (user.substr(0, 5) !== 'visit') {
		window.localStorage.setItem('user', user);
		window.localStorage.setItem('pass', pass);
	} else {
		if (this.$space &&
			(this.$space.key !== 'welcome' && this.$space.key !== 'sandbox')
		) {
			this.moveToSpace('welcome');
		}
		window.localStorage.setItem('user', null);
		window.localStorage.setItem('pass', null);
	}
};


/**
| Sets the space zoom factor.
*/
Shell.prototype.setSpaceZoom = function(zf) {
	this.dash.setSpaceZoom(zf);
};

/**
| Changes the space zoom factor (around center)
*/
Shell.prototype.changeSpaceZoom = function(df) {
	if (!this.$space) { return; }
	this.$space.changeZoom(df);
};

/**
| Called when loading the website
*/
Shell.prototype.onload = function() {
	this.peer = new Peer(this, this);
	var self = this;

	var user = window.localStorage.getItem('user');
	var pass = null;
	if (user) {
		pass = window.localStorage.getItem('pass');
	} else {
		user = 'visitor';
	}

	this.peer.auth(user, pass, function(res) {
		self.onLoadAuth(user, res);
	});
};

/**
| Moves to space named 'spaceName'.
| if spaceName is null, reloads current space.
*/
Shell.prototype.moveToSpace = function(name) {
	var self = this;
	if (this.caret.visec === 'space') {
		this.setCaret(null, null);
	}

	if (name === null) {
		name = self.$space.key;
		if (this.$user.substr(0, 5) === 'visit' &&
			(name !== 'welcome' && name !== 'help')
		) { name = 'welcome'; }
	} else {
		self.dash.message('Moving to "' + name + '" ...');
	}

	self.dash.setCurSpace('', '');
	this.peer.aquireSpace(name, function(err, val) {
		if (err !== null) {
			self.greenscreen('Cannot aquire space: ' + err.message);
			return;
		}

		if (val.name !== name)
			{ throw new Error('server served wrong space!'); }

		var tree = val.tree;
		self.$space = new Space(
			tree.root.copse[name],
			new Path([name]),
			val.access
		);
		self.dash.setCurSpace(name, val.access);
		self.dash.setSpaceZoom(0);
		self._draw();
	});
};

/**
| Answer to on loading authentication
*/
Shell.prototype.onLoadAuth = function(user, res) {
	var self = this;

	if (!res.ok) {
		// when log in with a real user failed
		// takes a visitor instead
		if (user !== 'visitor') {
			this.peer.auth('visitor', null, function(res) {
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
	if (!this.$space) { self.moveToSpace('welcome'); }
};


})();
