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
var Caret;
var Cockpit;
var Curve;
var Fabric;
var Jools;
var Measure;
var shell;
var theme;

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
var BeziRect      = Fabric.BeziRect;
var Point         = Fabric.Point;
var R             = Math.round;
var Rect          = Fabric.Rect;
var computePoint  = Curve.computePoint;
var debug         = Jools.debug;
var half          = Fabric.half;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var magic         = Fabric.magic;
var pitch         = new Point(8, 3);

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

	this.value   = inherit ? inherit.value : '';
	this.$fabric = null;
	this.$accent = CAccent.NORMA;
};

/**
| Returns the width of a character for password masks.
*/
CInput.prototype.maskWidth = function(size) {
	return R(size * 0.2);
};

/**
| Returns the kerning of characters for password masks.
*/
CInput.prototype.maskKern = function(size) {
	return R(size * 0.15);
};

/**
| The input field is focusable.
*/
CInput.prototype.canFocus = function() {
	return true;
};

/**
| Paths the input field.
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
| Draws the mask for password fields
*/
CInput.prototype.maskPath = function(fabric, border, twist, length, size) {
	var x  = pitch.x;
	var y  = R(pitch.y + size * 0.7);
	var h  = R(size * 0.32);
	var w  = this.maskWidth(size);
	var w2 = w * 2;
	var k  = this.maskKern(size);
	var wm = w * magic;
	var wh = h * magic;

	fabric.beginPath(twist);
	for (var a = 0; a < length; a++) {
		fabric.moveTo(                    x + w,  y - h);
		fabric.beziTo( wm,   0,   0, -wh, x + w2, y);
		fabric.beziTo(  0,  wh,  wm,   0, x + w,  y + h);
		fabric.beziTo(-wm,   0,   0,  wh, x,      y);
		fabric.beziTo(  0, -wh, -wm,   0, x + w,  y - h);
		x += w2 + k;
	}
};

/**
| Returns the fabric for the input field.
| TODO caching;
*/
CInput.prototype.getFabric = function(accent) {
	var fabric = new Fabric(this.bezi.width, this.bezi.height);

	var sname;
	switch (accent) {
	case CAccent.NORMA : sname = this.twig.normaStyle; break;
	case CAccent.HOVER : sname = this.twig.hoverStyle; break;
	case CAccent.FOCUS : sname = this.twig.focusStyle; break;
	case CAccent.HOFOC : sname = this.twig.hofocStyle; break;
	default : throw new Error('Invalid accent');
	}
	var style  = Cockpit.styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }

	fabric.fill(style.fill, this.bezi, 'path');
	var fs = this.twig.fontStyle;
	fabric.fontStyle(fs.style, fs.fill, fs.align, fs.base);
	if(this.twig.password) {
		fabric.fill('black', this, 'maskPath', this.value.length, fs.size);
	} else {
		fabric.fillText(this.value, pitch.x, fs.size + pitch.y);
	}
	fabric.edge(style.edge, this.bezi, 'path');

	return fabric;
};


/**
| Draws the input field.
*/
CInput.prototype.draw = function(fabric, accent) {
	fabric.drawImage(this.getFabric(accent), this.pnw);
};

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| @@ rename
*/
CInput.prototype.getOffsetPoint = function(offset) {
	// @@ cache position
	var twig = this.twig;
	var font = twig.fontStyle;
	Measure.font = font.style;
	var val = this.value;

	// @@ use token. text instead.
	if (this.twig.password) {
		return new Point(
			pitch.x + (2 * this.maskWidth(font.size) + this.maskKern(font.size)) * offset - 1,
			R(pitch.y + font.size)
		);
	} else {
		return new Point(
			R(pitch.x + Measure.width(val.substring(0, offset))),
			R(pitch.y + font.size)
		);
	}
};

/**
| Returns the caret position relative to the board.
*/
CInput.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var fs      = this.twig.fontStyle.size;
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1);
	//var p = { x: 2, y : 2};

	var pnw = this.pnw;
	var s = R(p.y + pnw.y + descend);
	var n = s - R(fs + descend);
	var	x = p.x + this.pnw.x - 1;

	return immute({ s: s, n: n, x: x });
};

