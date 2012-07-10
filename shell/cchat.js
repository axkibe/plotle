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

                                       ,--.  ,--. .       .
                                      | `-' | `-' |-. ,-. |-
                                      |   . |   . | | ,-| |
                                      `--'  `--'  ' ' `-^ `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A chat interface.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Caret;
var Cockpit;
var config;
var Curve;
var Fabric;
var Jools;
var Measure;
var Path;
var Point;
var Rect;
var shell;
var theme;
var View;

/**
| Exports
*/
var CChat = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var computePoint  = Curve.computePoint;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var max           = Math.max;
var ro            = Math.round;

/**
| Constructor.
*/
CChat = function(twig, panel, inherit, name) {
	this.name    = name;
	this.twig    = twig;
	this.panel   = panel;
	var pnw      = this.pnw    = computePoint(twig.frame.pnw, panel.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, panel.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));

	var fs = this.twig.fontStyle;

	this.messages   = inherit ? inherit.messages : [ ];

	this.lineHeight = ro(fs.size * 1.2);
	this.sideSlopeX = 20;
	var descend     = ro(fs.size * theme.bottombox);
	this.pitch      = new Point(this.sideSlopeX - 7, iframe.height - descend);
	this.coff       = 37;
	this.itext      = '';
};

/**
| Chat components can focus.
*/
CChat.prototype.canFocus = function() {
	return true;
};

/**
| Returns the caret position relative to the panel.
*/
CChat.prototype.getCaretPos = function() {
	var caret   = shell.caret;
	var fs      = this.twig.fontStyle.size;
	var descend = fs * theme.bottombox;
	var p       = this.getOffsetPoint(shell.caret.sign.at1);
	//var p = { x: 2, y : 2};

	var pnw = this.pnw;
	var s = ro(p.y + pnw.y + descend);
	var n = s - ro(fs + descend);
	var	x = p.x + this.pnw.x - 1;

	return immute({ s: s, n: n, x: x });
};

CChat.prototype._weave = function() {
	var fabric = this.$fabric;
	if (fabric && !config.debug.noCache) { return fabric; }

	fabric = this.$fabric = new Fabric(this.iframe);
	var w = this.iframe.width;
	var h = this.iframe.height;

	fabric.paint(Cockpit.styles.chat, this, 'pathILine', View.proper);

	var x = this.pitch.x;
	var y = this.pitch.y;

	fabric.setFont(this.twig.fontStyle);
	var lh = this.lineHeight;
	fabric.fillText('»', x + 27, y);
	fabric.fillText('chat', x, y);
	fabric.fillText(this.itext, x + 37, y);
	y -= 2;

	for(var a = this.messages.length - 1, aA = max(a - 5, 0); a >= aA; a--) {
		y -= lh;
		fabric.fillText(this.messages[a], x, y);
	}

	if (config.debug.drawBoxes) {
		fabric.paint(
			Cockpit.styles.boxes,
			new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path',
			View.proper
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
CChat.prototype.getOffsetPoint = function(offset) {
	// TODO cache position
	var twig     = this.twig;
	var font     = twig.fontStyle;
	Measure.setFont(font.size, font.font);
	var itext    = this.itext;
	var pitch    = this.pitch;

	return new Point(
		ro(pitch.x + this.coff + Measure.width(itext.substring(0, offset))),
		ro(pitch.y)
	);
};

/**
| Draws the component on the fabric.
*/
CChat.prototype.draw = function(fabric) {
	fabric.drawImage(this._weave(), this.pnw, 'source-atop');
};


/**
| Draws the caret.
*/
CChat.prototype.drawCaret = function(view) {
	if (!(view instanceof View)) { throw new Error('view no View'); }

	var caret = shell.caret;
	var panel = this.panel;
	var cpos  = caret.$pos = this.getCaretPos();

	var cx  = cpos.x;
	var ch  = ro((cpos.s - cpos.n) * view.zoom);
	var cp = view.point(
		panel.pnw.x + cpos.x,
		panel.pnw.y + cpos.n
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
CChat.prototype.input = function(text) {
	var caret = shell.caret;
	var csign = caret.sign;
	var itext = this.itext;
	var at1   = csign.at1;

	this.itext = itext.substring(0, at1) + text + itext.substring(at1);
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : at1 + text.length
	});
	this.poke();
};


/**
| User pressed backspace.
*/
CChat.prototype.keyBackspace = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 <= 0) return false;
	this.itext = this.itext.substring(0, at1 - 1) + this.itext.substring(at1);
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : csign.at1 - 1
	});
	this.poke();
	return true;
};

/**
| User pressed del.
*/
CChat.prototype.keyDel = function() {
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
CChat.prototype.keyDown = function() {
	return true;
};

/**
| User pressed end key.
*/
CChat.prototype.keyEnd = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	var at1   = csign.at1;
	if (at1 >= this.itext.length) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : this.itext.length
	});
	return true;
};

/**
| User pressed return key.
*/
CChat.prototype.keyEnter = function() {
	if (this.itext === '') { return false; }

	var caret = shell.caret;
	var csign = caret.sign;
	shell.peer.sendMessage(this.itext);
//	this.addMessage(this.itext);
	this.itext = '';
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : 0
	});

	return true;
};

/**
| User pressed left key.
*/
CChat.prototype.keyLeft = function() {
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
CChat.prototype.keyPos1 = function() {
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
CChat.prototype.keyRight = function() {
	var caret = shell.caret;
	var csign = caret.sign;
	if (csign.at1 >= this.itext.length) return false;
	shell.setCaret('cockpit', {
		path : csign.path,
		at1  : csign.at1 + 1
	});
	return true;
};

/**
| User pressed up key.
*/
CChat.prototype.keyUp = function() {
	return true;
};

/**
| Adds a message.
*/
CChat.prototype.addMessage = function(msg) {
	this.messages.push(msg);
	if (this.messages.length > 10) { this.messages.unshift(); }
	this.poke();
};

/**
| Mouse down.
*/
CChat.prototype.mousedown = function(p, shift, ctrl) {
	var pp = p.sub(this.pnw);
	var fabric = this._weave();
	if (!fabric.within(this, 'pathILine', View.proper, pp))
		{ return null; }

	shell.setCaret('cockpit', {
		path : new Path([this.panel.name, this.name]),
		at1  : this.itext.length
	});

	return false;
};

/**
| Mouse hover
*/
CChat.prototype.mousehover = function(p, shift, ctrl) {
	if (p === null)
		{ return null; }

	var pnw = this.pnw;
	var pse = this.pse;

	if (p.x < pnw.x || p.y < pnw.y || p.x > pse.x || p.y > pse.y)
		{ return null; }

	var fabric = this._weave();
	var pp = p.sub(this.pnw);
	if (fabric.within(this, 'pathILine', View.proper, pp))
		{ return "text"; }
	else
		{ return "default"; }
};

/**
| Draws the input line
*/
CChat.prototype.pathILine = function(fabric, border, twist) {
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
CChat.prototype.poke = function() {
	this.$fabric = null;
	this.panel.poke();
};

/**
| Force clears all caches.
*/
CChat.prototype.knock = function() {
	this.$fabric = null;
};

/**
| User pressed a special key
*/
CChat.prototype.specialKey = function(key) {
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
