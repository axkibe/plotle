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

                        ,-,-,-.             ,-,---.               .
                        `,| | |   ,-. . ,-.  '|___/ ,-. ,-. ,-. ,-|
                          | ; | . ,-| | | |  ,|   \ | | ,-| |   | |
                          '   `-' `-^ ' ' ' `-^---' `-' `-^ '   `-^
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 the cockpits mainboard

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CBoard;
var config;
var Fabric;
var Jools;
var SwitchPanel;
var theme;

/**
| Exports
*/
var MainBoard = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug    = Jools.debug;
var half     = Fabric.half;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var subclass = Jools.subclass;
var Point    = Fabric.Point;

/**
| Constructor
*/
MainBoard = function(name, inherit, cockpit, screen) {
	CBoard.call(this, name, inherit, cockpit, screen);
	// the switch panel
	var swidim       = theme.switchpanel.dimensions;
	this.switchpanel = new SwitchPanel(new Point(
		half(screen.x) - swidim.a,
		screen.y- 59
	));
};
subclass(MainBoard, CBoard);

/*
| Toggles the switch board
*/
MainBoard.prototype.toggleSwitch = function() {
	this.switchActive = !this.switchActive;
	var swb = this.cc.switchB;
	swb.$active = this.switchActive;
	swb.poke();
};

/**
| Draws the mainboard
*/
MainBoard.prototype.draw = function(fabric) {
	if (this.switchActive) {
		this.switchpanel.draw(fabric);
	}
	fabric.drawImage(this.getFabric(), this.pnw);
};

/**
| Returns true if point is on this board
*/
MainBoard.prototype.mousehover = function(p, shift, ctrl) {
	if (this.switchActive) {
		var pp = p.sub(this.pnw);
		var swb = this.cc.switchB;
		var over = swb.mousehover(pp);
		if (!over) {
			over = this.switchpanel.mousehover(p);
			if (!over) {
				this.toggleSwitch();
			}
		}
	}
	
	return CBoard.prototype.mousehover.call(this, p, shift, ctrl);
};

})();
