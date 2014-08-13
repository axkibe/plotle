/*
|
| Constans for euclid.
|
| Authors: Axel Kittenberger
|
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


var Const =
	euclid.Const =
	{ };

/*
|'magic' number to approximate ellipses with beziers.
*/
Const.magic = 0.551784;


jools.immute( Const );


} )( );
