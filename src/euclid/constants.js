/*
| Constans for euclid.
*/


/*
| Exports
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var jools;


/*
| Capsule
*/
(function(){
'use strict';


var constants;

constants = euclid.constants = { };

/*
|'magic' number to approximate ellipses with beziers.
*/
constants.magic = 0.551784;


jools.immute( constants );


} )( );
