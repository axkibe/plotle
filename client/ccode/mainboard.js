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
MainBoard = function(name, inherit, cockpit, screensize) {
	CBoard.call(this, name, inherit, cockpit, screensize);
	this.$spaceName;
};
subclass(MainBoard, CBoard);


MainBoard.prototype.getSwitchPanel = function() {
	var sp = this.$switchPanel;
	if (sp) return sp;
	
	var swidim       = theme.switchpanel.dimensions;
	var current = '';
	switch (this.$spaceName) {
	case 'welcome' : current = 'n'; break;
	case 'sandbox' : current = 'ne'; break;
	default : current = 'nw'; break;
	}

	return this.$switchPanel = new SwitchPanel(this, current, this.$userName, new Point(
		half(this.screensize.x) - swidim.a,
		this.screensize.y- 59
	));
};

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
| Sets current space.
*/
MainBoard.prototype.setCurSpace = function(spaceName) {
	this.$spaceName = spaceName;

	var cspace = this.cc.cspace;
	cspace.text = spaceName;
	cspace.poke();

	this.$switchPanel = null;
};

/**
| Sets current user
*/
MainBoard.prototype.setUser = function(userName) {
	debug('MAINBOARD:SETUSER', userName);
	this.$userName = userName;
	this.$switchPanel = null;

	var ulabel = this.cc.username;
	ulabel.text = userName;
	ulabel.poke();
};

/**
| Draws the mainboard
*/
MainBoard.prototype.draw = function(fabric) {
	if (this.switchActive) {
		this.getSwitchPanel().draw(fabric);
	}
	fabric.drawImage(this.getFabric(), this.pnw);
};

/**
| Mouse down.
*/
MainBoard.prototype.mousedown = function(p, shift, ctrl) {
	if (this.switchActive) {
		var res = this.getSwitchPanel().mousedown(p);
		if (res !== null) { return res; }
	}
	
	return CBoard.prototype.mousedown.call(this, p, shift, ctrl);
};

/**
| Returns true if point is on this board
*/
MainBoard.prototype.mousehover = function(p, shift, ctrl) {
	if (this.switchActive) {
		var pp = p.sub(this.pnw);
		var swb = this.cc.switchB;
		var over = swb.mousehover(pp);
		if (over) {
			this.getSwitchPanel().cancelFade();
		} else {
			over = this.getSwitchPanel().mousehover(p);
			if (over) { return over; }
		}
	}
	
	return CBoard.prototype.mousehover.call(this, p, shift, ctrl);
};

})();
