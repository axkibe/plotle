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


                                    ,--. ,-_/             .
                                   | `-' '  | ,-. ,-. . . |-
                                   |   . .^ | | | | | | | |
                                   `--'  `--' ' ' |-' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                  '
 An input field on the cockpit.

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

/**
| Exports
*/
var CInput = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;

var computePoint  = Curve.computePoint;
var BeziRect      = Fabric.BeziRect;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;

/**
| Constructor.
*/
CInput = function(twig, board, inherit, name) {
	this.twig    = twig;
	this.board   = board;
	this.name    = name;
	this.methods = CMeth[name];
	if (!this.methods) { this.methods = {}; }

	var pnw  = this.pnw  = computePoint(twig.frame.pnw, board.iframe);
	var pse  = this.pse  = computePoint(twig.frame.pse, board.iframe);
	var bezi = this.bezi = new BeziRect(Point.zero, pse.sub(pnw), 7, 3);

	this.$fabric = null;
	this.$accent = CAccent.NORMA;
};

/**
| TODO
*/
CInput.prototype.path = function(fabric, border, twist) {
	fabric.beginPath(twist);
	fabric.moveTo(this.pnw);
	fabric.lineTo(this.pse.x, this.pnw.y);
	fabric.lineTo(this.pse);
	fabric.lineTo(this.pnw.x, this.pse.y);
	fabric.lineTo(this.pnw);
};

/**
| TODO
*/
CInput.prototype.getFabric = function(accent) {
	var fabric = new Fabric(this.bezi.width, this.bezi.height);

	var sname;
	switch (accent) {
	case CAccent.NORMA : sname = this.twig.normaStyle; break;
	case CAccent.HOVER : sname = this.twig.hoverStyle; break;
	case CAccent.FOCUS : sname = this.twig.focusStyle; break;
	case CAccent.HOVOC : sname = this.twig.hovocStyle; break;
	default : throw new Error('Invalid accent');
	}
	var style  = Cockpit.styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }

	fabric.paint(style, this.bezi, 'path');
	return fabric;
};


/**
| TODO
*/
CInput.prototype.draw = function(fabric, accent) {
	fabric.drawImage(this.getFabric(accent), this.pnw);
};

/**
| TODO
*/
CInput.prototype.input = function(text) {
	debug('CINPUT', text);
}

/**
| Mouse hover
*/
CInput.prototype.mousehover = function(board, p) {
	return false;
};

/**
| Mouse down
*/
CInput.prototype.mousedown = function(board, p) {
	var pp = p.sub(this.pnw);
	var fabric = this.getFabric(CAccent.NORMA);
	if (!fabric.within(this.bezi, 'path', pp))  { return null; }

	board.setFocus(this.name);
	return false;
};

})();
