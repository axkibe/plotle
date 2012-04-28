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
| TODO check needs
*/
var CAccent;
var CCustom;
var CLabel;
var CInput;
var Cockpit;
var Curve;
var Design;
var Deverse;
var Fabric;
var Jools;
var Path;
var Tree;
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
var computePoint = Curve.computePoint;
var half         = Fabric.half;
var magic        = Fabric.magic;
var round        = Math.round;
var Point        = Fabric.Point;
var Rect         = Fabric.Rect;

/**
| Constructor
*/
SwitchPanel = function() {
	var swidim = theme.switchpanel.dimensions;
	var iframe = this.iframe = new Rect(Point.zero, new Point(swidim.a * 2, swidim.b));
	this.gradientPC = new Point(half(iframe.width), half(iframe.height) + 600);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
	this.buttonDim = immute({
		width  : 80, 
		height : 45,
		xoff   : 60,
		yoff   : 54
	});
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
SwitchPanel.prototype.pathButton = function(fabric, border, twist) {
	var bh = this.buttonDim.height;
	var bw = this.buttonDim.width;
	var bx = this.buttonDim.xoff;
	var by = this.buttonDim.yoff;

	var w = this.iframe.width  - 1;
	var h = this.iframe.height - 1;
	var bo = border;

	var bw05 = half(bw);
	var bh05 = half(bh);
	var mx   = round(bw / 2 * magic); // TODO round needed?
	var my   = round(bh / 2 * magic);

	fabric.beginPath(twist);

	var cx   = half(w);
	var cy   = half(bh);
	fabric.moveTo(                     bo - bw05 + cx,              cy);
	fabric.beziTo(  0, -my, -mx,   0,              cx,  bo - bh05 + cy);
	fabric.beziTo( mx,  0,    0, -my, -bo + bw05 + cx,              cy);
	fabric.beziTo(  0,  my,  mx,   0,              cx, -bo + bh05 + cy);
	fabric.beziTo(-mx,  0,    0,  my,  bo - bw05 + cx,              cy);
	
	var cx   = round(w / 2 + bx);
	var cy   = round(by);
	fabric.moveTo(                     bo - bw05 + cx,              cy);
	fabric.beziTo(  0, -my, -mx,   0,              cx,  bo - bh05 + cy);
	fabric.beziTo( mx,  0,    0, -my, -bo + bw05 + cx,              cy);
	fabric.beziTo(  0,  my,  mx,   0,              cx, -bo + bh05 + cy);
	fabric.beziTo(-mx,  0,    0,  my,  bo - bw05 + cx,              cy);
	
	var cx   = round(w / 2 - bx);
	var cy   = round(by);
	fabric.moveTo(                     bo - bw05 + cx,              cy);
	fabric.beziTo(  0, -my, -mx,   0,              cx,  bo - bh05 + cy);
	fabric.beziTo( mx,  0,    0, -my, -bo + bw05 + cx,              cy);
	fabric.beziTo(  0,  my,  mx,   0,              cx, -bo + bh05 + cy);
	fabric.beziTo(-mx,  0,    0,  my,  bo - bw05 + cx,              cy);
};

/**
| Draws the contents.
| @@ Caching
*/
SwitchPanel.prototype.getFabric = function() {
	var iframe = this.iframe;
	var fabric = new Fabric(iframe);

	fabric.fill(theme.switchpanel.style.fill, this, 'pathFrame');

	//fabric.paint(theme.switchpanel.hover, this, 'pathButton');
	fabric.fontStyle('14px ' + theme.defaultFont, 'black', 'center', 'middle');
	var bd = this.buttonDim;
	var cx = half(iframe.width);
	var cy = half(bd.height);
	fabric.fillText('Welcome',   cx,           cy);
	fabric.fillText('Sandbox',   cx + bd.xoff, bd.yoff);
	fabric.fillText('Your Home', cx - bd.xoff, bd.yoff);
	fabric.fillText('Your Home', cx - bd.xoff, bd.yoff);
	
	fabric.fontStyle('12px ' + theme.defaultFont, 'black', 'center', 'middle');
	fabric.fillText('A space view&editable by everyone', cx, iframe.height - 12);
	
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
	// this.$fabric = null;  @@
	shell.redraw = true;
};

})();
