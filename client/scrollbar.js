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

/**
| Imports
*/
var BeziRect;
var Fabric;
var Jools;
var Point;
var Rect;
var theme;
var View;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shotcuts
*/
var debug    = Jools.debug;
var half     = Jools.half;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var limit    = Jools.limit;
var log      = Jools.log;
var ro       = Math.round;
var subclass = Jools.subclass;

/**
| Constructor.
*/
Scrollbar = function() {
	this.visible    = false;

	// position
	this._$pos      = 0;

	// maximum position
	this._$max      = null;

	// the size of the bar
	this._$aperture = null;

	this._$zone     = null;
};

/**
| Draws the scrollbar.
*/
Scrollbar.prototype.draw = function(fabric, view) {
	if (!this.visible) throw new Error('Drawing an invisible scrollbar');

	var ths  = theme.scrollbar;
	var pnw  = this._$pnw;
	var size = this._$size;
	var pos  = this._$pos;
	var max  = this._$max;

	var ap   = ro(this._$aperture * size / max);
	var map  = Math.max(ap, ths.minSize);
	var sy   = ro(pos * ((size - map + ap) / max));
	var s05  = half(ths.strength);

	var bezirect = new BeziRect(
		view.point(pnw.x, pnw.y + sy)      .add(-s05, 0),
		view.point(pnw.x, pnw.y + sy + map).add( s05, 0),
		ths.ovala, ths.ovalb
	);
	
	fabric.paint(theme.scrollbar.style, bezirect, 'path', View.proper);
};

/**
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function() {
	if (!this.visible) return 0;
	return this._$pos;
};

/**
| Sets the scrollbars position and location.
*/
Scrollbar.prototype.setPos = function(pos, aperture, max, pnw, size) {
	if (max - aperture >= 0) {
		pos = limit(0, pos, max - aperture);
	} else {
		pos = 0;
	}
	if (pos < 0) throw new Error('Scrollbar.setPos < 0');
	this._$pos      = pos;
	this._$aperture = aperture;
	this._$max      = max;
	this._$pnw      = pnw,
	this._$size     = size;
};

/**
| Returns true if p is within the scrollbar.
*/
Scrollbar.prototype.within = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	if (!this.visible) { return false; }

	var pnw = this._$pnw;
	var dp  = view.depoint(p);

	return (
		dp.x >= pnw.x &&
		dp.y >= pnw.y &&
		dp.x <= pnw.x + theme.scrollbar.strength &&
		dp.y <= pnw.y + this._$size
	);
};

/**
| Returns the value of pos change for d pixels in the current zone.
*/
Scrollbar.prototype.scale = function(d) {
	return d * this._$max / this._$size;
};

})();
