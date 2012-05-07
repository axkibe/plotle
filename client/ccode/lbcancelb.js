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

                      ,   ,-,---.  ,--.                 .  ,-,---.
                      )    '|___/ | `-' ,-. ,-. ,-. ,-. |   '|___/
                     /     ,|   \ |   . ,-| | | |   |-' |   ,|   \
                     `--' `-^---' `--'  `-^ ' ' `-' `-' `' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 loginboard, cancel button
 cancel

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
| Constructor
*/
var LBCancelB = CCode.LBCancelB = function(twig, board, inherit, name) {
	CCustom.call(this, twig, board, inherit, name);
};
subclass(LBCancelB, CCustom);

LBCancelB.prototype.canFocus = function() {
	return true;
};

LBCancelB.prototype.input = function(text) {
	this.board.cockpit.setCurBoard('MainBoard');
};

LBCancelB.prototype.specialKey = function(key) {
	switch (key) {
	case 'down' : this.board.cycleFocus(+1); return;
	case 'up'   : this.board.cycleFocus(-1); return;
	}
	if (this.board.name == 'RegBoard'  ) { Util.clearRegister(this.board); }
	if (this.board.name == 'LoginBoard') { Util.clearLogin   (this.board); }
	this.board.cockpit.setCurBoard('MainBoard');
};

LBCancelB.prototype.mousedown = function(p, shift, ctrl) {
	var r = CCustom.prototype.mousedown.call(this, p, shift, ctrl);
	if (!r) return r;

	//if (this.board.name == 'RegBoard') { Util.clearRegister(this.board); }
	this.board.cockpit.setCurBoard('MainBoard');
	
	shell.redraw = true;
	return true;
};

})();
