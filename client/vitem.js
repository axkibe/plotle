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
var abs           = Math.abs;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var half          = Jools.half;

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
VItem.prototype.getOvalSlice = function(NOVIEW) {
	if (NOVIEW instanceof View) { throw new Error('NOVIEW'); }

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
| @@ rename
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
	var pnw = zone.pnw;
	var pse = zone.pse;

	var ds = theme.handle.distance;
	var hs = theme.handle.size;
	var hs2 = half(hs);

	var x1 = pnw.x - ds;
	var y1 = pnw.y - ds;
	var x2 = pse.x + ds;
	var y2 = pse.y + ds;
	var xm = half(x1 + x2);
	var ym = half(y1 + y2);

	fabric.beginPath(twist);
	if (ha.n ) {
		fabric.moveTo(xm - hs2, y1);
		fabric.lineTo(xm + hs2, y1);
	}
	if (ha.ne) {
		fabric.moveTo(x2 - hs,  y1);
		fabric.lineTo(x2, y1);
		fabric.lineTo(x2, y1 + hs);
	}
	if (ha.e ) {
		fabric.moveTo(x2, ym - hs2);
		fabric.lineTo(x2, ym + hs2);
	}
	if (ha.se) {
		fabric.moveTo(x2, y2 - hs);
		fabric.lineTo(x2, y2);
		fabric.lineTo(x2 - hs, y2);
	}
	if (ha.s ) {
		fabric.moveTo(xm - hs2, y2);
		fabric.lineTo(xm + hs2, y2);
	}
	if (ha.sw) {
		fabric.moveTo(x1 + hs, y2);
		fabric.lineTo(x1, y2);
		fabric.lineTo(x1, y2 - hs);
	}
	if (ha.w ) {
		fabric.moveTo(x1, ym - hs2);
		fabric.lineTo(x1, ym + hs2);
	}
	if (ha.nw) {
		fabric.moveTo(x1, y1 + hs);
		fabric.lineTo(x1, y1);
		fabric.lineTo(x1 + hs, y1);
	}
};

/**
| Draws the handles of an item (resize, itemmenu)
*/
VItem.prototype.drawHandles = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	// draws the resize handles
	fabric.edge(theme.handle.style.edge, this, 'pathResizeHandles', view);

	// draws item menu handler
	fabric.paint(theme.ovalmenu.slice, this.getOvalSlice(), 'path', view);
};

/**
| Returns the para at point. @@, honor scroll here.
*/
VItem.prototype.getVParaAtPoint = function(p, action) {
	// @@ rename imargin to innerMargin
	if (p.y < this.imargin.n) return null;
	return this.vv.doc.getVParaAtPoint(p, action);
};

/**
| Dragstart.
| Checks if a dragstart targets this item.
*/
VItem.prototype.dragstart = function(view, p, shift, ctrl, access) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var vp = view.depoint(p);
	if (!this.getZone().within(vp)) return false;

	shell.redraw = true;

	if (ctrl && access == 'rw') {
		// relation binding
		shell.startAction(Action.RELBIND, this, p);
		return;
	}

	// scrolling or dragging
	if (access == 'rw')
		{ shell.vspace.setFocus(this); }

	var sbary = this.scrollbarY;
	var pnw = this.getZone().pnw;
	var pr = vp.sub(pnw);
	if (sbary && sbary.within(pr)) {
		var action = shell.startAction(Action.SCROLLY, this, p);
		action.startPos = sbary.getPos();
	} else {
		if (access == 'rw') {
			shell.startAction(Action.ITEMDRAG, this, vp);
		} else {
			shell.startAction(Action.PAN, null, p);
		}
	}
	return true;
};

/**
| dragmove?
*/
VItem.prototype.dragmove = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	// no general zone test, since while dragmoving the item might be fixed by the action.
	var action = shell.action;
	var vp = view.depoint(p);

	switch (action.type) {
	case Action.RELBIND    :
		if (!this.getZone().within(vp)) return false;
		action.move = p;
		action.vitem2 = this;
		shell.redraw = true;
		return true;
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
		action.move = vp;
		shell.redraw = true;
		return true;
	case Action.SCROLLY :
		var start = action.start;
		var dy = p.y - start.y;
		var vitem = action.vitem;
		var sbary = vitem.scrollbarY;
		var spos = action.startPos + sbary.scale(dy);
		vitem.setScrollbar(spos);
		vitem.poke();
		shell.redraw = true;
		return true;
	default :
		throw new Error('invalid dragmove');
	}
	return true;
};

/**
| Sets the items position and size after an action.
*/
VItem.prototype.dragstop = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }
	var vp = view.depoint(p);

	var action = shell.action;
	switch (action.type) {
	case Action.RELBIND :
		if (!this.getZone().within(vp)) return false;
		var vspace = shell.vspace.vget(this.path, -1);
		VRelation.create(vspace, action.vitem, this);
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
