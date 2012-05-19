/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                    ,.   ,. .-,--.
                                    `|  /   ' |   \ ,-. ,-.
                                     | /    , |   / | | |
                                     `'     `-^--'  `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A sequence of visual paragraph.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VDoc      = null;

/**
| Imports
*/
var Fabric;
var Jools;
var Path;
var VPara;
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
var Point     = Fabric.Point;
var ro        = Math.round;
var subclass  = Jools.subclass;

/**
| Constructor.
*/
VDoc = function(twig, path) {
	this.twig  = twig;
	this.path  = path;
	this.key   = path.get(-1);

	this.pnws  = null;
	var vv = this.vv = [];

	var ranks = twig.ranks;
	var copse = twig.copse;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var k = ranks[r];
		vv[k] = new VPara(copse[k], new Path(path, '++', k));
	}
};

/**
| Returns the vtwig at rank 'rank'.
*/
VDoc.prototype.vAtRank = function(rank) {
	return this.vv[this.twig.ranks[rank]];
};

/**
| Updates v-vine to match a new twig.
*/
VDoc.prototype.update = function(twig) {
	this.twig = twig;
	var vo = this.vv;
	var vv = this.vv = {};
	var copse = twig.copse;
	for(var k in copse) {
		var sub = twig.copse[k];
		var o = vo[k];
		if (is(o)) {
			if (o.twig !== sub) {
				o.update(sub);
			}
			vv[k] = o;
		} else {
			o = new VPara(sub, new Path(this.path, '++', k));
			o.update(sub);
			vv[k] = o;
		}
	}
};

/**
| Draws the document on a fabric.
|
| fabric:  to draw upon.
| width:   the width to draw the document with.
| imargin: distance of text to edge
| scrollp: scroll position
*/
VDoc.prototype.draw = function(fabric, width, imargin, scrollp) {
	// @@ <pre>
	var paraSep = this.getParaSep();
	var select = shell.selection;

	// draws the selection
	if (select.active && this.path.subPathOf(select.sign1.path)) {
		fabric.paint(theme.selection.style, this, 'pathSelection', width, imargin, scrollp);
	}

	var y = imargin.n;
	var pnws = {};   // north-west points of paras

	// draws the paragraphs
	var twig = this.twig;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.vAtRank(r);
		var flow = vpara.getFlow();

		pnws[twig.ranks[r]] = new Point(imargin.w, ro(y));
		fabric.drawImage(vpara.getFabric(), imargin.w, ro(y - scrollp.y));
		y += flow.height + paraSep;
	}
	this.pnws = pnws;   // north-west points of paras
};

VDoc.prototype.getPNW = function(key) {
	return this.pnws[key];
};

/**
| Returns the height of the document.
| @@ caching
*/
VDoc.prototype.getHeight = function() {
	var fontsize = this.getFontSize();
	var paraSep  = this.getParaSep();
	var twig     = this.twig;
	var vv       = this.vv;
	var height   = 0;
	for (var r = 0, rZ = twig.length; r < rZ; r++) {
		var vpara = this.vAtRank(r);

		var flow = vpara.getFlow();
		if (r > 0) { height += paraSep; }
		height += flow.height;
	}
	height += ro(fontsize * theme.bottombox);
	return height;
};

/**
| Returns the width actually used of the document.
*/
VDoc.prototype.getSpread = function() {
	var spread = 0;
	for (var r = 0, rZ = this.twig.length; r < rZ; r++) {
		spread = max(spread, this.vAtRank(r).getFlow().spread);
	}
	return spread;
};

/**
| Returns the (default) fontsize for this document
| Argument vitem is optional, just to safe double and tripple lookups
*/
VDoc.prototype.getFontSize = function(vitem) {
	if (!is(vitem)) { vitem = shell.vspace.vget(this.path, -1); }
	var fontsize = vitem.twig.fontsize;
	return (!vitem.fontSizeChange) ? fontsize : vitem.fontSizeChange(fontsize);
};

/**
| Returns the (default) paraSeperator for this document
| Argument vitem is optional, just to safe double and tripple lookups
*/
VDoc.prototype.getParaSep = function(vitem) {
	if (!is(vitem)) { vitem = shell.vspace.vget(this.path, -1); }
	var fontsize = this.getFontSize(vitem);
	return vitem.getParaSep(fontsize);
};

/**
| Returns the default font for the document.
*/
VDoc.prototype.getFont = function() {
	return this.getFontSize() + 'px ' + theme.defaultFont;
};

/**
| Returns the paragraph at point
*/
VDoc.prototype.getVParaAtPoint = function(p) {
	var twig   = this.twig;
	var vv     = this.vv;

	for(var r = 0, rZ = twig.length; r < rZ; r++) {
		// TODO beautify
		var k = twig.ranks[r];
		var vpara = vv[k];
		var flow = vpara.getFlow();
		var pnw = this.pnws[k];
		if (p.y < pnw.y + flow.height) return vpara;
	}
	return null;
};

/**
| Paths a selection
|
| fabric  : the fabric to path for
| border  : width of the path (ignored)
| twist   : paramter for beginPath()
|           +0.5 to everything for line pathing
| width   : width the vdoc is drawn
| imargin : inner margin of the doc
| scrollp : scroll position of the doc.
*/
VDoc.prototype.pathSelection = function(fabric, border, twist, width, imargin, scrollp) {
	var select = shell.selection;
	select.normalize();

	var sp = scrollp;

	var s1 = select.begin;
	var s2 = select.end;

	var key1 = s1.path.get(-2);
	var key2 = s2.path.get(-2);

	var pnw1 = this.getPNW(key1);
	var pnw2 = this.getPNW(key2);

	var vpara1 = this.vv[key1];
	var vpara2 = this.vv[key2];

	var p1 = vpara1.getOffsetPoint(s1.at1);
	var p2 = vpara2.getOffsetPoint(s2.at1);

	p1 = new Point(ro(p1.x + pnw1.x - sp.x), ro(p1.y + pnw1.y - sp.y));
	p2 = new Point(ro(p2.x + pnw2.x - sp.x), ro(p2.y + pnw2.y - sp.y));

	var fontsize = this.getFontSize();
	fabric.beginPath(twist);
	var descend = ro(fontsize * theme.bottombox);
	var  ascend = ro(fontsize);
	var rx = width - imargin.e;
	var lx = imargin.w;
	if ((abs(p2.y - p1.y) < 2)) {
		// ***
		fabric.moveTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(p1.x, p1.y + descend);
	} else if (abs(p1.y + fontsize + descend - p2.y) < 2 && (p2.x <= p1.x))  {
		//      ***
		// ***
		fabric.moveTo(rx,   p1.y -  ascend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(rx,   p1.y + descend);

		fabric.moveTo(lx,   p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);
	} else {
		//    *****
		// *****
		fabric.moveTo(rx,   p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y -  ascend);
		fabric.lineTo(p2.x, p2.y + descend);
		fabric.lineTo(lx,   p2.y + descend);

		if (twist) {
			fabric.moveTo(lx, p1.y + descend);
		} else {
			fabric.lineTo(lx, p1.y + descend);
		}
		fabric.lineTo(p1.x, p1.y + descend);
		fabric.lineTo(p1.x, p1.y -  ascend);
		fabric.lineTo(rx,   p1.y -  ascend);
		if (!twist) {
			fabric.lineTo(rx, p2.y - ascend);
		}
	}
};

})();
