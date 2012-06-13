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


                 ,-,-,-.   ,-,---. ,-_/               ,-,-.       .  .  ,-,---.
                 `,| | |    '|___/   /  ,-. ,-. ,-,-. ` | |   . . |  |   '|___/
                   | ; | .  ,|   \  /   | | | | | | |   | |-. | | |  |   ,|   \
                   '   `-' `-^---' /--, `-' `-' ' ' '  ,' `-' `-^ `' `' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Zoom Null Button on Mainboard.

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
var MBZoomNullB = CCode.MBZoomNullB = function(twig, board, inherit, name) {
	CCustom.call(this, twig, board, inherit, name);
};
subclass(MBZoomNullB, CCustom);

MBZoomNullB.prototype.mousedown = function(p, shift, ctrl) {
	var r = CCustom.prototype.mousedown.call(this, p, shift, ctrl);
	if (!r) { return r; }
	shell.changeSpaceZoom(0);
	return true;
};

})();
