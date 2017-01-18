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
	euclid_point,
	euclid_shape_start,
	euclid_shape_line,
	gleam_color,
	gleam_facet,
	gleam_shape,
	gruga_iconCheck;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	pc;


pc =
	euclid_point.create(
		'x', -2,
		'y', 0
	);


gruga_iconCheck = { };


gruga_iconCheck.facet =
	gleam_facet.create(
		'fill', gleam_color.black
	);


gruga_iconCheck.shape =
	gleam_shape.create(
		'ray:init',
		[
			euclid_shape_start.create(
				'p', pc.add( -5, -3 )            // A
			),
			euclid_shape_line.create(
				'p', pc.add( 2, 5 )              // B
			),
			euclid_shape_line.create(
				'p', pc.add( 14, -12 )           // C
			),
			euclid_shape_line.create(
				'p', pc.add( 2, -1 )             // D
			),
			euclid_shape_line.create(
				'close', true                    // A
			)
		],
		'pc', pc
	);


if( FREEZE ) Object.freeze( gruga_iconCheck );


} )( );
