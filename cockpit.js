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
var Jools;
var Fabric;
var Path;
var Tree;
var Patterns;

var theme;
var system;

/**
| Exports
*/
var Cockpit;

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
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var RoundRect     = Fabric.RoundRect;

var fontStyles = {
	center12 : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	center18 : {
		type  : 'FontStyle',
		font  : '18px ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	center22b : {
		type  : 'FontStyle',
		font  : '22px bold ' + theme.defaultFont,
		fill  : 'black',
		align : 'center',
		base  : 'alphabetic'
	},
	left12 : {
		type  : 'FontStyle',
		font  : '12px ' + theme.defaultFont,
		fill  : 'black',
		align : 'start',
		base  : 'alphabetic'
	}
};

var sideButtonWidth = 190;
var sideSkew        = 200;  // TODO rename
var sideCurve       =  60;  // TODO rename
var sideButtonC1X   = R(sideSkew  / 1.4);
var sideButtonC1Y   = R(sideCurve / 1.4);
var sideButtonC2X   =  15;
var sideButtonC2Y   =  50;
var mTopCurve       = 300;

var styles = {
	'sides'     : theme.cockpit.sides,
	'highlight' : theme.cockpit.highlight,
	'boxes'     : {
		edge : [
			{ border: 0, width : 1, color : 'black' },
		],
	}
};

var designs = {};

designs.mainboard = {
	type   : 'Design',

	frame : {
		type  : 'Frame',
		pnw   : { type   : 'Point', anchor : 's', x : -512, y : -60 },
		pse   : { type   : 'Point', anchor : 's', x :  512, y :   0 }
	},


	layout :  {
		type  : 'Layout',
		copse : {
			'greet'       : {
				type      : 'Label',
				text      : 'Hello',
				fontStyle : fontStyles.center12,
				pos       : { type : 'Point', anchor : 'sw', x:  240, y:  -34 }
			},

			'username'    : {
				type      : 'Label',
				text      : 'Visitor',
				fontStyle : fontStyles.center18,
				pos       : { type : 'Point', anchor : 'sw', x :  240, y :  -11 }
			},

			'saycurrent'  : {
				type      : 'Label',
				text      : 'current space',
				fontStyle : fontStyles.center12,
				pos       : { type : 'Point', anchor :  's', x :    0, y :  -39 }
			},

			'cspace'      : {
				type      : 'Label',
				text      : 'welcome',
				fontStyle : fontStyles.center22b,
				pos       : { type : 'Point', anchor :  's', x :    0, y :  -15 }
			},

			'message'     : {
				type      : 'Label',
				text      : 'This is a message just for testing.',
				fontStyle : fontStyles.left12,
				pos       : { type : 'Point', anchor : 'se', x : -450, y : -20  }
			},

			'login' : {
				type      : 'Custom',
				style     : 'sides',
				highlight : 'highlight',
				frame : {
					type  : 'Frame',
					pnw   : {
						type   : 'Point',
						anchor : 'sw',
						x      : 0,
						y      : -36,
					},
					pse   : {
						type   : 'Point',
						anchor : 'sw',
						x      : sideButtonWidth,
						y      : 0
					}
				},
				curve     :  {
					type  : 'Curve',
					copse : {
						'1' : {
							type : 'MoveTo',
							to   : {
								type : 'Point',
								anchor : 'sw',
								x : 0,
								y : 0
							},
							bx   : 1,
							by   : 0,
						},
						'2' : {
							type : 'BeziTo',
							c1x  :  sideButtonC1X,
							c1y  : -sideButtonC1Y,
							c2x  : -sideButtonC2X,
							c2y  : -sideButtonC2Y,
							to   : {
								type   : 'Point',
								anchor : 'se',
								x      : 0,
								y      : 0
							},
							bx   : -1,
							by   :  0,
						},
					},
					ranks : [ '1', '2' ]
				},
			},

			'register' : {
				type      : 'Custom',
				style     : 'sides',
				highlight : 'highlight',
				frame : {
					type  : 'Frame',
					pnw   : {
						type   : 'Point',
						anchor : 'se',
						x : -sideButtonWidth,
						y : -36,
					},
					pse   : {
						type   : 'Point',
						anchor : 'se',
						x      : 0,
						y      : 0
					}
				},
				curve :  {
					type : 'Curve',
					copse : {
						'1' : {
							type : 'MoveTo',
							to   : {
								type   : 'Point',
								anchor : 'se',
								x      : 0,
								y      : 0
							},
							bx   : 1,
							by   : 0,
						},
						'2' : {
							type : 'BeziTo',
							c1x  : -sideButtonC1X,
							c1y  : -sideButtonC1Y,
							c2x  :  sideButtonC2X,
							c2y  : -sideButtonC2Y,
							to   : {
								type   : 'Point',
								anchor : 'sw',
								x : 0,
								y : 0
							},
							bx   : -1,
							by   :  0,
						},
					},
					ranks : [ '1', '2' ]
				},
			}
		},
		ranks : [
			'greet',
			'username',
			'saycurrent',
			'cspace',
			'message',
			'login',
			'register'
		]
    },
};


