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
var CMeth;
var Curve;
var Fabric;
var Jools;

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
var Point         = Fabric.Point;
var Rect          = Fabric.Rect;
var ro            = Math.round;

/**
| Constructor.
*/
CChat = function(twig, board, inherit, name) {
	this.name    = name;
	this.twig    = twig;
	this.board   = board;
	var pnw      = this.pnw    = computePoint(twig.frame.pnw, board.iframe);
	var pse      = this.pse    = computePoint(twig.frame.pse, board.iframe);
	var iframe   = this.iframe = new Rect(Point.zero, pse.sub(pnw));

	this.methods = CMeth[board.name][name] || {};
	var fs = this.twig.fontStyle;

	this.lineHeight = ro(fs.size * 1.2);
	this.sideSlopeX = 20;
};


/**
| Draws the input line
*/
CChat.prototype.pathILine = function(fabric, border, twist) {
	fabric.beginPath(twist);
	var fs   = this.twig.fontStyle;
	var w    = fabric.width - 1;
	var psex = w  - this.sideSlopeX;
	var psey = fabric.height;
	var pnwx = this.sideSlopeX;
	var pnwy = psey - this.lineHeight - 2; 

	fabric.moveTo(                    0, psey);
	fabric.beziTo(  7,-7, -15,  0, pnwx, pnwy);
	fabric.lineTo(                 psex, pnwy);
	fabric.beziTo( 15, 0,  -7, -7,    w, psey);
	fabric.lineTo(                 pnwx, psey);
}

CChat.prototype.getFabric = function() {
	var fabric = this.$fabric;
	//if (fabric && !config.debug.noCache) { return fabric; } TODO

	fabric = this.$fabric = new Fabric(this.iframe);
	var w = this.iframe.width;
	var h = this.iframe.height;

	fabric.paint(Cockpit.styles.chat, this, 'pathILine');
	
	var x = this.sideSlopeX;
	var fs = this.twig.fontStyle;
	var descend = ro(fs.size * theme.bottombox);
	fabric.fontStyle(fs.style, fs.fill, fs.align, fs.base);
	var y = h - descend;
	var lh = this.lineHeight;
	fabric.fillText('»', x - 10, y);
	fabric.fillText('', x, y);
	y -= lh + 2;
	fabric.fillText('visitor-9999: Hallo!', x, y);
	y -= lh;
	fabric.fillText('visitor-1001 entered "welcome"', x, y);
	y -= lh;
	fabric.fillText('Loading "welcomwelcomwelcomwelcomeeeewelcome"', x, y);

	if (true || config.debug.drawBoxes) {
		fabric.paint(
			Cockpit.styles.boxes,
			new Rect(this.iframe.pnw, this.iframe.pse.sub(1, 1)),
			'path'
		);
	}

	return fabric;
};

/**
| Chat components can focus.
*/
CChat.prototype.canFocus = function() {
	return true;
};

/**
| Draws the component on the fabric.
*/
CChat.prototype.draw = function(fabric) {
	fabric.drawImage(this.getFabric(), this.pnw);
};

/**
| Pokes the component
*/
CChat.prototype.poke = function() {
	this.board.poke();
};

/**
| Mouse hover
*/
CChat.prototype.mousehover = function(board, p) {
	return false;
};

/**
| Mouse down.
*/
CChat.prototype.mousedown = function(board, p) {
	return null;
};

})();
