/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var jools;

/**
| Exports
*/
var woods;

/**
| Capsule
*/
(function(){

"use strict";

try {
	// if not fails running node
	jools        = require('./meshcraft-jools');
} catch(e) {
	// require failed, running in browser
}

var log      = jools.log;
var subclass = jools.subclass;

function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isString(o)  { return typeof(o) === 'string' || o instanceof String; }
function isInteger(o) { return typeof(o) === 'number' && Math.floor(o) === o; }

/**
| Returns a rejection error
*/
function reject(message) {
	if (jools.debug) throw new Error(message); // in debug mode any failure is fatal.
	log('mm', 'reject', message);
	return {ok: false, message: message};
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Signature++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Signates an entry, string index or string span.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Signature(master) {
	if (is(master.path))  this.path  = new Path(master.path);
	if (is(master.at1))   this.at1   = master.at1;
	if (is(master.at2))   this.at2   = master.at2;
	if (is(master.pivot)) this.pivot = master.pivot;
	if (is(master.proc))  this.proc  = master.proc;
	if (is(master.val))   this.val   = master.val;
}

/**
| Attunes '_end' ats to match a string.
*/
Signature.prototype.attune = function(str, name) {
	if (this.at1 === '_end') this.at1 = str.length;
	if (this.at2 === '_end') this.at2 = str.length;
	/* TODO proper checking
	checkWithin(pfx.at1, 0, str.length, name, 'postfix.at1 invalid');
	if (is(pfx.at2)) {
		checkWithin(pfx.at2, 0, str.length, name, 'postfix.at2 invalid');
		check(pfx.at2 >= pfx.at1, name, 'postfix: at2 < at1');
	}*/
	return this;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++Path++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 Path to a node.
 TODO, make immuteable?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Path(master) {
	if (master instanceof Path) master = master._path;
	if (!(master instanceof Array)) {
		log('fail', 'master:', master);
		throw new Error('invalid path master');
	}

	for (var i = 0; i < master.length; i++) {
		var v = master[i];
		if (isInteger(v)) continue;
		if (isString(master[i])) {
			if (v[0] === '_') throw reject('Path arcs must not start with _');
			continue;
		}
		throw reject('Path arcs must be String or Integer');
	}
	this._path = master.slice();
}

/**
| Length of the signature.
*/
Object.defineProperty(Path.prototype, 'length', {
	get: function() { return this._path.length; },
});

/**
| Returns the signature at index i.
*/
Path.prototype.get = function(i) {
	if (i < 0) i += this._path.length;
	if (i < 0) return undefined;
	return this._path[i];
}


/**
| Fits the arc numeration to be in this signature.
*/
Path.prototype.fit = function(a, edge) {
	if (!is(a)) a = edge ? this.length : 0;
	if (a < 0) a += this.pathlen;
	if (a < 0) a = 0;
	return a;
}

/**
| Sets arc i
*/
Path.prototype.set = function(i, v) {
	if (i < 0) i += this._path.length;
	return this._path[i] = v;
}

/**
| Adds to integer arc i
*/
Path.prototype.add = function(i, v) {
	if (i < 0) i = this._path.length + i;
	if (!isInteger(this._path[i])) {
		throw new Error('cannot change non-integer arc: '+this._path[i]);
	}
	return this._path[i] += v;
}

/**
| True if this path is the same as another.
*/
Path.prototype.equals = function(o, len) {
	if (this._path.length !== o._path.length) return false;
	for(var k in this._path) {
		if (this._path[k] !== o._path[k]) return false;
	}
	return true;
}

/**
| True if this path is a subpath of another.
|
| o: the other path
| [slen]: the length of this path to consider.
*/
Path.prototype.like = function(o, slen) {
	if (!is(slen)) slen  = this.length;
	if (slen < 0)  slen += this.length;
	if (slen < 0)  slen  = 0;

	if (slen > o.length) return false;
	for(var i = 0; i < slen; i++) {
		if (this._path[i] !== o._path[i]) return false;
	}
	return true;
}


/**
| stringify
*/
Path.prototype.toString = function() {
	throw new Error("is this used?");
	return this._path.toString();
}

/**
| jsonfy
*/
Path.prototype.toJSON = function() {
	return this._path;
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Stem ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The base of all meshcraft-nodes.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Stem(twigs, master) {
	if (master && master._twigs) master = master._twigs;
	this._twigs = twigs;
	for (var k in master) {
		if (k === 'type' ) continue;
		twigs[k] = this._sprout(master[k]);
	}
}

/**
| Returns the twig the path points at.
*/
Stem.prototype.get = function(path, a0, al) {
	if (!(path instanceof Path)) { // direct?
		return this._twigs[path];
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var twig = this._twigs[path.get(a0)];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere');
	return twig.get(path, a0 + 1, al);
}

/**
| Sets the value of a twig.
*/
Stem.prototype.set = function(path, val, a0, al) {
	if (!(path instanceof Path)) { // direct?
		this._twigs[path] = this._sprout(val);
		return;
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	if (a0 + 1 === al) {
		this._twigs[path.get(a0)] = this._sprout(val);
	} else {
		var twig = this._twigs[path.get(a0)];
		if (!twig || !twig.set) throw reject('path goes nowhere');
		twig.set(path, val, a0 + 1, al);
	}
}

/**
| Sprouts a new twig.
*/
Stem.prototype._sprout = function(master) {
	if (typeof(master) === 'undefined') return undefined;
	if (master === null) return null;

	var creator = this.cSeeds[master.constructor.name];
	if (creator === true) return master;
	if (creator) return new creator(master);
	if (!this.tSeeds) throw new Error('Cannot sprout (cname): '+master.constructor.name);
	creator = this.tSeeds[master.type];
	if (!creator) throw new Error('Cannot sprout (type): '+master.type);
	return new creator(master);
}

/**
| Transforms to JSON.
*/
Stem.prototype.toJSON = function() {
	return this._twigs;
}

/**
| Iterates over all subnodes
*/
Stem.prototype.forEach = function(callback) {
	if (this.isAlley) {
		this._twigs.forEach(callback);
	} else {
		for(var k in this._twigs) callback(this._twigs[k], k);
	}
}

/**
| Splice for Alleys
*/
Stem.prototype.splice = function() {
	if (!this.isAlley) throw new Error(this.constructor.name + ' does not support splice()');
	return this._twigs.splice.apply(this._twigs, arguments);
}

/**
| Grows a new subnode
*/
Stem.prototype.growNew = function(path) {
	if (!this.isGrowable) throw new ('Node not growable');
	if (!this._grow) this._grow = 1;
	path.set(-1, this._grow++);
}

/**
| Returns true if this node matches a master or a node of equal class
*/
Stem.prototype.matches = function(master) {
	if (!isnon(master) || !master.constructor) return false;
	if (this.constructor === master.constructor) {
		// allow matching of nodes equal class
		master = master._twigs;
	}

	var klen = 0;
	for(var k in this._twigs) {
		if (k === 'type') continue;
		var v = this._twigs[k];
		if (v.matches) {
			if (!v.matches(master[k])) return false;
		} else {
			if (this._twigs[k] !== master[k]) return false;
		}
		klen++;
	}
	// tests if there aren't additional keys in o.
	for (var k in master) {
		if (k !== 'type') klen--;
	}
	return klen === 0;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Generic ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a generic twig allowing any kind of subtwigs.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function GenericCopse(master) {
	Stem.call(this, {}, master);
}
subclass(GenericCopse, Stem);

GenericCopse.prototype.cSeeds = {
	'Array'        : GenericAlley,
	'GenericAlley' : GenericAlley,
	'GenericCopse' : GenericCopse,
	'Number'       : true,
	'Object'       : GenericCopse,
	'String'       : true,
};

GenericCopse.prototype.tSeeds = null;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Alley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a generic array allowing any kind of subtwigs.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function GenericAlley(master) {
	Stem.call(this, [], master);
}
subclass(GenericAlley, Stem);

GenericAlley.prototype.cSeeds  = GenericCopse.prototype.cSeeds;
GenericAlley.prototype.tSeeds  = GenericCopse.prototype.tSeeds;
GenericAlley.prototype.isAlley = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Nexus ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The root of spaces
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	Stem.call(this, {type: 'nexus'}, master);
}
subclass(Nexus, Stem);

Nexus.prototype.cSeeds = {
	'Space' : Space,
}

Nexus.prototype.tSeeds = {
	'space' : Space,
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Space ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a space
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space(master) {
	if (master && !(master instanceof Space) && master.type !== 'space') {
		throw new Error('Space master typed wrongly: '+master.type);
	}
	// todo check if master has other keys.

	Stem.call(this, {
			type  : 'space',
			items : new ItemCopse(master && master.items),
			z     : new ArcAlley (master && master.z),
		}, null);
	this.items = this._twigs.items;
	this.z     = this._twigs.z;
}
subclass(Space, Stem);

/**
| Sets the value of a node.
*/
Space.prototype.set = function(path, val, a0, al) {
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	if (a0 + 1 === al) throw new Error('Cannot set Space twigs themselves');
	this.super.set.call(this, path, val, a0, al);
}
Space.prototype.isGrowable = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ItemCopse ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A copse of items (in a space).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ItemCopse(master) {
	Stem.call(this, {}, master);
}
subclass(ItemCopse, Stem);

ItemCopse.prototype.cSeeds = {
	'Note' : Note,
};

ItemCopse.prototype.tSeeds = {
	'note' : Note,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Note ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a note
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Note(master) {
	if (master && !(master instanceof Note) && master.type !== 'note') {
		throw new Error('Note master typed wrongly: '+master.type);
	}
	// todo check if master has other keys.

	Stem.call(this, {
			type : 'note',
			zone : new GenericCopse(master && master.zone),
			doc  : new DocAlley(master && master.doc),
		}, null);
	this.zone = this._twigs.zone;
	this.doc  = this._twigs.doc;
}
subclass(Note, Stem);

/**
| Sets the value of a node.
*/
Note.prototype.set = function(path, val, a0, al) {
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	if (a0 + 1 === al) throw new Error('Cannot set Note twigs themselves');
	this.super.set.call(this, path, val, a0, al);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ArcAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Numbers and Strings (Arcs)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ArcAlley(master) {
	Stem.call(this, [], master);
}
subclass(ArcAlley, Stem);

ArcAlley.prototype.cSeeds = {
	'Number' : true,
	'String' : true,
};
ArcAlley.prototype.isAlley = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ DocAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Paragraphs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function DocAlley(master) {
	Stem.call(this, [], master);
}
subclass(DocAlley, Stem);

DocAlley.prototype.cSeeds = {
	'Para'    : Para,
};
DocAlley.prototype.tSeeds = {
	'para'    : Para,
}
DocAlley.prototype.isAlley = true;


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Para ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A paragraph
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Para(master) {
	Stem.call(this, {}, master);
}
subclass(Para, Stem);

Para.prototype.cSeeds = {
	'String' : true,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
woods = {
	ArcAlley     : ArcAlley,
	DocAlley     : DocAlley,
	GenericCopse : GenericCopse,
	ItemCopse    : ItemCopse,
	Nexus        : Nexus,
	Path         : Path,
	Para         : Para,
	Signature    : Signature,
	Space        : Space,
	reject       : reject,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

