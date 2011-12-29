/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var Jools;
var Fabric;

/**
| Exports
*/
var Woods;

/**
| Capsule
*/
(function(){

"use strict";

/**
| Running in node or browser?
*/
if (typeof(window) === 'undefined') {
	Jools  = require('./meshcraft-jools');
	Fabric = require('./meshcraft-fabric');
}

var Path      = Jools.Path;
var Signature = Jools.Signature;

var debug     = Jools.debug;
var is        = Jools.is;
var isnon     = Jools.isnon;
var isString  = Jools.isString;
var isInteger = Jools.isInteger;
var log       = Jools.log;
var reject    = Jools.reject;
var subclass  = Jools.subclass;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Stem ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The base of all meshcraft-nodes.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Stem(twigs, master) {
	if (master && master._twigs) master = master._twigs;
	this._twigs = twigs;
	if (Woods.cogging) {
		this.parent = null;
		this.key$ = null;
	}
	if (Woods.cogging) {
		for (var k in twigs) {
			if (k === 'type' || k === 'alley') continue;
			switch (twigs.constructor) {
			case String : continue;
			case Number : continue;
			}
			twigs[k].parent = this;
			twigs[k].key$ = k;
		}
	}
	for (var k in master) {
		if (k === 'type' || k === 'alley') continue;
		twigs[k] = this._sprout(master[k], this, k);
	}
}

/**
| Returns the twig the path points at.
*/
Stem.prototype.get = function(path, a0, al) {
	if (!(path instanceof Path)) { // direct? TODO check strings
		return this._twigs[path];
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	var twig = this._twigs[pa0];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere');
	return twig.get(path, a0 + 1, al);
}

/**
| Sets the value of a twig.
*/
Stem.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	if (!(path instanceof Path)) { // direct?
		this._twigs[path] = this._sprout(val, this, path);
		return;
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	if (a0 + 1 === al) {
		this._twigs[pa0] = this._sprout(val, this, pa0);
	} else {
		var twig = this._twigs[pa0];
		if (!twig || !twig.set) throw reject('path goes nowhere');
		twig.set(path, val, a0 + 1, al);
	}
}

/**
| Sprouts a new twig.
*/
Stem.prototype._sprout = function(master, parent, key$) {
	if (typeof(master) === 'undefined') return undefined;
	if (master === null) return null;

	var type = master.type;
	if (typeof(type) === 'undefined') {
		switch (master.constructor) {
		case String : type = 'String'; break;
		case Number : type = 'Number'; break;
		}
	}

	var creator = this.seeds[type];
	if (creator === true) return master;

	if (!creator) throw new Error('Cannot sprout: '+master.type);

	var scion = new creator(master);
	if (Woods.cogging) {
		scion.parent = parent;
		scion.key$   = key$;
	}
	return scion;
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
	for(var k in this._twigs) callback(this._twigs[k], k);
}


/**
| Grows a new subnode
*/
Stem.prototype.growNew = function(path) {
	if (!this.isGrowable) throw reject('Node not growable');
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

/**
| Gets the first anchestor of 'type', as long the
| parent variables have been set
*/
Stem.prototype.getAnchestor = function(type) {
	if (!Woods.cogging) throw new Error('getAnchestor not avaible without cogging');
	var n = this;
	while (n && n.type !== type) { n = n.parent; }
	if (!n) throw new Error('anchestor not there: '+type);
	return n;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ StemAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of any kind
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function StemAlley(master) {
	Stem.call(this, { alley: [] }, master);

	if (master && master._twigs) master = master._twigs;
	if (!isnon(master) || !isnon(master.alley) || (master.alley.constructor !== Array)) {
		throw new Error('StemAlley master.alley not an Array');
	}
	for (var k = 0; k < master.alley.length; k++) {
		this._twigs.alley[k] = this._sprout(master.alley[k], this, k);
	}
}
subclass(StemAlley, Stem);

StemAlley.prototype.isAlley = true;

/**
| Returns the twig the path points at.
*/
StemAlley.prototype.get = function(path, a0, al) {
	if (path.constructor === Number) { // direct alley?
		return this._twigs.alley[path];
	}
	if (!(path instanceof Path)) { // direct copse?
		return this._twigs[path];
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	var base = pa0.constructor === Number ? this._twigs.alley : this._twigs;
	var twig = base[pa0];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere (sa)');
	return twig.get(path, a0 + 1, al);
}

/**
| Sets the value of a twig.
*/
StemAlley.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	if (path.constructor === Number) { // direct alley? TODO switch
		this._twigs.alley[path] = this._sprout(val, this, path);
		return;
	}
	if (!(path instanceof Path)) { // direct copse? TODO only strings
		this._twigs[path] = this._sprout(val, this, path);
		return;
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	if (a0 + 1 === al) {
		var base = pa0.constructor === Number ? this._twigs.alley : this._twigs;
		base[pa0] = this._sprout(val, this, pa0);
	} else {
		var base = pa0.constructor === Number ? this._twigs.alley : this._twigs;
		var twig = base[pa0];
		if (!twig || !twig.set) throw reject('path goes nowhere (sa)');
		twig.set(path, val, a0 + 1, al);
	}
}
/**
| Iterates over all subnodes
*/
StemAlley.prototype.forEach = function(callback) {
	this._twigs.alley.forEach(callback);
	for(var k in this._twigs) {
		if (k === 'alley') continue;
		callback(this._twigs[k], k);
	}
}

/**
| Iterates over all subnodes
*/
StemAlley.prototype.forEachNumber = function(callback) {
	this._twigs.alley.forEach(callback);
}

/**
| Array splice
*/
StemAlley.prototype.splice = function() {
	return this._twigs.alley.splice.apply(this._twigs.alley, arguments);
}

/**
| Alley length.
*/
Object.defineProperty(StemAlley.prototype, 'length',  {
	get: function() { return this._twigs.alley.length; },
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Generic ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a generic twig allowing any kind of subtwigs.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function GenericCopse(master) {
	Stem.call(this, {}, master);
}
subclass(GenericCopse, Stem);

/**
| Seeds. Things that can grow on this twig.
*/
GenericCopse.prototype.seeds = {
	'Array'        : GenericAlley,
	'GenericAlley' : GenericAlley,
	'GenericCopse' : GenericCopse,
	'Number'       : true,
	'Object'       : GenericCopse,
	'String'       : true,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Alley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a generic array allowing any kind of subtwigs.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function GenericAlley(master) {
	StemAlley.call(this, master);
}
subclass(GenericAlley, StemAlley);

/**
| Seeds. Things that can grow on this twig.
*/
GenericAlley.prototype.seeds  = GenericCopse.prototype.seeds;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Nexus ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The root of spaces.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	Stem.call(this, {type: 'nexus'}, master);
}
subclass(Nexus, Stem);

/**
| Type
*/
Nexus.prototype.type = 'Nexus';

/**
| Seeds. Things that can grow on this twig.
*/
Nexus.prototype.seeds = {
	'Space' : Space,
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Space ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a space
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space(master) {
	if (master && !(master instanceof Space) && master.type !== 'Space') {
		throw new Error('Space master typed wrongly: '+master.type);
	}
	// todo check if master has other keys.

	Stem.call(this, {
			type  : 'Space',
			items : new this.seeds.ItemCopse(master && master.items),
			z     : new this.seeds.ArcAlley (master && master.z),
		}, null);
	this.items = this._twigs.items;
	this.z     = this._twigs.z;
}
subclass(Space, Stem);

/**
| Type
*/
Space.prototype.type = 'Space';

/**
| Seeds. Things that can grow on this twig.
*/
Space.prototype.seeds = {
	'ItemCopse' : ItemCopse,
	'ArcAlley'  : ArcAlley,
}

/**
| Sets the value of a node.
*/
Space.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	if (a0 + 1 === al) throw new Error('Cannot set Space twigs themselves');
	Stem.prototype.set.call(this, path, val, a0, al, oplace);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ItemCopse ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A copse of items (in a space).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ItemCopse(master) {
	Stem.call(this, {}, master);
}
subclass(ItemCopse, Stem);

/**
| Type
*/
ItemCopse.prototype.type = 'ItemCopse';

/**
| Seeds. Things that can grow on this twig.
*/
ItemCopse.prototype.seeds = {
	'Note' : Note,
};

/**
| ItemCopse can automatically assign new IDs to new items.
*/
ItemCopse.prototype.isGrowable = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Note ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a note
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Note(master) {
	if (master && !(master instanceof Note) && master.type !== 'Note') {
		throw new Error('Note master typed wrongly: '+master.type);
	}
	// TODO check if master has other keys.

	Stem.call(this, {
			type     : 'note',
			doc      : new this.seeds.DocAlley(master && master.doc),
			zone     : new Rect(master.zone),
		}, null);
	this.doc  = this._twigs.doc;
	this.zone = this._twigs.zone;
}
subclass(Note, Stem);

/**
| Type
*/
Note.prototype.type = 'Note';

/**
| Seeds. Things that can grow on this twig.
*/
Note.prototype.seeds = {
	'DocAlley'  : DocAlley,
}


/**
| Sets the value of a node.
*/
Note.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);

	if (path === 'zone' || path.get(a0) === 'zone') {
		if (a0 + 1 === al) {
			this.zone = new Rect(val);
		} else {
			this.zone = this.zone.set(path, val, a0 + 1, al, true);
		}
		return;
	}
	if (a0 + 1 === al) throw new Error('Cannot set Note.'+path.get(a0)+' itself');
	Stem.prototype.set.call(this, path, val, a0, al);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ArcAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Numbers and Strings (Arcs)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ArcAlley(master) {
	StemAlley.call(this, master);
}
subclass(ArcAlley, StemAlley);

/**
| ArcAlley
*/
ArcAlley.prototype.type = 'ArcAlley';

/**
| Seeds. Things that can grow on this twig.
*/
ArcAlley.prototype.seeds = {
	'Number' : true,
	'String' : true,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ DocAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Paragraphs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function DocAlley(master) {
	StemAlley.call(this, master);

	Object.defineProperty(this, 'fontsize', {
		get: function()  { return this._twigs.fontsize; },
	});
}
subclass(DocAlley, StemAlley);


/**
| Type
*/
DocAlley.prototype.type = 'DocAlley';

/**
| Seeds. Things that can grow on this twig.
*/
DocAlley.prototype.seeds = {
	'Para'    : Para,
	'Number'  : true,  // for fontsize TODO allow more detailed spec which
	                   // keys can do what.
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Para ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A paragraph
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Para(master) {
	Stem.call(this, {}, master);
}
subclass(Para, Stem);

/**
| Type
*/
Para.prototype.type = 'Para';

/**
| Seeds. Things that can grow on this twig.
*/
Para.prototype.seeds = {
	'String' : true,
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Rect ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A rectangle inherits fabric.Rect and is immutable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Rect(master) {
	Fabric.Rect.call(this,
		new Point(master.pnw),
		new Point(master.pse)
	);
}
subclass(Rect, Fabric.Rect);

Rect.prototype.set = function(path, val, a0, al, oplace) {
	if (!oplace) throw new Error('Rect can only be set out of place');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);

	switch(path.get(a0)) {
	case 'pnw': break;
	case 'pse': break;
	default : throw reject('path goes nowhere');
	}

	var npoint;
	if (a0 + 1 === al) {
		npoint = new Point(val);
	} else {
		npoint = this[path.get(a0)].set(path, val, a0 + 1, al, true);
	}

	return new Rect(
		path.get(a0) === 'pnw' ? npoint : this.pnw,
		path.get(a0) === 'pse' ? npoint : this.pse);
}

/**
| Returns the value the path points at.
*/
Rect.prototype.get = function(path, a0, al) {
	if (!(path instanceof Path)) { // direct?
		return this[path];
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var twig = this[path.get(a0)];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere');
	return twig.get(path, a0 + 1, al);
}

/**
| Returns true if the rect matches a master or another rect.
*/
Rect.prototype.matches = function(master) {
	if (!isnon(master) || !master.constructor ||
	    !isnon(master.pnw) || !isnon(master.pse)) return false;
	for(var k in master) {
		if (k !== 'pnw' && k !== 'pse') return false;
	}
	return this.pnw.matches(master.pnw) && this.pse.matches(master.pse);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Point ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A Points inherits Fabric.Point and is immutable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Point(master) {
	Fabric.Point.call(this, master.x, master.y);
}
subclass(Point, Fabric.Point);

Point.prototype.set = function(path, val, a0, al, oplace) {
	if (!oplace) throw new Error('Point can only be set out of place');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);

	switch(path.get(a0)) {
	case 'x': break;
	case 'y': break;
	default : throw reject('path goes nowhere');
	}

	return new Point(
		path.get(a0) === 'x' ? val : this.x,
		path.get(a0) === 'y' ? val : this.y);
}

/**
| Returns the value the path points at.
*/
Point.prototype.get = function(path, a0, al) {
	if (!(path instanceof Path)) { // direct?
		return this[path];
	}
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var twig = this[path.get(a0)];
	if (a0 + 1 !== al) throw reject('path goes nowhere');
	return this[path.get(a0)];
}

/**
| Returns true if the point matches a master or another point.
*/
Point.prototype.matches = function(master) {
	if (!isnon(master)      || !master.constructor ||
	    !isnon(master.x)    || !isnon(master.y)    ||
	    this.x !== master.x || this.y !== master.y) return false;
	for(var k in master) {
		if (k !== 'x' && k !== 'y') return false;
	}
	return true;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Woods = {
	ArcAlley     : ArcAlley,
	DocAlley     : DocAlley,
	GenericCopse : GenericCopse,
	ItemCopse    : ItemCopse,
	Nexus        : Nexus,
	Note         : Note,
	Para         : Para,
	Space        : Space,
	Rect         : Rect,
	Point        : Point,

	cogging      : false,
};

if (typeof(window) === 'undefined') {
	module.exports = Woods;
}

})();

