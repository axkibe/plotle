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

                            ,,--.          . ,-,-,-.
                            |`, | .  , ,-. | `,| | |   ,-. ,-. . .
                            |   | | /  ,-| |   | ; | . |-' | | | |
                            `---' `'   `-^ `'  '   `-' `-' ' ' `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An oval styled menu.

      a1      |----->|
      a2      |->|   '
              '  '   '           b2
          ..-----.. .' . . . . . A
        ,' \  n  / ','       b1  |
       , nw .---. ne , . . . A   |
       |---(  c  )---| . . . v . v
       ` sw `---' se '
        `. /  s  \ .'
          ``-----''            outside = null

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var OvalFlower;
var shell;
var system;
var theme;

/**
| Exports
*/
var OvalMenu;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code requires a browser!'); }

/**
| Shortcuts
*/
var debug      = Jools.debug;
var immute     = Jools.immute;
var is         = Jools.is;
var isnon      = Jools.isnon;
var log        = Jools.log;
var half       = Jools.half;
var ro         = Math.round;

/**
| Constructor.
*/
OvalMenu = function(fabric, pc, settings, labels, callback) {
	this.fabric      = fabric;
	this.p           = pc;
	this.labels      = labels;

	this._callback   = callback;
	this._style      = settings.style;
	this._highlight  = settings.highlight;
	this._dimensions = settings.dimensions;
	this._oflower    = new OvalFlower(pc, settings.dimensions, labels);
	this.$within     = null;
	this.$fadeTimer  = null;
	this.$fade       = false;
};

/**
| Draws the hexmenu.
*/
OvalMenu.prototype.draw = function(view) {
	var f = this.fabric;
	if (this.$fade) { f.globalAlpha(this.$fade); }

	f.fill(this._style.fill, this._oflower, 'path', view, 'outer');
	switch(this.$within) {
		case 'n'  :
		case 'ne' :
		case 'se' :
		case 's'  :
		case 'sw' :
		case 'nw' :
			f.paint(this._highlight, this._oflower, 'path', view, this.$within);
			break;
	}
	f.edge(this._style.edge, this._oflower, 'path', view, null);


	f.setFont(12, theme.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var b1  = this._dimensions.b1;
	var b2  = this._dimensions.b2;
	var bs  = half(b2 - b1);
	var b2t = b1 + bs;
	var m   = 0.551784;
	var a2h = ro(this._dimensions.a2 * m);
	var pc  = this.p;

	if (labels.n)  f.fillText(labels.n,  pc.x,       pc.y - b2t);
	if (labels.ne) f.fillText(labels.ne, pc.x + a2h, pc.y - bs );
	if (labels.se) f.fillText(labels.se, pc.x + a2h, pc.y + bs );
	if (labels.s)  f.fillText(labels.s,  pc.x,       pc.y + b2t);
	if (labels.sw) f.fillText(labels.sw, pc.x - a2h, pc.y + bs );
	if (labels.nw) f.fillText(labels.nw, pc.x - a2h, pc.y - bs );
	if (labels.c)  f.fillText(labels.c,  pc);
	
	if (this.$fade) { f.globalAlpha(1); }
};

/**
| Sets this.mousepos and returns it according to p.
*/
OvalMenu.prototype.within = function(view, p) {
	var w = this._oflower.within(this.fabric, view, p);
	if (w === this.$within) return w;
	shell.redraw = true;
	return this.$within = w;
};

/**
| Mouse button down event.
*/
OvalMenu.prototype.mousedown = function(view, p, shift, ctrl) {
	var w = this.within(view, p);
	if (!w) return null;
	
	this._callback(w, this.p);
	shell.setMenu(null);
	return false;
};

/**
| Called on every step to fade away when mouse isn't on the menu
*/
OvalMenu.prototype.fadeout = function() {
	var self = this;

	if (shell.menu !== self) {
		// cancels all fading
		return;
	}
	self.$fade -= theme.fade.step;

	if (self.$fade <= 0) {
		shell.setMenu(null);
	} else {
		this.$fadeTimer = system.setTimer(theme.fade.time, function() { self.fadeout(); });
	}
	
	shell.redraw = true;
	shell.poke();
};

/**
| Mouse hover.
|
| Returns true if the mouse pointer hovers over anything.
*/
OvalMenu.prototype.mousehover = function(view, p, shift, ctrl) {
	var self = this;

	if (!this.within(view, p)) {
		if (!this.$fade) {
			this.$fade = 1 - theme.fade.step;
			this.$fadeTimer = system.setTimer(theme.fade.time, function() { self.fadeout(); });
		}
		return null;
	} else {
		// cancels fading
		if (this.$fade) {
			this.$fade = false;
			system.cancelTimer(this.$fadeTimer);
			this.$fadeTimer = null;
			shell.redraw = true;
		}
	}

	// mouse floated on float menu
	return 'default';
};


})();
