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


/**
| +++Mainboard+++
*/
var Mainboard = function(fw, fh) {
	this.fw            = fw;
	this.fh            = fh;
	var fmx = this.fmx = half(fw);

	this.pnw = new Point(fmx - 650, fh - 70);
	this.pse = new Point(fmx + 650, fh);

	this.mTopCurve = 300;
	this.sideCurve =  70;
};

/**
| Paths the mainboards frame
*/
Mainboard.prototype.path = function(fabric, border, twist) {
	var pnw = this.pnw;
	var pse = this.pse;
	var fmx = this.fmx;
	var tc  = this.mTopCurve;
	var sc  = this.sideCurve;
	var b   = border;

	fabric.beginPath(twist);
	fabric.moveTo(pnw.x + b, pse.y - b);
	fabric.beziTo(0,  -sc, -tc,   0,   fmx    , pnw.y + b);
	fabric.beziTo(tc,   0,   0, -sc, pse.x - b, pse.y - b);
};


/**
| Draws the mainboards contents
*/
Mainboard.prototype.draw = function(fabric, msg) {
	var fmx = this.fmx;
	var pnw = this.pnw;
	var pse = this.pse;

	fabric.fontStyle('12px ' + theme.defaultFont, 'rgb(0, 0, 0)', 'start', 'alphabetic');
	fabric.fillText(msg, fmx - 550, pse.y - 16);
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
	this.fabric     = system.fabric;
	this.$mainboard = null;
};

Cockpit.prototype.mainboard = function(fabric) {
	if (this.$mainboard &&
		this.$mainboard.fw === fabric.width &&
		this.$mainboard.fh === fabric.height)
	{ return this.$mainboard}

	return this.$mainboard = new Mainboard(fabric.width, fabric.height);
}

/**
| Redraws the cockpit.
*/
Cockpit.prototype.draw = function() {
	var fabric    = this.fabric;
	var mainboard = this.mainboard(fabric);

	fabric.paint(theme.cockpit.style, mainboard, 'path');
	mainboard.draw(fabric, 'Loading space "welcome" ...');
};


/**
| Mouse hover.
*/
Cockpit.prototype.mousehover = function(p) {
	var mainboard = this.mainboard(fabric);
	var fabric    = this.fabric;

	if (fabric.within(mainboard, p)) {
		system.setCursor('default');
		return true;
	}

	return false;
};

/**
| Mouse button down event
*/
Cockpit.prototype.mousedown = function(p) {
	/*
	var md = this.edgemenu.getMousepos(p);
	if (md >= 0) {
		shell.redraw = true;
		switch(md) {
		case 0: this._exportDialog(); break;
		case 1: this._revertDialog(); break;
		case 2: this._importDialog(); break;
		}
		return 'none';
	}
	*/
	return false;
};

})();
