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
var max      = Math.max;
var min      = Math.min;
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
	var ths = theme.scrollbar;

	var z      = this._$zone;
	var w      = z.width;
	var size   = ro(this._$aperture * z.height / this._$max);
	var msize  = max(size, ths.minSize);
	var sy     = z.pnw.y + ro(this._$pos * ((z.height - msize + size) / this._$max));
	var pwx    = z.pnw.x;
	var pex    = z.pse.x;

	var bezirect = new BeziRect(
		new Point(pwx, sy),
		new Point(pex, sy + msize),
		ths.ovala, ths.ovalb
	);
	
	fabric.paint(theme.scrollbar.style, bezirect, 'path', view);
};

/**
| Returns the scrollbars position.
*/
Scrollbar.prototype.getPos = function() {
	if (!this.visible) return 0;
	return this._$pos;
};

/**
| Sets the scrollbars position.
*/
Scrollbar.prototype.setPos = function(pos, aperture, max) {
	pos = limit(0, pos, max - aperture);
	if (pos < 0) throw new Error('Scrollbar.setPos < 0');
	this._$pos      = pos;
	this._$aperture = aperture;
	this._$max      = max;
};

/**
| Sets the scrollbars zone.
|
| setZone(rect)           -or-
| setZone(pnw, pse)       -or-
| setZone(wx, ny, ex. sy)
*/
Scrollbar.prototype.setZone = function(a1, a2, a3, a4) {
	if (a1 instanceof Rect) {
		this._$zone = a1;
		return;
	}

	var tz = this._$zone;

	if (a1 instanceof Point) {
		if (tz && tz.pnw.eq(a1) && tz.pse.eq(a2)) { return; }
		this._$zone = new Rect(a1, a2);
		return;
	}

	this._$zone = new Rect(
		Point.renew(a1, a2, tz && tz.pnw),
		Point.renew(a3, a3, tz && tz.pse)
	);
};

/**
| Returns true if p is within the scrollbar.
*/
Scrollbar.prototype.within = function(p) {
	if (!this.visible) { return false; }
	return this._$zone.within(p);
};

/**
| Returns the value of pos change for d pixels in the current zone.
*/
Scrollbar.prototype.scale = function(d) {
	return this._$max / this._$zone.height * d;
};

})();
