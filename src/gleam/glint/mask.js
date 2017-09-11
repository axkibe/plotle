/*
| Masked glints.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_mask',
		attributes :
		{
			glint :
			{
				comment : 'the glints to draw',
				type : 'gleam_glint_list'
			},
			reverse :
			{
				comment : 'true if reversing mask',
				type : [ 'undefined', 'boolean' ]
			},
			shape :
			{
				comment : 'the shape(list) to mask to',
				type :
					require( '../typemap-shape' )
					.concat( [ 'gleam_shapeList' ] )
			}
		}
	};
}


var
	gleam_glint_mask;


/*
| Capsule
*/
( function( ) {
'use strict';


var prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}

prototype = gleam_glint_mask.prototype;


} )( );
