/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var jools = require('./meshcraft-jools');

/**
| Exports
*/
var woods;

/**
| Capsule
*/
(function(){

var log   = jools.log;
var clone = jools.clone;

function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ TreeGeneric ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a node tree (repository)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function TreeGeneric(master) {
	this.tree = master ? clone(master.tree) : {};
}

/**
| Returns the subnode path points at.
*/
TreeGeneric.prototype.get = function(sign, s0, sl) {
	log('debug', 'generic.get', sign, s0, sl, 'this:', this);
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var node = this.tree;
	for (var si = s0; si < sl; si++) {
		if (!isnon(node)) throw new Error('signature points nowhere');
		node = node[sign.arc(si)];
	}
	return is(node) ? node : null;
}

/**
| Sets the value of a node.
|
| node:  the repo or part of
| path:  path to the value (relative to node)
| value: the new value to set
*/
TreeGeneric.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);

	var si;
	var node = this.tree;
	for(si = s0; si < sl - 1; si++) {
		if (!isnon(node)) throw new Error('signature points nowhere');
		node = node[sign.arc(si)];
	}
	node[sign.arc(si)] = clone(val);
}

/**
| Clones the tree
*/
TreeGeneric.prototype.clone = function() {
	return new TreeGeneric(this);
}


/**
| Export.
*/
woods = {
	TreeGeneric : TreeGeneric,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