designs.loginboard = {
	type   : 'Design',
	layout :  {
		type  : 'Layout',
		copse : {
			'userLabel' : {
				type : 'Label',
				text : 'username',
				fontStyle : {
					type : 'FontStyle',
					font  : '16px ' + theme.defaultFont,
					fill  : 'black',
					align : 'left',
					base  : 'alphabetic'
				},
				pos: {
					type : 'Point',
					anchor : 's',
					x: -220,
					y:  -75
				}
			},
			'passLabel' : {
				type : 'Label',
				text : 'password',
				fontStyle : {
					type  : 'FontStyle',
					font  : '16px ' + theme.defaultFont,
					fill  : 'black',
					align : 'left',
					base  : 'alphabetic'
				},
				pos: {
					type   : 'Point',
					anchor : 's',
					x      : -220,
					y      :  -75
				}
			}
			//{
			//	type : 'Input',
			//	name : 'userinput',
			//	pos : {
			//		pnw : {
			//			x : { anchor : 'm', v : -100},
			//			y : { anchor : 's', v :  -40}
			//		},
			//		pse : {
			//			x : { anchor : 'm', v :  100},
			//			y : { anchor : 's', v :  -20}
			//		}
			//	}
			//}
		},
		ranks : [ 'userLabel', 'passLabel' ]
    },
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
}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  ,       .       .
 | `-'  )   ,-. |-. ,-. |
 |   . /    ,-| | | |-' |
 `--'  `--' `-^ ^-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed Label

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CLabel = function(twig, board, inherit, methods) {
	this.twig    = twig;
	this.board   = board;
	this.pos     = computePoint(twig.pos, board.iframe);
	this.methods = methods ? methods : {};
}

CLabel.prototype.draw = function(fabric) {
	var fs = this.twig.fontStyle;
	fabric.fontStyle(fs.font, fs.fill, fs.align, fs.base);
	fabric.fillText(this.twig.text, this.pos);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--.  ,--.         .
 | `-' | `-' . . ,-. |- ,-. ,-,-.
 |   . |   . | | `-. |  | | | | |
 `--'  `--'  `-^ `-' `' `-' ' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed custom element.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CCustom = function(twig, board, inherit, methods) {
	this.twig    = twig;
	this.board   = board;
	this.methods = methods ? methods : {};
	var pnw      = this.pnw    = computePoint(twig.frame.pnw, board.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, board.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));

	var curve    = twig.curve;
	this.curve   = [];
	if (curve.copse[curve.ranks[0]].type !== 'MoveTo') {
		throw new Error('Curve does not begin with MoveTo');
	}
	for(var a = 0, aZ = curve.length; a < aZ; a++) {
		var ct = curve.copse[curve.ranks[a]];
		this.curve.push({
			to   : computePoint(ct.to, iframe),
			twig : ct,
		});
	}

	this.$fabric    = null;
	this.$highlight = false;
}

/**
| Paths the custom control
*/
CCustom.prototype.path = function(fabric, border, twist) {
	var curve = this.curve;
	fabric.beginPath(twist);
	for(var a = 0, aZ = curve.length; a < aZ; a++) {
		var c = curve[a];
		var ct = c.twig;
		var to = c.to;
		var bx = ct.bx;
		var by = ct.by;
		switch(ct.type) {
		case 'MoveTo':
			fabric.moveTo(to.x + bx * border, to.y + by * border);
			break;
		case 'LineTo':
			fabric.lineTo(to.x + bx * border, to.y + by * border);
			break;
		case 'BeziTo':
			fabric.beziTo(ct.c1x , ct.c1y - bx * border,
						  ct.c2x , ct.c2y - bx * border,
						  to.x + bx * border,
						  to.y + by * border);
			break;
		default :
			throw new Error('invalid curve type: ' + ct.type);
		}
	}
};

/**
| Returns the fabric for the custom element.
*/
CCustom.prototype.getFabric = function(highlight) {
	var fabric = this.$fabric;
	if (fabric && this.$highlight === highlight) { return fabric; }

	var fabric = this.$fabric = new Fabric(this.iframe);
	var sname = highlight ? this.twig.highlight : this.twig.style;
	var style = styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this, 'path');

	if (dbgBoxes) {
		fabric.paint(styles.boxes, new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
}

/**
| Draws the custom control.
*/
CCustom.prototype.draw = function(fabric, highlight) {
	fabric.drawImage(this.getFabric(highlight), this.pnw);
}



/*
 // Draws the mainboards contents
	var stHighlight = theme.cockpit.highlight;
	var stSides     = theme.cockpit.sides;
	var hl          = this._highlight;
	fabric.paint(hl === 'left'  ? stHighlight : stSides, this, 'pathLeft');
	fabric.paint(hl === 'right' ? stHighlight : stSides, this, 'pathRight');


	var sideButtonX1 = pnw.x + 135;
	var sideButtonX2 = pse.x - 135;
	var sideButtonY  = pse.y -  9;
	fabric.fontStyle('14px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
	fabric.fillText('login', sideButtonX1, sideButtonY);
	fabric.fillText('register', sideButtonX2, sideButtonY);

}
*/

var Methods = {};
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ meth-login +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 methods of the login custom element.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Methods.login = {};
Methods.login.mousehover = function(board, ele, p) {
	if (p.x < ele.pnw.x || p.y < ele.pnw.y || p.x > ele.pse.x || p.y > ele.pse.y) {
		return false;
	}
	var fabric = ele.getFabric();
	var pp = p.sub(ele.pnw);
	if (!fabric.within(ele, 'path', pp))  { return false; }

	system.setCursor('default');
	board.setHighlight('login');
	board.$fabric = null;
	shell.redraw = true;
	return true;
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ meth-register +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 methods of the login custom element.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Methods.register = {};
Methods.register.mousehover = function(board, ele, p) {
	if (p.x < ele.pnw.x || p.y < ele.pnw.y || p.x > ele.pse.x || p.y > ele.pse.y) {
		return false;
	}
	var fabric = ele.getFabric();
	var pp = p.sub(ele.pnw);
	if (!fabric.within(ele, 'path', pp))  { return false; }

	system.setCursor('default');
	board.setHighlight('register');
	board.$fabric = null;
	shell.redraw = true;
	return true;
};



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ,--. ,-,---.               .
 | `-'  '|___/ ,-. ,-. ,-. ,-|
 |   .  ,|   \ | | ,-| |   | |
 `--'  `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A cockpit board.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CBoard = function(design, inherit, screensize) {
	var tree    = this.tree  = new Tree(design, Patterns.mDesign);
	var frameD  = tree.root.frame;
	var oframe  = new Rect(Point.zero, screensize);
	var pnw     = this.pnw    = computePoint(frameD.pnw, oframe);
	var pse     = this.pse    = computePoint(frameD.pse, oframe);
	var iframe  = this.iframe = new Rect(Point.zero, pse.sub(pnw));

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
		this.cc[name] = this.newCC(twig, inherit && inherit.cc[name], Methods[name]);
	}
};

