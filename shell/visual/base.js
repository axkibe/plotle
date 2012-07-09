/**                                               .---.
.----.     .----..--.                             |   |
 \    \   /    / |__|                             |   |
  '   '. /'   /  .--.                             |   |
  |    |'    /   |  |                       __    |   |
  |    ||    |   |  |     _     _    _   .:--.'.  |   |
  '.   `'   .'   |  |   .' |   | '  / | / |   \ | |   |
   \        /    |  |  .   | /.' | .' | `" __ | | |   |
    \      /     |__|.'.'| |///  | /  |  .'.''| | |   |
     '----'        .'.'.-'  /|   `'.  | / /   | |_'---'
                   .'   \_.' '   .'|  '/\ \._,\ '/
                              `-'  `--'  `--'  `"
                     ,-,---.
                      '|___/ ,-. ,-. ,-.
                      ,|   \ ,-| `-. |-'
                     `-^---' `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of all visual objects

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Visual;
Visual = Visual || {};

/**
| Imports
*/
var Jools;

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
Visual.Base = function(twig, path) {
	this.twig        = twig;
	this.path        = path;         // TODO
	this.key         = path.get(-1); // TODO
	this.$graph      = null;
};

/**
| Returns the visual with a given twig-rank.
*/
Visual.Base.prototype.atRank = function(rank) {
	return this.$graph[this.twig.ranks[rank]];
};


/**
| Updates the $graph to match a new twig.
*/
/* TODO
Base.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var doc = this.$graph.doc;
	if (doc.twig !== twig.doc) {
		doc.update(twig.doc);
	}
};*/

})();
