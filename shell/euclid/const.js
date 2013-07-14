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
var Euclid;
Euclid = Euclid || { };


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
(function(){
'use strict';


var Const = Euclid.Const = { };

/*
|'magic' number to approximate ellipses with beziers.
*/
Const.magic = 0.551784;


Jools.immute(Const);


} ) ();
