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

                                     ,.   ,             .
                                     `|  /. ,-. . . ,-. |
                                      | / | `-. | | ,-| |
                                      `'  ' `-' `-^ `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The space visualisation and its visualtions of contents.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VItem     = null;
var VNote     = null;
var VLabel    = null;
var VRelation = null;

/**
| Imports
*/
var Action;
var Caret;
var Fabric;
var Jools;
var MeshMashine;
var OvalMenu;
var Path;
var Scrollbar;
var Tree;
var VDoc;

var dbgNoCache;
var settings;
var shell;
var system;
var theme;
var peer;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .           .          .
 \___  |-. ,-. ,-. |- ,-. . . |- ,-.
     \ | | | | |   |  |   | | |  `-.
 `---' ' ' `-' '   `' `-' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var debug         = Jools.debug;
var fixate        = Jools.fixate;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var cos30         = Fabric.cos30;
var half          = Fabric.half;
var OvalFlower    = Fabric.OvalFlower;
var OvalSlice     = Fabric.OvalSlice;
var Line          = Fabric.Line;
var Margin        = Fabric.Margin;
var Measure       = Fabric.Measure;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;

var Signature     = MeshMashine.Signature;


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-_/ .
 `|  /   '  | |- ,-. ,-,-.
  | /    .^ | |  |-' | | |
  `'     `--' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Common base of VNote, VLabel, VRelation.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
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
VItem.prototype.withinItemMenu = function(p) {
	return this.getOvalSlice().within(system.fabric, p);
};

