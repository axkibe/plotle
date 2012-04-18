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

                                ,--. ,-,---.               .
                               | `-'  '|___/ ,-. ,-. ,-. ,-|
                               |   .  ,|   \ | | ,-| |   | |
                               `--'  `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A cockpit board.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CAccent;
var CCustom;
var CLabel;
var CInput;
var Curve;
var Jools;
var Fabric;
var Tree;
var Deverse;
var theme;
var system;
var shell;
var dbgNoCache;
var dbgBoxes;

/**
| Exports
*/
var CBoard = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var computePoint  = Curve.computePoint;
var half          = Fabric.half;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;

/**
| Constructor
*/
CBoard = function(design, inherit, cockpit, screensize) {
	this.cockpit = cockpit;
	var tree     = this.tree  = new Tree(design, Deverse);
	var frameD   = tree.root.frame;
	var oframe   = new Rect(Point.zero, screensize);
	var pnw      = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse      = this.pse    = computePoint(frameD.pse, oframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = new Curve(tree.root.curve, iframe);

	// TODO use point arithmetic
	this.gradientPC = new Point(half(iframe.width), iframe.height + 450);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.screensize = screensize;

	this.$hover = inherit ? inherit.$hover : null;
	this.$focus = inherit ? inherit.$focus : null;

	this.cc = {};
	var layout = tree.root.layout;
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var name = layout.ranks[a];
		var twig = layout.copse[name];
		this.cc[name] = this.newCC(twig, inherit && inherit.cc[name], name);
	}
};

/**
| Creates a new enhanced element.
*/
CBoard.prototype.newCC = function(twig, inherit, name) {
	switch(twig.type) {
	case 'Custom' : return new CCustom(twig, this, inherit, name);
	case 'Input'  : return new CInput (twig, this, inherit, name);
	case 'Label'  : return new CLabel (twig, this, inherit, name);
	default       : throw new Error('Invalid element type: ' + twig.type);
	}
};

/**
| Paths the boards frame
*/
CBoard.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Draws the mainboards contents
*/
CBoard.prototype.getFabric = function() {
	if (this.$fabric && !dbgNoCache) { return this.$fabric; }
	var iframe = this.iframe;
	var fabric = this.$fabric = new Fabric(iframe);

	fabric.paint(theme.cockpit.style, this, 'path');
	var layout = this.tree.root.layout;

	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var c = this.cc[cname];
		c.draw(fabric, CAccent.state(cname === this.$hover, cname === this.$focus));
	}

	if (dbgBoxes) {
		fabric.paint(Cockpit.styles.boxes,
			new Rect(iframe.pnw, iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
};

/**
| Returns true if point is on this mainboard
*/
CBoard.prototype.mousehover = function(p) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this.getFabric();
	var a, aZ;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		this.setHover(null);
		return false;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHover(null);
		return false;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousehover(this, pp)) { return true; }
	}
	system.setCursor('default');
	this.setHover(null);
	return true;
};

/**
| Returns true if point is on this mainboard
*/
CBoard.prototype.mousedown = function(p) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this.getFabric();
	var a, aZ;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		this.setHover(null);
		return null;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHover(null);
		return null;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousedown(this, pp)) { return false; }
	}
	system.setCursor('default');
	this.setHover(null);
	return false;
};

/**
| Text input.
*/
CBoard.prototype.input = function(text) {
	if (!this.$focus) return;
	this.cc[this.$focus].input(text);
}

/**
| Clears caches.
*/
CBoard.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
}


/**
| Sets the focused element.
*/
CBoard.prototype.setFocus = function(cname) {
	if (this.$focus === cname) { return; }

	this.$fabric = null;
	shell.redraw = true;
	if (this.$focus) { this.cc[this.$focus].$fabric = null; }
	if (cname      ) { this.cc[cname      ].$fabric = null; }
	this.$focus = cname;

	shell.setCaret('cockpit', null, cname);
};

/**
| Sets the hovered element.
*/
CBoard.prototype.setHover = function(cname) {
	if (this.$hover === cname) { return; }

	this.$fabric = null;
	shell.redraw = true;
	if (this.$hover) { this.cc[this.$hover].$fabric = null; }
	if (cname      ) { this.cc[cname      ].$fabric = null; }
	this.$hover = cname;
};

})();
