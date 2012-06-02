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

                                     ,.   ,.,-,-.       .
                                     `|  /  ` | |   ,-. |- ,-.
                                      | /     | |-. | | |  |-'
                                      `'     ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VNote     = null;

/**
| Imports
*/
var Action;
var config;
var Fabric;
var Jools;
var Point;
var Rect;
var Scrollbar;
var settings;
var shell;
var system;
var theme;
var VItem;
var VPara;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
var Margin        = Fabric.Margin;
var RoundRect     = Fabric.RoundRect;
var debug         = Jools.debug;
var half          = Fabric.half;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var limit         = Jools.limit;
var log           = Jools.log;
var max = Math.max;
var min = Math.min;
var subclass      = Jools.subclass;

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
	var vpara   = shell.vspace.vget(caret.sign.path, -1);
	if (vpara.constructor !== VPara) { throw new Error('iFail'); }
	var cp      = vpara.getCaretPos();
	var pnw     = this.vv.doc.getPNW(vpara.key);
	var zone    = this.getZone();
	var imargin = this.imargin;

	if (cp.n + pnw.y - imargin.n < sy) {
		this.setScrollbar(cp.n + pnw.y - imargin.n);
		this.poke();
	} else if (cp.s + pnw.y + imargin.s > sy + zone.height) {
		this.setScrollbar(cp.s + pnw.y - zone.height + imargin.s);
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

		if (zone.width < theme.note.minWidth || zone.height < theme.note.minHeight) {
			throw new Error('Note under minimum size!');
		}

		if (this.twig.zone.eq(zone)) return;
		shell.peer.setZone(this.path, zone);

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
VNote.prototype.draw = function(fabric, view) {
	var zone = this.getZone();
	var f = this.$fabric;

	// no buffer hit?
	if (config.debug.noCache || !f ||
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

		if (sbary.visible) { this.setScrollbar(); }

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);
		f.fill(theme.note.style.fill, silhoutte, 'path', Point.zero);

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		vdoc.draw(f, Point.zero, zone.width, imargin, sbary.point);

		// draws the scrollbar
		if (sbary.visible) { sbary.draw(f, Point.zero); }

		// draws the border
		f.edge(theme.note.style.edge, silhoutte, 'path', Point.zero);
	}

	fabric.drawImage(f, zone.pnw.add(view.pan));
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
		var minw = theme.note.minWidth;
		var minh = theme.note.minHeight;
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

})();
