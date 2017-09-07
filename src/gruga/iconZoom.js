/*
| The zoom icon.
|
|       .----.
|     .'      '.
|    .          .
|    '          '
|    '          '
|    '         '
|     '.     .'
|     /  /'''
|    /  /
|   /  /
|   '.'
|
*/


var
	gleam_point,
	gleam_shape_line,
	gleam_shape_round,
	gleam_shape_start,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_shape,
	gleam_shapeRay,
	gruga_iconZoom;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	c;

gruga_iconZoom = { };


gruga_iconZoom.facet =
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


c = gleam_point.xy( 2, -3 );

gruga_iconZoom.shape =
	gleam_shapeRay.create(
		'list:init',
		[
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p(    c.add( -12.0, 12 ) ),
					gleam_shape_line.p(     c.add(  -7.5,  6 ) ),
					gleam_shape_round.p(    c.add(  -9.0,  0 ) ),
					gleam_shape_round.p(    c.add(   0.0, -9 ) ),
					gleam_shape_round.p(    c.add(   9.0,  0 ) ),
					gleam_shape_round.p(    c.add(   0.0,  9 ) ),
					gleam_shape_round.p(    c.add(  -5.0,  8 ) ),
					gleam_shape_line.p(     c.add(  -9.0, 13 ) ),
					gleam_shape_round.close( )
				],
				'pc', c,
				'nogrid', true
			),
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p(    c.add( -8.5,  0.0 ) ),
					gleam_shape_round.pCcw( c.add(  0.0,  8.5 ) ),
					gleam_shape_round.pCcw( c.add(  8.5,  0.0 ) ),
					gleam_shape_round.pCcw( c.add(  0.0, -8.5 ) ),
					gleam_shape_round.closeCcw( )
				],
				'pc', c,
				'nogrid', true
			)
		]
	);


if( FREEZE ) Object.freeze( gruga_iconZoom );


} )( );
