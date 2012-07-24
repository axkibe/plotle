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
                        .-,--.
                        ' |   \ ,-. ,-.
                        , |   / | | |
                        `-^--'  `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A sequence of visual paragraphs.

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
var Euclid;
var Jools;
var Path;
var shell;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var abs       = Math.abs;
var debug     = Jools.debug;
var immute    = Jools.immute;
var is        = Jools.is;
var isnon     = Jools.isnon;
var limit     = Jools.limit;
var log       = Jools.log;
var max       = Math.max;
var min       = Math.min;
var Para      = Visual.Para;
var ro        = Math.round;
var subclass  = Jools.subclass;

/**
| Constructor.
*/
var Doc = Visual.Doc = function(twig, path) {
	Visual.Base.call(this, twig, path);

	if (this.$sub !== null) { throw new Error('iFail'); }
	var $sub = this.$sub = [];

	this._$pnws = null;

	var ranks = twig.ranks;
	var copse = twig.copse;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var k = ranks[r];
		$sub[k] = new Para(copse[k], new Path(path, '++', k));
	}
};
subclass(Doc, Visual.Base);

/**
| Returns the vtwig at rank 'rank'.
*/
Doc.prototype.atRank = function(rank) {
	return this.$sub[this.twig.ranks[rank]];
};

/**
| Updates v-vine to match a new twig.
*/
Doc.prototype.update = function(twig) {
	this.twig = twig;
	var $old  = this.$sub;
	var $sub  = this.$sub = {};
	var copse = twig.copse;
	for(var k in copse) {
		var s = twig.copse[k];
		var o = $old[k];
		if (is(o)) {
			if (o.twig !== s) {
				o.update(s);
			}
			$sub[k] = o;
		} else {
			o = new Para(s, new Path(this.$path, '++', k));
			o.update(s);
			$sub[k] = o;
		}
	}
};

/**
| Draws the document on a fabric.
|
| fabric:      to draw upon
| view:        current pan/zoom/motion
| width:       the width to draw the document with.
| innerMargin: distance of text to edge
| scrollp:     scroll position
*/
Doc.prototype.draw = function(fabric, view, width, innerMargin, scrollp) {
	// FIXME <pre>
	var paraSep = this.getParaSep();
	var select = shell.selection;

	// draws the selection
	if (select.active && this.$path.subPathOf(select.sign1.path)) {
		fabric.paint(
			theme.selection.style,
			this,
			'pathSelection',
			view,
			width,
			innerMargin,
			scrollp
		);
	}

	var y = innerMargin.n;
	var pnws = {};   // north-west points of paras

	// draws the paragraphs
	var twig = this.twig;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.atRank(r);
		var flow = vpara.getFlow();

		pnws[twig.ranks[r]] = new Euclid.Point(innerMargin.w, ro(y));
		var p = new Euclid.Point(innerMargin.w, ro(y - scrollp.y));

		vpara.draw(fabric, view, view.point(p));
		y += flow.height + paraSep;
	}
	this._$pnws = pnws;   // north-west points of paras
};

/**
| Force-clears all caches.
*/
Doc.prototype.knock = function() {
	for (var r = 0, rZ = this.twig.length; r < rZ; r++) {
		this.atRank(r).knock();
	}
};

Doc.prototype.getPNW = function(key) {
	return this._$pnws[key];
};

/**
| Returns the height of the document.
| TODO caching
*/
Doc.prototype.getHeight = function() {
	var fs      = this.getFont().size;
	var paraSep = this.getParaSep();
	var twig    = this.twig;

	var height   = 0;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.atRank(r);

		var flow = vpara.getFlow();
		if (r > 0) { height += paraSep; }
		height += flow.height;
	}
	height += ro(fs * theme.bottombox);
	return height;
};

/**
| Returns the width actually used of the document.
*/
Doc.prototype.getSpread = function() {
	var spread = 0;
	for (var r = 0, rZ = this.twig.length; r < rZ; r++) {
		spread = max(spread, this.atRank(r).getFlow().spread);
	}
	return spread;
};

