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
                    ,-_/ .
                    '  | |- ,-. ,-,-.
                    .^ | |  |-' | | |
                    `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of Note, Label and Relation.

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
var Action;
var Compass;
var Jools;
var OvalSlice;
var Path;
var Rect;
var shell;
var system;
var theme;
var View;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shotcuts
*/
var abs      = Math.abs;
var Base     = Visual.Base;
var debug    = Jools.debug;
var Doc      = Visual.Doc;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var half     = Jools.half;
var subclass = Jools.subclass;
var ro       = Math.round;

/**
| Constructor
*/
var Item = Visual.Item = function(twig, path) {
	Base.call(this, twig, path);

	if (this.$sub !== null) { throw new Error('iFail'); }
	this.$sub = {
		doc : new Doc(twig.doc, new Path(path, '++', 'doc'))
	};

	this._$ovalslice = null;
	this.$fabric   = null;
	this.$handles  = {};
};
subclass(Item, Base);


/**
| Updates the $sub to match a new twig.
*/
Item.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var doc = this.$sub.doc;
	if (doc.twig !== twig.doc) {
		doc.update(twig.doc);
	}
};

/**
| Return the handle oval slice.
*/
Item.prototype.getOvalSlice = function() {
	var zone = this.getZone();
	if (this._$ovalslice && this._$ovalslice.psw.eq(zone.pnw)) return this._$ovalslice;
	return this._$ovalslice = new OvalSlice(zone.pnw, theme.ovalmenu.dimensions);
};

/**
| Returns if point is within the item menu
*/
Item.prototype.withinItemMenu = function(view, p) {
	return this.getOvalSlice().within(system.fabric, view, p);
};

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| TODO rename
*/
Item.prototype.checkItemCompass = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var $h     = this.planHandles(view); // TODO use planHandles and cache
	var f      = shell.fabric;
	var d8cwcf = Compass.dir8CWCF;

	for(var a = 0, aZ = d8cwcf.length; a < aZ; a++) {
		var d = d8cwcf[a];
		var z = $h[d];

		if (!z)
			{ continue; }

		if (!z.within(p))
			{ continue; }

		if (f.within(this, 'pathHandle', view, p, z))
			{ return d; }
	}
	return null;
};

/**
| TODO
*/
Item.prototype.planHandles = function(view) {
	var ha = this.handles;
	var zone = view.rect(this.getZone());
	var $h = this.$handles;
	if ($h.zone && zone.eq($h.zone) && view.eq($h.view))
		{ return $h; }

	var wx  = zone.pnw.x;
	var ny  = zone.pnw.y;
	var ex  = zone.pse.x;
	var sy  = zone.pse.y;
	var mx = half(wx + ex);
	var my = half(ny + sy);

	var dcx = theme.handle.cdistance;
	var dcy = theme.handle.cdistance;
	var dex = theme.handle.edistance;
	var dey = theme.handle.edistance;

	var a  = Math.min(ro((zone.width  + 2 * dcx) / 6), theme.handle.maxSize);
	var b  = Math.min(ro((zone.height + 2 * dcy) / 6), theme.handle.maxSize);
	var a2 = 2*a;
	var b2 = 2*b;

	if (dcx > a) { dex -= half(dcx - a); dcx = a; }
	if (dcy > b) { dey -= half(dcy - b); dcy = b; }

	return this.$handles = {
		// ellipse bezier height
		bb : ro(b / 0.75),
		zone : zone,
		view : view,

		nw : ha.nw && Rect.renew(
				wx - dcx,      ny - dcy,
				wx - dcx + a2, ny - dcy + b2,
				$h.nw
			),
		n  : ha.n && Rect.renew(
				mx - a,        ny - dey,
				mx + a,        ny - dey + b2,
				$h.n
			),
		ne : ha.ne && Rect.renew(
				ex + dcx - a2, ny - dcy,
				ex + dex,      ny - dcy + b2,
				$h.ne
			),
		e  : ha.e && Rect.renew(
				ex + dex - a2, my - b,
				ex + dex     , my + b,
				$h.e
			),
		se : ha.se && Rect.renew(
				ex + dcx - a2, sy + dcy - b2,
				ex + dcx,      sy + dcx,
				$h.se
			),
		s  : ha.s && Rect.renew(
				mx - a, sy + dey -b2,
				mx + a, sy + dey,
				$h.s
			),
		sw : ha.sw && Rect.renew(
				wx - dcx,      sy + dcy - b2,
				wx - dcx + a2, sy + dcy,
				$h.sw
			),
		w  : ha.w && Rect.renew(
				wx - dex,      my - b,
				wx - dex + a2, my + b,
				$h.w
			)
	};
};


/**
| Paths all resize handles.
*/
Item.prototype.pathAllHandles = function(fabric, border, twist, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	if (border !== 0) throw new Error('borders unsupported for handles');

	var $h = this.planHandles(view);
	var d8cwcf = Compass.dir8CWCF;

	for(var a = d8cwcf.length - 1; a >= 0; a--) {
		var d = d8cwcf[a];
		var z = $h[d];

		if (!z)
			{ continue; }

		this.pathHandle(fabric, border, twist, view, z);
	}
};

/**
| Paths one or all resize handles.
*/
Item.prototype.pathHandle = function(fabric, border, twist, view, zone) {
	var bb = this.$handles.bb;
	fabric.moveTo(zone.w);
	fabric.beziTo(0, -bb, 0, -bb, zone.e);
	fabric.beziTo(0, +bb, 0, +bb, zone.w);
};

/**
| Draws the handles of an item (resize, itemmenu)
*/
Item.prototype.drawHandles = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var sbary = this.scrollbarY;
	if (sbary && sbary.visible) {
		var area = sbary.getArea(view);
		fabric.reverseClip(area, 'path', View.proper, -1);
	}

	fabric.reverseClip(this.getSilhoutte(this.getZone(), false), 'path', view, -1);

	// draws the resize handles
	fabric.paint(theme.handle.style, this, 'pathAllHandles', view);

	// draws item menu handler
	fabric.paint(theme.ovalmenu.slice, this.getOvalSlice(), 'path', view);

	fabric.deClip();
};

/**
| Returns the para at point. TODO, honor scroll here.
*/
Item.prototype.getParaAtPoint = function(p) {
	// TODO rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.$sub.doc.getParaAtPoint(p);
};

/**
| Dragstart.
| Checks if a dragstart targets this item.
*/
Item.prototype.dragstart = function(view, p, shift, ctrl, access) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var sbary = this.scrollbarY;
	if (sbary && sbary.within(view, p)) {
		shell.startAction(
			Action.SCROLLY, 'space',
			'itemPath', this.path,
			'start',    p,
			'startPos', sbary.getPos()
		);
		return true;
	}

	var vp = view.depoint(p);
	if (!this.getZone().within(vp)) return false;

	shell.redraw = true;

	if (ctrl && access == 'rw') {
		// relation binding
		shell.startAction(
			Action.RELBIND, 'space',
			'itemPath', this.path,
			'start',    p
		);
		return true;
	}

	// scrolling or dragging
	if (access == 'rw')
		{ shell.$space.setFocus(this); }

	var pnw = this.getZone().pnw;
	if (access == 'rw') {
		shell.startAction(
			Action.ITEMDRAG, 'space',
			'itemPath', this.path,
			'start', vp,
			'move',  vp
		);
	} else {
		return false;
	}

	return true;
};

/**
| A move during an action.
*/
Item.prototype.actionmove = function(view, p, shift, ctrl) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var $action = shell.$action;
	var vp      = view.depoint(p);

	switch ($action.type) {
	case Action.RELBIND    :
		if (!this.getZone().within(vp)) return false;
		$action.move = p;
		$action.item2Path = this.path;
		shell.redraw = true;
		return true;
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
		$action.move = vp;
		shell.redraw = true;
		return true;
	case Action.SCROLLY :
		var start = $action.start;
		var dy    = p.y - start.y;
		var vitem = shell.$space.getSub($action.itemPath);
		var sbary = vitem.scrollbarY;
		var spos  = $action.startPos + sbary.scale(dy);
		vitem.setScrollbar(spos);
		vitem.poke();
		shell.redraw = true;
		return true;
	default :
		throw new Error('invalid actionmove');
	}
	return true;
};

/**
| Sets the items position and size after an action.
*/
Item.prototype.actionstop = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	var vp = view.depoint(p);

	var $action = shell.$action;
	switch ($action.type) {
	case Action.RELBIND :
		if (!this.getZone().within(vp)) return false;
		var $space = shell.getSub('space', this.path, -1);
		Visual.Relation.create($space, $space.getSub($action.itemPath), this);
		shell.redraw = true;
		return true;
	default :
		return false;
	}
};


/**
| Mouse is hovering around.
| Checks if this item reacts on this.
*/
Item.prototype.mousehover = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	if (p === null) { return null; }

	var sbary = this.scrollbarY;
	if (sbary && sbary.within(view, p))
		{ return 'default'; }

	var vp = view.depoint(p);
	if (!this.getZone().within(vp)) return null;

	return 'default';
};

/**
| Sees if this item reacts on a click event.
*/
Item.prototype.click = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var vp = view.depoint(p);
	if (!this.getZone().within(vp)) return false;

	var $space = shell.$space;
	var focus  = $space.focusedItem();
	if (focus !== this) {
		$space.setFocus(this);
		shell.selection.deselect();
	}
	shell.redraw = true;

	var pnw = this.getZone().pnw;
	var pi = vp.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));

	var para = this.getParaAtPoint(pi);
	if (para) {
		var ppnw   = this.$sub.doc.getPNW(para.key);
		var at1    = para.getPointOffset(pi.sub(ppnw));
		var caret  = shell.caret;

		caret = shell.setCaret(
			'space',
			{
				path : para.textPath(),
				at1  : at1
			}
		);

		caret.show();
		shell.selection.deselect();
	}
	return true;
};

/**
| Highlights the item.
*/
Item.prototype.highlight = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var silhoutte = this.getSilhoutte(this.getZone(), false);
	fabric.edge(theme.note.style.highlight, silhoutte, 'path', view);
};

/**
| Called by subvisuals when they got changed.
*/
Item.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};

/**
| Force-clears all caches.
*/
Item.prototype.knock = function() {
	this.$fabric = null;
	this.$sub.doc.knock();
};

})();
