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
var Jools;
var Fabric;
var Path;
var Tree;
var Deverse;
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
var fixate        = Jools.fixate;
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
| Text input
*/
Cockpit.prototype.input = function(text) {
	this.curBoard().input(text);
}

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
