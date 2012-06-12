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
var Fabric;
var HelpBoard;
var Jools;
var MainBoard;
var Path;
var Point;
var shell;
var system;
var theme;
var Tree;
var View;

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
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var subclass      = Jools.subclass;

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
	this.curBoardName = 'MainBoard';
	this.boards = {
		MainBoard  : null,
		LoginBoard : null,
		RegBoard   : null,
		HelpBoard  : null
	};

	this.$curSpace = null;
	this.$showHelp = false;
	this.$autoHelp = true;
};

Cockpit.styles = {
	boxes       : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	cockpit     : theme.cockpit.style,
	help        : theme.cockpit.help,
	button      : theme.cockpit.button,
	buttonHover : theme.cockpit.buttonHover,
	buttonFocus : theme.cockpit.buttonFocus,
	buttonHofoc : theme.cockpit.buttonHofoc,
	chat        : theme.cockpit.chat,
	highlight   : theme.cockpit.highlight,
	input       : theme.cockpit.input,
	inputFocus  : theme.cockpit.inputFocus,
	sides       : theme.cockpit.sides,
	zero        : theme.cockpit.zero,
	zhighlight  : theme.cockpit.zhighlight
};

/**
| Sends a message over the MainBoard.
*/
Cockpit.prototype.message = function(message) {
	this.getBoard('MainBoard').cc.chat.addMessage(message);
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
	{ return cboard; }
	
	var Proto;
	switch(name) {
	case 'MainBoard' : Proto = MainBoard; break;
	case 'HelpBoard' : Proto = HelpBoard; break;
	default          : Proto = CBoard;    break;
	}

	var board = new Proto(
		name,
		cboard,
		this,
		new Point(fabric.width, fabric.height)
	);

	return this.boards[name] = board;
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
Cockpit.prototype.setCurSpace = function(space, access) {
	this.$curSpace = space;
	this.$access   = access;
	this.getBoard('MainBoard').setCurSpace(space, access);
	if (space === 'sandbox' && this.$autoHelp) {
		this.$autoHelp = false;
		this.setShowHelp(true);
	}
};

/**
| Sets the user greeted on the mainboard.
*/
Cockpit.prototype.setUser = function(userName) {
	this.$amVisitor = userName.substring(0,5) === 'visit';
	var mainboard = this.getBoard('MainBoard');
	mainboard.setUser(userName);

	var leftB = mainboard.cc.leftB;
	leftB.$captionText = this.$amVisitor ? 'log in' : 'log out';
	leftB.poke();

	var left2B = mainboard.cc.left2B;
	left2B.$visible = this.$amVisitor;
	left2B.poke();
};

/**
| Sets the zoom level for the current space shown on the mainboard.
*/
Cockpit.prototype.setSpaceZoom = function(zf) {
	this.getBoard('MainBoard').setSpaceZoom(zf);
};

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	if (this.$showHelp) {
		var helpboard = this.getBoard('HelpBoard');
		helpboard.setAccess(this.$access);
		helpboard.draw(this.fabric);
	}
	this.curBoard().draw(this.fabric);
};

/**
| Force clears all caches.
*/
Cockpit.prototype.knock = function() {
	for (var b in this.boards) {
		var bo = this.boards[b];
		if (bo) { bo.knock(); }
	}
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
	this.curBoard().drawCaret(View.proper);
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
	var cursor = this.curBoard().mousehover(p, shift, ctrl);
	
	if (this.$showHelp) {
		if (cursor) {
			this.getBoard('HelpBoard').mousehover(null, shift, ctrl);
		} else {
			cursor = this.getBoard('HelpBoard').mousehover(p, shift, ctrl);
		}
	}

	return cursor;
};

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p, shift, ctrl) {
	var r;
	if (this.$showHelp) {
		r = this.getBoard('HelpBoard').mousedown(p, shift. ctrl);
		if (r !== null) return r;
	}

	r = this.curBoard().mousedown(p, shift. ctrl);
	if (r === null) { return null; }
	this.curBoard().mousehover(p, shift, ctrl);
	return r;
};

/**
| Returns an entity by its path
*/
Cockpit.prototype.getEntity = function(path) {
	var board = this.getBoard(path.get(0));
	return board.cc[path.get(1)];
};

/**
| Shows or hides the help board
*/
Cockpit.prototype.setShowHelp = function(showHelp) {
	if (this.$showHelp === showHelp) { return; }
	this.$showHelp = showHelp;

	this.getBoard('MainBoard').setShowHelp(showHelp);
	shell.redraw = true;
};

})();
