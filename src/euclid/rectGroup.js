/*
| A group of rects.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_rectGroup',
		group : [ 'euclid_rect' ]
	};
}


var
	euclid_rectGroup;


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

prototype = euclid_rectGroup.prototype;


})( );
