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
Scrollbar.prototype.draw = function(fabric, pan) {
	if (!this.visible) throw new Error('Drawing an invisible scrollbar');
	var ths = theme.scrollbar;

	var z      = this._$zone;
	var w      = z.width;
	var size   = ro(this._$aperture * z.height / this._$max);
	var msize  = max(size, ths.minSize);
	var sy     = z.pnw.y + pan.y + ro(this._$pos * ((z.height - msize + size) / this._$max));
	var pwx    = z.pnw.x + pan.x;
	var pex    = z.pse.x + pan.x;

	var bezirect = new BeziRect(
		new Point(pwx, sy),
		new Point(pex, sy + msize),
		ths.ovala, ths.ovalb
	);
	
	fabric.paint(theme.scrollbar.style, bezirect, 'path', pan);
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
*/
Scrollbar.prototype.setZone = function(zone) {
	this._$zone = zone;
}

})();
