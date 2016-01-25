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
	gruga_iconCheck,
	euclid_anchor_point,
	euclid_anchor_shape,
	euclid_anchor_shape_start,
	euclid_anchor_shape_line,
	gleam_color,
	gleam_facet;


/*
| Capsule
*/
( function( ) {
'use strict';
	

var
	pc;


pc = euclid_anchor_point.c;


gruga_iconCheck = { };


gruga_iconCheck.facet =
	gleam_facet.create(
		'fill', gleam_color.black
	);


gruga_iconCheck.shape =
	euclid_anchor_shape.create(
		'ray:init',
		[
			euclid_anchor_shape_start.create(
				'p', pc.add( -5, -3 )            // A
			),
			euclid_anchor_shape_line.create(
				'p', pc.add( 2, 5 )              // B
			),
			euclid_anchor_shape_line.create(
				'p', pc.add( 14, -12 )           // C
			),
			euclid_anchor_shape_line.create(
				'p', pc.add( 2, -1 )             // D
			),
			euclid_anchor_shape_line.create(
				'close', true                    // A
			)
		],
		'pc', pc
	);


if( FREEZE ) Object.freeze( gruga_iconCheck );


} )( );
