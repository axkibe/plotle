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

                                     .,-,-.       .
                                      ` | |   ,-. |- ,-.
                                        | |-. | | |  |-'
                                       ,' `-' `-' `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with text and a scrollbar.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var Note     = null;

/**
| Imports
*/
var Action;
var BeziRect;
var config;
var Fabric;
var Jools;
var Item;
var Margin;
var Point;
var Para;
var Rect;
var Scrollbar;
var settings;
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
| Shortcuts.
*/
var debug         = Jools.debug;
var half          = Jools.half;
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
Note = function(twig, path) {
	Item.call(this, twig, path);
	this.scrollbarY = new Scrollbar();
};
subclass(Note, Item);

/**
| Default margin for all notes.
*/
Note.prototype.imargin = new Margin(theme.note.imargin);

/**
| Resize handles to show on notes.
*/
Note.prototype.handles = {
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
| $zone :  the cache for the items zone
| zAnchor: if true anchor the silhoute at zero.
*/
Note.prototype.getSilhoutte = function($zone, zAnchor) {
	var $z = $zone;
	var $s;

	var cr = theme.note.cornerRadius;
	if (zAnchor) {
		$s = this._silhoutte$0;
		if ($s && $s.width === $z.width && $s.height === $z.height) return $s;
		return this._silhoutte$0 = new BeziRect(Point.zero, new Point($z.width, $z.height), cr, cr);
	} else {
		$s = this._silhoutte$1;
		if ($s && $s.eq($z)) return $s;
		return this._silhoutte$1 = new BeziRect($z.pnw, $z.pse, cr, cr);
	}
};

/**
| Actualizes the scrollbar.
*/
Note.prototype.setScrollbar = function(pos) {
	var sbary = this.scrollbarY;
	if (!sbary.visible) return;

	var zone  = this.getZone();
	var str   = theme.scrollbar.strength;
	var str05 = half(str);

	if (typeof(pos) === 'undefined')
		{ pos = sbary.getPos(); }

	sbary.setPos(
		pos,
		zone.height - this.imargin.y,
		this.$graph.doc.getHeight(),
		Point.renew(zone.pse.x, zone.pnw.y + theme.scrollbar.vdis, sbary.pnw),
		zone.height - theme.scrollbar.vdis * 2
	);
};

/**
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollCaretIntoView = function() {
	var caret   = shell.caret;
	var scrolly = this.scrollbarY;
	var sy      = scrolly.getPos();
	var para   = shell.$space.vget(caret.sign.path, -1);
	if (para.constructor !== Para) { throw new Error('iFail'); }
	var cp      = para.getCaretPos();
	var pnw     = this.$graph.doc.getPNW(para.key);
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
Note.prototype.scrollPage = function(up) {
	var zone = this.getZone();
	var dir  = up ? -1 : 1;
	var fs   = this.$graph.doc.getFontSize();
	this.setScrollbar(this.scrollbarY.getPos() + dir * zone.height - fs * 2);
	this.poke();
};

/**
| Sets the items position and size after an action.
*/
Note.prototype.actionstop = function(view, p) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var $action = shell.$action;
	switch ($action.type) {
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
		return Item.prototype.actionstop.call(this, view, p);
	}
};

/**
| Draws the note.
|
| fabric: to draw upon.
*/
Note.prototype.draw = function(fabric, view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var zone  = this.getZone();
	var vzone = view.rect(zone);
	var f     = this.$fabric;
	var sbary = this.scrollbarY;

	// no buffer hit?
	if (config.debug.noCache || !f ||
		vzone.width  !== f.width ||
		vzone.height !== f.height)
	{
		f = this.$fabric = new Fabric(vzone.width, vzone.height);
		var doc     = this.$graph.doc;
		var imargin = this.imargin;

		// calculates if a scrollbar is needed
		var height = doc.getHeight();
		sbary.visible = height > zone.height - imargin.y;

		// resizes the canvas (when scrollbars could change the size)
		//f.attune(vzone);

		var silhoutte = this.getSilhoutte(vzone, true);
		f.fill(theme.note.style.fill, silhoutte, 'path', View.proper);

		// draws selection and text
		sbary.point = Point.renew(0, sbary.getPos(), sbary.point);
		doc.draw(f, view.home(), zone.width, imargin, sbary.point);

		// draws the border
		f.edge(theme.note.style.edge, silhoutte, 'path', View.proper);
	}
		

	fabric.drawImage(f, vzone.pnw);

	if (sbary.visible) {
		this.setScrollbar();
		sbary.draw(fabric, view);
	}
};

/**
| Mouse wheel turned.
*/
Note.prototype.mousewheel = function(view, p, dir, shift, ctrl) {
	var dp = view.depoint(p);

	if (!this.getZone().within(dp)) return false;
	this.setScrollbar(this.scrollbarY.getPos() - dir * settings.textWheelSpeed);
	this.poke();
	shell.redraw = true;
	return true;
};

/**
| Returns the width for the contents flow.
*/
Note.prototype.getFlowWidth = function() {
	var sbary = this.scrollbarY;
	var zone  = this.getZone();
	var flowWidth = zone.width - this.imargin.x;

	// this used to be made when the scrollbar was within the vnote.
	// if (sbary && sbary.visible)
	//	{ flowWidth -= theme.scrollbar.strength; }

	return flowWidth;
};

/**
| Returns the para seperation height.
*/
Note.prototype.getParaSep = function(fontsize) {
	return half(fontsize);
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Note.prototype.getZone = function() {
	var twig   = this.twig;
	var $action = shell.$action;

	if (!$action || !this.path.equals($action.itemPath))
		{ return twig.zone; }

	// TODO cache the last zone

	switch ($action.type) {
	case Action.ITEMDRAG:
		return twig.zone.add(
			$action.move.x - $action.start.x,
			$action.move.y - $action.start.y);

	case Action.ITEMRESIZE:
		var szone = $action.startZone;
		if (!szone) return twig.zone;
		var spnw = szone.pnw;
		var spse = szone.pse;
		var dx = $action.move.x - $action.start.x;
		var dy = $action.move.y - $action.start.y;
		var minw = theme.note.minWidth;
		var minh = theme.note.minHeight;
		var pnw, pse;

		switch ($action.align) {
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
