/*
| A testing environment for the gleam engine.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'testgleam_root',
		attributes :
		{
		},
		init : [ ]
	};
}


//var
//	testgleam_root;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}



/*
| Window.
*/
window.onload =
	function( )
{
	console.log( 'hi' );
};


} )( );
