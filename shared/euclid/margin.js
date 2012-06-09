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

                                  ,-,-,-.
                                  `,| | |   ,-. ,-. ,-. . ,-.
                                    | ; | . ,-| |   | | | | |
                                    '   `-' `-^ '   `-| ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                     `'
 Holds information of inner or outer distances.
 Margins are immutable objects.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;

/**
| Exports
*/
var Margin  = null;

/**
| Capsule
*/
(function(){
'use strict';

/**
| Node imports
*/
if (typeof(window) === 'undefined') {
	Jools = require('../jools');
}


var debug        = Jools.debug;
var immute       = Jools.immute;
var is           = Jools.is;
var isnon        = Jools.isnon;
var log          = Jools.log;
var fixate       = Jools.fixate;
var lazyFixate   = Jools.lazyFixate;

/**
| Constructor.
|
| Margin(n, e, s, w)
|
| n: master or north margin
| e: east margin
| s: south margin
| w: west margin
*/
Margin = function(m, e, s, w) {
	if (typeof(m) === 'object') {
		this.n = m.n;
		this.e = m.e;
		this.s = m.s;
		this.w = m.w;
	} else {
		this.n = m;
		this.e = e;
		this.s = s;
		this.w = w;
	}
	immute(this);
};

/**
| A margin with all distances 0.
*/
Margin.zero = new Margin(0, 0, 0, 0);

/**
| Returns a json object for this margin
*/
Margin.prototype.toJSON = function() {
	return this._json || (this._json = { n: this.n, e: this.e, s: this.s, w: this.w });
};

/**
| East + west margin = x
*/
lazyFixate(Margin.prototype, 'x', function() { return this.e + this.w; });

/**
| North + south margin = y
*/
lazyFixate(Margin.prototype, 'y', function() { return this.n + this.s; });

/**
| Node export
*/
if (typeof(window) === 'undefined') {
	module.exports = Margin;
}

})();
