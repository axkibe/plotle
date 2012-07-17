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
                 ,--. .       .
                | `-' |-. ,-. |-
                |   . | | ,-| |
                `--'  ' ' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A chat interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var Dash;
Dash = Dash || {};

/**
| Imports
*/
var Caret;
var config;
var Curve;
var Euclid;
var Jools;
var Path;
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
var Chat = Dash.Chat = function(twig, panel, inherit, name) {
	this.name    = name;
	this.twig    = twig;
	this.panel   = panel;
	var pnw      = this.pnw    = Curve.computePoint(twig.frame.pnw, panel.iframe);
	var pse      = this.pse    = Curve.computePoint(twig.frame.pse, panel.iframe);
	var iframe   = this.iframe = new Euclid.Rect(Euclid.Point.zero, pse.sub(pnw));

	var fs = this.twig.fontStyle;

	this.messages   = inherit ? inherit.messages : [ ];

	this.lineHeight = Math.round(fs.size * 1.2);
	this.sideSlopeX = 20;
	var descend     = Math.round(fs.size * theme.bottombox);
	this.pitch      = new Euclid.Point(this.sideSlopeX - 7, iframe.height - descend);
	this.coff       = 37;
	this.itext      = '';
};

/**
| Chat components can focus.
*/
Chat.prototype.canFocus = function() {
	return true;
};

/**
| Returns the caret position relative to the panel.
*/
Chat.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var fs      = this.twig.fontStyle.size;
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1);
	//var p = { x: 2, y : 2};

	var pnw = this.pnw;
	var s = Math.round(p.y + pnw.y + descend);
	var n = s - Math.round(fs + descend);
	var	x = p.x + this.pnw.x - 1;

	return Jools.immute({ s: s, n: n, x: x });
};

/**
| TODO
*/
Chat.prototype._weave = function() {
	var fabric = this.$fabric;
	if (fabric && !config.debug.noCache) { return fabric; }

	fabric = this.$fabric = new Euclid.Fabric(this.iframe);
	var w = this.iframe.width;
	var h = this.iframe.height;

	fabric.paint(Dash.Board.styles.chat, this, 'pathILine', Euclid.View.proper);

	var x = this.pitch.x;
	var y = this.pitch.y;

	fabric.setFont(this.twig.fontStyle);
	var lh = this.lineHeight;
	fabric.fillText('»', x + 27, y);
	fabric.fillText('chat', x, y);
	fabric.fillText(this.itext, x + 37, y);
	y -= 2;

	for(var a = this.messages.length - 1, aA = Math.max(a - 5, 0); a >= aA; a--) {
		y -= lh;
		fabric.fillText(this.messages[a], x, y);
	}

	if (config.debug.drawBoxes) {
		fabric.paint(
			Dash.Board.styles.boxes,
			new Euclid.Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path',
			Euclid.View.proper
		);
	}

	return this.$fabric = fabric;
};

/**
| Returns the point of a given offset.
|
| offset:   the offset to get the point from.
| TODO rename
*/
Chat.prototype.getOffsetPoint = function(offset) {
	// TODO cache position
	var twig     = this.twig;
	var font     = twig.fontStyle;
	var itext    = this.itext;
	var pitch    = this.pitch;

	return new Euclid.Point(
		Math.round(pitch.x + this.coff + Euclid.Measure.width(font, itext.substring(0, offset))),
		Math.round(pitch.y)
	);
};

/**
| Draws the component on the fabric.
*/
Chat.prototype.draw = function(fabric) {
	fabric.drawImage(this._weave(), this.pnw, 'source-atop');
};


/**
| Draws the caret.
*/
Chat.prototype.drawCaret = function(view) {
	var caret = shell.caret;
	var panel = this.panel;
	var cpos  = caret.$pos = this.getCaretPos();

	var cx  = cpos.x;
	var ch  = Math.round((cpos.s - cpos.n) * view.zoom);
	var cp = view.point(
		panel.pnw.x + cpos.x,
		panel.pnw.y + cpos.n
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
| User input.
*/
Chat.prototype.input = function(text) {
	var caret = shell.caret;
	var csign = caret.sign;
	var itext = this.itext;
	var at1   = csign.at1;

	this.itext = itext.substring(0, at1) + text + itext.substring(at1);
	shell.setCaret('board', {
		path : csign.path,
		at1  : at1 + text.length
	});
	this.poke();
};


/**
| User pressed backspace.
*/
Chat.prototype.keyBackspace = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 <= 0) return false;
	this.itext = this.itext.substring(0, at1 - 1) + this.itext.substring(at1);
	shell.setCaret('board', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	this.poke();
	return true;
};

/**
| User pressed del.
*/
Chat.prototype.keyDel = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.itext.length) return false;
	this.itext = this.itext.substring(0, at1) + this.itext.substring(at1 + 1);
	return true;
};

