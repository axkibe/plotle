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
var ro           = Math.round;
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
		height : 36
	});

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
	var mx   = ro(bw / 2 * magic); // TODO round needed?
	var my   = ro(bh / 2 * magic);

	fabric.beginPath(twist);

	var p = this.buttonPos[dir];
	fabric.moveTo(                     bo - bw05 + p.x,              p.y);
	fabric.beziTo(  0, -my, -mx,   0,              p.x,  bo - bh05 + p.y);
	fabric.beziTo( mx,  0,    0, -my, -bo + bw05 + p.x,              p.y);
	fabric.beziTo(  0,  my,  mx,   0,              p.x, -bo + bh05 + p.y);
	fabric.beziTo(-mx,  0,    0,  my,  bo - bw05 + p.x,              p.y);
};

/**
| Draws the contents.
| @@ Caching
*/
SwitchPanel.prototype.getFabric = function() {
	var iframe = this.iframe;
	var fabric = new Fabric(iframe);

	fabric.fill(theme.switchpanel.style.fill, this, 'pathFrame');

	fabric.paint(theme.switchpanel.space, this, 'pathButton', 'nw');
	fabric.paint(theme.switchpanel.space, this, 'pathButton', 'n' );
	fabric.paint(theme.switchpanel.space, this, 'pathButton', 'ne');

	fabric.fontStyle('14px ' + theme.defaultFont, 'black', 'center', 'middle');
	var bd = this.buttonDim;
	var cx = half(iframe.width);
	var cy = half(bd.height);

	var bp = this.buttonPos;
	fabric.fillText('Welcome',   bp.n .x, bp.n. y);
	fabric.fillText('Sandbox',   bp.ne.x, bp.ne.y);
	fabric.fillText('Your Home', bp.nw.x, bp.nw.y);
	
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
