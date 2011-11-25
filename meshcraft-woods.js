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
 ++ Stem ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The base of all meshcraft-nodes.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Stem(twigs, master) {
	this._twigs = twigs;
	for (k in master) {
		twigs[k] = this._sprout(master[k]);
	}
}

/**
| Returns the twig the signature points at.
*/
Stem.prototype.get = function(sign, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	var twig = this._twigs[sign.arc(s0)];
	if (s0 + 1 === sl) {
		return twig;
	}
	if (!twig || !twig.get) throw new Error('signature points nowhere');
	return twig.get(sign, s0 + 1, sl);
}

/**
| Sets the value of a twig.
*/
Stem.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) {
		this._twigs[sign.arc(s0)] = this._sprout(val);
	} else {
		var twig = this._twigs[sign.arc(s0)];
		if (!twig || !twig.set) throw new Error('signature points nowhere');
		twig.set(sign, val, s0 + 1, sl);
	}
}

/**
| Sprouts a new twig.
*/
Stem.prototype._sprout = function(master) {
	log('debug', 'SPROUT', master);
	if (typeof(master) === undefined) return undefined;
	var creator = this.cSeeds[master.constructor.name];
	if (creator === true) return master;
	if (creator) return new creator(master);
	if (!this.tSeeds) throw new Error('Cannot sprout (cname): '+master.constructor.name);
	creator = this.tSeeds[master.type];
	if (!creator) throw new Error('Cannot sprout (type): '+master.type);
	return new creator(master);
}

Stem.prototype.toJSON = function() {
	return this._twigs;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Generic ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 a generic twig allowing any kind of subtwigs.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function GenericCopse(master) {
	if (master instanceof GenericCopse) master = master._twigs;
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
	if (master instanceof GenericAlley) master = master._twigs;
	Stem.call(this, [], master);
}
subclass(GenericAlley, Stem);

GenericAlley.prototype.cSeeds = GenericCopse.prototype.cSeeds;
GenericAlley.prototype.tSeeds = GenericCopse.prototype.tSeeds;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Nexus ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 The root of spaces
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	if (master instanceof Nexus) master = master._twigs;
	Stem.call(this, {}, master);
	this.type  = 'nexus';
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
	if (master instanceof Space) {
		master = master._twigs;
	} else if (master && master.type !== 'space') {
		throw new Error('Space master typed wrongly: '+master.type);
	}
	// todo check if master has other keys.

	Stem.call(this, {
			items : new ItemCopse(master && master.items),
			z     : new ArcAlley (master && master.z),
		}, null);
	this.type  = 'space';
	this.items = this._twigs.items;
	this.z     = this._twigs.z;
	log('debug', 'NEWSPACE MASTER', master);
	log('debug', 'NEWSPACE THIS', this);
}
subclass(Space, Stem);

/**
| Sets the value of a node.
*/
Space.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) throw new Error('Cannot set Space twigs themselves');
	Stem.set.call(this, sign, val, s0, sl);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ItemCopse ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A copse of items (in a space).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ItemCopse(master) {
	if (master instanceof ItemCopse) master = master._twigs;
	Stem.call(this, {}, master);
	log('debug', 'ITEMCOPSE MASTER', master);
	log('debug', 'ITEMCOPSE THIS', this);
}
subclass(ItemCopse, Stem);

ItemCopse.prototype.cSeeds = {
	'GenericCopse' : GenericCopse,
	'Object'       : GenericCopse,
};

//ItemCopse.prototype.tSeeds = {
//};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ArcAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 xx
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ArcAlley(master) {
	log('debug', 'ARCALLEY MASTER', master);
	if (master instanceof ArcAlley) master = master._twigs;
	Stem.call(this, [], master);
}
subclass(ArcAlley, Stem);

ArcAlley.prototype.cSeeds = {
	'Number' : true,
	'String' : true,
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
woods = {
	Nexus        : Nexus,
	Space        : Space,
	ItemCopse    : ItemCopse,
	ArcAlley     : ArcAlley,
	GenericCopse : GenericCopse,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

