/*
| A list of stuff to display.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_ray',
		attributes :
		{
		},
		ray :
		// FIXME make a typemap
		[
			'gleam_glint_border',
			'gleam_glint_fill',
			'gleam_glint_mask',
			'gleam_glint_paint',
			'gleam_glint_text',
			'gleam_glint_ray',
			'gleam_glint_window'
		]
	};
}


var
	gleam_glint_ray;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}

prototype = gleam_glint_ray.prototype;


} )( );
