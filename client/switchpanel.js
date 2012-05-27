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

                           .---.         .      .  .-,--.             .
                           \___  . , , . |- ,-. |-. '|__/ ,-. ,-. ,-. |
                               \ |/|/  | |  |   | | ,|    ,-| | | |-' |
                           `---' ' '   ' `' `-' ' ' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 The panel to switch spaces.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Cockpit;
var Fabric;
var Jools;
var config;
var theme;
var system;
var shell;

/**
| Exports
*/
var SwitchPanel = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var cos30        = Fabric.cos30;
var debug        = Jools.debug;
var immute       = Jools.immute;
var is           = Jools.is;
var isnon        = Jools.isnon;
var half         = Fabric.half;
var magic        = Fabric.magic;
var ro           = Math.round;
var Point        = Fabric.Point;
var Rect         = Fabric.Rect;

/**
| Constructor
*/
SwitchPanel = function(board, current, userName, psw) {
	this.board      = board;
	this.current    = current;
	var swidim      = theme.switchpanel.dimensions;
	var iframe      = this.iframe = new Rect(Point.zero, new Point(swidim.a * 2, swidim.b));
	this.pnw        = psw.sub(0, this.iframe.height);
	this.gradientPC = new Point(half(iframe.width), half(iframe.height) + 600);
	this.gradientR0 = 0;
	this.gradientR1 = 650;

	this.buttonDim = immute({
		width  : 80,
		height : 36
	});
	this.userName  = userName;
	this.amVisitor = userName.substring(0,5) === 'visit';

	var x2 = 55;
	var y1 =  5;
	var y2 = 36;
	var mx = half(iframe.width);
	var hh = half(this.buttonDim.height);

	this.buttonPos    = {
		n  : new Point(mx,      hh + y1),
		ne : new Point(mx + x2, hh + y2),
		nw : new Point(mx - x2, hh + y2)
	};
	this.$fabric    = null;
	this.$fadeTimer = null;
	this.$fade      = false;
	this.$hover     = null;
};
		
/**
| Cancels fading
*/
SwitchPanel.prototype.cancelFade = function() {
	if (!this.$fade) { return; }
	this.$fade = false;
	system.cancelTimer(this.$fadeTimer);
	this.$fadeTimer = null;
	shell.redraw = true;
	shell.poke();
};

/**
| Draws the switchpanel.
*/
SwitchPanel.prototype.draw = function(fabric) {
	if (this.$fade) { fabric.globalAlpha(this.$fade); }
	fabric.drawImage(this.getFabric(), this.pnw);
	if (this.$fade) { fabric.globalAlpha(1); }
};

/**
| Called on every step to fade away when mouse isn't on the panel or its switch
*/
SwitchPanel.prototype.fadeout = function() {
	var self = this;

	self.$fade -= theme.fade.step;

	if (self.$fade <= 0) {
		this.board.toggleSwitch();
	} else {
		this.$fadeTimer = system.setTimer(theme.fade.time, function() { self.fadeout(); });
	}
	
	shell.redraw = true;
	shell.poke();
};


/**
| Paths the boards frame
*/
SwitchPanel.prototype.pathFrame = function(fabric, border, twist) {
	var w = this.iframe.width  - 1;
	var h = this.iframe.height - 1;
	var x = half(w);
	var swidim = theme.switchpanel.dimensions;
	var am = magic * swidim.a;
	var bm = magic * swidim.b;
	var bo = border;

	fabric.beginPath(twist);
	fabric.moveTo(                        bo,      h);
	fabric.beziTo(  0, -bm, -am,   0,      x,     bo);
	fabric.beziTo( am,   0,   0, -bm, w - bo,      h);
};

/**
| Paths the  buttons
*/
SwitchPanel.prototype.pathButton = function(fabric, border, twist, dir) {
	var bh = this.buttonDim.height;
	var bw = this.buttonDim.width;

	var w = this.iframe.width  - 1;
	var h = this.iframe.height - 1;
	var bo = border;

	var bw05 = half(bw);
	var bh05 = half(bh);

	var mx   = bw / 2 * magic;
	var my   = bh / 2 * magic;

	fabric.beginPath(twist);

	var p = this.buttonPos[dir];
	fabric.moveTo(                     bo - bw05 + p.x,              p.y);
	fabric.beziTo(  0, -my, -mx,   0,              p.x,  bo - bh05 + p.y);
	fabric.beziTo( mx,  0,    0, -my, -bo + bw05 + p.x,              p.y);
	fabric.beziTo(  0,  my,  mx,   0,              p.x, -bo + bh05 + p.y);
	fabric.beziTo(-mx,  0,    0,  my,  bo - bw05 + p.x,              p.y);
};

