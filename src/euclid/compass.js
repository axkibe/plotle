/*
| Directions on a compass.
*/


/*
| Export
*/
var
	euclid;

euclid = euclid || { };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var
	compass =
	euclid.compass =
		{ };


/*
| all 8 directions, clock wise, corners first
*/
compass.dir8CWCF = [
	'nw',
	'ne',
	'se',
	'sw',
	'n',
	'e',
	's',
	'w'
];


} )( );