/**
| User pressed up key.
*/
Chat.prototype.keyDown = function() {
	return true;
};

/**
| User pressed end key.
*/
Chat.prototype.keyEnd = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.itext.length) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : this.itext.length
	});
	return true;
};

/**
| User pressed return key.
*/
Chat.prototype.keyEnter = function() {
	if (this.itext === '') { return false; }

	var caret = shell.caret;
	var csign = caret.sign;
	shell.peer.sendMessage(this.itext);
//	this.addMessage(this.itext);
	this.itext = '';
	shell.setCaret('board', {
		path : csign.path,
		at1  : 0
	});

	return true;
};

/**
| User pressed left key.
*/
Chat.prototype.keyLeft = function() {
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
Chat.prototype.keyPos1 = function() {
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
Chat.prototype.keyRight = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 >= this.itext.length) return false;
	shell.setCaret('board', {
		path : csign.path,
		at1  : csign.at1 + 1
	});
	return true;
};

/**
| User pressed up key.
*/
Chat.prototype.keyUp = function() {
	return true;
};

/**
| Adds a message.
*/
Chat.prototype.addMessage = function(msg) {
	this.messages.push(msg);
	if (this.messages.length > 10) { this.messages.unshift(); }
	this.poke();
};

/**
| Mouse down.
*/
Chat.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.pnw);
	var fabric = this._weave();
	if (!fabric.within(this, 'pathILine', Euclid.View.proper, pp))
		{ return null; }

	shell.setCaret('board', {
		path : new Path([this.panel.name, this.name]),
		at1  : this.itext.length
	});

	return false;
};

/**
| Mouse hover
*/
Chat.prototype.mousehover = function(p, shift, ctrl) {
	if (p === null)
		{ return null; }

	var pnw = this.pnw;
	var pse = this.pse;

	if (p.x < pnw.x || p.y < pnw.y || p.x > pse.x || p.y > pse.y)
		{ return null; }

	var fabric = this._weave();
	var pp = p.sub(this.pnw);
	if (fabric.within(this, 'pathILine', Euclid.View.proper, pp))
		{ return "text"; }
	else
		{ return "default"; }
};

/**
| Draws the input line
*/
Chat.prototype.pathILine = function(fabric, border, twist) {
	var ox   = 0;
	var fs   = this.twig.fontStyle;
	var w    = fabric.width - 1;
	var psex = w  - this.sideSlopeX;
	var psey = fabric.height;
	var pnwx = this.sideSlopeX + ox;
	var pnwy = psey - this.lineHeight - 2;

	fabric.moveTo(                    ox, psey);
	fabric.beziTo(  7, -7, -15,  0, pnwx, pnwy);
	fabric.lineTo(                  psex, pnwy);
	fabric.beziTo( 15,  0,  -7, -7,    w, psey);
	fabric.lineTo(                  pnwx, psey);
};

/**
| Pokes the component
*/
Chat.prototype.poke = function() {
	this.$fabric = null;
	this.panel.poke();
};

/**
| Force clears all caches.
*/
Chat.prototype.knock = function() {
	this.$fabric = null;
};

/**
| User pressed a special key
*/
Chat.prototype.specialKey = function(key) {
	switch(key) {
	case 'backspace' : this.keyBackspace(); break;
	case 'del'       : this.keyDel();       break;
	case 'down'      : this.keyDown();      break;
	case 'end'       : this.keyEnd();       break;
	case 'enter'     : this.keyEnter();     break;
	case 'left'      : this.keyLeft();      break;
	case 'pos1'      : this.keyPos1();      break;
	case 'right'     : this.keyRight();     break;
	case 'up'        : this.keyUp();        break;
	}
};

})();
