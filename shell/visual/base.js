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
var is = Jools.is;

/**
| Constructor
*/
var Base = Visual.Base = function(twig, path) {
	this.twig = twig;
	this.path = path;         // TODO
	this.key  = path.get(-1); // TODO
	this.$sub = null;
};

/**
| Returns the visual with a given twig-rank.
*/
Base.prototype.atRank = function(rank) {
	return this.$sub[this.twig.ranks[rank]];
};



/**
| Updates the $sub to match a new twig.
*/
/* TODO
Base.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var doc = this.$sub.doc;
	if (doc.twig !== twig.doc) {
		doc.update(twig.doc);
	}
};*/

})();
