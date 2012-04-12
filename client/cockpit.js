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

                                  ,--.         .         .
                                 | `-' ,-. ,-. | , ,-. . |-
                                 |   . | | |   |<  | | | |
                                 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                   '
 The unmoving interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Design;
var Jools;
var Fabric;
var Path;
var Tree;
var Patterns;

var theme;
var system;
var shell;
var dbgNoCache;

/**
| Exports
*/
var Cockpit = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('shell.js needs a browser!'); }

/**
| If true draws boxes around all frames
*/
var dbgBoxes = false;

var R   = Math.round;
var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var debug         = Jools.debug;
var fixate        = Jools.fixate;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

var half          = Fabric.half;
var BeziRect      = Fabric.BeziRect;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;

var styles = {
	'boxes'      : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	'button'     : theme.cockpit.button,
	'highlight'  : theme.cockpit.highlight,
	'input'      : theme.cockpit.input,
	'inputfocus' : theme.cockpit.inputfocus,
	'sides'      : theme.cockpit.sides,
	'zero'       : theme.cockpit.zero,
	'zhighlight' : theme.cockpit.zhighlight
};


/**
| Computes a point by its anchor
*/
var computePoint = function(model, oframe) {
	var p;
	var pnw = oframe.pnw;
	var pse = oframe.pse;

	switch (model.anchor) {
	// @@ integrate add into switch
	// @@ make this part of oframe logic
	case 'c'  : p = new Point(half(pnw.x + pse.x), half(pnw.y + pse.y)); break;
	case 'n'  : p = new Point(half(pnw.x + pse.x), pnw.y);               break;
	case 'ne' : p = new Point(pse.x,               pnw.y);               break;
	case 'e'  : p = new Point(pse.x,               half(pnw.y + pse.y)); break;
	case 'se' : p = pse;                                                 break;
	case 's'  : p = new Point(half(pnw.x + pse.x), pse.y);               break;
	case 'sw' : p = new Point(pnw.x,               pse.y);               break;
	case 'w'  : p = new Point(pnw.x,               half(pnw.y + pse.y)); break;
	case 'nw' : p = pnw;                                                 break;
	}
	return p.add(model.x, model.y);
};


/**
| Computes a curve for a frame.
*/
var computeCurve = function(twig, frame) {
	var asw = [];
	if (twig.copse[twig.ranks[0]].type !== 'MoveTo') {
		throw new Error('Curve does not begin with MoveTo');
	}

	for(var a = 0, aZ = twig.length; a < aZ; a++) {
		var ct = twig.copse[twig.ranks[a]];
		asw.push({
			to   : computePoint(ct.to, frame),
			twig : ct
		});
	}

	return asw;
};


/**
| Paths a curve in a fabric
*/
var pathCurve = function(fabric, border, twist, curve) {
	fabric.beginPath(twist);
	var lbx = 0;
	var lby = 0;
	var bo = border;
	for(var a = 0, aZ = curve.length; a < aZ; a++) {
		var c = curve[a];
		var ct = c.twig;
		var to = c.to;
		var bx = ct.bx * bo;
		var by = ct.by * bo;
		switch(ct.type) {
		case 'MoveTo':
			fabric.moveTo(to.x + bx, to.y + by);
			break;
		case 'LineTo':
			fabric.lineTo(to.x + bx, to.y + by);
			break;
		case 'BeziTo':
			var tbx = to.x + bx;
			var tby = to.y + by;
			fabric.beziTo(
				ct.c1x + (tbx && tbx + lbx ? (tbx / (tbx + lbx)) : 0),
				ct.c1y + (tby && tby + lby ? (tby / (tby + lby)) : 0),

				ct.c2x + (tbx && tbx +  bx ? (tbx / (tbx + bx)) : 0),
				ct.c2y + (tby && tby +  by ? (tby / (tby + by)) : 0),

				tbx         , tby
			);
			break;
		default :
			throw new Error('invalid curve type: ' + ct.type);
		}
		lbx = bx;
		lby = by;
	}
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  ,--.         .
 | `-' | `-' . . ,-. |- ,-. ,-,-.
 |   . |   . | | `-. |  | | | | |
 `--'  `--'  `-^ `-' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed custom element.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CCustom = function(twig, board, inherit, name) {
	this.twig    = twig;
	this.board   = board;
	this.name    = name;
	this.methods = Methods[name];
	if (!this.methods) { this.methods = {}; }

	var pnw      = this.pnw    = computePoint(twig.frame.pnw, board.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, board.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = computeCurve(twig.curve, iframe);

	this.caption = {
		pos : computePoint(twig.caption.pos, iframe)
	};
	this.$fabric    = null;
	this.$highlight = false;
};

