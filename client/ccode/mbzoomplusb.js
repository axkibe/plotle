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

               ,-,-,-.   ,-,---. ,-_/              .-,--. .          ,-,---. 
               `,| | |    '|___/   /  ,-. ,-. ,-,-. '|__/ |  . . ,-.  '|___/ 
                 | ; | .  ,|   \  /   | | | | | | | ,|    |  | | `-.  ,|   \ 
                 '   `-' `-^---' /--, `-' `-' ' ' ' `'    `' `-^ `-' `-^---' 
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Zoom Plus Button on Mainboard.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CCustom;
var Jools;
var shell;

/**
| Exports
*/
var CCode;

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
var isArray       = Jools.isArray;
var log           = Jools.log;
var subclass      = Jools.subclass;

/**
| Constructor
*/
var MBZoomPlusB = CCode.MBZoomPlusB = function(twig, board, inherit, name) {
	CCustom.call(this, twig, board, inherit, name);
};
subclass(MBZoomPlusB, CCustom);

MBZoomPlusB.prototype.mousedown = function(p, shift, ctrl) {
	/*
	var r = CCustom.prototype.mousedown.call(this, p, shift, ctrl);
	if (!r) return r;

	switch (this.$captionText) {
	case 'log in'  : this.board.cockpit.setCurBoard('LoginBoard'); break;
	case 'log out' : CCode.Util.logout(this.board); break;
	default : throw new Error('unknown state of leftB');
	}
	
	shell.redraw = true;
	return true;
	*/
};

})();
