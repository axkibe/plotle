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
           ,-,---.     .  .
            '|___/ . . |- |- ,-. ,-.
            ,|   \ | | |  |  | | | |
           `-^---' `-^ `' `' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A button on a panel.

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
var Action;
var config;
var Curve;
var Euclid;
var Fabric;
var Jools;
var Path;
var Rect;
var shell;
var system;
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
var computePoint  = Curve.computePoint;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;

/**
| Constructor.
*/
var Button = Dash.Button = function(twig, panel, inherit, name) {
	if (twig.type !== 'Button') { throw new Error('invalid twig type'); }

	this.name    = name;
	this.twig    = twig;
	this.panel   = panel;

	var pnw      = this.pnw    = computePoint(twig.frame.pnw, panel.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, panel.iframe);
	var iframe   = this.iframe = new Rect(Euclid.Point.zero, pse.sub(pnw));
	this.curve   = new Curve(twig.curve, iframe);

	this.captionPos = computePoint(twig.caption.pos, iframe);
	this.path       = new Path([panel.name, name]);

	// if true repeats the action on mousedown
	this.repeat   = false;
	this.$retimer = null;

	this.$active      = inherit ? inherit.$active : false;
	this.$fabric      = null;
	this.$visible     = inherit ? inherit.$visible : true;
	this.$captionText = inherit ? inherit.$captionText : twig.caption.text;
	this.$accent      = Dash.Accent.NORMAL;
};

/**
| Returns true if this component can focus.
*/
Button.prototype.canFocus = function() {
	return this.$visible;
};

/**
| Paths the button.
*/
Button.prototype.gpath = function(fabric, border, twist) {
	this.curve.path(fabric, border, twist);
};

/**
| Returns the fabric for the button.
*/
Button.prototype._weave = function(accent) {
	var fabric = this.$fabric;
	if (fabric && this.$accent === accent && !config.debug.noCache) { return fabric; }

	fabric = this.$fabric = new Fabric(this.iframe);

	var sname;
	switch (accent) {
	case Dash.Accent.NORMA : sname = this.twig.normaStyle; break;
	case Dash.Accent.HOVER : sname = this.twig.hoverStyle; break;
	case Dash.Accent.FOCUS : sname = this.twig.focusStyle; break;
	case Dash.Accent.HOFOC : sname = this.twig.hofocStyle; break;
	default : throw new Error('Invalid accent: ' + accent);
	}

	var style = Dash.Board.styles[sname];
	if (!isnon(style)) { throw new Error('Invalid style: ' + sname); }
	fabric.paint(style, this, 'gpath', View.proper);

	fabric.setFont(this.twig.caption.fontStyle);
	fabric.fillText(this.$captionText, this.captionPos);

	if (config.debug.drawBoxes) {
		fabric.paint(
			Dash.Board.styles.boxes,
			new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path',
			View.proper
		);
	}

	return fabric;
};

/**
| Input
*/
Button.prototype.input = function(text) {
	return true;
};

/**
| Input
*/
Button.prototype.specialKey = function(key, shift, ctrl) {
	return true;
};

/**
| Mouse hover.
*/
Button.prototype.mousehover = function(p) {
	if (!this.$visible)
		{ return null; }

	if (p === null)
		{ return null; }

	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y)
		{ return null; }

	var fabric = this._weave(Dash.Accent.NORMA);
	var pp = p.sub(this.pnw);

	if (!fabric.within(this, 'gpath', View.proper, pp))
		{ return null; }

	this.panel.setHover(this.name);
	return 'default';
};

/**
| Button has been pushed
*/
Button.prototype.push = function(shift, ctrl) {
	// no default
};

/**
| Mouse down.
*/
Button.prototype.mousedown = function(p, shift, ctrl) {
	var self = this;

	if (!this.$visible) { return; }
	if (p.x < this.pnw.x || p.y < this.pnw.y || p.x > this.pse.x || p.y > this.pse.y)
		{ return null; }

	var fabric = this._weave(Dash.Accent.NORMA);
	var pp = p.sub(this.pnw);
	if (!fabric.within(this, 'gpath', View.proper, pp))
		{ return null; }

	if (this.repeat && !this.retimer) {
		shell.startAction(
			Action.REBUTTON,
			'board',
			'itemPath', this.path
		);

		var repeatFunc;
		repeatFunc = function() {
			self.push(false, false);
			self.$retimer = system.setTimer(theme.zoom.repeatTimer, repeatFunc);
			shell.poke();
		};
		this.$retimer = system.setTimer(theme.zoom.firstTimer, repeatFunc);
	}

	this.push(shift, ctrl);

	shell.redraw = true; // TODO needed?
	return this.repeat ? 'drag' : false;
};

/**
| Special keys for buttons having focus
*/
Button.prototype.specialKey = function(key) {
	switch (key) {
	case 'down'  : this.panel.cycleFocus(+1);    return;
	case 'up'    : this.panel.cycleFocus(-1);    return;
	case 'enter' : this.push(false, false); return;
	}
};

/**
| Any normal keys for a buttons having focus triggers a push.
*/
Button.prototype.input = function(text) {
	this.push(false, false);
	return true;
};


/**
| Draws the button.
*/
Button.prototype.draw = function(fabric, accent) {
	if (!this.$visible) { return; }
	fabric.drawImage(this._weave(accent), this.pnw);
};

/**
| Clears all caches
*/
Button.prototype.poke = function() {
	this.$fabric = null;
	this.panel.poke();
};

/**
| Force clears all caches.
*/
Button.prototype.knock = function() {
	this.$fabric = null;
};


/**
| Stops a REBUTTON action.
*/
Button.prototype.actionstop = function() {
	system.cancelTimer(this.$retimer);
	this.$retimer = null;

	shell.stopAction();
};

})();
