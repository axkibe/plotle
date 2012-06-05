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

                             ,-,---.          .-,--.         .
                              '|___/ ,-. ,_, . `|__/ ,-. ,-. |-
                              ,|   \ |-'  /  | )| \  |-' |   |
                             `-^---' `-' '"' ' `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
 
 A rectangle with rounded (beziers) corners
 BeziRects are immutable objects.

      <-> a
      | |
 pnw  +.------------------.  - - A
      .                    . _ _ V b
      |                    |
      |                    |
      |                    |
      '                    '
       `------------------'+ pse

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Fabric;
var Jools;
var Point;
var Rect;

/**
| Exports
*/
var BeziRect = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

var debug        = Jools.debug;
var immute       = Jools.immute;
var innumerable  = Jools.innumerable;
var log          = Jools.log;
var magic        = Fabric.magic;
var subclass     = Jools.subclass;

/**
| Constructor.
|
| BeziRect(rect, a, b)      -or-
| BeziRect(pnw, pse, a, b)
*/
BeziRect = function(a1, a2, a3, a4) {
	if (a1.constructor === Point) {
		Rect.call(this, a1, a2);
		this.a = a3;
		this.b = a4;
	} else {
		Rect.call(this, a1.pnw, a1.pse);
		this.a = a2;
		this.b = a3;
	}
};
subclass(BeziRect, Rect);

/**
| Draws the roundrect.
|
| fabric : fabric to draw the path upon.
| border : additional distance.
| twist  : parameter to beginPath, add +0.5 on everything for lines
*/
BeziRect.prototype.path = function(fabric, border, twist, view) {
	var wx = view.x(this.pnw) + border;
	var ny = view.y(this.pnw) + border;
	var ex = view.x(this.pse) - border - 1;
	var sy = view.y(this.pse) - border - 1;
	var a = this.a;
	var b = this.b;
	var ma = magic * (a + border);
	var mb = magic * (b + border);

	fabric.beginPath(twist);
	fabric.moveTo(                     wx + a, ny    );
	fabric.lineTo(                     ex - a, ny    );
	fabric.beziTo(  ma,   0,   0, -mb, ex    , ny + b);
	fabric.lineTo(                     ex    , sy - b);
	fabric.beziTo(   0,  mb,  ma,   0, ex - a, sy    );
	fabric.lineTo(                     wx + a, sy    );
	fabric.beziTo( -ma,   0,   0,  mb, wx    , sy - b);
	fabric.lineTo(                     wx    , ny + b);
	fabric.beziTo(   0, -mb, -ma,   0, wx + a, ny    );
};

/**
| Returns true if Point p is within the BeziRect.
*/
BeziRect.prototype.within = function(fabric, view, p) {
	return fabric.within(this, 'path', view, p);
};

})();
