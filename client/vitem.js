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

                                       ,.   ,.,-_/ .
                                       `|  /  '  | |- ,-. ,-,-.
                                        | /   .^ | |  |-' | | |
                                        `'    `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of VNote, VLabel, VRelation.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VItem     = null;

/**
| Imports
*/
var Action;
var Fabric;
var Jools;
var OvalSlice;
var Path;
var shell;
var system;
var theme;
var VDoc;
var View;
var VRelation;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shotcuts
*/
var abs    = Math.abs;
var debug  = Jools.debug;
var immute = Jools.immute;
var is     = Jools.is;
var isnon  = Jools.isnon;
var half   = Jools.half;
var ro     = Math.round;

/**
| Constructor
*/
VItem = function(twig, path) {
	this._$ovalslice = null;
	this.twig        = twig;
	this.path        = path;
	this.key         = path.get(-1);
	this.vv          = immute({
		doc : new VDoc(twig.doc, new Path(path, '++', 'doc'))
	});

	// caching
	this.$fabric   = null;
};

/**
| Updates the vvine to match a new twig.
*/
VItem.prototype.update = function(twig) {
	this.twig    = twig;
	this.$fabric = null;

	var vdoc = this.vv.doc;
	if (vdoc.twig !== twig.doc) {
		vdoc.update(twig.doc);
	}
};

/**
| Return the handle oval slice.
*/
VItem.prototype.getOvalSlice = function() {
	var zone = this.getZone();
	if (this._$ovalslice && this._$ovalslice.psw.eq(zone.pnw)) return this._$ovalslice;
	return this._$ovalslice = new OvalSlice(zone.pnw, theme.ovalmenu.dimensions);
};

/**
| Returns if point is within the item menu
*/
VItem.prototype.withinItemMenu = function(view, p) {
	return this.getOvalSlice().within(system.fabric, view, p);
};

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| TODO rename
*/
VItem.prototype.checkItemCompass = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var ha = this.handles;
	var zone = view.rect(this.getZone());

	if (!ha) return null;
	var d   =       theme.handle.size; // distance
	var din = 0.5 * theme.handle.size; // inner distance
	var dou =       theme.handle.size; // outer distance

	var wx = zone.pnw.x;
	var ny = zone.pnw.y;
	var ex = zone.pse.x;
	var sy = zone.pse.y;

	var n = p.y >= ny - dou && p.y <= ny + din;
	var e = p.x >= ex - din && p.x <= ex + dou;
	var s = p.y >= sy - din && p.y <= sy + dou;
	var w = p.x >= wx - dou && p.x <= wx + din;

	if (n) {
		if (w && ha.nw) return 'nw';
		if (e && ha.ne) return 'ne';
		if (ha.n && abs(p.x - zone.pc.x) <= d) return 'n';
		return null;
	}
	if (s) {
		if (w && ha.sw) return 'sw';
		if (e && ha.se) return 'se';
		if (ha.s && abs(p.x - zone.pc.x) <= d) return 's';
		return null;
	}
	if (w && ha.w && abs(p.y - zone.pc.y) <= d) return 'w';
	if (e && ha.e && abs(p.y - zone.pc.y) <= d) return 'e';
	return null;
};

