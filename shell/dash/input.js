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
               ,-_/             .
               '  | ,-. ,-. . . |-
               .^ | | | | | | | |
               `--' ' ' |-' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An input field on a panel.

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
var BeziRect;
var Caret;
var Curve;
var Euclid;
var Fabric;
var Jools;
var Measure;
var Rect;
var shell;
var theme;
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
var ro    = Math.round;
var isnon = Jools.isnon;
var pitch = new Euclid.Point(8, 3);

/**
| Constructor.
*/
var Input = Dash.Input = function(twig, panel, inherit, name) {
	this.twig    = twig;
	this.panel   = panel;
	this.name    = name;

	var pnw  = this.pnw  = Curve.computePoint(twig.frame.pnw, panel.iframe);
	var pse  = this.pse  = Curve.computePoint(twig.frame.pse, panel.iframe);
	var bezi = this.bezi = new BeziRect(Euclid.Point.zero, pse.sub(pnw), 7, 3);

	this.value   = inherit ? inherit.value : '';
	this.$fabric = null;
	this.$accent = Dash.Accent.NORMA;
};

/**
| Returns the width of a character for password masks.
*/
Input.prototype.maskWidth = function(size) {
	return ro(size * 0.2);
};

/**
| Returns the kerning of characters for password masks.
*/
Input.prototype.maskKern = function(size) {
	return ro(size * 0.15);
};

/**
| The input field is focusable.
*/
Input.prototype.canFocus = function() {
	return true;
};

/**
| Paths the input field.
*/
/*
Input.prototype.path = function(fabric, border, twist) {
	fabric.moveTo(this.pnw);
	fabric.lineTo(this.pse.x, this.pnw.y);
	fabric.lineTo(this.pse);
	fabric.lineTo(this.pnw.x, this.pse.y);
	fabric.lineTo(this.pnw);
};*/

/**
| Draws the mask for password fields
*/
Input.prototype.maskPath = function(fabric, border, twist, view, length, size) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var x  = view.x(pitch);
	var y  = view.y(pitch) + ro(size * 0.7);
	var h  = ro(size * 0.32);
	var w  = this.maskWidth(size);
	var w2 = w * 2;
	var k  = this.maskKern(size);
	var wm = w * Fabric.magic;
	var wh = h * Farbic.magic;

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
Input.prototype._weave = function(accent) {
	var fabric = new Fabric(this.bezi.width, this.bezi.height);

	var sname;
	switch (accent) {
	case Dash.Accent.NORMA : sname = this.twig.normaStyle; break;
	case Dash.Accent.HOVER : sname = this.twig.hoverStyle; break;
	case Dash.Accent.FOCUS : sname = this.twig.focusStyle; break;
	case Dash.Accent.HOFOC : sname = this.twig.hofocStyle; break;
	default : throw new Error('Invalid accent');
	}
	var style  = Dash.Board.styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }

	fabric.fill(style.fill, this.bezi, 'path', View.proper);
	var fs = this.twig.fontStyle;
	fabric.setFont(fs);

	if(this.twig.password) {
		fabric.fill('black', this, 'maskPath', View.proper,
			this.value.length, fs.size);
	} else {
		fabric.fillText(this.value, pitch.x, fs.size + pitch.y);
	}
	fabric.edge(style.edge, this.bezi, 'path', View.proper);

	return fabric;
};


/**
| Draws the input field.
*/
Input.prototype.draw = function(fabric, accent) {
	fabric.drawImage(this._weave(accent), this.pnw);
};

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| TODO rename
*/
Input.prototype.getOffsetPoint = function(offset) {
	// TODO cache position
	var twig     = this.twig;
	var font     = twig.fontStyle;
	Measure.setFont(font.size, font.family);
	var val      = this.value;

	// TODO use token. text instead.
	if (this.twig.password) {
		return new Euclid.Point(
			pitch.x + (2 * this.maskWidth(font.size) + this.maskKern(font.size)) * offset - 1,
			ro(pitch.y + font.size)
		);
	} else {
		return new Euclid.Point(
			ro(pitch.x + Measure.width(val.substring(0, offset))),
			ro(pitch.y + font.size)
		);
	}
};

/**
| Returns the caret position relative to the panel.
*/
Input.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var fs      = this.twig.fontStyle.size;
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1);

	var pnw = this.pnw;
	var s = ro(p.y + pnw.y + descend);
	var n = s - ro(fs + descend);
	var	x = p.x + this.pnw.x - 1;

	return Jools.immute({ s: s, n: n, x: x });
};

/**
| Draws the caret.
*/
Input.prototype.drawCaret = function(view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var caret = shell.caret;
	var panel = this.panel;
	var cpos  = caret.$pos = this.getCaretPos();

	var cx  = cpos.x;
	var ch  = ro((cpos.s - cpos.n) * view.zoom);
	var cp = view.point(
		this.panel.pnw.x + cpos.x,
		this.panel.pnw.y + cpos.n
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
Input.prototype.input = function(text) {
	var caret = shell.caret;
	var csign = caret.sign;
	var v = this.value;
	var at1 = csign.at1;

	var mlen = this.twig.maxlen;
	if (mlen > 0 && v.length + text.length > mlen) {
		text = text.substring(0, mlen - v.length);
	}

	this.value = v.substring(0, at1) + text + v.substring(at1);
	shell.setCaret('board', {
		path : csign.path,
		at1  : at1 + text.length
	});
	this.panel.poke();
};

/**
| User pressed backspace.
*/
Input.prototype.keyBackspace = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 <= 0) return false;
	this.value = this.value.substring(0, at1 - 1) + this.value.substring(at1);
	shell.setCaret('board', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	return true;
};

/**
| User pressed del.
*/
Input.prototype.keyDel = function() {
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
Input.prototype.keyEnter = function() {
	this.panel.cycleFocus(1);
	return true;
};

/**
| User pressed down key.
*/
Input.prototype.keyDown = function() {
	this.panel.cycleFocus(1);
	return true;
};

/**
| User pressed end key.
*/
Input.prototype.keyEnd = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.value.length) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : this.value.length
	});
	return true;
};

/**
| User pressed left key.
*/
Input.prototype.keyLeft = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 <= 0) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	return true;
};

/**
| User pressed pos1 key
*/
Input.prototype.keyPos1 = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 <= 0) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : 0
	});
	return true;
};

/**
| User pressed right key
*/
Input.prototype.keyRight = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 >= this.value.length) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : csign.at1 + 1
	});
	return true;
};

/**
| User pressed up key.
*/
Input.prototype.keyUp = function() {
	this.panel.cycleFocus(-1);
	return true;
};

/**
| User pressed a special key
*/
Input.prototype.specialKey = function(key) {
	var poke = false;
	switch(key) {
	case 'backspace' : poke = this.keyBackspace(); break;
	case 'del'       : poke = this.keyDel();       break;
	case 'down'      : poke = this.keyDown();      break;
	case 'end'       : poke = this.keyEnd();       break;
	case 'enter'     : poke = this.keyEnter();     break;
	case 'left'      : poke = this.keyLeft();      break;
	case 'pos1'      : poke = this.keyPos1();      break;
	case 'right'     : poke = this.keyRight();     break;
	case 'up'        : poke = this.keyUp();        break;
	}
	if (poke) { this.panel.poke(); }
};

/**
| TODO
*/
Input.prototype.poke = function() {
	this.$fabric = null;
	this.panel.poke();
};

/**
| Force clears all caches.
*/
Input.prototype.knock = function() {
	this.$fabric = null;
};


/**
| Mouse hover
*/
Input.prototype.mousehover = function(p, shift, ctrl) {
	if (p === null)
		{ return null; }

	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y)
		{ return null; }

	var fabric = this._weave(Dash.Accent.NORMA);
	var pp = p.sub(this.pnw);

	if (!this.bezi.within(fabric, View.proper, pp))
		{ return null; }

	return 'text';
};

/**
| Mouse down
*/
Input.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.pnw);
	var fabric = this._weave(Dash.Accent.NORMA);
	if (!fabric.within(this.bezi, 'path', View.proper, pp))  { return null; }

	this.panel.setFocus(this.name);
	return false;
};

})();
