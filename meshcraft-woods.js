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

var log      = jools.log;
var clone    = jools.clone;
var subclass = jools.subclass;

function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ TreeGeneric ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a node tree (repository)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function TreeGeneric(master) {
	this.nodes = master ? clone(master) : {};
}

/**
| Returns the subnode path points at.
*/
TreeGeneric.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var node = this.nodes;
	for (var si = s0; si < sl; si++) {
		if (!isnon(node)) throw new Error('signature points nowhere');
		node = node[sign.arc(si)];
	}
	return is(node) ? node : null;
}

/**
| Sets the value of a node.
*/
TreeGeneric.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);

	var si;
	var node = this.nodes;
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
	return new TreeGeneric(this.nodes);
}

///*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ++ Nexus ++
//~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// the root of spaces
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//function Nexus(master) {
//	this.nodes = {};
//	if (master) {
//		for (k in master.nodes) this.nodes[k] = new Space(master.nodes[k]);
//	}
//}
//
///**
//| Returns the subnode path points at.
//*/
//Nexus.prototype.get = function(sign, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//
//	log('debug', 'this.nodes', this.nodes);
//	log('debug', 'sign.arc(s0)', sign.arc(s0));
//	var node = this.nodes[sign.arc(s0)];
//	if (s0 + 1 === sl) return node;
//	if (!node) throw new Error('Signature points nowhere');
//	return node.get(sign, s0 + 1, sl);
//}
//
///**
//| Sets the value of a node.
//*/
//Nexus.prototype.set = function(sign, val, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//
//	if (s0 + 1 === sl) {
//		this.nodes[sign.arc(s0)] = new Space(val);
//		log('debug', 'set0 after', this.nodes);
//	} else {
//		var node = this.nodes[sign.arg(s0)];
//		if (!node) throw new Error('signature points nowhere');
//		node.set(sign, val, s0 + 1, sl);
//		log('debug', 'set1 after', this.nodes);
//	}
//}
//
//Nexus.prototype.toJSON = function() {
//	return JSON.stringify(this.spaces);
//}
//
///**
//| Clones the Nexus
//*/
//Nexus.prototype.clone = function() {
//	return new Nexus(this.nodes);
//}
//
///*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ++ Space ++
//~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// a space
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//function Space(master) {
//	if (master.type !== 'space') throw new Error('Space does not have correct type: '+master.type);
//	for (var k in master) {
//		if (!master.hasOwnProperty(k)) continue;
//		switch (k) {
//		case 'items':
//		case 'type' :
//		case 'z':
//			break;
//		default :
//			throw new Error('Space has unknown key:'+k);
//		}
//	}
//	this.type  = 'space';
//	this.items = {};
//	if (master) {
//		this.z = clone(master.z);
//		for (var k in master.items) {
//			//this.items[k] = new Note(master.items[k]);
//			this.items[k] = new Note(master.items[k]);
//		}
//	} else {
//		this.z = [];
//	}
//}
//
///**
//| Returns the subnode path points at.
//*/
//Space.prototype.get = function(sign, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//	var s0a = sign.arc(s0);
//	switch (s0a) {
//	case 'items':
//		if (s0 + 1 === sl) return this.items;
//		var node = this.items[sign.arc(s0 + 1)];
//		if (s0 + 2 === sl) return node;
//		if (!node) throw new Error('Signature points nowhere');
//		log('debug', 'subgetting', node);
//		return node.get(sign, s0 + 2, sl);
//	case 'z' :
//		if (s0 + 1 === sl) return this.z;
//		if (s0 + 2 !== sl) throw new Error('space.z[] has no further children');
//		return this.z[sign.arc(s0 + 1)];
//		if (!node) throw new Error('Signature points nowhere');
//	default:
//		throw new Error('Unknown arc to space: '+s0a);
//	}
//}
//
///**
//| Sets the value of a node.
//*/
//Space.prototype.set = function(sign, val, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//	var s0a = sign.arc(s0);
//	if (s0 + 1 === sl) throw new Error('Cannot set space['+sign.arg(s0)+'] directly');
//	if (s0 + 2 === sl) {
//		switch (s0a) {
//		case 'items' :
//			this.items[sign.arc(s0 + 1)] = new Note(val);
//			break;
//		case 'z' :
//			if (typeof(val) !== 'string' && typeof(val) !== 'number')
//				throw new Error('space.z[] must be item or string');
//			this.z[sign.arc(s0 + 1)] = val;
//			break;
//		default :
//			throw new Error('space.'+s0a+' invalid arc');
//		}
//	} else {
//		switch (s0a) {
//		case 'items' :
//			this.items[sign.arc(s0 + 1)].set(sign, val, s0 + 2, sl);
//			break;
//		case 'z' :
//			throw new Error('space.z[] has no further children');
//			break;
//		default :
//			throw new Error('space.'+s0a+' invalid arc');
//		}
//	}
//}
//
///**
//| Clones the tree
//*/
//Space.prototype.clone = function() {
//	return new Space(this);
//}
//
//
///*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ++ Note ++
//~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
// a note
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//function Note(master) {
//	TreeGeneric.call(this, master);
//}
//subclass(Note, TreeGeneric);


/**
| Export.
*/
woods = {
//	Nexus : Nexus,
//	Space : Space,
//	Note  : Note,
	TreeGeneric : TreeGeneric,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

