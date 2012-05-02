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
var Cockpit;
var Curve;
var Design;
var Deverse;
var Fabric;
var Jools;
var Path;
var Tree;
var config;
var theme;
var system;
var shell;

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
CBoard = function(name, inherit, cockpit, screensize) {
	this.name    = name;
	this.cockpit = cockpit;
	var tree     = this.tree  = new Tree(Design[name], Deverse);
	var frameD   = tree.root.frame;
	var oframe   = new Rect(Point.zero, screensize);
	var pnw      = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse      = this.pse    = computePoint(frameD.pse, oframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = new Curve(tree.root.curve, iframe);

	this.gradientPC = new Point(half(iframe.width), iframe.height + 450);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.screensize = screensize;

	this.$hover = inherit ? inherit.$hover : null;

	this.cc = {};
	var layout = tree.root.layout;
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var twig  = layout.copse[cname];
		this.cc[cname] = this.newCC(twig, inherit && inherit.cc[cname], cname);
	}
};

/**
| Creates a new cockpit component.
*/
CBoard.prototype.newCC = function(twig, inherit, name) {
	switch(twig.type) {
	case 'Custom' : return new CCustom(twig, this, inherit, name);
	case 'Input'  : return new CInput (twig, this, inherit, name);
	case 'Label'  : return new CLabel (twig, this, inherit, name);
	default       : throw new Error('Invalid component type: ' + twig.type);
	}
};

/**
| Returns the focused item.
*/
CBoard.prototype.focusedCC = function() {
	var caret = shell.caret;
	if (caret.visec !== 'cockpit') { return null; }
	var sign = caret.sign;
	var path = sign.path;
	if (path.get(0) !== this.name) { return null; }
	return this.cc[path.get(1)] || null;
};

/**
| Paths the boards frame
*/
CBoard.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Draws the boards contents
*/
CBoard.prototype.getFabric = function() {
	if (this.$fabric && !config.debug.noCache) { return this.$fabric; }
	var iframe = this.iframe;
	var fabric = this.$fabric = new Fabric(iframe);

	fabric.fill(theme.cockpit.style.fill, this, 'path');
	var layout = this.tree.root.layout;

	var focus = this.focusedCC();
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var c = this.cc[cname];
		c.draw(fabric, CAccent.state(cname === this.$hover, c == focus));
	}
	fabric.edge(theme.cockpit.style.edge, this, 'path');

	if (config.debug.drawBoxes) {
		fabric.paint(Cockpit.styles.boxes,
			new Rect(iframe.pnw, iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
};

/**
| Draws the caret.
*/
CBoard.prototype.drawCaret = function() {
	var cname = shell.caret.sign.path.get(1);
	var ce = this.cc[cname];
	if (!ce) { throw new Error('Caret component does not exist!'); }
	if (ce.drawCaret) { ce.drawCaret(); }
};

/**
| Returns true if point is on this board
*/
CBoard.prototype.mousehover = function(p, shift, ctrl) {
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
		if (ce.mousehover(pp, shift, ctrl)) { return true; }
	}
	system.setCursor('default');
	this.setHover(null);
	return true;
};

/**
| Returns true if point is on this board
*/
CBoard.prototype.mousedown = function(p, shift, ctrl) {
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
		if (ce.mousedown(pp, shift, ctrl)) { return false; }
	}
	system.setCursor('default');
	this.setHover(null);
	return false;
};

/**
| Text input.
*/
CBoard.prototype.input = function(text) {
	var focus = this.focusedCC();
	if (!focus) { return; }
	focus.input(text);
};

/**
| Cycles the focus
*/
CBoard.prototype.cycleFocus = function(dir) {
	var layout = this.tree.root.layout;
	var focus = this.focusedCC();
	if (!focus) { return; }
	var rank = layout.rankOf(focus.name);
	var rs = rank;
	var cname;
	var ve;
	do {
		rank = (rank + dir + layout.length) % layout.length;
		if (rank === rs) { this.setFocus(null); }
		cname = layout.ranks[rank];
		ve    = this.cc[cname];
	} while (!ve.canFocus());

	this.setFocus(cname);
	return;

};

/**
| User pressed a special key.
*/
CBoard.prototype.specialKey = function(key, shift, ctrl) {
	var focus = this.focusedCC();
	if (!focus) return;
	if (key === 'tab') {
		this.cycleFocus(shift ? -1 : 1);
		return;
	}
	focus.specialKey(key, shift, ctrl);
};

/**
| Clears caches.
*/
CBoard.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};


/**
| Sets the focused component.
*/
CBoard.prototype.setFocus = function(cname) {
	var com = this.cc[cname];
	var focus = this.focusedCC();
	if (focus === com) { return; }

	shell.setCaret('cockpit', {
		path : new Path([this.name, cname]),
		at1  : 0
	});
};

/**
| Sets the hovered component.
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
