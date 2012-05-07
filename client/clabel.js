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

                                   ,--.  ,       .       .
                                  | `-'  )   ,-. |-. ,-. |
                                  |   . /    ,-| | | |-' |
                                  `--'  `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A label on the cockpit.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Curve;
var Jools;
var Fabric;

/**
| Exports
*/
var CLabel = null;

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

var computePoint  = Curve.computePoint;
var Point         = Fabric.Point;

/**
| Constructor.
*/
CLabel = function(twig, board, inherit, name) {
	this.name    = name;
	this.twig    = twig;
	this.board   = board;
	this.pos     = computePoint(twig.pos, board.iframe);
	// if not null, overrides the design text
	// @@ rename $text
	this.text    = inherit ? inherit.text : null;
};

/**
| Labels cannot focus.
*/
CLabel.prototype.canFocus = function() {
	return false;
};

/**
| Draws the label on the fabric.
*/
CLabel.prototype.draw = function(fabric) {
	var fs = this.twig.fontStyle;
	fabric.fontStyle(fs.style, fs.fill, fs.align, fs.base);
	fabric.fillText(this.text || this.twig.text, this.pos);
};

CLabel.prototype.poke = function() {
	this.board.poke();
};

/**
| Mouse hover
*/
CLabel.prototype.mousehover = function(p, shift, ctrl) {
	return false;
};

/**
| Mouse down
*/
CLabel.prototype.mousedown = function(p, shift, ctrl) {
	return null;
};

})();
