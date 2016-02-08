/*
| A container of stuff to display.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_container',
		twig :
		[
			'gleam_container',
			'gleam_container_window'
		]
	};
}


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


} )( );
