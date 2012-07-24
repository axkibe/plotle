/**                            _..._
    _....._                 .-'_..._''. .---.    _______
  .'       '.             .' .'      '.\|   |.--.\  ___ `'.
 /   .-'"'.  \           / .'           |   ||__| ' |--.\  \
/   /______\  |         . '             |   |.--. | |    \  '
|   __________|         | |             |   ||  | | |     |  '
\  (          '  _    _ | |             |   ||  | | |     |  |
 \  '-.___..-~. | '  / |. '             |   ||  | | |     ' .'
  `         .'..' | .' | \ '.          .|   ||  | | |___.' /'
   `'-.....-.'./  | /  |  '. `._____.-'/|   ||__|/_______.'/
              |   `'.  |    `-.______ / '---'    \_______|/
              '   .'|  '/            `
               `-'  `--'
              ,-,---.          .-,--.         .
               '|___/ ,-. ,_, . `|__/ ,-. ,-. |-
               ,|   \ |-'  /  | )| \  |-' |   |
              `-^---' `-' '"' ' `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle with rounded (beziers) corners.

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
| Export
*/
var Euclid;
Euclid = Euclid || {};

/**
| Imports
*/
var Jools;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser'); }

/**
| Constructor.
|
| BeziRect(rect, a, b)      -or-
| BeziRect(pnw, pse, a, b)
*/
var BeziRect = Euclid.BeziRect = function(a1, a2, a3, a4) {
	if (a1.constructor === Euclid.Point) {
		Euclid.Rect.call(this, a1, a2);
		this.a = a3;
		this.b = a4;
	} else {
		Euclid.Rect.call(this, a1.pnw, a1.pse);
		this.a = a2;
		this.b = a3;
	}
};
Jools.subclass(BeziRect, Euclid.Rect);

/**
| Draws the roundrect.
*/
BeziRect.prototype.sketch = function(fabric, border, twist, view) {
	var wx = view.x(this.pnw) + border;
	var ny = view.y(this.pnw) + border;
	var ex = view.x(this.pse) - border - 1;
	var sy = view.y(this.pse) - border - 1;
	var a = this.a;
	var b = this.b;
	var ma = Euclid.magic * (a + border);
	var mb = Euclid.magic * (b + border);

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
	return fabric.within(this, 'sketch', view, p);
};

})();
