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

                                  ,--.         .         .
                                 | `-' ,-. ,-. | , ,-. . |-
                                 |   . | | |   |<  | | | |
                                 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                   '
 The unmoving interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CAccent;
var CCustom;
var CLabel;
var CInput;
var Curve;
var Design;
var Jools;
var Fabric;
var Path;
var Tree;
var Deverse;
var theme;
var system;
var shell;
var dbgNoCache;
var dbgBoxes;

/**
| Exports
*/
var Cockpit = null;
var CMethods = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


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

var computePoint  = Curve.computePoint;
var half          = Fabric.half;
var BeziRect      = Fabric.BeziRect;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.       .  .         .
 `,| | |   ,-. |- |-. ,-. ,-| ,-.
   | ; | . |-' |  | | | | | | `-.
   '   `-' `-' `' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

CMethods = {};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Mainboard:loginMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The side button on the mainboard.
 Switches to the loginboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMethods.loginMC = {};

CMethods.loginMC.mousedown = function(board, ele, p) {
	board.cockpit.setCurBoard('loginboard');
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Mainboard:registerMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The register button on the mainboard.
 Switches to the registerboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
CMethods.registerMC = {};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Loginboard:cancelBC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The cancel button on the loginboard.
 Switches back to the mainboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

CMethods.cancelBC = {};

CMethods.cancelBC.mousedown = function(board, ele, p) {
	board.cockpit.setCurBoard('mainboard');
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--. ,-,---.               .
 | `-'  '|___/ ,-. ,-. ,-. ,-|
 |   .  ,|   \ | | ,-| |   | |
 `--'  `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A cockpit board.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CBoard = function(design, inherit, cockpit, screensize) {
	this.cockpit = cockpit;
	var tree     = this.tree  = new Tree(design, Deverse);
	var frameD   = tree.root.frame;
	var oframe   = new Rect(Point.zero, screensize);
	var pnw      = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse      = this.pse    = computePoint(frameD.pse, oframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = new Curve(tree.root.curve, iframe);

	// TODO use point arithmetic
	this.gradientPC = new Point(half(iframe.width), iframe.height + 450);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.screensize = screensize;

	this.$hover = inherit ? inherit.$hover : null;
	this.$focus = inherit ? inherit.$focus : null;

	this.cc = {};
	var layout = tree.root.layout;
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var name = layout.ranks[a];
		var twig = layout.copse[name];
		this.cc[name] = this.newCC(twig, inherit && inherit.cc[name], name);
	}
};

/**
| Creates a new enhanced element.
*/
CBoard.prototype.newCC = function(twig, inherit, name) {
	switch(twig.type) {
	case 'Custom' : return new CCustom(twig, this, inherit, name);
	case 'Input'  : return new CInput (twig, this, inherit, name);
	case 'Label'  : return new CLabel (twig, this, inherit, name);
	default       : throw new Error('Invalid element type: ' + twig.type);
	}
};

/**
| Paths the boards frame
*/
CBoard.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Draws the mainboards contents
*/
CBoard.prototype.getFabric = function() {
	if (this.$fabric && !dbgNoCache) { return this.$fabric; }
	var iframe = this.iframe;
	var fabric = this.$fabric = new Fabric(iframe);

	fabric.paint(theme.cockpit.style, this, 'path');
	var layout = this.tree.root.layout;

	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var c = this.cc[cname];
		c.draw(fabric, CAccent.state(cname === this.$hover, cname === this.$focus));
	}

	if (dbgBoxes) {
		fabric.paint(Cockpit.styles.boxes,
			new Rect(iframe.pnw, iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
};

/**
| Returns true if point is on this mainboard
*/
CBoard.prototype.mousehover = function(p) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this.getFabric();
	var a, aZ;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		this.setHover(null);
		return false;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHover(null);
		return false;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousehover(this, pp)) { return true; }
	}
	system.setCursor('default');
	this.setHover(null);
	return true;
};

/**
| Returns true if point is on this mainboard
*/
CBoard.prototype.mousedown = function(p) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this.getFabric();
	var a, aZ;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		this.setHover(null);
		return null;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHover(null);
		return null;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousedown(this, pp)) { return false; }
	}
	system.setCursor('default');
	this.setHover(null);
	return false;
};

/**
| Sets the focused element.
*/
CBoard.prototype.setFocus = function(cname) {
	if (this.$focus === cname) { return; }

	this.$fabric = null;
	shell.redraw = true;
	if (this.$focus) { this.cc[this.$focus].$fabric = null; }
	if (cname      ) { this.cc[cname      ].$fabric = null; }
	this.$focus = cname;

	shell.setCaret('cockpit', null, cname);
};

/**
| Sets the hovered element.
*/
CBoard.prototype.setHover = function(cname) {
	if (this.$hover === cname) { return; }

	this.$fabric = null;
	shell.redraw = true;
	if (this.$hover) { this.cc[this.$hover].$fabric = null; }
	if (cname      ) { this.cc[cname      ].$fabric = null; }
	this.$hover = cname;
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   '
 The unmoving interface.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Cockpit = function() {
	this.fabric       = system.fabric;
	//this.curBoardName = 'mainboard';
	this.curBoardName = 'loginboard';
	this.boards = {
		mainboard  : null,
		loginboard : null
	};
	this._user       = null;
	this._curSpace   = null;
	this._message    = null;
};

Cockpit.styles = {
	'boxes'      : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	'button'     : theme.cockpit.button,
	'highlight'  : theme.cockpit.highlight,
	'input'      : theme.cockpit.input,
	'inputfocus' : theme.cockpit.inputfocus,
	'sides'      : theme.cockpit.sides,
	'zero'       : theme.cockpit.zero,
	'zhighlight' : theme.cockpit.zhighlight
};

/**
| Sends a message over the mainboard.
*/
Cockpit.prototype.message = function(message) {
	this._message = message;
};


/**
| Returns the current cockpit board
*/
Cockpit.prototype.curBoard = function() {
	var fabric = this.fabric;
	var cboard = this.boards[this.curBoardName];
	if (!is(cboard)) { throw new Error('invalid curBoardName: ' + this.curBoardName); }

	if (cboard &&
		cboard.screensize.x === fabric.width &&
		cboard.screensize.y === fabric.height)
	{
		return cboard;
	} else {
		return this.boards[this.curBoardName] = new CBoard(
			Design[this.curBoardName],
			cboard,
			this,
			new Point(fabric.width, fabric.height));
	}
};

/**
| sets the current board
*/
Cockpit.prototype.setCurBoard = function(boardName) {
	this.curBoardName = boardName;
	shell.redraw = true;
};

/**
| Sets the space name displayed on the mainboard.
*/
Cockpit.prototype.setCurSpace = function(curSpace) {
	// TODO
	this._curSpace = curSpace;
};

/**
| Sets the user greeted on the mainboard
*/
Cockpit.prototype.setUser = function(user, loggedIn) {
	// TODO
	this._user     = user;
	this._loggedIn = loggedIn;
};


/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var fabric    = this.fabric;
	var cb = this.curBoard(fabric);
	fabric.drawImage(cb.getFabric(), cb.pnw);
};


/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	return this.curBoard().mousehover(p);
};

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	var r = this.curBoard().mousedown(p);
	if (r === null) { return null; }
	this.curBoard().mousehover(p);
	return r;
};

})();
