/*
| Directions on a compass.
|
| Authors: Axel Kittenberger
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
	Compass =
	euclid.Compass =
		{ };


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


} )( );
