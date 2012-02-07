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
	Jools  = require('./jools');
	Fabric = require('./fabric');
}

var Path      = Jools.Path;
var Signature = Jools.Signature;

var debug     = Jools.debug;
var is        = Jools.is;
var isnon     = Jools.isnon;
var isInteger = Jools.isInteger;
var isString  = Jools.isString;
var isPath    = Jools.isPath;
var log       = Jools.log;
var reject    = Jools.reject;
var subclass  = Jools.subclass;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .
 \___  |- ,-. ,-,-.
     \ |  |-' | | |
 `---' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The base of all meshcraft-nodes.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Stem(twigs, master) {
	if (master && master._twigs) master = master._twigs;
	this._twigs = twigs;

	if (Woods.cogging) {
		this.parent = null;
		this.key$ = null;

		for (var k in twigs) {
			if (k === 'type' || k === 'alley') continue;
			switch (twigs.constructor) {
			case String : continue;
			case Number : continue;
			}
			if (twigs[k].noCogs) continue;
			twigs[k].parent = this;
			twigs[k].key$ = k;
		}
	}
	for (var k in master) {
		if (k === 'type' || k === 'alley') continue;
		twigs[k] = this._sprout(k, master[k], this);
	}
}

/**
| Returns the twig the path points at.
*/
Stem.prototype.get = function(path, a0, al) {
	if (isString(path)) return this._twigs[path];
	if (!isPath(path)) throw new Error('get path no string or path');

	a0 = path.fit(a0, false);
	al = path.fit(al, true);

	if (al === 0) return this;
	var pa0 = path.get(a0);
	var twig = this._twigs[pa0];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere');
	return twig.get(path, a0 + 1, al);
}

/**
| Sets the value of a twig.
|
| Only to be used by the meshmashine.
*/
Stem.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	if (isString(path)) { // direct set
		this._twigs[path] = this._sprout(path, val, this);
		return;
	}

	if (!isPath(path)) throw new Error('get path no string or path');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	if (a0 + 1 === al) {
		this._twigs[pa0] = this._sprout(pa0, val, this);
	} else {
		var twig = this._twigs[pa0];
		if (!twig || !twig.mmSet) throw reject('path goes nowhere');
		twig.mmSet(path, val, a0 + 1, al);
	}
}

/**
| Sprouts a new twig.
*/
Stem.prototype._sprout = function(key$, master, parent) {
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
	if (Woods.cogging && !scion.noCogs) {
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
| Used to loop through all non-alley children.
*/
Stem.prototype.loop = function() {
	return this._twigs;
}

/**
| Grows a new subnode
|
| @03 remove and replace by getNewKey()
*/
Stem.prototype.grow = function(path) {
	if (!this.isGrowable) throw reject('Node not growable');
	if (!this._grow) throw new Error('_grow not set');

	while (is(this.get('' + this._grow))) this._grow++;
	path.set(-1, '' + this._grow);
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
		var v1 = this._twigs[k];
		var v2 = master[k];

		if (k === 'alley') {
			if (v1.length !== v2.length) return false;
			for (var i = 0, len = v1.length; i < len; i++) {
				if (v1[i].matches) {
					if (!v1[i].matches(v2[i])) return false;
				} else {
					if (v1[i] !== v2[i]) return false;
				}
			}
		} else if (v1.matches) {
			if (!v1.matches(v2)) return false;
		} else {
			if (v1 !== v2) return false;
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
| Gets the first anchestor of 'type'.
*/
Stem.prototype.getAnchestor = function(type) {
	if (!Woods.cogging) throw new Error('getAnchestor() requires cogging');

	var n = this;
	while (n && n.type !== type) { n = n.parent; }
	if (!n) {
		throw new Error('anchestor not there: '+type);
	}
	return n;
}

/**
| Adds a listener for set events.
*/
Stem.prototype.addListener = function(listener) {
	if (!this.listen) this.listen = [];
	var listen = this.listen;
	if (listen.indexOf(listener) !== -1) return false;
	listen.push(listener);
	return true;
}

/**
| Removes a listener.
*/
Stem.prototype.removeListener = function(listener) {
	var listen = this.listen;
	if (!listen) return false;
	var idx = listen.indexOf(listener);
	if (idx === -1) return false;
	listen.splice(idx, 1);
	return true;
}

/**
| Tells all listeners of an event.
*/
Stem.prototype.tell = function() {
	var listen = this.listen;
	for (var a = 0; a < this.listen.length; a++) {
		var v = listen[a];
		v.event.apply(v, arguments);
	}
}

/**
| Gets the key of this node.
*/
Stem.prototype.getOwnKey = function() {
	if (!Woods.cogging) throw new Error('getOwnKey() requires cogging');
	if (this.parent === null) return null;
	if (this.parent.get(this.key$) === this) return this.key$;
	return this.key$ = this.parent.getKeyOf(this);
}

/**
| Gets the key of a child node
*/
Stem.prototype.getKeyOf = function(v, nocache) {
	if (!Woods.cogging) throw new Error('getKeyOf() requires cogging');
	if (v.parent !== this) return null;
	if (!nocache && this.get(v.key$) === v) return v.key$;

	var twigs = this._twigs;
	if (twigs.alley) {
		var idx = twigs.alley.indexOf(v);
		if (idx >= 0) {
			if (!nocache) v.key$ = idx;
			return idx;
		}
	}

	for(var k in twigs) {
		if (twigs[k] === v) {
			if (!nocache) v.key$ = k;
			return k;
		}
	}

	return null;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .                ,.   .  .
 \___  |- ,-. ,-,-.    / |   |  |  ,-. . .
     \ |  |-' | | |   /~~|-. |  |  |-' | |
 `---' `' `-' ' ' ' ,'   `-' `' `' `-' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                       `-'
 An array of any kind

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function StemAlley(master) {
	Stem.call(this, { alley: [] }, master);

	if (master && master._twigs) master = master._twigs;
	if (!isnon(master) || !isnon(master.alley) || (master.alley.constructor !== Array)) {
		throw new Error('StemAlley master.alley not an Array');
	}
	for (var k = 0; k < master.alley.length; k++) {
		this._twigs.alley[k] = this._sprout(k, master.alley[k], this);
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
	if (!twig || !twig.get) throw reject('path goes nowhere');
	return twig.get(path, a0 + 1, al);
}

/**
| Sets the value of a twig.
|
| Only to be used by the meshmashine.
*/
StemAlley.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');

	if (path.constructor === Number) { // direct alley?
		this._twigs.alley[path] = this._sprout(path, val, this);
		return;
	}
	if (!(path instanceof Path)) { // direct copse? TODO only strings
		this._twigs[path] = this._sprout(path, val, this);
		return;
	}

	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var pa0 = path.get(a0);
	if (a0 + 1 === al) {
		// set for this
		var base = pa0.constructor === Number ? this._twigs.alley : this._twigs;
		base[pa0] = this._sprout(pa0, val, this);
	} else {
		// set a sub
		var base = pa0.constructor === Number ? this._twigs.alley : this._twigs;
		var twig = base[pa0];
		if (!twig || !twig.mmSet) throw reject('path goes nowhere');
		twig.mmSet(path, val, a0 + 1, al);
	}
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


/**
| Returns the index of child element.
*/
StemAlley.prototype.indexOf = function(element) {
	var alley = this._twigs.alley;

	if (!Woods.cogging) return alley.indexOf(element);

	if (element.parent && element.parent !== this) throw new Error('damaged cogging');
	if (alley[element.key$] === element) return element.key$;
	return element.key$ = alley.indexOf(element);
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,---.                         ,--.
 |  -'  ,-. ,-. ,-. ,-. . ,-. | `-' ,-. ,-. ,-. ,-.
 |  ,-' |-' | | |-' |   | |   |   . | | | | `-. |-'
 `---|  `-' ' ' `-' '   ' `-' `--'  `-' |-' `-' `-'
~ ,-.|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  `-+'                                  '
 A generic twig allowing any kind of subtwigs.

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
 ,---.                            ,.   .  .
 |  -'  ,-. ,-. ,-. ,-. . ,-.    / |   |  |  ,-. . .
 |  ,-' |-' | | |-' |   | |     /~~|-. |  |  |-' | |
 `---|  `-' ' ' `-' '   ' `-' ,'   `-' `' `' `-' `-|
~ ,-.|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  `-+'                                           `-'
 A generic array allowing any kind of twigs.

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
 ,-,-.
 ` | |   ,-. . , . . ,-.
   | |-. |-'  X  | | `-.
  ,' `-' `-' ' ` `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The root of spaces.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Nexus(master) {
	Stem.call(this, {type: 'Nexus'}, master);
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
 .---.
 \___  ,-. ,-. ,-. ,-.
     \ | | ,-| |   |-'
 `---' |-' `-^ `-' `-'
~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
       '
 A space.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Space(master) {
	if (master && !(master instanceof Space) && master.type !== 'Space') {
		throw new Error('Space master typed wrongly: '+master.type);
	}
	// @03 check if master has other keys.

	Stem.call(this, {
			type  : 'Space',
			items : new this.seeds.ItemCopse(master && master.items),
			z     : new this.seeds.ArcAlley (master && master.z),
		}, null);
	this.items = this._twigs.items; // @03 dont
	this.z     = this._twigs.z;     // @03 dont
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
Space.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');
	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	if (a0 + 1 === al) throw new Error('Cannot set Space twigs themselves');
	Stem.prototype.mmSet.call(this, path, val, a0, al, oplace);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ ItemCopse ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A copse of items (in a space).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function ItemCopse(master) {
	Stem.call(this, {}, master);
	this._grow = 1;
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
	'Note'  : Note,
	'Label' : Label,
};

/**
| ItemCopse can automatically assign new IDs to new items.
*/
ItemCopse.prototype.isGrowable = true;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ++ Item ++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 a Note or Label

 master: master to create this item from
 type: 'Note' or 'Label'

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Item(twigs) {
	Stem.call(this, twigs, null);
	this.doc  = this._twigs.doc;
}
subclass(Item, Stem);

/**
| Seeds. Things that can grow on this twig.
*/
Item.prototype.seeds = {
	'DocAlley'  : DocAlley,
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-.       .
 ` | |   ,-. |- ,-.
   | |-. | | |  |-'
  ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 a note

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Note(master) {
	if (master && !(master instanceof Note) && master.type !== 'Note') {
		throw new Error(type + ' master typed wrongly: '+master.type);
	}
	// @03 check if master has other keys.

	Item.call(this, {
			type  : 'Note',
			doc   : new this.seeds.DocAlley(master && master.doc),
			zone  : new Rect(master.zone),
		});

	this.zone = this._twigs.zone; // @03 dont
}
subclass(Note, Item);

/**
| Type
*/
Note.prototype.type = 'Note';

/**
| Sets the value of a node.
*/
Note.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');

	if (isPath(path)) {
		a0 = path.fit(a0, false);
		al = path.fit(al, true);
	}

	if (path === 'zone' || path.get(a0) === 'zone') {
		if (a0 + 1 === al) {
			this.zone = new Rect(val);
		} else {
			this.zone = this.zone.mmSet(path, val, a0 + 1, al, true);
		}
		return;
	}
	if (a0 + 1 === al) throw new Error('Cannot set '+this.type+'.'+path.get(a0)+' itself');
	Stem.prototype.mmSet.call(this, path, val, a0, al);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,       .       .
  )   ,-. |-. ,-. |
 /    ,-| | | |-' |
 `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A Label

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Label(master) {
	if (master && !(master instanceof Label) && master.type !== 'Label') {
		throw new Error(type + ' master typed wrongly: '+master.type);
	}
	// @03 check if master has other keys.

	Item.call(this, {
			type : 'Label',
			doc  : new this.seeds.DocAlley(master && master.doc),
			pnw  : new Point(master.pnw),
		});

	this.pnw = this._twigs.pnw; // @03 dont
}
subclass(Label, Item);

/**
| Type
*/
Label.prototype.type = 'Label';

/**
| Sets the value of a node.
*/
Label.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (oplace) throw new Error('out of place not yet supported');

	if (isPath(path)) {
		a0 = path.fit(a0, false);
		al = path.fit(al, true);
	}

	if (path === 'zone' || path.get(a0) === 'zone') {
		if (a0 + 1 === al) {
			this.zone = new Rect(val);
		} else {
			this.zone = this.zone.mmSet(path, val, a0 + 1, al, true);
		}
		return;
	}
	if (a0 + 1 === al) throw new Error('Cannot set '+this.type+'.'+path.get(a0)+' itself');
	Stem.prototype.mmSet.call(this, path, val, a0, al);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ,.               ,.   .  .
    / |   ,-. ,-.    / |   |  |  ,-. . .
   /~~|-. |   |     /~~|-. |  |  |-' | |
 ,'   `-' '   `-' ,'   `-' `' `' `-' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                     `-'
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
 .-,--.              ,.   .  .
 ' |   \ ,-. ,-.    / |   |  |  ,-. . .
 , |   / | | |     /~~|-. |  |  |-' | |
 `-^--'  `-' `-' ,'   `-' `' `' `-' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~/| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                    `-'
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
 .-,--.
  '|__/ ,-. ,-. ,-.
  ,|    ,-| |   ,-|
  `'    `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A paragraph

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Para(master) {
	Stem.call(this, {type : 'Para'}, master);
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
 .-,--.         .
  `|__/ ,-. ,-. |-
  )| \  |-' |   |
  `'  ` `-' `-' `'
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

/**
| Since rects are immutable, they have no cogs.
*/
Rect.prototype.noCogs = true;

/**
| Returns a new rectangle with changed value.
| Thus supports only out-of-place operations.
*/
Rect.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (!oplace) throw new Error('Rect can only be set out of place');
	var key;

	if (isString(path)) {
		key = path;
	} else {
		if (!isPath(path)) throw new Error('mmSet path no string or path');
		a0 = path.fit(a0, false);
		al = path.fit(al, true);
		key = path.get(a0);
	}

	switch(key) {
	case 'pnw': break;
	case 'pse': break;
	default : throw reject('path goes nowhere (Rect:mmSet)');
	}

	var npoint;
	if ((!(path instanceof Path)) || a0 + 1 === al) {
		npoint = new Point(val);
	} else {
		npoint = this[key].mmSet(path, val, a0 + 1, al, true);
	}

	return new Rect(
		key === 'pnw' ? npoint : this.pnw,
		key === 'pse' ? npoint : this.pse);
}

/**
| Returns the value the path points at.
*/
Rect.prototype.get = function(path, a0, al) {
	if (isString(path)) return this[path];
	if (!isPath(path)) throw new Error('get path no string or path');

	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var twig = this[path.get(a0)];
	if (a0 + 1 === al) return twig;
	if (!twig || !twig.get) throw reject('path goes nowhere (Rect)');
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
 .-,--.           .
  '|__/ ,-. . ,-. |-
  ,|    | | | | | |
  `'    `-' ' ' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A Points inherits Fabric.Point and is immutable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function Point(master) {
	Fabric.Point.call(this, master.x, master.y);
}
subclass(Point, Fabric.Point);

/**
| Returns a new rectangle with changed value.
| Thus supports only out-of-place operations.
*/
Point.prototype.mmSet = function(path, val, a0, al, oplace) {
	if (!oplace) throw new Error('Point can only be set out of place');

	var key;
	if (isString(path)) {
		key = path;
	} else {
		if (!isPath(path)) throw new Error('mmSet path no string or path');
		a0 = path.fit(a0, false);
		al = path.fit(al, true);
		key = path.get(a0);
	}

	switch(key) {
	case 'x': break;
	case 'y': break;
	default : throw reject('path goes nowhere (Point:mmSet)');
	}

	return new Point(
		key === 'x' ? val : this.x,
		key === 'y' ? val : this.y);
}

/**
| Returns the value the path points at.
*/
Point.prototype.get = function(path, a0, al) {
	if (isString(path)) return this[path];
	if (!isPath(path)) throw new Error('get path no string or path');

	a0 = path.fit(a0, false);
	al = path.fit(al, true);
	var twig = this[path.get(a0)];
	if (a0 + 1 !== al) throw reject('path goes nowhere (Point)');
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

