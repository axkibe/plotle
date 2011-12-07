/**
| Meshcraft Tree structure.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

/**
| Imports
*/
var jools;
var fabric;

/**
| Exports
*/
var woods;

/**
| Capsule
*/
(function(){

"use strict";

/**
| Running in node or browser?
*/
var inNode = true; try { module } catch (e) { inNode = false; }

if (inNode) {
	jools  = require('./meshcraft-jools');
	fabric = require('./meshcraft-fabric');
}

var Path      = jools.Path;
var Signature = jools.Signature;

var debug     = jools.debug;
var is        = jools.is;
var isnon     = jools.isnon;
var isString  = jools.isString;
var isInteger = jools.isInteger;
var log       = jools.log;
var reject    = jools.reject;
var subclass  = jools.subclass;

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
Stem.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
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

/**
| Class Seeds. Things that can grow on this twig.
*/
GenericCopse.prototype.cSeeds = {
	'Array'        : GenericAlley,
	'GenericAlley' : GenericAlley,
	'GenericCopse' : GenericCopse,
	'Number'       : true,
	'Object'       : GenericCopse,
	'String'       : true,
};

/**
| Type Seeds. Things that can be a master for new grows on this twig.
*/
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

/**
| Class Seeds. Things that can grow on this twig.
*/
GenericAlley.prototype.cSeeds  = GenericCopse.prototype.cSeeds;

/**
| Type Seeds. Things that can be a master for new grows on this twig.
*/
GenericAlley.prototype.tSeeds  = GenericCopse.prototype.tSeeds;
GenericAlley.prototype.isAlley = true;

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
| Class Seeds. Things that can grow on this twig.
*/
Nexus.prototype.cSeeds = {
	'Space' : Space,
}

/**
| Type Seeds. Things that can be a master for new grows on this twig.
*/
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
			items : new this.cSeeds.ItemCopse(master && master.items),
			z     : new this.cSeeds.ArcAlley (master && master.z),
		}, null);
	this.items = this._twigs.items;
	this.z     = this._twigs.z;
}
subclass(Space, Stem);

/**
| Class Seeds. Things that can grow on this twig.
*/
Space.prototype.cSeeds = {
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
	this.base.prototype.set.call(this, path, val, a0, al);
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

/**
| Class Seeds. Things that can grow on this twig.
*/
ItemCopse.prototype.cSeeds = {
	'Note' : Note,
};

/**
| Type Seeds. Things that can be a master for new grows on this twig.
*/
ItemCopse.prototype.tSeeds = {
	'note' : Note,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Note ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a note
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Note(master) {
	console.log('NEW wNOTE') // debug
	if (master && !(master instanceof Note) && master.type !== 'note') {
		throw new Error('Note master typed wrongly: '+master.type);
	}
	// TODO check if master has other keys.

	Stem.call(this, {
			type : 'note',
			zone : new Rect(master.zone),
			doc  : new DocAlley(master && master.doc),
		}, null);
	this.zone = this._twigs.zone;
	this.doc  = this._twigs.doc;
}
subclass(Note, Stem);

/**
| Class Seeds. Things that can grow on this twig.
*/
Note.prototype.cSeeds = {
	'DocAlley'  : DocAlley,
}


/**
| Sets the value of a node.
*/
Note.prototype.set = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);

	if (path.get(a0) === 'zone') {
		if (a0 + 1 === al) {
			this.zone = new Rect(val);
			return;
		}
		this.zone = this.zone.set(path, val, a0 + 1, al, true);
		return;
	}
	if (a0 + 1 === al) throw new Error('Cannot set Note.'+path.get(a0)+' itself');
	this.base.prototype.set.call(this, path, val, a0, al);
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

/**
| Class Seeds. Things that can grow on this twig.
*/
ArcAlley.prototype.cSeeds = {
	'Number' : true,
	'String' : true,
};
ArcAlley.prototype.isAlley = true;

/**
| Alley length.
|
| TODO common prototype for all Alleys.
*/
Object.defineProperty(ArcAlley.prototype, 'length',  {
	get: function() { return this._twigs.length; },
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ DocAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Paragraphs
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function DocAlley(master) {
	Stem.call(this, [], master);
}
subclass(DocAlley, Stem);

/**
| Class Seeds. Things that can grow on this twig.
*/
DocAlley.prototype.cSeeds = {
	'Para'    : Para,
};

/**
| Type Seeds. Things that can be a master for new grows on this twig.
*/
DocAlley.prototype.tSeeds = {
	'para'    : Para,
}
DocAlley.prototype.isAlley = true;

/**
| Alley length.
*/
Object.defineProperty(DocAlley.prototype, 'length',  {
	get: function() { return this._twigs.length; },
});


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
| Class Seeds. Things that can grow on this twig.
*/
Para.prototype.cSeeds = {
	'String' : true,
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Rect ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A rectangle inherits fabric.Rect and is immutable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Rect(master) {
	this.base.call(this,
		new Point(master.pnw),
		new Point(master.pse)
	);
}
subclass(Rect, fabric.Rect);

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
 A Points inherits fabric.Point and is immutable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Point(master) {
	this.base.call(this, master.x, master.y);
}
subclass(Point, fabric.Point);

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
woods = {
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
};

if (inNode) {
	module.exports = woods;
}

})();

