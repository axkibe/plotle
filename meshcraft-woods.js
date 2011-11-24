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

var seeds = {
	'Generic'  : Generic,
	'Array'    : Sequence,
	'Sequence' : Sequence,
};

function sprout(master, generic) {
	switch(typeof(master)) {
	case 'string' : return master;
	case 'number' : return master;
	case 'object' :
		if (master instanceof String) return master;
		break;
	default: throw new Error('Cannot sprout unknown type: '+typeof(master));
	}

	// master is an object
	var creator = seeds[master.constructor.name];
	if (creator) return new creator(master);
	if (master.constructor !== Object)
		throw new Error('Cannot sprout unknown constructor: '+master.constructor.name);
	if (generic) return new Generic(master);
	creator = seeds[master.type];
	if (!creator) throw new Error('Cannot sprout unknown master-type: '+master.type);
	return new creator(master);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Stem ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The base of all meshcraft-nodes.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//function Stem(master, twigs, generic) {
//	this._twigs = twigs;
//	for (k in master) {
//		twigs[k] = sprout(master[k], generic);
//	}
//}
//
///**
//| Returns the subnode the signature points at.
//*/
//Stem.prototype.get = function(sign, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//	var node = this._twigs[sign.arc(s0)];
//	if (s0 + 1 === sl) {
//		return node;
//	}
//	if (!node.get) throw new Error('signature points nowhere');
//	return node.get(sign, s0 + 1, sl);
//}
//
///**
//| Sets the value of a node.
//*/
///* todo change order */
//Generic.prototype.set = function(sign, val, s0, sl) {
//	s0 = sign.fitarc(s0, false);
//	sl = sign.fitarc(sl, true);
//	if (s0 + 1 === sl) {
//		this._nodes[sign.arc(s0)] = sprout(val, true);
//	} else {
//		var node = this._nodes[sign.arc(s0)];
//		if (!isnon(node)) throw new Error('signature points nowhere');
//		node.set(sign, val, s0 + 1, sl);
//	}
//}
//
///**
//| Clones the tree
//*/
//Generic.prototype.clone = function() {
//	return new Generic(this._nodes);
//}
//
//Generic.prototype.toJSON = function() {
//	return this._nodes;
//}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Generic ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a node tree (repository)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Generic(master) {
	this._nodes = {};
	if (master instanceof Generic) {
		master = master._nodes;
	}
	for (k in master) {
		this._nodes[k] = sprout(master[k], true);
	}
}

/**
| Returns the subnode path points at.
*/
Generic.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var node = this._nodes[sign.arc(s0)];
	if (s0 + 1 === sl) {
		return node;
	}
	if (!isnon(node)) throw new Error('signature points nowhere');
	return node.get(sign, s0 + 1, sl);
}

/**
| Sets the value of a node.
*/
/* todo change order */
Generic.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) {
		this._nodes[sign.arc(s0)] = sprout(val, true);
	} else {
		var node = this._nodes[sign.arc(s0)];
		if (!isnon(node)) throw new Error('signature points nowhere');
		node.set(sign, val, s0 + 1, sl);
	}
}

/**
| Clones the tree
*/
Generic.prototype.clone = function() {
	return new Generic(this._nodes);
}

Generic.prototype.toJSON = function() {
	return this._nodes;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Sequence ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 an array.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Sequence(master) {
	this._seq = [];
	if (master instanceof Sequence) {
		master = master._seq;
	}
	for (k in master) {
		this._seq[k] = sprout(master[k], true);
	}
}

/**
| Returns the subnode path points at.
*/
Sequence.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var node = this._seq[sign.arc(s0)];
	if (s0 + 1 === sl) {
		return node;
	}
	if (!isnon(node)) throw new Error('signature points nowhere');
	return node.get(sign, s0 + 1, sl);
}

/**
| Sets the value of a node.
*/
/* todo change order */
Sequence.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) {
		this._seq[sign.arc(s0)] = sprout(val, true);
	} else {
		var node = this._seq[sign.arc(s0)];
		if (!isnon(node)) throw new Error('signature points nowhere');
		node.set(sign, val, s0 + 1, sl);
	}
}

/**
| Clones the tree
*/
Sequence.prototype.clone = function() {
	return new Sequence(this._seq);
}

