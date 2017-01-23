/*
| The "check" icon.
|
|                C
|              .*'
|             .*'
|            .*'
|    A.     .*'
|    '*.   .*'
|     '**D**'
|      '***'
|       'B'
*/


var
	gleam_color,
	gleam_facet,
	gleam_point,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_start,
	gruga_iconCheck;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	pc;


pc = gleam_point.xy( -2, 0 );


gruga_iconCheck = { };


gruga_iconCheck.facet =
	gleam_facet.create(
		'fill', gleam_color.black
	);


gruga_iconCheck.shape =
	gleam_shape.create(
		'ray:init',
		[
			gleam_shape_start.create(
				'p', pc.add( -5, -3 )            // A
			),
			gleam_shape_line.create(
				'p', pc.add( 2, 5 )              // B
			),
			gleam_shape_line.create(
				'p', pc.add( 14, -12 )           // C
			),
			gleam_shape_line.create(
				'p', pc.add( 2, -1 )             // D
			),
			gleam_shape_line.create(
				'close', true                    // A
			)
		],
		'pc', pc
	);


if( FREEZE ) Object.freeze( gruga_iconCheck );


} )( );
