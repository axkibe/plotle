 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
             .-,--.             .
              '|__/ ,-. ,-. ,-. |
              ,|    ,-| | | |-' |
              `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A panel of the dashboard.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Dash;
Dash = Dash || {};

/**
| Imports
*/
var CCode;
var config;
var Curve;
var Design;
var Fabric;
var Jools;
var Path;
var Point;
var Rect;
var shell;
var Tree;
var View;

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
var computePoint  = Curve.computePoint;
var half          = Jools.half;

/**
| Constructor
*/
var Panel = Dash.Panel = function(name, inherit, board, screensize) {
	this.name  = name;
	this.board = board;
	var tree   = this.tree  = new Tree(Design[name], Design.Pattern);
	var frameD = tree.root.frame;
	var oframe = new Rect(Point.zero, screensize);
	var pnw    = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse    = this.pse    = computePoint(frameD.pse, oframe);
	var iframe = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve = new Curve(tree.root.curve, iframe);

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
| Creates a new component.
*/
Panel.prototype.newCC = function(twig, inherit, name) {
	if (twig.code && twig.code !== '') {
		var Proto = CCode[twig.code];
		if (Proto) {
			return new Proto(twig, this, inherit, name);
		} else {
			throw new Error('No prototype for :' + twig.code);
		}
	}

	switch(twig.type) {
	case 'Chat'   : return new Dash.Chat   (twig, this, inherit, name);
	case 'Button' : return new Dash.Button (twig, this, inherit, name);
	case 'Input'  : return new Dash.Input  (twig, this, inherit, name);
	case 'Label'  : return new Dash.Label  (twig, this, inherit, name);
	default       : throw new Error('Invalid component type: ' + twig.type);
	}
};

/**
| Returns the focused item.
*/
Panel.prototype.focusedCC = function() {
	var caret = shell.caret;

	if (caret.visec !== 'board')
		{ return null; }

	var sign = caret.sign;
	var path = sign.path;
	if (path.get(0) !== this.name) { return null; }
	return this.cc[path.get(1)] || null;
};

/**
| Paths the panels frame.
*/
Panel.prototype.path = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Force clears all caches.
*/
Panel.prototype.knock = function() {
	this.$fabric = null;
	for(var c in this.cc) {
		this.cc[c].knock();
	}
};

/**
| Draws the panels contents.
*/
Panel.prototype._weave = function() {
	if (this.$fabric && !config.debug.noCache)
		{ return this.$fabric; }

	var iframe = this.iframe;
	var fabric = this.$fabric = new Fabric(iframe);
	var style = Dash.Board.styles[this.tree.root.style];
	if (!style) { throw new Error('no style!'); }

	fabric.fill(style.fill, this, 'path', View.proper);
	var layout = this.tree.root.layout;

	var focus = this.focusedCC();
	for(var a = layout.length - 1; a >= 0; a--) {
		var cname = layout.ranks[a];
		var c = this.cc[cname];
		c.draw(fabric, Dash.Accent.state(cname === this.$hover || c.$active, c === focus));
	}
	fabric.edge(style.edge, this, 'path', View.proper);

	if (config.debug.drawBoxes) {
		fabric.paint(
			Dash.Board.styles.boxes,
			new Rect(iframe.pnw,
			iframe.pse.sub(1, 1)),
			'path',
			View.proper
		);
	}

	return fabric;
};

/**
| Draws the panel.
*/
Panel.prototype.draw = function(fabric) {
	fabric.drawImage(this._weave(), this.pnw);
};

/**
| Draws the caret.
*/
Panel.prototype.drawCaret = function(view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var cname = shell.caret.sign.path.get(1);
	var ce = this.cc[cname];
	if (!ce) { throw new Error('Caret component does not exist!'); }
	if (ce.drawCaret) { ce.drawCaret(view); }
};

/**
| Returns true if point is on this panel.
*/
Panel.prototype.mousehover = function(p, shift, ctrl) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this._weave();
	var a, aZ;

	if(p === null) { return this.setHover(null); }

	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		return this.setHover(null);
	}
	var pp = p.sub(pnw);

	// TODO Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', View.proper, pp)) {
		return this.setHover(null);
	}

	var cursor = null;

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];

		if (cursor) {
			ce.mousehover(null, shift, ctrl);
		} else {
			cursor = ce.mousehover(pp, shift, ctrl);
		}
	}

	if (cursor === null) { this.setHover(null); }

	return cursor || 'default';
};

/**
| Returns true if point is on this panel.
*/
Panel.prototype.mousedown = function(p, shift, ctrl) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fabric = this._weave();
	var a, aZ;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) {
		this.setHover(null);
		return null;
	}
	var pp = p.sub(pnw);

	// TODO Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', View.proper, pp))  {
		this.setHover(null);
		return null;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		var r = ce.mousedown(pp, shift, ctrl);
		if (r) { return r; }
	}
	this.setHover(null);
	return false;
};

/**
| Text input.
*/
Panel.prototype.input = function(text) {
	var focus = this.focusedCC();
	if (!focus) { return; }
	focus.input(text);
};

/**
| Cycles the focus
*/
Panel.prototype.cycleFocus = function(dir) {
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
Panel.prototype.specialKey = function(key, shift, ctrl) {
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
Panel.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};


/**
| Sets the focused component.
*/
Panel.prototype.setFocus = function(cname) {
	var com = this.cc[cname];
	var focus = this.focusedCC();
	if (focus === com) { return; }

	shell.setCaret('board', {
		path : new Path([this.name, cname]),
		at1  : 0
	});
};

/**
| Sets the hovered component.
*/
Panel.prototype.setHover = function(cname) {
	if (this.$hover === cname) { return null; }

	this.$fabric = null;
	shell.redraw = true;

	if (this.$hover)
		{ this.cc[this.$hover].knock(); }

	if (cname)
		{ this.cc[cname].knock(); }

	this.$hover = cname;
	return null;
};

})();