/**
| Paths the custom control
*/
CCustom.prototype.path = function(fabric, border, twist) {
	pathCurve(fabric, border, twist, this.curve);
};

/**
| Returns the fabric for the custom element.
*/
CCustom.prototype.getFabric = function(highlight) {
	var fabric = this.$fabric;
	if (fabric && this.$highlight === highlight && !dbgNoCache) { return fabric; }

	fabric = this.$fabric = new Fabric(this.iframe);
	var sname = highlight ? this.twig.highlight : this.twig.style;
	var style = styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this, 'path');

	var fs = this.twig.caption.fontStyle;
	fabric.fontStyle(fs.font, fs.fill, fs.align, fs.base);
	fabric.fillText(this.twig.caption.text, this.caption.pos);

	if (dbgBoxes) {
		fabric.paint(styles.boxes, new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
};

/**
| Mouse hover.
*/
CCustom.prototype.mousehover = function(board, p) {
	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y) {
		return false;
	}
	var fabric = this.getFabric();
	var pp = p.sub(this.pnw);
	if (!fabric.within(this, 'path', pp))  { return false; }

	system.setCursor('default');
	board.setHighlight(this.name);
	this.$fabric = board.$fabric = null;
	shell.redraw = true;

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
	var fabric = this.getFabric();
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
CCustom.prototype.draw = function(fabric, highlight) {
	fabric.drawImage(this.getFabric(highlight), this.pnw);
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ CInput +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed Label

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CInput = function(twig, board, inherit, name) {
	this.twig    = twig;
	this.board   = board;
	this.name    = name;
	this.methods = Methods[name];
	if (!this.methods) { this.methods = {}; }

	var pnw  = this.pnw  = computePoint(twig.frame.pnw, board.iframe);
	var pse  = this.pse  = computePoint(twig.frame.pse, board.iframe);
	var bezi = this.bezi = new BeziRect(Point.zero, pse.sub(pnw), 7, 3);

	this.$fabric    = null;
	this.$highlight = false;
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

CInput.prototype.getFabric = function() {
	var fabric = new Fabric(this.bezi.width, this.bezi.height);
	var sname  = this.twig.style;
	var style  = styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this.bezi, 'path');
	return fabric;
}

CInput.prototype.draw = function(fabric) {
	fabric.drawImage(this.getFabric(), this.pnw);
	/*var sname  = this.twig.style;
	var style  = styles[sname];
	fabric.paint(style, this.bezi)

	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this, 'path');*/
};

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
	return null;
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  ,       .       .
 | `-'  )   ,-. |-. ,-. |
 |   . /    ,-| | | |-' |
 `--'  `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed Label

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CLabel = function(twig, board, inherit, name) {
	this.twig    = twig;
	this.board   = board;
	this.name    = name;
	this.pos     = computePoint(twig.pos, board.iframe);
	this.methods = Methods[name];
	if (!this.methods) { this.methods = {}; }
};

CLabel.prototype.draw = function(fabric) {
	var fs = this.twig.fontStyle;
	fabric.fontStyle(fs.font, fs.fill, fs.align, fs.base);
	fabric.fillText(this.twig.text, this.pos);
};

/**
| Mouse hover
*/
CLabel.prototype.mousehover = function(board, p) {
	return false;
};

/**
| Mouse down
*/
CLabel.prototype.mousedown = function(board, p) {
	return null;
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ,-,-,-.       .  .         .
 `,| | |   ,-. |- |-. ,-. ,-| ,-.
   | ; | . |-' |  | | | | | | `-.
   '   `-' `-' `' ' ' `-' `-^ `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Methods = {};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Mainboard:loginMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The side button on the mainboard.
 Switches to the loginboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Methods.loginMC = {};

Methods.loginMC.mousedown = function(board, ele, p) {
	board.cockpit.setCurBoard('loginboard');
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Mainboard:registerMC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The register button on the mainboard.
 Switches to the registerboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Methods.registerMC = {};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++Loginboard:cancelBC+++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The cancel button on the loginboard.
 Switches back to the mainboard.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

Methods.cancelBC = {};

Methods.cancelBC.mousedown = function(board, ele, p) {
	board.cockpit.setCurBoard('mainboard');
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--. ,-,---.               .
 | `-'  '|___/ ,-. ,-. ,-. ,-|
 |   .  ,|   \ | | ,-| |   | |
 `--'  `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A cockpit board.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CBoard = function(design, inherit, cockpit, screensize) {
	this.cockpit = cockpit;
	var tree     = this.tree  = new Tree(design, Patterns.mDesign);
	var frameD   = tree.root.frame;
	var oframe   = new Rect(Point.zero, screensize);
	var pnw      = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse      = this.pse    = computePoint(frameD.pse, oframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));
	this.curve   = computeCurve(tree.root.curve, iframe);

	// TODO use point arithmetic
	this.gradientPC = new Point(half(iframe.width), iframe.height + 450);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.screensize = screensize;

	this._highlight = inherit ? inherit._highlight : null;

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
	pathCurve(fabric, border, twist, this.curve);
	/*
	var iframe = this.iframe;
	var fmx = half(iframe.width);
	var tc  = mTopCurve;
	var bo  = border;

	fabric.beginPath(twist);
	fabric.moveTo(bo, iframe.height);
	fabric.beziTo(sk, -sc + bo, -tc,        0,               fmx, bo);
	fabric.beziTo(tc,        0, -sk, -sc + bo, iframe.width - bo, iframe.height);
	*/
};

/**
| Paths the passwords input field.
| TODO remove
*/
/*
CBoard.prototype.pathPassword = function(fabric, border, twist) {
	var bo  = border;
	var px  = this.fmx - 15;
	var py  = this.pse.y - 45;
	var w   = 220;
	var h   = 28;
	var ww  = half(w);
	var hh  = half(h);
	var wwk = R(w * 0.4);
	var hhk = R(h * 0.3);
	var wwl = ww - wwk;
	var hhl = hh - hhk;

	fabric.beginPath(twist);
	fabric.moveTo(                         px + wwk,     py - hh  + bo);
	fabric.beziTo( wwl,     0,    0, -hhl, px + ww - bo, py - hhk);
	fabric.lineTo(                         px + ww - bo, py + hhk);
	fabric.beziTo(   0,   hhl,  wwl,    0, px + wwk,     py + hh - bo);
	fabric.lineTo(                         px - wwk,     py + hh - bo);
	fabric.beziTo(-wwl,     0,    0,  hhl, px - ww + bo, py + hhk);
	// @@ works around chrome pixel error
	fabric.lineTo(                         px - ww + bo, py + hhk + 1);
	fabric.lineTo(                         px - ww + bo, py - hhk);
	fabric.beziTo(    0, -hhl, -wwl,    0, px - wwk,     py - hh + bo);
	fabric.lineTo(                         px + wwk,     py - hh + bo);
};
*/

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
		c.draw(fabric, cname == this._highlight);
	}

	if (dbgBoxes) {
		fabric.paint(styles.boxes,
			new Rect(iframe.pnw, iframe.pse.sub(1, 1)), 'path');
	}

	/*
	var layout   = layouts.loginboard;
	var elements = layout.elements;

	var stHighlight = theme.cockpit.highlight;
	var hl          = this._highlight;

	var fmx = this.fmx;
	var pnw = this.pnw;
	var pse = this.pse;

	var sideLabelX = pnw.x + 145;
	var sideLabelY = pse.y -  13;

	var passLabelX = fmx    - 220;
	var passLabelY = pse.y  -  40;
	fabric.fillText('password', passLabelX, passLabelY);

	fabric.paint(theme.cockpit.field, this, 'pathUsername');
	fabric.paint(theme.cockpit.field, this, 'pathPassword');*/

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
		this.setHighlight(null);
		return false;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHighlight(null);
		return false;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousehover(this, pp)) { return true; }
	}
	system.setCursor('default');
	this.setHighlight(null);
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
		this.setHighlight(null);
		return null;
	}
	var pp = p.sub(pnw);

	// @@ Optimize by reusing the latest path of this.$fabric
	if (!fabric.within(this, 'path', pp))  {
		this.setHighlight(null);
		return null;
	}

	var layout = this.tree.root.layout;
	for(a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (ce.mousedown(this, pp)) { return false; }
	}
	system.setCursor('default');
	this.setHighlight(null);
	return false;
};


