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

                               .---.             .  .  .
                               \___  ,-. ,-. ,-. |  |  |-. ,-. ,-.
                                   \ |   |   | | |  |  | | ,-| |
                               `---' `-' '   `-' `' `' ^-' `-^ '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A scrollbar.
 Currently there are only vertical scrollbars.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Scrollbar = null;
var VDoc      = null;
var VItem     = null;
var VNote     = null;
var VLabel    = null;
var VRelation = null;

/**
| Imports
*/
var Action;
var Caret;
var Fabric;
var Jools;
var MeshMashine;
var Path;
var Tree;
var peer;
var settings;
var shell;
var system;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shotcuts
*/
var R             = Math.round;
var cos30         = Fabric.cos30;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var limit         = Jools.limit;
var log           = Jools.log;
var max           = Math.max;
var min           = Math.min;
var subclass      = Jools.subclass;

/**
| Constructor.
*/
Scrollbar = function() {
	this.max      = null;
	this.visible  = false;
	this._pos     = 0;
	this.aperture = null; // the size of the bar
	this.zone     = null;
};

/**
| Makes the path for fabric.edge/fill/paint.
| @@ change descr on all path()s
| @@ make a tiny oval instead.
*/
Scrollbar.prototype.path = function(fabric, border, twist) {
	if (border !== 0)  throw new Error('Scrollbar.path does not support borders');
	if (!this.visible) throw new Error('Pathing an invisible scrollbar');

	var z      = this.zone;
	var w      = z.width;
	var co30w2 = cos30 * w / 2;
	var w025   = R(w * 0.25);
	var w075   = R(w * 0.75);
	var size   = R(this.aperture * z.height / this.max);
	var msize  = max(size, theme.scrollbar.minSize);
	var sy     = z.pnw.y + R(this._pos * ((z.height - msize + size) / this.max));

	fabric.beginPath(twist);
	fabric.moveTo(z.pnw.x,        R(sy + co30w2));
	fabric.lineTo(z.pnw.x + w025, sy);
	fabric.lineTo(z.pnw.x + w075, sy);
	fabric.lineTo(z.pse.x,        R(sy + co30w2));

	fabric.lineTo(z.pse.x,        R(sy + msize - co30w2));
	fabric.lineTo(z.pnw.x + w075, sy + msize);
	fabric.lineTo(z.pnw.x + w025, sy + msize);
	fabric.lineTo(z.pnw.x,        R(sy + msize - co30w2));
	fabric.closePath();
};

/**
| Draws the scrollbar.
*/
Scrollbar.prototype.draw = function(fabric) {
	fabric.paint(theme.scrollbar.style, this, 'path');
};

/**
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function() {
	if (!this.visible) return 0;
	return this._pos;
};

/**
| Sets the scrollbars position.
*/
Scrollbar.prototype.setPos = function(pos) {
	if (pos < 0) throw new Error('Scrollbar.setPos < 0');
	return this._pos = pos;
};

})();
