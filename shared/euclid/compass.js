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
                   ,--.
                   | `-' ,-. ,-,-. ,-. ,-. ,-. ,-.
                   |   . | | | | | | | ,-| `-. `-.
                   `--'  `-' ' ' ' |-' `-^ `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                   '
 Directions on a compass.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
(function(){
'use strict';


/*
| Node imports
*/
if (typeof(window) === 'undefined')
{
	Jools = require('../jools');
}


/*
| Constructor.
*/
var Compass = Euclid.Compass = {};


/*
| all 8 directions, clock wise, corners first
*/
Compass.dir8CWCF = [
	'nw',
	'ne',
	'se',
	'sw',
	'n',
	'e',
	's',
	'w'
];


/*
| Returns the compass direction opposite of a direction.
*/
Compass.opposite = function(dir)
{
	switch (dir)
	{
		case 'n'  : return 's';
		case 'ne' : return 'sw';
		case 'e'  : return 'w';
		case 'se' : return 'nw';
		case 's'  : return 'n';
		case 'sw' : return 'ne';
		case 'w'  : return 'e';
		case 'nw' : return 'se';
		case 'c'  : return 'c';
		default   : throw new Error('unknown compass direction');
	}
};


/*
| Node export
*/
if (typeof(window) === 'undefined')
	{ module.exports = Compass; }

} ) ();
