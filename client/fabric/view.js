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

                                         ,.   ,.
                                         `|  / . ,-. . , ,
                                          | /  | |-' |/|/
                                          `'   ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A view on a space determines the current pan, zooming and a possible ongoing pan/zooming motion.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Point;

/**
| Import/Exports
*/
var View = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug        = Jools.debug;
var immute       = Jools.immute;
var log          = Jools.log;
var ro           = Math.round;

/**
| Constructor.
*/
View = function(pan, zoom) {
	this.pan  = pan;
	this.zoom = 0.5;
	immute(this);
};

View.proper = new View(Point.zero, 1);

/**
| Returns the x value for a point for this view.
*/
View.prototype.x = function(p) {
	if (!(p instanceof Point)) { throw new Error('p is no Point'); }
	return ro((p.x + this.pan.x) * this.zoom);
};

/**
| Returns the y value for a point for this view.
*/
View.prototype.y = function(p) {
	if (!(p instanceof Point)) { throw new Error('p is no Point'); }
	return ro((p.y + this.pan.y) * this.zoom);
};

})();