/**
| Returns the compass direction of the handle if p is on a resizer handle.
| @@ rename
*/
VItem.prototype.checkItemCompass = function(p) {
	var ha = this.handles;
	var zone = this.getZone();

	if (!ha) return null;
	var d   =       theme.handle.size; // distance
	var din = 0.5 * theme.handle.size; // inner distance
	var dou =       theme.handle.size; // outer distance

	var n = p.y >= zone.pnw.y - dou && p.y <= zone.pnw.y + din;
	var e = p.x >= zone.pse.x - din && p.x <= zone.pse.x + dou;
	var s = p.y >= zone.pse.y - din && p.y <= zone.pse.y + dou;
	var w = p.x >= zone.pnw.x - dou && p.x <= zone.pnw.x + din;

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
VItem.prototype.pathResizeHandles = function(fabric, border, twist) {
	if (border !== 0) throw new Error('borders unsupported for handles');
	var ha = this.handles;
	var zone = this.getZone();
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
VItem.prototype.drawHandles = function(fabric) {
	// draws the resize handles
	fabric.edge(theme.handle.style.edge, this, 'pathResizeHandles');

	// draws item menu handler
	fabric.paint(theme.ovalmenu.slice, this.getOvalSlice(), 'path');
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
VItem.prototype.dragstart = function(p) {
	if (!this.getZone().within(p)) return false;

	shell.redraw = true;

	if (shell.ctrl) {
		// relation binding
		shell.startAction(Action.RELBIND, this, p);
		system.setCursor('default');
		return true;
	}

	// scrolling or dragging
	shell.vSpace.setFocus(this);
	var sbary = this.scrollbarY;
	var pnw = this.getZone().pnw;
	var pr = p.sub(pnw);
	if (sbary && sbary.visible && sbary.zone.within(pr)) {
		var action = shell.startAction(Action.SCROLLY, this, p);
		action.startPos = sbary.getPos();
	} else {
		shell.startAction(Action.ITEMDRAG, this, p);
		system.setCursor('move');
	}
	return true;
};

/**
| dragmove?
*/
VItem.prototype.dragmove = function(p) {
	// no general zone test, since while dragmoving the item might be fixed by the action.
	var action = shell.action;

	switch (action.type) {
	case Action.RELBIND    :
		if (!this.getZone().within(p)) return false;
		action.move = p;
		action.vitem2 = this;
		shell.redraw = true;
		return true;
	case Action.ITEMDRAG   :
	case Action.ITEMRESIZE :
		action.move = p;
		shell.redraw = true;
		return true;
	case Action.SCROLLY :
		var start = action.start;
		var dy = p.y - start.y;
		var vitem = action.vitem;
		var sbary = vitem.scrollbarY;
		var spos = action.startPos + sbary.max / sbary.zone.height * dy;
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
VItem.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.RELBIND :
		if (!this.getZone().within(p)) return false;
		var vSpace = shell.vget(this.path, -1);
		VRelation.create(vSpace, action.vitem, this);
		system.setCursor('default');
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
VItem.prototype.mousehover = function(p) {
	if (!this.getZone().within(p)) return false;

	system.setCursor('default');
	return true;
};

/**
| Sees if this item reacts on a click event.
*/
VItem.prototype.click = function(p) {
	if (!this.getZone().within(p)) return false;

	var vSpace = shell.vSpace;
	if (vSpace.focus !== this) {
		shell.vSpace.setFocus(this);
		shell.selection.deselect();
	}
	shell.redraw = true;

	var pnw = this.getZone().pnw;
	var pi = p.sub(pnw.x, pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 ));

	var vpara = this.getVParaAtPoint(pi);
	if (vpara) {
		var ppnw   = this.vv.doc.getPNW(vpara.key);
		var at1    = vpara.getPointOffset(pi.sub(ppnw));
		var caret  = shell.caret;
		caret = shell.setCaret(
			new Signature({ path: vpara.textPath(), at1: at1 })
		);
		caret.show();
		shell.selection.deselect();
	}
	return true;
};

/**
| Highlights the item.
*/
VItem.prototype.highlight = function(fabric) {
	var silhoutte = this.getSilhoutte(this.getZone(), false);
	fabric.edge(theme.note.style.highlight, silhoutte, 'path');
};



/**
| Called by subvisuals when they got changed.
*/
VItem.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. ,-,-.       .
 `|  /   ` | |   ,-. |- ,-.
  | /      | |-. | | |  |-'
  `'      ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
VNote = function(twig, path) {
	VItem.call(this, twig, path);
	this.scrollbarY = new Scrollbar();
};
subclass(VNote, VItem);

/**
| Default margin for all notes.
*/
VNote.prototype.imargin = new Margin(theme.note.imargin);

/**
| Resize handles to show on notes.
*/
VNote.prototype.handles = {
	n  : true,
	ne : true,
	e  : true,
	se : true,
	s  : true,
	sw : true,
	w  : true,
	nw : true
};

/**
| Minimum sizes
| TODO no longer needs to be part of the prototype.
*/
VNote.prototype.minWidth  = theme.note.minWidth;
VNote.prototype.minHeight = theme.note.minHeight;

/**
| Returns the notes silhoutte.
|
| zone$:  the cache for the items zone
| zAnchor: if true anchor the silhoute at zero.
*/
VNote.prototype.getSilhoutte = function(zone$, zAnchor) {
	var z$ = zone$;
	var s$;

	var cr = theme.note.cornerRadius;
	if (zAnchor) {
		s$ = this._silhoutte$0;
		if (s$ && s$.width === z$.width && s$.height === z$.height) return s$;
		return this._silhoutte$0 = new RoundRect(Point.zero, new Point(z$.width, z$.height), cr);
	} else {
		s$ = this._silhoutte$1;
		if (s$ && s$.eq(z$)) return s$;
		return this._silhoutte$1 = new RoundRect(z$.pnw, z$.pse, cr);
	}
};

/**
| Actualizes the scrollbar.
*/
VNote.prototype.setScrollbar = function(pos) {
	var sbary = this.scrollbarY;
	if (!sbary.visible) return;

	// @@ double call to getHeight, also in VDoc.draw()
	sbary.max = this.vv.doc.getHeight();

	var zone = this.getZone();

	// @@ make a Rect.renew
	sbary.zone = new Rect(
		Point.renew(
			zone.width - this.imargin.e - theme.scrollbar.strength,
			this.imargin.n,
			sbary.zone && sbary.zone.pnw),
		Point.renew(
			zone.width - this.imargin.e,
			zone.height - this.imargin.s - 1,
			sbary.zone && sbary.zone.pse));

	sbary.aperture = zone.height - this.imargin.y;
	var smaxy = max(0, sbary.max - sbary.aperture);

	if (typeof(pos) === 'undefined') pos = sbary.getPos();
	sbary.setPos(limit(0, pos, smaxy));
};

/**
| Scrolls the note so the caret comes into view.
*/
VNote.prototype.scrollCaretIntoView = function() {
	var caret   = shell.caret;
	var scrolly = this.scrollbarY;
	var sy      = scrolly.getPos();
	var vpara   = shell.vget(caret.sign.path, -1);
	if (vpara.constructor !== VPara) { throw new Error('iFail'); }
	var cp      = vpara.getCaretPos();
	var zone    = this.getZone();
	var imargin = this.imargin;

	if (cp.n - imargin.n < sy) {
		this.setScrollbar(cp.n - imargin.n);
		this.poke();
	} else if (cp.s + imargin.s > sy + zone.height) {
		this.setScrollbar(cp.s - zone.height + imargin.s);
		this.poke();
	}
};


/**
| Scrolls the note so the caret comes into view.
*/
VNote.prototype.scrollPage = function(up) {
	var zone = this.getZone();
	var dir  = up ? -1 : 1;
	var fs   = this.vv.doc.getFontSize();
	this.setScrollbar(this.scrollbarY.getPos() + dir * zone.height - fs * 2);
	this.poke();
};

/**
| Sets the items position and size after an action.
*/
VNote.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		var zone = this.getZone();

		if (zone.width < this.minWidth || zone.height < this.minHeight) {
			throw new Error('Note under minimum size!');
		}

		if (this.twig.zone.eq(zone)) return;
		peer.setZone(this.path, zone);
		// adapts scrollbar position
		// this.setScrollbar(); TODO

		system.setCursor('default');
		shell.redraw = true;
		return true;
	default :
		return VItem.prototype.dragstop.call(this, p);
	}
};

/**
| Draws the note.
|
| fabric: to draw upon.
*/
VNote.prototype.draw = function(fabric) {
	var zone = this.getZone();
	var f = this.$fabric;

	// no buffer hit?
	if (dbgNoCache || !f ||
		zone.width  !== f.width ||
		zone.height !== f.height)
	{
		f = this.$fabric = new Fabric(zone.width, zone.height);
		var vdoc         = this.vv.doc;
		var imargin      = this.imargin;

		// calculates if a scrollbar is needed
		var sbary  = this.scrollbarY;
		var vheight = vdoc.getHeight();
		if (!sbary.visible && vheight > zone.height - imargin.y) {
			// doesn't use a scrollbar but should
			sbary.visible = true;
		} else if (sbary.visible && vheight <= zone.height - imargin.y) {
			// uses a scrollbar but shouldn't
			sbary.visible = false;
		}

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);
		f.fill(theme.note.style.fill, silhoutte, 'path');

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		vdoc.draw(f, zone.width, imargin, sbary.point);

		// draws the scrollbar
		if (sbary.visible) {
			this.setScrollbar();
			sbary.draw(f);
		}

		// draws the border
		f.edge(theme.note.style.edge, silhoutte, 'path');
	}

	fabric.drawImage(f, zone.pnw);
};

/**
| Mouse wheel turned.
*/
VNote.prototype.mousewheel = function(p, dir) {
	if (!this.getZone().within(p)) return false;
	this.setScrollbar(this.scrollbarY.getPos() - dir * settings.textWheelSpeed);
	this.poke();
	shell.redraw = true;
	return true;
};

/**
| Returns the width for the contents flow.
*/
VNote.prototype.getFlowWidth = function() {
	var sbary = this.scrollbarY;
	var zone = this.getZone();
	var flowWidth = zone.width - this.imargin.x;
	if (sbary && sbary.visible) {
		flowWidth -= theme.scrollbar.strength;
	}
	return flowWidth;
};

/**
| Returns the para seperation height.
*/
VNote.prototype.getParaSep = function(fontsize) {
	return half(fontsize);
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VNote.prototype.getZone = function() {
	var twig   = this.twig;
	var action = shell.action;

	if (!action || action.vitem !== this) return twig.zone;
	// @@ cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		return twig.zone.add(action.move.x - action.start.x, action.move.y - action.start.y);

	case Action.ITEMRESIZE:
		var szone = action.startZone;
		if (!szone) return twig.zone;
		var spnw = szone.pnw;
		var spse = szone.pse;
		var dx = action.move.x - action.start.x;
		var dy = action.move.y - action.start.y;
		var minw = this.minWidth;
		var minh = this.minHeight;
		var pnw, pse;

		switch (action.align) {
		case 'n'  :
			pnw = Point.renew(spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = spse;
			break;
		case 'ne' :
			pnw = Point.renew(
				spnw.x, min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = Point.renew(
				max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
			break;
		case 'e'  :
			pnw = spnw;
			pse = Point.renew(max(spse.x + dx, spnw.x + minw), spse.y, spnw, spse);
			break;
		case 'se' :
			pnw = spnw;
			pse = Point.renew(
				max(spse.x + dx, spnw.x + minw),
				max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 's' :
			pnw = spnw;
			pse = Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 'sw'  :
			pnw = Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
			pse = Point.renew(spse.x, max(spse.y + dy, spnw.y + minh), spnw, spse);
			break;
		case 'w'   :
			pnw = Point.renew(min(spnw.x + dx, spse.x - minw), spnw.y, spnw, spse);
			pse = spse;
			break;
		case 'nw' :
			pnw = Point.renew(
				min(spnw.x + dx, spse.x - minw),
				min(spnw.y + dy, spse.y - minh), spnw, spse);
			pse = spse;
			break;
		//case 'c' :
		default  :
			throw new Error('unknown align');
		}
		return new Rect(pnw, pse);
	default :
		return twig.zone;
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,.   ,. ,       .       .
  `|  /   )   ,-. |-. ,-. |
   | /   /    ,-| | | |-' |
   `'    `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A sizeable item with sizing text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
VLabel = function(twig, path) {
	VItem.call(this, twig, path);
};
subclass(VLabel, VItem);

/**
| Default margin for all notes.
*/
VLabel.prototype.imargin = new Margin(theme.label.imargin);

/**
| Resize handles to show on notes.
*/
fixate(VLabel.prototype, 'handles', {
	ne : true,
	se : true,
	sw : true,
	nw : true
});

/**
| Minimum sizes
*/
VLabel.prototype.minWidth  = false;
VLabel.prototype.minHeight = theme.label.minHeight;

/**
| Returns the notes silhoutte.
*/
VLabel.prototype.getSilhoutte = function(zone$, zAnchor) {
	var s$ = zAnchor ? this._silhoutte$0 : this._silhoutte$1;
	var z$ = zone$;

	if (s$ && s$.width === z$.width && s$.height === z$.height) return s$;

	if (zAnchor) {
		return this._silhoutte$0 = new Rect(Point.zero, new Point(z$.width - 1, z$.height - 1));
	} else {
		return this._silhoutte$1 = new Rect(z$.pnw, z$.pse.sub(1, 1));
	}
};

/**
| Dummy since a label does not scroll.
*/
VLabel.prototype.scrollCaretIntoView = function() {
	// nada
};

/**
| Dummy since a label does not scroll.
*/
VLabel.prototype.scrollPage = function(up) {
	// nada
};

/**
| Draws the label.
|
| fabric: to draw upon. // @@ remove this parameter.
*/
VLabel.prototype.draw = function(fabric) {
	var f    = this.$fabric;
	var zone = this.getZone();

	// no buffer hit?
	if (dbgNoCache || !f ||
		zone.width  !== f.width ||
		zone.height !== f.height)
	{
		f = this.$fabric = new Fabric(zone.width, zone.height);
		var vdoc         = this.vv.doc;
		var imargin      = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);

		// draws selection and text
		vdoc.draw(f, zone.width, imargin, Point.zero);

		// draws the border
		f.edge(theme.label.style.edge, silhoutte, 'path');
	}

	fabric.drawImage(f, zone.pnw);
};

/**
| Returns the width for the contents flow.
*/
VLabel.prototype.getFlowWidth = function() {
	return 0;
};

/**
| Calculates the change of fontsize due to resizing.
*/
VLabel.prototype.fontSizeChange = function(fontsize) {
	var action = shell.action;
	if (!action || action.vitem !== this) return fontsize;
	switch (action.type) {
	case Action.ITEMRESIZE:
		if (!action.startZone) return fontsize;
		var vdoc = this.vv.doc;
		var height = action.startZone.height;
		var dy;
		switch (action.align) {
		case 'ne': case 'nw' : dy = action.start.y - action.move.y;  break;
		case 'se': case 'sw' : dy = action.move.y  - action.start.y; break;
		default  : throw new Error('unknown align: '+action.align);
		}
		return max(fontsize * (height + dy) / height, 8);
	default:
		return fontsize;
	}
	return max(fontsize, 4);
};

/**
| Returns the para seperation height.
*/
VLabel.prototype.getParaSep = function(fontsize) {
	return 0;
};

/**
| Mouse wheel turned.
*/
VLabel.prototype.mousewheel = function(p, dir) {
	if (!this.getZone().within(p)) { return false; }
	return true;
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
VLabel.prototype.getZone = function() {
	var twig = this.twig;
	var action = shell.action;
	var pnw = this.twig.pnw;

	// TODO Caching!
	var vdoc   = this.vv.doc;
	var fs     = vdoc.getFontSize();
	var width  = max(Math.ceil(vdoc.getSpread()), R(fs * 0.3));
	var height = max(Math.ceil(vdoc.getHeight()), R(fs));

	if (!action || action.vitem !== this) return new Rect(pnw, pnw.add(width, height));
	// @@ cache the last zone

	switch (action.type) {
	case Action.ITEMDRAG:
		var mx = action.move.x - action.start.x;
		var my = action.move.y - action.start.y;
		return new Rect(pnw.add(mx, my), pnw.add(mx + width, my + height));

	case Action.ITEMRESIZE:
		// resizing is done by fontSizeChange()
		var szone = action.startZone;
		if (!szone) return new Rect(pnw, pnw.add(width, height));

		switch (action.align) {
		case 'ne' : pnw = pnw.add(0, szone.height - height); break;
		case 'se' : break;
		case 'sw' : pnw = pnw.add(szone.width - width, 0); break;
		case 'nw' : pnw = pnw.add(szone.width - width, szone.height - height); break;
		default   : throw new Error('unknown align');
		}
		return new Rect(pnw, pnw.add(width, height));

	default :
		return new Rect(pnw, pnw.add(width, height));
	}
};


/**
| Sets the items position and size aften an action.
*/
VLabel.prototype.dragstop = function(p) {
	var action = shell.action;
	switch (action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		var zone = this.getZone();
		var fontsize = this.vv.doc.getFontSize();

		if (!this.twig.pnw.eq(zone.pnw)) {
			peer.setPNW(this.path, zone.pnw);
		}
		if (fontsize !== this.twig.fontsize) {
			peer.setFontSize(this.path, fontsize);
		}

		system.setCursor('default');
		shell.redraw = true;
		break;
	default :
		return VItem.prototype.dragstop.call(this, p);
	}
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,.   ,. .-,--.     .      .
 `|  /    `|__/ ,-. |  ,-. |- . ,-. ,-.
  | /     )| \  |-' |  ,-| |  | | | | |
  `'      `'  ` `-' `' `-^ `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Relates two items (including other relations)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
*/
VRelation = function(twig, path) {
	VLabel.call(this, twig, path);
};
subclass(VRelation, VLabel);

/**
| Default margin for all relations.
*/
VRelation.imargin = new Margin(theme.relation.imargin);

/**
| Creates a new Relation by specifing its relates.
*/
VRelation.create = function(vSpace, vitem1, vitem2) {
	var cline = Line.connect(vitem1.getZone(), null, vitem2.getZone(), null);
	var pnw = cline.pc.sub(theme.relation.createOffset);
	var key = peer.newRelation(vSpace.path, pnw, 'relates to', 20, vitem1.key, vitem2.key);
	// event listener has created the vrel
	var vrel = vSpace.vv[key];
	vSpace.setFocus(vrel);
};

VRelation.prototype.draw = function(fabric) {
	var vSpace = shell.vget(this.path, -1);
	var vitem1 = vSpace.vv[this.twig.item1key];
	var vitem2 = vSpace.vv[this.twig.item2key];
	var zone = this.getZone();

	if (vitem1) {
		var l1 = Line.connect(vitem1.getZone(), 'normal', zone, 'normal');
		fabric.paint(theme.relation.style, l1, 'path');
	}

	if (vitem2) {
		var l2 = Line.connect(zone,  'normal', vitem2.getZone(), 'arrow');
		fabric.paint(theme.relation.style, l2, 'path');
	}

	VLabel.prototype.draw.call(this, fabric);
};


})();
