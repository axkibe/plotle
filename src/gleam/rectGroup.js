/*
| A group of rects.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_rectGroup',
		group : [ 'euclid_rect' ]
	};
}


var
	gleam_rectGroup;


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

prototype = gleam_rectGroup.prototype;


})( );