/**
| Paints button dir on the fabric
*/
SwitchPanel.prototype._paintButton = function(fabric, dir) {
	var style;
	if (dir === this.$hover) {
		style = dir === this.current ? theme.switchpanel.curhov  : theme.switchpanel.hover;
	} else {
		style = dir === this.current ? theme.switchpanel.current : theme.switchpanel.space;
	}

	fabric.paint(style, this, 'pathButton', dir);
};

/**
| Draws the contents.
| @@ Caching
*/
SwitchPanel.prototype.getFabric = function() {
	if (!config.debug.noCache && this.$fabric) { return this.$fabric; }
	var iframe = this.iframe;
	var fabric = this.$fabric = new Fabric(iframe);

	fabric.fill(theme.switchpanel.style.fill, this, 'pathFrame');
	if (!this.amVisitor) { this._paintButton(fabric, 'nw'); }
	this._paintButton(fabric, 'n');
	this._paintButton(fabric, 'ne');

	fabric.setFontStyle('14px ' + theme.defaultFont, 'black', 'center', 'middle');
	var bd = this.buttonDim;
	var cx = half(iframe.width);
	var cy = half(bd.height);

	var bp = this.buttonPos;
	fabric.fillText('Welcome',   bp.n .x, bp.n. y);
	fabric.fillText('Sandbox',   bp.ne.x, bp.ne.y);
	if (!this.amVisitor) { fabric.fillText('Your Home', bp.nw.x, bp.nw.y); }
	
	fabric.setFontStyle('12px ' + theme.defaultFont, 'black', 'center', 'middle');
	
	var text;
	switch(this.$hover || this.current) {
	case 'n'  : text = 'Welcome, public read-only'; break;
	case 'ne' : text = 'Sandbox, public read- & writeable'; break;
	case 'nw' : text = 'Your Home, private to you'; break;
	default: throw new Error('no valid space text');
	}
	fabric.fillText(text, cx, iframe.height - 12);
	
	fabric.edge(theme.switchpanel.style.edge, this, 'pathFrame');

	if (config.debug.drawBoxes) {
		fabric.paint(Cockpit.styles.boxes,
			new Rect(iframe.pnw, iframe.pse.sub(1, 1)), 'path');
	}

	return fabric;
};

/**
| Clears caches.
*/
SwitchPanel.prototype.poke = function() {
	this.$fabric = null;
	shell.redraw = true;
};

/**
| Returns true if p is within the panel
*/
SwitchPanel.prototype.within = function(p) {
	var pnw = this.iframe.pnw;
	var pse = this.iframe.pse;

	// @@ use iframe.within
	if (p.x < pnw.x || p.y < pnw.y || p.x > pse.x || p.y > pse.y) {
		return false;
	}
	var fabric = this.getFabric();
	return fabric.within(this, 'pathFrame', p);
};

/**
| Mouse down.
*/
SwitchPanel.prototype.mousedown = function(p) {
	p = p.sub(this.pnw);
	if (!this.within(p)) { return null; }

	var button = null;
	var fabric = this.getFabric();
	if (fabric.within(this, 'pathButton', p, 'n' )) { button = 'n';  } else
	if (fabric.within(this, 'pathButton', p, 'ne')) { button = 'ne'; } else
	if (!this.amVisitor && fabric.within(this, 'pathButton', p, 'nw')) { button = 'nw'; }

	if (button && button !== this.current) {
		switch(button) {
		case 'n'  : shell.moveToSpace('welcome'); break;
		case 'ne' : shell.moveToSpace('sandbox'); break;
		case 'nw' : shell.moveToSpace(this.userName+':home'); break;
		}
		this.board.toggleSwitch();
		this.board.poke();
	}

	return false;
};

/**
| Mouse hover.
*/
SwitchPanel.prototype.mousehover = function(p) {
	var self   = this;
	p          = p.sub(this.pnw);
	var hd     = null;
	var cursor = null;

	if (!this.within(p)) {
		if (!this.$fade) {
			this.$fade = 1 - theme.fade.step;
			this.$fadeTimer = system.setTimer(theme.fade.time, function() { self.fadeout(); });
		}
	} else {
		this.cancelFade();
		var fabric = this.getFabric();

		if (fabric.within(this, 'pathButton', p, 'n' )) { hd = 'n';  } else
		if (fabric.within(this, 'pathButton', p, 'ne')) { hd = 'ne'; } else
		if (!this.amVisitor && fabric.within(this, 'pathButton', p, 'nw')) { hd = 'nw'; }
		cursor = 'default';
	}

	if (this.$hover !== hd) {
		this.$hover = hd;
		this.poke();
	}

	return cursor;
};


})();
