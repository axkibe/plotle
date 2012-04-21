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

 A custom element in the cockpit.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CAccent;
var CMeth;
var Cockpit;
var Curve;
var Jools;
var Fabric;
var system;
var shell;
var dbgNoCache;
var dbgBoxes;

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
var Point         = Fabric.Point;
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
	this.twig    = twig;
	this.board   = board;
	this.name    = name;
	this.methods = CMeth[name];
	if (!this.methods) { this.methods = {}; }

	var pnw      = this.pnw    = computePoint(twig.frame.pnw, board.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, board.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = new Curve(twig.curve, iframe);

	this.caption = {
		pos : computePoint(twig.caption.pos, iframe)
	};
	this.$fabric = null;
	this.$accent = CAccent.NORMAL;
};

/**
| CCustoms can focus or not depending on their methods
*/
CCustom.prototype.canFocus = function() {
	if (!this.methods.canFocus) { return false; }
	return this.methods.canFocus();
};

/**
| Paths the custom control.
*/
CCustom.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Returns the fabric for the custom element.
*/
CCustom.prototype.getFabric = function(accent) {
	var fabric = this.$fabric;
	if (fabric && this.$accent === accent && !dbgNoCache) { return fabric; }

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
	fabric.paint(style, this, 'path');

	var fs = this.twig.caption.fontStyle;
	fabric.fontStyle(fs.style, fs.fill, fs.align, fs.base);
	fabric.fillText(this.twig.caption.text, this.caption.pos);

	if (dbgBoxes) {
		fabric.paint(
			Cockpit.styles.boxes,
			new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path'
		);
	}

	return fabric;
};

/**
| Input
*/
CCustom.prototype.input = function(board, text) {
	if (this.methods.input) { this.methods.input(board, this, text); }
	return true;
};

/**
| Input
*/
CCustom.prototype.specialKey = function(board, key) {
	if (this.methods.specialKey) { this.methods.specialKey(board, this, key); }
	return true;
};

/**
| Mouse hover.
*/
CCustom.prototype.mousehover = function(board, p) {
	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y) {
		return false;
	}
	var fabric = this.getFabric(CAccent.NORMA);
	var pp = p.sub(this.pnw);
	if (!fabric.within(this, 'path', pp))  { return false; }

	system.setCursor('default');
	board.setHover(this.name);

	if (this.methods.mousehover) { this.methods.mousehover(board, this, p); }
	return true;
};

/**
| Mouse down.
*/
CCustom.prototype.mousedown = function(board, p) {
	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y) {
		return false;
	}
	var fabric = this.getFabric(CAccent.NORMA);
	var pp = p.sub(this.pnw);
	if (!fabric.within(this, 'path', pp))  { return false; }

	if (this.methods.mousedown) {
		this.methods.mousedown(board, this, p);
		shell.redraw = true;
	}
	return true;
};

/**
| Draws the custom control.
*/
CCustom.prototype.draw = function(fabric, accent) {
	fabric.drawImage(this.getFabric(accent), this.pnw);
};

/**
| Clears all caches
*/
CCustom.prototype.poke = function() {
	this.$fabric = null;
	this.board.poke();
}

})();