/**
| Paths the resize handles.
*/
VItem.prototype.pathResizeHandles = function(fabric, border, twist, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	if (border !== 0) throw new Error('borders unsupported for handles');

	var ha = this.handles;
	var zone = view.rect(this.getZone());
	var wx  = zone.pnw.x;
	var ny  = zone.pnw.y;
	var ex  = zone.pse.x;
	var sy  = zone.pse.y;
	var mx = half(wx + ex);
	var my = half(ny + sy);

	var dx = theme.handle.distance;
	var dy = theme.handle.distance;

	
	var a  = Math.min(ro((zone.width  + 2 * dx) / 6), theme.handle.maxSize);
	var b  = Math.min(ro((zone.height + 2 * dy) / 6), theme.handle.maxSize);
	var bb = ro(b / 0.75);

	if (dx > a) { dx = a; }
	if (dy > b) { dy = b; }

	if (ha.nw) {
		fabric.moveTo(                wx - dx,         ny - dy + b);
		fabric.beziTo(0, -bb, 0, -bb, wx - dx + 2 * a, ny - dy + b);
		fabric.beziTo(0, +bb, 0, +bb, wx - dx,         ny - dy + b);
	}
	
	if (ha.n) {
		fabric.moveTo(                mx - a,          ny - dy + b);
		fabric.beziTo(0, -bb, 0, -bb, mx + a,          ny - dy + b);
		fabric.beziTo(0, +bb, 0, +bb, mx - a,          ny - dy + b);
	}

	if (ha.ne) {
		fabric.moveTo(                ex + dx - 2 * a, ny - dy + b);
		fabric.beziTo(0, -bb, 0, -bb, ex + dx,         ny - dy + b);
		fabric.beziTo(0, +bb, 0, +bb, ex + dx - 2 * a, ny - dy + b);
	}
	
	if (ha.e) {
		fabric.moveTo(                ex + dx - 2 * a, my);
		fabric.beziTo(0, -bb, 0, -bb, ex + dx,         my);
		fabric.beziTo(0, +bb, 0, +bb, ex + dx - 2 * a, my);
	}

	if (ha.se) {
		fabric.moveTo(                ex + dx - 2 * a, sy + dy - b);
		fabric.beziTo(0, -bb, 0, -bb, ex + dx,         sy + dy - b);
		fabric.beziTo(0, +bb, 0, +bb, ex + dx - 2 * a, sy + dy - b);
	}
	
	if (ha.s) {
		fabric.moveTo(                mx - a,          sy + dy - b);
		fabric.beziTo(0, -bb, 0, -bb, mx + a,          sy + dy - b);
		fabric.beziTo(0, +bb, 0, +bb, mx - a,          sy + dy - b);
	}
	
	if (ha.sw) {
		fabric.moveTo(                wx - dx,         sy + dy - b);
		fabric.beziTo(0, -bb, 0, -bb, wx - dx + 2 * a, sy + dy - b);
		fabric.beziTo(0, +bb, 0, +bb, wx - dx,         sy + dy - b);
	}

	if (ha.w) {
		fabric.moveTo(                wx - dx,          my);
		fabric.beziTo(0, -bb, 0, -bb, wx - dx + 2 * a,  my);
		fabric.beziTo(0, +bb, 0, +bb, wx - dx,          my);
	}
};

/**
| Draws the handles of an item (resize, itemmenu)
*/
VItem.prototype.drawHandles = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }


	
	if (this.scrollbarY && this.scrollbarY.visible) {
		var sbary = this.scrollbarY;
		var area = sbary.getArea(view);
		fabric.reverseClip(area, 'path', View.proper, -1);
	}
	
	fabric.reverseClip(this.getSilhoutte(this.getZone(), false), 'path', view, -1);

	// draws the resize handles
	fabric.paint(theme.handle.style, this, 'pathResizeHandles', view);

	fabric._cx.beginPath();

	// draws item menu handler
	fabric.paint(theme.ovalmenu.slice, this.getOvalSlice(), 'path', view);

	fabric.deClip();
};

/**
| Returns the para at point. TODO, honor scroll here.
*/
VItem.prototype.getVParaAtPoint = function(p) {
	// TODO rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.vv.doc.getVParaAtPoint(p);
};

/**
| Dragstart.
| Checks if a dragstart targets this item.
*/
VItem.prototype.dragstart = function(view, p, shift, ctrl, access) {
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
		return;
	}

	// scrolling or dragging
	if (access == 'rw')
		{ shell.vspace.setFocus(this); }

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
VItem.prototype.actionmove = function(view, p, shift, ctrl) {
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
		var vitem = shell.vspace.vget($action.itemPath);
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
VItem.prototype.actionstop = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	var vp = view.depoint(p);

	var $action = shell.$action;
	switch ($action.type) {
	case Action.RELBIND :
		if (!this.getZone().within(vp)) return false;
		var vspace = shell.vspace.vget(this.path, -1);
		VRelation.create(vspace, vspace.vget($action.itemPath), this);
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
VItem.prototype.mousehover = function(view, p) {
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
VItem.prototype.click = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var vp = view.depoint(p);
	if (!this.getZone().within(vp)) return false;

	var vspace = shell.vspace;
	var focus  = vspace.focusedVItem();
	if (focus !== this) {
		vspace.setFocus(this);
		shell.selection.deselect();
	}
	shell.redraw = true;

	var pnw = this.getZone().pnw;
	var pi = vp.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));

	var vpara = this.getVParaAtPoint(pi);
	if (vpara) {
		var ppnw   = this.vv.doc.getPNW(vpara.key);
		var at1    = vpara.getPointOffset(pi.sub(ppnw));
		var caret  = shell.caret;

		caret = shell.setCaret(
			'space',
			{
				path : vpara.textPath(),
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
VItem.prototype.highlight = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var silhoutte = this.getSilhoutte(this.getZone(), false);
	fabric.edge(theme.note.style.highlight, silhoutte, 'path', view);
};

/**
| Called by subvisuals when they got changed.
*/
VItem.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};

/**
| Force-clears all caches.
*/
VItem.prototype.knock = function() {
	this.$fabric = null;
	this.vv.doc.knock();
};

})();
