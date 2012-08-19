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
                    .-,--.         .
                     `|__/ ,-. ,-. |-
                     )| \  |-' |   |
                     `'  ` `-' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 A rectangle in a 2D plane.
 Extends the basic euclidian rect with some fabric features

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Euclid;


/*
| Capsule
*/
(function(){
'use strict';

if (typeof(window) === 'undefined')
	{ throw new Error('this code needs a browser'); }


/*
| Draws the rectangle.
*/
Euclid.Rect.prototype.sketch = function(fabric, border, twist, view)
{
	var wx = view.x(this.pnw);
	var ny = view.y(this.pnw);
	var ex = view.x(this.pse);
	var sy = view.y(this.pse);

	fabric.moveTo(wx + border, ny + border);
	fabric.lineTo(ex - border, ny + border);
	fabric.lineTo(ex - border, sy - border);
	fabric.lineTo(wx + border, sy - border);
	fabric.lineTo(wx + border, ny + border);
};


} ) ();
