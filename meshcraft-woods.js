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
	// if not fails running nodejs
	jools        = require('./meshcraft-jools');
} catch(e) {
	// require failed, running in browser
}

var log      = jools.log;
var subclass = jools.subclass;

function is(o)        { return typeof(o) !== 'undefined'; }
function isnon(o)     { return typeof(o) !== 'undefined' && o !== null; }
function isInteger(o) { return typeof(o) === 'number' && Math.floor(o) === o; }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---.               .
 \___  . ,-. ,-. ,-. |- . . ,-. ,-.
     \ | | | | | ,-| |  | | |   |-'
 `---' ' `-| ' ' `-^ `' `-^ '   `-'
~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
          `'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Signates an entry, string index or string span.
*/
function Signature(sign) {
	if (sign instanceof Signature) sign = sign._sign;
	if (!(sign instanceof Array)) throw new Error('invalid signature master');

	/*
	TODO fix.
	for (var i = 0; i < sign.length; i++) {
		check(isString(sign[i]) || isInteger(sign[i]) ||
			(i === sign.length - 1 && isTable(sign[i])),
			name, 'arcs must be string or integer or a postfix table');
		check(sign[i][0] !== '_', name, 'arcs must not start with _');
	}*/
	this._sign = jools.clone(sign);
}

/**
| Clones the signature
| TODO, remove?
*/
Signature.prototype.clone = function() {
	return new Signature(this);
}

/**
| Length of the signature.
*/
Object.defineProperty(Signature.prototype, 'length', {
	get: function() { return this._sign.length; },
});


/**
| If the signature is an index or span it will return that.
| TODO remove
*/
Object.defineProperty(Signature.prototype, 'postfix', {
	get: function() {
		if (this._sign.length === 0) return null;
		var pfx = this._sign[this._sign.length - 1];
		return (pfx.constructor === Object) ? pfx : null;
	},
});

/**
| Length of the path / signature without postfix.
*/
Object.defineProperty(Signature.prototype, 'pathlen', {
	get: function() {
		return this._sign.length - (this.postfix ? 1 : 0);
	},
});


/**
| True if the signature ends as string index.
*/
Signature.prototype.isIndex = function() {
	var pfx = this.postfix;
	return (pfx !== null) && is(pfx.at1);
}

/**
| True if the signature ends as string span.
*/
Signature.prototype.isSpan = function() {
	var pfx = this.postfix;
	return (pfx !== null) && is(pfx.at1) && is(pfx.at2);
}

/**
| True if the signature is only a path (without postfix)
*/
Signature.prototype.isPath = function() {
	return (this.postfix === null);
}

/**
| Returns the signature at index i.
| TODO rename to get?
*/
Signature.prototype.arc = function(i) {
	if (i < 0) i = this._sign.length + i;
	if (i < 0) return null;
	return this._sign[i];
}


/**
| Fits the arc numberation to be in this signature.
*/
Signature.prototype.fitarc = function(sa, defaultedge) {
	if (!is(sa)) sa = defaultedge ? this.pathlen : 0;
	if (sa < 0) sa = this.pathlen + sa;
	if (sa < 0) sa = 0;
	return sa;
}

/**
| Returns the signature at index i.
*/
Signature.prototype.setarc = function(i, v) {
	if (this.frozen) throw new Error('changing readonly signature');
	if (i < 0) i = this._sign.length - i;
	return this._sign[i] = v;
}

/**
| Returns the signature at index i.
*/
Signature.prototype.addarc = function(i, v) {
	if (this.frozen) throw new Error('changing readonly signature');
	if (i < 0) i = this._sign.length + i;
	if (!isInteger(this._sign[i]))
		throw new Error('cannot change non-integer arc: '+this._sign[i]);
	return this._sign[i] += v;
}

/**
| True if this signature is the same as another.
*/
Signature.prototype.equals = function(o) {
	return deepEqual(this._sign, o._sign);
}

/**
| True if this signature has the same path (that is without postfix)
| than another
*/
Signature.prototype.equalPaths = function(o) {
	var pl = this.pathlen;
	if (pl !== o.pathlen) return false;
	for(var i = 0; i < pl; i++) {
		if (this._sign[i] !== o._sign[i]) return false;
	}
	return true;
}

/**
| True if this signature is start of another.
|
| o: the other signature
| [slan]: the length of this signature to consider.
*/
Signature.prototype.isSubOf = function(o, slen) {
	if (!is(slen)) slen = this.pathlen;
	if (slen < 0) slen = this.pathlen + slen;
	if (slen < 0) slen = 0;

	if (slen === this.length && this.postfix) return false;
	if (slen > o.pathlen) return false;
	for(var i = 0; i < slen; i++) {
		if (this._sign[i] !== o._sign[i]) return false;
	}
	return true;
}


/**
| stringify
*/
Signature.prototype.toString = function() {
	return this._sign.toString();
}

/**
| Attunes the '_end' things of the postfix to match the string it points to.
*/
Signature.prototype.attunePostfix = function(str, name) {
	var pfx = this.postfix;
	if (pfx === null) throw new Error(name+' not a postfix');
	if (pfx.at1 === '_end') {
		if (this.readonly) throw new Error(name+'cannot change readonly');
		pfx.at1 = str.length;
	}
	if (pfx.at2 === '_end') {
		if (this.readonly) throw new Error(name+'cannot change readonly');
		pfx.at2 = str.length;
	}
	/* todo proper checking
	checkWithin(pfx.at1, 0, str.length, name, 'postfix.at1 invalid');
	if (is(pfx.at2)) {
		checkWithin(pfx.at2, 0, str.length, name, 'postfix.at2 invalid');
		check(pfx.at2 >= pfx.at1, name, 'postfix: at2 < at1');
	}*/
	return pfx;
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
| Returns the twig the signature points at.
*/
Stem.prototype.get = function(sign, s0, sl) {
	if (!(sign instanceof Signature)) {
		// direct access?
		return this._twigs[sign];
	}
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
	if (!(sign instanceof Signature)) {
		// direct access?
		this._twigs[sign] = this._sprout(val);
		return;
	}
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
	log('debug', 'SPROUT', master, '||', typeof(master));
	if (typeof(master) === 'undefined') return undefined;
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
Space.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) throw new Error('Cannot set Space twigs themselves');
	this.super.set.call(this, sign, val, s0, sl);
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
Note.prototype.set = function(sign, val, s0, sl) {
	s0 = sign.fitarc(s0, false);
	sl = sign.fitarc(sl, true);
	if (s0 + 1 === sl) throw new Error('Cannot set Note twigs themselves');
	this.super.set.call(this, sign, val, s0, sl);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ArcAlley ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 An array of Numbers and Strings (Arcs to Signatures)
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
	'Object'       : GenericCopse, // xx
	'GenericCopse' : GenericCopse, // xx
};
DocAlley.prototype.isAlley = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 Module Export
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
woods = {
	Nexus        : Nexus,
	Space        : Space,
	ItemCopse    : ItemCopse,
	ArcAlley     : ArcAlley,
	DocAlley     : DocAlley,
	GenericCopse : GenericCopse,
	Signature    : Signature,
}

try {
	module.exports = woods;
} catch(e) {
	// browser;
};

})();

