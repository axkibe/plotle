/*
| Directions on a compass.
*/


var
	euclid_compass;


/*
| Capsule
*/
( function( ) {
'use strict';


euclid_compass = { };


/*
| all 8 directions, clock wise, corners first
*/
euclid_compass.dir8CWCF = [
	'nw',
	'ne',
	'se',
	'sw',
	'n',
	'e',
	's',
	'w'
];


if( CHECK )
{
	Object.freeze( euclid_compass.dir8CWCF );
}

} )( );
