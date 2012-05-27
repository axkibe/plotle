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

                         ,   ,-,---.  ,                 ,-,---.
                         )    '|___/  )   ,-. ,-. . ,-.  '|___/
                        /     ,|   \ /    | | | | | | |  ,|   \
                        `--' `-^---' `--' `-' `-| ' ' ' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                               `'
 Login Button on login board.
 log in

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CCode;
var CCustom;
var Jools;
var shell;

/**
| Exports
*/
var CMeth = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var log      = Jools.log;
var subclass = Jools.subclass;
var Util     = CCode.Util;

/**
| The container.
*/
CMeth = {
	LoginBoard : {},
	MainBoard  : {},
	RegBoard   : {}
};

/**
| Constructor
*/
var LBLoginB = CCode.LBLoginB = function(twig, board, inherit, name) {
	CCustom.call(this, twig, board, inherit, name);
};

subclass(LBLoginB, CCustom);

LBLoginB.prototype.canFocus = function() {
	return true;
};

LBLoginB.prototype.specialKey = function(key) {
	switch (key) {
	case 'down'  : this.board.cycleFocus(+1);    return;
	case 'up'    : this.board.cycleFocus(-1);    return;
	case 'enter' : Util.login(this.board); return;
	}
};
	
LBLoginB.prototype.input = function(text) {
	Util.login(this.board);
	shell.redraw = true;
	return true;
};

LBLoginB.prototype.mousedown = function(p, shift, ctrl) {
	var r = CCustom.prototype.mousedown.call(this, p, shift, ctrl);
	if (!r) return r;

	Util.login(this.board);
	
	shell.redraw = true;
	return true;
};

})();
