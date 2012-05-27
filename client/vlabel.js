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

                                      ,.   ,.,       .       .
                                      `|  /  )   ,-. |-. ,-. |
                                       | /  /    ,-| | | |-' |
                                       `'   `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A sizeable item with sizing text.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var VLabel    = null;

/**
| Imports
*/
var Action;
var Fabric;
var Jools;
var VItem;
var config;
var shell;
var system;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts.
*/
var abs      = Math.abs;
var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var limit    = Jools.limit;
var log      = Jools.log;
var max      = Math.max;
var Margin   = Fabric.Margin;
var min      = Math.min;
var Point    = Fabric.Point;
var Rect     = Fabric.Rect;
var ro       = Math.round;
var subclass = Jools.subclass;

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
VLabel.prototype.handles = immute({
	ne : true,
	se : true,
	sw : true,
	nw : true
});

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
	if (config.debug.noCache || !f ||
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

	// @@ Caching!
	var vdoc   = this.vv.doc;
	var fs     = vdoc.getFontSize();
	var width  = max(Math.ceil(vdoc.getSpread()), ro(fs * 0.3));
	var height = max(Math.ceil(vdoc.getHeight()), ro(fs));

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
			shell.peer.setPNW(this.path, zone.pnw);
		}
		if (fontsize !== this.twig.fontsize) {
			shell.peer.setFontSize(this.path, fontsize);
		}

		shell.redraw = true;
		break;
	default :
		return VItem.prototype.dragstop.call(this, p);
	}
};

})();
