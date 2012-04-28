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
var CBoard;
var Curve;
var Design;
var Deverse;
var Fabric;
var Jools;
var Path;
var SwitchPanel;
var Tree;
var theme;
var system;
var shell;

/**
| Exports
*/
var Cockpit = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var half          = Fabric.half;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var subclass      = Jools.subclass;
var Point         = Fabric.Point;

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
	this.curBoardName = 'mainboard';
	this.boards = {
		mainboard  : null,
		loginboard : null,
		regboard   : null
	};

	// the switch panel
	this.switchpanel = new SwitchPanel();

	this._curSpace   = null;
	this._message    = null;
};

Cockpit.styles = {
	'boxes'       : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	'button'      : theme.cockpit.button,
	'buttonHover' : theme.cockpit.buttonHover,
	'buttonFocus' : theme.cockpit.buttonFocus,
	'buttonHofoc' : theme.cockpit.buttonHofoc,
	'highlight'   : theme.cockpit.highlight,
	'input'       : theme.cockpit.input,
	'inputfocus'  : theme.cockpit.inputfocus,
	'sides'       : theme.cockpit.sides,
	'zero'        : theme.cockpit.zero,
	'zhighlight'  : theme.cockpit.zhighlight
};

/**
| Sends a message over the mainboard.
*/
Cockpit.prototype.message = function(message) {
	this._message = message;
};


/**
| Returns the board by its name
*/
Cockpit.prototype.getBoard = function(name) {
	var fabric = this.fabric;
	var cboard = this.boards[name];
	if (!is(cboard)) { throw new Error('invalid curBoardName: ' + this.curBoardName); }

	if (cboard &&
		cboard.screensize.x === fabric.width &&
		cboard.screensize.y === fabric.height)
	{
		return cboard;
	} else {
		return this.boards[name] = new CBoard(
			name,
			cboard,
			this,
			new Point(fabric.width, fabric.height));
	}
};

/**
| Returns the current cockpit board
*/
Cockpit.prototype.curBoard = function() {
	return this.getBoard(this.curBoardName);
};

/**
| sets the current board
*/
Cockpit.prototype.setCurBoard = function(boardName) {
	var caret = shell.caret;
	if (caret.visec === 'cockpit' &&
		caret.sign &&
		caret.sign.path.get(0) === this.curBoardName)
	{
		caret = shell.setCaret(null, null);
	}

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
Cockpit.prototype.setUser = function(user) {
	this.$amVisitor = user.substring(0,5) === 'visit';
	var mainboard = this.getBoard('mainboard');
	var ulabel = mainboard.cc.username;
	ulabel.text = user;
	ulabel.poke();


	var leftBC = mainboard.cc.leftBC;
	leftBC.$captionText = this.$amVisitor ? 'login' : 'logout';
	leftBC.poke();

	var rightBC = mainboard.cc.rightBC;
	rightBC.$visible = this.$amVisitor;
	rightBC.poke();
};


/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var swidim = theme.switchpanel.dimensions;
	var pnw = new Point(half(this.fabric.width) - swidim.a, this.fabric.height - swidim.b - 59);
	this.fabric.drawImage(this.switchpanel.getFabric(), pnw);

	var cb = this.curBoard();
	this.fabric.drawImage(cb.getFabric(), cb.pnw);
};

/**
| Draws the caret.
*/
Cockpit.prototype.drawCaret = function() {
	var caret = shell.caret;
	if (caret.sign.path.get(0) !== this.curBoardName) {
		log('fail', 'Caret path(0) !== this.curBoardName');
		return;
	}
	this.curBoard().drawCaret();
};

/**
| Text input
*/
Cockpit.prototype.input = function(text) {
	this.curBoard().input(text);
};

/**
| User pressed a special key.
*/
Cockpit.prototype.specialKey = function(key, shift, ctrl) {
	this.curBoard().specialKey(key, shift, ctrl);
};

/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p, shift, ctrl) {
	return this.curBoard().mousehover(p, shift, ctrl);
};

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p, shift, ctrl) {
	var r = this.curBoard().mousedown(p, shift. ctrl);
	if (r === null) { return null; }
	this.curBoard().mousehover(p, shift, ctrl);
	return r;
};

Cockpit.prototype.getEntity = function(path) {
	var board = this.getBoard(path.get(0));
	return board.cc[path.get(1)];
};

})();
