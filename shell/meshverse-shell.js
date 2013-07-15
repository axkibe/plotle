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
	Meshverse;


/*
| Exports
*/
var
	MeshverseShell,
	meshverseShell;


/*
| Capsule
*/
( function( ) {
"use strict";


MeshverseShell =
	function( )
	{

	};


Jools.subclass(
	MeshverseShell,
	Meshverse
);


MeshverseShell.prototype.creators =
	Jools.immute( {
		'Point' :
			Euclid.Point
	} );


meshverseShell =
	new MeshverseShell( );


} )( );

