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

                                    ,.   ,.             .
                                    `|  / . ,-. . . ,-. |
                                     | /  | `-. | | ,-| |
                                     `'   ' `-' `-^ `-^ `
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of all visual objects

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Visual = null;

/**
| Imports
*/
var Action;
var Compass;
var Doc;
var Fabric;
var Jools;
var OvalSlice;
var Path;
var Rect;
var Relation;
var shell;
var system;
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
var abs    = Math.abs;
var debug  = Jools.debug;
var immute = Jools.immute;
var is     = Jools.is;
var isnon  = Jools.isnon;
var half   = Jools.half;
var ro     = Math.round;

/**
| Constructor
*/
Visual = function(twig, path) {
	this.twig        = twig;
	this.path        = path;         // TODO
	this.key         = path.get(-1); // TODO
	this.$graph      = null;
};

/**
| Returns the visual with a given twig-rank.
*/
Visual.prototype.atRank = function(rank) {
	return this.$graph[this.twig.ranks[rank]];
};


/**
| Updates the $graph to match a new twig.
*/
/* TODO
Visual.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var doc = this.$graph.doc;
	if (doc.twig !== twig.doc) {
		doc.update(twig.doc);
	}
};*/

})();
