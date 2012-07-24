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
var Caret;
var Curve;
var Euclid;
var Jools;
var shell;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor.
*/
var Input = Dash.Input = function(twig, panel, inherit, name) {
	this.twig    = twig;
	this.panel   = panel;
	this.name    = name;

	var pnw  = this.pnw  = Curve.computePoint(twig.frame.pnw, panel.iframe);
	var pse  = this.pse  = Curve.computePoint(twig.frame.pse, panel.iframe);
	var bezi = this.bezi = new Euclid.BeziRect(Euclid.Point.zero, pse.sub(pnw), 7, 3);

	this._pitch  = new Euclid.Point(8, 3);
	this._$value = inherit ? inherit._$value : '';
	this.$fabric = null;
	this.$accent = Dash.Accent.NORMA;
};

/**
| Returns the width of a character for password masks.
*/
Input.prototype.maskWidth = function(size) {
	return Math.round(size * 0.2);
};

/**
| Returns the kerning of characters for password masks.
*/
Input.prototype.maskKern = function(size) {
	return Math.round(size * 0.15);
};

/**
| The input field is focusable.
*/
Input.prototype.canFocus = function() {
	return true;
};

/**
| Draws the mask for password fields
*/
Input.prototype.maskPath = function(fabric, border, twist, view, length, size) {
	var pitch = this._pitch;
	var x     = view.x(pitch);
	var y     = view.y(pitch) + Math.round(size * 0.7);
	var h     = Math.round(size * 0.32);
	var w     = this.maskWidth(size);
	var w2    = w * 2;
	var k     = this.maskKern(size);
	var wm    = w * Euclid.magic;
	var wh    = h * Euclid.magic;

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
	var fabric = new Euclid.Fabric(this.bezi.width, this.bezi.height);
	var pitch  = this._pitch;

	var sname;
	switch (accent) {
	case Dash.Accent.NORMA : sname = this.twig.normaStyle; break;
	case Dash.Accent.HOVER : sname = this.twig.hoverStyle; break;
	case Dash.Accent.FOCUS : sname = this.twig.focusStyle; break;
	case Dash.Accent.HOFOC : sname = this.twig.hofocStyle; break;
	default : throw new Error('Invalid accent');
	}
	var style  = Dash.getStyle(sname);

	fabric.fill(style.fill, this.bezi, 'path', Euclid.View.proper);
	var font = this.twig.font;
	fabric.setFont(font);

	if(this.twig.password) {
		fabric.fill('black', this, 'maskPath', Euclid.View.proper,
			this._$value.length, font.size);
	} else {
		fabric.fillText(this._$value, pitch.x, font.size + pitch.y);
	}
	fabric.edge(style.edge, this.bezi, 'path', Euclid.View.proper);

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
*/
Input.prototype.locateOffset = function(offset) {
	// TODO cache position
	var twig  = this.twig;
	var font  = twig.font;
	var pitch = this._pitch;
	var val   = this._$value;

	if (this.twig.password) {
		return new Euclid.Point(
			pitch.x + (2 * this.maskWidth(font.size) + this.maskKern(font.size)) * offset - 1,
			Math.round(pitch.y + font.size)
		);
	} else {
		return new Euclid.Point(
			Math.round(pitch.x + Euclid.Measure.width(font, val.substring(0, offset))),
			Math.round(pitch.y + font.size)
		);
	}
};

/**
| Returns the caret position relative to the panel.
*/
Input.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var fs      = this.twig.font.size;
	var descend = fs * theme.bottombox;
	var p       = this.locateOffset(shell.caret.sign.at1);

	var pnw = this.pnw;
	var s = Math.round(p.y + pnw.y + descend);
	var n = s - Math.round(fs + descend);
	var	x = p.x + this.pnw.x - 1;

	return Jools.immute({ s: s, n: n, x: x });
};

/**
| Draws the caret.
*/
Input.prototype.drawCaret = function(view) {
	var caret = shell.caret;
	var panel = this.panel;
	var cpos  = caret.$pos = this.getCaretPos();

	var cx  = cpos.x;
	var ch  = Math.round((cpos.s - cpos.n) * view.zoom);
	var cp = view.point(
		this.panel.pnw.x + cpos.x,
		this.panel.pnw.y + cpos.n
	);
	shell.caret.$screenPos = cp;

	if (Caret.useGetImageData) {
		shell.caret.$save = shell.fabric.getImageData(cp.x, cp.y, 3, ch + 2);
	} else {
		// paradoxically this is often way faster, especially on firefox
		shell.caret.$save = new Euclid.Fabric(shell.fabric.width, shell.fabric.height);
		shell.caret.$save.drawImage(shell.fabric, 0, 0);
	}

	shell.fabric.fillRect('black', cp.x + 1, cp.y + 1, 1, ch);
};

/**
| Returns the current value (text in the box)
*/
Input.prototype.getValue = function() {
	return this._$value;
};

/**
| Sets the current value (text in the box)
*/
Input.prototype.setValue = function(v) {
	this._$value = v;
	this.poke();
};

/**
| User input.
*/
Input.prototype.input = function(text) {
	var caret = shell.caret;
	var csign = caret.sign;
	var v = this._$value;
	var at1 = csign.at1;

	var mlen = this.twig.maxlen;
	if (mlen > 0 && v.length + text.length > mlen) {
		text = text.substring(0, mlen - v.length);
	}

	this._$value = v.substring(0, at1) + text + v.substring(at1);
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
	this._$value = this._$value.substring(0, at1 - 1) + this._$value.substring(at1);
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
	if (at1 >= this._$value.length) return false;
	this._$value = this._$value.substring(0, at1) + this._$value.substring(at1 + 1);
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
	if (at1 >= this._$value.length) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : this._$value.length
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
	if (csign.at1 >= this._$value.length) return false;
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
| Clears all caches
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

	if (!this.bezi.within(fabric, Euclid.View.proper, pp))
		{ return null; }

	return 'text';
};

/**
| Mouse down
*/
Input.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.pnw);
	var fabric = this._weave(Dash.Accent.NORMA);
	if (!fabric.within(this.bezi, 'path', Euclid.View.proper, pp))  { return null; }

	this.panel.setFocus(this.name);
	return false;
};

})();
