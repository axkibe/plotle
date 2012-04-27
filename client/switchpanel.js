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

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var computePoint  = Curve.computePoint;
var half          = Fabric.half;
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;

/**
| Constructor
*/
SwitchPanel = function() {
	var iframe = this.iframe = new Rect(Point.zero, new Point(180, 100));
	this.gradientPC = new Point(half(iframe.width), half(iframe.height) + 600);
	this.gradientR0 = 0;
	this.gradientR1 = 650;
};

/**
| Paths the boards frame
*/
SwitchPanel.prototype.pathFrame = function(fabric, border, twist) {
	var w = this.iframe.width  - 1;
	var h = this.iframe.height - 1;
	fabric.beginPath(twist);
	fabric.moveTo(0, 0);
	fabric.lineTo(w, 0);
	fabric.lineTo(w, h);
	fabric.lineTo(0, h);
	fabric.lineTo(0, 0);
};

/**
| Draws the contents.
| @@ Caching
*/
SwitchPanel.prototype.getFabric = function() {
	var iframe = this.iframe;
	var fabric = new Fabric(iframe);

	fabric.fill(theme.switchpanel.style.fill, this, 'pathFrame');
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
