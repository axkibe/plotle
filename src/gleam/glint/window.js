/*
| Bases it's child glints in a window.
|
| May do caching.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_window',
		attributes :
		{
			glint :
			{
				comment : 'the glints to draw in the window',
				type : 'gleam_glint_twig'
			},
			key :
			{
				comment : 'key in parent twig',
				type : 'string'
			},
			p :
			{
				comment : 'position to draw it at',
				type : 'euclid_point'
			},
			view :
			{
				comment : 'the view to draw it in',
				type : 'euclid_view'
			}
		},
		init : [ 'inherit' ]
	};
}


var
	gleam_glint_window;


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


var
	prototype;

prototype = gleam_glint_window.prototype;


} )( );
