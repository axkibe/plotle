/*
| Meshcraft tree patterns.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Euclid,
	Jools,
	Meshverse
	Point;


/*
| Exports
*/
var
	MeshverseShell;
	meshverseShell;


/*
| Capsule
*/
( function( ) {
"use strict";


MeshverseShell =
	funcion( )
	{

	};


Jools.subclass(
	MeshverseShell,
	Meshverse
);


MeshverseShell.prototype.creators =
	Jools.immute( {
		'Point' :
			Point
	} );


meshverseShell =
	new MeshverseShell( );


} )( );