/**
| Creates a new enhanced element.
*/
CBoard.prototype.newCC = function(twig, inherit, methods) {
	switch(twig.type) {
	case 'Label'  : return new CLabel (twig, this, inherit, methods);
	case 'Custom' : return new CCustom(twig, this, inherit, methods);
	default       : throw new Error('Invalid element type: ' + twig.type);
	}
}

/**
| Paths the boards frame
*/
CBoard.prototype.path = function(fabric, border, twist) {
	var iframe = this.iframe;
	var fmx = half(iframe.width);
	var tc  = mTopCurve;
	var sc  = sideCurve;
	var sk  = sideSkew;
	var bo  = border;

	fabric.beginPath(twist);
	fabric.moveTo(bo, iframe.height);
	fabric.beziTo(sk, -sc + bo, -tc,        0,               fmx, bo);
	fabric.beziTo(tc,        0, -sk, -sc + bo, iframe.width - bo, iframe.height);
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
	if (this.$fabric) { return this.$fabric; }
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
}

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
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var cname = layout.ranks[a];
		var ce = this.cc[cname];
		if (!ce.methods.mousehover) { continue; }
		if (ce.methods.mousehover(this, ce, pp)) { break; }
	}
	if (a >= aZ) {
		system.setCursor('default');
		this.setHighlight(null);
	}
	return true;
}

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
}


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
		loginboard : null,
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
}


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
			designs[this.curBoardName],
			cboard,
			new Point(fabric.width, fabric.height));
	}
}

/**
| Sets the space name displayed on the mainboard.
*/
Cockpit.prototype.setCurSpace = function(curSpace) {
	// TODO
	this._curSpace = curSpace;
}

/**
| Sets the user greeted on the mainboard
*/
Cockpit.prototype.setUser = function(user, loggedIn) {
	// TODO
	this._user     = user;
	this._loggedIn = loggedIn;
}


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
| Login button clicked.
*/
Cockpit.prototype.loginButtonClick = function() {
	// TODO
	this.mainboard(this.fabric).setHighlight(null);
	this.curBoardName  = 'login';
	shell.redraw = true;
}

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	var fabric = this.fabric;
	return null;
	/*
	switch(this._state) {
	case null:
		var board = this.mainboard(fabric);
		if (!board.within(fabric, p, null)) { return null; }
		if (board.within(fabric, p, 'left')) {
			this.loginButtonClick();
			return false;
		}
	case 'login' :
		var board = this.loginboard(fabric);
		if (!board.within(fabric, p, null)) { return null; }
		this._state  = null;
		shell.redraw = true;
		break;
	default :
		throw new Error('invalid cockpit state: ' + this._state);
	}*/

	//return false;
};

})();
