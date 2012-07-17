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
var Jools;
var shell;
var system;
var theme;
var Visual;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor.
*/
var Label = Visual.Label = function(twig, path) {
	Visual.Item.call(this, twig, path);
};
Jools.subclass(Label, Visual.Item);

/**
| Default margin for all notes.
| TODO rename
*/
Label.prototype.imargin = new Euclid.Margin(theme.label.imargin);

/**
| Resize handles to show on notes.
*/
Label.prototype.handles = Jools.immute({
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
		return this._silhoutte$0 = new Euclid.Rect(
			Euclid.Point.zero,
			new Euclid.Point($z.width - 1, $z.height - 1)
		);
	} else {
		return this._silhoutte$1 = new Euclid.Rect($z.pnw, $z.pse.sub(1, 1));
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
		f = this.$fabric = new Euclid.Fabric(zone.width, zone.height);
		f.$zoom     = view.zoom;
		var doc     = this.$sub.doc;
		var imargin = this.imargin;

		// resizes the canvas
		f.attune(zone);
		var silhoutte = this.getSilhoutte(zone, true);

		// draws selection and text
		doc.draw(f, view.home(), zone.width, imargin, Euclid.Point.zero);

		// draws the border
		f.edge(theme.label.style.edge, silhoutte, 'path', Euclid.View.proper);
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
		return Math.max(fontsize * (height + dy) / height, 8);
	default:
		return fontsize;
	}
	return Math.max(fontsize, 4);
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
	var fs     = doc.getFont().size;
	var width  = Math.max(Math.ceil(doc.getSpread()), Math.round(fs * 0.3));
	var height = Math.max(Math.ceil(doc.getHeight()), Math.round(fs));

	if (!$action || !this.path.equals($action.itemPath))
		{ return new Euclid.Rect(pnw, pnw.add(width, height)); }

	// TODO cache the last zone

	switch ($action.type) {
	case Action.ITEMDRAG:
		var mx = $action.move.x - $action.start.x;
		var my = $action.move.y - $action.start.y;
		return new Euclid.Rect(pnw.add(mx, my), pnw.add(mx + width, my + height));

	case Action.ITEMRESIZE:
		// resizing is done by fontSizeChange()
		var szone = $action.startZone;
		if (!szone) return new Euclid.Rect(pnw, pnw.add(width, height));

		switch ($action.align) {
		case 'ne' : pnw = pnw.add(0, szone.height - height); break;
		case 'se' : break;
		case 'sw' : pnw = pnw.add(szone.width - width, 0); break;
		case 'nw' : pnw = pnw.add(szone.width - width, szone.height - height); break;
		default   : throw new Error('unknown align');
		}
		return new Euclid.Rect(pnw, pnw.add(width, height));

	default :
		return new Euclid.Rect(pnw, pnw.add(width, height));
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
		var fontsize = this.$sub.doc.getFont().size;

		if (!this.twig.pnw.eq(zone.pnw)) {
			shell.peer.setPNW(this.path, zone.pnw);
		}
		if (fontsize !== this.twig.fontsize) {
			shell.peer.setFontSize(this.path, fontsize);
		}

		shell.redraw = true;
		break;
	default :
		return Visual.Item.prototype.actionstop.call(this, view, p);
	}
};

})();
