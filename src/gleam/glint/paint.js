/*
| Draws a shape in a display.
|
| This is first the fill then the border
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_paint',
		attributes :
		{
			facet :
			{
				comment : 'the facet to draw the shape with',
				type : 'gleam_facet'
			},
			shape :
			{
				comment : 'the shape to draw',
				type : require( '../../typemaps/shape' )
			},
			id :
			{
				comment : 'the unique glint id',
				type : [ 'undefined', 'string' ]
			}
		},
		init : [ ]
	};
}


var
	gleam_glint_paint,
	session_uid;


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

prototype = gleam_glint_paint.prototype;


/*
| Initialization.
*/
prototype._init =
	function( )
{
	if( !this.id )
	{
		this.id = session_uid( );
	}
};


} )( );
