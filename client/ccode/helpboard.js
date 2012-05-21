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

                             ,-_/,.     .      ,-,---.               .
                             ' |_|/ ,-. |  ,-.  '|___/ ,-. ,-. ,-. ,-|
                              /| |  |-' |  | |  ,|   \ | | ,-| |   | |
                              `' `' `-' `' |-' `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                           '
 the helpboard

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CBoard;
var config;
var Fabric;
var Jools;
var theme;

/**
| Exports
*/
var HelpBoard = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug    = Jools.debug;
var half     = Fabric.half;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var subclass = Jools.subclass;
var Point    = Fabric.Point;

/**
| Constructor
*/
HelpBoard = function(name, inherit, cockpit, screensize) {
	CBoard.call(this, name, inherit, cockpit, screensize);
	this.$access = inherit ? inherit.$access : 'rw';
};
subclass(HelpBoard, CBoard);

HelpBoard.prototype.setAccess = function(access) {
	if (this.$access === access) { return; }
	this.$access = access;
};


})();