/**
| Draws the caret if its in this paragraph.
*/
CInput.prototype.drawCaret = function() {
	var caret = shell.caret;
	var board = this.board;
	var cpos  = caret.$pos = this.getCaretPos();

	var cx  = cpos.x;
	var ch  = cpos.s - cpos.n;
	var cp = new Point(
		board.pnw.x + cpos.x,
		board.pnw.y + cpos.n
	);
	shell.caret.$screenPos = cp;

	if (Caret.useGetImageData) {
		shell.caret.$save = shell.fabric.getImageData(cp.x, cp.y, 3, ch + 2);
	} else {
		// paradoxically this is often way faster, especially on firefox
		shell.caret.$save = new Fabric(shell.fabric.width, shell.fabric.height);
		shell.caret.$save.drawImage(shell.fabric, 0, 0);
	}

	shell.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, ch);
};

/**
| User input.
*/
CInput.prototype.input = function(board, text) {
	var caret = shell.caret;
	var csign = caret.sign;
	var v = this.value;
	var at1 = csign.at1;

	var mlen = this.twig.maxlen;
	if (mlen > 0 && v.length + text.length > mlen) {
		text = text.substring(0, mlen - v.length);
	}

	this.value = v.substring(0, at1) + text + v.substring(at1);
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : at1 + text.length
	});
	this.board.poke();
};

/**
| User pressed backspace.
*/
CInput.prototype.keyBackspace = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 <= 0) return false;
	this.value = this.value.substring(0, at1 - 1) + this.value.substring(at1);
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	return true;
};

/**
| User pressed del.
*/
CInput.prototype.keyDel = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.value.length) return false;
	this.value = this.value.substring(0, at1) + this.value.substring(at1 + 1);
	return true;
};

/**
| User pressed return key.
*/
CInput.prototype.keyReturn = function(board) {
	board.cycleFocus(1);
	return true;
};

/**
| User pressed down key.
*/
CInput.prototype.keyDown = function(board) {
	board.cycleFocus(1);
	return true;
};

/**
| User pressed end key.
*/
CInput.prototype.keyEnd = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.value.length) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : this.value.length
	});
	return true;
};

/**
| User pressed left key.
*/
CInput.prototype.keyLeft = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 <= 0) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	return true;
};

/**
| User pressed pos1 key
*/
CInput.prototype.keyPos1 = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 <= 0) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : 0
	});
	return true;
};

/**
| User pressed right key
*/
CInput.prototype.keyRight = function(board) {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 >= this.value.length) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : csign.at1 + 1
	});
	return true;
};

/**
| User pressed a special key
*/
CInput.prototype.specialKey = function(board, key) {
	var poke = false;
	switch(key) {
	case 'backspace' : poke = this.keyBackspace(board); break;
	case 'del'       : poke = this.keyDel      (board); break;
	case 'down'      : poke = this.keyDown     (board); break;
	case 'end'       : poke = this.keyEnd      (board); break;
	case 'left'      : poke = this.keyLeft     (board); break;
	case 'pos1'      : poke = this.keyPos1     (board); break;
	case 'return'    : poke = this.keyReturn   (board); break;
	case 'right'     : poke = this.keyRight    (board); break;
	case 'up'        : poke = this.keyUp       (board); break;
	}
	if (poke) { this.board.poke(); }
};

/**
| User pressed up key.
*/
CInput.prototype.keyUp = function(board) {
	board.cycleFocus(-1);
	return true;
};

CInput.prototype.poke = function() {
	this.$fabric = null;
	this.board.poke();
};

/**
| Mouse hover
*/
CInput.prototype.mousehover = function(board, p, shift, ctrl) {
	return false;
};

/**
| Mouse down
*/
CInput.prototype.mousedown = function(board, p, shift, ctrl) {
	var pp = p.sub(this.pnw);
	var fabric = this.getFabric(CAccent.NORMA);
	if (!fabric.within(this.bezi, 'path', pp))  { return null; }

	board.setFocus(this.name);
	return false;
};

})();