/**
| Returns the (default) paraSeperator for this document.
| Parameter item is optional, just to safe double and tripple lookups.
*/
Doc.prototype.getParaSep = function(item) {

	if (!is(item))
		{ item = shell.$space.getSub(this.$path, -1); }

	var fs = this.getFont().size;
	return item.getParaSep(fs);
};

/**
| Returns the default font for the document.
| Parameter item is optional, just to safe double and tripple lookups.
*/
Doc.prototype.getFont = function(item) {

	// caller can provide item for performance optimization
	if (!is(item))
		{ item = shell.$space.getSub(this.$path, -1); }

	var fs = item.twig.fontsize;
	if (item.fontSizeChange)
		{ fs = item.fontSizeChange(fs); }

	var $f = this._$font;

	if ($f && $f.size === fs)
		{ return $f; }

	return this._$font = new Euclid.Font(
		fs,
		theme.defaultFont,
		'black',
		'start',
		'alphabetic'
	);
};

/**
| Returns the paragraph at point
*/
Doc.prototype.getParaAtPoint = function(p) {
	var twig  = this.twig;
	var $sub  = this.$sub;
	var $pnws = this._$pnws;

	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		var k     = twig.ranks[r];
		var vpara = $sub[k];
		var pnw   = $pnws[k];
		if (p.y < $pnws[k].y + vpara.getFlow().height)
			{ return vpara; }
	}
	return null;
};

/**
| Paths a selection
|
| fabric      : the fabric to path for
| border      : width of the path (ignored)
| width       : width the vdoc is drawn
| innerMargin : inner margin of the doc
| scrollp     : scroll position of the doc.
*/
Doc.prototype.pathSelection = function(fabric, border, twist, view, width, innerMargin, scrollp) {
	var select = shell.selection;
	select.normalize();

	var sp = scrollp;

	var s1 = select.begin;
	var s2 = select.end;

	var key1 = s1.path.get(-2);
	var key2 = s2.path.get(-2);

	var pnw1 = this.getPNW(key1);
	var pnw2 = this.getPNW(key2);

	var vpara1 = this.$sub[key1];
	var vpara2 = this.$sub[key2];

	var p1 = vpara1.locateOffset(s1.at1);
	var p2 = vpara2.locateOffset(s2.at1);

	p1 = new Euclid.Point(ro(p1.x + pnw1.x - sp.x), ro(p1.y + pnw1.y - sp.y));
	p2 = new Euclid.Point(ro(p2.x + pnw2.x - sp.x), ro(p2.y + pnw2.y - sp.y));

	var fontsize = this.getFont().size;
	var descend = ro(fontsize * theme.bottombox);
	var  ascend = ro(fontsize);
	var rx = width - innerMargin.e;
	var lx = innerMargin.w;
	if ((abs(p2.y - p1.y) < 2)) {
		// ***
		fabric.moveTo(p1.x, p1.y + descend, view);
		fabric.lineTo(p1.x, p1.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y + descend, view);
		fabric.lineTo(p1.x, p1.y + descend, view);
	} else if (abs(p1.y + fontsize + descend - p2.y) < 2 && (p2.x <= p1.x))  {
		//      ***
		// ***
		fabric.moveTo(rx,   p1.y -  ascend, view);
		fabric.lineTo(p1.x, p1.y -  ascend, view);
		fabric.lineTo(p1.x, p1.y + descend, view);
		fabric.lineTo(rx,   p1.y + descend, view);

		fabric.moveTo(lx,   p2.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y + descend, view);
		fabric.lineTo(lx,   p2.y + descend, view);
	} else {
		//    *****
		// *****
		fabric.moveTo(rx,   p2.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y -  ascend, view);
		fabric.lineTo(p2.x, p2.y + descend, view);
		fabric.lineTo(lx,   p2.y + descend, view);

		if (twist) {
			fabric.moveTo(lx, p1.y + descend, view);
		} else {
			fabric.lineTo(lx, p1.y + descend, view);
		}

		fabric.lineTo(p1.x, p1.y + descend, view);
		fabric.lineTo(p1.x, p1.y -  ascend, view);
		fabric.lineTo(rx,   p1.y -  ascend, view);
		if (!twist)
			{ fabric.lineTo(rx, p2.y - ascend, view); }
	}
};

})();
