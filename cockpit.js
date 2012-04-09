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
			'greet' : {
				type      : 'Label',
				text      : 'Hello',
				fontStyle : fontStyles.center12,
				pos: { type : 'Point', anchor : 'sw', x:  240, y:  -34 }
			},
			'username' : {
				type      : 'Label',
				text      : 'Visitor',
				fontStyle : fontStyles.center18,
				pos: { type : 'Point', anchor : 'sw', x :  240, y :  -11 }
			},
			'saycurrent' : {
				type      : 'Label',
				text      : 'current space',
				fontStyle : fontStyles.center12,
				pos: { type : 'Point', anchor :  's', x :    0, y :  -39 }
			},
			'cspace' : {
				type      : 'Label',
				text      : 'welcome',
				fontStyle : fontStyles.center22b,
				pos: { type : 'Point', anchor :  's', x :    0, y :  -15 }
			},
			'message' : {
				type      : 'Label',
				text      : 'This is a message just for testing.',
				fontStyle : fontStyles.left12,
				pos: { type : 'Point', anchor : 'se', x : -450, y : -20  }
			},
			'login' : {
				type : 'Custom',
				curve :  {
					type : 'Curve',
					copse : {
						'1' : {
							type : 'MoveTo',
							to   : { type : 'Point',  anchor : 'sw', x : 0, y : 0 },
							bx   : 1,
							by   : 0,
						},
						'2' : {
							type : 'BeziTo',
							c1x  :  sideButtonC1X,
							c1y  : -sideButtonC1Y,
							c2x  : -sideButtonC2X,
							c2y  : -sideButtonC2Y,
							to   : { type : 'Point', anchor : 'sw', x : sideButtonWidth, y : 0 },
							bx   : -1,
							by   :  0,
						},
					},
					ranks : [ '1', '2' ]
				},
			},
			'register' : {
				type : 'Custom',
				curve :  {
					type : 'Curve',
					copse : {
						'1' : {
							type : 'MoveTo',
							to   : { type : 'Point',  anchor : 'se', x : 0, y : 0 },
							bx   : 1,
							by   : 0,
						},
						'2' : {
							type : 'BeziTo',
							c1x  : -sideButtonC1X,
							c1y  : -sideButtonC1Y,
							c2x  :  sideButtonC2X,
							c2y  : -sideButtonC2Y,
							to   : { type : 'Point', anchor : 'se', x : -sideButtonWidth, y : 0 },
							bx   : -1,
							by   :  0,
						},
					},
					ranks : [ '1', '2' ]
				},
			}
		},
		ranks : [ 'greet', 'username', 'saycurrent', 'cspace', 'message', 'login', 'register' ]
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
var computePoint = function(model, pnw, pse) {
	var p;
	switch (model.anchor) {
	// TODO integrate add into switch
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
 +++ CLabel +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed Label

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CLabel = function(twig, board, inherit) {
	this.twig  = twig;
	this.board = board;
	this.pos   = computePoint(twig.pos, board.frame.pnw, board.frame.pse);
}

CLabel.prototype.draw = function(fabric) {
	var fs = this.twig.fontStyle;
	fabric.fontStyle(fs.font, fs.fill, fs.align, fs.base);
	fabric.fillText(this.twig.text, this.pos);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ CCustom +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A computed custom element.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CCustom = function(twig, board, inherit) {
	this.twig  = twig;
	this.board = board;
	var curve  = twig.curve;
	this.curve = [];
	if (curve.copse[curve.ranks[0]].type !== 'MoveTo') {
		throw new Error('Curve does not begin with MoveTo');
	}

	for(var a = 0, aZ = curve.length; a < aZ; a++) {
		var ct = curve.copse[curve.ranks[a]];
		this.curve.push({
			to   : computePoint(ct.to, board.frame.pnw, board.frame.pse),
			twig : ct,
		});
	}
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
			debug(ct.c1x / ct.c1y);
			debug(bx * border);
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
| Draws the custom control.
*/
CCustom.prototype.draw = function(fabric) {
	fabric.paint(theme.cockpit.sides, this, 'path');
}


/**
| +++Mainboard+++
*/
/*
var Mainboard = function(model, fw, fh) {
	this.fw            = fw;
	this.fh            = fh;
	var fmx = this.fmx = half(fw);

	this.width       = 512 * 2;
	this.gradientPC  = new Point(fmx, fh + 450);
	this.gradientR0  = 0;
	this.gradientR1  = 650;

	this._sideButtonWidth = 190;
	this._mTopCurve       = 300;

	this._highlight = model ? model._highlight : null;
};
*/

/**
| Paths the mainboards frame
*/
/*
Mainboard.prototype.path = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fmx = this.fmx;
	var tc  = this._mTopCurve;
	var sc  = this.sideCurve;
	var sk  = this.sideSkew;
	var bo  = border;

	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + bo, pse.y);

	fabric.beziTo(sk, -sc + bo, -tc,       0,        fmx, pnw.y + bo);
	fabric.beziTo(tc,        0, -sk, -sc +bo, pse.x - bo, pse.y);
};
*/

/**
| Paths the left side button
*/
/*
Mainboard.prototype.pathLeft = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var sbw = this._sideButtonWidth;
	var x1  = this._sideButtonBX1;
	var y1  = this._sideButtonBY1;
	var x2  = this._sideButtonBX2;
	var y2  = this._sideButtonBY2;
	var bo  = border;
	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + bo, pse.y);
	fabric.beziTo(x1, -y1 + bo, -x2, -y2 + bo, pnw.x + sbw - bo,  pse.y);
};
*/

/**
| Paths the right side button
*/
/*
Mainboard.prototype.pathRight = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var sbw = this._sideButtonWidth;
	var x1  = this._sideButtonBX1;
	var y1  = this._sideButtonBY1;
	var x2  = this._sideButtonBX2;
	var y2  = this._sideButtonBY2;
	var bo  = border;
	fabric.beginPath(twist);
	fabric.moveTo(pse.x - bo, pse.y);
	fabric.beziTo(-x1, -y1 + bo, x2, -y2 + bo, pse.x - sbw + bo,  pse.y);
};
*/


/**
| Draws the mainboards contents
*/
/*
Mainboard.prototype.draw = function(fabric, user, curSpace, msg) {
	fabric.paint(theme.cockpit.style, this, 'path');

	var stHighlight = theme.cockpit.highlight;
	var stSides     = theme.cockpit.sides;
	var hl          = this._highlight;

	fabric.paint(hl === 'left'  ? stHighlight : stSides, this, 'pathLeft');
	fabric.paint(hl === 'right' ? stHighlight : stSides, this, 'pathRight');


	var fmx = this.fmx;
	var pnw = this.pnw;
	var pse = this.pse;

	var sideButtonX1 = pnw.x + 135;
	var sideButtonX2 = pse.x - 135;

	var sideButtonY  = pse.y -  9;


	fabric.fontStyle('14px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'center', 'alphabetic');
	fabric.fillText('login', sideButtonX1, sideButtonY);
	fabric.fillText('register', sideButtonX2, sideButtonY);

}
*/

/**
| Returns true if point is on this mainboard
*/
/*
Mainboard.prototype.within = function(fabric, p, area) {
	var pnw = this.pnw;
	var pse = this.pse;

	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) { return false; }
	switch (area) {
	case null:    return fabric.within(this, 'path',      p);
	case 'left':  return fabric.within(this, 'pathLeft',  p);
	case 'right': return fabric.within(this, 'pathRight', p);
	default:      throw new Error('invalid mainboard area');
	}
}
*/


/**
| Sets the highlighted element.
*/
/*
Mainboard.prototype.setHighlight = function(highlight) {
	if (this._highlight !== highlight) { shell.redraw = true; }
	this._highlight = highlight;
}
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ CFrame +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 A computed frame
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var CFrame = function(twig, pnw, pse) {
	this.pnw = computePoint(twig.pnw, pnw, pse);
	this.pse = computePoint(twig.pse, pnw, pse);
	immute(this);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 +++ Board +++
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A board

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var Board = function(design, inherit, size) {
	var tree  = this.tree  = new Tree(design, Patterns.mDesign);
	var frame = this.frame = new CFrame(tree.root.frame, Point.zero, size);

	this.gradientPC  = new Point(half(frame.pnw.x + frame.pse.x), frame.pse.y + 450);
	this.gradientR0  = 0;
	this.gradientR1  = 650;
	this.size        = size;


	this._highlight       = inherit ? inherit._highlight : null;
	this.cc = {};
	var layout = this.tree.root.layout;
	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var name = layout.ranks[a];
		var twig = layout.copse[name];
		this.cc[name] =  this.newCC(twig, inherit && inherit.cc[name]);
	}
};

/**
| Creates a new enhanced element.
*/
Board.prototype.newCC = function(twig, inherit) {
	switch(twig.type) {
	case 'Label'  : return new CLabel (twig, this, inherit);
	case 'Custom' : return new CCustom(twig, this, inherit);
	default       : throw new Error('Invalid element type: ' + twig.type);
	}
}

/**
| Paths the boards frame
*/
Board.prototype.path = function(fabric, border, twist) {
	var pnw = this.frame.pnw;
	var pse = this.frame.pse;
	var fmx = half(this.frame.pnw.x + this.frame.pse.x);
	var tc  = mTopCurve;
	var sc  = sideCurve;
	var sk  = sideSkew;
	var bo  = border;

	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + bo, pse.y);
	fabric.beziTo(sk, -sc + bo, -tc,        0,        fmx, pnw.y + bo);
	fabric.beziTo(tc,        0, -sk, -sc + bo, pse.x - bo, pse.y);
};

/**
| Paths the passwords input field.
| TODO remove
*/
/*
Board.prototype.pathPassword = function(fabric, border, twist) {
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
Board.prototype.draw = function(fabric) {
	fabric.paint(theme.cockpit.style, this, 'path');
	var layout = this.tree.root.layout;

	for(var a = 0, aZ = layout.length; a < aZ; a++) {
		var c = this.cc[layout.ranks[a]]; // TODO
		c.draw(fabric);
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
}

/**
| Returns true if point is on this mainboard
*/
Board.prototype.within = function(fabric, p) {
	var pnw = this.frame.pnw;
	var pse = this.frame.pse;

	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) { return false; }
	return fabric.within(this, 'path',      p);
}

/**
| Returns true if point is on this mainboard
*/
Board.prototype.mousehover = function(fabric, p) {
	var pnw = this.frame.pnw;
	var pse = this.frame.pse;
	if (p.y < pnw.y || p.x < pnw.x || p.x > pse.x) { return false; }
	return this.within(fabric, p);
}



/**
| Sets the highlighted element.
*/
Board.prototype.setHighlight = function(highlight) {
	if (this._highlight !== highlight) { shell.redraw = true; }
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
	this.fabric      = system.fabric;
	this._state      = null;

	this.$mainboard  = null;
	this.$loginboard = null;

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
| Sets the space name displayed on the mainboard.
*/
Cockpit.prototype.setCurSpace = function(curSpace) {
	this._curSpace = curSpace;
}

/**
| Sets the user greeted on the mainboard
*/
Cockpit.prototype.setUser = function(user, loggedIn) {
	this._user     = user;
	this._loggedIn = loggedIn;
}


/**
| Returns the shape of the mainboard
*/
Cockpit.prototype.mainboard = function(fabric) {
	if (this.$mainboard &&
		this.$mainboard.size.x === fabric.width &&
		this.$mainboard.size.y === fabric.height)
	{ return this.$mainboard; } else
	{ return this.$mainboard = new Board(
			designs.mainboard, this.$mainboard,
			new Point(fabric.width, fabric.height));
	}
}

/**
| Returns the shape of the loginboard
*/
Cockpit.prototype.loginboard = function(fabric) {
	if (this.$loginboard &&
		this.$loginboard.fw === fabric.width &&
		this.$loginboard.fh === fabric.height)
	{ return this.$loginboard } else
	{ return this.$loginboard = new Board(
			designs.loginboard, this.$loginboard,
			new Point(fabric.width, fabric.height));
	}
}

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var fabric    = this.fabric;

	switch (this._state) {
	case null :
		this.mainboard(fabric).draw(fabric, this._user, this._curSpace, this._message);
		break;
	case 'login' :
		this.loginboard(fabric).draw(fabric);
		break;
	}
};


/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	var fabric    = this.fabric;
	switch (this._state) {
	case null :
		var board = this.mainboard(fabric);
		return board.mousehover(fabric, p);

		/*
		if (!board.within(fabric, p, null)) {
			board.setHighlight(null);
			return false;
		}
		system.setCursor('default');
		if (board.within(fabric, p, 'left')) {
			board.setHighlight('left');
		} else if (board.within(fabric, p, 'right')) {
			board.setHighlight('right');
		} else {
			board.setHighlight(null);
		}
		break;*/
	case 'login' :
		break;
	default :
		throw new Error('invalid cockpit state' + this._state);
	}

	return true;
};

/**
| Login button clicked.
*/
Cockpit.prototype.loginButtonClick = function() {
	this.mainboard(this.fabric).setHighlight(null);
	this._state  = 'login';
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
