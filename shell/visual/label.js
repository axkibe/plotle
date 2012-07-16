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
                   .,       .       .
                    )   ,-. |-. ,-. |
                   /    ,-| | | |-' |
                   `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An item with resizing text.

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
var Euclid;
var config;
var Fabric;
var Jools;
var Margin;
var Rect;
var shell;
var system;
var theme;
var View;
var Visual;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var Item     = Visual.Item;
var limit    = Jools.limit;
var log      = Jools.log;
var max      = Math.max;
var ro       = Math.round;
var subclass = Jools.subclass;

/**
| Constructor.
*/
var Label = Visual.Label = function(twig, path) {
	Item.call(this, twig, path);
};
subclass(Label, Item);

/**
| Default margin for all notes.
*/
Label.prototype.imargin = new Margin(theme.label.imargin);

/**
| Resize handles to show on notes.
*/
Label.prototype.handles = immute({
	ne : true,
	se : true,
	sw : true,
	nw : true
});

/**
| Returns the notes silhoutte.
*/
Label.prototype.getSilhoutte = function($zone, zAnchor) {
	var $s = zAnchor ? this._silhoutte$0 : this._silhoutte$1;
	var $z = $zone;

	if ($s && $s.width === $z.width && $s.height === $z.height) return $s;

	if (zAnchor) {
		return this._silhoutte$0 = new Rect(
			Euclid.Point.zero,
			new Euclid.Point($z.width - 1, $z.height - 1)
		);
	} else {
		return this._silhoutte$1 = new Rect($z.pnw, $z.pse.sub(1, 1));
	}
};

/**
| Dummy since a label does not scroll.
*/
Label.prototype.scrollCaretIntoView = function() {
	// nada
};

/**
| Dummy since a label does not scroll.
*/
Label.prototype.scrollPage = function(up) {
	// nada
};

/**
| Draws the label.
*/
Label.prototype.draw = function(fabric, view) {
	var f    = this.$fabric;
	var zone = view.rect(this.getZone());

	// no buffer hit?
	if (config.debug.noCache || !f ||
		zone.width  !== f.width ||
		zone.height !== f.height ||
		view.zoom !== f.$zoom)
	{
		f = this.$fabric = new Fabric(zone.width, zone.height);
		f.$zoom     = view.zoom;
		var doc     = this.$sub.doc;
		var imargin = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);

		// draws selection and text
		doc.draw(f, view.home(), zone.width, imargin, Euclid.Point.zero);

		// draws the border
		f.edge(theme.label.style.edge, silhoutte, 'path', View.proper);
	}

	fabric.drawImage(f, zone.pnw);
};

/**
| Returns the width for the contents flow.
*/
Label.prototype.getFlowWidth = function() {
	return 0;
};

/**
| Calculates the change of fontsize due to resizing.
*/
Label.prototype.fontSizeChange = function(fontsize) {
	var $action = shell.$action;

	if (!$action || !this.path.equals($action.itemPath))
		{ return fontsize; }

	switch ($action.type) {
	case Action.ITEMRESIZE:
		if (!$action.startZone) return fontsize;
		var height = $action.startZone.height;
		var dy;
		switch ($action.align) {
		case 'ne': case 'nw' : dy = $action.start.y - $action.move.y;  break;
		case 'se': case 'sw' : dy = $action.move.y  - $action.start.y; break;
		default  : throw new Error('unknown align: '+ $action.align);
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
Label.prototype.getParaSep = function(fontsize) {
	return 0;
};

/**
| Mouse wheel turned.
*/
Label.prototype.mousewheel = function(view, p, dir) {
	return false;
};

/**
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Label.prototype.getZone = function() {
	var twig = this.twig;
	var $action = shell.$action;
	var pnw = this.twig.pnw;

	// TODO Caching!
	var doc    = this.$sub.doc;
	var fs     = doc.getFontSize();
	var width  = max(Math.ceil(doc.getSpread()), ro(fs * 0.3));
	var height = max(Math.ceil(doc.getHeight()), ro(fs));

	if (!$action || !this.path.equals($action.itemPath))
		{ return new Rect(pnw, pnw.add(width, height)); }

	// TODO cache the last zone

	switch ($action.type) {
	case Action.ITEMDRAG:
		var mx = $action.move.x - $action.start.x;
		var my = $action.move.y - $action.start.y;
		return new Rect(pnw.add(mx, my), pnw.add(mx + width, my + height));

	case Action.ITEMRESIZE:
		// resizing is done by fontSizeChange()
		var szone = $action.startZone;
		if (!szone) return new Rect(pnw, pnw.add(width, height));

		switch ($action.align) {
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
Label.prototype.actionstop = function(view, p) {
	var $action = shell.$action;
	switch ($action.type) {
	case Action.ITEMDRAG :
	case Action.ITEMRESIZE :
		var zone = this.getZone();
		var fontsize = this.$sub.doc.getFontSize();

		if (!this.twig.pnw.eq(zone.pnw)) {
			shell.peer.setPNW(this.path, zone.pnw);
		}
		if (fontsize !== this.twig.fontsize) {
			shell.peer.setFontSize(this.path, fontsize);
		}

		shell.redraw = true;
		break;
	default :
		return Item.prototype.actionstop.call(this, view, p);
	}
};

})();
