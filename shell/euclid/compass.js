/*
|
| Directions on a compass.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Euclid;

Euclid =
	Euclid || { };


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


} )( );
