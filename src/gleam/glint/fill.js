/*
| The fill of a shape.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_fill',
		attributes :
		{
			facet :
			{
				comment : 'the facet to draw the fill with',
				type : 'gleam_facet'
			},
			shape :
			{
				comment : 'the shape to draw',
				type :
					require( '../typemap-shape' )
					.concat( [ 'gleam_shapeList' ] )
			}
		}
	};
}


var
	gleam_glint_fill;


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

prototype = gleam_glint_fill.prototype;


} )( );
