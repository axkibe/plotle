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

 The space visualisation and its visualtions of contents.


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
var Fabric;
var Jools;

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
var R   = Math.round;
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var log           = Jools.log;
var half          = Fabric.half;
var OvalFlower    = Fabric.OvalFlower;

/**
| Constructor.
*/
OvalMenu = function(pc, settings, labels) {
	this.p           = pc;
	this.labels      = labels;

	this._style      = settings.style;
	this._highlight  = settings.highlight;
	this._dimensions = settings.dimensions;
	this._oflower    = new OvalFlower(pc, settings.dimensions, labels);
	this._within     = null;
};

/**
| Draws the hexmenu.
*/
OvalMenu.prototype.draw = function() {
	var f = shell.fabric;

	f.fill(this._style.fill, this._oflower, 'path', 'outer');
	switch(this._within) {
		case 'n'  :
		case 'ne' :
		case 'se' :
		case 's'  :
		case 'se' :
		case 'ne' :
			f.paint(this._highlight, this._oflower, 'path', this._within);
			break;
	}
	f.edge(this._style.edge, this._oflower, 'path', null);


	f.fontStyle('12px ' + theme.defaultFont, 'black', 'center', 'middle');
	var labels = this.labels;

	var b1  = this._dimensions.b1;
	var b2  = this._dimensions.b2;
	var bs  = half(b2 - b1);
	var b2t = b1 + bs;
	var m   = 0.551784;
	var a2h = R(this._dimensions.a2 * m);
	var pc  = this.p;

	if (labels.n)  f.fillText(labels.n,  pc.x,       pc.y - b2t);
	if (labels.ne) f.fillText(labels.ne, pc.x + a2h, pc.y - bs );
	if (labels.se) f.fillText(labels.se, pc.x + a2h, pc.y + bs );
	if (labels.s)  f.fillText(labels.s,  pc.x,       pc.y + b2t);
	if (labels.sw) f.fillText(labels.sw, pc.x - a2h, pc.y + bs );
	if (labels.nw) f.fillText(labels.nw, pc.x - a2h, pc.y - bs );
	if (labels.c)  f.fillText(labels.c,  pc);
};

/**
| Sets this.mousepos and returns it according to p.
*/
OvalMenu.prototype.within = function(p) {
	var w = this._oflower.within(system.fabric, p);  // TODO not system!
	if (w === this._within) return w;
	shell.redraw = true;
	return this._within = w;
};

})();
