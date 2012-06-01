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

                                ,--.  ,--.         .
                               | `-' | `-' . . ,-. |- ,-. ,-,-.
                               |   . |   . | | `-. |  | | | | |
                               `--'  `--'  `-^ `-' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A custom component on the cockpit.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CAccent;
var Cockpit;
var Curve;
var Fabric;
var Jools;
var Point;
var config;
var shell;
var system;

/**
| Exports
*/
var CCustom = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var Rect          = Fabric.Rect;
var computePoint  = Curve.computePoint;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;

/**
| Constructor.
*/
CCustom = function(twig, board, inherit, name) {
	if (twig.type !== 'Custom') { throw new Error('invalid twig type'); }
	this.name    = name;
	this.twig    = twig;
	this.board   = board;

	var pnw      = this.pnw    = computePoint(twig.frame.pnw, board.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, board.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = new Curve(twig.curve, iframe);

	this.captionPos = computePoint(twig.caption.pos, iframe);

	this.$active  = inherit ? inherit.$active : false;
	this.$fabric  = null;
	this.$visible = inherit ? inherit.$visible : true;
	this.$captionText = inherit ? inherit.$captionText : twig.caption.text;
	this.$accent  = CAccent.NORMAL;
};

/**
| CCustoms can focus or not depending on their methods
*/
CCustom.prototype.canFocus = function() {
	return this.$visible;
};

/**
| Paths the custom control.
*/
CCustom.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Returns the fabric for the custom component.
*/
CCustom.prototype.getFabric = function(accent) {
	var fabric = this.$fabric;
	if (fabric && this.$accent === accent && !config.debug.noCache) { return fabric; }

	fabric = this.$fabric = new Fabric(this.iframe);

	var sname;
	switch (accent) {
	case CAccent.NORMA : sname = this.twig.normaStyle; break;
	case CAccent.HOVER : sname = this.twig.hoverStyle; break;
	case CAccent.FOCUS : sname = this.twig.focusStyle; break;
	case CAccent.HOFOC : sname = this.twig.hofocStyle; break;
	default : throw new Error('Invalid accent: ' + accent);
	}

	var style = Cockpit.styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this, 'path', Point.zero);

	var fs = this.twig.caption.fontStyle;
	fabric.setFontStyle(fs.style, fs.fill, fs.align, fs.base);
	fabric.fillText(this.$captionText, this.captionPos);

	if (config.debug.drawBoxes) {
		fabric.paint(
			Cockpit.styles.boxes,
			new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path',
			Point.zero
		);
	}

	return fabric;
};

/**
| Input
*/
CCustom.prototype.input = function(text) {
	return true;
};

/**
| Input
*/
CCustom.prototype.specialKey = function(key, shift, ctrl) {
	return true;
};

/**
| Mouse hover.
*/
CCustom.prototype.mousehover = function(p) {
	if (!this.$visible)
		{ return null; }
	
	if (p === null)
		{ return null; }

	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y)
		{ return null; }

	var fabric = this.getFabric(CAccent.NORMA);
	var pp = p.sub(this.pnw);

	if (!fabric.within(this, 'path', Point.zero, pp))
		{ return null; }

	this.board.setHover(this.name);
	return 'default';
};

/**
| Mouse down.
*/
CCustom.prototype.mousedown = function(p, shift, ctrl) {
	if (!this.$visible) { return; }
	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y)
		{ return false; }

	var fabric = this.getFabric(CAccent.NORMA);
	var pp = p.sub(this.pnw);
	if (!fabric.within(this, 'path', Point.zero, pp))
		{ return false; }

	shell.redraw = true; // @@ needed?
	return true;
};

/**
| Draws the custom control.
*/
CCustom.prototype.draw = function(fabric, accent) {
	if (!this.$visible) { return; }
	fabric.drawImage(this.getFabric(accent), this.pnw);
};

/**
| Clears all caches
*/
CCustom.prototype.poke = function() {
	this.$fabric = null;
	this.board.poke();
};

})();
