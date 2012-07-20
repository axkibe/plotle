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

                                      ,--.
                                      | `-' . . ,-. .  , ,-.
                                      |   . | | |   | /  |-'
                                      `--'  `-^ '   `'   `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A bezier curve.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Euclid;

/**
| Exports
*/
var Curve = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var half          = Jools.half;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;


/**
| Constructor.
*/
Curve = function(twig, frame) {
	var data = this.data = [];

	if (twig.copse[twig.ranks[0]].type !== 'MoveTo') {
		throw new Error('Curve does not begin with MoveTo');
	}

	for(var a = 0, aZ = twig.length; a < aZ; a++) {
		var ct = twig.copse[twig.ranks[a]];
		data.push({
			to   : Curve.computePoint(ct.to, frame),
			twig : ct
		});
	}
};

/**
| Computes a point by its anchor
*/
Curve.computePoint = function(model, frame) {
	var p;
	var pnw = frame.pnw;
	var pse = frame.pse;

	switch (model.anchor) {
	// @@ make this part of frame logic
	case 'c'  :
		return new Euclid.Point(
			half(pnw.x + pse.x) + model.x,
			half(pnw.y + pse.y) + model.y
		);
	case 'n'  :
		return new Euclid.Point(
			half(pnw.x + pse.x) + model.x,
			pnw.y + model.y
		);
	case 'ne' :
		return new Euclid.Point(
			pse.x + model.x,
			pnw.y + model.y
		);
	case 'e'  :
		return new Euclid.Point(
			pse.x + model.x,
			half(pnw.y + pse.y) + model.y
		);
	case 'se' :
		return pse.add(model.x, model.y);
	case 's'  :
		return new Euclid.Point(
			half(pnw.x + pse.x) + model.x,
			pse.y + model.y
		);
	case 'sw' :
		return new Euclid.Point(
			pnw.x + model.x,
			pse.y + model.y
		);
	case 'w'  :
		return new Euclid.Point(
			pnw.x + model.y,
			half(pnw.y + pse.y) + model.y
		);
	case 'nw' :
		return pnw.add(model.x, model.y);
	}
};

/**
| Paths a curve in a fabric
*/
Curve.prototype.path = function(fabric, border, twist) {
	var data = this.data;
	var lbx = 0;
	var lby = 0;
	var bo = border;
	for(var a = 0, aZ = data.length; a < aZ; a++) {
		var c = data[a];
		var ct = c.twig;
		var to = c.to;
		var bx = ct.bx * bo;
		var by = ct.by * bo;
		switch(ct.type) {
		case 'MoveTo':
			fabric.moveTo(to.x + bx, to.y + by);
			break;
		case 'LineTo':
			fabric.lineTo(to.x + bx, to.y + by);
			break;
		case 'BeziTo':
			var tbx = to.x + bx;
			var tby = to.y + by;
			fabric.beziTo(
				ct.c1x + (tbx && tbx + lbx ? (tbx / (tbx + lbx)) : 0),
				ct.c1y + (tby && tby + lby ? (tby / (tby + lby)) : 0),

				ct.c2x + (tbx && tbx +  bx ? (tbx / (tbx + bx)) : 0),
				ct.c2y + (tby && tby +  by ? (tby / (tby + by)) : 0),

				tbx         , tby
			);
			break;
		default :
			throw new Error('invalid curve type: ' + ct.type);
		}
		lbx = bx;
		lby = by;
	}
};

})();