Sequence.prototype.toJSON = function() {
	return this._seq;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Set ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 ???
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Nexus ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 the root of spaces
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	this.nodes = {};
	if (master) {
		for (k in master.nodes) this.nodes[k] = new Space(master.nodes[k]);
	}
}

/**
| Returns the subnode path points at.
*/
Nexus.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);

	var node = this.nodes[sign.arc(s0)];
	if (s0 + 1 === sl) return node;
	if (!node) throw new Error('Signature points nowhere');
	return node.get(sign, s0 + 1, sl);
}

/**
| Sets the value of a node.
*/
Nexus.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);

	if (s0 + 1 === sl) {
		this.nodes[sign.arc(s0)] = new Space(val);
	} else {
		var node = this.nodes[sign.arc(s0)];
		if (!node) throw new Error('signature points nowhere');
		node.set(sign, val, s0 + 1, sl);
	}
}

Nexus.prototype.toJSON = function() {
	return this.spaces;
}

/**
| Clones the Nexus
*/
Nexus.prototype.clone = function() {
	return new Nexus(this);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Space ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a space
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space(master) {
	if (master.type !== 'space') throw new Error('Space does not have correct type: '+master.type);
	for (var k in master) {
		if (!master.hasOwnProperty(k)) continue;
		switch (k) {
		case 'items':
		case 'type' :
		case 'z':
			break;
		default :
			throw new Error('Space has unknown key:'+k);
		}
	}
	this.type  = 'space';
	this.items = {};
	if (master) {
		this.z = clone(master.z);
		for (var k in master.items) {
			this.items[k] = new Note(master.items[k]);
		}
	} else {
		this.z = [];
	}
}

/**
| Returns the subnode path points at.
*/
Space.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var s0a = sign.arc(s0);
	switch (s0a) {
	case 'items':
		if (s0 + 1 === sl) return this.items;
		var node = this.items[sign.arc(s0 + 1)];
		if (s0 + 2 === sl) return node;
		if (!node) throw new Error('Signature points nowhere');
		return node.get(sign, s0 + 2, sl);
	case 'z' :
		if (s0 + 1 === sl) return this.z;
		if (s0 + 2 !== sl) throw new Error('space.z[] has no further children');
		return this.z[sign.arc(s0 + 1)];
		if (!node) throw new Error('Signature points nowhere');
	default:
		throw new Error('Unknown arc to space: '+s0a);
	}
}

/**
| Sets the value of a node.
*/
Space.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var s0a = sign.arc(s0);
	if (s0 + 1 === sl) throw new Error('Cannot set space['+sign.arg(s0)+'] directly');
	if (s0 + 2 === sl) {
		switch (s0a) {
		case 'items' :
			this.items[sign.arc(s0 + 1)] = new Note(val);
			break;
		case 'z' :
			if (typeof(val) !== 'string' && typeof(val) !== 'number')
				throw new Error('space.z[] must be item or string');
			this.z[sign.arc(s0 + 1)] = val;
			break;
		default :
			throw new Error('space.'+s0a+' invalid arc');
		}
	} else {
		switch (s0a) {
		case 'items' :
			this.items[sign.arc(s0 + 1)].set(sign, val, s0 + 2, sl);
			break;
		case 'z' :
			throw new Error('space.z[] has no further children');
			break;
		default :
			throw new Error('space.'+s0a+' invalid arc');
		}
	}
}

/**
| Clones the tree
*/
Space.prototype.clone = function() {
	return new Space(this);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Note ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a note
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function Note(master) {
	if (master instanceof Note) {
		Generic.call(this, master.nodes);
	} else {
		Generic.call(this, master);
	}
}
subclass(Note, Generic);

/*function Note(master) {
	if (master.type !== 'note') throw new Error('Note does not have correct type: '+master.type);
	for (var k in master) {
		if (!master.hasOwnProperty(k)) continue;
		switch (k) {
		case 'zone':
		case 'doc':
			break;
		default :
			throw new Error('Space has unknown key:'+k);
		}
	}
	this.type = 'note';
	if (master) {
	this.zone = new Zone(master ? master.zone : null);
	this.doc  = new Doc(master ? master.doc : null);
}*/



/**
| Export.
*/
woods = {
	Nexus   : Nexus,
	Space   : Space,
	Note    : Note,
	Generic : Generic,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