/**
| Sets the highlighted element.
*/
CBoard.prototype.setHighlight = function(highlight) {
	if (this._highlight === highlight) { return; }

	this.$fabric = null;
	shell.redraw = true;
	if (this._highlight) { this.cc[this._highlight].$fabric = null; }
	if (      highlight) { this.cc[      highlight].$fabric = null; }
	this._highlight = highlight;
};


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.         .         .
 | `-' ,-. ,-. | , ,-. . |-
 |   . | | |   |<  | | | |
 `--'  `-' `-' ' ` |-' ' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                   '
 The unmoving interface.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Cockpit = function() {
	this.fabric       = system.fabric;
	this.curBoardName = 'mainboard';
	this.boards = {
		mainboard  : null,
		loginboard : null
	};
	this._user       = null;
	this._curSpace   = null;
	this._message    = null;
};

/**
| Sends a message over the mainboard.
*/
Cockpit.prototype.message = function(message) {
	this._message = message;
};


/**
| Returns the current cockpit board
*/
Cockpit.prototype.curBoard = function() {
	var fabric = this.fabric;
	var cboard = this.boards[this.curBoardName];
	if (!is(cboard)) { throw new Error('invalid curBoardName: ' + this.curBoardName); }

	if (cboard &&
		cboard.screensize.x === fabric.width &&
		cboard.screensize.y === fabric.height)
	{
		return cboard;
	} else {
		return this.boards[this.curBoardName] = new CBoard(
			Design[this.curBoardName],
			cboard,
			this,
			new Point(fabric.width, fabric.height));
	}
};

/**
| sets the current board
*/
Cockpit.prototype.setCurBoard = function(boardName) {
	this.curBoardName = boardName;
	shell.redraw = true;
};

/**
| Sets the space name displayed on the mainboard.
*/
Cockpit.prototype.setCurSpace = function(curSpace) {
	// TODO
	this._curSpace = curSpace;
};

/**
| Sets the user greeted on the mainboard
*/
Cockpit.prototype.setUser = function(user, loggedIn) {
	// TODO
	this._user     = user;
	this._loggedIn = loggedIn;
};


/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var fabric    = this.fabric;
	var cb = this.curBoard(fabric);
	fabric.drawImage(cb.getFabric(), cb.pnw);
};


/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	return this.curBoard().mousehover(p);
};

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	var r = this.curBoard().mousedown(p);
	if (r === null) { return null; }
	this.curBoard().mousehover(p);
	return r;
};

})();
